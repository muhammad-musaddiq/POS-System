# Deployment

Set ENVIRONMENT=production, DEBUG=false, a unique random SECRET_KEY of at least 32 characters, and a dedicated PostgreSQL DATABASE_URL. Configure initial administrator credentials only for seeding; the seed does not reset an existing password. Restrict environment file access and keep it out of version control.

Install backend requirements, run `alembic upgrade head`, then run the foundation seed. Build the frontend with `npm ci` and `npm run build` from frontend/. Serve frontend/dist with an HTTP server that falls back to index.html for client routes. Reverse proxy `/api` and `/uploads` to FastAPI on the same origin. Vite's proxy applies only to development; this starter intentionally uses a same-origin deployment and does not add broad CORS rules.

Persist the configured UPLOAD_DIR outside ephemeral deployment storage and provision write access. Uploaded branding assets are public. Do not store private attachments under the public upload mount. Terminate HTTPS at the proxy, back up the database and uploads together, and run the backend without reload.

JWT refresh tokens retain the source implementation: stateless expiry, no revocation store, no password-reset session invalidation, and localStorage storage in the browser. Logout clears the local session. Add revocation/cookie-based sessions separately if the deployment requires them. Dependency ranges are preserved from the source; backend installs are not lockfile-reproducible.

## Local Docker Compose

`make up` builds the root Python 3.12 image and frontend Node 22 image with the configured dependencies. Compose uses PostgreSQL 16 Alpine, a healthy-database dependency, a one-shot migration/seed service, then a healthy API dependency before frontend startup. The project is named `pos-system`, with localhost ports 5434 (database), 8001 (API), and 5174 (frontend), configurable in `.env.docker`.

`docker/init-env.sh` generates private local secrets only when `.env.docker` does not exist; it does not overwrite the manual setup's `.env`. Make consistently passes `--env-file .env.docker` for Compose interpolation. Only the backend/migration services receive this environment file. The browser receives same-origin `/api/v1`; Vite forwards `/api` and `/uploads` to `backend:8000`. Docker build contexts exclude environment files, dependencies, uploads, Git history and unrelated planning files.

Database data and public uploads use named volumes. `make down` preserves both. Never delete volumes to fix startup issues on a database you need. Keep the generated credentials for subsequent starts. Database or administrator credential changes require the appropriate database/account password update, since initialization and seed do not reset existing passwords. `make migrate` applies migrations/seeds manually; `make restart` restarts the API/frontend. `make test` uses isolated in-memory SQLite for backend tests and runs frontend type checking, unit tests and production compilation. It does not run integration tests against the application database.

This is a local development stack with source mounts and reload servers. Production still requires the configuration and serving steps above.

## POS Docker maintenance

The PostgreSQL image is built from `docker/postgres.Dockerfile` with musl locale packages, preserving PostgreSQL 16 Alpine data compatibility. `POSTGRES_INITDB_ARGS` enables SCRAM for new clusters; it does not rewrite existing clusters or require deleting data. Initializing a disposable cluster was checked without locale/trust warnings. Backend installs into `/opt/venv` to avoid installing pip packages into the system environment. The shared migration service reuses the backend image, built once by `make up` before Compose startup. Readiness checks run frequently during startup and every 30 seconds afterward. Frontend uses an init process for signal handling.

POS branding applies to application defaults and frontend session/tour keys. Existing customized database branding is not overwritten by seeds. Changing client storage keys requires signing in again, with the same account/password. No schema change is involved. Compatible npm lockfile fixes resolve the previously reported audit findings; `npm ci` remains canonical, and the legacy yarn lock is reference-only. Build chunk splitting addresses the large-bundle warning. Deprecated Ant Design Alert/List usages were updated. Backend test dependencies still emit the documented test-only deprecation notices; these are not hidden.
