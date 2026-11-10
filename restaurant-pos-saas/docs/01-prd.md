# 01 — Product Requirements Document (PRD)

**Version:** 1.0 baseline · **Product:** Configurable white-label restaurant POS SaaS (Pakistan) · **Status:** Proposed scope for engineering and pilot validation

## 1. Users and roles

- **Platform Admin:** Tenant lifecycle, plan catalogue, verified payments, billing audit, technical support overrides.
- **Restaurant Owner:** Subscription, branding, branch settings, modules, roles, financial oversight, export.
- **Manager:** Menu, shifts, prices, permitted discounts/refunds, kitchen routing, operational reports.
- **Cashier:** Orders, payment recording, receipts, assigned shifts.
- **Waiter:** Table orders and progress (when enabled).
- **Kitchen:** Kitchen tickets and statuses (if the module is enabled).
- **Inventory/Storekeeper (Phase 2):** Purchases, stock counts, waste and adjustments.
- **Guest/Customer (Phase 3):** Direct-order channel.

Roles are templates; authorization should be expressed as granular permissions and organization/branch assignments.

## 2. SaaS tenant onboarding (MVP)

**FR-001:** Platform permits organization registration/invitation, email/phone verification as appropriate, organization creation, branch setup, and first owner assignment.

**FR-002:** Owner enters display name, address, timezone (Pakistan default), currency PKR, tax profile (configuration; fiscal adapter later), receipt header/footer, operating hours.

**FR-003:** Owner selects a plan, accepts terms, and can submit a manual invoice payment reference; **only operator-verified payment** activates a paid plan.

**FR-004:** Owner registers a POS device and performs first-sync/data download before offline use.

**FR-005:** Setup guide validates menu exists, shifts, printing and access before go-live.

## 3. Core catalog (MVP)

**FR-010:** Categories and items with name, SKU/internal code, price, tax treatment, active/archived, station assignment.

**FR-011:** Variants (e.g. regular/large, half/full) and modifier groups (extra cheese, spice), with per-item min/max selection constraints and price delta.

**FR-012:** Availability/toggle items, optional scheduled availability (later), item image optional; price snapshot persists at order time.

**FR-013:** Menu changes have effective versions, with devices receiving change notifications online and a safe refresh/reconciliation behavior offline.

## 4. POS and order lifecycle (MVP)

**FR-020:** Start dine-in or takeaway order. Delivery may be recorded manually when enabled; no automated dispatch integration in MVP.

**FR-021:** Add/modify/remove items before finalization; add notes, quantities, modifiers; all sensitive edits audit-trailed.

**FR-022:** Order flow configurable using predefined templates: `PAY_BEFORE_PREP` or `PAY_AFTER_PREP`; disabled modules must not cause dead ends.

**FR-023:** Dine-in table selection optional per tenant/branch; basic table list/status; complex split/merge tables deferred.

**FR-024:** Kitchen ticket creation when enabled; print attempt and retry state tracked; no guarantee of cross-device offline kitchen push.

**FR-025:** Order status: `DRAFT`, `PLACED`, `IN_PREP`, `READY`, `SERVED` (where relevant), `CLOSED`, `CANCELLED`; payment tracked separately, not conflated with order status.

**FR-026:** Cash, card-external, QR-external, transfer-external as recorded payment methods. Only cash may be locally confirmed by cashier; external methods are `RECORDED_UNVERIFIED` until evidence/provider confirmation or authorized manager verification policy.

**FR-027:** Discount percentage/fixed amount with caps and optional manager approval; consistent validation in app and API.

**FR-028:** Receipts render from immutable price/tax/payment snapshots; print/reprint activity logged. Fiscal invoice issuance requires certified adapter or explicit exception procedure.

**FR-029:** Reversals/voids/refunds require permissions, reason, and compensating entry; no destructive deletion of completed financial records.

## 5. Cash shifts and reports (MVP)

**FR-030:** Start/close cash shift per device/cashier with opening float, cash in/out, expected cash, counted cash and variance.

**FR-031:** Dashboard: gross/net sales, discounts, refunds, orders, tender breakdown, cash-shift reconciliation, pending offline sync, device connectivity.

**FR-032:** Export order/shift reports CSV and documented snapshot timestamp. Cost/profit estimates are out of MVP.

