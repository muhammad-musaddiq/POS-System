from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings as app_settings
from app.models.settings import SystemSettings
from app.repositories.settings_repository import SettingsRepository
from app.schemas.settings import SettingsUpdate


ALLOWED_IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
FAVICON_IMAGE_TYPES = ALLOWED_IMAGE_TYPES | {"image/x-icon": ".ico", "image/vnd.microsoft.icon": ".ico"}


class SettingsService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.settings = SettingsRepository(db)

    def get_or_create(self) -> SystemSettings:
        settings = self.settings.get_active()
        if settings is not None:
            return settings

        settings = self.settings.create(SystemSettings())
        self.db.commit()
        self.db.refresh(settings)
        return settings

    def update(self, payload: SettingsUpdate) -> SystemSettings:
        settings = self.get_or_create()
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(settings, field, value)

        self.db.commit()
        self.db.refresh(settings)
        return settings

    async def save_logo(self, file: UploadFile) -> SystemSettings:
        file_url = await self._save_branding_asset(file, "logo", ALLOWED_IMAGE_TYPES)
        return self.update(SettingsUpdate(logo_url=file_url))

    async def save_favicon(self, file: UploadFile) -> SystemSettings:
        file_url = await self._save_branding_asset(file, "favicon", FAVICON_IMAGE_TYPES)
        return self.update(SettingsUpdate(favicon_url=file_url))

    async def _save_branding_asset(
        self,
        file: UploadFile,
        prefix: str,
        allowed_types: dict[str, str],
    ) -> str:
        if not file.filename:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail="File name is required")
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail="Unsupported image type")

        max_size = app_settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        content = await file.read(max_size + 1)
        if len(content) > max_size:
            raise HTTPException(
                status_code=status.HTTP_413_CONTENT_TOO_LARGE,
                detail=f"File cannot exceed {app_settings.MAX_UPLOAD_SIZE_MB} MB",
            )

        suffix = allowed_types[file.content_type]
        stored_name = f"{prefix}-{uuid4().hex}{suffix}"
        target_dir = Path(app_settings.UPLOAD_DIR).resolve() / "settings"
        target_dir.mkdir(parents=True, exist_ok=True)
        (target_dir / stored_name).write_bytes(content)
        return f"/uploads/settings/{stored_name}"
