from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "POS System"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: Literal["local", "development", "staging", "production"] = "local"
    DEBUG: bool = False

    DATABASE_URL: str = Field(
        default="postgresql+psycopg://postgres:postgres@localhost:5432/pos_system"
    )

    SECRET_KEY: str = "change-this-secret-key"
    ALGORITHM: str = "HS256"
    ADMIN_EMAIL: str = ""
    ADMIN_PASSWORD: str = ""
    ADMIN_NAME: str = "Administrator"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = Field(default=10, ge=1, le=100)
    MAX_IMPORT_ROWS: int = Field(default=1000, ge=1, le=100000)
    MAX_IMPORT_FILE_SIZE_MB: int = Field(default=10, ge=1, le=100)
    ALLOWED_IMPORT_TYPES: str = "xlsx,csv"

    model_config = SettingsConfigDict(env_file=Path(__file__).resolve().parents[2] / ".env", env_file_encoding="utf-8", extra="ignore")

    @model_validator(mode="after")
    def validate_deployment(self):
        if self.ENVIRONMENT in {"staging", "production"} and (len(self.SECRET_KEY) < 32 or self.SECRET_KEY in {"change-this-secret-key", "replace-with-a-random-secret"}):
            raise ValueError("Set SECRET_KEY to a unique random secret of at least 32 characters")
        return self

    @field_validator("UPLOAD_DIR")
    @classmethod
    def resolve_upload_dir(cls, value: str) -> str:
        path = Path(value)
        return str(path if path.is_absolute() else Path(__file__).resolve().parents[2] / path)

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug_flag(cls, value: object) -> object:
        if isinstance(value, str):
            normalized_value = value.strip().lower()
            if normalized_value in {"debug", "development", "dev"}:
                return True
            if normalized_value in {"release", "production", "prod"}:
                return False
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
