from sqlalchemy.orm import Session

from app.models.audit import ActivityLog
from app.models.audit import StatusHistory
from app.repositories.audit_repository import ActivityLogRepository, AuditStatusHistoryRepository


class AuditService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.activities = ActivityLogRepository(db)
        self.status_history = AuditStatusHistoryRepository(db)

    def log_activity(
        self,
        *,
        action: str,
        source_type: str,
        source_id: int,
        description: str,
        user_id: int | None = None,
        use_session_user: bool = True,
    ) -> ActivityLog:
        return self.activities.create(
            ActivityLog(
                user_id=self._user_id(user_id) if use_session_user else user_id,
                action=action,
                source_type=source_type,
                source_id=source_id,
                description=description,
            )
        )

    def log_status_change(
        self,
        *,
        source_type: str,
        source_id: int,
        old_status: str | None,
        new_status: str,
        remarks: str | None = None,
        user_id: int | None = None,
        description: str | None = None,
        use_session_user: bool = True,
    ) -> StatusHistory:
        changed_by = self._user_id(user_id) if use_session_user else user_id
        history = self.status_history.create(
            StatusHistory(
                source_type=source_type,
                source_id=source_id,
                old_status=old_status,
                new_status=new_status,
                changed_by=changed_by,
                remarks=remarks,
            )
        )
        self.log_activity(
            action="STATUS_CHANGE",
            source_type=source_type,
            source_id=source_id,
            user_id=changed_by,
            use_session_user=False,
            description=description or f"Status changed from {old_status or 'NONE'} to {new_status}",
        )
        return history

    def _user_id(self, user_id: int | None) -> int | None:
        if user_id is not None:
            return user_id
        value = self.db.info.get("current_user_id")
        return int(value) if value is not None else None
