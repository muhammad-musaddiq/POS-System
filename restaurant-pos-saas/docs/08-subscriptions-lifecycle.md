# 08 — Subscriptions, Cancellation, Grace, Suspension and Data Recovery

**Status:** Product policy proposal subject to payment provider/local legal review. **Revenue:** target USD $10–15 equivalent per restaurant/branch/month, billed in PKR after price selection; paid features are entitlement-driven.

## Definitions

- **Subscription** represents plan/tenant access and effective period; **invoice** represents money owed; **billing payment** represents verified money received. These are distinct entities.
- **Customer order payment** belongs to restaurant operations and must not be mixed with SaaS billing.
- **Plan entitlements** determine paid capabilities; owner toggles determine which permitted features they choose to use.

## Subscription states

| Status | Definition | New POS sales? | Billing/export? |
|---|---|---|---|
| `TRIAL` | Valid trial, terms accepted | Yes, within trial policy | Yes |
| `ACTIVE` | Period prepaid and current | Yes | Yes |
| `CANCEL_SCHEDULED` | Owner requested end-of-period cancellation | Yes until term end | Yes |
| `PAST_DUE` | Renewal invoice due, awaiting verification | Transitional | Yes |
| `GRACE` | Late payment inside 7-day grace | Yes, show notices | Yes |
| `SUSPENDED` | Grace ended, no verified renewal | No new cloud sales; controlled in-flight/offline reconciliation | Yes |
| `CANCELLED` | Voluntary term expired | No new paid sales | Yes, under retention policy |
| `TERMINATED` | Later offboarding under published policy | No | Limited per legal/contract terms |

Use a state machine to avoid incompatible statuses; `cancel_at_period_end` can be a flag or explicit schedule state, but choose one canonical implementation. Maintain event history.

## Voluntary cancellation

1. Only authorized owner may cancel through Billing Settings.
2. Show current paid-through timestamp, future charges, feature access, data export and retention conditions.
3. Default cancellation is **at the end of already-paid period**, not immediate termination; scheduled future renewals stop.
4. Continue normal operations until `current_period_end` if subscription otherwise valid.
5. Allow undo of cancellation until the deadline; audit both actions.
6. At term end, transition to `CANCELLED`, do not generate new prepaid charges, restrict new sales, keep historical records/export available by policy.
7. Refund exceptions are manual/documented until the commercial refund policy is approved.

## Non-payment lifecycle (proposed defaults)

| When | Action |
|---|---|
| At renewal | Issue invoice; if verified payment absent mark overdue; remind owner |
| Days 1–3 | Grace, nonblocking alert in POS/back office, core selling allowed |
| Days 4–7 | Stronger alerts, exact suspension timestamp, payment and contact options |
| Start of day 8 | Controlled suspension, restrict *new* paid operations, preserve sync/export |
| After verified payment | Reactivate existing tenant/devices, refresh entitlements |
| Later | Termination/retention only after disclosed notices and legal review |

The exact cutoff is calculated server-side in **Asia/Karachi** business date/time. The policy must be represented in UI and terms, not silently changed.

## During suspension

**Allow:** sign-in for billing/export/support, read historic orders/reports, view invoices, verify payment, upload/export records, sync already-created queued commands and finish explicitly permitted in-flight work. **Block:** new paid orders, new kitchen tickets and new usage charges that require subscription entitlement. Provide clear error status and help options.

**Do not discard unsynced orders or refuse historical reconciliation solely because current subscription is suspended.** Use timestamp/proof/lease checks and an audited exception process, with anti-fraud safeguards.

## Offline access lease

Proposed 72-hour signed offline entitlement per device, issued while online and valid. PWA warns before expiry and follows limited emergency completion policy at expiry. **Do not assume browser storage or clock is tamper-proof.** On reconnection server validates lease history and reconciles pending commands. Explicitly distinguish a command *created during paid/grace interval* from one created after suspension; investigate ambiguous cases without deleting client history.

## Payment collection (MVP)

- Prepaid invoices issued monthly. Restaurant may transfer by bank/Raast or approved wallet transfer.
- Payment reference or screenshot = **claim**, not confirmed payment.
- Authorized platform admin verifies actual receipt and then records `billing_payments` and activates/renews exactly once.
- Duplicate claims and payment webhooks must be idempotent; preserve verification audit.
- Later payment gateway supports hosted checkout and signed webhook verification; no direct handling of raw card details.

## Late renewal handling

Recommended commercial rule: payment within grace retains original monthly cycle; payment after suspension starts new paid cycle on verified reactivation. Do not generate indefinite past-due debt without explicit customer agreement. Record invoice adjustments, reactivation and changes in billing ledger. Finalize with accounting/legal review.

## Data export and retention

- Owner can request downloadable orders, payments, menu, inventory (if enabled) and invoice/billing history, with appropriate restrictions on other users' personal information.
- Propose 90-day post-termination recovery/export window, **not a guarantee of deletion after 90 days**; fiscal/accounting records may require longer retention.
- Automate advance notices; ensure backup retention/deletion responsibilities are defined; do not delete tenant data automatically on missed payment.

## Admin UI and jobs

Required jobs: renewal invoice creation; reminders; due/grace/suspension transition; scheduled cancellation; support exception expiry; export and retention notices; stalled payment claims. Each job is idempotent and audit-logged. Support overrides have actor, reason and expiry time.

## Examples

- Paid Nov 1–30, cancel Nov 12 -> access through Nov 30, cancellation Dec 1 local, no December renewal.
- Renewal due Dec 1, unpaid -> GRACE until end Dec 7, suspend Dec 8 unless verified payment/approved extension.
- Payment received Dec 10 -> reactivation on verified payment, no recreation of tenant or loss of history.

## Decisions still needed

Trial length, final PKR plans, tax on SaaS service invoice, payment proof procedure, permitted in-flight-order completion interval, precise lease/clock policy, refund terms, legally compliant retention and support hours. Log in `13-decisions-and-open-questions.md`.
