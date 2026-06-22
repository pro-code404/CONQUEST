# Conquest Design Architecture & UX Constitution

## Status

**Canonical design authority.** This document defines how Conquest looks, feels, navigates, and behaves as a user-facing operating system.

If implementation drifts toward generic dashboard patterns, this document prevails.

---

## I. Design Identity

### What Conquest is not

Conquest is **not**:

- A generic admin dashboard (sidebar + cards + charts + tables)
- A SaaS analytics product with static KPI tiles
- A chatbot in a box
- A collection of disconnected pages
- A data display layer

### What Conquest is

Conquest is a **Digital Command Center** — Mission Control for an entire digital ecosystem.

The user does not "view a dashboard." The user **commands intelligence** across growth, commerce, content, social, automation, research, and operations from one unified operating environment.

### Governing design principle

Adopt the principle shared by Notion, Arc, Linear, Vercel, Stripe, Perplexity, OpenAI Platform, and Apple HIG:

> **Reduce visual complexity while increasing information density.**

Every pixel must earn its place. Whitespace is structure, not emptiness. Density is clarity, not clutter.

### Relationship to the cognitive pipeline

The UI is the **human-facing expression** of the Conquest Cognitive Pipeline:

| Pipeline phase | UI expression |
|----------------|---------------|
| Perception | Command Layer receives all signals |
| Human Understanding | Adaptive density, tone, explanation depth |
| Context Reconstruction | Module workspace loads full situational context |
| Goal Reasoning | User intent drives model and module selection |
| Strategy Planning | Recommendations, forecasts, next actions |
| Orchestration | Background agents visible in Intelligence Dock |
| Verification | Confidence scores surfaced on every insight |
| Execution | Actions, automations, tasks — not just text |
| Reflection | Dock shows what the system learned (internal) |
| Memory Evolution | Knowledge Model, Memory module |

The UI never bypasses the pipeline. It makes the pipeline **visible and actionable**.

---

## II. The Four-Layer Shell

