# Current Implementation State — REQUIRED TO UPDATE

**As of:** 2026-11-10 · **Stage:** Documentation prepared; development **NOT STARTED**.

## Snapshot

- **Active milestone:** M0 — Validate and scaffold.
- **Current task:** `M0-002` Scaffold monorepo and developer toolchain.
- **Current task status:** `TODO` (not yet started). `M0-001` and `M0-006` are `BLOCKED` awaiting owner input.
- **Last completed task:** None.
- **Next milestone target:** Baseline repo/CI/development Compose and a tested PWA/printer feasibility spike.
- **Actual application files:** None in this package; project documents only.
- **User-provided design:** Not supplied in this package, pending Figma/reference handoff.
- **Implementation tests run:** None. No code exists yet.

## Agreed technical baseline

React + Vite + TypeScript PWA first; Tauri optional later. NestJS + Prisma + self-managed PostgreSQL on one VPS, shared tenant isolation, no Supabase requirement or dedicated restaurant server. Configurable modules, workflow presets, branding, RBAC; 7-day *proposed* grace and signed short offline entitlement. AI later via modular gateway.

## Known blockers / decisions

- M0-001 blocked: hardware list, tax jurisdiction and pilot compliance prerequisites must be captured before production.
- Actual design/Figma references pending owner handoff.
- Commercial details, PWA print dialog acceptance, precise tax integration obligations and retention require confirmation.

## Repository health

- Git commit: Not applicable (documentation-only package; repository may not exist).
- Build status: Not run.
- CI status: Not configured.
- Database migrations: None created.
- Docker deployment: Not created.

## At the end of every Codex task, replace this section with reality

- Date/time; milestone and ticket; status; exact changed files; tests and results; git SHA if available; DB migration and rollout details; blockers; next task; impacted docs; link to `INCOMPLETE_WORK.md` if unfinished.

## 2026-11-11 terminology update

MVP exclusion wording now says POS. No application implementation was added to this documentation package; the containing directory has a separately verified FastAPI POS starter and Docker stack. Existing milestone statuses remain unchanged.
