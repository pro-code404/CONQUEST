# CONQUEST — PRODUCT DESIGN DOCUMENT (PDD)

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | Conquest Product Design Document |
| **Abbreviation** | PDD |
| **Status** | Product Behavior Authority |
| **Version** | 1.0 |
| **Supreme Intelligence Authority** | CCIS |
| **Subordinate To** | CCIS, AMD I–IV, SDD |
| **Precedes** | UI/UX Master Design Document (UXMD) |

### Mission

Define **what the user can actually do inside Conquest** — actual product behavior, not architecture, not philosophy, not system internals.

| Document | Question |
|----------|----------|
| CCIS / AMD | What Conquest believes and is |
| SDD | How Conquest operates |
| **PDD** (this document) | What the user can do |
| UXMD | How it looks and feels |
| Build | How it is implemented |

### Prohibitions

This document does **not** define: visual design, colors, spacing, grid systems, component styling, code, databases, or APIs. **The build phase has not started.**

### Document sequence

```
✅ CCIS → ✅ AMD I–IV → ✅ SDD → 🔵 PDD Volume I → ⬜ PDD Volume II → ⬜ UXMD → ⬜ Build
```

---

# PART 1 — PRODUCT MODULES

Every product module is a **user-facing capability surface**. Modules consume intelligence outputs. They are not intelligence systems.

---

## MODULE 1 — COMMAND CENTER

### Purpose

The user's daily intelligence cockpit. Primary destination for operational awareness, decision support, and action.

### Responsibilities

- Present prioritized intelligence synthesis for the active workspace
- Surface alerts, recommendations, opportunities, threats, and predictions
- Enable user decisions on recommendations
- Provide drill-down paths to evidence and detail
- Show execution and automation status
- Display plain-language intelligence activity

### Inputs (what the module receives)

| Input | Source |
|-------|--------|
| Intelligence cycle outputs | System (all cognitive systems — invisible) |
| Workspace configuration | User settings |
| User corrections | User actions |
| Goal definitions | Workspace module |
| Connected data freshness | Data source inventory |
| Active automations state | Automation module |

### Outputs (what the module produces)

| Output | Consumer |
|--------|----------|
| User decisions on recommendations | Automation, Execution, Memory (corrections) |
| Drill-down navigation | Reports, Strategy, detail views |
| Correction submissions | Memory (Correction Memory) |
| Report generation requests | Reports module |
| Automation creation requests | Automation module |
| Ask Conquest queries | Intelligence pipeline (targeted cycle) |

### User Actions

| Action | Result |
|--------|--------|
| View Command Center | See prioritized intelligence for workspace |
| Approve recommendation | Triggers execution path or automation setup |
| Reject recommendation | Logged; informs learning; removed from active queue |
| Defer recommendation | Snoozed with reminder |
| Modify recommendation | Opens modification flow before approval |
| View evidence | Opens evidence viewer for recommendation |
| View alternatives | Shows rejected options with rationale |
| Correct intelligence | Opens correction flow |
| Ask Conquest | Submits natural-language intelligence request |
| Drill into KPI | Navigates metric hierarchy |
| Open opportunity / threat / prediction detail | Navigates strategic detail view |
| Switch Command Center mode | Filters presentation (Executive / Operational / Strategic / Focused) |
| Configure widgets | Adds/removes/reorders widgets within rules |
| Generate report | Routes to Reports module |
| Create automation from recommendation | Routes to Automation module |
| Connect data source | Routes to Workspace data connection |
| Dismiss alert | Logs dismissal with optional reason |

### System Actions

| Action | When |
|--------|------|
| Refresh intelligence | Scheduled cycle or event trigger |
| Reprioritize display | New intelligence changes priority ranking |
| Generate executive summary | Every intelligence cycle |
| Push alerts | Threshold breach or anomaly |
| Update widgets | Cycle completion |
| Log user decisions | Every recommendation action |
| Trigger re-cycle | User correction or significant event |

### Displayed Intelligence

| Display element | Intelligence output type |
|-----------------|------------------------|
| Executive Summary | Executive Brief |
| Alert cards | Opportunity Alert, Threat Alert, Anomaly Alert |
| Recommendation panel | Strategic Recommendation |
| Opportunity Tracker | Opportunity Alert |
| Risk Monitor | Threat Alert, Risk Assessment |
| Prediction Monitor | Predictive Forecast |
| Competitor widget | Competitor Analysis |
| KPI cards | Trend Analysis, Performance metrics |
| Performance charts | Trend Analysis |
| Platform views | Market Insight |
| Goal Tracker | Goal progress synthesis |
| Execution status | Automation execution state |
| Activity feed | Plain-language cycle events |
| Memory Insights | Synthesized memory insights |

### Relationships to Other Modules

| Module | Relationship |
|--------|--------------|
| **Workspace** | Scoped to active workspace; inherits goals and sources |
| **Reports** | Report generation entry point; snapshots of Command Center intelligence |
| **Automation** | Recommendation approval creates automations; execution status displayed |
| **Strategy** | Strategic detail views linked from opportunity/threat cards |
| **Knowledge** | Knowledge references in evidence viewer |
| **Marketplace** | Extension widgets may appear when installed |
| **Settings** | Widget and mode preferences |
| **Support** | "Report inaccuracy" from any intelligence element |

---

## MODULE 2 — WORKSPACE

### Purpose

The user's operational headquarters — bounded context for goals, data, team, intelligence, and memory accumulation.

### Responsibilities

- Contain all workspace-scoped product activity
- Manage goals, projects, and data connections
- Scope intelligence and memory boundaries
- Enable team collaboration within workspace
- Provide workspace configuration

### Inputs

| Input | Source |
|-------|--------|
| User-defined goals | User |
| Data source connections | User |
| Team member assignments | Admin/Manager |
| Organization policy | Organization settings |
| Intelligence outputs | System (accumulated over time) |

### Outputs

| Output | Consumer |
|--------|----------|
| Scoped context for intelligence | System (all cycles) |
| Goal progress data | Command Center, Strategy, Reports |
| Data source inventory | Command Center, intelligence pipeline |
| Team access context | Permission system |

### User Actions

