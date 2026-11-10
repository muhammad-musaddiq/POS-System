# Milestones and Delivery Plan

**Estimates are planning ranges only.** Parallelization depends on team size, actual Figma availability, printer hardware and regulatory requirements. Build the product in vertical slices; do not wait until every backend module is finished to test the POS.

| Milestone | Indicative effort | Output | Exit condition |
|---|---|---|---|
| M0: Validate and scaffold | 1–2 weeks | Decisions, repo, CI, dev Compose, first printer spike | Local full stack runs, risks and designs tracked |
| M1: Identity/tenancy/roles | 1–2 weeks | Login, org/branch, users, device activation, RBAC | Tenant isolation and permission tests pass |
| M2: White-label/config/billing foundation | 2–3 weeks | Branding, features, workflow versions, plan/invoice schema | Effective configuration and policy unit tests pass |
| M3: Menu/catalog | 1–2 weeks | Menu CRUD, variants, modifier pricing, download snapshot | Deterministic item totals and catalog sync |
| M4: Offline POS vertical slice | 2–4 weeks | IndexedDB order + outbox + sync, basic checkout | Network-loss/replay/idempotency tests pass |
| M5: Kitchen, shift, reports | 2–3 weeks | KOT printing, cash shift, reports, corrections | Real printer pilot and cashier shift tests pass |
| M6: Subscription lifecycle and operational hardening | 2–3 weeks | Renewal, cancel, grace, suspend, export, backup/ops | Billing state transitions, restore drill pass |
| M7: Controlled pilots | 2–4 weeks | 3–5 monitored restaurants, training, issues fixed | Signed pilot checklist; paid launch decision |

**Total indicative elapsed time:** about 13–23 weeks for a small experienced team with manageable parallelization; adjust after M0 discovery and measured complexity. No guaranteed delivery date.

## Beyond MVP

| Phase | Scope | Trigger |
|---|---|---|
| P2 | Inventory, recipes, purchasing, wastage, expenses, profit intelligence | Pilot demand + credible costing data |
| P3 | Direct-order storefront, loyalty, consent-based CRM, customer analytics | Repeat customers and paid upgrade demand |
| P4 | Multi-branch, fiscal/payment/delivery integrations | Agreements/certification and scale requirements |
| P5 | AI tool gateway, owner chat, forecasts, recommendations | Reliable data, cost budget and tenant consent |
| Optional | Tauri desktop adapter | Browser printer/hardware or storage limitations proven |

## Work sequencing constraints

M1 before tenant-scoped data; M2 before module-driven UX; M3 before order creation; M4 sync before trusting checkout offline; M5 devices/printers before declaring core POS ready; M6 billing policy before paid launch; M7 must include real usage and a production rollback plan. Some discovery and UX tasks run throughout.

## Milestone completion checklist

At the end of each milestone: record actual code and migrations, tested acceptance IDs, production risks, changed decisions, known limitations; update `docs/`, `delivery/backlog.md`, `handoff/` and versioned release notes; do **not** mark milestone done if a P0/P1 financial or security blocker remains.
