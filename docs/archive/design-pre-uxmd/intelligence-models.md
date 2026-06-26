# Intelligence Models

Intelligence Models are **operating modes** of Conquest — not navigation tabs, not feature flags.

Switching a model transforms workspace emphasis while the four-layer shell remains constant.

---

## Model anatomy

Each model defines:

| Property | Description |
|----------|-------------|
| `id` | Stable identifier |
| `name` | Display name |
| `icon` | Rail / switcher icon |
| `primaryModules` | Modules most relevant |
| `summaryMetrics` | Smart Summary Card set |
| `primaryVisualization` | Default chart type |
| `commandPlaceholder` | Command bar hint text |
| `dockEmphasis` | Which dock sections prioritize |
| `orchestratorDomain` | Backend routing domain |

---

## Growth Model

**Command placeholder:** "Analyze growth across channels…"

**Summary metrics:** New users, Retention D7, Activation rate, Viral coefficient, CAC, LTV

**Primary viz:** Cohort retention heatmap + growth loop diagram

**Dock emphasis:** Predictions, Recommendations

**Modules:** Dashboard, Analytics, Growth, Planning

---

## Commerce Model

**Summary metrics:** Revenue, Orders, AOV, Conversion rate, Cart abandonment, Refund rate

**Primary viz:** Revenue timeline with product reach overlay

**Drill-down:** Product → SKU → Channel → Campaign → Customer segment

**Modules:** Commerce Intelligence, Analytics, Business

---

## Marketing Model

**Summary metrics:** ROAS, CPA, Impressions, CTR, Funnel conversion, Creative fatigue score

**Primary viz:** Campaign performance timeline + funnel sankey

**Modules:** Analytics, Growth, Content Intelligence

---

## Social Model

**Summary metrics:** Followers, Reach, Engagement rate, Shares, Comments, Virality score

**Primary viz:** Multi-platform reach timeline (Content vs Product reach lines)

**Drill-down:** Platform → Post → Audience → Revenue attribution

**Platforms (expandable):** Instagram, Facebook, TikTok, X, LinkedIn, YouTube, Pinterest, Threads

**Modules:** Social Intelligence, Content Intelligence, Analytics

---

## Research Model

**Summary metrics:** Opportunities found, Competitor moves, Keyword volume, News signals, Confidence avg

**Primary viz:** Evidence graph + opportunity matrix

**Dock emphasis:** Recent research, Confidence scores

**Modules:** Research, Knowledge, Planning

---

## Creator Model

**Summary metrics:** Scheduled posts, Published, Avg engagement, Ideas in queue, SEO score, Competitor gap

**Primary viz:** Publishing calendar + performance overlay

**Modules:** Content Intelligence, Social Intelligence, AI Studio

---

## Automation Model

**Summary metrics:** Running, Queued, Success rate, Failures 24h, Avg latency, Tokens saved

**Primary viz:** Execution timeline + queue depth

**Dock emphasis:** Running automations, Scheduled tasks, Failures

**Modules:** Automation, Developer

---

## Business Model

**Summary metrics:** Revenue, Expenses, Margin, Cash runway, Customers, Churn

**Primary viz:** P&L timeline + forecast band

**Modules:** Commerce Intelligence, Business (workspace), Analytics

---

## Knowledge Model

**Summary metrics:** Verified facts, Patterns, Corrections applied, Memory stores active, Retrieval hit rate

**Primary viz:** Knowledge graph

**Modules:** Memory, Knowledge, Research

---

## Developer Model

**Summary metrics:** API calls 24h, Error rate, P95 latency, Webhooks active, Integrations healthy

**Primary viz:** Request timeline + error breakdown

**Modules:** Developer, Integrations, Administration

---

## Model switching UX

1. User selects model in Command Layer switcher
2. Workspace metrics crossfade (200ms)
3. Rail highlights primary modules for model
4. Command bar placeholder updates
5. Dock re-sorts sections per `dockEmphasis`
6. Backend orchestrator receives `domain` hint on next pipeline run

## Model + Module matrix

Models **emphasize** modules; they do not hide the rail. User can always navigate anywhere.

| Model | Primary modules |
|-------|-----------------|
| Growth | Dashboard, Analytics, Growth |
| Commerce | Commerce Intelligence, Analytics |
| Marketing | Analytics, Content Intelligence |
| Social | Social Intelligence, Content Intelligence |
| Research | Research, Knowledge |
| Creator | Content Intelligence |
| Automation | Automation |
| Business | Commerce Intelligence, Analytics |
| Knowledge | Memory, Knowledge |
| Developer | Developer, Integrations |

---

## Backend contract

```typescript
interface ModelContext {
  modelId: string;
  domain: string;
  summaryMetricIds: string[];
  orchestratorHint: string;
}
```

Passed to `/v1/conquest` as optional context. Influences routing, not UI only.
