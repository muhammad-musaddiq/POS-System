# POS System foundation specification

Status: Implemented

Stack: FastAPI, PostgreSQL, SQLAlchemy, Alembic, JWT/RBAC, React/Vite, Ant Design, Tailwind, React Query.

Scope: health/OpenAPI, login/refresh/current user, user CRUD/status/password, role CRUD/permission assignment, permission listing/grouping, settings/theme/logo/favicon, responsive application shell, permission guards, Help Center, manual guided tours, generic spreadsheet import/export extension engine, audit and status history services.

No business workflow or domain modules are configured. Import/export registry is intentionally empty. Foundation tables: users, roles, permissions, user_roles, role_permissions, system_settings, activity_logs, status_history.

Initial roles: Super Admin, Admin, Viewer. Admin and Super Admin can use administrative APIs when granted the required permission; only Super Admin can assign dangerous permissions or change protected system roles. Viewer can read settings and access Home/Help Center. No-role users cannot pass permission checks. System roles cannot be deleted. Self-deletion/deactivation and removal of one's own administrative role are blocked by service checks.

Changes must maintain models, schemas, repository/service/API behavior, frontend permissions, migration upgrade/downgrade, idempotent seeds, tests, and matching documentation. Use explicit source-level migrations for schema changes.

POS foundation: product defaults, browser/login identity and local client storage use POS System naming. Local Docker Compose provides PostgreSQL, migrations/seed, backend and frontend through `make up`, with persistent data/uploads and generated credentials. This does not implement the planned restaurant sales workflows.