| Action | Result |
|--------|--------|
| Create workspace | New operating environment |
| Edit workspace name/type | Updated routing profile |
| Add/edit/delete goals | Goal Tracker updates; strategic intelligence re-anchors |
| Create project | Project-scoped memory and tracking |
| Connect data source | Ingestion begins; initialization if first source |
| Disconnect data source | Source archived; intelligence flags reduced scope |
| Invite team member | Collaboration enabled per role |
| Remove team member | Access revoked |
| View data source health | Freshness and status per source |
| Archive workspace | Read-only; intelligence pauses |
| Delete workspace | Governed deletion per policy |

### System Actions

| Action | When |
|--------|------|
| Initialize intelligence | First data connection |
| Run intelligence cycles | Schedule and events |
| Accumulate memory | Every validated cycle |
| Enrich Business Memory Graph | Entity discoveries |
| Enforce scope boundaries | All operations |

### Project Structure

```
Workspace
   └── Goal (required — minimum one)
         └── Project (optional)
               └── Milestone (optional)
                     └── Linked recommendations and outcomes
```

- **Goal** — what the workspace optimizes for; always visible in Command Center
- **Project** — optional initiative container; scopes reports and memory
- **Milestone** — optional checkpoint within project

### Memory Structure (user-visible)

Users do **not** browse raw memory. Users interact with:

| User-facing surface | Underlying memory |
|--------------------|-------------------|
| Memory Insights widget | Synthesized cross-memory insights |
| Correction flow | Correction Memory |
| Goal history | Project Memory |
| Evidence viewer | Evidence Memory |
| Knowledge Center | Knowledge Memory |
| "What Conquest knows" summary | Organization + Workspace memory synthesis |

### Knowledge Structure

| Layer | User access |
|-------|-------------|
| Organizational knowledge | Knowledge Center |
| Workspace-learned patterns | Memory Insights |
| Uploaded document knowledge | Knowledge Center + evidence viewer |
| Marketplace knowledge packs | Knowledge Center (if installed) |

### Intelligence Structure

Intelligence is **not structured for user navigation**. Intelligence surfaces as **outputs** in Command Center and modules. The workspace contains intelligence **results**, not intelligence **processes**.

### Relationships

| Module | Relationship |
|--------|--------------|
| **Command Center** | Primary intelligence display for workspace |
| **Strategy** | Strategic planning scoped to workspace goals |
| **Reports** | Reports scoped to workspace |
| **Automation** | Automations authorized per workspace |
| **Settings** | Workspace settings section |

---

## MODULE 3 — REPORTS

### Purpose

Generate, store, view, export, and distribute formatted intelligence outputs.

### Responsibilities

- Transform intelligence artifacts into readable documents
- Support on-demand and scheduled generation
- Enable export and sharing
- Maintain report history per workspace

### Inputs

| Input | Source |
|-------|--------|
| Intelligence artifacts | System (current or fresh cycle) |
| User report configuration | User |
| Schedule definition | User |
| Workspace scope | Workspace module |

### Outputs

| Output | Consumer |
|--------|----------|
| Formatted reports | User viewing, export, distribution |
| Report history | Reports Center list |
| Scheduled deliveries | Email / notification (per settings) |

### User Actions

| Action | Result |
|--------|--------|
| Browse report history | View past reports |
| Generate report (template) | Fresh or cached intelligence → formatted report |
| Configure custom report | Select sections, depth, period |
| View report | Read formatted intelligence |
| Export PDF | Download |
| Export data appendix | Download evidence/data supplement |
| Share report (link) | Authorized share within organization |
| Schedule report | Recurring generation |
| Delete report | Removed from history per policy |

### System Actions

| Action | When |
|--------|------|
| Run intelligence cycle | Fresh data needed for report |
| Verify content | Before report delivery |
| Generate on schedule | Cron trigger |
| Notify on completion | User preference |
| Store report snapshot | On generation |

### Report Types

| Type | Product behavior |
|------|-----------------|
| Intelligence Summary | On-demand; current state snapshot |
| Intelligence Brief | Weekly scheduled default |
| Executive Report | Monthly scheduled default |
| Recommendation Report | Full recommendation detail with evidence |
| Performance Report | KPI deep dive for period |
| Predictive Report | Active predictions with assumptions |
| Competitive Report | Competitor synthesis |
| Historical Analysis | Trend over selected period |
| Comparative Analysis | Period vs period or channel vs channel |
| Custom Report | User-configured sections |

### Generation Logic

```
User selects report type + parameters
   ↓
System checks freshness requirements
   ↓
If stale → targeted intelligence cycle
   ↓
Verification of content
   ↓
Format per template
   ↓
Deliver to Reports Center (+ notification if configured)
```

### Export Logic

| Format | Available |
|--------|-----------|
| PDF | All report types |
| Data appendix (structured) | Reports with quantitative content |
| Share link (org-scoped) | All report types |
| Email delivery | Scheduled reports |

### Storage Logic

- Reports stored per workspace with generation timestamp
- Retention per organization plan
- Reports are immutable snapshots — not live intelligence
- Deletion per user/admin policy

### Distribution Logic

| Channel | Rule |
|---------|------|
| In-app | Default |
| Email | Opt-in per schedule |
| Share link | Organization members with permission |
| External share | Disabled by default; admin may enable |

### Relationships

| Module | Relationship |
|--------|--------------|
| **Command Center** | Primary entry for report generation |
| **Workspace** | Scope boundary |
| **Automation** | Scheduled reports may be automated |

---

## MODULE 4 — AUTOMATION

### Purpose

Execute user-authorized actions on schedule or trigger — converting approved intelligence into repeatable operations.

### Responsibilities

- Define, approve, and run automated workflows
- Monitor execution health
- Handle failures visibly
- Maintain user control and revocation

### Inputs

| Input | Source |
|-------|--------|
| Approved recommendations | Command Center |
| Automation templates | Marketplace or built-in |
| User-defined rules | User |
| Trigger events | System or connected sources |

### Outputs

| Output | Consumer |
|--------|----------|
| Execution results | Command Center execution widget |
| Failure alerts | Command Center alerts |
| Outcome data | Learning and Memory |
| Execution logs | Automation Center |

### User Actions

| Action | Result |
|--------|--------|
| Browse automations | View all workspace automations |
| Create from recommendation | Pre-filled automation from approved recommendation |
| Create from template | Marketplace or built-in template |
| Build custom automation | Define trigger, conditions, actions |
| Approve automation (first run) | Authorization recorded |
| Pause automation | Execution suspended |
| Resume automation | Execution restored |
| Cancel queued run | Removed from queue |
| Revoke authorization | Automation disabled |
| View execution log | Full trace |
| Retry failed execution | Re-queued with review |
| Delete automation | Removed; history archived |

