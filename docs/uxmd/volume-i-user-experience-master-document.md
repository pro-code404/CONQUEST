# UXMD VOLUME I — USER EXPERIENCE MASTER DOCUMENT

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | UXMD Volume I — User Experience Master Document |
| **Abbreviation** | UXMD-I |
| **Status** | User Experience Authority — Volume 1 of 2 |
| **Version** | 1.0 |
| **Supreme Authority** | CCIS |
| **Subordinate To** | CCIS, AMD Volumes I–IV, PDD Volume I, PDD Volume II |
| **Precedes** | UXMD Volume II (Screen-by-Screen), SDD Volume I, UI Design System, Build |

### Mission

Translate **CCIS philosophy**, **AMD architecture**, and **PDD behavior** into the **experiential reality of using Conquest** — how it feels, how users move, how trust is earned, and how intelligence is encountered — **before any UI implementation**.

| Document | Question |
|----------|----------|
| CCIS | What does Conquest believe? |
| AMD | What is Conquest? |
| PDD Volume I | How does Conquest behave? |
| PDD Volume II | What does each module do? |
| **UXMD Volume I** | **How does the user experience Conquest?** |
| UXMD Volume II | What does each screen specify? |
| SDD Volume I | How is Conquest engineered? |

### Strict Prohibitions

This document does **not** contain:

- Color palettes, typography scales, spacing grids, or visual tokens
- Figma files, wireframes, mockups, or component libraries
- Button labels as design specs, CSS, or framework choices
- Database schemas, APIs, authentication implementation, or infrastructure
- Code, pseudocode, or engineering tasks

**Build phase has not started. UI Design System has not started.**

### Experience Definition Standard

Every experience section in this document answers:

| Question | Requirement |
|----------|-------------|
| **What does the user feel?** | Emotional and cognitive outcome |
| **What does the user understand?** | Comprehension without machinery exposure |
| **What does the user control?** | Authority boundaries |
| **What does the user do next?** | Direction — CCIS §XV.2 |
| **What happens on failure?** | Honest state + recovery path |
| **What builds trust?** | Evidence, confidence, transparency |

---

# PART A — EXPERIENCE PHILOSOPHY

## A.1 Experience Identity

Conquest must feel like an **Intelligence Command Center** — not a chatbot, not a generic AI assistant, not a passive analytics dashboard, not a static reporting tool.

The user should feel they have entered a **decision operating environment** where intelligence is working on their behalf, surfacing what matters, and waiting for their authority on what to do next.

## A.2 Required Experience Qualities

Derived from CCIS §XV.2 and PDD behavioral laws:

| Quality | User experience | CCIS / PDD source |
|---------|-----------------|-------------------|
| **Clarity** | The user always understands the current situation — even when intelligence is complex | CCIS §XV.2 Clarity |
| **Confidence** | The user knows how certain Conquest is — and why — on every major output | CCIS §XV.2 Confidence; BH-3 |
| **Control** | The user retains authority on high-stakes decisions; Conquest advises, never usurps | CCIS §XV.2 Control; BH-9 |
| **Trust** | Trust is earned through accuracy, honesty, and recoverability — not fluency | CCIS §XV.2 Trust |
| **Awareness** | The user knows what Conquest is doing, what changed, and what is stale | BH-7; Activity feed |
| **Direction** | Every session resolves toward action — not endless exploration | CCIS §XV.2 Direction |
| **Transparency** | Evidence and limitations are one step away — never buried | CCIS §XV.2 Transparency |
| **Calm authority** | Conquest speaks with measured confidence — never alarmist theater, never false certainty | HUM calibration |
| **Honesty** | Empty states are honest; degraded states are explicit; gaps are named | BH-7, BH-8 |
| **Progress** | The user senses Conquest improving over time — without seeing learning machinery | BH-10; invisible learning |

## A.3 Anti-Patterns — What Conquest Must Never Feel Like

| Anti-pattern | Why it is rejected | Correct experience |
|--------------|-------------------|-------------------|
| **Chatbot** | Optimizes dialogue length over decision quality | Structured intelligence with resolution |
| **Generic AI assistant** | Hides uncertainty behind fluent prose | Confidence-labeled structured outputs |
| **Analytics dashboard** | Charts without decisions | Prioritized intelligence with recommendations |
| **Reporting tool** | Static snapshots without live awareness | Command Center live + Reports archival |
| **Black box** | User cannot verify claims | Evidence accessible on demand |
| **Overwhelming wall of data** | Metrics without priority | Priority-ordered intelligence zones |
| **False busy-ness** | Activity theater without substance | Plain-language meaningful events only |
| **Infantilizing** | Oversimplified to the point of uselessness | Calibrated depth per user and stakes |

## A.4 Experience Laws

| # | Law |
|---|-----|
| **UX-1** | Never sacrifice accuracy for fluency |
| **UX-2** | Never hide confidence levels |
| **UX-3** | Never present predictions as facts |
| **UX-4** | Always provide a path to deeper evidence |
| **UX-5** | Scale experiential rigor to decision stakes |
| **UX-6** | Resolve toward decisions — not endless conversation |
| **UX-7** | Empty is honest — never fabricated |
| **UX-8** | Degraded is explicit — never silent staleness |
| **UX-9** | User authority on irreversible actions is non-negotiable |
| **UX-10** | Intelligence machinery remains invisible |
| **UX-11** | Every major interaction has success, failure, and recovery paths |
| **UX-12** | Command Center is home — always |

