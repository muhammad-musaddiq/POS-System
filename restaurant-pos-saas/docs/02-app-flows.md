# 02 — Application Flows and User Journeys

All Mermaid diagrams are **target workflow models**, not claims that the functionality currently exists.

## A. System context

```mermaid
flowchart TD
 subgraph Restaurant
  PWA["Cashier POS — React PWA"]
  WEB["Owner/Manager Back Office"]
  KIT["Kitchen / Printer — supported devices"]
 end
 subgraph Local["Browser on POS device"]
  IDB[(IndexedDB)]
  SW["Service worker"]
  OUT["Durable outbox"]
 end
 subgraph VPS["Shared VPS — Docker Compose"]
  API["NestJS modular monolith"]
  DB[(PostgreSQL)]
  JOB["Workers / scheduled jobs"]
 end
 PWA <--> IDB
 PWA <--> SW
 IDB <--> OUT
 OUT -->|"Sync when online"| API
 PWA <--> API
 WEB <--> API
 PWA -->|"Print on supported setup"| KIT
 API <--> DB
 JOB <--> DB
```

No dedicated restaurant server for initial one-counter operation. Online kitchen displays require connectivity; offline multi-terminal coordination is a later capability with its own design and tests.

## B. Tenant onboarding and device activation

```mermaid
flowchart TD
 A["Register / invited owner"] --> B["Create tenant and first branch"]
 B --> C["Choose plan + accept terms"]
 C --> D["Payment reference or trial"]
 D --> E{"Payment verified or valid trial?"}
 E -->|No| F["Pending activation; billing-only access"]
 E -->|Yes| G["Branding and workflow preset"]
 G --> H["Menu, users, tax and receipts"]
 H --> I["Register and authenticate POS device"]
 I --> J["Sync menu and signed offline entitlement"]
 J --> K["Printer test and trial order"]
 K --> L{"Checks passed?"}
 L -->|No| M["Fix setup"] --> K
 L -->|Yes| N["Activate location"]
```

## C. Effective module resolution

```mermaid
flowchart TD
 A["User opens branch"] --> B["Load plan entitlements"]
 B --> C["Tenant enabled modules"]
 C --> D["Branch overrides"]
 D --> E["Permission checks"]
 E --> F["Dependencies + compliance"]
 F --> G["Effective capability set + config version"]
 G --> H["Render enabled navigation"]
 H --> I["Perform operation"]
 I --> J{"Server authorizes again?"}
 J -->|Yes| K["Persist audited action"]
 J -->|No| L["Deny with reason"]
```

## D. Order → kitchen → payment → close

```mermaid
flowchart TD
 A["Start order"] --> B{"Order type"}
 B -->|Takeaway| C["New cart"]
 B -->|Dine-in, tables enabled| D["Choose table"] --> C
 B -->|Manual delivery enabled| E["Customer/address details"] --> C
 C --> F["Select items/variants/modifiers"]
 F --> G["Capture tax/price/workflow version snapshot"]
 G --> H{"Configured payment order"}
 H -->|Before preparation| I["Take payment"]
 H -->|After preparation| J["Place order / kitchen ticket"]
 I --> J
 J --> K["Kitchen accepts and prepares if enabled"]
 K --> L["Ready/served or handoff"]
 L --> M{"Fully paid?"}
 M -->|No| I
 M -->|Yes| N["Close order, receipt and audit"]
 N --> O["Update shift, reporting and sync state"]
```

Payment and food-preparation states are separate. Refund/void follows authorization and compensating-event workflows, not record deletion. If kitchen module disabled, skip kitchen states safely.

## E. Cash shift close

```mermaid
flowchart TD
 A["Cashier opens shift with float"] --> B["Collect cash sales and cash movements"]
 B --> C["Request shift close"]
 C --> D["Count cash and submit"]
 D --> E["Calculate expected cash and variance"]
 E --> F{"Variance threshold breached?"}
 F -->|Yes| G["Reason + manager review"] --> H["Freeze close record"]
 F -->|No| H
 H --> I["Report and audit event"]
```

## F. Offline sync

```mermaid
flowchart TD
 A["Authenticated PWA with cached data"] --> B["Cashier creates operation"]
 B --> C["Atomic IndexedDB: local record + outbox"]
 C --> D["Update UI and local print attempt"]
 D --> E{"Internet available?"}
 E -->|No| F["Queue stays; show pending badge"] --> E
 E -->|Yes| G["Send command with stable ID"]
 G --> H["Backend validates tenant/device/lease"]
 H --> I{"Already applied?"}
 I -->|Yes| J["Return prior ack"]
 I -->|No| K{"Valid / conflict?"}
 K -->|Valid| L["Commit server transaction once"] --> J
 K -->|Retryable| M["Backoff and retry"] --> G
 K -->|Conflict| N["Hold for supervised resolution"]
 J --> O["Mark locally ACKED; reconcile"]
```

## G. Cancel vs non-payment

```mermaid
flowchart TD
 A["ACTIVE"] --> B{"Owner cancels?"}
 B -->|Yes| C["CANCEL_SCHEDULED; paid features continue"]
 C --> D{"Term ended?"}
 D -->|Yes| E["CANCELLED; export/recovery rights"]
 D -->|No, withdraw| A
 B -->|No| F{"Renewal verified?"}
 F -->|Yes| A
 F -->|No| G["GRACE; reminders; POS runs"]
 G --> H{"Paid within 7 days?"}
 H -->|Yes| A
 H -->|No| I["SUSPENDED: no new paid sales"]
 I --> J["Keep historic access + pending sync + renew"]
 J --> K{"Payment verified?"}
 K -->|Yes| A
 K -->|No after policy window| L["TERMINATED, retention procedure"]
```

Cancellation at end of term does not initiate a fresh paid month. Pending local work is still accepted under a controlled reconciliation procedure even after suspension.

## H. Config change while orders exist

```mermaid
flowchart TD
 A["Owner edits enabled module / workflow"] --> B["Validate entitlement, dependencies, role"]
 B --> C{"Safe change now?"}
 C -->|No| D["Block or require staged activation"]
 C -->|Yes| E["Publish new version + audit"]
 E --> F["New orders use new workflow version"]
 E --> G["Open orders retain previous version"]
 F --> H["Online devices refresh; offline reconcile"]
 G --> H
```

## I. Inventory & costing (Phase 2)

```mermaid
flowchart TD
 A["Recipe and supplier costs"] --> B["Order item sold"]
 B --> C["Inventory consumption movement"]
 C --> D["Expected stock and low-stock rules"]
 D --> E["Purchase suggestion"]
 E --> F["Approved PO and goods received"]
 F --> G["Stock ledger + cost update"]
 G --> H["Physical count and variance"]
 H --> I["Contribution and estimated profit report"]
```

## J. AI owner chat (Phase 5)

```mermaid
flowchart TD
 A["Owner asks question"] --> B["AI gateway + tenant permissions + quota"]
 B --> C["Allowlisted reporting tool"]
 C --> D["Tenant-scoped query and deterministic calculation"]
 D --> E["Structured evidence and confidence"]
 E --> F["Hosted model composes explanation"]
 F --> G["Safe response + usage/audit log"]
```

## Unresolved flow questions

Kitchen acknowledgment with browser print only; external card confirmation procedure; tax invoice approval; exact trial/suspension/cancellation notices; multiple cashier terminals per branch. Record decisions in `13-decisions-and-open-questions.md` rather than inventing behavior.
