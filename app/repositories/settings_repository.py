from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.settings import SystemSettings


class SettingsRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_active(self) -> SystemSettings | None:
        statement = (
            select(SystemSettings)
            .where(SystemSettings.is_deleted.is_(False))
            .order_by(SystemSettings.id.asc())
            .limit(1)
        )
        return self.db.execute(statement).scalar_one_or_none()

    def create(self, settings: SystemSettings) -> SystemSettings:
        self.db.add(settings)
        self.db.flush()
        self.db.refresh(settings)
        return settings
