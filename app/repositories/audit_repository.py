from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.audit import ActivityLog
from app.models.audit import StatusHistory


class ActivityLogRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, log: ActivityLog) -> ActivityLog:
        self.db.add(log)
        self.db.flush()
        return log

    def list_for_source(self, *, source_type: str, source_id: int) -> list[ActivityLog]:
        statement = (
            select(ActivityLog)
            .where(
                ActivityLog.source_type == source_type,
                ActivityLog.source_id == source_id,
                ActivityLog.is_deleted.is_(False),
            )
            .order_by(ActivityLog.id)
        )
        return list(self.db.execute(statement).scalars().all())


class AuditStatusHistoryRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, history: StatusHistory) -> StatusHistory:
        self.db.add(history)
        self.db.flush()
        return history