## A.5 Success Feeling

A successful Conquest session feels like:

> "I know what is happening. I know what matters. I know what Conquest recommends and how sure it is. I know what to do next. I can verify if I want to. I am in control."

A failed Conquest session feels like:

> "Something went wrong, I understand what, and I know how to fix it or get help."

Never:

> "I got a confident-sounding paragraph but I don't know if I should trust it."

---

# PART B — USER JOURNEY ARCHITECTURE

## B.1 Journey Principle

Every user progresses through **stages of relationship** with Conquest. Each stage has distinct experiential goals, emotional targets, and success criteria. No stage is skipped in design — even if some users move through quickly.

## B.2 Master Journey Map

```
Visitor
   ↓
Registration
   ↓
Verification
   ↓
Onboarding
   ↓
Workspace Creation
   ↓
Data Connection
   ↓
First Intelligence (Initialization)
   ↓
First Report
   ↓
First Decision
   ↓
Retention (Habit Formation)
   ↓
Power User (Depth + Automation)
```

## B.3 Stage Specifications

### Stage 1 — Visitor

| Dimension | Experience definition |
|-----------|----------------------|
| **Goal** | Understand what Conquest is and why it is different |
| **Feel** | Curiosity, clarity, no pressure |
| **See** | Value proposition framed as decision superiority — not AI chat |
| **Do** | Begin registration or return to login |
| **Avoid** | Fake demo intelligence; chat-style interaction |
| **Success** | Visitor understands Conquest is an Intelligence Command Center |
| **Failure** | Visitor leaves thinking Conquest is "another AI tool" |
| **Recovery** | Clear differentiation messaging; no chatbot preview |

### Stage 2 — Registration

| Dimension | Experience definition |
|-----------|----------------------|
| **Goal** | Create account with minimal friction |
| **Feel** | Progress, security, simplicity |
| **See** | Required fields only; plan context if applicable |
| **Do** | Submit registration; receive verification prompt |
| **Avoid** | Premature workspace complexity |
| **Success** | Account created; user knows next step |
| **Failure** | Validation error with specific recovery instruction |
| **Recovery** | Inline error explanation; retry without data loss |

### Stage 3 — Verification

| Dimension | Experience definition |
|-----------|----------------------|
| **Goal** | Confirm identity; establish trust in account security |
| **Feel** | Security, brief wait, forward momentum |
| **See** | Verification status; resend option; expiry notice |
| **Do** | Verify email or complete MFA setup if required |
| **Success** | Verified state; automatic progression to onboarding |
| **Failure** | Expired link, wrong code — clear regeneration path |
| **Recovery** | Resend verification; support link if persistent failure |

### Stage 4 — Onboarding

| Dimension | Experience definition |
|-----------|----------------------|
| **Goal** | Orient user to Conquest's operating model before first value |
| **Feel** | Guided confidence — not tutorial overload |
| **See** | Brief orientation: Command Center concept, workspace concept, what Conquest will do when data connects |
| **Do** | Create first workspace OR enter existing org workspace |
| **Avoid** | Exposing intelligence systems; chat-style onboarding |
| **Success** | User understands: workspace scopes everything; Command Center is home; Conquest works in background |
| **Failure** | User confused about where to go after onboarding |
| **Recovery** | Abbreviated re-orientation available from Support |

**Onboarding experiential beats (minimum):**

1. "Conquest is your Intelligence Command Center"
2. "Everything happens inside a Workspace"
3. "Connect data — Conquest builds intelligence automatically"
4. "You decide — Conquest recommends"

### Stage 5 — Workspace Creation

| Dimension | Experience definition |
|-----------|----------------------|
| **Goal** | Establish bounded operating context |
| **Feel** | Ownership, purpose, clarity of scope |
| **See** | Name, type, primary goal — minimum required |
| **Do** | Define workspace; land in Dormant Command Center with honest empty state |
| **Success** | User names what they are optimizing for |
| **Failure** | Plan limit, validation error — upgrade or correction path |
| **Recovery** | Preserve entered data on validation failure |

### Stage 6 — Data Connection

| Dimension | Experience definition |
|-----------|----------------------|
| **Goal** | Activate intelligence through first source |
| **Feel** | Progress, anticipation, trust in connection process |
| **See** | Source selection; connection status; plain-language progress |
| **Do** | Authorize source; confirm connected state |
| **Success** | Source shows connected; initialization begins if first source |
| **Failure** | Auth failure, validation failure — specific reconnect guidance |
| **Recovery** | Retry connection; alternative source suggestion |

### Stage 7 — First Intelligence (Initialization)

| Dimension | Experience definition |
|-----------|----------------------|
| **Goal** | Prove Conquest value in first session |
| **Feel** | Anticipation → satisfaction; "it actually works" |
| **See** | Progressive plain-language status; Command Center populating |
| **Receive** | Executive summary, baselines, up to 3 recommendations, goal tracker |
| **Success** | Actionable intelligence within first session; all verified |
| **Failure** | Sparse data — honest limited intelligence, not fabrication |
| **Recovery** | Guide to additional sources; clarification recommendation if goals vague |