### Approval Rules

| Scenario | Approval required |
|----------|-------------------|
| First execution of any automation | User |
| Action exceeds cost threshold | Manager |
| Public-facing action (publish, send) | User |
| Regulated domain action | Policy gate + user |
| Irreversible action | Explicit user authorization |
| Scope expansion | Admin |

### Execution Rules

- Automations execute only within workspace authorization
- Intelligence-approved action bounds enforced
- Execution trace preserved
- Deviation triggers alert and optional halt

### Monitoring Rules

- Real-time status in Automation Center and Command Center
- Success rate tracked per automation
- Failure triggers alert within 5 minutes of detection (product requirement)
- Resource consumption visible per plan

### Failure Rules

```
Failure detected
   ↓
Automation paused (if critical failure type)
   ↓
User alerted in Command Center
   ↓
Failure logged with classification
   ↓
User must review before resume (critical) or may retry (transient)
```

### Relationships

| Module | Relationship |
|--------|--------------|
| **Command Center** | Creation entry; status display |
| **Reports** | Automated report generation |
| **Marketplace** | Automation templates |
| **Workspace** | Scope and authorization |

---

## MODULE 5 — STRATEGY

### Purpose

Deep strategic planning, opportunity tracking, and initiative management — beyond Command Center summary cards.

### Responsibilities

- Present full strategic assessments
- Track opportunities and threats over time
- Manage strategic initiatives linked to goals
- Show competitor intelligence depth

### Inputs

| Input | Source |
|-------|--------|
| Strategic Assessment artifacts | System |
| Goals and projects | Workspace |
| User strategic notes | User |
| Competitor entities | Business Memory Graph |

### Outputs

| Output | Consumer |
|--------|----------|
| Strategic initiative records | Workspace goals |
| Opportunity/threat tracking state | Command Center widgets |
| Competitor profiles | Command Center + Reports |

### User Actions

| Action | Result |
|--------|--------|
| View opportunity detail | Full opportunity analysis |
| View threat detail | Full threat analysis with mitigation options |
| View competitor profile | Competitor Analysis depth |
| Create strategic initiative | Links to goal; tracks progress |
| Update initiative status | Progress reflected in Goal Tracker |
| Dismiss opportunity | Logged; removed from active tracker |
| Assign initiative to team member | Collaboration |
| Export strategic view | Report generation |

### System Actions

- Refresh strategic assessments each intelligence cycle
- Track opportunity expiry and threat escalation
- Link strategic entities to graph

### Relationships

| Module | Relationship |
|--------|--------------|
| **Command Center** | Summary cards link here for depth |
| **Workspace** | Goals and projects |
| **Reports** | Strategic report generation |

---

## MODULE 6 — KNOWLEDGE

### Purpose

Access curated organizational knowledge — reference intelligence the organization has validated and chosen to retain.

### Responsibilities

- Present searchable organizational knowledge
- Display uploaded document intelligence
- Show marketplace knowledge packs (if installed)
- Distinguish knowledge from live Command Center intelligence

### Inputs

| Input | Source |
|-------|--------|
| Knowledge Memory | System |
| Uploaded documents | User |
| Marketplace knowledge packs | Marketplace |
| User annotations | User |

### Outputs

| Output | Consumer |
|--------|----------|
| Knowledge search results | User research |
| Knowledge references | Evidence in recommendations |

### User Actions

| Action | Result |
|--------|--------|
| Search knowledge | Retrieve organizational knowledge |
| View knowledge article | Read validated content |
| Upload document to knowledge | Ingestion → validation → Knowledge Memory |
| Annotate knowledge | User notes linked to article |
| Request knowledge correction | Correction flow |
| Browse categories | Navigate knowledge structure |

### System Actions

- Index new knowledge on validation
- Cross-reference knowledge in intelligence cycles
- Flag stale knowledge for review

### Relationships

| Module | Relationship |
|--------|--------------|
| **Workspace** | Scoped knowledge |
| **Command Center** | Knowledge informs recommendations |
| **Marketplace** | Knowledge packs |

---

## MODULE 7 — MARKETPLACE

### Purpose

Extend Conquest through governed third-party integrations, templates, domain modules, and future expansion paths.

### Responsibilities

- List available extensions
- Manage installation and configuration
- Enforce security and evidence governance on extensions
- Support future marketplace categories

### Inputs

| Input | Source |
|-------|--------|
| Extension packages | Publishers |
| Organization policy | Admin settings |
| User install requests | User |

### Outputs

| Output | Consumer |
|--------|----------|
| Installed extensions | Workspace, Command Center, Automation, Knowledge |
| Configuration state | Settings |

### User Actions

| Action | Result |
|--------|--------|
| Browse marketplace | View available extensions |
| View extension detail | Capabilities, permissions, reviews |
| Install extension | Admin approval if required → configuration |
| Configure extension | Scope and settings |
| Uninstall extension | Removed; data per retention policy |
| View installed extensions | Organization inventory |

### Capabilities (current)

| Category | Examples |
|----------|----------|
| Data source connectors | Industry APIs, regional providers |
| Domain modules | Trading, healthcare, logistics |
| Report templates | Industry formats |
| Automation templates | Workflow patterns |
| Integration connectors | CRM, ERP, ad platforms |

### Future Expansion

| Category | Status |
|----------|--------|
| **Agent Marketplace** | Future — governed specialist agents |
| **Knowledge Marketplace** | Future — validated domain knowledge packs |
| **Template Marketplace** | Current — report and automation templates |
| **Private Enterprise Marketplace** | Enterprise — org-private extensions |

### Agent Marketplace (future product rules)

- Agents declare authority boundaries before listing
- No direct user communication
- Orchestrator mediation mandatory
- Verification compliance mandatory
- Organization admin approval before install

### Knowledge Marketplace (future product rules)

- Knowledge packs pass evidence validation on install
- Organization policy may block categories
- User browses and installs like extensions

### Relationships

| Module | Relationship |
|--------|--------------|
| **Workspace** | Extensions scoped to workspace or org |
| **Automation** | Templates |
| **Reports** | Templates |
| **Knowledge** | Knowledge packs |
| **Settings** | Integration management |