Conquest uses a fixed spatial architecture. No screen invents its own chrome.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LEVEL 1 — COMMAND LAYER (Mission Control)                    always visible │
├──────────┬──────────────────────────────────────────────────┬───────────────┤
│          │                                                  │               │
│  LEVEL 2 │  LEVEL 3 — MODULE WORKSPACE                      │  LEVEL 4      │
│  GLOBAL  │  (independent environment per module)            │  INTELLIGENCE │
│  NAV     │                                                  │  DOCK         │
│  RAIL    │                                                  │  always alive │
│          │                                                  │               │
└──────────┴──────────────────────────────────────────────────┴───────────────┘
```

### Level 1 — Command Layer

**Purpose:** Mission Control. Always visible. No scrolling.

| Element | Behavior |
|---------|----------|
| **Search Everything** | Universal retrieval across modules, memory, knowledge, integrations |
| **AI Command Bar** | Primary interface to the cognitive pipeline — not a chat sidebar |
| **Notifications** | Alerts, verification failures, automation events |
| **User Profile** | Identity, preferences, session context |
| **Connected Accounts Status** | Live health of integrations (green/amber/red) |
| **Workspace Switcher** | Organization / project / environment |
| **Model Switcher** | Active Intelligence Model (see Section IV) |

**Rules:**

- Fixed height. Never collapses.
- Keyboard-first: `⌘K` / `Ctrl+K` opens command bar
- Command bar submits through full cognitive pipeline
- No decorative chrome

### Level 2 — Global Navigation Rail

**Purpose:** Module access. Not pages — **applications within the OS**.

- Collapsible intelligent rail (icon-only collapsed, labels expanded)
- Modules are top-level; pages are internal to module workspaces
- Active module has distinct visual state
- Rail remembers last position per user session
- Badge indicators for alerts, running agents, failures

**Not a traditional sidebar.** It does not contain nested page trees. Deep navigation lives inside Level 3.

### Level 3 — Module Workspace

**Purpose:** Each module owns an independent environment.

Switching modules is like switching applications on macOS — the workspace transforms, not just the content area.

Every workspace shares a common scaffold:

1. **Module header** — title, period selector, primary actions
2. **Executive zone** — Smart Summary Cards (Section V)
3. **Intelligence visualization** — primary chart / graph / timeline
4. **Operational zone** — tables, queues, calendars, libraries
5. **Recommendations strip** — AI-generated next actions with confidence

Modules do not share scroll context. Each workspace maintains its own state.

### Level 4 — Intelligence Dock

**Purpose:** Always-alive intelligence surface. Floating right panel.

| Panel section | Content |
|---------------|---------|
| Recent AI conversations | Session-scoped, not archival |
| Recommendations | Actionable, confidence-scored |
| Alerts | Verification failures, anomalies |
| Suggestions | HUE-adapted communication hints |
| Predictions | Probabilistic forecasts with invalidation conditions |
| Scheduled tasks | Upcoming automations |
| Background agents | Running orchestration jobs |
| Running automations | Live execution status |
| Health monitoring | System + integration health |
| Live insights | Streaming intelligence updates |

**Rules:**

- Never hidden by default (collapsible, not dismissible)
- Width: 320–400px desktop; bottom sheet on mobile
- Updates in real time via WebSocket / SSE
- Dock content is pipeline output — structured, not raw chat logs

---

## III. Anti-Patterns (Forbidden)

The following patterns are **explicitly forbidden** unless this document is amended:

| Forbidden | Why |
|-----------|-----|
| Generic sidebar + main + cards layout | Not Conquest identity |
| Six equal KPI cards with no drill-down | No intelligence density |
| Static charts without hover intelligence | No ecosystem command |
| Feature boxes linking to separate pages | Use Models, not features |
| Chat-only interface without command layer | Conquest is OS, not chatbot |
| Infinite scroll admin tables as primary UI | Use operational zones with purpose |
| Purple-gradient AI slop aesthetic | Enterprise command center language |
| Decorative animation | Motion communicates state only |
| Permanent user labels from HUE | Session-scoped only |
| Dashboard that cannot execute actions | Execution is the purpose |

If a proposed UI resembles "another SaaS dashboard," reject it and return to this document.

---

## IV. Intelligence Models (Operating Modes)

Conquest does not organize around **features**. It organizes around **Intelligence Models** — each model is a complete intelligence system that transforms the workspace.

Switching models changes:

- Navigation emphasis
- Smart Summary Card metrics
- Primary visualization
- Dock recommendations
- Available commands in the command bar

### Model registry

| Model | Domain | Primary intelligence |
|-------|--------|---------------------|
| **Growth** | Acquisition, retention, expansion | Growth loops, cohorts, forecasts |
| **Commerce** | Selling, products, transactions | Revenue, conversion, LTV |
| **Marketing** | Campaigns, ads, funnels | Attribution, ROAS, creative performance |
| **Social** | Platforms, audience, engagement | Reach, virality, sentiment |
| **Research** | Market, competitors, keywords | Evidence, opportunities, confidence |
| **Creator** | Content, publishing, ideas | Calendar, performance, AI suggestions |
| **Automation** | Workflows, triggers, pipelines | Queues, executions, success rate |
| **Business** | Finance, customers, forecasting | P&L, cash flow, predictions |
| **Knowledge** | Memory, documents, context | Retrieval, relationships, verified facts |
| **Developer** | API, integrations, diagnostics | Logs, health, extensions |

### Model switcher behavior

- Lives in Command Layer (Level 1)
- Switching model: 150–250ms crossfade; workspace content morphs
- Model state persists per workspace
- Model selection informs orchestrator routing (backend)
- Multiple models may inform one module (e.g., Analytics uses Growth + Social)

**Models are not tabs.** They are operating modes of the same OS.

---

## V. Smart Summary Cards

Replace static metric tiles with **Smart Summary Cards**.

### Required fields (every card)

| Field | Description |
|-------|-------------|
| Current value | Primary metric |
| 24hr change | Delta + direction |
| Weekly change | Delta + direction |
| Monthly change | Delta + direction |
| AI insight | One-line intelligence summary |
| Trend direction | ↑ ↓ → with semantic color |
| Confidence score | 0–100%, from Knowledge Confidence Engine |
| Prediction | Short forecast with invalidation note |

### Interaction

- **Click** → expands to full breakdown (drill-down hierarchy)
- **Hover** → preview sparkline + top insight
- **Long-press / right-click** → pin to dock, add to automation

### Drill-down hierarchy (example: Followers)

```
Followers (card)
  → Instagram
  → Facebook
  → TikTok
  → X
  → LinkedIn
  → YouTube
  → Pinterest
  → Threads
  → Website Members
  → Newsletter Subscribers
