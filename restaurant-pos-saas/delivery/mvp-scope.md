# MVP Scope and Release Boundary

## MVP objective

Pilot an offline-capable, configurable restaurant POS with one primary cashier terminal per branch, core sales/kitchen/shift flow, white-label identity, RBAC and SaaS subscription enforcement. No need for on-site server or Tauri at first. Real browser thermal printer support is a validation gate.

## MVP must ship (minimum cut)

- Tenant/branch/user membership, RBAC and device activation.
- White-label branding, module entitlements and workflow presets with backend enforcement.
- Menu/categories/items/variants/modifiers with immutable order-time snapshots.
- Takeaway and optional basic dine-in/table workflow; optional manual delivery order type.
- Orders, discounts and manager approval, cash tender, manually recorded noncash tender with verified/unverified state, refund/void controls.
- Kitchen tickets and supported browser print workflow; explicit printer failure UI.
- Cash shift open/close, basic sales/shift report and audit trail.
- IndexedDB local persistence + atomic outbox + server command deduplication + connection/sync UX.
- Monthly prepaid manual SaaS invoice/payment verification, end-of-period cancellation, suggested 7-day grace and controlled suspension, export access.
- CI, tenant isolation tests, backups, monitoring, device/printer pilot testing, support runbook.

## Not MVP

- Tauri desktop, generalized offline local LAN master or synchronized multiple disconnected cashiers.
- POS cloud payment gateway/auto-verification, Raast dynamic QR integration, third-party delivery integrations.
- Certified SRB/FBR/PRA fiscal integration (required before use in any regulated environment needing it; assess legal go-live gating per customer).
- Ingredient-level inventory, recipe costing, supplier ledger, stock transfers.
- Loyalty/CRM campaigns, customer ordering website, rider dispatch.
- AI chatbot, demand forecasting, fraud ML, hosted GPU, vector database.
- Unlimited workflow builder, highly customized POS features, advanced multi-branch management.

## MVP acceptance / pilot gate

- [ ] Authorized staff completes order -> kitchen/fulfill -> payment -> receipt -> shift close.
- [ ] Module and workflow settings alter behavior as documented; no data deletion on disable.
- [ ] Single-device offline create/replay is robust; zero duplicate order/payment effects in test suite.
- [ ] Printer matrix run on actual pilot hardware; supported model list produced.
- [ ] Cross-tenant authorization and subscription transitions tested.
- [ ] Manual SaaS payment does not activate until verified; cancellation and grace policy verified.
- [ ] Offsite backup and restore tested; incident and local-unsynced-device recovery procedures written.
- [ ] Tax compliance decision recorded for each pilot restaurant/jurisdiction.
- [ ] Actual designs integrated or explicitly approved interim UI documented.
- [ ] Pilot restaurants sign off on critical workflows and known constraints.

## De-scope rule

If a feature threatens payment correctness, offline integrity, tenant security or printer reliability, prioritize those invariants and defer cosmetics or optional modules. Scope changes require approval/ADR and updated milestones/backlog.
