# PDD VOLUME II — MODULE SPECIFICATIONS DOCUMENT (MSD)

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | PDD Volume II — Module Specifications Document |
| **Abbreviation** | PDD-II / MSD |
| **Status** | Product Module Authority — Volume 2 of 2 |
| **Version** | 1.0 |
| **Supreme Intelligence Authority** | CCIS |
| **Subordinate To** | CCIS, AMD Volumes I–IV, SDD, PDD Volume I |
| **Precedes** | UXMD Volume I–II, SDD Volume I (expanded), Build |

### Mission

Define **what every major product module does** — complete behavioral specifications that translate PDD Volume I workflows into module responsibilities, user capabilities, intelligence surfacing, and success criteria.

| Document | Question |
|----------|----------|
| AMD | What is Conquest? |
| PDD Volume I | How does Conquest behave? |
| **PDD Volume II** | **What does each module do?** |
| UXMD | How does Conquest look and feel? |
| SDD Volume I | How is Conquest engineered? |

### Strict Prohibitions

This document does **not** contain:

- Screen layouts, wireframes, component styling, or visual specifications
- Database schemas, storage technology, or data models
- API definitions, endpoint specifications, or service contracts
- Implementation plans, sprints, or engineering tasks
- Code, pseudocode, or infrastructure choices

**Build phase has not started. UXMD has not started.**

### Standard Module Template

Every module specification in this document includes:

| Section | Defines |
|---------|---------|
| **Purpose** | Why the module exists |
| **Scope** | What the module owns and does not own |
| **PDD-I Bindings** | Workflows from Volume I that this module expresses |
| **What the User Sees** | User-visible surfaces and states (behavioral, not visual) |
| **Intelligence Surfaced** | Output types the module displays or produces |
| **User Actions** | What the user can initiate |
| **Decisions Supported** | Decision types the module enables |
| **Real-Time Updates** | What changes without user refresh |
| **System Actions** | What Conquest does automatically within the module |
| **Success Metrics** | How module success is measured |
| **Failure Behavior** | How failures appear and resolve |
| **Memory Interactions** | Memory types read or written at module boundary |
| **Module Relationships** | Dependencies on other modules |

---

# PART A — MODULE ARCHITECTURE

## A.1 Module Principle

Every product module is a **user-facing capability surface**. Modules consume intelligence outputs from PDD Volume I workflows. Modules are **not** intelligence systems. Users never navigate to Research, Memory, Reasoning, Verification, or Learning as modules.

## A.2 Primary Navigation (Final)

| # | Module | Nav item | Default landing |
|---|--------|----------|-----------------|
| 1 | Command Center | Yes | **Home** |
| 2 | Reports | Yes | No |
| 3 | Automation | Yes | No |
| 4 | Knowledge | Yes | No |
| 5 | Strategy Center | Yes | No |
| 6 | Marketplace | Yes | No |
| 7 | Settings | Yes | No |

**Not primary nav:** Workspace (context switcher + settings area), Support (utility bar), Billing (Settings subsection), Profile (utility menu).

## A.3 Intelligence Center Mapping

**Intelligence Center** is not a separate navigation item. It is the **behavioral intelligence depth surface** implemented primarily through:

| Capability | Primary module | Secondary surfaces |
|------------|----------------|-------------------|
| Research | Strategy Center | Command Center (Ask Conquest, Research Findings) |
| Analysis | Command Center | Strategy Center, Reports |
| Opportunity discovery | Command Center | Strategy Center |
| Competitor discovery | Command Center | Strategy Center, Reports |
| Strategic recommendations | Command Center | Strategy Center |

Strategy Center is the **depth module** for intelligence the user chooses to explore beyond Command Center summaries.

## A.4 Context Module

**Workspace** is not a parallel product. It is the **scoped operating context** for all modules. Workspace selector appears in the utility bar. Workspace configuration lives in Workspace settings (reachable from Settings and contextual actions).

---

# PART B — MODULE 1: COMMAND CENTER

## Purpose

The user's daily intelligence cockpit. Primary destination for operational awareness, decision support, and action initiation. Command Center is where Conquest proves it is an operating system — not a dashboard, chatbot, or static report.

## Scope

**Owns:**

- Prioritized intelligence synthesis for the active workspace
- Recommendation queue and decision capture
- Alert surfacing and dismissal
- Ask Conquest entry point
- Execution and automation status display
- Real-time intelligence freshness indicators

**Does not own:**

- Deep strategic planning (Strategy Center)
- Report history and export (Reports)
- Automation definition and logs (Automation)
- Knowledge curation (Knowledge)
- Extension installation (Marketplace)
- Account configuration (Settings)

## PDD-I Bindings

| Workflow | Role in Command Center |
|----------|------------------------|
| B1 — User Enters Conquest | Default landing; state resolution |
| C3 — Intelligence Initialization | Progressive population |
| D1 — Scheduled Refresh | Widget and summary updates |
| D2 — Anomaly Detection | P0 alert surfacing |
| D3 — Trend Discovery | KPI and trend updates |
| D4 — Competitor Identification | Competitor widget update |
| D5 — Ask Conquest | Structured response delivery |
| D6 — Recommendation Production | Recommendation panel |
| D7 — User Decision | Approve / Modify / Defer / Reject / Correct |
| F2 — Automation Execution | Execution status widget |
| F3 — Cross-Channel Synthesis | Unified intelligence zone |
| E3 — User Correction | Correction entry from any element |

## What the User Sees

| Surface | Behavioral content |
|---------|-------------------|
| **Executive Summary** | One-screen situational intelligence — situation, changes, top risks, opportunities, recommendation |
| **Recommendation Panel** | Ranked pending recommendations with confidence, risk, evidence access |
| **Alert Zone** | P0 anomalies, threats, degraded-source notices — priority ordered |
| **KPI Zone** | Goal-linked metrics with trend direction and freshness |
| **Opportunity Tracker** | Active opportunities with expiry and impact |
| **Risk Monitor** | Active threats and risk summary |
| **Prediction Monitor** | Active forecasts with invalidation conditions |
| **Goal Tracker** | Progress toward workspace goals |
| **Activity Feed** | Plain-language intelligence events — no system names |
| **Execution Status** | In-progress and recent automation/action outcomes |
| **Memory Insights** | Synthesized patterns from accumulated memory |
| **Ask Conquest** | Input for natural-language intelligence requests |
| **Behavioral State Indicator** | Ready, Processing, Degraded, Awaiting Decision, etc. |
| **Freshness Indicators** | Per-source and overall intelligence age |

**Empty states (BH-8):** Dormant workspace shows honest guidance to connect data — no fabricated intelligence.

**Conditional surfaces:** Competitor widget, Platform Performance, Revenue Breakdown appear only when workspace type and connected data support them.

## Intelligence Surfaced