---

## MODULE 8 — SUPPORT

### Purpose

Help users succeed with Conquest — self-service, guided, AI-assisted, and human-escalated.

### Responsibilities

- Provide help documentation and knowledge base
- Accept tickets, bugs, feedback, feature requests
- Handle intelligence inaccuracy reports
- Escalate to human support when needed

### User Actions

| Action | Result |
|--------|--------|
| Search help center | Self-service answers |
| Submit ticket | Support queue |
| Report bug | Engineering queue with context |
| Submit feedback | Product backlog |
| Request feature | Voting backlog |
| Report intelligence inaccuracy | Priority queue with artifact chain |
| Chat with support AI | Product usage help; escalates if unresolved |
| Request human support | Human queue |

### System Actions

- Auto-capture context (workspace, screen, cycle ID)
- Attach artifact chain for intelligence reports
- Route by category and plan tier

### Relationships

| Module | Relationship |
|--------|--------------|
| **Command Center** | "Report inaccuracy" entry point |
| **Settings** | Support preferences |

---

## MODULE 9 — SETTINGS

### Purpose

Configure account, workspace, security, integrations, notifications, privacy, memory, AI behavior, and automation policies.

### Responsibilities

- Expose all user-configurable product behavior
- Enforce role-based access to settings
- Never expose settings that compromise intelligence integrity

### User Actions

Per SDD Section 17 — Account, Workspace, Security, Integrations, Notifications, Appearance, Privacy, Memory Controls, AI Controls, Automation Controls.

### Prohibited Settings

Users and admins **cannot**:

- Disable verification
- Disable challenge for major conclusions
- Disable evidence classification
- Force confidence inflation
- Bypass approval rules for irreversible actions

### Relationships

All modules — settings govern their behavior.

---

## MODULE 10 — BILLING

### Purpose

Manage subscription, payment, plans, credits, and invoices.

### User Actions

| Action | Result |
|--------|--------|
| View current plan | Plan details and usage |
| Upgrade/downgrade | Plan change |
| Add payment method | Card or USDT |
| View invoices | Invoice history |
| Purchase credits | Usage credit top-up |
| Cancel subscription | End-of-period cancellation |

### Product Rule

Billing changes never modify intelligence outputs.

### Relationships

| Module | Relationship |
|--------|--------------|
| **Settings** | Billing sub-section |
| **Marketplace** | Extension purchases |

---

# PART 2 — USER TYPES

Conquest serves multiple user types with distinct goals, workflows, intelligence needs, permissions, and expected outcomes.

---

## USER TYPE 1 — INDIVIDUAL

| Dimension | Definition |
|-----------|------------|
| **Profile** | Solo operator, freelancer, independent analyst |
| **Goals** | Improve personal decisions; monitor own projects or channels |
| **Primary workflows** | Connect sources → Command Center → act on recommendations |
| **Intelligence needs** | Executive summary, recommendations, predictions, trend analysis |
| **Permissions** | Owner of personal organization; full workspace control |
| **Expected outcomes** | Faster, better-informed decisions; growing intelligence over time |
| **Typical plan** | Trial → Starter |

---

## USER TYPE 2 — CREATOR

| Dimension | Definition |
|-----------|------------|
| **Profile** | Content creator, influencer, personal brand operator |
| **Goals** | Grow audience, optimize content, maximize engagement and revenue |
| **Primary workflows** | Connect social platforms → monitor performance → optimize content strategy |
| **Intelligence needs** | Platform performance, trend analysis, opportunity alerts, predictive forecasts for growth |
| **Permissions** | Individual or small team |
| **Expected outcomes** | Data-driven content decisions; channel growth; monetization improvement |
| **Workspace type** | Marketing |

---

## USER TYPE 3 — STARTUP FOUNDER

| Dimension | Definition |
|-----------|------------|
| **Profile** | Early-stage company leader wearing multiple hats |
| **Goals** | Survival, growth, product-market fit, efficient resource allocation |
| **Primary workflows** | Command Center daily → strategic decisions → automate reporting |
| **Intelligence needs** | Risk assessment, opportunity alerts, competitor analysis, growth plan, executive brief |
| **Permissions** | Owner; small team invite |
| **Expected outcomes** | Fewer blind spots; faster strategic pivots; investor-ready reports |
| **Workspace type** | Business |

---

## USER TYPE 4 — SMALL BUSINESS

| Dimension | Definition |
|-----------|------------|
| **Profile** | Established small business (5–20 employees) |
| **Goals** | Revenue growth, operational efficiency, competitive positioning |
| **Primary workflows** | Multi-source connection → team Command Center → automations |
| **Intelligence needs** | Revenue trends, competitor analysis, risk assessment, strategic recommendations |
| **Permissions** | Owner + Manager + Members |
| **Expected outcomes** | Team-aligned decisions; automated monitoring; reduced consultant dependency |
| **Typical plan** | Professional |

---

## USER TYPE 5 — AGENCY

| Dimension | Definition |
|-----------|------------|
| **Profile** | Marketing, consulting, or intelligence agency serving clients |
| **Goals** | Manage multiple client contexts; deliver intelligence to clients |
| **Primary workflows** | Per-client workspace → report generation → client delivery |
| **Intelligence needs** | Comparative analysis, performance reports, competitive intelligence, executive briefs |
| **Permissions** | Multiple workspaces; role separation per client |
| **Expected outcomes** | Scalable client intelligence delivery; white-label reports (future) |
| **Typical plan** | Business |

---

## USER TYPE 6 — TEAM

| Dimension | Definition |
|-----------|------------|
| **Profile** | Department or cross-functional team within larger organization |
| **Goals** | Shared situational awareness; collaborative decision-making |
| **Primary workflows** | Shared Command Center → assign recommendations → track execution |
| **Intelligence needs** | Goal tracking, recommendation ranking, execution status, team activity |
| **Permissions** | Manager assigns; Members act; Viewers observe |
| **Expected outcomes** | Reduced decision latency; accountability on recommendations |
| **Typical plan** | Professional / Business |

---

## USER TYPE 7 — ENTERPRISE

