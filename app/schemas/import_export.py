from typing import Any

from pydantic import BaseModel, Field


class ImportPreviewRow(BaseModel):
    row_number: int
    valid: bool
    data: dict[str, Any]
    errors: list[str] = []


class ImportPreviewResponse(BaseModel):
    module: str
    total_rows: int
    valid_rows: int
    invalid_rows: int
    rows: list[ImportPreviewRow]


class ImportResultResponse(BaseModel):
    module: str
    total_rows: int
    imported_rows: int
    failed_rows: int
    errors: list[ImportPreviewRow] = []


class ImportExportModuleInfo(BaseModel):
    key: str
    label: str
    headers: list[str]
    required_headers: list[str]
    sample_rows: list[dict[str, Any]]


class ImportErrorReportRequest(BaseModel):
    rows: list[ImportPreviewRow] = Field(default_factory=list)
