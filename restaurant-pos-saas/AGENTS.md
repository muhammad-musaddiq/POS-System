# Codex / Agent Operating Instructions

**Read `rules.md` and the handoff files every time a new session starts.** The documentation set is the source of truth for a configurable Pakistan restaurant POS SaaS. This document is also intended for coding agents that auto-read `AGENTS.md`.

## Start-of-session protocol

1. Read `README.md`, `rules.md`, `handoff/CURRENT_STATE.md`, `handoff/INCOMPLETE_WORK.md`, `handoff/NEXT_PROMPT.md`.
2. Read the relevant PRD, flow, TRD, security, config and acceptance documents before touching a module.
3. Read the actual Figma/export/screenshot specifications supplied by the user. If absent, implement only work not dependent on approved visual design, or use a minimal provisional UI with explicit status.
4. Locate the current task ID in `delivery/backlog.md` and confirm dependencies and acceptance criteria.
5. Give a short task plan, then implement one coherent increment. Do not claim files/tests/designs exist without verification.

## End-of-task protocol — mandatory

1. Run relevant tests and checks, record exact commands and outcomes.
2. Update backlog task status and acceptance results.
3. Update all impacted docs to match **implemented behavior**, especially API, schema, flows, configuration, and UI handoff.
4. Update `handoff/CURRENT_STATE.md`, `handoff/INCOMPLETE_WORK.md`, `handoff/NEXT_PROMPT.md`, `handoff/SESSION_LOG.md`.
5. Include changed files, commands, tests, known defects, next task and blockers in final summary.
6. If interrupted or context is nearly exhausted, **stop broad feature work and write a precise resume handoff**. Never pretend an incomplete task is done.

## Core safeguards

- Tenant and branch access checked by server on every data operation. UI module hiding is not security.
- Price/discount/tax/payment values validated server-side; store integer minor units and audit financial corrections.
- Offline commands use immutable IDs and server idempotency. Never discard unsynced local records.
- No unapproved paid integrations, secret keys in repo, or direct LLM access to unrestricted tenant data.
- No requirement to invent or implement complex multi-device offline coordination in MVP.
- Prefer a modular monolith and simple deployment; no Kubernetes or microservices without explicit decision.
- Respect users' cancellation/data-export rights and signed offline access policy.

## Continuation prompt

Copy `handoff/NEXT_PROMPT.md` as the next user prompt when reopening Codex. The agent should read this repository and execute the named next task without redoing completed work.