| Output type | Primary widget / zone |
|-------------|----------------------|
| Executive Brief | Executive Summary |
| Strategic Recommendation | Recommendation Panel |
| Opportunity Alert | Opportunity Tracker |
| Threat Alert | Risk Monitor |
| Anomaly Alert | Alert Zone |
| Competitor Analysis | Competitor widget |
| Market Insight | Executive Summary, Platform Performance |
| Trend Analysis | KPI cards, performance charts |
| Predictive Forecast | Prediction Monitor |
| Risk Assessment | Risk Monitor |
| Research Findings | Analytical response zone (Ask Conquest / deep drill) |
| Memory Insight | Memory Insights |
| Goal Progress Update | Goal Tracker |
| Intelligence Activity Event | Activity Feed |
| Execution Result | Execution Status |

## User Actions

| Action | Result |
|--------|--------|
| View Command Center | See prioritized intelligence for active workspace |
| Ask Conquest | Submit question → structured intelligence response (D5) |
| Approve recommendation | Triggers execution or automation path (D7 → F1/F2) |
| Reject recommendation | Logged; learning signal; removed from queue |
| Defer recommendation | Snoozed with reminder |
| Modify recommendation | Modification flow → re-verification if material |
| View evidence | Opens evidence viewer for claim lineage |
| View alternatives | Shows rejected options with rationale |
| Correct intelligence | Correction flow (E3) |
| Drill into KPI | Navigates metric hierarchy within Command Center |
| Open opportunity / threat / prediction detail | Routes to Strategy Center depth view |
| Switch presentation mode | Executive / Operational / Strategic / Focused filter |
| Configure widgets | Add, remove, reorder within module rules |
| Generate report | Routes to Reports with context pre-filled |
| Create automation from recommendation | Routes to Automation with template pre-filled |
| Connect data source | Routes to Workspace data connection |
| Dismiss alert | Logged dismissal with optional reason |
| Report inaccuracy | Routes to Support with artifact context |

## Decisions Supported

| Decision type | How Command Center supports it |
|---------------|-------------------------------|
| **Operational** | KPI interpretation, anomaly investigation, trend response |
| **Tactical** | Recommendation approval on bounded actions |
| **Strategic** | Executive summary orientation; routes to Strategy Center for depth |
| **Authorization** | Explicit approve/reject on recommendations and irreversible actions |
| **Correction** | User truth override on any major intelligence element |
| **Prioritization** | User attention guided by alert priority and recommendation ranking |

## Real-Time Updates

| Element | Update trigger |
|---------|----------------|
| Alert Zone | D2 anomaly, D3 threat escalation, source degradation (C5) |
| KPI Zone | D1 refresh, D3 trend, source ingestion |
| Recommendation Panel | D6 new recommendation; D7 action removes item |
| Executive Summary | D1 cycle completion; material change threshold |
| Execution Status | F2 step progress and completion |
| Activity Feed | Any significant cycle event |
| Freshness indicators | Cycle completion; source status change |
| Behavioral state | Processing → Ready transitions |
| Prediction Monitor | PRD revision; invalidation |

Updates push to Command Center without requiring navigation. Stale data always shows explicit freshness notice (BH-7).

## System Actions

| Action | When |
|--------|------|
| Resolve landing state | B1 entry |
| Schedule background refresh | Freshness below threshold |
| Reprioritize display | New intelligence changes ranking |
| Push P0 alerts | Threshold breach or critical anomaly |
| Update widgets | Cycle completion |
| Log user decisions | Every recommendation action |
| Trigger targeted re-cycle | User correction or significant event |
| Route to workspace creation | No workspace exists |

## Success Metrics

| Metric | Target behavior |
|--------|-----------------|
| Time to orientation | User understands workspace state within first view |
| Recommendation action rate | Users act on surfaced recommendations |
| Correction rate | Low and declining per domain — indicates accuracy |
| Session depth | Users drill evidence and alternatives, not only skim |
| Alert signal-to-noise | Dismissals with reason inform tuning |
| Return frequency | Users return to Command Center as primary destination |
| First-session value | Actionable intelligence visible after C3 (when data connected) |

## Failure Behavior

| Failure | User experience |
|---------|-----------------|
| Auth failure | Block entry; no partial state |
| All sources degraded | Degraded state with reconnect guidance |
| Verification failure on cycle | Affected outputs suppressed; explicit notice |
| Insufficient evidence for query | "Cannot determine with confidence" + next steps |
| Corrupt cycle data | Safe fallback to last verified snapshot or honest empty |

## Memory Interactions

| Operation | Memory types |
|-----------|--------------|
| Read | Session, User, Project, Organization, Evidence (references), Correction, Success, Failure |
| Write | Session (entry), decision outcomes (via D7), Correction (via E3) |
| Never | Raw memory browser — synthesized surfaces only |

## Module Relationships

| Module | Relationship |
|--------|--------------|
| Workspace | Scoped to active workspace goals and sources |
| Reports | Report generation entry; snapshots of live intelligence |
| Automation | Recommendation → automation; execution status |
| Strategy Center | Depth views for opportunity, threat, competitor, initiative |
| Knowledge | Evidence viewer links to knowledge references |
| Marketplace | Extension widgets when installed |
| Settings | Mode and widget preferences |
| Support | Inaccuracy reports from any intelligence element |

---

# PART C — MODULE 2: WORKSPACE

## Purpose

The bounded operating headquarters for all Conquest activity — goals, projects, data connections, team, memory accumulation, and intelligence scope. Workspace prevents fragmentation and ensures every module operates within explicit boundaries.

## Scope

**Owns:**

- Workspace and project lifecycle
- Goal definition and hierarchy
- Data source connection inventory and health
- Team membership and workspace roles
- Workspace-scoped memory boundaries (user-visible synthesis only)
- Workspace behavioral state (Dormant through Paused)

**Does not own:**

- Intelligence production (workflows — surfaced in Command Center)
- Report formatting (Reports)
- Automation execution (Automation)
- Organization-wide policy (Settings → Organization)

## PDD-I Bindings

| Workflow | Role in Workspace |
|----------|-------------------|
| B2 — User Creates Workspace | Workspace creation |
| C1/C2 — Connect Data Source | Source connection and ingestion |
| C3 — Intelligence Initialization | First-data activation |
| C4 — Upload Documents | Document intake (also Knowledge) |
| C5 — Data Source Degrades | Health status and degraded scope |
| G1 — Team Member Joins | Collaboration onboarding |

## Project Creation

| Step | Product behavior |
|------|------------------|
| User creates workspace | Name, type, minimum one goal required |
| User adds project (optional) | Project scoped under goal |
| User adds milestone (optional) | Checkpoint under project |
| System initializes | Project Memory scaffold; graph seed; Dormant state |

**Workspace types:** Business, Marketing, Commerce, Trading, Research, Custom — each routes intelligence emphasis per ORC profile.

## Project Organization

```
Workspace
   └── Goal (required — minimum one)
         └── Project (optional)
               └── Milestone (optional)
                     └── Linked recommendations and outcomes
```

| Entity | Behavioral role |
|--------|-----------------|
| **Goal** | What the workspace optimizes for; anchors all intelligence |
| **Project** | Initiative container; scopes reports, memory, and tracking |
| **Milestone** | Checkpoint; links recommendations and measured outcomes |

## Project Memory (User-Visible)

Users do **not** browse raw memory. Users interact with memory through:

