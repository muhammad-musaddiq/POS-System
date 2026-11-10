# 07 — White-label Branding, Feature Modules and Workflow Configuration

## Principles

1. **Shared codebase:** Per-tenant branding and configuration loaded at runtime; no cloned apps per customer.
2. **Configuration hierarchy:** Plan entitlement -> tenant toggle -> branch override -> RBAC permission -> dependencies -> compliance/must-have invariants.
3. **Stable workflow templates:** Configure allowed operations, not arbitrary customer-authored state machines in MVP.
4. **Version everything:** Workflow edits affect new orders; existing orders reference previous version.
5. **Turning off a feature never deletes its historical data.**

## What is white-labeled?

Display name, logo, primary/accent colors, receipt template, business information, default language (English first; Urdu-ready), localized labels, business contact details, optional restaurant subdomain. Phase 3 may add custom domain and customer ordering site branding.

PWA manifest name/icons vary by tenant only if manifest delivery and caching are implemented/tested. Runtime app branding does not automatically imply each tenant has a distinct standalone app store listing.

## Module catalogue

| Feature key | MVP | Default | Dependency | Notes |
|---|---|---|---|---|
| `core.pos` | Yes | On | Always mandatory | Cannot disable |
| `core.order_ledger` | Yes | On | POS | Mandatory |
| `core.payment_ledger` | Yes | On | POS | Mandatory |
| `core.audit` | Yes | On | POS | Mandatory |
| `kitchen.print` | Yes | Optional | POS, printer config | Supports printer matrix only |
| `kitchen.display` | Later/pilot | Off | Kitchen orders | Online unless local bridge |
| `tables.basic` | Yes | Off | POS | Dine-in supported when on |
| `orders.delivery_manual` | Yes | Off | POS | No courier APIs |
| `reports.basic` | Yes | On for owner | Orders | Role-restricted |
| `inventory` | Phase 2 | Off | Catalog | Ledger-backed |
| `recipes` | Phase 2 | Off | Inventory | Cost snapshots |
| `customers` | Phase 3 | Off | POS | Consent rules |
| `loyalty` | Phase 3 | Off | Customers | Ledger |
| `online_ordering` | Phase 3 | Off | Catalog, payment policy | Not a marketplace |
| `multi_branch_advanced` | Phase 4 | Off | Branches | Centralization |
| `ai.owner_chat` | Phase 5 | Off | Reports, AI quota | Tenant-scoped tools |

### Effective capability example

```ts
// Pseudocode only. Security-sensitive checks also run on backend.
const available = planAllows(feature)
  && tenantEnabled(feature)
  && branchEnabledOrInherited(feature)
  && roleAllows(actor, permission, branch)
  && dependenciesSatisfied(feature)
  && policyAllows(feature, context);
```

Plan entitlements and current subscription state are independent from the owner's UI preference. If the Growth plan includes inventory, the owner may turn it off without losing the purchased entitlement; the module and history remain recoverable when reenabled.

## Workflow templates

| Template | Order-to-payment sequence | Optional flags |
|---|---|---|
| `QUICK_SERVICE_PREPAY` | Create -> pay -> kitchen/fulfill -> close | KOT optional, receipt at payment |
| `TABLE_SERVICE_POSTPAY` | Table -> order -> kitchen -> serve -> pay -> close | Tables required, manager discount |
| `COUNTER_POSTPAY` | Order -> kitchen/fulfill -> pay -> close | No tables needed |
| `TAKEAWAY_NO_KITCHEN` | Order -> pay -> handoff | Kitchen disabled |

Settings include `require_table`, `allow_manual_delivery`, `kitchen_routing`, `payment_timing`, `discount_approval_threshold`, `refund_approval_required`, `receipt_template`, `tax_profile`, `cash_shift_required`. Do not allow unsafe combinations, such as template requiring tables when tables module disabled.

## Publishing configuration

1. Owner edits draft.
2. Server verifies plan availability, dependencies, permissions, branch compatibility and open workflows.
3. Persist versioned config with actor and effective timestamp.
4. Apply new version to newly created orders; preserve old version for open orders.
5. Online devices receive configuration changed notification and refresh; offline PWA reconciles on next sync.
6. Admin can audit past versions and perform safe rollback as a **new** published version.

## Branding and permissions example

A takeaway outlet may disable tables, CRM and inventory and choose `QUICK_SERVICE_PREPAY`; a café may enable tables and `TABLE_SERVICE_POSTPAY`; a manager can view inventory only if the module is enabled and that manager's role grants the permission. The server must independently check the effective capability even if UI navigation is hidden.

## Changes to record in design handoff

Every optional module must define: navigation visibility; empty state; disabled state; plan upgrade CTA if feature not entitled; loading/sync state; permissions denied state; behavior when configuration changes while tab is open. See `design/requirements.md`.
