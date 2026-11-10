# Adding a module

1. Define SQLAlchemy models and Pydantic create/update/read schemas.
2. Add repositories, service validation and API routes; register the routes under `/api/v1`.
3. Create an explicit Alembic migration with upgrade/downgrade and verify schema drift with `alembic check`.
4. Add `module.action` permissions to the idempotent seed registry. Grant them deliberately to intended roles; existing custom role assignments are preserved.
5. Add API wrappers, hooks, types, routes and permission-filtered navigation/actions in React.
6. Add meaningful API/browser tests and update specs, module/API/database/role/help/tour docs, roadmap and project state.

For CSV/XLSX support, register an ImportExportDefinition in `app/services/import_export/definitions.py` and use ImportExportActions in an authorized page, passing permissionModule when its permission prefix differs from moduleKey. Configure unique keys, required headers, field validation, optional lookups, and `read/create/export` permissions. The generic engine writes model instances directly, so do not register sensitive authentication models or modules that require additional service-level business invariants. Add such integrations through their service layer instead.

The retained engine supports preview, partial import of valid rows, duplicate reporting, sample download, export and error report download. `sample_rows` can remain empty to produce a header-only template. Add tests for each registered module before exposing it.
