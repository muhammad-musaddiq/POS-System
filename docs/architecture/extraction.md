# Extraction decisions

Retained: source directory conventions, backend dependencies, frontend dependency versions and lockfile resolutions, JWT refresh flow, administrative API/service/repository/schema/model code, settings/theme/asset utilities, generic UI, spreadsheet engine, Help Center and tour mechanics.

Generalized: app/package/storage naming, configuration, authentication screen, navigation, role/permission labels, theme preview, docs defaults, locale/currency, seeds and model registry. RBAC legacy no-role bypasses were removed in the copy. Validation responses omit raw request inputs, and deployment environments require a non-placeholder secret. Soft-deleted users no longer block deletion of unused custom roles.

Excluded: all manufacturing and accounting modules, business statuses/rules/roles, demo users and records, document-specific PDF screens, alert scheduler/reports, workflow history migrations, branding, real environment/upload data, generated files and old conversation dumps.

The new baseline migration describes only the retained foundation schema. It is for a new database, not an upgrade or replacement for the source application's database. The import/export registry is deliberately empty. The source project is untouched; its contents remain the historical reference.