| Dimension | Definition |
|-----------|------------|
| **Profile** | Large organization with compliance, SSO, and governance requirements |
| **Goals** | Organization-wide intelligence; policy compliance; audit trail |
| **Primary workflows** | Admin governance → multi-workspace → audit → enterprise reports |
| **Intelligence needs** | Executive brief, risk assessment, strategic recommendations, compliance-safe outputs |
| **Permissions** | SSO; granular RBAC; audit log; admin AI controls |
| **Expected outcomes** | Governed intelligence at scale; compliance; dedicated support SLA |
| **Typical plan** | Enterprise |

---

## USER TYPE 8 — RESEARCH ORGANIZATION

| Dimension | Definition |
|-----------|------------|
| **Profile** | Research firm, think tank, academic, or internal R&D unit |
| **Goals** | Deep analysis; evidence-based conclusions; knowledge accumulation |
| **Primary workflows** | Document upload → research requests → deep reports → knowledge curation |
| **Intelligence needs** | Historical analysis, comparative analysis, market insight, evidence viewer depth |
| **Permissions** | Knowledge management emphasis; extended research depth |
| **Expected outcomes** | Validated intelligence artifacts; growing knowledge base; reproducible analysis |
| **Workspace type** | Research |

---

# PART 3 — CORE WORKFLOWS

Product behavior step by step — what the **user experiences** and what the **product does**.

---

## WORKFLOW 1 — User Connects Website

### User steps

1. User opens Workspace → Data Sources
2. User selects "Website" connector
3. User enters site URL and authorizes analytics connection
4. User sees "Connecting…" then "Connected"
5. If first source: user sees Intelligence Initialization progress
6. User redirected to Command Center when ready

### Product behavior (user-visible)

| Step | User sees |
|------|-----------|
| Connection confirmed | Green status on data source |
| Initialization | Progress messages in plain language |
| Completion | Command Center populated with web KPIs, executive summary, initial recommendations |
| Notification | "Your website intelligence is ready" (if notifications on) |

### Product behavior (system — invisible)

Ingestion → full intelligence pipeline → memory seeding → graph entity creation → widget population. User never sees pipeline stages.

### Expected outcome

User sees website performance intelligence in Command Center without configuring anything beyond the connection.

---

## WORKFLOW 2 — User Asks "Why Are My Sales Dropping?"

### User steps

1. User clicks "Ask Conquest" in Command Center
2. User types: "Why are my sales dropping?"
3. User submits
4. User sees processing indicator with plain-language status
5. User receives structured response in Command Center

### Product behavior (user-visible)

| Step | User sees |
|------|-----------|
| Processing | "Analyzing your question…" / "Reviewing evidence…" |
| Clarification (if needed) | "Which time period?" or "Which product line?" — single focused question |
| Response | Structured answer with: assessment, confidence, top hypotheses, recommendation, evidence link |
| Follow-up | Option to drill evidence, approve action, or correct |

### Product behavior (system — invisible)

Understanding → context → memory retrieval → research → reasoning → challenge → verification → decision → human calibration → delivery.

### Response structure (product output)

- **Assessment** — what Conquest believes is happening (with confidence)
- **Leading hypotheses** — ranked explanations (not single answer)
- **Evidence summary** — what supports the assessment
- **Recommendation** — what to do next (ranked action)
- **Prediction** (if applicable) — labeled forecast with invalidation conditions
- **"View evidence"** — drill-down available

### Expected outcome

User understands why sales may be dropping, how confident Conquest is, what to do next — without seeing internal machinery.

---

## WORKFLOW 3 — User Uploads Documents

### User steps

1. User navigates to Knowledge Center (or Workspace → Upload)
2. User selects file(s) — PDF, spreadsheet, presentation, etc.
3. User optionally tags: category, project, goal relevance
4. User submits upload
5. User sees processing status
6. User sees document in Knowledge Center when ready

### Product behavior (user-visible)

| Step | User sees |
|------|-----------|
| Upload | Progress bar |
| Processing | "Analyzing document…" |
| Complete | Document listed in Knowledge with summary |
| Intelligence integration | Document insights may appear in Memory Insights and future recommendations |

### Product behavior (system — invisible)

Parse → evidence classification → reasoning on claims → verification → Knowledge/Evidence Memory → graph linkage if entities found.

### Expected outcome

Document intelligence available for future cycles and searchable in Knowledge Center.

---

## WORKFLOW 4 — User Approves Recommendation

### User steps

1. User sees recommendation in Command Center
2. User clicks recommendation → detail view
3. User reviews evidence, confidence, alternatives
4. User clicks "Approve"
5. If action requires execution: user confirms scope
6. User sees execution status in Command Center

### Product behavior

| Step | Product action |
|------|---------------|
| Approve | Decision logged; execution or automation triggered |
| Modify | Modification flow → re-verification if material change |
| Reject | Logged; learning signal; removed from queue |
| Defer | Snoozed with reminder date |

### Expected outcome

Approved intelligence becomes action with full traceability.

---

## WORKFLOW 5 — User Creates Automation from Recommendation

### User steps

1. User approves recommendation
2. User selects "Automate this"
3. User reviews automation template (pre-filled from recommendation)
4. User sets schedule or trigger
5. User approves first execution
6. Automation appears in Automation Center and Command Center execution widget

### Expected outcome

Repeatable execution of validated intelligence without re-approval each cycle (within defined bounds).

---

## WORKFLOW 6 — User Generates Executive Report

### User steps

1. User opens Reports Center or Command Center → Generate Report
2. User selects "Executive Report"
3. User selects period and depth
4. User clicks Generate
5. User sees generation progress
6. User views report in Reports Center
7. User exports PDF or shares link

### Expected outcome

Immutable snapshot of executive intelligence for stakeholders.

---

## WORKFLOW 7 — User Corrects Conquest

### User steps

1. User sees intelligence element (recommendation, summary, KPI interpretation)
2. User clicks "Correct this"
3. User enters correction and scope (this instance / always for this topic)
4. User submits
5. User sees confirmation: "Correction recorded — Conquest will apply this going forward"
6. Affected intelligence re-cycles

### Expected outcome

Correction Memory created; future intelligence respects user truth signal.

---

## WORKFLOW 8 — User Connects Instagram, TikTok, YouTube

### User steps

1. User opens Workspace → Data Sources
2. User connects each platform (OAuth or API key per platform)
3. User sees each source reach "Connected"
4. Intelligence initialization runs (or incremental cycle if workspace active)
5. Command Center Platform Performance section populates

