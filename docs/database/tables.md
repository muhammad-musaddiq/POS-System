# Foundation database

- users: identity, hashed password, account status, timestamps and soft delete.
- roles / permissions: system/custom roles and module.action grants.
- user_roles / role_permissions: many-to-many association tables.
- system_settings: application identity, theme, layout and asset URLs.
- activity_logs: optional user, action, source type/id and description.
- status_history: source type/id, previous/new status, optional actor and remarks.

Foreign keys and indexes are defined in SQLAlchemy models and the standalone initial migration. There are no business entity tables. Services own transactions; no table is created automatically at normal application startup.
