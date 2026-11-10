# 13 — Architecture Decision Register and Open Questions

**Maintainer:** Product owner + implementation lead. Add entries with date, decision, motivation, consequences, and affected docs. Never silently overwrite past decisions; mark a decision superseded.

## Confirmed / selected for planning

| ID | Date | Decision | Rationale |
|---|---|---|---|
| ADR-001 | 2026-11-10 | Pakistan restaurant white-label multi-tenant SaaS | Same product, tenant-specific identity/modules/workflows |
| ADR-002 | 2026-11-10 | Initial POS is **React + Vite PWA** | Broad device support and simpler launch; Tauri optional later |
| ADR-003 | 2026-11-10 | API NestJS, ORM Prisma, PostgreSQL | Structured shared domain and transactional store |
| ADR-004 | 2026-11-10 | Self-host database and API on one low-cost VPS initially | Avoid Supabase subscription at low MRR; accept operations burden |
| ADR-005 | 2026-11-10 | 10–20 restaurants initial planning cohort, $10–15/month target | Constraints for hosting/onboarding design |
| ADR-006 | 2026-11-10 | Feature entitlements + tenant/branch toggles + versioned workflow presets | Configurable restaurant operations without tenant forks |
| ADR-007 | 2026-11-10 | Subscription cancellation at term end, grace then controlled suspension | Predictable billing and protects in-progress operations |
| ADR-008 | 2026-11-10 | AI-ready data and module boundaries; AI later | Avoid early API/GPU cost while preserving extensibility |
| ADR-009 | 2026-11-10 | Design supplied separately to Codex; design folder contains requirements | Avoid inventing or replacing the user-approved design |

## Proposed defaults (not yet externally validated)

| ID | Proposal | Needs validation |
|---|---|---|
| P-001 | 7-day grace, day-8 suspension | Customer terms, payment behavior |
| P-002 | 72h signed offline lease | Operational reality, anti-abuse and clock behavior |
| P-003 | 90-day post-termination recovery/export window | Legal/accounting retention requirements |
| P-004 | First release one branch/one primary cashier device | Actual target restaurant hardware needs |
| P-005 | Manual SaaS payment verification; online gateway later | Staff procedure, bank provider, fraud controls |
| P-006 | 4 vCPU/8GB VPS initial candidate | Real load, hosting pricing and measured p95 |
| P-007 | Ant Design + Tailwind for back office; shared design tokens | User-provided design and POS touch ergonomics |

## Open questions requiring owner/pilot feedback

- **OQ-001:** What are the actual designs/Figma URLs and source exports? Do not implement pixel-specific screens before reference is provided.
- **OQ-002:** Target devices/OS and exact thermal printers? Can pilot staff tolerate browser print dialogs?
- **OQ-003:** First-customer requirement for kitchen tablet offline vs printed KOT?
- **OQ-004:** Exact tier pricing in PKR, taxes, per-branch/terminal charges and plan quotas?
- **OQ-005:** Final cancellation/refund/renewal behavior and commercial terms?
- **OQ-006:** Allowed time to finish in-flight orders after suspension, and interpretation of disconnected operations?
- **OQ-007:** Which province/restaurant tax categories require certified fiscal integration before live rollout?
- **OQ-008:** Is a basic dine-in table module required by first pilots? Are split bills needed immediately?
- **OQ-009:** Which payment methods are truly verified online vs manually marked by manager?
- **OQ-010:** Backup recovery objectives and support hours acceptable at $10–15/month?
- **OQ-011:** First-phase revenue/metrics dashboard details from design references?

## Decision-change template

```
ADR-XXX | YYYY-MM-DD | Proposed / Accepted / Superseded
Decision:
Context / alternatives:
Why selected:
Impact on product, database, API, UI, offline, billing:
Risks / rollback:
Docs and backlog items updated:
Approver:
```
