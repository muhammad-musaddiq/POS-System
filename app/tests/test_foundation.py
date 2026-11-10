import io
from sqlalchemy import select, func
from app.models.auth import User, Role, Permission
from app.models.settings import SystemSettings
from app.core.security import get_password_hash
from app.scripts.seed_all import seed

def test_health_and_openapi(client):
    assert client.get('/api/v1/health').json()['status'] == 'ok'
    assert client.get('/docs').status_code == 200
    paths = client.get('/api/v1/openapi.json').json()['paths']
    assert '/api/v1/users' in paths
    assert not any('/inquiries' in path or '/inventory' in path for path in paths)

def test_seed_is_idempotent_and_preserves_credentials(session_factory):
    with session_factory() as db:
        user = db.scalar(select(User))
        original = user.hashed_password
        seed(db); db.commit(); seed(db); db.commit()
        assert db.scalar(select(func.count()).select_from(User)) == 1
        assert db.scalar(select(func.count()).select_from(Role)) == 3
        assert db.scalar(select(func.count()).select_from(Permission)) == 11
        assert db.scalar(select(func.count()).select_from(SystemSettings)) == 1
        assert user.hashed_password == original

def test_login_refresh_and_invalid_tokens(client, headers):
    assert client.get('/api/v1/auth/me', headers=headers).status_code == 200
    assert client.get('/api/v1/auth/me').status_code == 401
    assert client.get('/api/v1/auth/me', headers={'Authorization':'Bearer invalid'}).status_code == 401
    response = client.post('/api/v1/auth/login', json={'email':'admin@example.com','password':'test-password-123'}).json()
    assert client.post('/api/v1/auth/refresh', json={'refresh_token':response['refresh_token']}).status_code == 200
    assert client.post('/api/v1/auth/refresh', json={'refresh_token':response['access_token']}).status_code == 401
    assert client.post('/api/v1/auth/login', json={'email':'admin@example.com','password':'wrong'}).status_code == 401

def test_user_and_role_crud(client, headers):
    permissions = client.get('/api/v1/permissions', headers=headers).json()
    read_id = next(p['id'] for p in permissions if p['code']=='settings.read')
    role = client.post('/api/v1/roles', headers=headers, json={'name':'Member','permission_ids':[read_id]})
    assert role.status_code == 201, role.text
    role_id = role.json()['id']
    assert client.put(f'/api/v1/roles/{role_id}',headers=headers,json={'description':'Reusable role'}).status_code == 200
    user = client.post('/api/v1/users',headers=headers,json={'name':'Member','email':'member@example.com','password':'member-password','role_id':role_id})
    assert user.status_code == 201, user.text
    uid = user.json()['id']
    assert 'hashed_password' not in user.json()
    assert client.get(f'/api/v1/users/{uid}',headers=headers).status_code == 200
    assert client.put(f'/api/v1/users/{uid}',headers=headers,json={'name':'Updated member'}).json()['name']=='Updated member'
    assert client.patch(f'/api/v1/users/{uid}/password',headers=headers,json={'password':'changed-password'}).status_code==200
    assert client.delete(f'/api/v1/roles/{role_id}',headers=headers).status_code==409
    assert client.delete(f'/api/v1/users/{uid}',headers=headers).status_code==204
    assert client.get(f'/api/v1/users/{uid}',headers=headers).status_code==404
    # Soft-deleted users no longer block deletion of a custom role.
    assert client.delete(f'/api/v1/roles/{role_id}',headers=headers).status_code==204

def test_no_role_or_viewer_cannot_manage_access(client, session_factory):
    with session_factory() as db:
        viewer = db.scalar(select(Role).where(Role.name=='Viewer'))
        for email,roles in [('viewer@example.com',[viewer]),('unassigned@example.com',[])]:
            db.add(User(full_name='Test',email=email,hashed_password=get_password_hash('test-password'),roles=roles,status='ACTIVE'))
        db.commit()
    for email in ['viewer@example.com','unassigned@example.com']:
        token=client.post('/api/v1/auth/login',json={'email':email,'password':'test-password'}).json()['access_token']
        auth={'Authorization':f'Bearer {token}'}
        assert client.get('/api/v1/users',headers=auth).status_code==403
        assert client.put('/api/v1/settings',headers=auth,json={'app_name':'Forbidden'}).status_code==403

def test_settings_upload_and_validation(client,headers):
    assert client.get('/api/v1/settings',headers=headers).status_code==200
    assert client.put('/api/v1/settings',headers=headers,json={'app_name':'My application'}).json()['app_name']=='My application'
    assert client.post('/api/v1/settings/logo',headers=headers,files={'file':('image.png',b'png-content','image/png')}).status_code==200
    assert client.post('/api/v1/settings/logo',headers=headers,files={'file':('file.txt',b'text','text/plain')}).status_code==422
    response=client.post('/api/v1/users',headers=headers,json={'name':'Bad','email':'invalid','password':'short','role_id':1})
    assert response.status_code==422
    assert all('input' not in error for error in response.json()['detail'])

def test_import_registry_has_no_domain_modules(client,headers):
    assert client.get('/api/v1/import-export/modules',headers=headers).json()==[]
    assert client.get('/api/v1/import-export/missing/sample',headers=headers).status_code==404
    assert client.get('/api/v1/import-export/modules').status_code==401
