from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal

from sqlalchemy.orm import Session


FieldType = Literal["str", "email", "phone", "decimal", "int", "bool", "status"]


@dataclass(frozen=True)
class ImportField:
    header: str
    attr: str
    required: bool = False
    field_type: FieldType = "str"
    max_length: int | None = None
    choices: tuple[str, ...] = ()
    unique: bool = False
    lookup_model: type[Any] | None = None
    lookup_field: str | None = None
    lookup_display: str | None = None


@dataclass(frozen=True)
class ImportExportDefinition:
    key: str
    label: str
    permission_module: str
    source_type: str
    model: type[Any]
    fields: tuple[ImportField, ...]
    sample_rows: tuple[dict[str, Any], ...]
    default_status: str = "ACTIVE"
    duplicate_group: tuple[str, ...] = field(default_factory=tuple)

    @property
    def headers(self) -> list[str]:
        return [field.header for field in self.fields]

    @property
    def required_headers(self) -> list[str]:
        return [field.header for field in self.fields if field.required]


def get_definitions() -> dict[str, ImportExportDefinition]:
    """Register application-specific definitions here when adding a module."""
    return {}


def get_definition(module_key: str) -> ImportExportDefinition:
    definitions = get_definitions()
    if module_key not in definitions:
        supported = ", ".join(sorted(definitions))
        raise KeyError(f"Unsupported import/export module '{module_key}'. Supported modules: {supported}")
    return definitions[module_key]


def resolve_export_value(db: Session, definition: ImportExportDefinition, obj: Any, field: ImportField) -> Any:
    value = getattr(obj, field.attr)
    if field.lookup_model is None or value is None:
        return value
    target = db.query(field.lookup_model).filter(field.lookup_model.id == value).one_or_none()
    return getattr(target, field.lookup_field or "id") if target is not None else value