### Stage 8 — First Report

| Dimension | Experience definition |
|-----------|----------------------|
| **Goal** | Milestone — user produces distributable intelligence |
| **Feel** | Accomplishment, shareability |
| **See** | Offered after initialization: "Your first intelligence report is ready to generate" |
| **Do** | Generate Executive Report; view; optional export |
| **Success** | Immutable snapshot created; user understands Reports vs live Command Center |
| **Failure** | Generation blocked — verification failure with reason |
| **Recovery** | Retry after refresh; Support if persistent |

### Stage 9 — First Decision

| Dimension | Experience definition |
|-----------|----------------------|
| **Goal** | User exercises authority on a recommendation |
| **Feel** | Control, clarity of stakes |
| **See** | Recommendation with confidence, evidence, alternatives |
| **Do** | Approve, modify, defer, reject, or correct |
| **Success** | Decision recorded; action or learning captured |
| **Failure** | Execution blocked — clear reason, not silent ignore |
| **Recovery** | Modify and re-verify; Support for authorization issues |

### Stage 10 — Retention (Habit Formation)

| Dimension | Experience definition |
|-----------|----------------------|
| **Goal** | User returns because Command Center delivers ongoing value |
| **Feel** | Familiarity, efficiency, growing trust |
| **See** | Material changes since last session; fresh intelligence; pending decisions |
| **Do** | Daily Command Center check; act on alerts; Ask Conquest; approve recommendations |
| **Success** | Return frequency; recommendation action rate; declining correction rate |
| **Failure** | User stops returning — empty or irrelevant Command Center |
| **Recovery** | OPT signal (invisible); Support outreach on plan tier; onboarding re-offer |

### Stage 11 — Power User

| Dimension | Experience definition |
|-----------|----------------------|
| **Goal** | Depth, automation, multi-workspace mastery |
| **Feel** | Efficiency, leverage, organizational command |
| **See** | Strategy Center depth; Automation catalog; comparative reports; team collaboration |
| **Do** | Automate validated decisions; manage initiatives; install extensions; govern team |
| **Success** | Automations running; strategic initiatives tracked; extensions extending capability |
| **Failure** | Automation failure without recovery — trust erosion |
| **Recovery** | Rollback; pause; review; Support escalation |

## B.4 Journey Timing Expectations

| Milestone | Experiential target |
|-----------|---------------------|
| Registration to verified | Minutes |
| Onboarding to workspace | Single session |
| Workspace to first connected source | Single session |
| First source to first intelligence | Same session (initialization) |
| First intelligence to first report offer | Same or next session |
| First report to first decision | Same session ideally |
| Retention habit | Within 7 days of first intelligence |

---

# PART C — NAVIGATION ARCHITECTURE

## C.1 Navigation Principle

Navigation exists to move users toward **decisions and outcomes** — not to expose system architecture. Every nav item must pass the **four-question justification test**:

| Question | Requirement |
|----------|-------------|
| Why does it exist? | Distinct user job — not duplicable elsewhere |
| What problem does it solve? | Named user pain |
| What happens if removed? | Specific capability loss |
| Does it expose machinery? | If yes — reject as nav item |

## C.2 Primary Navigation (Final — 7 Items)

| # | Item | Why it exists | Problem solved | If removed |
|---|------|---------------|----------------|------------|
| 1 | **Command Center** | Daily intelligence cockpit — home | Fragmented awareness; no decision destination | Conquest has no product |
| 2 | **Reports** | Distributable intelligence snapshots | Live view cannot be shared or archived formally | No stakeholder communication |
| 3 | **Automation** | Repeatable authorized action | Manual repetition of validated decisions | Analysis-only tool |
| 4 | **Knowledge** | Organizational reference intelligence | Validated knowledge separate from live analysis | No knowledge management |
| 5 | **Strategy Center** | Strategic depth beyond summary cards | Cards insufficient for planning and tracking | Strategic users lose depth |
| 6 | **Marketplace** | Governed extension | Domain diversity impossible in core alone | Limited to built-in capability |
| 7 | **Settings** | Configuration and governance | No user control over scope, security, billing | Incomplete product |

## C.3 Rejected Navigation Items

| Rejected item | Why rejected | Where capability lives |
|---------------|--------------|------------------------|
| **Dashboard** | Duplicates Command Center | Command Center (renamed intentionally) |
| **Workspace** | Context, not destination | Utility bar selector + Settings |
| **Intelligence** | Too vague; exposes machinery | Command Center + Strategy Center |
| **Research** | Internal capability | Ask Conquest; Strategy Center; Reports |
| **Analysis** | Subsumed by Command Center | Command Center drill-downs |
| **Memory** | Machinery exposure | Memory Insights widget; Knowledge |
| **Prediction** | Machinery exposure | Prediction Monitor widget |
| **Verification** | Machinery exposure | Trustworthy outputs; evidence viewer |
| **Learning** | Invisible by design | Quality improvement over time |
| **Models** | Infrastructure | Settings (admin) |
| **Chat** | Chatbot anti-pattern | Ask Conquest (structured, not chat) |

