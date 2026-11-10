# Restaurant POS SaaS — Development Documentation

**Status:** Planning baseline v1.0 · **Date:** 2026-11-10 · **Market:** Restaurants in Pakistan · **Primary delivery:** React PWA

This is the source-of-truth documentation package for a white-label, configurable, multi-tenant restaurant POS SaaS. It is designed for engineers and Codex working in a code repository. **No application code has been created by this documentation package.** The code should be built incrementally after the initial design handoff.

## Quick start for Codex

1. Read [`AGENTS.md`](AGENTS.md) and [`rules.md`](rules.md) **before changing code**.
2. Read [`handoff/CURRENT_STATE.md`](handoff/CURRENT_STATE.md), [`handoff/INCOMPLETE_WORK.md`](handoff/INCOMPLETE_WORK.md), and [`handoff/NEXT_PROMPT.md`](handoff/NEXT_PROMPT.md).
3. Review [`delivery/mvp-scope.md`](delivery/mvp-scope.md), [`delivery/milestones.md`](delivery/milestones.md), and [`delivery/backlog.md`](delivery/backlog.md).
4. Before implementing UI, read [`design/README.md`](design/README.md) and use the **actual designs supplied by the owner**; do not invent their screens or claim assets exist.
5. Select the next unblocked task. Work in small, testable increments; update docs and handoff files at the end of every task/session.

## Documentation map

| File | Purpose |
|---|---|
| [`docs/00-project-charter.md`](docs/00-project-charter.md) | Goals, positioning, target customers, constraints |
| [`docs/01-prd.md`](docs/01-prd.md) | Product requirements and module scope |
| [`docs/02-app-flows.md`](docs/02-app-flows.md) | User journeys and Mermaid diagrams |
| [`docs/03-technical-requirements.md`](docs/03-technical-requirements.md) | Architecture, stack, repository layout, NFRs |
| [`docs/04-database-schema.md`](docs/04-database-schema.md) | Entities, relationships, monetary conventions |
| [`docs/05-api-contracts.md`](docs/05-api-contracts.md) | REST, command sync, errors, authorization |
| [`docs/06-offline-sync-printing.md`](docs/06-offline-sync-printing.md) | PWA, IndexedDB, idempotency, KOT and printers |
| [`docs/07-config-white-label.md`](docs/07-config-white-label.md) | Branding, entitlement, tenant/branch workflow config |
| [`docs/08-subscriptions-lifecycle.md`](docs/08-subscriptions-lifecycle.md) | Billing, cancellation, grace, suspension, recovery |
| [`docs/09-security-privacy-compliance.md`](docs/09-security-privacy-compliance.md) | Tenant security, privacy, tax integration boundaries |
| [`docs/10-testing-acceptance.md`](docs/10-testing-acceptance.md) | QA, reliability and go-live acceptance |
| [`docs/11-deployment-operations.md`](docs/11-deployment-operations.md) | Single VPS deployment, backups, monitoring, scaling |
| [`docs/12-competitor-positioning.md`](docs/12-competitor-positioning.md) | Pakistan competitor notes and differentiated product thesis |
| [`docs/13-decisions-and-open-questions.md`](docs/13-decisions-and-open-questions.md) | Confirmed decisions and items needing validation |
| [`docs/14-ai-extension-plan.md`](docs/14-ai-extension-plan.md) | Future AI boundaries, tools, security and cost control |
| [`design/`](design/README.md) | **Requirements and design handoff only**; no fabricated Figma output |
| [`delivery/mvp-scope.md`](delivery/mvp-scope.md) | In / out of MVP and release gates |
| [`delivery/milestones.md`](delivery/milestones.md) | Milestone plan and exit conditions |
| [`delivery/backlog.md`](delivery/backlog.md) | Prioritized implementation tickets |
| [`delivery/task-template.md`](delivery/task-template.md) | Definition of ready/done and task handoff template |
| [`delivery/documentation-maintenance.md`](delivery/documentation-maintenance.md) | Mandatory doc updates and change-management |
| [`handoff/`](handoff/CURRENT_STATE.md) | Current state, incomplete work, next Codex prompt, session log |

## Decisions established in this planning conversation

- SaaS targeted at independent Pakistani restaurants, initially 10–20 tenants; planned **$10–15 USD equivalent per restaurant per month**, charged in PKR when implemented.
- One shared multi-tenant application and database; **no per-restaurant server** for the initial single-counter PWA.
- **React + TypeScript + Vite PWA first**; **Tauri later only if needed**, via replaceable storage/printing/hardware adapters.
- Backend **NestJS + Prisma + PostgreSQL**, initial **single cost-conscious VPS** with self-managed PostgreSQL; no required Supabase.
- Configurable white-label branding, subscribed feature entitlements, tenant/branch module toggles, supported workflow templates and RBAC.
- Modules include POS/orders/payments/kitchen, optional tables/delivery/inventory/CRM/loyalty/ordering; AI planned later, not a launch dependency.
- Prepaid subscription, owner-initiated end-of-period cancellation; proposed 7-day grace and controlled suspension; immutable transaction history and data export.
- Offline-first **single-terminal** operation is a release priority; seamless multi-device offline synchronization is explicitly deferred until engineered and tested.
- User supplies actual designs to Codex. The `design/` folder describes requirements and how to incorporate those designs, not a substitute for them.

## Scope labels

- **MVP:** Required for the first controlled paying pilots.
- **Phase 2+:** Designed for extension, but not part of first production release.
- **Proposed:** Needs product/legal/technical validation before being treated as a promise.

## Rule of precedence

If docs conflict, resolve explicitly using: (1) latest approved decision in `docs/13-decisions-and-open-questions.md`, (2) documented PRD and policies, (3) backlog acceptance criteria, (4) design references (visual/interaction details only). Security, data integrity and legal requirements override visual mockups. Record the resolution and update affected documents.
