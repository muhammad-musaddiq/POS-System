# Browser tests

The standalone Playwright setup starts the starter backend and Vite frontend without reusing existing servers, migrates and seeds an explicitly supplied E2E_DATABASE_URL, and tests sign-in, role/user creation/deletion, settings, Help Center and sign-out. E2E_ADMIN_PASSWORD is required; E2E_ADMIN_EMAIL defaults to browser-admin@example.com.

Use a dedicated disposable PostgreSQL database. npm scripts preserve smoke/regression/demo/debug/training modes with one reusable foundation scenario. Browser reports, traces, videos and screenshots stay inside this starter. Vitest excludes browser tests. See the README for installation and commands.

Backend Pytest uses an in-memory SQLite database with a fresh schema per test. PostgreSQL migration/schema drift/seed checks are a separate integration verification. Never substitute a production database in test settings.