## 6. White-label and module configuration (MVP foundation)

**FR-040:** Tenant branding (name/logo/theme/receipt text); load at runtime without per-tenant build/deploy.

**FR-041:** Plan entitlements + tenant toggles + branch overrides + RBAC + mandatory compliance constraints determine effective capabilities.

**FR-042:** Modules: POS, orders, payment ledger, audit mandatory; kitchen printing, tables, manual delivery, dashboard reports optionally enabled. Inventory/CRM/AI flagged for later.

**FR-043:** Predefined workflow templates and settings. Existing orders retain the workflow config version under which they were opened.

**FR-044:** Disable operations must preserve data, reject unsafe changes while active workflows exist, and audit config edits.

## 7. SaaS subscriptions and cancellation (MVP)

**FR-050:** Plans include monthly prepaid term, per-branch capacity, allowed modules/usage limits, grace days, and add-on entries (later).

**FR-051:** Subscription statuses (not same as invoice statuses): `TRIAL`, `ACTIVE`, `PAST_DUE`, `GRACE`, `SUSPENDED`, `CANCEL_SCHEDULED`, `CANCELLED`, `TERMINATED`.

**FR-052:** On verified full payment, activate or renew; manual receipt screenshot is not proof of funds. Payment verification audited.

**FR-053:** Owner may schedule cancellation at term end and reverse before term ends; the system shows exact local effective date/time.

**FR-054:** Suggested 7-day grace on missed prepaid renewal; preserve core operation during grace, then controlled suspension after deadline. Reminders and exceptions logged.

**FR-055:** Suspend *new* paid operations but preserve pending order sync, history, export, invoices, support and reactivation. Current in-flight orders need a controlled completion period.

**FR-056:** Offline operation controlled by short-lived server-issued signed entitlement (proposed 72h lease), with clear warning and bounded emergency behavior. Browser clocks cannot be trusted as fully tamper-resistant.

**FR-057:** Data retention and export rights documented and legally reviewed. **Proposed** 90-day post-termination accessible recovery window, subject to accounting/tax obligations and final policy.

## 8. Offline and printing (MVP)

**FR-060:** Installable React PWA, cached application shell, IndexedDB local branch/menu data, transaction outbox with atomic local writes.

**FR-061:** Stable command IDs, idempotent API, conflict/retry states; no silent loss, duplication, or indefinite ambiguous payment success.

**FR-062:** Offline status indicator, pending item count, last successful sync, retry UI; app remains usable for the supported core operations.

**FR-063:** Pilot real receipt/KOT printers using browser-print and supported kiosk setup only where verified. Printer queue states and operator retry mechanism; avoid claiming silent printing across all browsers.

**FR-064:** A logged-in/authorized device with a synced active entitlement may operate offline. First launch, activation, onboarding and manual SaaS renewal require connectivity.

## 9. Phase 2 and later (out of MVP)

- **Phase 2:** Inventory ledger, recipes/BOM with versioned costing, suppliers, receiving, purchase orders, waste, count variances, expense capture, contribution margins, owner alerts.
- **Phase 3:** Direct online ordering, customer consent/CRM, loyalty, repeat ordering, restaurant domain, delivery zones and rider workflows.
- **Phase 4:** Advanced multi-branch, transfers, authorized payment providers, certified jurisdiction-specific tax integrations, Foodpanda where permitted, accounting exports.
- **Phase 5:** AI gateway, tool-based owner Q&A, demand forecasting, purchase suggestions, anomaly alerts, usage quotas, tenant-aware retrieval, human review for sensitive actions.
- **Optional Tauri:** Reuse domain/UI and replace storage/printing/hardware adapters if browser constraints warrant native desktop.

## 10. Non-functional requirements

See `03-technical-requirements.md` and `10-testing-acceptance.md`. Prioritize operational integrity, tenant security, recovery, observable failures, and performance in peak hours over nonessential visual effects.

## 11. Success criteria for controlled first release

A pilot restaurant completes realistic orders/receipts/KOT/shift-close; supports network loss/reconnect without loss or duplicate sales; tenant isolation verified; core config toggles and subscription grace/suspension verified; backup restore run; training and support documented. Exact timing/load SLAs set after real pilots and benchmarks.
