# 06 — Offline PWA, Synchronization and Printing

**Risk rating:** Critical. Implement/test early rather than after finishing the UI.

## Goals and boundaries

- A pre-activated single POS device can sell during temporary connectivity outages.
- Every local accepted operation survives refresh/crash as far as browser storage permits, with a visible pending/synced state.
- Backend applies every command at most once; client can retry without duplicating payments or orders.
- Thermal printer and KOT workflows are verified against actual restaurant devices before claims of support.
- No guarantee of coordinated offline operation across multiple tablets without a branch-local coordinator or equivalent tested design.

## Data on the device

**IndexedDB stores:** per-device branch/tenant metadata, menu snapshot + version, workflow/entitlement snapshot, local order draft, append-only command outbox, print job status, last-sync cursor.

**Do not store:** card PAN/CVV, privileged platform tokens, unnecessary customer personal details. Minimize authentication material; use appropriate secure storage/cookie strategy and signed short-term device entitlement.

## Atomic local command creation

1. Validate local permission, workflow, price/entitlement snapshot and input.
2. Generate `commandId` and local IDs.
3. In **one IndexedDB transaction**, write local projection and corresponding unsynced command.
4. Commit before reporting action as locally saved. Clearly label local acceptance vs server acknowledgment.
5. Queue printing independently with correlation ID; printing failure must not silently undo accepted order.

## Outbox state machine

`PENDING -> SENDING -> ACKED` on success; `SENDING -> RETRYABLE_ERROR -> PENDING` on transient error; `SENDING -> CONFLICT` for business mismatches. Use exponential backoff with jitter, concurrency limits, dependency ordering and batch size cap.

Do not rely only on Background Sync API. Trigger on app focus/open, online event and periodic foreground checks; show manual retry. Service worker cache updates must not remove local IndexedDB records.

## Server command application

- Authenticate device/actor, resolve tenant/branch, entitlement and command schema version.
- Check command ID unique key in a DB transaction. If already accepted, return prior acknowledgment.
- Validate state transitions, totals and permissions, execute writes and store response atomically.
- Never use blind last-write-wins for order payments or completed orders; conflicts go to manager review queue.
- Sync completion is a **server acknowledgment**, not merely successful HTTP transport.
- Pending commands created under a previously valid entitlement can be received for reconciliation after plan suspension; enforce documented proof/window and fraud review.

## Ordering and dependencies

Examples: `order.create` must precede `order.addItems`; `payment.record` must reference an existing order and must not be applied twice; `order.close` requires allowed payment state. Include aggregate version/revision for optimistic concurrency; safe merge for menu metadata may be different from payment conflicts.

## Printer and kitchen ticket plan

- PWA uses `PrinterAdapter` with explicit supported devices/setup. Browser `window.print()` often invokes a print dialog; silent thermal printing is not universally guaranteed.
- MVP acceptance must include 58mm/80mm printer models selected by pilot restaurants, correct encoding, paper width, cut behavior (where supported), and retries.
- Print jobs identified by stable `printJobId`, `orderId`, `ticketRevision`, `destination` and `status` (`QUEUED`, `ATTEMPTED`, `OPERATOR_CONFIRMED`, `FAILED`).
- Retrying KOT must visibly identify possible duplicate tickets when printer success is uncertain; printing is not inherently exactly-once.
- For kitchen display on a second tablet, online updates are supported; **when internet is lost, cross-device realtime is not available in this architecture** unless explicitly adding a local communication mode.

## PWA entitlement and expired subscription

- Online server issues signed short-lived capability lease (proposed 72h) containing tenant, device, allowed modules, issued/expiry, config version and signing key ID.
- PWA warns as expiration approaches; on expiry, follow bounded emergency-in-flight-completion policy, do not silently corrupt local shifts/orders.
- Client clock can be manipulated; use last verified server timestamp and monotonic elapsed time where available as risk mitigation, not ironclad protection.
- Backend remains authoritative upon reconnect; maintain a fraud/exception audit trail. Define how pending local sales sync during suspension (billing document).

## Recovery and failure matrix

| Scenario | Expected behavior |
|---|---|
| Internet disconnects before checkout | User can create supported order; queue persisted |
| Network drops after server commits but before reply | Retry same command ID; API returns original result |
| Browser tab crashes after local transaction | Outbox survives reload if storage intact |
| IndexedDB quota/eviction/storage clear | Display critical warning / recovery procedure; cannot promise full recovery without cloud sync |
| Printer is unavailable | Order saved; printer job shown for retry / supervised handling |
| Two devices edit same order | Server rejects conflicting revision; manager resolves |
| Subscription suspended while device offline | Lease bounds offline work; existing queued operations reconciled; new cloud commands restricted |
| App updates during shift | Migration preserves outbox and active order projections |

## Validation harness and go-live checks

Automated offline replay/idempotency tests; simulated server errors; browser storage quota/refresh tests; real printer matrix; disconnect/reconnect while 20+ operations pending; atomic write/crash simulation; repeated refund/payments; complete unsynced export for support when practical. Record exact browser/hardware versions.

## Tauri migration readiness

`StorageAdapter` swaps IndexedDB for SQLite, `PrinterAdapter` swaps browser printing for OS/native transport, and packaged assets replace service-worker app shell. Domain commands, NestJS API and sync protocol should remain reusable. No unplanned local server needs to be installed at restaurants.
