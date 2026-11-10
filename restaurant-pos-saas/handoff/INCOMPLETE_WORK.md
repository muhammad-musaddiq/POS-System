# Incomplete Work — Session Recovery File

**Status:** NONE — NO CODE WORK STARTED

This file is mandatory whenever Codex stops mid-task, hits context/token limits, leaves failing tests, or needs to resume on another session. **Never delete it silently; replace its content with the current accurate state.**

## Active partial task

- **Task ID:** None
- **Started:** Not started
- **Owner/current branch/commit:** N/A
- **Goal:** N/A
- **Last successful checkpoint:** Documentation baseline generated 2026-11-10; not implementation.

## What has been completed within the partial task

None.

## Files changed during incomplete work

None.

## Tests/commands already run

None (no application code yet).

## Exact remaining actions

1. Follow `handoff/NEXT_PROMPT.md` and select `M0-002` (M0-001 awaits pilot hardware/tax specifics).
2. Once implementation starts, populate this file if anything remains partial.

## Known blockers/errors

No implementation blockers yet. Design references and real printer models not yet supplied.

## Safety and state preservation

No production migrations, invoices, restaurant records or services exist at this stage. Future sessions must state whether tests/migrations were run **locally** or **in production** and whether pending offline transactions exist. Do not discard unsynced data to work around failures.

## Template for a real interruption

```
Task ID / status:
Date/time and git branch/SHA:
Working hypothesis / goal:
Files modified (including uncommitted work):
What definitely works:
What is broken or uncertain:
Commands/tests run and exact results:
Database migrations and environment affected:
Design assumptions:
Steps to resume, in exact order:
Acceptance criteria still unchecked:
Docs needing updates:
Next prompt to paste:
```

2026-11-11: POS terminology cleanup completed; no partial code work in this documentation package.
