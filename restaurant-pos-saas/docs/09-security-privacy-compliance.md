# 09 — Security, Privacy, Access and Pakistan Compliance Boundaries

**Status:** Engineering baseline, not legal advice or a certification claim. Obtain professional verification for provincial/federal tax and data-retention obligations before paid fiscal rollout.

## Risk model

Core risks: cross-tenant data access, cashier fraud, duplicate payments after sync, lost offline orders, unauthorized refund/discount, billing bypass, printer/KOT mismatch, compromised devices, PII leakage and uncertified invoice treatment.

## Multi-tenant data isolation

- Every tenant-owned table carries `tenant_id`, branch-owned data also carries `branch_id`.
- Authorize authenticated tenant membership, branch assignment and permission on **every** request including downloads, exports, background jobs, WebSockets and AI tools.
- Add automated IDOR tests: guessing another tenant's order ID never returns data; prevent tenant hopping with nested relations and raw SQL.
- Use row-level security as defense in depth where implementation and pooling allow correctly scoped DB sessions; least-privilege DB accounts.
- Audit platform support impersonation and restrict to authorized just-in-time access.

## Secrets and sessions

- Secrets never stored in git or unredacted logs. Protect environment files, deployment keys, database passwords and API tokens.
- HTTPS, secure cookie/token policies, device enrollment/revocation, refresh token rotation, rate limiting and lockout for suspicious login.
- Backups encrypted, stored separately, restore-tested. Maintain DB patches, firewall, SSH keys and private PostgreSQL listener.
- PWA offline cached credentials/access only for previously authenticated devices; never cache password or payment card details.

## Roles, payments and fraud controls

- Action-level permissions (`discount.approve`, `order.void`, `refund.issue`, `shift.close`, `subscription.verify_payment`) checked server-side.
- Confirm external tender settlement via authorized provider integration or clearly documented manual verification; record confirmation source/actor.
- Use append-only or compensating financial entries with reasons, actor/device IDs and timestamps; sensitive actions require manager approval.
- Discount limits, refunds and branch transfers must be validated against current subscription and permissions.

## Privacy and consent

- Store only necessary customer details for orders; separate optional marketing opt-in from operational communication.
- Define privacy policy, support access rules, customer data export, tenant offboarding and retention by record class.
- Do not store PAN, CVV, full card details or unnecessary identity records. Mask phone numbers in support logs and analytics.
- AI chat later must not expose other tenants' data or treat uploaded text as instructions to perform privileged operations.

## Pakistan fiscal and payment integrations

- Sindh Revenue Board (SRB), Punjab Revenue Authority (PRA), other provincial revenue authorities and FBR can have differing requirements and conditions. Do **not** assume a single universal API.
- Tax profiles must separate jurisdiction, taxable service, rate, payment method rules where applicable, effective dates and fiscal invoice submission status.
- Connect to approved integrators and test/obtain required approvals before advertising official compliance. Ensure retry/reconciliation and offline fiscal exceptions.
- Raast dynamic QR and gateway recurring payments require authorized bank/provider integration and real settlement confirmation; QR presentation itself is not payment verification.
- Tax/receipt legal and retention requirements should be confirmed for each target restaurant type and province.

## Compliance sources for future verification

- Sindh Revenue Board POS: https://www.srb.gos.pk/srb/point-of-sale-pos/
- Federal Board of Revenue: https://www.fbr.gov.pk/
- State Bank of Pakistan Raast: https://www.sbp.org.pk/our-subsidiaries/raast/raast-person-to-merchant

Review official/current documentation during integration design; these links are research starting points, not approval evidence.

## Minimum security release gates

1. Tenant isolation automated tests pass across all endpoints and jobs.
2. Financial actions audited and role-gated; duplicate payment/refund tests pass.
3. No exposed database port, default secrets, or unencrypted public backups.
4. Offline local data threat review, revocation procedure and recovery UX documented.
5. Published privacy/data export/retention and service access policies reviewed.
6. Fiscal adapter only marked `CERTIFIED` after verified approval/integration test; otherwise show clear `NOT_CONFIGURED`/`PENDING` state.
