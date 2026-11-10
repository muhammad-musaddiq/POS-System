# 05 — API and Event Contracts (Proposed)

## General rules

- API prefix `/api/v1`. JSON via HTTPS. Auth/session on all protected routes.
- Every tenant route derives tenant from authenticated membership, not from a client-provided arbitrary ID. Branch access checked separately.
- Paginated lists with stable cursor where needed, validated filters, explicit scopes.
- Every create/financial mutation supports `Idempotency-Key` or immutable offline `commandId`.
- Responses include predictable error envelope `{ code, message, details?, requestId }`; never expose raw SQL or secrets.
- API responses carry `configVersion` or `entitlementVersion` when needed for stale client detection.
- Generate and publish OpenAPI. Shared frontend API client/types come from the contract rather than duplicative manual definitions.

## Proposed route index

| Area | Endpoint | Purpose |
|---|---|---|
| Identity | `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` | Manage sessions |
| Organization | `GET /me/tenants`, `GET /tenants/current` | Membership and current tenant |
| Branch | `GET /branches`, `POST /branches` | Branch selection/owner setup |
| Device | `POST /devices/register`, `POST /devices/{id}/revoke` | Device enrollment/revocation |
| Config | `GET /config/effective?branchId=...` | Resolve allowed features, branding, workflow |
| Config | `PUT /config/modules/{key}` | Owner setting with dependency validation |
| Config | `POST /config/workflows/publish` | Versioned workflow update |
| Catalog | `GET /catalog/snapshot`, CRUD `menu-items`, `categories`, `modifiers` | Online and offline catalog |
| Orders | `GET /orders`, `GET /orders/{id}` | Server order state/reporting |
| Orders | `POST /orders/{id}/void`, `POST /orders/{id}/refund` | Authorized corrections |
| Sync | `POST /sync/commands` | Replay queued local POS commands |
| Sync | `GET /sync/state?deviceId=...` | Server cursor/version/change feed |
| Shifts | `POST /shifts/open`, `POST /shifts/{id}/close` | Financial reconciliation |
| Reports | `GET /reports/sales`, `GET /reports/shifts` | Tenant-bound reporting |
| Billing | `GET /billing/subscription`, `GET /billing/invoices` | Owner billing visibility |
| Billing | `POST /billing/cancel-at-period-end` | Owner schedules cancellation |
| Billing | `POST /billing/undo-cancellation` | Owner reverses before expiry |
| Billing | `POST /billing/payment-reference` | Submit manual payment claim |
| Platform admin | `POST /platform/invoices/{id}/verify-payment` | Verify by authorized operator only |
| Export | `POST /exports`, `GET /exports/{id}` | Data export, including suspended customers |
| Health | `GET /health/live`, `GET /health/ready` | Deployment health |

## Offline command envelope

```json
{
  "commandId": "01K8...client-generated-unique-id",
  "deviceId": "device-uuid",
  "branchId": "branch-uuid",
  "schemaVersion": 1,
  "clientCreatedAt": "2026-11-10T10:00:00.000Z",
  "type": "order.create",
  "payload": {
    "orderId": "order-uuid",
    "orderType": "TAKEAWAY",
    "workflowConfigVersion": "version-id",
    "items": [{ "itemId": "item-uuid", "variantId": "variant-uuid", "qty": 2, "modifierOptionIds": [] }]
  }
}
```

**Server reply** (illustrative, not deployed):

```json
{
  "commandId": "01K8...client-generated-unique-id",
  "status": "ACKED",
  "serverVersion": 24,
  "result": { "orderId": "order-uuid", "canonicalOrderNumber": "B1-123" }
}
```

If the same command is sent again, return the stored result; if it violates current business rules, return an explicit resolvable conflict, not silent loss. Use strict payload schemas and versioned command handlers.

## Error codes (starter set)

`AUTH_REQUIRED`, `TENANT_FORBIDDEN`, `BRANCH_FORBIDDEN`, `MODULE_DISABLED`, `PLAN_LIMIT`, `SUBSCRIPTION_SUSPENDED`, `OFFLINE_LEASE_EXPIRED`, `CONFIG_VERSION_CONFLICT`, `ORDER_STATE_CONFLICT`, `PAYMENT_NOT_VERIFIED`, `PRINTER_UNAVAILABLE` (client-side adapter), `SYNC_RETRYABLE`, `VALIDATION_ERROR`.

HTTP status guidelines: 400 malformed request, 401 unauthenticated, 403 forbidden, 404 inaccessible/unavailable resource, 409 business conflict, 422 validation, 429 rate limit, 503 temporary dependency. Never let status codes be the sole machine-readable behavior.

## Transaction and event semantics

- `order.created`, `order.itemsChanged`, `kitchen.ticketIssued`, `order.paymentRecorded`, `payment.verified`, `order.closed`, `cashShift.closed`, `subscription.graceStarted`, `subscription.suspended`, `subscription.reactivated`, `config.published`.
- Emit through transactional outbox for durable side effects. Event payload references tenant, branch, aggregate ID, schema version and correlation ID.
- WebSockets later should be a notification mechanism, not the sole source of truth. Consumer refreshes authoritative state after disconnect/reconnect.

## Payment and fiscal boundaries

Recording `CARD` or `QR` manually is not proof of settlement. Future provider adapters must verify signatures/transactions and reconcile settlement batches. Fiscal invoice submissions are asynchronous and jurisdiction-specific. Order receipt and certified fiscal invoice are separate concepts.