| User surface | Underlying memory |
|--------------|-------------------|
| Memory Insights (Command Center) | Cross-memory synthesis |
| Correction flow | Correction Memory |
| Goal history | Project Memory |
| Evidence viewer | Evidence Memory |
| Knowledge Center | Knowledge Memory |
| "What Conquest knows" summary | Organization + Project synthesis |

## Connected Assets

| Asset type | Connection behavior |
|------------|---------------------|
| **Social platforms** | OAuth/API; ingestion schedule; health monitoring |
| **Website / analytics** | URL + authorization; validation before ingest |
| **Documents** | Upload → validation → Knowledge integration |
| **Marketplace connectors** | Installed extension provides source |
| **Manual data** | Future — governed import |

| User action | Result |
|-------------|--------|
| Connect source | Validation → register → ingest (C1/C2) |
| View source health | Freshness, last sync, error state |
| Disconnect source | Archive; historical memory per policy; degraded scope |
| Reconnect source | Resume ingest; baseline comparison if available |

## Team Collaboration

| Role | Workspace capabilities |
|------|------------------------|
| **Owner** | Full control; billing; delete |
| **Admin** | Members, integrations, marketplace install |
| **Manager** | Automations, approvals above threshold, invites |
| **Member** | Act on recommendations, create automations |
| **Viewer** | Read intelligence; no execution |

| Action | Result |
|--------|--------|
| Invite member | Email invitation → G1 onboarding |
| Accept invitation | Access per role; abbreviated Command Center orientation |
| Remove member | Access revoked; audit record |
| Assign initiative | Strategy Center collaboration |

## Workspace Intelligence

Intelligence is **not structured for user navigation** inside Workspace. Workspace contains intelligence **results** scoped to its boundaries:

| Behavior | Description |
|----------|-------------|
| Initialization | C3 builds foundation on first data |
| Ongoing cycles | D1, events, user queries scoped to workspace |
| Degraded scope | C5 reduces confidence for affected sources only |
| Cross-workspace isolation | No intelligence bleed between workspaces |
| Archive | Read-only; cycles paused |
| Delete | Governed per organization policy |

## What the User Sees

| Surface | Content |
|---------|---------|
| Workspace selector | Active workspace; switch list |
| Goals and projects | Hierarchy with progress linkage |
| Data source inventory | Connection status, health, freshness |
| Team roster | Members, roles, pending invites |
| Workspace summary | Type, goals, source count, behavioral state |
| Empty workspace | Honest pre-activation guidance |

## User Actions

| Action | Result |
|--------|--------|
| Create workspace | New bounded environment (B2) |
| Edit name/type | Updated routing profile |
| Add/edit/delete goals | Re-anchors intelligence |
| Create/edit/archive project | Project scope updated |
| Connect/disconnect data source | Ingestion or archive (C1/C2/C5) |
| Upload document | Knowledge pipeline (C4) |
| Invite/remove team member | Collaboration change (G1) |
| View data source health | Per-source status |
| Archive workspace | Read-only; intelligence pauses |
| Delete workspace | Governed deletion |

## Decisions Supported

| Decision | Support |
|----------|---------|
| Scope definition | Goals and projects bound intelligence |
| Data investment | Which sources to connect |
| Team authority | Who can act vs observe |
| Workspace lifecycle | Archive vs delete |

## Real-Time Updates

| Element | Trigger |
|---------|---------|
| Source health | Ingestion events, C5 degradation |
| Initialization progress | C3 cycle stages |
| Team roster | Invite accept/remove |
| Behavioral state | Dormant → Initializing → Ready |

## Success Metrics

| Metric | Indication |
|--------|------------|
| Time to first source connected | Activation velocity |
| Initialization completion rate | C3 success |
| Goal clarity | Goals defined vs vague-default |
| Source reliability | Degradation frequency per workspace |
| Team adoption | Active members per workspace |

## Failure Behavior

| Failure | Behavior |
|---------|----------|
| Connection validation fail | Clear error; no false "connected" state |
| Plan limit exceeded | Block with upgrade path |
| Permission denied | Clear denial — no partial broken access |
| Empty source data | Honest empty; guide to additional sources |

## Memory Interactions

| Operation | Types |
|-----------|-------|
| Write on create | Project Memory scaffold, Organization registry |
| Write on goals | Project Memory |
| Read on all cycles | Project, Organization, Evidence |
| Graph | Entity seeding on initialization |

## Module Relationships

| Module | Relationship |
|--------|--------------|
| Command Center | Primary intelligence display for workspace |
| Strategy Center | Goals and initiatives |
| Reports | Scoped reports |
| Automation | Scoped automations |
| Settings | Workspace settings section |
| Knowledge | Scoped knowledge and uploads |

---

# PART D — MODULE 3: STRATEGY CENTER

## Purpose

**Intelligence Center depth module.** Strategic planning, opportunity and threat tracking, competitor intelligence, research findings, and initiative management — beyond Command Center summary cards. This is where users explore *why* and *what if*, not only *what now*.

## Scope

**Owns:**

- Deep strategic assessments
- Opportunity and threat lifecycle tracking
- Competitor profile depth
- Research findings presentation
- Strategic initiative management
- Growth plans and risk registers

**Does not own:**

- Daily operational cockpit (Command Center)
- Live KPI monitoring (Command Center)
- Report formatting and history (Reports)
- Raw research execution (invisible — D5, RES workflows)

## PDD-I Bindings

| Workflow | Role in Strategy Center |
|----------|-------------------------|
| D3 — Trend Discovery | Opportunity/threat cards → depth |
| D4 — Competitor Identification | Competitor profiles |
| D5 — Ask Conquest (strategic) | Research Findings, deep analysis |
| D6 — Recommendation Production | Strategic recommendation detail |
| F3 — Cross-Channel Synthesis | Portfolio strategic assessment |

## Research (Module Behavior)

| Behavior | Description |
|----------|-------------|
| **Trigger** | User asks strategic question; user opens research detail; scheduled strategic refresh |
| **User sees** | Research Findings — synthesized evidence, sources, gaps, confidence |
| **User does not see** | Research agents, tasks, or pipeline stages |
| **Depth** | Extended evidence acquisition for high-stakes queries (D5) |
| **Output** | Research Findings; may inform separate recommendation |

## Analysis (Module Behavior)

| Analysis type | Strategy Center behavior |
|---------------|-------------------------|
| **Business analysis** | Holistic assessment linked to goals — situation, structure, performance, strategic implications |
| **Market analysis** | Market Insight depth — conditions, drivers, implications |
| **Trend analysis** | Period comparison, contributing factors, forward implications |
| **Opportunity analysis** | Full opportunity scoring — impact, evidence, expiry, recommended action |
| **Risk analysis** | Risk Assessment register — severity × likelihood, mitigation options |
| **Competitor analysis** | Full Competitor Analysis — position, moves, vulnerabilities |

Analysis in Strategy Center is **depth**; Command Center shows **summary**. Same intelligence artifacts — different behavioral depth.

## Opportunity Discovery