## C.4 Utility Bar (Not Primary Nav)

| Item | Why it exists | Experience |
|------|---------------|------------|
| **Workspace Selector** | Context switch without nav clutter | Always visible; switch scopes all modules |
| **Notifications** | Time-sensitive attention routing | Badge; priority-ordered list |
| **Help / Support** | Assistance without nav slot | Always reachable |
| **Profile** | Account identity and sign-out | Dropdown; not a product module |

## C.5 Navigation Laws

| # | Law |
|---|-----|
| **NAV-1** | Maximum 7 primary items — frozen |
| **NAV-2** | Command Center is always home |
| **NAV-3** | No intelligence system name in navigation |
| **NAV-4** | Drill-down replaces nav expansion |
| **NAV-5** | New nav item requires UXMD amendment |
| **NAV-6** | Workspace is context, not parallel product |
| **NAV-7** | Users navigate decisions, not machinery |

## C.6 Role-Based Nav Visibility

| Item | Viewer | Member | Manager | Admin | Owner |
|------|--------|--------|---------|-------|-------|
| Command Center | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reports | ✓ | ✓ | ✓ | ✓ | ✓ |
| Automation | — | ✓ | ✓ | ✓ | ✓ |
| Knowledge | ✓ | ✓ | ✓ | ✓ | ✓ |
| Strategy Center | ✓ | ✓ | ✓ | ✓ | ✓ |
| Marketplace | — | — | ✓ | ✓ | ✓ |
| Settings | limited | limited | ✓ | ✓ | ✓ |

## C.7 Navigation Mental Model

The user should think:

> "I land in my Command Center. I switch workspace when context changes. I go deeper when I need more. I configure in Settings. I get help from Support."

Not:

> "I navigate between AI systems."

---

# PART D — COMMAND CENTER EXPERIENCE

## D.1 Identity — Not a Dashboard

The Command Center is an **Intelligence Command Center** — a prioritized decision environment, not a grid of charts.

| Dashboard experience (rejected) | Command Center experience (required) |
|--------------------------------|--------------------------------------|
| Metrics first | Situation first |
| Equal-weight widgets | Priority-ordered zones |
| User configures everything | Conquest prioritizes; user may adjust |
| Static until refresh | Live with explicit freshness |
| Charts without action | Recommendations with authority |
| "Here is data" | "Here is what matters and what to do" |

## D.2 Entry Experience

When the user enters Conquest (B1), they land in Command Center within one navigation step.

| State | User experience |
|-------|-----------------|
| **No workspace** | Routed to workspace creation — not empty Command Center |
| **Dormant** | Honest empty: "Connect a data source to activate intelligence" |
| **Initializing** | Progressive status: plain-language initialization progress |
| **Ready** | Full prioritized intelligence display |
| **Awaiting Decision** | Recommendations prominently surfaced |
| **Degraded** | Affected zones show degraded notice; unaffected zones normal |
| **Processing** | Background refresh indicator; last verified snapshot shown |

**First login today:** Material changes since last session highlighted.

## D.3 Priority Zones (Experiential Order)

What the user encounters, in priority order:

| Priority | Zone | User question answered |
|----------|------|------------------------|
| **P0** | Critical alerts | "What needs immediate attention?" |
| **P1** | Pending recommendations | "What should I decide?" |
| **P2** | Executive summary | "What is the situation?" |
| **P3** | Risks and threats | "What could go wrong?" |
| **P4** | Opportunities | "What upside exists?" |
| **P5** | Predictions | "What is likely ahead?" |
| **P6** | Goal progress | "Am I on track?" |
| **P7** | KPI performance | "How are metrics moving?" |
| **P8** | Execution status | "What is running?" |
| **P9** | Activity feed | "What has Conquest done?" |
| **P10** | Memory insights | "What has Conquest learned?" |

User attention flows top-down. Lower zones never compete with P0–P1.

## D.4 Presentation Modes (Behavioral Filter)

| Mode | Experience | User job |
|------|------------|----------|
| **Executive** | Summary, risks, opportunities, top recommendation | Leadership orientation |
| **Operational** | KPIs, anomalies, execution status | Day-to-day operations |
| **Strategic** | Opportunities, competitors, predictions, initiatives | Planning horizon |
| **Focused** | Single goal or project scope | Deep work on one objective |

Modes filter presentation — they do not change intelligence quality or verification.

## D.5 Ask Conquest Experience

Ask Conquest is **not chat**. It is a structured intelligence request.

| Chat (rejected) | Ask Conquest (required) |
|-----------------|---------------------------|
| Streaming prose | Structured response sections |
| Endless thread | Resolution toward answer + action |
| Hidden confidence | Confidence band visible |
| No evidence path | Evidence accessible |
| Equal stakes | Stakes-scaled cycle depth |

**Response structure the user receives:**

1. Assessment (with confidence)
2. Leading hypotheses (ranked)
3. Evidence summary
4. Recommendation (if warranted)
5. Prediction (if applicable — labeled)
6. Next actions

**Clarification:** At most one focused clarifying question before deep cycle — never interrogation.

## D.6 Decision Experience in Command Center

