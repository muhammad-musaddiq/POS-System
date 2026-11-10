# Project state

POS System administrative foundation is running through `make up`: PostgreSQL 16 Alpine with locale tooling, one-shot migrations/seed, FastAPI and Vite grouped as `pos-system`. Private `.env.docker` credentials and named database/upload volumes are preserved. Manual setup remains available. No catalog, checkout, payments, shifts, offline or tenancy workflows are implemented.

Verified 2026-11-11 after POS/Docker cleanup: images build; existing database starts without runtime warnings; migration/seed exits 0; backend/frontend/database healthy; existing administrator login, POS settings, browser/API titles and frontend proxy pass. A separate disposable PostgreSQL initialization passed without locale/trust warnings. Backend: 12 isolated SQLite tests passed; frontend: 6 tests, types and production build passed. npm audit: 0 vulnerabilities. Bundle splitting removes the prior chunk-size warning; backend venv removes pip's system/root installation warning. Two backend test-only dependency deprecations remain (Starlette httpx client and passlib crypt); not suppressed. Browser E2E and migration roundtrip were not rerun.

Branding defaults and client storage use POS names; users must sign in again after generic-starter upgrades. Existing credentials/custom branding are not reset. Compatible frontend security fixes updated the npm lockfile; backend dependency constraints remain unchanged. No schema changes. The nested restaurant-pos-saas package remains planning documentation; only terminology/handoff notes were updated there.

Remaining: production hosting, CI and POS business modules are future work. See docs/testing/verification.md for exact limits. Development stack is left running.

Latest update 2026-11-11: POS teal/emerald/slate palette applied to model/schema/frontend defaults and the running singleton via settings API. Other settings/credentials preserved; no schema change.
