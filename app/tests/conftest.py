import os
from pathlib import Path
# No imports from the host application. Unit tests use an isolated in-memory database.
os.environ['DATABASE_URL'] = 'sqlite://'
os.environ['ADMIN_EMAIL'] = 'admin@example.com'
os.environ['ADMIN_PASSWORD'] = 'test-password-123'
os.environ['UPLOAD_DIR'] = str(Path(__file__).resolve().parents[2] / '.verification/test-uploads')
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.db.base import Base
from app.db.session import get_db
from app.main import create_app
from app.scripts.seed_all import seed

@pytest.fixture()
def session_factory():
    engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine)
    with factory() as db:
        seed(db); db.commit()
    yield factory
    Base.metadata.drop_all(engine)
    engine.dispose()

@pytest.fixture()
def client(session_factory):
    app = create_app()
    def db_override():
        with session_factory() as db:
            yield db
    app.dependency_overrides[get_db] = db_override
    with TestClient(app) as client:
        yield client

@pytest.fixture()
def headers(client):
    response = client.post('/api/v1/auth/login', json={'email':'admin@example.com', 'password':'test-password-123'})
    assert response.status_code == 200, response.text
    return {'Authorization':f"Bearer {response.json()['access_token']}"}