### Expected outcome

Cross-platform intelligence: comparative performance, channel recommendations, unified executive summary.

---

## WORKFLOW 9 — New Team Member Onboarding

### User steps

1. Admin invites member by email
2. Member accepts → creates account or logs in
3. Member sees workspace(s) they have access to
4. Member sees abbreviated Command Center walkthrough
5. Member operates within role permissions

### Expected outcome

Productive team member without re-running full organization onboarding.

---

## WORKFLOW 10 — User Installs Marketplace Extension

### User steps

1. Admin browses Marketplace
2. Admin views extension detail (permissions, data access)
3. Admin installs
4. Admin configures scope (workspace, credentials if needed)
5. Extension capabilities appear in relevant modules
6. Intelligence re-initialization if extension provides data source

### Expected outcome

Extended capability without core product change.

---

# PART 4 — INTELLIGENCE OUTPUTS

Every output Conquest can produce — defined with structure, labeling rules, and surfacing location.

---

## OUTPUT 1 — STRATEGIC RECOMMENDATION

| Field | Definition |
|-------|------------|
| **What it is** | Ranked action guidance backed by evidence and decision scoring |
| **Contains** | Title, rationale, evidence summary, confidence, risk score, alternatives, approval actions |
| **Labeling** | Confidence band always visible |
| **Surfaced in** | Command Center Recommendation Panel; Reports |
| **Never** | Presented without confidence or evidence access |

---

## OUTPUT 2 — OPPORTUNITY ALERT

| Field | Definition |
|-------|------------|
| **What it is** | Detected asymmetric upside requiring attention |
| **Contains** | Description, impact range, confidence, evidence, recommended action, urgency/expiry |
| **Surfaced in** | Command Center Opportunity Tracker; Strategy Center |
| **Distinction** | Alert = time-sensitive; Tracker = persistent opportunity record |

---

## OUTPUT 3 — THREAT ALERT

| Field | Definition |
|-------|------------|
| **What it is** | Detected risk requiring attention |
| **Contains** | Description, severity, likelihood, confidence, mitigation options, second-order effects |
| **Surfaced in** | Command Center Risk Monitor; Strategy Center |
| **Distinction** | P0 if critical — top of Command Center |

---

## OUTPUT 4 — COMPETITOR ANALYSIS

| Field | Definition |
|-------|------------|
| **What it is** | Structured assessment of competitive entity |
| **Contains** | Position, recent moves, vulnerabilities, relative strengths, evidence sources |
| **Surfaced in** | Command Center Competitor widget; Strategy Center; Reports |
| **Requires** | Authorized competitive data sources |

---

## OUTPUT 5 — MARKET INSIGHT

| Field | Definition |
|-------|------------|
| **What it is** | Structural observation about market conditions |
| **Contains** | Insight statement, evidence, confidence, implications |
| **Surfaced in** | Command Center; Executive Summary; Reports |
| **Distinction** | Insight = observation; Recommendation = action |

---

## OUTPUT 6 — TREND ANALYSIS

| Field | Definition |
|-------|------------|
| **What it is** | Directional analysis of metric or phenomenon over time |
| **Contains** | Trend description, period, magnitude, confidence, contributing factors |
| **Surfaced in** | KPI cards, performance charts, Reports |
| **Includes** | Sparkline/trend visual (UXMD defines visual) |

---

## OUTPUT 7 — PREDICTIVE FORECAST

| Field | Definition |
|-------|------------|
| **What it is** | Evidence-based probability assessment of future state |
| **Contains** | Subject, probability/distribution, horizon, assumptions, invalidation conditions, confidence |
| **Labeling** | **Prediction** label mandatory — never fact |
| **Surfaced in** | Prediction Monitor; Prediction Detail; Reports |
| **Revision** | User notified when prediction revised |

---

## OUTPUT 8 — EXECUTIVE BRIEF

| Field | Definition |
|-------|------------|
| **What it is** | One-page situational intelligence summary for leadership |
| **Contains** | Situation, key changes, top risks, top opportunities, top recommendation, confidence |
| **Surfaced in** | Command Center Executive Summary; Reports (Executive Report) |
| **Frequency** | Updated every intelligence cycle; report snapshot on demand |

---

## OUTPUT 9 — GROWTH PLAN

| Field | Definition |
|-------|------------|
| **What it is** | Sequenced strategic actions toward growth goal |
| **Contains** | Goal linkage, phased actions, dependencies, expected impact, risks per phase |
| **Surfaced in** | Strategy Center; Reports; Recommendation detail |
| **Origin** | Planning Intelligence + Strategic Intelligence + Decision Intelligence |

---

## OUTPUT 10 — RISK ASSESSMENT

| Field | Definition |
|-------|------------|
| **What it is** | Structured evaluation of risk landscape |
| **Contains** | Risk register, severity × likelihood matrix, mitigation options, confidence |
| **Surfaced in** | Risk Monitor; Strategy Center; Reports |
| **Distinction** | Assessment = comprehensive; Threat Alert = single urgent item |

---

## OUTPUT 11 — ANOMALY ALERT

| Field | Definition |
|-------|------------|
| **What it is** | Unexpected deviation from expected pattern |
| **Contains** | Metric, expected vs actual, deviation magnitude, confidence, investigate action |
| **Surfaced in** | Command Center P0 alerts |
| **Trigger** | Event-driven intelligence cycle |

---

## OUTPUT 12 — RESEARCH FINDINGS

| Field | Definition |
|-------|------------|
| **What it is** | Synthesized evidence from extended research |
| **Contains** | Findings list, source summary, gaps remaining, confidence |
| **Surfaced in** | Command Center analytical zone; Reports; Intelligence Activity |
| **Distinction** | Findings ≠ recommendations — may inform recommendations separately |

---

## OUTPUT 13 — MEMORY INSIGHT

| Field | Definition |
|-------|------------|
| **What it is** | Synthesized insight from accumulated memory |
| **Contains** | Pattern description, supporting cases, confidence, applicability |
| **Surfaced in** | Memory Insights widget |
| **Never** | Raw memory records |

---

## OUTPUT 14 — EXECUTION RESULT

| Field | Definition |
|-------|------------|
| **What it is** | Outcome of authorized action or automation |
| **Contains** | Status, outcome vs expected, deviation flags, timestamp |
| **Surfaced in** | Execution widget; Automation Center |
| **Feeds** | Learning and Measurement |

