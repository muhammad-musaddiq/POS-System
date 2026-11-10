# Seed data

`python -m app.scripts.seed_all` creates foundation permissions, Super Admin/Admin/Viewer system roles, an administrator using ADMIN_EMAIL/ADMIN_PASSWORD/ADMIN_NAME and default application settings. Credentials are validated before creating an account; use a valid email and an 8–72 character password within bcrypt's 72-byte limit.

The seed is transactional and idempotent. Re-running does not duplicate records or reset an existing password. Existing Admin/Viewer role customization is preserved; Super Admin gets all foundation permissions. Only one initial user is created. No business or development-role sample data is seeded.
