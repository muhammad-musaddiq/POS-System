# Documentation Maintenance and Change Protocol

## When to update

**After every completed task:** backlog status, acceptance evidence, handoff state and relevant feature docs. **After schema/API/config/flow changes:** update the corresponding source-of-truth docs and diagrams in the same change set. **After a milestone:** write actual completion summary and outstanding risks. **When interrupted:** handoff files before leaving.

## Change impact matrix

| Change | Required documents |
|---|---|
| New feature/module | PRD, config catalogue, flows, backlog, UI requirements, testing |
| Database schema/migration | Data model, API, testing, ADR if architectural |
| API contract | API, flows, sync (if affected), tests |
| Offline behavior | Offline doc, flows, risk/tests, UI states |
| Plan / price / renewal | Subscription, PRD, config, UI, tests, decision log |
| Security / permissions | Security, data model, API, role flows, tests |
| Visual design supplied or changed | `design/figma-handoff.md`, `design/requirements.md`, mapping to backlog |
| Deployment/process | TRD, deployment, runbook, handoff |
| AI tool/data access | PRD, TRD, data model, security, API, billing/quota, tests |

## Proposed repo convention

- Docs reflect **intended behavior** when task unimplemented; label it clearly.
- Add implemented evidence (PR/test link) and update status once shipped.
- Keep a concise changelog and preserve accepted decision history rather than rewriting prior context.
- Use task IDs (`M4-003`) and QA IDs (`QA-012`) consistently.
- If a doc conflicts with implementation, fix implementation or document/approve a changed decision before marking done.

## Codex end-of-session summary format

```
Session date/time:
Current task ID / status:
Completed this session:
Files changed:
Commands run:
Tests (pass/fail/not run):
Migrations applied (local/prod, if any):
Unresolved issues / blockers:
Design assumptions:
Docs updated:
Next exact action:
```

## Caution

This process cannot magically update files after a coding session has ended. The Codex agent must **actually write these files during each task/session** and the owner should review them in pull requests. Never say handoff is current without checking timestamps and git diff.