| Stage | Behavior |
|-------|----------|
| Detection | D3/D4 STR identifies opportunity |
| Summary | Command Center Opportunity Tracker |
| Depth | Strategy Center full opportunity record |
| Tracking | Persistent until dismissed, expired, or acted |
| User actions | View detail, link to initiative, dismiss with reason, export to report |

## Competitor Discovery

| Stage | Behavior |
|-------|----------|
| Identification | D4 — known competitors, signal detection, user suggestion |
| Summary | Command Center Competitor widget |
| Depth | Strategy Center competitor profile |
| Updates | Refresh on cycle; alert on material competitive move |
| User actions | Confirm/correct competitor identity (E3), view evidence, add to tracking |

## Strategic Recommendations

| Behavior | Description |
|----------|-------------|
| Origin | D6 production |
| Summary | Command Center Recommendation Panel |
| Depth | Strategy Center — full rationale, alternatives, dependency view, evidence chain |
| Decision | User acts in Command Center or Strategy Center — same D7 path |
| Initiative link | Recommendation may spawn strategic initiative |

## What the User Sees

| Surface | Content |
|---------|---------|
| Strategic overview | Goal-linked strategic posture |
| Opportunity registry | Active opportunities with status |
| Threat registry | Active threats with severity trajectory |
| Competitor profiles | Tracked competitive entities |
| Initiative board | User-created strategic initiatives |
| Research library | Saved research findings from queries |
| Risk register | Comprehensive risk assessment |
| Growth plan | Phased actions toward growth goals |

## User Actions

| Action | Result |
|--------|--------|
| View opportunity/threat detail | Full analysis with evidence |
| View competitor profile | Competitor Analysis depth |
| Create strategic initiative | Links to goal; tracks progress |
| Update initiative status | Reflected in Goal Tracker |
| Dismiss opportunity/threat | Logged; removed from active tracker |
| Assign initiative to member | Collaboration |
| Request deeper research | Triggers extended D5 cycle |
| Export strategic view | Routes to Reports |
| Correct strategic intelligence | E3 correction flow |

## Decisions Supported

| Decision | Support |
|----------|---------|
| Strategic prioritization | Opportunity ranking and initiative selection |
| Competitive response | Competitor-informed options |
| Risk acceptance/mitigation | Risk register decisions |
| Initiative investment | Growth plan phase commitment |
| Research direction | What to investigate next |

## Real-Time Updates

| Element | Trigger |
|---------|---------|
| Opportunity/threat status | D3 cycle, escalation rules |
| Competitor profiles | D4 refresh, material move detection |
| Risk register | New risks, severity changes |
| Initiative progress | Goal measurement, linked outcomes |
| Research findings | D5 completion |

## Success Metrics

| Metric | Indication |
|--------|------------|
| Depth engagement | Users open detail vs only Command Center cards |
| Initiative creation rate | Strategic planning adoption |
| Opportunity action rate | Opportunities converted to decisions |
| Competitor tracking accuracy | Correction rate on competitor identity |
| Research-to-decision path | Findings leading to recommendations |

## Failure Behavior

| Failure | Behavior |
|---------|----------|
| Insufficient competitive data | Honest scope notice; no fabricated competitors |
| Stale strategic assessment | Freshness indicator; refresh prompt |
| Low-confidence opportunity | Shown with explicit confidence; not promoted to P0 |

## Memory Interactions

| Operation | Types |
|-----------|-------|
| Read | Project, Organization, Evidence, Graph (competitors, initiatives) |
| Write | Project (initiative records), Graph (strategic entities) |
| User correction | Correction Memory via E3 |

## Module Relationships

| Module | Relationship |
|--------|--------------|
| Command Center | Summary cards link here |
| Workspace | Goals and projects |
| Reports | Strategic report types |
| Knowledge | Research evidence may reference knowledge |

---

# PART E — MODULE 4: REPORTS

## Purpose

Generate, store, retrieve, compare, export, and distribute **immutable intelligence snapshots** for stakeholders. Reports are not live intelligence — they are verified, timestamped records of intelligence at a point in time.

## Scope

**Owns:**

- Report type catalog and generation
- Report storage and history
- Report comparison
- Export and distribution
- Scheduled report delivery

**Does not own:**

- Live intelligence (Command Center)
- Intelligence production (workflows — Reports consumes artifacts)

## PDD-I Bindings

| Workflow | Role in Reports |
|----------|-----------------|
| F1 — Report Generation | Core generation and verification gate |
| D1 — Scheduled Refresh | Freshness before generation |
| D6 — Recommendation Production | Recommendation Report content |
| C3 — Initialization | First report milestone eligible |

## Report Types

| Type | Behavioral contract |
|------|---------------------|
| **Intelligence Summary** | On-demand current-state snapshot |
| **Intelligence Brief** | Weekly default scheduled brief |
| **Executive Report** | Monthly leadership synthesis |
| **Recommendation Report** | Full recommendation with evidence and alternatives |
| **Performance Report** | KPI deep dive for selected period |
| **Predictive Report** | Active predictions with assumptions and invalidation |
| **Competitive Report** | Competitor synthesis |
| **Historical Analysis** | Trend over selected period |
| **Comparative Analysis** | Period vs period OR channel vs channel |
| **Strategic Assessment Report** | Full Strategy Center export |
| **Custom Report** | User-selected sections and depth |
| **First Intelligence Report** | Auto-offered after C3 — onboarding milestone |

## Report Generation

```
User selects type + parameters (or schedule fires)
   ↓
System checks freshness requirements
   ↓
IF stale → targeted intelligence cycle (D1 pattern)
   ↓
VRF: Verify all claims (BH-5)
   ↓
QA Gate: Confidence labels, prediction labels, completeness
   ↓
Format per template → immutable snapshot
   ↓
Store metadata + content
   ↓
Deliver to Reports Center (+ notification if configured)
```

| Rule | Requirement |
|------|-------------|
| Verification | Block delivery on VRF failure |
| Immutability | Snapshot does not change after generation |
| Regeneration | Produces **new** report version — does not mutate prior |
| Gaps | Incomplete data → explicit gaps section |
| First report | Offered after C3 with Executive Report default |

## Report Storage

| Behavior | Rule |
|----------|------|
| Scope | Per workspace |
| Identity | Unique report ID, generation timestamp, type, parameters |
| Content | Immutable snapshot body + metadata |
| Retention | Per organization plan |
| Deletion | User/admin per policy; audit trail |
| Lineage | Links to artifact chain IDs for inaccuracy reports |

## Report History

| Behavior | Description |
|----------|-------------|
| Browse | Chronological list per workspace — type, date, period, generator |
| Filter | By type, date range, project, goal |
| View | Read any historical snapshot |
| Reference | Link from Command Center "last report" if applicable |
| Archive | Organization retention policy |

## Report Comparisons

| Comparison type | Behavior |
|-----------------|----------|
| **Period vs period** | Same report type, two periods — delta highlights |
| **Channel vs channel** | Cross-channel comparative analysis report |
| **Before vs after** | Pre/post initiative or decision |
| **Report vs live** | Show snapshot date vs current Command Center freshness — explicit staleness |

Comparisons produce a **new** Comparative Analysis report — not inline mutation of stored reports.

## What the User Sees

