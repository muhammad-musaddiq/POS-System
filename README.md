# POS System

A React + FastAPI foundation for POS System. Includes JWT authentication and refresh, RBAC, user/role administration, settings with theme and asset uploads, reusable UI components, Help Center, guided tours, and generic CSV/XLSX import/export infrastructure.

## Requirements

- Python 3.12+ (verification also covers Python 3.14)
- PostgreSQL 16+
- Node.js 20.19+ (22.12+ recommended), npm

All commands below run from this folder, independently of its parent project. You can copy this folder into another repository. No runtime paths reference the parent application.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
npm --prefix frontend ci
cp frontend/.env.example frontend/.env
```

Edit `.env`: set your dedicated `DATABASE_URL`, a random `SECRET_KEY`, and `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Generate a secret with `python -c "import secrets; print(secrets.token_urlsafe(48))"`. The supplied `.env.example` contains placeholders, not real credentials. No `.env` or administrator credentials are shipped; create your configuration before normal use.

Create a new database using your local PostgreSQL role; use the matching credentials in `DATABASE_URL`:

```bash
createdb pos_system
alembic upgrade head
python -m app.scripts.seed_all
python -m app.scripts.seed_all
```

Seeds are idempotent. Only the initial administrator is created, with the configured credentials and Super Admin role. No sample business records or predefined development users are created. Existing passwords and Admin/Viewer permission customizations are preserved. Super Admin receives the current foundation permissions on every seed run.

## Run

```bash
# Terminal 1, from this folder with the virtual environment active
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
# Terminal 2, from this folder
npm --prefix frontend run dev
```

- Frontend: http://127.0.0.1:5174
- API health: http://127.0.0.1:8001/api/v1/health
- Swagger: http://127.0.0.1:8001/docs
- OpenAPI: http://127.0.0.1:8001/api/v1/openapi.json

Sign in using your configured administrator credentials. Vite proxies `/api` and `/uploads` to the backend; the default ports differ from the source application. The backend resolves `.env` and relative upload directories within this starter. Run Alembic and seed commands from this folder.

## Structure

```text
app/                  routes, schemas, services, repositories, models, tests
alembic/              standalone initial migration, upgrade and downgrade
frontend/src/         React app, administration, theme, components, utilities
frontend/tests/e2e/   real browser foundation workflow
docs/                 architecture, roles, modules, API, database, testing, help
```

## Checks

```bash
python -m pytest -q
alembic current
alembic check
npm --prefix frontend run typecheck
npm --prefix frontend test
npm --prefix frontend run build
```

Browser tests require a **separate disposable PostgreSQL database**. They migrate and seed the database explicitly supplied in `E2E_DATABASE_URL`, create and soft-delete test records, and refuse to run without explicit database and password settings. Never supply a database you want to preserve.

```bash
createdb pos_system_e2e
npm --prefix frontend exec -- playwright install chromium
E2E_DATABASE_URL=postgresql+psycopg://YOUR_ROLE@127.0.0.1:5432/pos_system_e2e E2E_ADMIN_PASSWORD=local-browser-password npm --prefix frontend run test:smoke
```

`test:regression`, `test:training`, `test:demo`, and `test:debug` run the same reusable workflow with different browser modes. Demo/debug use headed Chromium. Reports and output stay inside this folder. Test servers use ports 8001/5174 and never reuse a running server; configure `E2E_BACKEND_PORT`/`E2E_FRONTEND_PORT` if needed.

## Reuse and extension

Read `docs/architecture/overview.md`, `docs/architecture/extension-guide.md`, and `docs/database/migrations.md`. Backend dependency constraints are retained. The npm lockfile includes compatible security fixes verified with a clean install and audit; no new runtime library was added. `npm ci` is the canonical install workflow; the original yarn lockfile is retained for reference without promising a frozen Yarn install.

The generic import/export engine and React controls are retained with an empty module registry. Register definitions and seed the associated permissions when adding a domain module; no sales, inventory or sample transaction records are included. Activity/status-history services are available for explicit use by new features; there is no log browser or automatic audit of every administration action.

See `docs/architecture/deployment.md` for serving a production build, uploads, and environment configuration, and `docs/testing/verification.md` for recorded verification results.

## Docker development (one command)

Install and start Docker Desktop and have `make` and `openssl` available, then run from this folder:

```bash
make up
```

This creates a private, gitignored `.env.docker` with random database, signing and initial administrator secrets on first use, builds the images, waits for PostgreSQL, applies Alembic migrations, runs the idempotent foundation seed, and starts the API and frontend. Existing `.env` files are preserved. Read `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.docker` to sign in; no additional demo users or business records are created.

Docker Desktop groups `db`, `migrate`, `backend`, and `frontend` under **pos-system**. A successfully exited `migrate` container is expected. Open http://localhost:5174 and http://localhost:8001/docs. PostgreSQL is available at localhost:5434. Ports bind only to localhost and can be changed using `FRONTEND_PORT`, `BACKEND_PORT`, and `DB_PORT` in `.env.docker`; rerun `make up` after changes. The frontend proxies API/uploads to the backend container.

```bash
make ps       # Status including the completed migration container
make logs     # Follow logs; Ctrl-C exits log viewing
make down     # Stop; database and uploads remain in named volumes
make up       # Rebuild and start again; seed preserves existing passwords
make test     # Backend isolated SQLite tests, frontend types/tests/build
```

Source changes in `app/`, frontend source, and docs reload through bind mounts. Rebuild with `make up` after changing dependencies. Database and uploads persist in `pos-system_postgres_data` and `pos-system_uploads`; keep `.env.docker` alongside these volumes. Changing its database password does not change an existing PostgreSQL role password; changing its administrator password does not reset a seeded account. This Compose setup runs development reload servers; see [deployment guidance](docs/architecture/deployment.md) for production.

## POS foundation status

POS System branding is applied to the login, browser title, theme defaults, API name and package metadata. Authentication/tour storage keys are POS-scoped; sign in again after upgrading from the generic starter. Existing passwords and customized settings are preserved. This is the administrative foundation: checkout, catalog, payments, shifts, printing, tenancy and offline sales are future modules, not implemented workflows.

The database image adds locale tooling to PostgreSQL 16 Alpine, retaining its existing storage format. New databases initialize with SCRAM authentication; existing database authentication settings are preserved. `make up` builds each image once before startup. Frontend dependencies have compatible audit fixes and build chunks are split rather than hiding size warnings. Docker requires Compose with health-check `start_interval` support (2.20.2+).

POS palette: teal primary `#0F766E`, slate secondary `#334155`, emerald accent `#047857`, dark slate sidebar `#0F172A`, white header and light slate background `#F8FAFC`. Success/positive amounts use emerald, warning uses amber, and errors/negative amounts use red. Backend model/Pydantic defaults and frontend fallback/reset defaults match. Existing installation colors were updated through the authorized settings API; other settings and credentials were preserved. No schema change.
