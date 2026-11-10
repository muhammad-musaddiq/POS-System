# Roadmap

- [x] Extract standalone backend foundation and initial migration.
- [x] Preserve JWT/RBAC and user/role administration.
- [x] Generalize frontend shell, settings, Help Center and tours.
- [x] Preserve generic spreadsheet infrastructure without domain definitions.
- [x] Add independent environment examples, setup and reuse documentation.
- [x] Add foundation unit/API and browser coverage.
- [x] Verify PostgreSQL migration roundtrip, seeds, startup, build and source preservation.
- [ ] Add application-specific modules only when requested.

Deployment options such as token revocation, private object storage and CI are optional future work and are not claimed as implemented.

- [x] Add local Docker Compose database/migrate/backend/frontend and one-command `make up` with generated credentials, readiness checks and persistent volumes.

- [x] Apply POS System branding and scoped frontend storage.
- [x] Fix Docker locale/pip install warnings and duplicate image builds; verify compatible frontend audit fixes and bundle splitting.

- [x] Align POS teal/emerald/slate palette across backend/frontend defaults and the running saved theme.