| Surface | Content |
|---------|---------|
| Reports Center | History list, generate action, schedules |
| Report viewer | Formatted snapshot with confidence labels |
| Comparison builder | Parameter selection for comparative reports |
| Schedule manager | Recurring report definitions |
| Export options | PDF, data appendix, share link |
| Generation progress | Plain-language status during creation |

## User Actions

| Action | Result |
|--------|--------|
| Browse history | View past reports |
| Generate report | Fresh or cached intelligence → snapshot |
| Configure custom report | Section and depth selection |
| View report | Read immutable snapshot |
| Regenerate | New snapshot with current intelligence |
| Compare reports | New comparative analysis report |
| Export PDF | Download |
| Export data appendix | Structured evidence supplement |
| Share link | Org-scoped authorized share |
| Schedule report | Recurring generation |
| Delete report | Removed per policy |

## Decisions Supported

| Decision | Support |
|----------|---------|
| Stakeholder communication | Distributable verified intelligence |
| Historical accountability | What Conquest said at time T |
| Trend over time | Comparative reports |
| Investment review | Executive and performance reports |

## Real-Time Updates

| Element | Trigger |
|---------|---------|
| Generation progress | Cycle and format stages |
| Schedule execution | Automated generation completion |
| Notification | Report ready (if enabled) |

Live Command Center is not updated by Reports — Reports are snapshots (PD-11).

## Success Metrics

| Metric | Indication |
|--------|------------|
| Report generation completion rate | F1 success |
| Export/share rate | Stakeholder value |
| Schedule adherence | Automated delivery reliability |
| Regeneration frequency | Users refreshing snapshots |
| First report milestone | C3 → first report conversion |

## Failure Behavior

| Failure | Behavior |
|---------|----------|
| VRF failure | Block with reason; no partial unverified delivery |
| Timeout | Retry; user notified |
| Stale intelligence | Cycle runs or user warned before generate |
| Permission denied | Share/export blocked clearly |

## Memory Interactions

| Operation | Types |
|-----------|-------|
| Read | Evidence, Project, artifacts for snapshot |
| Write | Report metadata record |
| No write | Live intelligence or memory modified by report |

## Module Relationships

| Module | Relationship |
|--------|--------------|
| Command Center | Primary generation entry |
| Workspace | Scope boundary |
| Automation | Scheduled report execution |
| Strategy Center | Strategic report source |
| Support | Inaccuracy report with report lineage |

---

# PART F — MODULE 5: AUTOMATION

## Purpose

Execute user-authorized actions on schedule or event — converting approved intelligence into repeatable, monitored, accountable operations.

## Scope

**Owns:**

- Automation definition and catalog
- Trigger configuration
- Approval queue
- Execution monitoring
- Rollback and recovery
- Execution history

**Does not own:**

- Intelligence production (workflows)
- Recommendation ranking (Command Center / D6)

## PDD-I Bindings

| Workflow | Role in Automation |
|----------|-------------------|
| F2 — Automation Execution | Core execution |
| D7 — User Decision | Approve triggers automation setup |
| E1/E2 — Learn from Success/Failure | Outcome calibration |
| G2 — Extension Installed | Template sources |

## Trigger System

| Trigger type | Behavior |
|--------------|----------|
| **Schedule** | Cron-style; timezone-aware |
| **Event** | Threshold, anomaly, data arrival |
| **Recommendation approved** | Pre-filled from D7 |
| **Manual** | User-initiated run |
| **Cross-automation** | Chained with bounds |

| Rule | Requirement |
|------|-------------|
| Scope | Triggers evaluated within workspace bounds only |
| Authorization | First run always requires approval |
| Bounds | Action limits from PLN artifact enforced |

## Approval System

| Scenario | Approval required |
|----------|-------------------|
| First execution of any automation | User |
| Action exceeds cost threshold | Manager |
| Public-facing action | User |
| Regulated domain | Policy gate + user |
| Irreversible action | Explicit authorization |
| Scope expansion | Admin |

| Behavior | Description |
|----------|-------------|
| Queue | Pending approvals visible in Automation Center |
| Timeout | Unapproved automations do not execute |
| Revocation | User may revoke authorization anytime |

## Execution System

```
ORC: Verify authorization + bounds + credits
   ↓
EXE: Execute sequence step-by-step
   ↓
Log each step with timestamp
   ↓
Monitor deviation from expected
   ↓
Measure outcome vs expected
   ↓
IF success → E1 path
IF failure → E2 path + pause if critical
```

| Rule | Requirement |
|------|-------------|
| Trace | Full execution trace preserved |
| Deviation | Alert on critical deviation; optional halt |
| Cancel | User may cancel in-progress execution |
| Credits | Plan limits enforced before run |

## Monitoring System

| Monitor | Behavior |
|---------|----------|
| Real-time status | Automation Center + Command Center Execution widget |
| Success rate | Per automation over rolling window |
| Failure alert | Within 5 minutes of critical failure detection |
| Resource consumption | Visible per plan |
| Drift detection | Outcome vs expected pattern |

## Rollback System

| Scenario | Rollback behavior |
|----------|-------------------|
| **Reversible action** | EXE attempts compensating action per PLN rollback plan |
| **Partial completion** | Roll back completed steps where platform supports reversal |
| **Irreversible action** | No rollback — prevention via approval gate only |
| **Rollback failure** | Alert user; pause automation; Support escalation path |
| **User-initiated rollback** | User triggers reversal within rollback window |

| Rule | Requirement |
|------|-------------|
| Plan required | Automations with reversible steps must declare rollback plan at creation |
| Trace | Rollback logged in execution history |
| Learning | Rollback outcomes feed E2 |

## What the User Sees

| Surface | Content |
|---------|---------|
| Automation catalog | All workspace automations with status |
| Builder | Trigger, conditions, actions, bounds, rollback plan |
| Approval queue | Pending first-run and threshold approvals |
| Execution log | Step-by-step trace |
| Success/failure summary | Per automation metrics |
| Rollback status | In-progress or completed reversal |

## User Actions

| Action | Result |
|--------|--------|
| Browse automations | View catalog |
| Create from recommendation | Pre-filled from D7 |
| Create from template | Marketplace or built-in |
| Build custom | Define trigger, conditions, actions, rollback |
| Approve first run | Authorization recorded |
| Pause / resume | Execution control |
| Cancel queued run | Removed from queue |
| Revoke authorization | Automation disabled |
| View execution log | Full trace |
| Retry failed run | Re-queued with review |
| Initiate rollback | Compensating action within window |
| Delete automation | Removed; history archived |

## Decisions Supported

| Decision | Support |
|----------|---------|
| Repeatability | Automate validated decisions |
| Risk acceptance | Approval gates on high-stakes |
| Recovery | Rollback vs pause vs retry |

## Real-Time Updates

| Element | Trigger |
|---------|---------|
| Execution status | F2 step progress |
| Failure alerts | Critical failure detection |
| Approval queue | New automation pending approval |

## Success Metrics

| Metric | Indication |
|--------|------------|
| Automation success rate | Execution reliability |
| Rollback success rate | Recovery reliability |
| Approval-to-first-run time | User trust velocity |
| Outcome vs expected | Measurement accuracy |