| Action | User experience |
|--------|-------------------|
| **Approve** | Confirmation if irreversible; execution begins; status visible |
| **Reject** | Optional reason; removed from queue; no guilt language |
| **Defer** | Snooze with reminder; item deprioritized |
| **Modify** | Modification flow; re-verification if material |
| **Correct** | Immediate acknowledgment; affected intelligence updates |
| **View evidence** | Lineage without machinery names |
| **View alternatives** | Rejected options with rationale |

## D.7 Empty and Degraded Experiences

| Condition | Experience |
|-----------|------------|
| **No data connected** | Honest guidance; connect action prominent |
| **Insufficient history** | Reduced confidence with explicit notice |
| **Source degraded** | Affected outputs flagged; reconnect guidance |
| **Verification failed** | Affected outputs suppressed; reason stated |
| **No recommendations** | "Insufficient evidence for recommendation" + next steps |

## D.8 Real-Time Experience

Updates arrive without navigation:

- New P0 alert → immediate surfacing
- Recommendation resolved → panel updates
- Cycle complete → freshness indicators update
- Automation step → execution status updates
- Prediction revised → user notified

Stale data always shows age — never silent outdated intelligence.

---

# PART E — INTELLIGENCE EXPERIENCE

## E.1 Trust Principle

Trust is won through **accuracy, honesty, and recoverability** — not through confident language or visual polish.

## E.2 Intelligence Presentation Contract

Every major intelligence output the user encounters must satisfy:

| Element | User experience |
|---------|-----------------|
| **Confidence** | Visible band on every major output |
| **Evidence** | Accessible within one intentional action |
| **Limitations** | Gaps and uncertainty named — not hidden |
| **Freshness** | Timestamp on time-sensitive outputs |
| **Prediction label** | Forecasts never presented as facts |
| **Hypothesis vs fact** | Inferences distinguished from verified data |
| **Alternatives** | Available for recommendations |
| **Correction path** | User can override any major element |

## E.3 Presentation by Intelligence Type

### Analysis

| Experience | Definition |
|------------|------------|
| **Feel** | "I understand what is happening and why" |
| **Structure** | Situation → factors → implications |
| **Depth** | Summary in Command Center; full in Strategy Center |
| **Trust signal** | Contributing factors with evidence class |

### Predictions

| Experience | Definition |
|------------|------------|
| **Feel** | "I know what might happen and what would change my mind" |
| **Structure** | Forecast + assumptions + invalidation conditions |
| **Label** | Always marked as prediction |
| **Revision** | User notified when prediction updates |
| **Failure** | Invalidation stated honestly; learning invisible |

### Research

| Experience | Definition |
|------------|------------|
| **Feel** | "I see what Conquest found and what it could not find" |
| **Structure** | Findings + sources + gaps + confidence |
| **Distinction** | Findings ≠ recommendations |
| **Depth** | Strategy Center and deep Ask Conquest responses |

### Recommendations

| Experience | Definition |
|------------|------------|
| **Feel** | "I can act with full information" |
| **Structure** | Title, rationale, confidence, risk, evidence, alternatives, actions |
| **Authority** | User decides — Conquest does not auto-execute high-stakes |
| **Threshold** | Below-threshold options not surfaced as recommendations |

### Confidence Bands (Behavioral)

| Band | User interpretation | Conquest behavior |
|------|---------------------|-------------------|
| **High** | Strong evidence; act with confidence | Full recommendation surfacing |
| **Medium** | Reasonable but gaps exist; proceed with awareness | Recommendation with caveats |
| **Low** | Significant uncertainty; investigate further | Insight only — not recommendation |
| **Insufficient** | Cannot determine responsibly | Explicit "cannot determine" + next steps |

## E.4 Evidence Experience

| User action | Experience |
|-------------|------------|
| Request evidence | Lineage displayed: sources, recency, class |
| See conflict | Both positions shown — not averaged silently |
| See stale evidence | Staleness labeled; refresh offered for high-stakes |
| See gap | "What Conquest does not know" section |

## E.5 Correction Experience

| Step | Experience |
|------|------------|
| User initiates correction | Available on any major intelligence element |
| User submits | Immediate acknowledgment |
| Scope selection | This instance vs persistent |
| Re-cycle | Affected intelligence updates; user sees change |
| Future | Correction respected going forward |

Correction feels empowering — not adversarial.

## E.6 Differentiation Experience

| vs | User should feel |
|----|------------------|
| **ChatGPT / Claude** | Structure and resolution — not conversation |
| **Perplexity** | Decision support — not search results |
| **Gemini** | Command authority — not assistant deference |
| **Analytics dashboards** | "What to do" — not only "what happened" |
| **Reporting tools** | Living intelligence — not static documents |

---

# PART F — REPORTING EXPERIENCE

## F.1 Reports vs Command Center

| Dimension | Command Center | Reports |
|-----------|----------------|---------|
| **Nature** | Live intelligence | Immutable snapshot |
| **Purpose** | Daily decisions | Distribution and archive |
| **Updates** | Real-time | Regeneration creates new version |
| **Audience** | Operator | Operator + stakeholders |

User must never confuse live intelligence with a report snapshot.

## F.2 Generation Experience

