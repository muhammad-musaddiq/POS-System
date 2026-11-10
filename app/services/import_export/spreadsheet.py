from __future__ import annotations

import csv
import io
from collections.abc import Iterable
from typing import Any

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings


ALLOWED_CONTENT_TYPES = {
    "csv": {"text/csv", "application/csv", "application/vnd.ms-excel", "text/plain"},
    "xlsx": {"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
}


def normalize_format(format_value: str | None, filename: str | None = None) -> str:
    candidate = (format_value or "").strip().lower()
    if not candidate and filename:
        candidate = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if candidate == "excel":
        candidate = "xlsx"

    allowed = {value.strip().lower() for value in settings.ALLOWED_IMPORT_TYPES.split(",") if value.strip()}
    if candidate not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{candidate or 'unknown'}'. Allowed formats: {', '.join(sorted(allowed))}",
        )
    return candidate


async def read_upload(upload_file: UploadFile) -> tuple[str, list[dict[str, Any]], list[str]]:
    format_value = normalize_format(None, upload_file.filename)
    content = await upload_file.read()
    max_size = settings.MAX_IMPORT_FILE_SIZE_MB * 1024 * 1024
    if len(content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Import file is larger than {settings.MAX_IMPORT_FILE_SIZE_MB} MB",
        )

    if upload_file.content_type:
        allowed_content_types = ALLOWED_CONTENT_TYPES.get(format_value, set())
        if allowed_content_types and upload_file.content_type not in allowed_content_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid content type '{upload_file.content_type}' for {format_value} import",
            )

    try:
        if format_value == "csv":
            rows, headers = _read_csv(content)
        else:
            rows, headers = _read_xlsx(content)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not read {format_value} file. The file may be corrupted or use an invalid format.",
        ) from exc

    if len(rows) > settings.MAX_IMPORT_ROWS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Import file has {len(rows)} rows. Maximum allowed rows: {settings.MAX_IMPORT_ROWS}",
        )
    return format_value, rows, headers


def write_rows(format_value: str, headers: list[str], rows: Iterable[dict[str, Any]]) -> tuple[bytes, str]:
    normalized_format = normalize_format(format_value)
    materialized_rows = list(rows)
    if normalized_format == "csv":
        buffer = io.StringIO()
        writer = csv.DictWriter(buffer, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        for row in materialized_rows:
            writer.writerow({header: _stringify(row.get(header)) for header in headers})
        return buffer.getvalue().encode("utf-8-sig"), "text/csv"

    from openpyxl import Workbook

    workbook = Workbook()
    sheet = workbook.active
    sheet.append(headers)
    for row in materialized_rows:
        sheet.append([row.get(header) for header in headers])
    output = io.BytesIO()
    workbook.save(output)
    return (
        output.getvalue(),
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


def _read_csv(content: bytes) -> tuple[list[dict[str, Any]], list[str]]:
    text = content.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(text))
    headers = [str(header).strip() for header in (reader.fieldnames or []) if header]
    rows = [_normalize_row(row) for row in reader]
    return _drop_empty_rows(rows), headers


def _read_xlsx(content: bytes) -> tuple[list[dict[str, Any]], list[str]]:
    from openpyxl import load_workbook

    workbook = load_workbook(io.BytesIO(content), read_only=True, data_only=True)
    sheet = workbook.active
    raw_rows = list(sheet.iter_rows(values_only=True))
    if not raw_rows:
        return [], []
    headers = [str(value).strip() for value in raw_rows[0] if value is not None and str(value).strip()]
    rows: list[dict[str, Any]] = []
    for values in raw_rows[1:]:
        row = {headers[index]: values[index] if index < len(values) else None for index in range(len(headers))}
        rows.append(_normalize_row(row))
    return _drop_empty_rows(rows), headers


def _normalize_row(row: dict[str, Any]) -> dict[str, Any]:
    normalized: dict[str, Any] = {}
    for key, value in row.items():
        if key is None:
            continue
        header = str(key).strip()
        normalized[header] = value.strip() if isinstance(value, str) else value
    return normalized


def _drop_empty_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [
        row
        for row in rows
        if any(value is not None and str(value).strip() != "" for value in row.values())
    ]


def _stringify(value: Any) -> str:
    if value is None:
        return ""
    return str(value)