## Failure Behavior

```
Failure detected
   ↓
Classify failure type
   ↓
IF critical → pause automation
   ↓
IF reversible → offer rollback
   ↓
Alert user in Command Center
   ↓
Log with classification → E2
   ↓
User must review before resume (critical) or may retry (transient)
```

## Memory Interactions

| Operation | Types |
|-----------|-------|
| Write | Workflow Memory, Success/Failure Memory, execution records |
| Read | Project bounds, Organization policy, Correction |

## Module Relationships

| Module | Relationship |
|--------|--------------|
| Command Center | Creation entry; status display |
| Reports | Automated report generation |
| Marketplace | Templates |
| Workspace | Scope and authorization |
| Settings | Automation policies |

---

# PART G — MODULE 6: KNOWLEDGE

## Purpose

Access, manage, and retrieve **validated organizational knowledge** — distinct from live Command Center intelligence. Knowledge is reference intelligence the organization has chosen to retain.

## Scope

**Owns:**

- Internal knowledge curation and search
- External knowledge integration (governed)
- Document-upload intelligence
- Knowledge-to-memory relationship surfacing (synthesized)
- Retrieval for user research

**Does not own:**

- Live analysis (Command Center / Strategy Center)
- Raw memory browser (prohibited)
- Unvalidated document claims as recommendations

## PDD-I Bindings

| Workflow | Role in Knowledge |
|----------|-----------------|
| C4 — User Uploads Documents | Document ingestion |
| E4 — Memory Update | Knowledge Memory writes |
| D5 — Ask Conquest | Knowledge retrieval in cycles |
| G2 — Extension Installed | Knowledge packs |

## Internal Knowledge

| Source | Behavior |
|--------|----------|
| Uploaded documents | C4 → validation → Knowledge Memory |
| User annotations | Linked to knowledge articles |
| Validated cycle outputs | Promoted to knowledge per policy |
| Organizational curation | Admin-approved reference articles |
| Initiative learnings | Captured lessons linked to projects |

## External Knowledge

| Source | Behavior |
|--------|----------|
| Marketplace knowledge packs | Installed → validated on ingest |
| Connected reference APIs | Governed per extension policy |
| Licensed datasets | Organization entitlement required |

External knowledge passes evidence validation on entry. Unvalidated external content cannot drive recommendations without VRF.

## Memory Relationships

| Relationship | User-visible behavior |
|--------------|----------------------|
| Knowledge → Evidence | Knowledge cited in evidence viewer |
| Knowledge → Recommendations | "Informed by organizational knowledge" indicator |
| Knowledge → Corrections | Correction on knowledge article via E3 |
| Knowledge → Graph | Entities extracted link to Business Memory Graph |
| Knowledge ≠ Live intelligence | Clear distinction in all surfaces |

Users see **relationships**, not memory architecture.

## Retrieval Logic

| Query type | Behavior |
|------------|----------|
| User search | Semantic + keyword; ranked by relevance and freshness |
| Cycle retrieval | ORC requests scoped Knowledge Memory during D5, RES |
| Category browse | Hierarchical navigation |
| Goal-scoped | Filter by linked goal or project |
| Stale knowledge | Flagged for review; confidence reduced in citations |

| Rule | Requirement |
|------|-------------|
| Precedence | Correction Memory overrides knowledge claims |
| Freshness | Stale knowledge labeled in results |
| Scope | Workspace + organization boundaries enforced |

## What the User Sees

| Surface | Content |
|---------|---------|
| Knowledge Center | Search, browse, categories |
| Article view | Validated content with freshness and source |
| Upload area | Document intake with processing status |
| Annotations | User notes on articles |
| Stale flags | Review-needed indicators |
| Distinction notice | Knowledge vs live intelligence explanation |

## User Actions

| Action | Result |
|--------|--------|
| Search knowledge | Retrieval results |
| View article | Read validated content |
| Upload document | C4 ingestion pipeline |
| Annotate | User notes linked |
| Request correction | E3 on knowledge content |
| Browse categories | Navigate structure |
| Install knowledge pack | Via Marketplace |

## Decisions Supported

| Decision | Support |
|----------|---------|
| Reference | Ground decisions in organizational truth |
| Curation | What to retain and validate |
| Correction | Organizational knowledge accuracy |

## Real-Time Updates

| Element | Trigger |
|---------|---------|
| Upload processing | C4 stages |
| New validated knowledge | Index update |
| Stale review flags | Freshness policy |

## Success Metrics

| Metric | Indication |
|--------|------------|
| Knowledge citation rate | Use in recommendations |
| Search success | Users find relevant articles |
| Correction rate | Accuracy of knowledge base |
| Upload validation rate | C4 success |

## Failure Behavior

| Failure | Behavior |
|---------|----------|
| Validation fail | Document stored as unvalidated; not in recommendations |
| Parse failure | User notified with retry option |
| Scope violation | Access denied clearly |

## Memory Interactions

| Operation | Types |
|-----------|-------|
| Read/Write | Knowledge Memory |
| Link | Evidence Memory, Graph, Correction |

## Module Relationships

| Module | Relationship |
|--------|--------------|
| Workspace | Scoped knowledge; upload entry |
| Command Center | Knowledge informs recommendations |
| Strategy Center | Research citations |
| Marketplace | Knowledge packs |
| Reports | Knowledge appendix sections |

---

# PART H — MODULE 7: MARKETPLACE

## Purpose

Extend Conquest through governed integrations, templates, domain modules, and knowledge packs — without core product redesign.

## Scope

**Owns:**

- Extension catalog and discovery
- Installation and configuration governance
- Capability registration per extension
- Future expansion category rules

**Does not own:**

- Core intelligence (unchanged by marketplace)
- Extension runtime internals (extension responsibility)

## PDD-I Bindings

| Workflow | Role in Marketplace |
|----------|---------------------|
| G2 — Extension Installed | Install pipeline |

## Purpose (Expanded)

| Function | Description |
|----------|-------------|
| **Extend data reach** | Connectors for industry/regional sources |
| **Extend domains** | Trading, healthcare, logistics modules |
| **Accelerate automation** | Workflow templates |
| **Accelerate reporting** | Report templates |
| **Distribute knowledge** | Validated knowledge packs |

## Available Assets (Launch Categories)

| Category | Examples | Installs into |
|----------|----------|---------------|
| Data source connectors | Industry APIs, regional providers | Workspace |
| Domain modules | Trading, healthcare, logistics | Intelligence routing |
| Report templates | Industry formats | Reports |
| Automation templates | Workflow patterns | Automation |
| Integration connectors | CRM, ERP, ad platforms | Workspace + Automation |
| Knowledge packs | Domain reference sets | Knowledge |

## Future Expansion Rules

| Category | Status | Governance |
|----------|--------|------------|
| **Agent Marketplace** | Future | Agents declare authority boundaries; orchestrator mediation mandatory; no direct user communication; VRF compliance; admin approval |
| **Knowledge Marketplace** | Future | Evidence validation on install; org policy may block categories |
| **Template Marketplace** | Current | Report and automation templates |
| **Private Enterprise Marketplace** | Enterprise | Org-private extensions; admin curated |
| **Widget Marketplace** | Future | Command Center widgets; acceptance test required |

