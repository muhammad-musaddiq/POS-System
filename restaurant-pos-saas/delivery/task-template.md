# Task Template and Definition of Done

## Ticket

- **ID:** `M#-###`
- **Title:**
- **Status:** `TODO` / `IN_PROGRESS` / `BLOCKED` / `DONE`
- **Priority:** P0 / P1 / P2
- **Dependencies:**
- **Goal and user outcome:**
- **Scope / non-scope:**
- **Affected apps/modules:**
- **Design frame(s):** (provide links/IDs or `Awaiting design`)
- **API/database impact:**
- **Offline and subscription implications:**
- **Security / tenancy considerations:**
- **Acceptance criteria:**
  - [ ] ...
- **Tests and verification:**
  - [ ] ...
- **Documentation to update:**
- **Estimated complexity/risk:**

## Start checklist

- [ ] Read AGENTS/rules/current handoff
- [ ] Read relevant PRD, flow, TRD, API, database, security and design references
- [ ] Confirm dependencies completed
- [ ] Define testable acceptance criteria before implementation

## Definition of Done

- [ ] Feature behaves as designed on supported devices
- [ ] Type checks and relevant unit/integration/E2E tests pass; actual commands/results noted
- [ ] API/database migrations and tenant/role checks reviewed (if relevant)
- [ ] Offline sync, financial and subscription conditions handled (if relevant)
- [ ] User-visible empty/error/loading states tested
- [ ] No introduced P0/P1 data integrity or security issues
- [ ] Docs and diagrams updated to describe **actual behavior**
- [ ] Backlog updated with `DONE` and evidence
- [ ] `handoff/CURRENT_STATE.md` and `handoff/NEXT_PROMPT.md` updated
- [ ] `handoff/INCOMPLETE_WORK.md` cleared or moved to next task with precise notes
- [ ] `handoff/SESSION_LOG.md` appended

## If Codex runs out of context

Stop when possible, save files, do not invent test results. Write `handoff/INCOMPLETE_WORK.md` with exact uncommitted changes, failing tests and next steps, and update `handoff/NEXT_PROMPT.md` so a new session can resume deterministically.
