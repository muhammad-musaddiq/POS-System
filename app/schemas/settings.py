from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


SpacingValue = Literal["compact", "comfortable", "spacious"]
BorderRadiusValue = Literal["none", "small", "medium", "large"]


def validate_hex_color(value: str) -> str:
    if len(value) != 7 or not value.startswith("#"):
        raise ValueError("Color must be a hex value like #DC2626")
    try:
        int(value[1:], 16)
    except ValueError as exc:
        raise ValueError("Color must be a valid hex value") from exc
    return value.upper()


class SettingsBase(BaseModel):
    app_name: str = Field(default="POS System", min_length=1, max_length=150)
    primary_color: str = "#0F766E"
    secondary_color: str = "#334155"
    accent_color: str = "#047857"
    sidebar_color: str = "#0F172A"
    header_color: str = "#FFFFFF"
    background_color: str = "#F8FAFC"
    text_color: str = "#0F172A"
    success_color: str = "#047857"
    warning_color: str = "#B45309"
    error_color: str = "#B91C1C"
    info_color: str = "#0369A1"
    positive_amount_color: str = "#047857"
    negative_amount_color: str = "#B91C1C"
    warning_amount_color: str = "#B45309"
    neutral_amount_color: str = "#64748B"
    total_amount_color: str = "#0F766E"
    border_radius: BorderRadiusValue = "medium"
    layout_spacing: SpacingValue = "comfortable"
    logo_url: str | None = Field(default=None, max_length=500)
    favicon_url: str | None = Field(default=None, max_length=500)
    white_label_enabled: bool = False
    company_name: str | None = Field(default=None, max_length=200)
    company_email: EmailStr | None = None
    company_phone: str | None = Field(default=None, max_length=50)
    company_address: str | None = Field(default=None, max_length=500)

    @field_validator(
        "primary_color",
        "secondary_color",
        "accent_color",
        "sidebar_color",
        "header_color",
        "background_color",
        "text_color",
        "success_color",
        "warning_color",
        "error_color",
        "info_color",
        "positive_amount_color",
        "negative_amount_color",
        "warning_amount_color",
        "neutral_amount_color",
        "total_amount_color",
    )
    @classmethod
    def validate_colors(cls, value: str) -> str:
        return validate_hex_color(value)


class SettingsUpdate(BaseModel):
    app_name: str | None = Field(default=None, min_length=1, max_length=150)
    primary_color: str | None = None
    secondary_color: str | None = None
    accent_color: str | None = None
    sidebar_color: str | None = None
    header_color: str | None = None
    background_color: str | None = None
    text_color: str | None = None
    success_color: str | None = None
    warning_color: str | None = None
    error_color: str | None = None
    info_color: str | None = None
    positive_amount_color: str | None = None
    negative_amount_color: str | None = None
    warning_amount_color: str | None = None
    neutral_amount_color: str | None = None
    total_amount_color: str | None = None
    border_radius: BorderRadiusValue | None = None
    layout_spacing: SpacingValue | None = None
    logo_url: str | None = Field(default=None, max_length=500)
    favicon_url: str | None = Field(default=None, max_length=500)
    white_label_enabled: bool | None = None
    company_name: str | None = Field(default=None, max_length=200)
    company_email: EmailStr | None = None
    company_phone: str | None = Field(default=None, max_length=50)
    company_address: str | None = Field(default=None, max_length=500)

    @field_validator(
        "primary_color",
        "secondary_color",
        "accent_color",
        "sidebar_color",
        "header_color",
        "background_color",
        "text_color",
        "success_color",
        "warning_color",
        "error_color",
        "info_color",
        "positive_amount_color",
        "negative_amount_color",
        "warning_amount_color",
        "neutral_amount_color",
        "total_amount_color",
    )
    @classmethod
    def validate_optional_colors(cls, value: str | None) -> str | None:
        return validate_hex_color(value) if value is not None else value


class SettingsRead(SettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SettingsAssetRead(BaseModel):
    file_url: str
