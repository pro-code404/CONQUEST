# 06 — UX Intelligence Bible

**Institutional memory · Recovery Phase 4**

The interface is not decoration. It is the **visible surface of intelligence** — how users perceive whether Conquest understands, verifies, and respects their decisions.

**Authority chain:** CCIS → AMD → PDD → UXMD I–III → GIS → Build → `apps/web`

**Cross-reference:** [Project Brain Ch 11](../project-brain/11-ux-architecture.md) · [UXMD Volume I](../uxmd/volume-i-user-experience-master-document.md) · [UXMD Volume II](../uxmd/volume-ii-screen-interaction-specification.md) · [UXMD Volume III (GIS)](../uxmd/volume-iii-global-interaction-standards.md) · [16 Common Misconceptions](../project-brain/16-common-misconceptions.md) · [Preview Regression RCA](../build-2/preview-regression-rca.md)

---

## Table of contents

1. [Core thesis](#1-core-thesis)
2. [GIS as cognitive load reduction](#2-gis-as-cognitive-load-reduction-system)
3. [Per-module UX philosophy](#3-per-module-ux-philosophy)
4. [Decision zones vs widgets](#4-decision-zones-vs-widgets)
5. [Behavioral states](#5-behavioral-states)
6. [Chart and visualization rules](#6-chart-and-visualization-rules)
7. [Animation rules](#7-animation-rules)
8. [Workflow friction reduction](#8-workflow-friction-reduction)
9. [Anti-patterns](#9-anti-patterns)
10. [Screen ID map reference](#10-screen-id-map-reference)
11. [Router and layout rules](#11-router-and-layout-rules)
12. [Accessibility as intelligence](#12-accessibility-as-intelligence)

Each major section follows: **Why · How · Rejected alternatives · Integration · Evolution · Mistakes · Examples**

---

## 1. Core thesis

### Why

Users do not evaluate Conquest by counting features. They evaluate whether the product **helps them decide** with justified confidence. A beautiful dashboard that shows fake KPIs destroys trust faster than an empty honest state. UXMD Part D states explicitly: the Command Center is an **Intelligence Command Center**, not a grid of charts.

Conquest competes on **decision superiority**, not visual novelty. Every pixel either:

- Surfaces verified intelligence with evidence and confidence, or
- Guides the user toward the next decision, or
- Honestly admits absence of intelligence

Anything else is category drift toward BI tools or AI wrappers — both explicitly rejected ([Misconception 1](../project-brain/16-common-misconceptions.md), [Misconception 4](../project-brain/16-common-misconceptions.md)).

### How

| Principle | Implementation |
|-----------|----------------|
| Decision-first | Command Center home — not chat ([ADR-0002](../architecture/adr/0002-command-center-as-home.md)) |
| Honest states | Empty zones when no cognitive output — no seeded mock data |
| Verification visible | Confidence, evidence refs, status on recommendations |
| Workspace context | URL `/app/w/:id/module` — nav stays seven items ([ADR-0003](../architecture/adr/0003-workspace-as-context.md)) |
| GIS everywhere | Tokens from `@conquest/gis` — no magic numbers |
| Machinery hidden | Users navigate decisions, not engines ([UXMD NAV-7](../uxmd/volume-i-user-experience-master-document.md)) |

**Mental model the user should hold:**

> "I land in my Command Center. I switch workspace when context changes. I go deeper when I need more. I configure in Settings. I get help from Support."

**Not:**

> "I navigate between AI systems."

### Rejected alternatives

| Alternative | Why rejected |
|-------------|--------------|
| Chat-first product | Violates UXMD; chatbot anti-pattern (RTM-UX-009) |
| Generic admin sidebar + cards | Pre-UXMD archive; forbidden by Conquest Design Law |
| Engine catalog in nav | Intelligence machinery as nav items forbidden |
| Metrics-first dashboard | "Situation first" — UXMD Part D.1 |
| User-configures-everything | Conquest prioritizes; user may adjust within zones |
| Static until refresh | Live with explicit freshness indicators required |

### Integration

- **PDD Volume II Module 1:** Command Center owns recommendation queue, alert surfacing, Ask Conquest entry, execution status display
- **Cognitive pipeline:** UI renders outputs of Perceive → … → Verify; never calls engines directly
- **API boundary:** `fetch('/api/...')` with credentials; Zod-validated contracts at boundary
- **Build-2 M1:** CC zones bind to intelligence feed after research analyze — dormant → active transition

### Evolution

| Phase | UX capability |
|-------|---------------|
| M4 (today) | Integrated dashboard zones; recommendations from intelligence API; honest empty |
| M5+ | Execution status widget shows real outcomes (gated) |
| Post-beta | Live operational pulse; structured Ask Conquest panel; alert acknowledgment workflows |
| Target | Multi-zone personalization per workspace goals; full PDD depth for Strategy/Knowledge/Marketplace |

### Mistakes

- **`ensureSeed` fake intelligence (pre-M1):** Seeded recommendations made demos look credible but violated honest-state law. Removed permanently.
- **Formula KPIs in analytics:** `100 - index*7` placeholders — acceptable only as explicitly deferred visualization, not as product home.
- **Route guard blocking demos (pre-M1):** Intelligence/research paths redirected to CC — broke journey integrity.
- **CookieConsentBanner outside RouterProvider:** Router context violation — see [Section 11](#11-router-and-layout-rules).

### Examples

**Good:** Command Center recommendation card shows title, confidence badge, evidence link, Approve/Defer/Reject actions, freshness timestamp.

**Bad:** Command Center shows three charts with no recommendation, no empty explanation, and no CTA to run research.

---

## 2. GIS as cognitive load reduction system

### Why

GIS (Global Interaction Standards, UXMD Volume III) is **not optional styling**. It is frozen interaction law that reduces cognitive load by making every screen predictable. When spacing, timing, states, and error patterns are consistent, users spend attention on **decisions**, not on decoding the interface.

Hardcoded colors, spacing, or animation in feature code are **defects**, not preferences ([Misconception 11](../project-brain/16-common-misconceptions.md)).

### How

| Token category | Purpose | Examples |
|----------------|---------|----------|
| `color` | Hierarchy and emphasis | `surface`, `textPrimary`, `accent`, semantic success/warn/error |
| `spacing` | Rhythm and scanability | `xs`–`xxl` rem scale |
| `typography` | Information density | `fontSizeSm`–`Xl`, weight tokens |
| `timing` | Motion semantics | `fast` / `normal` / `slow` transitions |

**Implementation:** `@conquest/gis` package; dark-first `--cq-color-surface: #0f1419` in `global.css`.

**State taxonomy (GIS Part 1):** Every screen exists in exactly one primary state: `S-LOAD`, `S-EMPTY`, `S-SUCCESS`, `S-ERROR`, `S-RECOVER`, `S-OFFLINE`.

**Critical rules:**

| Rule ID | Rule |
|---------|------|
| GIS-S1 | Never show unverified intelligence as Success |
| GIS-S2 | Empty must include honest explanation + primary CTA |
| GIS-S5 | Loading uses plain language — never system IDs or agent names |
| GIS-S10 | State transitions must be visible — no silent jumps |

### Rejected alternatives

| Alternative | Why rejected |
|-------------|--------------|
| Per-feature CSS variables | Drift; breaks scanability |
| Tailwind arbitrary values in screens | Bypasses token governance |
| Theme as branding exercise | Theme is accessibility/comfort — must not change intelligence priority |
| Inline style objects for spacing | Unreviewable; blocks GIS gate (ENG-23) |

### Integration

- **Presentation layer:** `apps/web`, `packages/presentation` import GIS only
- **No GIS Provider:** Static tokens — architectural choice, not regression ([Preview RCA](../build-2/preview-regression-rca.md))
- **UXMD-II inheritance:** Unless explicit GIS Override field, all GIS rules apply automatically

### Evolution

GIS version bumps require UXMD amendment process. New tokens added centrally; features never invent local scales. Future: design-token CI lint blocking raw hex in `apps/web`.

### Mistakes

- Engineers treating GIS as "design polish" and shipping hardcoded `#333` for "just this once"
- Using pipeline stage names in loading text ("Running DecisionEngine…")
- Skipping `aria-busy` on loading zones — breaks screen reader intelligence model

### Examples

**Good:** Recommendation list uses `spacing.md` gap, `color.textSecondary` for metadata, skeleton loaders during `S-LOAD`.

**Bad:** Intelligence feed uses `padding: 13px`, `#1a1a2e` background, spinner with no accessible label.

---

## 3. Per-module UX philosophy

### 3.1 Command Center

**Why:** Daily cockpit — where Conquest proves it is an OS, not a dashboard.

**How:** Priority zones P0–P10 (UXMD Part D.3). User attention flows top-down. P0 Critical alerts and P1 Pending recommendations never compete with P7 KPI performance.

**Rejected:** Equal-weight widget grid; user-built dashboard composer as primary experience.

**Integration:** Binds to intelligence feed API; dormant → active when cognitive output exists.

**Evolution:** Ask Conquest panel (RTM-UX-009); alert acknowledgment; personalization.

**Mistakes:** Seeding fake recommendations; showing formula KPIs as if live.

**Example:** Empty CC shows "Run a research session to generate recommendations" with deep link to Research.

---

### 3.2 Research

**Why:** Structured evidence gathering — entry point for cognitive pipeline in beta.

**How:** Sessions, analyze action, evidence refs on output. Not free-form multi-turn chat.

**Rejected:** Chat thread as primary research UI.

**Integration:** `POST .../research/sessions/:id/analyze` triggers orchestrator; populates intelligence feed.

**Evolution:** Connector flows; multi-source evidence portfolio UI.

**Mistakes:** Treating analyze as "one LLM call" ([Misconception 14](../project-brain/16-common-misconceptions.md)).

**Example:** Session detail shows analyze button, progress state, link to resulting recommendation.

---

### 3.3 Intelligence

**Why:** Feed of verified recommendations and intelligence artifacts for the workspace.

**How:** List + detail views; status transitions (approve/defer/reject); evidence access on detail.

**Rejected:** Infinite scroll of unverified model output.

**Integration:** `IntelligenceService` backed by cognitive pipeline post-M1; empty feed is honest.

**Evolution:** Dedicated evidence screen; filtering by confidence and type.

**Mistakes:** Re-adding `ensureSeed`; showing stub text as if verified.

**Example:** Feed empty until research analyze completes — then cards with confidence badges.

---

### 3.4 Operations

**Why:** Day-to-day operational awareness — KPIs, anomalies, execution status (when live).

**How:** Operational presentation mode (UXMD D.4) emphasizes KPIs, anomalies, execution status.

**Rejected:** Operations as separate product with own nav tree.

**Integration:** Module within seven-item nav; shares workspace context.

**Evolution:** Real-time anomaly surfacing; execution status from M5 engine.

**Mistakes:** Chart-heavy ops view without decision linkage.

**Example:** Anomaly card links to recommendation or research session, not just a chart.

---

### 3.5 Automation

**Why:** User-defined workflows — one module inside the OS, not the product identity.

**How:** CRUD for workflows; manual run with **honest deferred-execution message** until M5.

**Rejected:** Implied autonomous execution in beta UI.

**Integration:** `AutomationService.manualRun` → audit record only; `executionReady: false` in cognitive layer.

**Evolution:** Approve → execute workflow post-BAR.

**Mistakes:** UI suggesting workflow "ran successfully" when only audit written ([Misconception 7](../project-brain/16-common-misconceptions.md)).

**Example:** Manual run shows "Execution deferred — audit recorded. Real execution requires Build-2 M5 authorization."

---

### 3.6 Strategy

**Why:** Depth module for strategic planning beyond Command Center summaries.

**How (today):** Placeholder screen — honest "coming soon" or scoped beta messaging.

**Rejected:** Fake strategy widgets with lorem ipsum initiatives.

**Integration:** PDD Module spec; post-beta P2 milestone.

**Evolution:** Full PDD depth — opportunities, competitors, predictions, initiatives.

**Mistakes:** Building Strategy as chatbot for "strategy advice."

**Example:** Placeholder with link to Command Center recommendations for near-term decisions.

---

### 3.7 Knowledge

**Why:** Curated organizational knowledge — distinct from raw memory or chat history.

**How (today):** Placeholder; nav visible per role matrix (UXMD C.6).

**Rejected:** Knowledge as document dump without verification linkage.

**Integration:** Memory evolution outputs (governed) may feed Knowledge post-beta.

**Evolution:** Curation workflows; verified knowledge promotion from cognitive outputs.

**Mistakes:** Conflating Knowledge module with `CognitiveMemoryManager` storage.

**Example:** Honest empty: "Knowledge curation activates after workspace intelligence matures."

---

### 3.8 Marketplace

**Why:** Extension ecosystem for workspace capabilities — manager+ roles only.

**How (today):** Placeholder; role-gated nav visibility.

**Rejected:** Marketplace as app store with unreviewed extensions executing autonomously.

**Integration:** ADR-governed extension model (future); execution boundary applies to extensions.

**Evolution:** Installable connectors, templates, governed third-party modules.

**Mistakes:** Allowing marketplace extensions to bypass verification gate.

**Example:** Placeholder explains role requirement and future extension review process.

---

### 3.9 Settings

**Why:** Configuration without polluting primary decision surfaces.

**How:** `SettingsLayout` with category sidebar; 18+ wired screens in M4.

**Rejected:** Settings as catch-all for intelligence features.

**Integration:** Administration for admins; workspace config; legal acceptance; MFA.

**Evolution:** Billing OAuth; privacy export/delete; integration OAuth.

**Mistakes:** Hiding Administration from nav (fixed M1 — added to SETTINGS_CATEGORIES).

**Example:** Settings → Administration visible for admin role; legal pages accessible when logged in (M2 fix).

---

## 4. Decision zones vs widgets

### Why

**Widgets** imply equal-weight, user-composed tiles — the dashboard anti-pattern. **Decision zones** imply priority-ordered surfaces that answer specific user questions. UXMD Part D.3 defines experiential order; lower zones never compete with P0–P1.

### How

| Concept | Definition |
|---------|------------|
| **Decision zone** | Priority-ordered region answering one user question (e.g. "What should I decide?") |
| **Widget** | Self-contained visualization tile, often equal weight — **rejected as primary model** |

**Command Center zone map (logical):**

```
┌────────────────────────────────────────────────────────┐
│ Primary nav (7 items) + utility bar (workspace label)  │
├────────────────────────────────────────────────────────┤
│ P0 Alerts          │ P1 Recommendations               │
├────────────────────┴──────────────────────────────────┤
│ P2 Executive summary / situational intelligence         │
├────────────────────────────────────────────────────────┤
│ P3–P7 Risks, opportunities, predictions, goals, KPIs   │
├────────────────────────────────────────────────────────┤
│ P8–P10 Execution status, activity feed, memory insights│
└────────────────────────────────────────────────────────┘
```

**Presentation modes (behavioral filter):** Executive, Operational, Strategic, Focused — filter which zones emphasize, not which nav items exist.

### Rejected alternatives

| Alternative | Why rejected |
|-------------|--------------|
| Drag-and-drop widget composer | User configures everything — rejected in UXMD D.1 |
| Chart wall | Metrics first vs situation first |
| Single "AI summary" card replacing zones | Collapses decision hierarchy |

### Integration

- M1: CC dashboard zones wired to intelligence API
- Conditional surfaces: competitor widget, revenue breakdown only when data supports (PDD)

### Evolution

Multi-zone personalization per workspace goals — user adjusts emphasis within zone model, not widget catalog.

### Mistakes

- Implementing archived pre-UXMD "6–8 Smart Summary Cards user-configurable" pattern
- Populating KPI zone with formula placeholders without "deferred" labeling

### Examples

**Zone (good):** "Pending recommendations" zone with ranked cards, each actionable.

**Widget (bad):** Three equal pie charts with no recommendation linkage or priority.

---

## 5. Behavioral states

### Why

Honest states build trust. Fabricated data destroys the verification contract. GIS defines universal state taxonomy; Command Center adds workspace-level behavioral states (UXMD Part D.2).

### How

**Workspace / Command Center behavioral states:**

| State | User experience |
|-------|-----------------|
| **No workspace** | Routed to workspace creation — not empty Command Center |
| **Dormant** | Honest empty: "Connect a data source to activate intelligence" |
| **Initializing** | Progressive plain-language initialization progress |
| **Ready** | Full prioritized intelligence display |
| **Awaiting Decision** | Recommendations prominently surfaced |
| **Degraded** | Affected zones show degraded notice; unaffected zones normal |
| **Processing** | Background refresh indicator; last verified snapshot shown |

**GIS primary states:** `S-LOAD`, `S-EMPTY`, `S-SUCCESS`, `S-ERROR`, `S-RECOVER`, `S-OFFLINE` — apply per zone and per screen.

**Rules:**

- Dormant ≠ Error — empty is honest, not failure
- Degraded ≠ Error — partial capability with explicit notice (GIS-S7)
- Never show unverified intelligence as Success (GIS-S1)

### Rejected alternatives

| Alternative | Why rejected |
|-------------|--------------|
| Sample/demo data in empty states | GIS-S2, GIS empty standard prohibitions |
| Silent state jumps | GIS-S10 |
| Generic "No data" | Must explain why and offer CTA |

### Integration

- Intelligence feed empty until cognitive pipeline produces output
- CC zones transition dormant → active after research analyze

### Evolution

Initializing state will reflect real connector progress post-beta.

### Mistakes

- `ensureSeed` — fabricated recommendations in empty feed (removed)
- Showing Loading indefinitely without timeout/retry (GIS 60s rule)

### Examples

**Dormant:** CC recommendations zone: icon + "No recommendations yet" + "Start research" button.

**Active:** Same zone populated with verified cards after analyze completes.

---

## 6. Chart and visualization rules

### Why

Charts support **decisions**, not decoration. UXMD rejects "charts without action." Analytics module visualization is deferred (formula KPIs in beta) — Command Center is decision intelligence, not BI.

### How

| Rule | Requirement |
|------|-------------|
| Decision linkage | Every chart must link to recommendation, alert, or drill-down action |
| Freshness | Timestamp on time-sensitive visualizations |
| Confidence | Uncertainty visible — not false precision |
| Empty honesty | No chart with fabricated series |
| Priority | Charts appear in lower zones (P7+) — never above P1 recommendations |
| Accessibility | Data table alternative or accessible summary for critical metrics |

**Beta reality:** Reports/analytics visualization layer deferred to P1 post-beta (`visualization-config`).

### Rejected alternatives

| Alternative | Why rejected |
|-------------|--------------|
| Chart-first Command Center | UXMD D.1 explicit rejection |
| Auto-generated charts from stub data | Violates honest empty |
| 3D / decorative viz | Cognitive load without decision value |

### Integration

- `packages/config` visualization-config (future)
- KPI zone in CC when real metrics available

### Evolution

Full analytics visualization P1 post-beta; hover intelligence on timelines per archived PDD depth specs.

### Mistakes

- Shipping formula KPIs (`100 - index*7`) without labeling as placeholder
- Chart wall on Command Center competing with recommendations

### Examples

**Good:** KPI card in P7 shows trend arrow, freshness, "View recommendation" link when anomaly detected.

**Bad:** Full-width line chart on CC home with no action and no empty state when no data.

---

## 7. Animation rules

### Why

Animation must **reinforce understanding** of state change — not decorate. GIS and UXMD-I require reduced-motion respect; decorative animation is prohibited when user prefers reduced motion.

### How

| Context | Allowed | Prohibited |
|---------|---------|------------|
| State transition | Subtle fade/slide on zone content change | Bouncing loaders |
| Loading | Skeleton pulse (if motion allowed) | Fake progress bars |
| Success mutation | Brief inline confirmation | Celebratory confetti |
| Navigation | Standard route transition timing token | Parallax, decorative background motion |
| Reduced motion | Essential state change only — instant or opacity | All decorative animation |

**Timing tokens:** `fast` / `normal` / `slow` from GIS — never arbitrary `transition: 0.37s`.

### Rejected alternatives

| Alternative | Why rejected |
|-------------|--------------|
| Animated chart entrances on every load | Attention theft from P0–P1 |
| Pipeline stage animations | Exposes machinery (GIS-S5) |
| Infinite looping backgrounds | Decorative; fails reduced-motion |

### Integration

- CSS variables in `global.css` for motion tokens
- `@media (prefers-reduced-motion: reduce)` overrides required

### Evolution

Motion spec may expand in UXMD-III amendments — always governance-gated.

### Mistakes

- Animating intelligence "typing" effect like chatbot
- Ignoring `prefers-reduced-motion` on skeleton loaders

### Examples

**Good:** Recommendation card fades in when zone transitions dormant → active; `aria-live="polite"` announces new count.

**Bad:** Streaming text animation simulating LLM chat in Command Center.

---

## 8. Workflow friction reduction

### Why

Friction is acceptable at **governance boundaries** (approval, legal acceptance, MFA). Friction is unacceptable at **navigation and honesty boundaries** — users must reach research, intelligence, and settings without route hacks.

### How

| Workflow | Friction reduction pattern |
|----------|---------------------------|
| Closed-beta demo | Full journey: signup → verify → onboarding → research → analyze → CC (documented in launch readiness) |
| Recommendation decision | Approve/defer/reject in minimum clicks from CC or intelligence detail |
| Workspace switch | Utility bar context — not buried in settings |
| Deep links | CC quick actions link to intelligence & research modules |
| Auth recovery | Verify email token in dev; clear error states with recovery CTAs |
| Settings discovery | Administration in nav for admin role (M1 fix) |

**Acceptable friction:**

- Email verification before app shell
- Role-gated automation and marketplace
- Explicit approval before future execution (M5)

### Rejected alternatives

| Alternative | Why rejected |
|-------------|--------------|
| Skip verification in production | Security defect |
| Hidden demo routes bypassing guards | Masks real access control bugs |
| One-click autonomous execution | Governance violation |

### Integration

- Route guards: `RequireGuest`, `RequireAuth`, `RequireAppShell`, `RequireWorkspaceRoute`
- E2E: `e2e/closed-beta-journey.spec.ts` validates full path

### Evolution

Connector onboarding will add steps — must preserve skip/honest cosmetic labeling until real.

### Mistakes

- Pre-M1 route-access redirecting intelligence/research to CC
- Onboarding steps 4–5 cosmetic without honest labeling

### Examples

**Good:** Research nav item reachable at `/app/w/{id}/research` for authorized roles.

**Bad:** Demo script requiring manual URL edit because guards block module.

---

## 9. Anti-patterns

### Why

Documenting anti-patterns with **why prohibited** prevents category drift. Conquest Design Law and engineering constitution encode these as defects.

### Anti-pattern catalog

| Anti-pattern | Why prohibited | Authority |
|--------------|----------------|-----------|
| Generic sidebar + cards + charts | Substitutes for UXMD screens | Conquest Design Law |
| Intelligence machinery in nav | Users navigate decisions, not engines | ADR-0005, NAV-3 |
| Chatbot-primary layout | Wrong product category | RTM-UX-009, Misconception 2 |
| Fake/seeded intelligence | Destroys verification trust | GIS-S1, M1 removal of ensureSeed |
| Provider SDK in UI | Boundary violation; key leakage risk | ADR-0011, B-27 |
| Business logic in presentation | Untestable; duplicates domain | Engineering constitution §1 |
| Hardcoded GIS values | Frozen interaction law violation | Misconception 11 |
| Router hooks outside RouterProvider | Runtime crash; latent defects | Preview RCA, constitution §6 |
| Autonomous execution UI | M5 not authorized | ADR-0015, BAR |
| Demo code in production path | Silent behavior change | Constitution §31 |
| Workspace as nav item | Context not product | ADR-0003, Misconception 15 |
| Learning layer deploys code | Safety boundary | ADR-0009, B-28 |
| Single LLM call mental model | Bypasses evidence and verification | Misconception 14 |

### Rejected alternatives

"Move fast" exceptions for any row above — all rejected by governance.

### Integration

- CI: static analysis, runtime tests, e2e smoke
- Project Brain Ch 16 self-test before commit

### Evolution

Anti-pattern list grows via ADR and failure encyclopedia entries — never shrinks without ADR.

### Mistakes

Each anti-pattern in catalog maps to a real incident — see [08 Failure Encyclopedia](./08-failure-encyclopedia.md).

### Examples

See individual failure entries for code-level examples.

---

## 10. Screen ID map reference

### Why

UXMD Volume II assigns canonical **Screen IDs** to every screen — enabling traceability from UX spec → RTM → implementation → tests.

### How

**Authority:** [`docs/uxmd/volume-ii-screen-interaction-specification.md`](../uxmd/volume-ii-screen-interaction-specification.md)

| Field | Purpose |
|-------|---------|
| **Screen ID** | Canonical identifier (e.g. CC-01, RES-03, SET-12) |
| **Module** | Command Center, Research, Intelligence, etc. |
| **Route** | URL pattern under `/app/w/:workspaceId/...` |
| **GIS inheritance** | Default unless GIS Override specified |
| **States** | Per-screen state specs (incomplete on ~40–50 screens — known gap) |

**Module prefix map (representative):**

| Module | ID prefix | Example screens |
|--------|-----------|-----------------|
| Command Center | CC- | CC-01 Home, CC-03 Recommendation detail |
| Research | RES- | RES-01 Session list, RES-02 Analyze |
| Intelligence | INT- | INT-01 Feed, INT-02 Detail |
| Automation | AUT- | AUT-01 Workflow list, AUT-03 Manual run |
| Operations | OPS- | OPS-01 Dashboard |
| Strategy | STR- | STR-01 Placeholder (beta) |
| Knowledge | KNO- | KNO-01 Placeholder (beta) |
| Marketplace | MKT- | MKT-01 Placeholder (beta) |
| Settings | SET- | SET-01 Profile, SET-18 Administration |
| Auth | AUTH- | Public auth layout screens |

**Operational detail cross-ref:** [Document X](../uxmd/document-x-product-experience-operational-details.md) — Screen IDs from UXMD-II §A.11.

### Rejected alternatives

| Alternative | Why rejected |
|-------------|--------------|
| Implementation-only route names without Screen IDs | Breaks RTM traceability |
| Ad hoc screen naming in code comments | Not governance-visible |

### Integration

- RTM rows reference UX requirements
- ENG-23 accessibility gate requires GIS compliance per screen

### Evolution

UXMD-II gaps (accessibility fields, mobile specs) close incrementally — Screen IDs stable across amendments.

### Mistakes

Building screens not in UXMD-II without amendment process

### Examples

Command Center home implements CC-01 behaviors: priority zones, behavioral state indicator, freshness indicators.

---

## 11. Router and layout rules

### Why

Layout hierarchy encodes **provider boundaries** and **global chrome** placement. Violations cause runtime failures (Preview P0) or architectural drift.

### How

**Correct bootstrap chain (post-fix):**

```
main.tsx
  StrictMode
    ErrorBoundary
      AuthProvider          ← session state; no router hooks
        App
          RouterProvider    ← creates router context
            RootLayout
              Outlet        ← matched route screen
              CookieConsentBanner  ← uses <Link>; MUST be inside RouterProvider
```

**Layout hierarchy:**

```
AppShell (workspace layout)
├── Primary nav (7 items) — ADR-0005 frozen
├── Utility bar (workspace label, user menu)
└── Content outlet (module screens)

SettingsLayout — settings categories sidebar
PublicAuthLayout — auth forms
```

**Route guards (preserved):**

- `RequireGuest`, `RequireAuth`, `RequireVerifyEmailRoute`, `RequireOnboardingRoute`
- `RequireAppShell`, `RequireWorkspaceRoute`

**Router API:** `createBrowserRouter` + `RouterProvider` (data router pattern) — not legacy `BrowserRouter` at root.

**Rule:** Any component using `Link`, `NavLink`, `Navigate`, or router hooks must be a **descendant** of `RouterProvider`.

### Rejected alternatives

| Alternative | Why rejected |
|-------------|--------------|
| CookieConsentBanner as RouterProvider sibling | **Null router context crash** — Preview RCA |
| Global chrome in `App.tsx` outside route tree | Same class of bug |
| `packages/presentation` importing react-router-dom | Layer boundary violation — use callbacks/href |

### Integration

- `apps/web/src/layouts/RootLayout.tsx` — Outlet + banner
- Tests: `App.runtime.test.tsx`, `router-context.test.ts`, `e2e/preview-routes.spec.ts`

### Evolution

New global chrome (e.g. system status banner) → `RootLayout` only, never `App.tsx` sibling.

### Mistakes

- M2 introduced CookieConsentBanner as sibling — latent until banner became visible
- Blaming Recovery Phase 2 doc sync for routing bug — **false** (Misconception 9)

### Examples

**Good:** Legal cookie link in banner inside RootLayout.

**Bad:** Banner in fragment beside `<RouterProvider>` in App.tsx.

---

## 12. Accessibility as intelligence

### Why

Accessibility is not a compliance checkbox — it is **intelligence equity**. If confidence, evidence, and alerts are visible only visually, the product fails verification for assistive technology users. GIS and ENG-23 treat accessibility as inherited law.

### How

| Requirement | Implementation |
|-------------|----------------|
| Keyboard | All primary actions reachable; focus order logical |
| Screen readers | `aria-busy` on loading zones; `aria-live` for recommendation updates |
| Forms | Labeled inputs; error association |
| Reduced motion | `prefers-reduced-motion` — essential state change only |
| Contrast | GIS color tokens meet contrast requirements |
| Focus | Visible focus rings — never removed for aesthetics |
| Route status | Announce navigation changes where appropriate |

**UXMD-II gap (known):** Zero accessibility section in template; per-screen a11y fields incomplete — track as remediation, not excuse to skip baseline GIS.

### Rejected alternatives

| Alternative | Why rejected |
|-------------|--------------|
| "Beta skips a11y" | ENG-23 gate; constitutional defect |
| Icon-only buttons without labels | Fails screen reader intelligence model |
| Color-only confidence encoding | Must include text label |

### Integration

- Build gate: GIS accessibility (ENG-23)
- Presentation components: rendering-only with a11y props

### Evolution

Per-screen UXMD-II accessibility bindings added over time; CI a11y lint planned.

### Mistakes

- Loading spinners without `aria-busy` or accessible name
- Recommendation confidence by color dot only

### Examples

**Good:** Recommendation card: "High confidence" text + badge; Approve button focusable; list updates announce via `aria-live="polite"`.

**Bad:** Three colored circles indicating risk with no text alternative.

---

## Appendix A — Quick reference links

| Need | Document |
|------|----------|
| UX philosophy | [UXMD-I Part D](../uxmd/volume-i-user-experience-master-document.md) |
| Screen specs | [UXMD-II](../uxmd/volume-ii-screen-interaction-specification.md) |
| GIS tokens & states | [UXMD-III](../uxmd/volume-iii-global-interaction-standards.md) |
| Module ownership | [PDD Vol II](../pdd/volume-ii-module-specifications.md) |
| Nav law | [ADR-0005](../architecture/adr/0005-seven-item-primary-navigation.md) |
| CC home | [ADR-0002](../architecture/adr/0002-command-center-as-home.md) |
| Preview RCA | [preview-regression-rca.md](../build-2/preview-regression-rca.md) |
| Failure patterns | [08 Failure Encyclopedia](./08-failure-encyclopedia.md) |
| Onboarding | [07 AI Onboarding Curriculum](./07-ai-onboarding-curriculum.md) |

---

## Appendix B — UX architect checklist

Before shipping UI changes, confirm:

1. Does this surface help a **decision** or honestly admit absence of intelligence?
2. Are all tokens from `@conquest/gis`?
3. Is empty state honest with CTA — no fabricated data?
4. Are confidence and verification visible on intelligence outputs?
5. Is component inside `RouterProvider` if using router APIs?
6. Does presentation layer avoid cognitive/platform imports?
7. Are loading/error/empty states GIS-compliant?
8. Does keyboard and screen reader path work for primary actions?
9. Is this a decision zone (priority) not an equal widget?
10. Does change align with UXMD Screen ID for this surface?

**All must pass.**

---

*Institutional memory document 06 — UX Intelligence Bible. Amends via governance record only.*
