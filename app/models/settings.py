from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import BaseModel


class SystemSettings(BaseModel):
    __tablename__ = "system_settings"

    app_name: Mapped[str] = mapped_column(String(150), default="POS System", nullable=False)
    primary_color: Mapped[str] = mapped_column(String(20), default="#0F766E", nullable=False)
    secondary_color: Mapped[str] = mapped_column(String(20), default="#334155", nullable=False)
    accent_color: Mapped[str] = mapped_column(String(20), default="#047857", nullable=False)
    sidebar_color: Mapped[str] = mapped_column(String(20), default="#0F172A", nullable=False)
    header_color: Mapped[str] = mapped_column(String(20), default="#FFFFFF", nullable=False)
    background_color: Mapped[str] = mapped_column(String(20), default="#F8FAFC", nullable=False)
    text_color: Mapped[str] = mapped_column(String(20), default="#0F172A", nullable=False)
    success_color: Mapped[str] = mapped_column(String(20), default="#047857", nullable=False)
    warning_color: Mapped[str] = mapped_column(String(20), default="#B45309", nullable=False)
    error_color: Mapped[str] = mapped_column(String(20), default="#B91C1C", nullable=False)
    info_color: Mapped[str] = mapped_column(String(20), default="#0369A1", nullable=False)
    positive_amount_color: Mapped[str] = mapped_column(String(20), default="#047857", nullable=False)
    negative_amount_color: Mapped[str] = mapped_column(String(20), default="#B91C1C", nullable=False)
    warning_amount_color: Mapped[str] = mapped_column(String(20), default="#B45309", nullable=False)
    neutral_amount_color: Mapped[str] = mapped_column(String(20), default="#64748B", nullable=False)
    total_amount_color: Mapped[str] = mapped_column(String(20), default="#0F766E", nullable=False)
    border_radius: Mapped[str] = mapped_column(String(30), default="medium", nullable=False)
    layout_spacing: Mapped[str] = mapped_column(String(30), default="comfortable", nullable=False)
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    favicon_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    white_label_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    company_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    company_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    company_phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    company_address: Mapped[str | None] = mapped_column(String(500), nullable=True)
