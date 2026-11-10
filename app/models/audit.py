from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import BaseModel


class ActivityLog(BaseModel):
    __tablename__ = "activity_logs"

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
        nullable=True,
    )
    action: Mapped[str] = mapped_column(String(30), index=True, nullable=False)
    source_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    source_id: Mapped[int] = mapped_column(index=True, nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)


class StatusHistory(BaseModel):
    __tablename__ = "status_history"

    source_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    source_id: Mapped[int] = mapped_column(index=True, nullable=False)
    old_status: Mapped[str | None] = mapped_column(String(30), nullable=True)
    new_status: Mapped[str] = mapped_column(String(30), nullable=False)
    changed_by: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    remarks: Mapped[str | None] = mapped_column(String(500), nullable=True)