```
User selects report type and parameters
   ↓
Freshness check communicated
   ↓
If refresh needed: plain-language "Updating intelligence…"
   ↓
Verification gate (invisible but outcome visible)
   ↓
Report ready notification
   ↓
User views immutable snapshot
```

| Experience | Rule |
|------------|------|
| **Progress** | Plain-language status during generation |
| **Verification fail** | Block with reason — no partial unverified report |
| **Gaps** | Explicit gaps section in report |
| **First report** | Offered as milestone after initialization |

## F.3 Viewing Experience

| Element | User experience |
|---------|-----------------|
| Report header | Type, period, generation timestamp |
| Confidence labels | On all major claims |
| Prediction labels | On all forecasts |
| Evidence appendix | Available on demand |
| Immutability | Clear "snapshot as of [time]" notice |

## F.4 Comparison Experience

| Comparison | User experience |
|------------|-----------------|
| Period vs period | Delta highlights between two snapshots |
| Channel vs channel | Comparative analysis report |
| Report vs live | Explicit staleness comparison offered |
| Before vs after | Initiative impact comparison |

Comparisons produce new reports — originals unchanged.

## F.5 History and Archive Experience

| Action | Experience |
|--------|------------|
| Browse history | Chronological list; filter by type, date, project |
| Regenerate | New snapshot — not mutation of old |
| Export | PDF, data appendix, share link |
| Delete | Per policy; confirmation required |
| Schedule | Set-and-forget with delivery notification |

## F.6 Distribution Experience

| Channel | Experience |
|---------|------------|
| In-app | Default — Reports Center |
| Email | Opt-in; scheduled delivery |
| Share link | Org-scoped; permission enforced |
| External | Disabled by default; admin enables |

---

# PART G — WORKSPACE EXPERIENCE

## G.1 Workspace as Context

The user always knows **which workspace they are in**. Workspace scopes everything — intelligence, memory, team, automations, reports.

Workspace selector is always visible in utility bar — not buried in nav.

## G.2 Workspace Types Experience

| Type | Experiential emphasis |
|------|----------------------|
| **Business** | Revenue, operations, competitive position |
| **Marketing** | Channel performance, audience, content |
| **Commerce** | Sales, conversion, product performance |
| **Trading** | Positions, risk, market signals |
| **Research** | Evidence depth, knowledge accumulation |
| **Custom** | User-defined goal emphasis |

Type influences what Command Center emphasizes — not what modules exist.

## G.3 Project Organization Experience

```
Workspace
   └── Goal (required)
         └── Project (optional)
               └── Milestone (optional)
```

| Entity | User experience |
|--------|-----------------|
| **Goal** | Always visible; anchors Command Center |
| **Project** | Optional focus; scopes reports and tracking |
| **Milestone** | Checkpoint; links decisions and outcomes |

## G.4 Organization vs Personal Workspace

| Context | Experience |
|---------|------------|
| **Personal organization** | Single user; full control |
| **Team organization** | Shared workspaces; role-based access |
| **Multi-workspace** | Agency/enterprise — client or department separation |
| **Workspace switch** | Instant context change; no bleed between workspaces |

## G.5 Team Experience

| Role | Experience |
|------|------------|
| **Owner** | Full control |
| **Admin** | Members, integrations, marketplace |
| **Manager** | Approvals, automations, invites |
| **Member** | Act on recommendations, create automations |
| **Viewer** | Read intelligence; no execution |

New member: abbreviated orientation — not full onboarding repeat.

## G.6 Memory Context Experience

Users do **not** browse raw memory. Users experience memory through:

| Surface | Feel |
|---------|------|
| Memory Insights | "Conquest has learned patterns" |
| Correction acknowledgment | "Conquest will apply this going forward" |
| Goal history | "Here is how this goal has progressed" |
| Knowledge | "Here is what the organization knows" |

## G.7 Switching Experience

| Action | Experience |
|--------|------------|
| Switch workspace | Immediate context change; Command Center reloads scoped state |
| Switch organization | If multi-org: clear org boundary |
| Recent workspaces | Quick access in selector |
| Archive workspace | Read-only; clear "archived" state |

## G.8 Permissions Experience

| Situation | Experience |
|-----------|------------|
| Permission denied | Clear message — no broken partial UI |
| Escalation needed | "Contact your admin" with specific missing permission |
| Plan limit | Upgrade path — not cryptic block |

---

# PART H — NOTIFICATION EXPERIENCE

## H.1 Notification Principle

Notifications route attention — they do not create anxiety. Every notification must justify interruption.

## H.2 Notification Categories

| Category | Urgency | User experience |
|----------|---------|-----------------|
| **Critical alerts** | P0 — immediate | Anomaly, critical threat, automation failure |
| **Recommendations** | P1 — high | New recommendation awaiting decision |
| **Warnings** | P2 — elevated | Degraded source, stale intelligence, prediction invalidation |
| **Reminders** | P3 — scheduled | Deferred decision, scheduled report ready |
| **Informational** | P4 — low | Initialization complete, extension installed |
| **Collaboration** | P3 | Team assignment, invite accepted |

## H.3 Channel Behavior

| Channel | When used |
|---------|-----------|
| **In-app** | All notifications; primary |
| **Email** | Opt-in per category; digest option |
| **Push** | Critical and P1 only; opt-in |

