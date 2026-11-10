# UI/UX Design Requirements

## Principles

- Designed for rushed restaurant staff: large touch targets, fast item search, minimal navigation, high legibility, strong focus state, clear success/error acknowledgment.
- White-label by dynamic design tokens; no customer-specific CSS duplication.
- Always show connection status, pending sync count, shift status and current branch/device context in operational views.
- Protect high-risk actions: discounts, refunds, voids and destructive settings need role checks and explanation.
- Responsive for desktop-first POS; pilot-supported Android tablet view should be validated, not assumed perfect.
- Accessibility: semantic controls, keyboard-only cashier paths, contrast, screen-reader labels, readable error text; test with actual target devices.
- English initial experience; structure for Urdu and RTL/localization without promising full translation at launch.

## MVP screen inventory

| Screen ID | Screen | Primary actor | Essential states |
|---|---|---|---|
| UI-001 | Login / device enrollment | Cashier/owner | Online required, invalid login, revoked device |
| UI-002 | Organization / branch select | Multi-tenant user | No access, loading, branch unavailable |
| UI-003 | POS dashboard / shift start | Cashier | No shift, active shift, offline, grace/renewal notice |
| UI-004 | Menu & item picker | Cashier/waiter | Search, category, variants, disabled/unavailable |
| UI-005 | Cart / order details | Cashier | Draft, discounts, price/tax, validation errors |
| UI-006 | Payment / receipt | Cashier | Cash, unverified external tender, partial/failure, print |
| UI-007 | Kitchen queue/ticket view | Kitchen/cashier | Queued, attempted, printed, failed, reprint |
| UI-008 | Table view (when enabled) | Waiter/cashier | Empty/occupied/closed, disabled module |
| UI-009 | Shift close | Cashier/manager | Expected cash, count variance, approval |
| UI-010 | Basic reports | Owner/manager | Date/branch filters, no data, partial sync |
| UI-011 | Menu management | Manager/owner | CRUD, modifier constraints, archived item |
| UI-012 | Staff / role management | Owner | Invite, role/branch scope, revoke |
| UI-013 | Restaurant branding | Owner | Logo/color/receipt preview |
| UI-014 | Modules and workflows | Owner | Plan locked, tenant disabled, dependencies, pending order |
| UI-015 | Subscription and billing | Owner | Active, scheduled cancel, grace, suspended, invoices |
| UI-016 | Manual payment submission | Owner | Enter reference, pending verification, rejected |
| UI-017 | Data export & support | Owner | Queued/ready, suspended accessible, privacy |
| UI-018 | Platform tenant/invoice admin | Platform Admin | Verify/reject payment, override reason, audit |
| UI-019 | Offline sync diagnostics | Cashier/manager | Pending, retrying, conflict, unverified lease |
| UI-020 | Setup wizard | Owner | Branding, branch, menu, printer test, launch validation |

## Later phase screen inventory

`Inventory ledger`, `Recipe costing`, `Purchasing`, `Suppliers`, `Stock count`, `Customer CRM`, `Loyalty`, `Direct ordering storefront`, `Multi-branch reporting`, `Integrations and fiscal status`, `AI owner assistant`, `AI limits and usage`.

## Reusable components

Tenant logo/header; BranchSelector; OrderTypeSwitcher; CatalogGrid; ModifierPicker; CartSummary; QuantityControl; CashTender; PaymentStatus; KOTStatus; TableBadge; ShiftSummary; SyncStatus; SubscriptionNotice; PlanLockedState; PermissionDeniedState; ConfirmationDialog; DataExportAction; ConfigPreview; AuditHistory.

## User feedback patterns

- **Offline:** visible banner plus last confirmed sync; local acceptance must not be labeled "synced".
- **Pending / conflict:** action-level badges with safe retry and support instructions.
- **Subscription grace:** nonblocking owner notice with exact expiry; don't interrupt a cashier order mid-flow.
- **Suspended:** billing/exports still usable; new order disabled with clear reason and restore path.
- **Feature disabled:** hide navigation for cashier; show opt-in toggle or plan upgrade to owner only.
- **Printer failure:** show retriable print job with duplicate-ticket warning.
- **Processing external payment:** never display "paid" until policy-specific evidence is satisfied.

## UX acceptance examples

- Standard takeaway sale possible with keyboard and touch without unnecessary modal switches.
- Header always conveys branch, shift and offline state (or equivalent accessible location).
- No hidden financial changes; discounts and refunds show reason, actor and before/after amounts.
- Brand color change updates UI but cannot hide error/contrast indicators.
- Responsive adaptation does not compromise price totals, pay button visibility or sync information.

## Design dependencies

Actual Figma/screenshot layouts are **not present yet**. Codex must read `figma-handoff.md` before claiming any screen design is fully matched. When there is a mismatch, document it and follow the agreed source-of-truth precedence in `README.md`.
