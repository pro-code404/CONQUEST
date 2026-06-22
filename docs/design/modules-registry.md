# Module Registry

Every module owns an independent workspace. This document defines zones, content, and drill-downs.

---

## Dashboard

**Purpose:** Cross-model executive overview.

| Zone | Content |
|------|---------|
| Executive | 6–8 Smart Summary Cards (user-configurable) |
| Visualization | Multi-reach timeline (Content + Product + Revenue) |
| Operational | Active automations, top recommendations, integration health |
| Recommendations | "Top 3 actions today" with confidence |

---

## Analytics

| Zone | Content |
|------|---------|
| Executive | Reach, Growth, Revenue, Engagement, Traffic, Conversions |
| Visualization | Performance timeline (hover intelligence required) |
| Operational | Campaigns table, Audience segments, Traffic sources |
| Forecast | 30/60/90d prediction panel with invalidation conditions |

**Drill-downs:** Metric → Channel → Campaign → Asset → Audience → Revenue

---

## Content Intelligence

| Zone | Content |
|------|---------|
| Executive | Scheduled, Published, Engagement, Ideas queue, SEO score |
| Visualization | Publishing calendar heatmap |
| Operational | Content library, Ideas board, Competitor comparison |
| AI | Content suggestions with confidence |

**Sub-views:** Calendar | Library | Ideas | Performance | SEO | Social cross-performance

---

## Commerce Intelligence

| Zone | Content |
|------|---------|
| Executive | Revenue, Orders, AOV, Conversion, Refunds, LTV |
| Visualization | Revenue + product reach timeline |
| Operational | Products, Funnels, Customers, Abandoned carts |

**Purchases drill-down:** Total → Store → Product → SKU → Channel → Customer → Campaign

---

## Social Intelligence

| Zone | Content |
|------|---------|
| Executive | Followers, Likes, Comments, Shares, Reach, Engagement quality |
| Visualization | Platform reach comparison |
| Operational | Posts table, Audience clusters, Sentiment, Bot % |

**Followers drill-down:** Total → Platform (IG, FB, TikTok, X, LI, YT, Pin, Threads) → Geo → Demographic → Conversion

**Likes drill-down:** Same platform expansion pattern

---

## Automation

| Zone | Content |
|------|---------|
| Executive | Running, Queued, Success rate, Failures, Latency, Cost |
| Visualization | Execution timeline + queue depth |
| Operational | Workflow list, Execution logs, Failure inspector |
| Actions | Create automation from template |

---

## Research

| Zone | Content |
|------|---------|
| Executive | Active research, Confidence avg, Gaps, Sources |
| Visualization | Evidence graph |
| Operational | Queries, Findings, Competitor intel, Keywords |

---

## Growth

| Zone | Content |
|------|---------|
| Executive | Acquisition, Activation, Retention, Referral, Revenue expansion |
| Visualization | Growth loop + cohort retention |
| Operational | Experiments, Channels, Cohorts |

---

## Planning

| Zone | Content |
|------|---------|
| Executive | Active goals, On-track %, Blockers |
| Visualization | Goal timeline / Gantt |
| Operational | Plans, Success criteria, Execution plans from pipeline |

---

## AI Studio

**Human-approved configuration only.** No autonomous code deploy UI.

| Zone | Content |
|------|---------|
| Prompt templates | Versioned, diff view |
| Routing rules | Performance-weighted table |
| Agent config | Capability scopes |
| Review queue | Changes requiring approval |

---

## Memory

| Zone | Content |
|------|---------|
| Stores | 12 stores with entry counts |
| Patterns | Extracted patterns with confidence |
| Corrections | User corrections lifecycle |
| Workflows | Successful / failed workflow records |

---

## Knowledge

| Zone | Content |
|------|---------|
| Graph | Verified knowledge visualization |
| Documents | Indexed sources |
| Claims | Confidence-scored facts |

---

## Settings

Preferences, HUE defaults, confidence thresholds, theme, notification rules.

---

## Integrations

Connected accounts, OAuth status, health, scopes, reconnect actions.

---

## Developer

API keys, webhooks, request logs, diagnostics, OpenAPI reference.

---

## Administration

Users, roles, audit log, governance hierarchy viewer.

---

## Workspace state

Each module persists:

- Scroll position
- Filter state
- Period selection
- Expanded drill-down path
- Pinned cards

State is session + user preference — not raw pipeline context.