## H.4 Notification Rules

| Rule | Requirement |
|------|-------------|
| **No spam** | Batched where appropriate |
| **Actionable** | Every P0–P1 links to resolution context |
| **Dismissible** | With optional reason for learning |
| **Quiet hours** | User-configurable |
| **Priority respect** | P0 never buried by P4 |

## H.5 Reminder Experience

| Reminder type | Experience |
|---------------|------------|
| Deferred recommendation | Returns on snooze date |
| Scheduled report | "Your report is ready" |
| Stale source | "Reconnect [source] for fresh intelligence" |
| Initiative checkpoint | Milestone due notice |

---

# PART I — ERROR EXPERIENCE

## I.1 Error Principle

Every major interaction defines three paths: **Success**, **Failure**, **Recovery**. Errors are honest, specific, and actionable — never generic or blame-shifting.

## I.2 Error Experience Template

| Path | Definition |
|------|------------|
| **Success** | Expected outcome achieved; user knows what happened |
| **Failure** | What went wrong — specific, not "something went wrong" |
| **Recovery** | Exact next action user can take |

## I.3 Major Interaction Error Matrix

### Authentication

| Path | Experience |
|------|------------|
| Success | Enter Command Center |
| Failure | "Invalid credentials" / "Session expired" |
| Recovery | Retry login; password reset; re-authenticate |

### Registration

| Path | Experience |
|------|------------|
| Success | Proceed to verification |
| Failure | Field-specific validation message |
| Recovery | Correct field; preserved other inputs |

### Data Connection

| Path | Experience |
|------|------------|
| Success | Connected status; initialization if first |
| Failure | Auth denied, invalid URL, rate limit |
| Recovery | Re-authorize; verify URL; wait and retry |

### Intelligence Initialization

| Path | Experience |
|------|------------|
| Success | Command Center populated |
| Failure | Empty source, verification fail, timeout |
| Recovery | Add source; retry; partial results with completeness notice |

### Ask Conquest

| Path | Experience |
|------|------------|
| Success | Structured response delivered |
| Failure | Insufficient evidence |
| Recovery | "Cannot determine with confidence" + research suggestion |

### Recommendation Decision

| Path | Experience |
|------|------------|
| Success | Action recorded; execution begins or learning captured |
| Failure | Authorization blocked |
| Recovery | Contact admin; modify scope; Support |

### Report Generation

| Path | Experience |
|------|------------|
| Success | Snapshot in Reports Center |
| Failure | Verification fail, timeout |
| Recovery | Retry; refresh intelligence first; Support |

### Automation Execution

| Path | Experience |
|------|------------|
| Success | Completion status; outcome measured |
| Failure | Step failure, deviation, rollback fail |
| Recovery | Pause; retry; rollback; review log; Support |

### Correction

| Path | Experience |
|------|------------|
| Success | Acknowledgment; intelligence updates |
| Failure | Ambiguous scope |
| Recovery | One clarifying question |

### Marketplace Install

| Path | Experience |
|------|------------|
| Success | Capability available in modules |
| Failure | Governance fail, incompatibility |
| Recovery | Review permissions; contact admin |

## I.4 System-Wide Error Rules

| Rule | Experience |
|------|------------|
| **No silent failure** | Every failure visible or logged with user notice if impactful |
| **No false success** | Never show intelligence that failed verification |
| **Preserve user input** | Form data retained on recoverable errors |
| **Support path** | Persistent failures link to Support with context |
| **No machinery exposure** | Errors reference outcomes — not system IDs |

## I.5 Degraded Operation Experience

Degraded is not error — it is honest reduced capability:

> "Intelligence from [source] is unavailable. Affected insights are marked. Reconnect to restore full intelligence."

---

# PART J — ACCESSIBILITY EXPERIENCE

## J.1 Accessibility Principle

Conquest must be usable by people with diverse abilities. Accessibility is an experience requirement — not a post-build checklist.

## J.2 Standards Commitment

| Standard | Behavioral commitment |
|----------|----------------------|
| **WCAG 2.2 Level AA** | Target compliance for all user-facing experiences |
| **Keyboard** | Full product navigable without pointer |
| **Screen readers** | All intelligence outputs meaningfully announced |
| **Contrast** | Readable in all theme modes |
| **Reduced motion** | Animations respect system preference |
| **Language** | Locale-aware formatting; future i18n-ready structure |

## J.3 Keyboard Experience

| Capability | Requirement |
|------------|-------------|
| Navigation | All primary nav and utility bar reachable |
| Command Center zones | Logical tab order matching priority |
| Actions | Approve, reject, defer, correct — keyboard accessible |
| Modals and flows | Trap focus; escape closes |
| Skip links | Skip to main intelligence content |

## J.4 Screen Reader Experience

| Content type | Announcement behavior |
|--------------|----------------------|
| Confidence | Announced with output |
| Predictions | Labeled as prediction before content |
| Alerts | Priority announced |
| State changes | Live regions for cycle completion, alerts |
| Evidence | Available in structured accessible view |

## J.5 Visual Accessibility (Behavioral)

| Requirement | Experience |
|-------------|------------|
| Contrast | Text readable on all backgrounds in both themes |
| Color independence | Confidence and status never color-only |
| Focus visibility | Clear focus indicator on interactive elements |
| Text scaling | Content remains usable at 200% zoom |

