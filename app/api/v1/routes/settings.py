from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_permission
from app.db.session import get_db
from app.models.auth import User
from app.schemas.settings import SettingsRead, SettingsUpdate
from app.services.settings_service import SettingsService


router = APIRouter()


@router.get("", response_model=SettingsRead)
def get_settings(
    _: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SettingsRead:
    return SettingsService(db).get_or_create()


@router.put("", response_model=SettingsRead)
def update_settings(
    payload: SettingsUpdate,
    _: User = Depends(require_permission("settings.update", allow_legacy_no_roles=False)),
    db: Session = Depends(get_db),
) -> SettingsRead:
    return SettingsService(db).update(payload)


@router.post("/logo", response_model=SettingsRead)
async def upload_logo(
    file: UploadFile = File(...),
    _: User = Depends(require_permission("settings.update", allow_legacy_no_roles=False)),
    db: Session = Depends(get_db),
) -> SettingsRead:
    return await SettingsService(db).save_logo(file)


@router.post("/favicon", response_model=SettingsRead)
async def upload_favicon(
    file: UploadFile = File(...),
    _: User = Depends(require_permission("settings.update", allow_legacy_no_roles=False)),
    db: Session = Depends(get_db),
) -> SettingsRead:
    return await SettingsService(db).save_favicon(file)
