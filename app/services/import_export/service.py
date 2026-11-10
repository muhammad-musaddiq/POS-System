from __future__ import annotations

import re
from decimal import Decimal, InvalidOperation
from typing import Any

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.schemas.import_export import ImportPreviewResponse, ImportPreviewRow, ImportResultResponse
from app.services.audit_service import AuditService
from app.services.import_export.definitions import (
    ImportExportDefinition,
    ImportField,
    get_definition,
    get_definitions,
    resolve_export_value,
)
from app.services.import_export.spreadsheet import read_upload, write_rows


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PHONE_RE = re.compile(r"^[0-9+\-\s()]{7,30}$")


class ImportExportService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def module_info(self, module_key: str) -> ImportExportDefinition:
        return self._definition(module_key)

    def supported_modules(self) -> list[ImportExportDefinition]:
        return list(get_definitions().values())

    async def preview(self, module_key: str, file: UploadFile) -> ImportPreviewResponse:
        definition = self._definition(module_key)
        _, rows, headers = await read_upload(file)
        return self._preview_rows(definition, rows, headers)

    async def import_file(
        self,
        module_key: str,
        file: UploadFile,
        *,
        user_id: int | None = None,
    ) -> ImportResultResponse:
        definition = self._definition(module_key)
        _, rows, headers = await read_upload(file)
        preview = self._preview_rows(definition, rows, headers)
        valid_rows = [row for row in preview.rows if row.valid]
        errors = [row for row in preview.rows if not row.valid]

        created_count = 0
        try:
            for row in valid_rows:
                self.db.add(definition.model(**row.data))
                created_count += 1
            self.db.flush()
            AuditService(self.db).log_activity(
                action="IMPORT",
                source_type=definition.source_type,
                source_id=0,
                user_id=user_id,
                use_session_user=False,
                description=(
                    f"Imported {created_count} {definition.label.lower()} rows; "
                    f"{len(errors)} rows failed validation"
                ),
            )
            self.db.commit()
        except SQLAlchemyError as exc:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Import failed and was rolled back. Check for duplicate or invalid database values.",
            ) from exc

        return ImportResultResponse(
            module=definition.key,
            total_rows=preview.total_rows,
            imported_rows=created_count,
            failed_rows=len(errors),
            errors=errors,
        )

    def export_rows(
        self,
        module_key: str,
        *,
        format_value: str,
        filters: dict[str, Any],
        user_id: int | None = None,
    ) -> tuple[bytes, str, str]:
        definition = self._definition(module_key)
        query = self._filtered_query(definition, filters)
        rows = [self._export_object(definition, obj) for obj in query.all()]
        content, media_type = write_rows(format_value, definition.headers, rows)
        AuditService(self.db).log_activity(
            action="EXPORT",
            source_type=definition.source_type,
            source_id=0,
            user_id=user_id,
            use_session_user=False,
            description=f"Exported {len(rows)} {definition.label.lower()} rows",
        )
        self.db.commit()
        extension = "xlsx" if format_value == "xlsx" else "csv"
        return content, media_type, f"{definition.key}-export.{extension}"

    def sample_file(self, module_key: str, *, format_value: str) -> tuple[bytes, str, str]:
        definition = self._definition(module_key)
        content, media_type = write_rows(format_value, definition.headers, definition.sample_rows)
        extension = "xlsx" if format_value == "xlsx" else "csv"
        return content, media_type, f"{definition.key}-sample.{extension}"

    def error_report(
        self,
        module_key: str,
        rows: list[ImportPreviewRow],
        *,
        format_value: str,
    ) -> tuple[bytes, str, str]:
        definition = self._definition(module_key)
        headers = ["row_number", "errors", *definition.headers]
        report_rows = [
            {
                "row_number": row.row_number,
                "errors": "; ".join(row.errors),
                **row.data,
            }
            for row in rows
            if row.errors
        ]
        content, media_type = write_rows(format_value, headers, report_rows)
        extension = "xlsx" if format_value == "xlsx" else "csv"
        return content, media_type, f"{definition.key}-import-errors.{extension}"

    def _preview_rows(
        self,
        definition: ImportExportDefinition,
        rows: list[dict[str, Any]],
        headers: list[str],
    ) -> ImportPreviewResponse:
        header_errors = self._header_errors(definition, headers)
        seen: dict[tuple[Any, ...], int] = {}
        preview_rows: list[ImportPreviewRow] = []
        for index, raw_row in enumerate(rows, start=2):
            converted, row_errors = self._validate_row(definition, raw_row)
            errors = [*header_errors, *row_errors]
            duplicate_key = self._file_duplicate_key(definition, converted)
            if duplicate_key is not None:
                first_row = seen.get(duplicate_key)
                if first_row is not None:
                    errors.append(f"Duplicate row in file. First occurrence is row {first_row}.")
                else:
                    seen[duplicate_key] = index
            preview_rows.append(
                ImportPreviewRow(
                    row_number=index,
                    valid=not errors,
                    data=converted,
                    errors=errors,
                )
            )

        return ImportPreviewResponse(
            module=definition.key,
            total_rows=len(preview_rows),
            valid_rows=sum(1 for row in preview_rows if row.valid),
            invalid_rows=sum(1 for row in preview_rows if not row.valid),
            rows=preview_rows,
        )

    def _validate_row(
        self,
        definition: ImportExportDefinition,
        raw_row: dict[str, Any],
    ) -> tuple[dict[str, Any], list[str]]:
        converted: dict[str, Any] = {}
        errors: list[str] = []
        for field in definition.fields:
            raw_value = raw_row.get(field.header)
            if self._is_blank(raw_value):
                if field.required:
                    errors.append(f"{field.header} is required.")
                elif field.attr == "status":
                    converted[field.attr] = definition.default_status
                elif field.field_type == "decimal":
                    converted[field.attr] = Decimal("0")
                elif field.field_type == "bool":
                    converted[field.attr] = False
                else:
                    converted[field.attr] = None
                continue

            value = self._convert_value(field, raw_value, errors)
            if field.lookup_model is not None and value is not None:
                value = self._resolve_lookup(field, value, errors)
            converted[field.attr] = value

        self._validate_database_duplicate(definition, converted, errors)
        return converted, errors

    def _convert_value(self, field: ImportField, raw_value: Any, errors: list[str]) -> Any:
        value = raw_value.strip() if isinstance(raw_value, str) else raw_value
        if field.field_type == "email":
            text = str(value)
            if not EMAIL_RE.match(text):
                errors.append(f"{field.header} must be a valid email address.")
            return text
        if field.field_type == "phone":
            text = str(value)
            if not PHONE_RE.match(text):
                errors.append(f"{field.header} must be a valid phone number.")
            return text
        if field.field_type == "decimal":
            try:
                decimal_value = Decimal(str(value))
            except (InvalidOperation, ValueError):
                errors.append(f"{field.header} must be a valid number.")
                return Decimal("0")
            if decimal_value < 0:
                errors.append(f"{field.header} cannot be negative.")
            return decimal_value
        if field.field_type == "int":
            try:
                return int(value)
            except (TypeError, ValueError):
                errors.append(f"{field.header} must be a valid integer.")
                return None
        if field.field_type == "bool":
            normalized = str(value).strip().lower()
            if normalized in {"true", "1", "yes", "y"}:
                return True
            if normalized in {"false", "0", "no", "n"}:
                return False
            errors.append(f"{field.header} must be true or false.")
            return False
        if field.field_type == "status":
            text = str(value).strip().upper()
            if field.choices and text not in field.choices:
                errors.append(f"{field.header} must be one of: {', '.join(field.choices)}.")
            return text

        text = str(value).strip()
        if field.max_length is not None and len(text) > field.max_length:
            errors.append(f"{field.header} cannot exceed {field.max_length} characters.")
        return text

    def _resolve_lookup(self, field: ImportField, value: Any, errors: list[str]) -> int | None:
        model = field.lookup_model
        lookup_field = field.lookup_field or "id"
        query = self.db.query(model).filter(
            getattr(model, lookup_field) == value,
            model.is_deleted.is_(False),
        )
        record = query.first()
        if record is None:
            label = field.lookup_display or field.header
            errors.append(f"{label} '{value}' was not found.")
            return None
        return record.id

    def _validate_database_duplicate(
        self,
        definition: ImportExportDefinition,
        converted: dict[str, Any],
        errors: list[str],
    ) -> None:
        for field in definition.fields:
            if not field.unique:
                continue
            value = converted.get(field.attr)
            if value is None:
                continue
            existing = self.db.query(definition.model).filter(
                getattr(definition.model, field.attr) == value,
                definition.model.is_deleted.is_(False),
            ).first()
            if existing is not None:
                errors.append(f"{field.header} already exists.")

        if definition.duplicate_group and all(converted.get(field) is not None for field in definition.duplicate_group):
            filters = [
                getattr(definition.model, field) == converted[field]
                for field in definition.duplicate_group
            ]
            existing = self.db.query(definition.model).filter(
                *filters,
                definition.model.is_deleted.is_(False),
            ).first()
            if existing is not None:
                label = ", ".join(definition.duplicate_group)
                errors.append(f"Record already exists for {label}.")

    def _file_duplicate_key(
        self,
        definition: ImportExportDefinition,
        converted: dict[str, Any],
    ) -> tuple[Any, ...] | None:
        unique_fields = [field.attr for field in definition.fields if field.unique]
        if not unique_fields and definition.duplicate_group:
            unique_fields = list(definition.duplicate_group)
        if not unique_fields:
            return None
        values = tuple(converted.get(field) for field in unique_fields)
        if any(value is None for value in values):
            return None
        return values

    def _filtered_query(self, definition: ImportExportDefinition, filters: dict[str, Any]):
        query = self.db.query(definition.model).filter(definition.model.is_deleted.is_(False))
        ids = filters.get("ids")
        if ids:
            id_values = [int(value) for value in str(ids).split(",") if value.strip().isdigit()]
            if id_values:
                query = query.filter(definition.model.id.in_(id_values))

        status_value = filters.get("status")
        if status_value and hasattr(definition.model, "status"):
            query = query.filter(definition.model.status == str(status_value).upper())

        search = filters.get("search")
        if search:
            text = f"%{search}%"
            searchable_columns = [
                getattr(definition.model, field.attr)
                for field in definition.fields
                if field.field_type in {"str", "email", "phone", "status"}
                and hasattr(definition.model, field.attr)
            ]
            if searchable_columns:
                query = query.filter(or_(*[column.ilike(text) for column in searchable_columns]))

        return query.order_by(definition.model.id.asc())

    def _export_object(self, definition: ImportExportDefinition, obj: Any) -> dict[str, Any]:
        return {
            field.header: resolve_export_value(self.db, definition, obj, field)
            for field in definition.fields
        }

    def _header_errors(self, definition: ImportExportDefinition, headers: list[str]) -> list[str]:
        expected = set(definition.headers)
        provided = set(headers)
        missing = sorted(set(definition.required_headers) - provided)
        unknown = sorted(provided - expected)
        errors: list[str] = []
        if missing:
            errors.append(f"Missing required headers: {', '.join(missing)}.")
        if unknown:
            errors.append(f"Unknown headers: {', '.join(unknown)}.")
        if not headers:
            errors.append("Import file does not contain a header row.")
        return errors

    def _definition(self, module_key: str) -> ImportExportDefinition:
        try:
            return get_definition(module_key)
        except KeyError as exc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    @staticmethod
    def _is_blank(value: Any) -> bool:
        return value is None or (isinstance(value, str) and value.strip() == "")