| Rule | Requirement |
|------|-------------|
| No bypass | Extensions cannot disable VRF, CHL, or BH laws |
| No nav expansion | Extensions add capability, not primary nav items |
| Audit | Install, configure, uninstall logged |
| Uninstall | Data retention per extension policy and org rules |

## What the User Sees

| Surface | Content |
|---------|---------|
| Marketplace browse | Categories, search, featured |
| Extension detail | Capabilities, permissions, data access, reviews |
| Installed inventory | Organization extensions |
| Configuration | Scope, credentials, workspace binding |

## User Actions

| Action | Result |
|--------|--------|
| Browse | View available extensions |
| View detail | Capability and permission review |
| Install | Admin approval if required → G2 |
| Configure | Scope and settings |
| Uninstall | Removed; data per retention policy |
| View installed | Organization inventory |

## Decisions Supported

| Decision | Support |
|----------|---------|
| Capability investment | Which extensions to adopt |
| Risk acceptance | Permission review before install |
| Domain focus | Domain module selection |

## Real-Time Updates

| Element | Trigger |
|---------|---------|
| Install progress | G2 pipeline |
| Capability availability | Install completion |

## Success Metrics

| Metric | Indication |
|--------|------------|
| Install success rate | G2 completion |
| Extension reliability | Failure rate per extension |
| Capability utilization | Extension features used |

## Failure Behavior

| Failure | Behavior |
|---------|----------|
| Governance fail | Install blocked with reason |
| Incompatible workspace | Clear incompatibility message |
| Permission denied | Admin approval required notice |

## Module Relationships

| Module | Relationship |
|--------|--------------|
| Workspace | Extension scope |
| Command Center | Extension widgets |
| Automation | Templates |
| Reports | Templates |
| Knowledge | Knowledge packs |
| Settings | Integration management |

---

# PART I — MODULE 8: SUPPORT

## Purpose

Help users succeed with Conquest — self-service, guided assistance, AI-assisted support, and human escalation when needed.

## Scope

**Owns:**

- Help documentation access
- Ticket and feedback intake
- Intelligence inaccuracy reports
- Escalation routing
- Context capture for support

**Does not own:**

- Intelligence correction (E3 — user direct; Support escalates systemic issues)
- Billing disputes (Settings → Billing)

## User Assistance

| Channel | Behavior |
|---------|----------|
| **Help center search** | Self-service documentation |
| **Contextual help** | Module-aware help topics |
| **Support AI chat** | Product usage guidance; not intelligence analysis |
| **Guided flows** | Connection issues, first report, automation setup |

Support AI does **not** replace Ask Conquest. Support AI helps users **use the product**.

## Escalation Paths

```
User issue
   ↓
Self-service search
   ↓
Support AI (if enabled)
   ↓
IF unresolved → Ticket queue
   ↓
IF intelligence inaccuracy → Priority queue + artifact chain
   ↓
IF critical/regulated → Human support SLA per plan
   ↓
IF engineering defect → Engineering queue with reproduction context
```

| Tier | Routing |
|------|---------|
| Starter | Email support; 48h SLA |
| Professional | Priority queue; 24h SLA |
| Business | Dedicated support; 8h SLA |
| Enterprise | Named support; 4h SLA; escalation hotline |

## Knowledge Retrieval (Support Context)

| Behavior | Description |
|----------|-------------|
| Auto-capture | Workspace, module, artifact ID, cycle reference |
| Attach artifact chain | For inaccuracy reports — full lineage |
| Privacy | Support sees context per policy; PII governed |
| Suggested articles | Help center matches issue category |

## What the User Sees

| Surface | Content |
|---------|---------|
| Help center | Searchable documentation |
| Support entry | Utility bar — always accessible |
| Ticket form | Category, description, auto-context |
| Inaccuracy report | Linked intelligence element |
| Chat interface | Support AI or human handoff |
| Ticket status | Queue position and resolution |

## User Actions

| Action | Result |
|--------|--------|
| Search help | Self-service answers |
| Submit ticket | Support queue |
| Report bug | Engineering queue with context |
| Submit feedback | Product backlog |
| Request feature | Voting backlog |
| Report intelligence inaccuracy | Priority queue + artifact chain → E2 signal |
| Chat with support AI | Usage help; escalates if unresolved |
| Request human support | Human queue per plan |

## Decisions Supported

| Decision | Support |
|----------|---------|
| Issue resolution | Stay vs escalate |
| Trust recovery | Inaccuracy investigation |

## Real-Time Updates

| Element | Trigger |
|---------|---------|
| Ticket status | Agent updates |
| Chat | Support AI or human response |

## Success Metrics

| Metric | Indication |
|--------|------------|
| Self-service resolution rate | Help center effectiveness |
| Time to first response | SLA adherence |
| Inaccuracy resolution time | Trust recovery |
| Repeat issue rate | Product quality signal |

## Failure Behavior

| Failure | Behavior |
|---------|----------|
| Context capture fail | User prompted for manual context |
| SLA breach | Auto-escalation per plan |

## Module Relationships

| Module | Relationship |
|--------|--------------|
| Command Center | Inaccuracy entry point |
| Settings | Support preferences |
| All modules | Contextual help binding |

---

# PART J — MODULE 9: SETTINGS

## Purpose

Configure account, workspace, organization, security, integrations, notifications, privacy, memory controls, AI behavior bounds, automation policies, and billing — within constraints that preserve intelligence integrity.

## Scope

**Owns:**

- All user-configurable product behavior
- Role-based settings access
- Billing and subscription management
- Integration credentials management

**Does not own:**

- Intelligence production logic (immutable core)

## User Preferences

| Area | Configurable behavior |
|------|----------------------|
| **Appearance** | Theme, density — UXMD defines options |
| **Notifications** | Alert types, channels, quiet hours |
| **Command Center** | Default mode, widget preferences |
| **Communication** | HUM calibration preferences (depth, formality) |
| **Locale** | Timezone, date format, currency display |
| **Default workspace** | Landing workspace on entry |

## Security

| Area | Behavior |
|------|----------|
| Password / MFA | Account security |
| Session management | Active sessions, revoke |
| SSO | Enterprise — identity provider binding |
| API keys | User/org keys for integrations — governed |
| Audit log | Enterprise — settings and access changes |

## Integrations

| Area | Behavior |
|------|----------|
| Connected services | Inventory and credential management |
| Marketplace extensions | Installed extension configuration |
| Webhooks | Outbound event configuration (future) |
| Data export | Organization data export per policy |

## Billing

| Area | Behavior |
|------|----------|
| Plan view | Current plan, usage, limits |
| Upgrade/downgrade | Plan change |
| Payment method | Card, USDT per product rules |
| Invoices | History and download |
| Credits | Usage credit top-up |
| Cancellation | End-of-period |

**PD-12:** Billing changes never modify intelligence outputs.

## Permissions

