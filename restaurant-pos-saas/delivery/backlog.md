# Prioritized Implementation Backlog

**Last updated:** 2026-11-10 · **Code implementation:** NOT STARTED · **Task status:** `M0-001` and `M0-006` are `BLOCKED` pending owner-provided pilot hardware/tax details and visual design respectively. Other tasks are `TODO` until Codex updates status with evidence.

**Work rule:** One active ticket at a time unless specifically coordinating concurrent agents. Every ticket uses `delivery/task-template.md` and end-of-task handoff. **P0** = release/blocking technical integrity, **P1** = primary user functionality, **P2** = useful but not release-blocking. User-provided Figma design remains a dependency for final styling.

## M0 — Foundation and early risks

| ID | Priority | Task | Dependencies | Acceptance evidence |
|---|---|---|---|---|
| M0-001 | P0 | Confirm device/browser/printer pilot matrix; assess tax requirements | Owner/pilot hardware details | **BLOCKED pending pilot device/printer and jurisdiction details**; document matrix when received |
| M0-002 | P0 | Scaffold workspace: POS PWA, backoffice, platform admin, NestJS API, shared packages | None | `pnpm install`, TypeScript build and local startup pass |
| M0-003 | P0 | Docker Compose development PostgreSQL; Prisma config and baseline migrations | M0-002 | Local DB up/down, seed and migrate tests; secrets not committed |
| M0-004 | P0 | CI lint/types/unit test runner + formatting, branch protection guidance | M0-002 | Failing test blocks pipeline; successful smoke pipeline |
| M0-005 | P0 | Browser PWA storage/thermal print feasibility spike on pilot device | M0-001, M0-002 | Real device report; printer compatibility and fallback policy documented |
| M0-006 | P1 | Import user-supplied design sources and map frames to UI inventory | Owner provides design | **BLOCKED awaiting actual design**; map frames and tokens once provided |
| M0-007 | P1 | Create ADR-approved configuration defaults and initial tenant/demo fixtures | M0-003 | Deterministic fixtures for quick-service/tables enabled; no fake external integrations |

## M1 — Identity, tenancy and RBAC

| ID | Priority | Task | Dependencies | Acceptance evidence |
|---|---|---|---|---|
| M1-001 | P0 | Tenant, branch, user, membership, device, role and permissions schema | M0-003 | Migration, indexes/FKs and cross-tenant constraint tests |
| M1-002 | P0 | Auth: login/session/refresh/revoke, input validation, rate limiting | M1-001 | Security/auth integration tests |
| M1-003 | P0 | Central authorization guards for tenant, branch and action permissions | M1-002 | Negative tests: tenant A cannot access B; branch scope enforced |
| M1-004 | P1 | Owner creates tenant/branch, invites users and registers POS device | M1-002, M1-003 | UI/API E2E onboarding path (QA-001) |
| M1-005 | P1 | Basic cashier/manager/owner role screens and audit for role changes | M1-003 | Proper navigation and server role checks |

## M2 — Branding, configuration and plans foundation

| ID | Priority | Task | Dependencies | Acceptance evidence |
|---|---|---|---|---|
| M2-001 | P0 | Feature registry, plan entitlements, tenant/branch toggles, dependencies | M1-003 | Backend effective-capability resolver tests (QA-002, QA-003) |
| M2-002 | P0 | Workflow config schema, versioning, publish/rollback-as-new and validation | M2-001 | Existing order reference plan; invalid template combinations rejected (QA-004) |
| M2-003 | P1 | Tenant branding settings + runtime theme/receipt preview | M1-004 | Brand per tenant without separate builds (QA-024) |
| M2-004 | P1 | Modules/workflow owner UI with plan-locked, dependency and branch states | M2-001, M2-002, M0-006 | UI tied to actual entitlements; server still enforces |
| M2-005 | P1 | Plans, subscription, invoice and billing-payment migration/state engine skeleton | M1-001 | Valid transitions tested; separated POS vs SaaS ledgers |
| M2-006 | P0 | Default subscription gate integrated with API and device enrollment | M2-005, M2-001 | Unpaid signup cannot access paid POS; export/billing exception path exists |

## M3 — Catalog and order model

| ID | Priority | Task | Dependencies | Acceptance evidence |
|---|---|---|---|---|
| M3-001 | P1 | Menu/categories/items/variants/modifier schema and tenant CRUD API | M1-003 | Tenant-safe CRUD, validation, archive instead of destructive delete |
| M3-002 | P0 | Deterministic price/tax/discount calculations in integer minor units | M3-001 | Unit tests on variants, modifiers and rounding (QA-006) |
| M3-003 | P1 | Catalog owner UI and import/seed support | M3-001, M0-006 | Menu edited and reflected in authorized branch snapshot |
| M3-004 | P0 | Orders/items/events/payment/KOT/receipt database schema | M3-002, M2-002 | Price/workflow snapshots immutable; correct FK/indexes |
| M3-005 | P0 | Validated order state machine and cashier order API | M3-004, M1-003 | State transitions/audit and QA-005 tests |

## M4 — PWA POS and offline sync (critical vertical slice)

