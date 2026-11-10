# 10 — Test Plan, QA Matrix and Release Acceptance

## Test strategy

Unit tests for pricing, tax, workflow state machines and entitlement resolution; integration tests using PostgreSQL for tenancy and financial transactions; component/E2E tests for PWA user journeys; manual device/printer pilots; load and recovery drills before paid release. Use realistic Pakistani menu, modifications and tax fixtures.

## Critical functional test matrix

| ID | Test | Acceptance criterion |
|---|---|---|
| QA-001 | Owner creates tenant and branch | No unintended access to other tenants |
| QA-002 | Plan excludes tables | Tables hidden and API rejects table operations |
| QA-003 | Tenant disables included inventory module | History unchanged; new inventory ops restricted |
| QA-004 | Change workflow while order open | Open order keeps old version, new order uses new |
| QA-005 | Create simple takeaway order | Correct amounts, status, immutable snapshots |
| QA-006 | Apply modifier/discount | Deterministic total/tax rounding and approval |
| QA-007 | Cash sale and shift close | Tender totals reconcile with counted cash/variance |
| QA-008 | External payment recorded but unverified | UI/report do not misstate settled payment |
| QA-009 | Refund / void | Permission, audit, compensating entries, proper totals |
| QA-010 | Print fails | Saved order remains; visible retry state and no silent KOT loss |
| QA-011 | PWA offline for 30 operations | Orders remain locally and sync after reconnect |
| QA-012 | Same offline command submitted twice | Exactly one server-side financial effect |
| QA-013 | Server commits but response lost | Retry returns original acknowledgment |
| QA-014 | Browser reload/update with pending commands | No outbox deletion; local data migration safe |
| QA-015 | Two devices edit same order | Deterministic conflict; no lost payment |
| QA-016 | Tenant A requests tenant B order ID | Denied; no data leak in errors |
| QA-017 | Manual SaaS payment claim only | Remains unverified; plan not extended |
| QA-018 | Admin verifies billing payment twice | One invoice payment and one entitlement extension |
| QA-019 | Owner schedules cancellation | Paid period preserved; next invoice not created |
| QA-020 | Grace to suspension | Time transition exact; billing/export still available |
| QA-021 | Pending local commands after suspension | Reconciled per policy; no silently lost orders |
| QA-022 | Backup restore drill | Recover app/database according to runbook |
| QA-023 | API load with simulated branches | Meet measured target without DB or event backlog collapse |
| QA-024 | Tenant design logo/theme | Branded UI and receipts; data/permissions unchanged |

## Printer compatibility checklist

- Enumerate actual vendor/model, thermal paper width, OS/browser, connection method (USB/LAN/Bluetooth), driver, print dialog requirements.
- Test mixed English/Urdu text if Urdu is offered, wrapping, large orders, duplicate print detection, disconnected printer, reconnect and reprint.
- No launch promise of universal silent printing. Create a **supported hardware list** from empirical tests.

## Non-functional pilot acceptance

- No undetected duplicate charges/transactions across test suite.
- No cross-tenant read/write in automated negative tests.
- All unsynced operations visible, recoverable as designed, and reconcile deterministically or enter a manager resolution state.
- Disaster restore run passes; recovery point/time objectives measured and documented from tests.
- Daily peak flow exercised on customer-class PC/tablet, and at least one restaurant shift piloted in parallel with existing system.
- Support process includes how to export unsynced local records, recover device, validate receipt reprints and restore branch from backup.

## Performance/load approach

Start with synthetic 10, 20, 50 tenant profiles; each with realistic peak order bursts, item modifiers, cash shifts, report queries, and reconnection floods. Capture CPU/RAM, disk IOPS, p50/p95 latency, DB pool saturation, queue lag, data growth. Upgrade the VPS or tune indexes based on evidence; don't infer capacity from restaurant count alone.

## Definition of done (release)

All MVP requirements have linked tests or documented manual verification, pilot issues triaged, privacy/terms available, deployment rollbacks rehearsed, docs/handoff current, and owners understand any unsupported devices/integrations.