## J.6 Reduced Motion

| Condition | Experience |
|-----------|------------|
| Reduced motion preferred | No decorative animation; essential state change only |
| Real-time updates | Instant or fade — no distracting motion |

## J.7 Language and Locale

| Dimension | Experience |
|-----------|------------|
| Date/time | User timezone and format |
| Numbers | Locale-appropriate formatting |
| Currency | Workspace-appropriate display |
| Future i18n | Structure supports translation — launch language TBD in UXMD II |

## J.8 Mobile Experience (Behavioral)

| Principle | Definition |
|-----------|------------|
| **Mobile is supported** | Core journeys completable on mobile |
| **Command Center mobile** | Priority zones stack; P0–P1 always reachable |
| **Decisions on mobile** | Approve/reject/defer available |
| **Deep work** | Strategy and report comparison prefer desktop — not blocked on mobile |

---

# PART K — THEME SYSTEM

## K.1 Theme Principle

Theme is a **user comfort and accessibility preference** — not a branding exercise in UXMD. Theme must not change intelligence content, confidence, or priority.

## K.2 Theme Modes

| Mode | Behavioral definition |
|------|----------------------|
| **Light** | Default for well-lit environments; maximum ambient contrast |
| **Dark** | Reduced eye strain in low light; preserves readability |
| **System** | Follows OS preference; switches when OS switches |

## K.3 Theme Rules

| Rule | Requirement |
|------|-------------|
| **Content parity** | Intelligence identical across themes |
| **Confidence visible** | Bands readable in all themes |
| **Alert priority** | P0 distinguishable in all themes |
| **No theme-based intelligence change** | Theme never affects what Conquest says |
| **Persistence** | User choice saved; System tracks OS |
| **Onboarding default** | System mode unless user chooses |

## K.4 Theme and Trust

Theme must not:

- Make low-confidence appear high-confidence through contrast tricks
- Hide degraded or stale indicators
- Reduce evidence accessibility

## K.5 Appearance Settings (Behavioral)

| Setting | Experience |
|---------|------------|
| Theme mode | Light / Dark / System |
| Density | Compact / Comfortable — affects information density, not content |
| Locale | Timezone, date format |

Visual implementation of tokens — UXMD Volume II and UI Design System.

---

# PART L — CROSS-MODULE EXPERIENCE FLOWS

## L.1 Command Center → Strategy Center

Summary card → depth view. User expects more detail, not different conclusions.

## L.2 Command Center → Reports

"Generate report" → pre-filled context → snapshot distinct from live view.

## L.3 Recommendation → Automation

Approve → "Automate this" → first-run approval → execution visible in Command Center.

## L.4 Any Module → Support

Inaccuracy report carries artifact context. User never re-explains what they were viewing.

## L.5 Marketplace → Module

Install → capability appears in relevant module → user discovers through use or notification.

---

# PART M — UXMD LAWS (CONSOLIDATED)

| # | Law | Source |
|---|-----|--------|
| UX-1 – UX-12 | Experience laws | Part A |
| NAV-1 – NAV-7 | Navigation laws | Part C |
| MSD-1 – MSD-15 | Module behavior laws | PDD-II (binding) |
| BH-1 – BH-10 | Behavioral laws | PDD-I (binding) |
| PD-1 – PD-15 | Product design laws | PDD interim (binding) |

---

# PART N — APPROVAL CRITERIA FOR UXMD VOLUME I

UXMD Volume I is complete when:

- [ ] Experience philosophy derived from CCIS §XV
- [ ] Full user journey from Visitor through Power User defined
- [ ] Navigation justified — 7 items with rejection rationale
- [ ] Command Center defined as Intelligence Command Center — not dashboard
- [ ] Intelligence presentation contract defined (trust, confidence, evidence)
- [ ] Reporting, workspace, notification experiences defined
- [ ] Error matrix with success/failure/recovery for major interactions
- [ ] Accessibility behavioral requirements defined
- [ ] Theme behavioral system defined
- [ ] No colors, Figma, buttons, CSS, components, APIs, or databases
- [ ] UXMD Volume II scope identified (screen-by-screen)

---

# PART O — DOCUMENT SEQUENCE (LOCKED)

```
✅ CCIS
✅ AMD I–IV
✅ PDD Volume I (revision track)
✅ PDD Volume II v1.0
🔵 UXMD Volume I v1.0 (this document)
⬜ UXMD Volume I Review
⬜ UXMD Volume II — Screen-by-Screen Specifications
⬜ UXMD Review (both volumes)
⬜ SDD Volume I — System Design (Supabase, Auth, APIs, RBAC, Infrastructure)
⬜ SDD Review
⬜ Data Architecture
⬜ Supabase Architecture
⬜ Repository Cleanup Audit
⬜ UI Design System
⬜ Frontend Build
⬜ Backend Build
⬜ Integration
⬜ Testing
⬜ Beta
⬜ Production
```

**Do not start SDD Volume I, database design, API design, UI Design System, or build until UXMD Volume I is reviewed and UXMD Volume II is complete.**

---

*End of UXMD Volume I — User Experience Master Document v1.0*