---

## OUTPUT 15 — GOAL PROGRESS UPDATE

| Field | Definition |
|-------|------------|
| **What it is** | Progress toward defined workspace goal |
| **Contains** | Goal, current state, target, progress %, trajectory, confidence |
| **Surfaced in** | Goal Tracker widget |
| **Updates** | Each intelligence cycle |

---

## OUTPUT 16 — INTELLIGENCE ACTIVITY EVENT

| Field | Definition |
|-------|------------|
| **What it is** | Plain-language log of significant intelligence event |
| **Contains** | What happened, when, workspace scope — no engine names |
| **Example** | "Conquest analyzed your Instagram performance" |
| **Surfaced in** | Activity feed |
| **Never** | "Research Agent completed task 4471" |

---

## OUTPUT LABELING RULES (ALL OUTPUTS)

| Rule | Requirement |
|------|-------------|
| **Confidence** | Visible on every major output |
| **Prediction** | Explicit label on all forecasts |
| **Evidence** | Accessible on demand for claims |
| **Staleness** | Freshness timestamp on time-sensitive outputs |
| **Hypothesis vs fact** | Inferences labeled; verified facts distinguished |

---

# PART 5 — MENU ARCHITECTURE (FINAL)

Permanent resolution of the menu problem. This is the **final product navigation architecture** unless amended by PDD version increment.

---

## 5.1 PRIMARY NAVIGATION — USER VISIBLE

| # | Item | Default landing | Purpose |
|---|------|-----------------|---------|
| 1 | **Command Center** | Yes — home | Intelligence cockpit |
| 2 | **Reports** | No | Formatted intelligence output |
| 3 | **Automation** | No | Workflow management |
| 4 | **Knowledge** | No | Organizational knowledge access |
| 5 | **Strategy** | No | Strategic depth and initiatives |
| 6 | **Marketplace** | No | Extensions |
| 7 | **Settings** | No | Configuration |

**Support** accessed via utility menu (top bar) — not primary nav slot.

**Billing** accessed via Settings — not primary nav.

**Profile** accessed via utility menu — not primary nav.

**Workspace Selector** — top bar context switcher — not a nav item.

---

## 5.2 UTILITY BAR

| Item | Location |
|------|----------|
| Workspace Selector | Top left |
| Notifications | Top right |
| Help / Support | Top right |
| Profile | Top right menu |

---

## 5.3 HIDDEN SYSTEM FUNCTIONS — NEVER MENU ITEMS

| Function | How user experiences it |
|----------|------------------------|
| **Memory** | Memory Insights widget; Knowledge Center |
| **Prediction** | Prediction Monitor widget; Prediction Detail |
| **Research** | Research Findings; Reports; Ask Conquest responses |
| **Verification** | Trustworthy outputs; evidence viewer |
| **Learning** | Improving quality over time — invisible |
| **Reasoning** | "Why this recommendation" explainability |
| **Challenge** | Invisible — quality improvement |
| **Intelligence Routing** | Invisible — Orchestration |
| **Evidence Scoring** | Confidence labels |
| **Decision Scoring** | Ranked recommendations |
| **Context Reconstruction** | Situationally aware intelligence |
| **Human Calibration** | Appropriate communication tone |
| **Optimization** | Invisible — efficiency |
| **Analysis** (as nav label) | Command Center + drill-downs |
| **Intelligence** (as nav label) | Command Center |
| **Models** | Settings / Admin |
| **Data Sources** | Workspace settings |
| **Dashboard** (duplicate) | Eliminated — Command Center only |

---

## 5.4 NAVIGATION LAWS

| Law | Rule |
|-----|------|
| **NAV-1** | Maximum 7 primary nav items — frozen at 7 |
| **NAV-2** | Command Center is always home |
| **NAV-3** | No intelligence system name in navigation |
| **NAV-4** | Drill-down replaces nav expansion |
| **NAV-5** | New nav item requires PDD amendment |
| **NAV-6** | Workspace is context, not parallel product |
| **NAV-7** | Users navigate decisions, not machinery |

---

## 5.5 ROLE-BASED NAV VISIBILITY

| Item | Viewer | Member | Manager | Admin | Owner |
|------|--------|--------|---------|-------|-------|
| Command Center | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reports | ✓ | ✓ | ✓ | ✓ | ✓ |
| Automation | — | ✓ | ✓ | ✓ | ✓ |
| Knowledge | ✓ | ✓ | ✓ | ✓ | ✓ |
| Strategy | ✓ | ✓ | ✓ | ✓ | ✓ |
| Marketplace | — | — | ✓ | ✓ | ✓ |
| Settings | limited | limited | ✓ | ✓ | ✓ |

---

# PART 6 — FEATURE ACCEPTANCE CRITERIA

Every product feature must answer four questions. If it cannot, **the feature must not exist**.

---

## 6.1 Module-Level Acceptance

### Command Center

| Question | Answer |
|----------|--------|
| **Why does it exist?** | Primary intelligence cockpit for daily decision support |
| **What problem does it solve?** | Fragmented data and decisions — unified operational awareness |
| **What intelligence does it improve?** | All — synthesis surface for every output type |
| **If removed?** | Conquest has no product — users have no destination |

**Verdict: REQUIRED**

---

### Workspace

| Question | Answer |
|----------|--------|
| **Why does it exist?** | Bounded operating context preventing menu fragmentation |
| **What problem does it solve?** | Scope confusion across goals, data, team, intelligence |
| **What intelligence does it improve?** | Context quality — all intelligence scoped correctly |
| **If removed?** | Intelligence lacks boundaries; multi-client impossible |

**Verdict: REQUIRED**

---

### Reports

| Question | Answer |
|----------|--------|
| **Why does it exist?** | Shareable formatted intelligence for stakeholders |
| **What problem does it solve?** | Command Center is live — reports are distributable snapshots |
| **What intelligence does it improve?** | Communication of intelligence to decision-makers |
| **If removed?** | Users cannot share or archive intelligence formally |

**Verdict: REQUIRED**

---

### Automation

| Question | Answer |
|----------|--------|
| **Why does it exist?** | Convert approved intelligence into repeatable action |
| **What problem does it solve?** | Manual repetition of validated decisions |
| **What intelligence does it improve?** | Execution quality — closes loop from decision to action |
| **If removed?** | Conquest becomes analysis-only — loses operating system character |