| ID | Priority | Task | Dependencies | Acceptance evidence |
|---|---|---|---|---|
| M4-001 | P0 | PWA app shell/service-worker cache, IndexedDB migrations and storage adapter | M0-002 | Fresh activation/refresh/offline shell; migrations preserve data |
| M4-002 | P0 | Atomic local order save + command outbox state machine | M4-001, M3-005 | Refresh/crash test; pending operations preserved |
| M4-003 | P0 | Server command intake, idempotency, revision checks, conflict handling | M4-002, M3-005 | Replay accepted once; lost ack safe (QA-011–QA-015) |
| M4-004 | P0 | Foreground sync engine, retry/backoff and sync-state diagnostics | M4-003 | Offline -> reconnection -> ACKED; explicit conflict state |
| M4-005 | P1 | Cashier menu/cart/checkout PWA screens from approved design | M3-003, M4-002, M0-006 | Touch/keyboard checkout and no lost local order; QA-005 |
| M4-006 | P0 | Cash payment and externally recorded unverified tender; refund/void commands | M4-003, M3-002 | Duplicate safe, permission checks; QA-008/QA-009 |
| M4-007 | P0 | Versioned signed offline entitlement + degraded/lease-expired UI | M2-006, M4-004 | Expiry/reconnect and pending-sync policy tests (QA-021) |

## M5 — Kitchen, printing, shifts, reports

| ID | Priority | Task | Dependencies | Acceptance evidence |
|---|---|---|---|---|
| M5-001 | P0 | Printer adapter, receipt and kitchen ticket print queue/retry | M0-005, M4-005 | Real model print matrix; QA-010; duplicate warning |
| M5-002 | P1 | Kitchen ticket statuses/routing and optional display (online only) | M5-001, M2-001 | Flow skips safely when kitchen disabled |
| M5-003 | P0 | Cash shift schema + open/close and count variance | M4-006 | Deterministic expected/count amount, QA-007 |
| M5-004 | P1 | Manager/cashier shift UI and first sales/shift reports | M5-003, M0-006 | Date/branch filtered, offline data caveats visible |
| M5-005 | P0 | Audit trail for manager approvals, discounts/refunds, reprints and config | M5-004, M2-002 | Auditable actor/time/reason, negative tests |

## M6 — Billing policy, exports and operations hardening

| ID | Priority | Task | Dependencies | Acceptance evidence |
|---|---|---|---|---|
| M6-001 | P0 | Monthly prepaid invoice generation, manual payment claims and admin verification | M2-005 | Payment claim cannot self-activate; repeated verification idempotent (QA-017/18) |
| M6-002 | P0 | Scheduled cancellation/undo and period-end transition | M6-001 | Renewal suppressed, paid access preserved (QA-019) |
| M6-003 | P0 | Reminder/grace/suspension/reactivation state jobs | M6-001, M4-007 | Asia/Karachi cutoffs, controlled suspension (QA-020/21) |
| M6-004 | P1 | Owner billing, payment status, cancel/renew screens | M6-001, M6-002, M0-006 | Exact effective time and consequences displayed |
| M6-005 | P0 | Historical data export and safe offboarding policy enforcement | M6-003 | Export works during suspension; no immediate deletion |
| M6-006 | P0 | Deploy single VPS, TLS/firewall, encrypted offsite backup and restore drill | M0-003, M5-005 | QA-022 and operations runbook pass |
| M6-007 | P0 | Security review, tenant negative tests, realistic peak load and error alerts | M6-006, M5-004 | QA-016/23, no open P0 defect |
| M6-008 | P1 | Setup wizard, device health and customer support diagnostics | M6-004, M5-001 | Staff can identify sync/print/subscription errors |

## M7 — Customer pilots and release

| ID | Priority | Task | Dependencies | Acceptance evidence |
|---|---|---|---|---|
| M7-001 | P0 | Recruit 3–5 pilots, capture real devices, requirements and tax/compliance status | M0-001 | Approved pilot matrix and legal/fiscal gate per customer |
| M7-002 | P0 | Parallel operation/observation of peak shift | M6-007, M7-001 | Reconciliation and incident report; no unexplained data loss |
| M7-003 | P0 | Fix pilot P0/P1 issues and rehearse rollback/device recovery | M7-002 | Retest and restore/incident steps verified |
| M7-004 | P1 | Final onboarding/support/terms, pricing and release signoff | M7-003 | Owner checklist and launch decision approved |

## Next phases (not scheduled as MVP engineering)

- P2-001 Inventory movement ledger and recipes; P2-002 suppliers/PO/receiving; P2-003 waste/count variance; P2-004 profit contribution and finance dashboard.
- P3-001 Direct ordering web; P3-002 customer consent/loyalty; P3-003 retention campaigns and rider/delivery workflows.
- P4-001 Central multi-branch; P4-002 approved payment settlement; P4-003 authorized fiscal adapters; P4-004 delivery platform integration.
- P5-001 AI gateway/quota/security; P5-002 report-grounded owner chatbot; P5-003 demand/purchase forecasts; P5-004 anomaly detection.
- OPT-001 Tauri packaging, SQLite and native printer adapters **only after demonstrated need**.

## Work queue rules

1. Read `handoff/CURRENT_STATE.md`; if `INCOMPLETE_WORK.md` has active partial work, finish that first.
2. If no active partial work, pick earliest unblocked P0 task in milestone order. **Starting task is `M0-002`** because `M0-001` is blocked by unavailable pilot hardware/tax details.
3. On each task completion, update this file's status/evidence (optionally convert row to a task log section) and advance handoff's next task.
4. **Never mark blocked design, printer, fiscal or hardware integration tasks done by assumption.** Record a blocker and work on an independent task.
5. If requirements/design differ, record decision and update docs before claiming implementation is correct.

## DOC-POS — 2026-11-11 — DONE

Terminology-only update: MVP exclusions now use POS wording. Verified repository text search. This does not complete any implementation ticket; the running FastAPI starter lives in the containing directory.
