# Verification results

Verified on 2026-10-29. Implementation complete.

| Check | Result |
| --- | --- |
| Fresh dependency installation | Backend pip install and frontend npm ci succeeded |
| Backend dependency consistency | pip check passed |
| Python compilation | app and Alembic modules compiled successfully |
| Backend API/unit tests | 12 passed |
| Frontend unit tests | 6 passed across 4 files |
| TypeScript | Application, Vite/Vitest configuration, Playwright configuration and browser tests passed |
| Production frontend build | Passed |
| Real Chromium workflows | 2 passed |
| PostgreSQL initial migration | Applied successfully to a fresh isolated database |
| Migration downgrade/upgrade | Downgrade to base and upgrade to head both succeeded |
| Alembic state | 5c3602ecc887 at head |
| Schema drift | alembic check: no new upgrade operations |
| Seeds | Repeated successfully; idempotency/password preservation tested |
| Health, Swagger, OpenAPI | Passed through API tests and real backend startup |
| Markdown links | No broken local Markdown links found |
| Source preservation | 579 original files hashed; zero changed or missing |
| Dependency preservation | Backend requirements, frontend dependency declarations, engines and dependency lock entries unchanged |

Backend tests cover health/OpenAPI, login/refresh and invalid tokens, user/role CRUD, permission denial for Viewer and unassigned accounts, settings updates/uploads/validation, seed idempotency, CSV/XLSX round trips, import preview/duplicates/partial import/export, and audit/status history services.

Browser tests ran against the real starter FastAPI and Vite servers and a separate PostgreSQL database. They cover sign-in, role creation/deletion, user creation/deletion, settings and Help Center navigation, sign-out, hidden administrative navigation for Viewer, denied direct administrative routes, read-only settings, and mobile drawer navigation.

Environment: Python 3.14, Node.js 22.22.3, PostgreSQL 16, Chromium installed by the preserved Playwright dependency. Backend test fixtures use isolated in-memory SQLite; migrations and browser flows were separately verified on PostgreSQL. npm commands used the installed Node 22 runtime explicitly because the host has multiple Node versions.

Non-blocking warnings: the production build reports a JavaScript chunk larger than 500 kB. Retained Ant Design List/Alert usages emit deprecation notices; current backend package ranges emit Starlette/httpx and HTTP 422 constant deprecation notices. These checks pass; dependency upgrades and broad UI refactors were intentionally outside this extraction.

Cleanup: temporary PostgreSQL cluster, verification credentials, installed test environments/dependencies, browser downloads, caches, build output, and reports were removed after verification. No real source environment or uploads were copied. Run the README setup commands to install dependencies and configure your own database. No background starter server is left running.

Remaining required work: none. Overall completion: 100%.

## Docker development verification — 2026-11-11

Verified on Docker Desktop with Compose v5.6.1 (Apple Silicon), Python 3.12 and Node 22 containers:

- `make up`: images built, dedicated PostgreSQL 16 named volume initialized, Alembic applied and foundation seed completed; migration container exited 0; database, backend and frontend became healthy.
- Compose configuration validation and shell syntax check passed; generated `.env.docker` is ignored by Git.
- Backend tests against isolated in-memory SQLite: 12 passed. Frontend type checking, 6 unit tests, and production build passed inside containers.
- Real HTTP checks: frontend, API health, Swagger, OpenAPI, frontend health proxy, and administrator login through the frontend proxy passed. Credentials/tokens were not logged.
- Fixed an existing Python 3.12 import failure where `PermissionRepository.list` shadowed the built-in `list` in subsequent annotations; postponed annotation evaluation restores startup.

Browser E2E and migration downgrade/upgrade roundtrip were not repeated for this task. The original results above are historical. Current installs report 11 frontend dependency audit findings (3 moderate, 8 high), the existing large frontend chunk warning, and backend deprecation notices. Dependency declarations/lockfile were preserved. Containers are left running for local use; this is development Compose, not a production container deployment.

## POS branding and Docker warning cleanup — 2026-11-11

This supersedes the earlier Docker audit/bundle warning status, without changing historical extraction results.

| Check | Result |
| --- | --- |
| `make up` | Builds each image once; existing database, API/frontend healthy; migration/seed exit 0 |
| PostgreSQL disposable initdb | Custom image initialized a disposable container-local cluster with SCRAM, without locale/trust warnings; container removed |
| Existing database | Kept its volume and credentials; restarts without warning/error logs |
| Backend tests | 12 passed with isolated SQLite; 2 dependency deprecations remain |
| Frontend checks | Type checking, 6 tests and production build passed |
| Dependency audit | `npm audit`: 0 vulnerabilities after compatible npm lockfile updates |
| Build warnings | Vendor/UI chunk splitting removed the >500 kB warning; warning threshold unchanged |
| Installation warning | Backend virtual environment removes pip system/root installation warning |
| Product identity | HTTP checks verified POS System HTML title, OpenAPI title, health service name and saved settings |
| Existing account | Login/current-user requests through frontend proxy passed without resetting credentials |
| Source checks | Compose config and git diff whitespace checks passed |

Deprecated Alert `message` props now use `title`; Help Center uses a semantic document list instead of deprecated Ant Design List. Backend HTTP 422 constants use the current name. npm 10's lockfile-only audit fix failed internally; npm 12 completed the compatible fix and the resulting lockfile installed successfully with container npm ci. The reference-only Yarn lock was preserved.

Remaining test-only notices: Starlette TestClient deprecates its httpx adapter, and passlib imports Python 3.12's deprecated crypt module. These are not filtered or suppressed; replacing the authentication/test dependency stack was not required for this local Docker cleanup. Existing PostgreSQL authentication rules are not rewritten; SCRAM initialization applies to new clusters. Browser E2E and migration roundtrip were not repeated. No application database was used for integration tests; application requests only checked existing login/settings. Production hosting and POS sales/offline/tenancy remain planned work.

## POS palette update — 2026-11-11

Aligned frontend fallback/reset, backend model and Pydantic defaults to teal/emerald/slate. Updated the running theme through authenticated settings PUT and checked every saved color against the requested palette; unrelated settings/credentials were not included. Backend 12 tests and frontend 6 tests, type checking and production build passed. Docker images rebuilt and stack restarted. No schema change or browser E2E run.
