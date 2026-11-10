# Implementation Rules (Normative)

## 1. Workflow

- Make changes in small tasks from `delivery/backlog.md`; one ticket should be reviewable and testable.
- Never mark a ticket complete solely because code was written. Complete only with tests, acceptance criteria, migrations where relevant, and doc/handoff updates.
- Maintain task states: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`. Store current context in `handoff/`.
- Do not silently change approved scope, billing policy, security assumptions, architecture or user journeys. Propose an ADR/change and record decision first.
- Keep relevant Mermaid diagrams, API examples and DB schema aligned with code. State uncertainty where not verified.

## 2. Code style and repository

- TypeScript strict mode across frontend and backend. Use consistent ESLint/Prettier config; avoid `any` unless narrowly justified.
- Prefer feature-first modules with explicit boundaries. Shared DTOs/types may live in packages; no direct frontend imports from backend database code.
- Use runtime validation for all untrusted data; structured error codes; UTC timestamps in database and Asia/Karachi for restaurant displays/billing.
- No magic flags in components. Feature availability comes from a centralized effective-entitlement resolver.
- Keep business domain distinct from UI and adapters (`StorageAdapter`, `PrinterAdapter`, `SyncTransport`, `PaymentProvider`, `TaxProvider`, `AIProvider`).
- Treat restaurant-specific branching logic as versioned configuration, not cloned code or hard-coded tenant IDs.

## 3. Data and financial integrity

- PostgreSQL with Prisma; tenant-scope every query, including nested relations and reports.
- Use integer minor currency units (PKR paisa) and explicit tax/rounding rules; never JS floating-point for payable amounts.
- Payment outcomes must be verified; a cashier selection is not proof of a successful external payment.
- Treat order/payment/refund/stock/billing history as auditable. Use compensating entries, not destructive rewrites.
- Include schema migrations, indexes, foreign keys and rollback guidance. No production database resets.
- Untrusted client timestamps do not determine server billing entitlements or definitive accounting order.

## 4. Offline PWA

- Persist operations and an outbox **atomically** in IndexedDB; distinguish `pending`, `sending`, `acked`, `conflict`, `retryable_error`.
- Use stable `command_id` and an idempotency key; replay must not double-charge or double-create a sale.
- Do not promise offline multi-terminal consistency, kitchen push to another device, automatic fiscal submissions, or payment confirmation without functioning infrastructure.
- Browser printing must be tested with target printers; fallback must be explicit, not assumed.
- Notify operators about unsynced records and degraded connectivity. Never wipe them on logout/update.

## 5. Security and privacy

- Apply RBAC and module entitlements in the NestJS backend. Authenticate every device/session and rate-limit sensitive operations.
- Never store payment card PAN/CVV or unneeded personal customer data in local storage.
- Credentials, signing keys and DB URLs are environment secrets; log redaction is mandatory.
- Use tenant-scoped AI tools; no cross-tenant vector search or arbitrary LLM-generated SQL execution.
- Collect minimum customer information and document retention/export rules. Tax integrations require jurisdiction-specific validation.

## 6. Documentation changes and handoff

- Every completed task must update `delivery/backlog.md` and `handoff/CURRENT_STATE.md`.
- If partial: detail files edited, commands run, exact next steps, blockers and tests not run in `handoff/INCOMPLETE_WORK.md`.
- Keep `handoff/NEXT_PROMPT.md` ready-to-paste with the next actionable task and strict constraints. It must never say a task is complete when it isn't.
- Append dated session notes in `handoff/SESSION_LOG.md`.
- Update `docs/13-decisions-and-open-questions.md` for approved architecture/product policy changes.
