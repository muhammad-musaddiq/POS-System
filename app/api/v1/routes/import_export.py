from typing import Any, Literal

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.auth import User
from app.schemas.import_export import (
    ImportErrorReportRequest,
    ImportExportModuleInfo,
    ImportPreviewResponse,
    ImportResultResponse,
)
from app.services.import_export import ImportExportService

router = APIRouter()


def _ensure_permission(current_user: User, permission_code: str) -> None:
    active_roles = [
        role for role in current_user.roles if not role.is_deleted and role.status == "ACTIVE"
    ]
    permissions = {
        permission.code
        for role in active_roles
        for permission in role.permissions
        if not permission.is_deleted and permission.status == "ACTIVE"
    }
    if permission_code not in permissions:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )


def _download_response(content: bytes, media_type: str, filename: str) -> Response:
    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/modules", response_model=list[ImportExportModuleInfo])
def list_import_export_modules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ImportExportModuleInfo]:
    service = ImportExportService(db)
    modules: list[ImportExportModuleInfo] = []
    for definition in service.supported_modules():
        try:
            _ensure_permission(current_user, f"{definition.permission_module}.read")
        except HTTPException:
            continue
        modules.append(
            ImportExportModuleInfo(
                key=definition.key,
                label=definition.label,
                headers=definition.headers,
                required_headers=definition.required_headers,
                sample_rows=list(definition.sample_rows),
            )
        )
    return modules


@router.get("/{module_key}/sample")
def download_sample(
    module_key: str,
    format: Literal["csv", "xlsx"] = "xlsx",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    service = ImportExportService(db)
    definition = service.module_info(module_key)
    _ensure_permission(current_user, f"{definition.permission_module}.read")
    content, media_type, filename = service.sample_file(module_key, format_value=format)
    return _download_response(content, media_type, filename)


@router.get("/{module_key}/export")
def export_module(
    module_key: str,
    format: Literal["csv", "xlsx"] = "xlsx",
    search: str | None = None,
    status: str | None = None,
    ids: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    service = ImportExportService(db)
    definition = service.module_info(module_key)
    _ensure_permission(current_user, f"{definition.permission_module}.export")
    filters: dict[str, Any] = {
        "search": search,
        "status": status,
        "ids": ids,
    }
    content, media_type, filename = service.export_rows(
        module_key,
        format_value=format,
        filters={key: value for key, value in filters.items() if value is not None},
        user_id=current_user.id,
    )
    return _download_response(content, media_type, filename)


@router.post("/{module_key}/import-preview", response_model=ImportPreviewResponse)
async def import_preview(
    module_key: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ImportPreviewResponse:
    service = ImportExportService(db)
    definition = service.module_info(module_key)
    _ensure_permission(current_user, f"{definition.permission_module}.create")
    return await service.preview(module_key, file)


@router.post("/{module_key}/import", response_model=ImportResultResponse)
async def import_module(
    module_key: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ImportResultResponse:
    service = ImportExportService(db)
    definition = service.module_info(module_key)
    _ensure_permission(current_user, f"{definition.permission_module}.create")
    return await service.import_file(module_key, file, user_id=current_user.id)


@router.post("/{module_key}/error-report")
def import_error_report(
    module_key: str,
    payload: ImportErrorReportRequest,
    format: Literal["csv", "xlsx"] = "xlsx",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    service = ImportExportService(db)
    definition = service.module_info(module_key)
    _ensure_permission(current_user, f"{definition.permission_module}.create")
    content, media_type, filename = service.error_report(module_key, payload.rows, format_value=format)
    return _download_response(content, media_type, filename)