```

Same expansion pattern for: Likes, Comments, Shares, Purchases, Reach, Revenue, Engagement, Traffic.

**Everything expands.** No dead-end metrics.

---

## VI. Intelligence Visualization

Primary visualizations are **not boring charts**. They are **intelligence surfaces**.

### Reach timeline (reference pattern)

```
Content Reach    ──────╱╲──────
Product Reach    ────╱──╲──────
```

### Hover intelligence (required on all primary viz)

On hover at any point, surface:

- Platform
- Content / product
- Conversions
- Audience segment
- Revenue attribution
- Timestamp
- Prediction at point
- Recommendation

### Visualization rules

- Prefer layered timelines over isolated bar charts
- Always show confidence band on predictions
- Anomalies highlighted with verification status
- Export and "create automation from insight" actions on every viz
- Numbers never remain numbers — always paired with narrative insight

---

## VII. Module Registry (Summary)

Full specifications: [`modules-registry.md`](modules-registry.md)

| Module | Workspace purpose |
|--------|-------------------|
| **Dashboard** | Executive overview, cross-model summary |
| **Analytics** | Performance timeline, reach, growth, revenue, forecast |
| **Content Intelligence** | Calendar, library, ideas, SEO, social performance |
| **Commerce Intelligence** | Products, purchases, funnels, LTV |
| **Social Intelligence** | Platforms, engagement, audience, virality |
| **Automation** | Running jobs, queues, logs, success rate |
| **Research** | Market, competitors, keywords, opportunities |
| **Growth** | Acquisition, retention, experiments |
| **Planning** | Goals, strategies, execution plans |
| **AI Studio** | Prompt templates, agent config, routing (human-approved) |
| **Memory** | Stores, patterns, corrections, retrieval |
| **Knowledge** | Verified facts, documents, graph |
| **Settings** | Preferences, HUE defaults, confidence thresholds |
| **Integrations** | Connected accounts, health, scopes |
| **Developer** | API keys, webhooks, logs, diagnostics |
| **Administration** | Users, roles, audit, governance |

Each module = independent workspace. See modules-registry for zone layouts.

---

## VIII. Visual Language (Summary)

Full specification: [`visual-language.md`](visual-language.md)

### Enterprise command center aesthetic

| Attribute | Rule |
|-----------|------|
| **Background** | Deep charcoal / graphite (dark default); clean white (light) |
| **Whitespace** | Generous; rhythm via 4px grid |
| **Cards** | Rounded (8–12px), subtle elevation, thin borders |
| **Gradients** | Sparingly — emphasis only, never backgrounds |
| **Motion** | 150–250ms; state communication only |
| **Density** | High information, low noise |
| **Typography** | Clear hierarchy; tabular nums for metrics |
| **Contrast** | WCAG AA minimum |
| **Noise** | Minimal — no gratuitous icons or badges |

### Light and dark

Both modes are first-class. User preference + system preference. Tokens in [`design-tokens.md`](design-tokens.md).

---

## IX. Component Standards (Summary)

Full specification: [`components.md`](components.md)

All components must:

- Accept `confidence` prop where displaying intelligence
- Support drill-down expansion
- Emit telemetry on interaction
- Be keyboard accessible
- Work in Command Layer, Workspace, and Dock contexts
- Never duplicate pipeline responsibilities (display only; cognition is backend)

---

## X. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **Desktop (≥1280px)** | Full four-layer shell |
| **Tablet (768–1279px)** | Rail collapsed; dock as overlay |
| **Mobile (<768px)** | Command layer compact; rail → bottom nav; dock → bottom sheet |

Module workspaces reflow zones vertically. Smart Summary Cards → 2-column then 1-column.

---

## XI. Accessibility & Usability

- WCAG 2.1 AA compliance
- Keyboard navigation for all commands
- Screen reader labels on confidence and trend direction
- Reduced motion respects `prefers-reduced-motion`
- Focus rings visible in both themes
- No information conveyed by color alone

---

## XII. User Journey

### First login

1. Command Layer + empty workspace
2. Connect integrations (Integrations module)
3. HUE calibration (session-scoped questionnaire, optional)
4. Model recommendation based on connected data
5. First pipeline execution via command bar

### Daily use

1. Glance Command Layer + Dashboard executive zone
2. Dock surfaces overnight automations and alerts
3. Drill into module via rail or command
4. Execute actions — not just read insights
5. System evolves; dock shows what changed

### Advanced

1. AI Studio for approved routing/prompt tuning
2. Developer module for API and webhooks
3. Multi-workspace switching
4. Custom automation from any insight surface

---

## XIII. Implementation Rules for Engineers

Before building any UI:

1. Which layer (1–4) does this belong to?
2. Which module workspace or intelligence model?
3. Does it use Smart Summary Cards or forbidden static tiles?
4. Does drill-down expand to full ecosystem breakdown?
5. Does it surface confidence and prediction?
6. Does it connect to the cognitive pipeline API?
7. Does it violate any anti-pattern in Section III?

**Preview UI at `/preview` is a pipeline demo only.** Production UI must follow this constitution.

---

## XIV. Document Evolution

This constitution expands through:

- `modules-registry.md` — per-module screen specs
- `components.md` — component API and behavior
- `design-tokens.md` — implementation tokens

Amendments require architectural justification. Generic dashboard patterns are never valid amendments.

---

## XV. Design Law

> Conquest commands ecosystems. It does not display dashboards.
>
> Reduce complexity. Increase density. Switch models, not pages. Expand everything. Keep the dock alive. Execute, don't just inform.

This is the identity Cursor must not drift from.