**Verdict: REQUIRED**

---

### Strategy

| Question | Answer |
|----------|--------|
| **Why does it exist?** | Depth beyond Command Center summary cards |
| **What problem does it solve?** | Strategic planning requires more than dashboard cards |
| **What intelligence does it improve?** | Strategic intelligence consumption and initiative tracking |
| **If removed?** | Strategic users lose planning depth; cards insufficient alone |

**Verdict: REQUIRED**

---

### Knowledge

| Question | Answer |
|----------|--------|
| **Why does it exist?** | Access organizational reference intelligence |
| **What problem does it solve?** | Validated knowledge separate from live analysis |
| **What intelligence does it improve?** | Research quality — knowledge informs cycles |
| **If removed?** | Users cannot manage or access organizational knowledge |

**Verdict: REQUIRED**

---

### Marketplace

| Question | Answer |
|----------|--------|
| **Why does it exist?** | Extend Conquest without core redesign |
| **What problem does it solve?** | Domain and integration diversity impossible in core alone |
| **What intelligence does it improve?** | Domain-specific intelligence via extensions |
| **If removed?** | Conquest limited to built-in domains and connectors |

**Verdict: REQUIRED (may launch with minimal catalog)**

---

### Support

| Question | Answer |
|----------|--------|
| **Why does it exist?** | Complete product experience includes help |
| **What problem does it solve?** | Users blocked without assistance |
| **What intelligence does it improve?** | Indirect — corrections and feedback improve system |
| **If removed?** | Product incomplete; user trust erodes |

**Verdict: REQUIRED**

---

## 6.2 Feature-Level Acceptance — Command Center Widgets

| Widget | Why exist? | Problem solved | Intelligence improved | If removed? |
|--------|-----------|----------------|----------------------|-------------|
| **Executive Summary** | Situational awareness in 30 seconds | Information overload | Strategic synthesis | Users lack quick orientation — **REQUIRED** |
| **Recommendations** | Actionable decisions | "So what?" gap | Decision quality | No action path — **REQUIRED** |
| **KPI Cards** | Performance monitoring | Metric scatter | Trend awareness | Reduced operational visibility — **REQUIRED** |
| **Opportunity Tracker** | Surface upside | Missed opportunities | Strategic intelligence | Opportunities invisible — **REQUIRED** |
| **Risk Monitor** | Surface threats | Surprise failures | Risk intelligence | Risks discovered too late — **REQUIRED** |
| **Prediction Monitor** | Forward visibility | Reactive-only decisions | Prediction intelligence | No forward view — **REQUIRED** |
| **Goal Tracker** | Progress accountability | Goal drift | Goal alignment | Goals become decorative — **REQUIRED** |
| **Activity Feed** | Transparency | "Black box" distrust | Trust | Users don't know Conquest is working — **REQUIRED** |
| **Execution Status** | Action accountability | Unknown automation state | Execution quality | Automation invisible — **REQUIRED** |
| **Memory Insights** | Show learning | "Does Conquest know me?" | Memory utility | Memory value invisible — **REQUIRED** |
| **Competitor Widget** | Competitive awareness | Competitive blindness | Competitive intelligence | Optional if no competitive data — **CONDITIONAL** |
| **Platform Performance** | Channel comparison | Siloed platform views | Marketing intelligence | Required for marketing workspaces — **CONDITIONAL** |
| **Revenue Breakdown** | Revenue understanding | Revenue opacity | Financial intelligence | Required for commerce workspaces — **CONDITIONAL** |

### Widget rules (product)

| Rule | Requirement |
|------|-------------|
| **No empty widgets** | Widget must show meaningful state or explicit empty explanation |
| **No dead widgets** | Every widget maps to live intelligence output |
| **No decorative widgets** | Every widget passes four-question acceptance test |
| **Conditional widgets** | Appear only when workspace type and data support them |

*Visual enforcement of box consistency — UXMD responsibility.*

---

## 6.3 Feature-Level Acceptance — Rejected Features

| Feature | Why rejected |
|---------|-------------|
| **Chat-primary interface** | Contradicts command center identity; encourages endless dialogue without resolution |
| **Research as nav item** | Internal capability — not product |
| **Memory browser** | Exposes machinery; violates synthesized memory principle |
| **Analysis as nav item** | Command Center subsumes analysis |
| **Intelligence as nav item** | Too vague; Command Center is the intelligence surface |
| **Models as primary nav** | Infrastructure concern — belongs in Settings |
| **Separate Dashboard** | Duplicates Command Center |
| **Agent viewer** | Exposes machinery |
| **Pipeline debugger (user)** | Admin only |

---

## 6.4 Feature Addition Process

New features must:

1. Answer four acceptance questions in writing
2. Map to a product module
3. Map to intelligence output type(s)
4. Confirm no new nav item unless PDD amendment
5. Pass NAV laws (Part 5)
6. Not duplicate existing module responsibility

---

# PART 7 — PRODUCT DESIGN LAWS

Permanent laws governing product behavior. UXMD and build must conform.

| # | Law |
|---|-----|
| **PD-1** | Every feature passes four-question acceptance test |
| **PD-2** | Users interact with outputs, not intelligence systems |
| **PD-3** | Command Center is always home |
| **PD-4** | Maximum 7 primary nav items |
| **PD-5** | No empty or dead widgets |
| **PD-6** | Every output shows confidence |
| **PD-7** | Predictions always labeled |
| **PD-8** | Evidence always accessible on demand |
| **PD-9** | User can correct any major intelligence element |
| **PD-10** | Automations require approval before first execution |
| **PD-11** | Reports are snapshots; Command Center is live |
| **PD-12** | Billing never changes intelligence content |
| **PD-13** | New nav items require PDD amendment |
| **PD-14** | Workspace scopes all product behavior |
| **PD-15** | Plain language for all user-visible system activity |

---

# PART 8 — DOCUMENT DEPENDENCIES

| Topic | Owning document |
|-------|----------------|
| Intelligence philosophy | CCIS |
| Architecture | AMD I–IV |
| Operational design | SDD |
| **Product behavior** | **PDD (this document)** |
| Visual design, spacing, grids, box rules | UXMD (next) |
| Implementation | Build phase (not started) |

---

*End of Conquest Product Design Document (PDD) v1.0*