| Area | Behavior |
|------|----------|
| Organization roles | Owner, Admin, Manager, Member, Viewer |
| Workspace roles | Per-workspace assignment |
| Feature gates | Plan-based capability limits |
| Approval policies | Automation threshold configuration |
| Marketplace install | Admin-only by default |

## Memory Controls

| Setting | Behavior |
|---------|----------|
| Retention preferences | Per plan maximum |
| Correction review | Admin review queue (enterprise) |
| Memory export | Governed per policy |
| "Forget" requests | Governed deletion per AMD — not instant silent erase |

## AI Controls (Bounded)

| Setting | Allowed |
|---------|---------|
| Cycle depth preference | User may request more depth — not less verification |
| Confidence display | Always on — not configurable off |
| Challenge intensity | Admin may increase — not disable for major conclusions |

## Prohibited Settings

Users and admins **cannot**:

- Disable verification (BH-5)
- Disable challenge for major conclusions
- Disable evidence classification
- Force confidence inflation
- Bypass approval rules for irreversible actions
- Disable learning (system-level)

## What the User Sees

| Surface | Content |
|---------|---------|
| Account settings | Profile, preferences, security |
| Workspace settings | Goals, sources, team — or link to Workspace |
| Organization settings | Admin — members, policy, billing |
| Integration manager | Connected services |
| Billing center | Plan, payment, invoices |
| Audit log | Enterprise access history |

## User Actions

Per module area above — all settings changes audit-logged where applicable.

## Decisions Supported

| Decision | Support |
|----------|---------|
| Security posture | MFA, session control |
| Spend | Plan and credits |
| Governance | Permissions and policies |
| Privacy | Retention and export |

## Real-Time Updates

| Element | Trigger |
|---------|---------|
| Usage meters | Consumption approaching limit |
| Session list | New login detection |
| Integration health | Connection status |

## Success Metrics

| Metric | Indication |
|--------|------------|
| Security adoption | MFA rate |
| Upgrade conversion | Limit encounters |
| Integration success | Connected services health |

## Module Relationships

All modules — Settings governs their configurable behavior. Billing is a Settings subsection, not primary nav.

---

# PART K — MODULE INTERACTION MATRIX

| From ↓ / To → | Command Center | Workspace | Strategy | Reports | Automation | Knowledge | Marketplace | Support | Settings |
|---------------|----------------|-----------|----------|---------|------------|-----------|-------------|---------|----------|
| **Command Center** | — | scope, connect | depth drill | generate | create, status | evidence link | widgets | inaccuracy | preferences |
| **Workspace** | intelligence scope | — | goals | scope | authorize | upload | install ext | — | config |
| **Strategy** | summary link | goals | — | export | — | cite | — | — | — |
| **Reports** | entry | scope | source | — | schedule | appendix | templates | inaccuracy | delivery |
| **Automation** | status | bounds | — | reports | — | — | templates | failure | policy |
| **Knowledge** | inform | scope | cite | appendix | — | — | packs | — | retention |
| **Marketplace** | widgets | connectors | domain | templates | templates | packs | — | — | integrations |
| **Support** | context | context | context | context | context | context | context | — | tickets |
| **Settings** | widgets | team, sources | — | delivery | policy | retention | install | SLA | — |

---

# PART L — WORKFLOW-TO-MODULE BINDING

| PDD-I Workflow | Primary module(s) | Output surface |
|----------------|-------------------|----------------|
| B1 Entry | Command Center | Landing state |
| B2 Create workspace | Workspace | Workspace record |
| C1/C2 Connect | Workspace | Source inventory |
| C3 Initialize | Workspace → Command Center | Full population |
| C4 Upload | Knowledge, Workspace | Knowledge article |
| C5 Degrade | Workspace, Command Center | Degraded state |
| D1 Refresh | Command Center | Widget updates |
| D2 Anomaly | Command Center | P0 alert |
| D3 Trend | Command Center, Strategy | Trend, opportunity/threat |
| D4 Competitor | Command Center, Strategy | Competitor profile |
| D5 Ask | Command Center, Strategy | Structured response |
| D6 Recommendation | Command Center, Strategy | Recommendation |
| D7 Decision | Command Center | Action trigger |
| E1/E2/E3/E4 | All (invisible) | Quality over time |
| F1 Report | Reports | Snapshot |
| F2 Automation | Automation, Command Center | Execution |
| F3 Cross-channel | Command Center, Strategy | Unified intelligence |
| G1 Team join | Workspace | Collaboration |
| G2 Extension | Marketplace, Workspace | New capabilities |

---

# PART M — MSD PRODUCT LAWS

| # | Law |
|---|-----|
| **MSD-1** | Every module maps to PDD-I workflows — no orphan modules |
| **MSD-2** | Modules surface outputs — never intelligence system names |
| **MSD-3** | Workspace scopes all modules — no cross-workspace leakage |
| **MSD-4** | Command Center is home — MSD-3 does not change NAV-2 |
| **MSD-5** | Reports are immutable snapshots — live intelligence stays in Command Center |
| **MSD-6** | Strategy Center is intelligence depth — not a second dashboard |
| **MSD-7** | Knowledge ≠ live intelligence — distinction always explicit |
| **MSD-8** | Automation requires approval before first execution |
| **MSD-9** | Reversible automations must declare rollback plan |
| **MSD-10** | Marketplace extends capability — never bypasses BH laws |
| **MSD-11** | Support AI ≠ Ask Conquest |
| **MSD-12** | Settings cannot compromise verification or challenge |
| **MSD-13** | Maximum 7 primary nav items — unchanged from PDD interim |
| **MSD-14** | New modules require PDD amendment |
| **MSD-15** | Every module section answers: purpose, sees, intelligence, actions, decisions, real-time, success |

---

# PART N — APPROVAL CRITERIA FOR VOLUME II

Volume II is complete when:

- [ ] Every major module has full MSD template coverage
- [ ] Intelligence Center capabilities mapped to Strategy Center + Command Center
- [ ] Workspace documented as context module
- [ ] All PDD-I workflows bound to at least one module
- [ ] Report lifecycle complete — generation, storage, history, comparison
- [ ] Automation lifecycle complete — trigger, approval, execution, monitoring, rollback
- [ ] Knowledge retrieval and memory relationships defined
- [ ] No UI, wireframe, schema, API, or implementation content
- [ ] Module interaction matrix complete
- [ ] MSD laws defined

---

# PART O — DOCUMENT SEQUENCE (LOCKED)

```
✅ CCIS
✅ AMD I–IV (volumes III–IV in repo; I–II referenced)
✅ SDD (operational)
🔄 PDD Volume I v2.0 (review rejected — revision in progress)
🔵 PDD Volume II v1.0 (this document)
⬜ PDD Volume II review
⬜ PDD I + II approval
⬜ UXMD Volume I — User Experience Master Design
⬜ UXMD Volume II — Screen-by-Screen Specifications
⬜ SDD Volume I — Data, Memory, Agent, Security, Deployment Architecture
⬜ Build Approval
⬜ Engineering Phase
```

**Do not start UXMD, expanded SDD, database design, API design, or build until PDD Volume II is completed and reviewed.**

---

*End of PDD Volume II — Module Specifications Document v1.0*
