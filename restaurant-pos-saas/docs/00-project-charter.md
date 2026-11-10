# 00 — Product Charter

## Vision

Create a low-cost, white-label, configuration-driven, multi-tenant SaaS POS for independent restaurants in Pakistan, beginning with Karachi. Position it as **run, control, and grow your restaurant** rather than merely a billing terminal.

## Customers and use cases

1. First beachhead: quick-service restaurants, burger/pizza shops, takeaway counters and small cafés.
2. Secondary: dine-in restaurants with tables, kitchen operations and multiple staff roles.
3. Later: multiple branches, centralized purchasing, online ordering, CRM and advanced integrations.

## Business constraints

- Target fee: **USD $10–15 equivalent monthly per restaurant/branch**, final PKR plans and tax treatment to validate; no unbounded per-order charges in the core offering.
- Initial 10–20 subscribed restaurants on shared backend infrastructure; capacity is a **hypothesis to load-test**, not a guaranteed SLA.
- Support burden and printer compatibility can exceed hosting costs; onboarding and hardware policy must stay simple.
- Start with one VPS and self-managed PostgreSQL, independent offsite backups. No Supabase required.
- No dedicated on-premise restaurant server for **single-terminal MVP**.

## Product differentiation hypotheses

- Faster, more reliable order-to-cash and shift reconciliation.
- Configurable modules and workflow templates by restaurant/branch without per-client code forks.
- Owner-level financial visibility (later recipe costing, wastage, settlement and profit estimates).
- Transparent local pricing, practical onboarding and owner-friendly remote insights.
- Extensibility for AI via structured domain events and permissioned reporting tools.

These are **hypotheses** and must be tested with restaurant owners and hands-on competitor demos; see `12-competitor-positioning.md`.

## Non-goals for initial production MVP

- Consumer food marketplace, advanced AI chat/forecasting, unlimited custom workflow designer.
- Fully distributed offline multi-terminal synchronization or reliable kitchen-tablet operation during a disconnected LAN without a tested local bridge.
- Automatic Foodpanda, Raast, FBR/SRB/PRA integrations before formal agreements and certification.
- Tauri shipping as part of first release; PWA is the initial client.

## Key product metrics

Activation (menu and first paid order), speed to complete checkout, offline command replay success, duplicate financial transactions (must be zero), failed printer jobs, completed cash shifts, daily reconciliation discrepancy, onboarding time, retention, support burden per tenant, gross margin per tenant, churn.

## Assumptions requiring explicit confirmation

- First supported device: Windows PC with modern Chromium browser; validate other browsers and Android hardware before promising them.
- First supported payment confirmation: cash and **manual recorded** noncash payment (not automatic payment verification).
- Initial invoicing obligations differ by jurisdiction and payment method; external fiscal certification is not yet complete.
- Design source and exact kitchen printer models to be provided by product owner.
