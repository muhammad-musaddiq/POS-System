# Next Codex Prompt — Ready to Copy/Paste

You are continuing development of a **white-label, configuration-driven restaurant POS SaaS for Pakistan**, with PWA-first React + Vite, NestJS + Prisma + PostgreSQL on one shared VPS, and AI-ready modular architecture.

**Before writing code:**

1. Read `AGENTS.md`, `rules.md`, `README.md`.
2. Read `handoff/CURRENT_STATE.md`, `handoff/INCOMPLETE_WORK.md`, `handoff/SESSION_LOG.md`.
3. Read `docs/13-decisions-and-open-questions.md`, `delivery/mvp-scope.md`, `delivery/milestones.md`, and `delivery/backlog.md`.
4. Read all relevant PRD, flow, TRD, data-model, offline, config, subscription, security and design docs for the chosen task.
5. Treat `handoff/INCOMPLETE_WORK.md` as a priority if it contains unfinished implementation. Resume and finish it first; **do not recreate completed work**.

## Next action (baseline, no code written yet)

Start **`M0-002`**: scaffold the monorepo (React + Vite PWA, React backoffice, React platform-admin, NestJS API, and shared packages) using the structure in `docs/03-technical-requirements.md`. Establish pnpm workspace, strict TypeScript, formatting and minimal build/run commands; do not add needless infrastructure. Run and record actual install/build/test commands. **`M0-001` remains BLOCKED** until the owner provides real device/printer and relevant restaurant tax details; **`M0-006` is BLOCKED** until actual design references arrive. Do not invent those details.

Keep the task small. Once `M0-002` is complete, update status, tests, docs and handoff; then the next session can take `M0-003` or another earliest unblocked task. Do not attempt all milestones in one response.

## Non-negotiable constraints

- User will provide actual Figma/designs later. `design/` currently holds requirements only. No fake design link or fabricated approved screens.
- First release React PWA. Do **not** convert to Tauri without explicit decision.
- No Supabase dependency. No restaurant-local server for initial single-terminal operation.
- Tenant/branch data isolation, role checks, workflow versions, idempotency, offline data preservation and financial ledger correctness are required.
- Subscription/payment claim must not imply verified paid status; cancellation, 7-day proposed grace, suspension and offline entitlement rules follow documentation.
- No AI service or GPU infrastructure needed in MVP. Keep later AI tools tenant-scoped.

## Working style and finish criteria

- Choose one clear ticket with acceptance criteria. Implement and test to completion where possible.
- Record precise changed files, commands, results and remaining work.
- Update source docs to match code; mark task complete **only** when verified.
- Always rewrite `handoff/CURRENT_STATE.md`, `handoff/INCOMPLETE_WORK.md`, `handoff/NEXT_PROMPT.md` for the **next** session, and append `handoff/SESSION_LOG.md`.
- When context is low or task is incomplete, write an exact resumable handoff before stopping.

Now inspect the repository and continue from its **actual** current state, not assumptions about past runs.

Context 2026-11-11: A separate FastAPI POS starter now runs in the containing directory. Inspect it before any scaffold work; do not overwrite it or assume the planned NestJS stack was implemented. Only POS terminology was updated in this package.
