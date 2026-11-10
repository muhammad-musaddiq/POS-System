import asyncio
import io
from fastapi import UploadFile
from sqlalchemy import select, func
from app.models.auth import Role
from app.models.audit import ActivityLog, StatusHistory
from app.services.audit_service import AuditService
from app.services.import_export import definitions
from app.services.import_export.service import ImportExportService

def test_generic_import_preview_import_export_and_duplicates(session_factory, monkeypatch):
    # Use a harmless test-only role definition; the shipped registry stays empty.
    definition = definitions.ImportExportDefinition(
        key='test-records', label='Test records', permission_module='test_records', source_type='TEST', model=Role,
        fields=(definitions.ImportField('name','name',required=True,unique=True,max_length=100),
                definitions.ImportField('status','status',field_type='status',choices=('ACTIVE','INACTIVE'))),
        sample_rows=(),
    )
    monkeypatch.setattr(definitions, 'get_definitions', lambda: {'test-records':definition})
    def upload():
        return UploadFile(filename='test.csv', file=io.BytesIO(b'name,status\nMember,ACTIVE\nMember,ACTIVE\n,ACTIVE\n'))
    with session_factory() as db:
        service=ImportExportService(db)
        preview=asyncio.run(service.preview('test-records',upload()))
        assert preview.valid_rows==1 and preview.invalid_rows==2
        result=asyncio.run(service.import_file('test-records',upload()))
        assert result.imported_rows==1 and result.failed_rows==2
        content,media,filename=service.export_rows('test-records',format_value='csv',filters={'search':'Member'})
        assert b'Member' in content and media=='text/csv'
        assert db.scalar(select(func.count()).select_from(ActivityLog))==2
        assert asyncio.run(service.preview('test-records',upload())).valid_rows==0

def test_status_history_and_activity_services(session_factory):
    with session_factory() as db:
        AuditService(db).log_status_change(source_type='EXAMPLE',source_id=1,old_status=None,new_status='ACTIVE')
        db.commit()
        assert db.scalar(select(StatusHistory)).new_status=='ACTIVE'
        assert db.scalar(select(ActivityLog)).action=='STATUS_CHANGE'
