# UXMD VOLUME II — SCREEN AND INTERACTION SPECIFICATION

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | UXMD Volume II — Screen and Interaction Specification |
| **Abbreviation** | UXMD-II / SIS |
| **Status** | Screen Behavior Authority — Volume 2 of 3 |
| **Version** | 1.1 |
| **Supreme Authority** | CCIS |
| **Subordinate To** | CCIS, AMD I–IV, PDD I–II, UXMD Volume I, **UXMD Volume III (GIS)** |
| **Precedes** | SDD Volume I, UI Design System, Frontend Build, Backend Build |

### Mission

Define **exact behavioral specifications** for every screen, route, state, workflow, interaction, support path, onboarding path, mobile behavior, permission behavior, and recovery path — eliminating ambiguity before engineering begins.

| Document | Question |
|----------|----------|
| UXMD Volume I | How should Conquest feel? |
| **UXMD Volume II** | **What does every screen do?** |
| SDD Volume I | How is it engineered? |

### Strict Prohibitions

No UI design, colors, CSS, component libraries, Figma, database schemas, APIs, or implementation.

### Standard Screen Specification Template

Every screen in Part B uses:

| Field | Defines |
|-------|---------|
| **Screen ID** | Canonical identifier |
| **Route** | URL pattern (behavioral routing — not API) |
| **Purpose** | Why the screen exists |
| **User Goal** | What the user wants here |
| **Entry Paths** | How user arrives |
| **Exit Paths** | Where user goes next |
| **Information Displayed** | Intelligence and data shown |
| **Actions Available** | Everything user can do |
| **Permission Rules** | Role access |
| **Success State** | Expected completion |
| **Loading State** | While work in progress |
| **Empty State** | No data |
| **Error State** | Failure |
| **Recovery State** | How user recovers |
| **Offline State** | If applicable |
| **Desktop Behavior** | Desktop-specific |
| **Mobile Behavior** | Mobile-specific |
| **Light Mode** | Behavioral (content parity) |
| **Dark Mode** | Behavioral (content parity) |
| **Notifications Triggered** | Outbound notifications from this screen |
| **Memory Interactions** | Memory read/write at boundary |
| **Support Entry Points** | Help access from this screen |
| **Related Screens** | Navigation graph |
| **GIS Inheritance** | Which UXMD-III standards apply (default: Full) |
| **GIS Overrides** | Screen-specific exceptions only |

### GIS Inheritance Rule

Unless **GIS Overrides** is specified, every screen inherits **all** standards from [UXMD Volume III — Global Interaction Standards](volume-iii-global-interaction-standards.md):

- States: GIS Part 1 + module profile (§1.9)
- Permissions: GIS Part 2 module defaults (§2.3)
- Accessibility: GIS Part 3 (full)
- Mobile: GIS Part 4 (full)
- Notifications: GIS Part 5
- Interactions: GIS Part 6
- Session: GIS Part 7
- Support: GIS Part 8
- Audit: GIS Part 9

Screen specifications below define **screen-specific** purpose, routes, intelligence, actions, and overrides only. Duplicated global behavior is not repeated per screen.

---

# PART A — SCREEN INVENTORY

## A.1 Inventory Rules

- Every user-reachable surface is listed
- Overlays and panels are screens when they constitute distinct behavioral contexts
- Detail views are separate screens when actions or states differ from parent
- No screen omitted

## A.2 Public / Unauthenticated Screens

| ID | Screen | Route |
|----|--------|-------|
| PUB-01 | Landing Page | `/` |
| PUB-02 | Sign Up | `/signup` |
| PUB-03 | Login | `/login` |
| PUB-04 | Email Verification | `/verify-email` |
| PUB-05 | Password Recovery Request | `/forgot-password` |
| PUB-06 | Password Reset | `/reset-password` |
| PUB-07 | Invitation Accept | `/invite/:token` |

## A.3 Onboarding Screens

| ID | Screen | Route |
|----|--------|-------|
| ONB-01 | Onboarding Welcome | `/onboarding` |
| ONB-02 | Onboarding Orientation | `/onboarding/orientation` |
| ONB-03 | Workspace Creation | `/onboarding/workspace` |
| ONB-04 | First Data Connection Prompt | `/onboarding/connect` |
| ONB-05 | Initialization Progress | `/onboarding/initializing` |
| ONB-06 | Onboarding Complete | `/onboarding/complete` |

## A.4 Authenticated App Shell

| ID | Screen | Route |
|----|--------|-------|
| SHL-01 | App Shell (layout) | `/app/*` |
| SHL-02 | Workspace Selector Panel | overlay |
| SHL-03 | Notification Panel | overlay |
| SHL-04 | Profile Menu | overlay |
| SHL-05 | Global Search | overlay |
| SHL-06 | Session Expired | `/session-expired` |

## A.5 Command Center Screens

| ID | Screen | Route |
|----|--------|-------|
| CC-01 | Command Center Home | `/app/w/:workspaceId` |
| CC-02 | Ask Conquest Input | overlay on CC-01 |
| CC-03 | Ask Conquest Response | overlay on CC-01 |
| CC-04 | Recommendation Detail | `/app/w/:workspaceId/recommendations/:id` |
| CC-05 | Evidence Viewer | `/app/w/:workspaceId/evidence/:id` |
| CC-06 | Alert Detail | `/app/w/:workspaceId/alerts/:id` |
| CC-07 | KPI Drill-down | `/app/w/:workspaceId/metrics/:id` |
| CC-08 | Correction Flow | overlay |
| CC-09 | Decision Confirmation (irreversible) | overlay |
| CC-10 | Widget Configuration | overlay |
| CC-11 | Recommendation Modify | overlay |
| CC-12 | Recommendation Alternatives Detail | `/app/w/:workspaceId/recommendations/:id/alternatives` |
| CC-13 | Prediction Detail | `/app/w/:workspaceId/predictions/:id` |
| CC-14 | Execution Status Detail | `/app/w/:workspaceId/executions/:id` |
| CC-15 | Outcome Confirmation | overlay |

## A.6 Reports Screens

| ID | Screen | Route |
|----|--------|-------|
| RPT-01 | Reports Center | `/app/w/:workspaceId/reports` |
| RPT-02 | Report Generate | `/app/w/:workspaceId/reports/new` |
| RPT-03 | Report Viewer | `/app/w/:workspaceId/reports/:reportId` |
| RPT-04 | Report Compare | `/app/w/:workspaceId/reports/compare` |
| RPT-05 | Report Schedules | `/app/w/:workspaceId/reports/schedules` |
| RPT-06 | Report Schedule Editor | `/app/w/:workspaceId/reports/schedules/:id` |
| RPT-07 | First Report Milestone | overlay on RPT-02 |

## A.7 Automation Screens

| ID | Screen | Route |
|----|--------|-------|
| AUT-01 | Automation Center | `/app/w/:workspaceId/automation` |
| AUT-02 | Automation Builder | `/app/w/:workspaceId/automation/new` |
| AUT-03 | Automation Detail | `/app/w/:workspaceId/automation/:id` |
| AUT-04 | Automation Execution Log | `/app/w/:workspaceId/automation/:id/log` |
| AUT-05 | Automation Approval Queue | `/app/w/:workspaceId/automation/approvals` |
| AUT-06 | Rollback Confirmation | overlay |

## A.8 Knowledge Screens

| ID | Screen | Route |
|----|--------|-------|
| KNW-01 | Knowledge Center | `/app/w/:workspaceId/knowledge` |
| KNW-02 | Knowledge Search Results | `/app/w/:workspaceId/knowledge/search` |
| KNW-03 | Knowledge Article View | `/app/w/:workspaceId/knowledge/:articleId` |
| KNW-04 | Knowledge Upload | `/app/w/:workspaceId/knowledge/upload` |
| KNW-05 | Knowledge Category Browse | `/app/w/:workspaceId/knowledge/category/:slug` |

## A.9 Strategy Center Screens

| ID | Screen | Route |
|----|--------|-------|
| STR-01 | Strategy Center Overview | `/app/w/:workspaceId/strategy` |
| STR-02 | Opportunity Detail | `/app/w/:workspaceId/strategy/opportunities/:id` |
| STR-03 | Threat Detail | `/app/w/:workspaceId/strategy/threats/:id` |
| STR-04 | Competitor Profile | `/app/w/:workspaceId/strategy/competitors/:id` |
| STR-05 | Strategic Initiative Detail | `/app/w/:workspaceId/strategy/initiatives/:id` |
| STR-06 | Research Findings Detail | `/app/w/:workspaceId/strategy/research/:id` |
| STR-07 | Risk Register | `/app/w/:workspaceId/strategy/risks` |
| STR-08 | Growth Plan View | `/app/w/:workspaceId/strategy/growth-plan` |

## A.10 Marketplace Screens

| ID | Screen | Route |
|----|--------|-------|
| MKT-01 | Marketplace Browse | `/app/marketplace` |
| MKT-02 | Extension Detail | `/app/marketplace/:extensionId` |
| MKT-03 | Installed Extensions | `/app/marketplace/installed` |
| MKT-04 | Extension Configure | `/app/marketplace/installed/:id/configure` |

## A.11 Settings Screens

| ID | Screen | Route |
|----|--------|-------|
| SET-01 | Settings Home | `/app/settings` |
| SET-02 | Account | `/app/settings/account` |
| SET-03 | Security Center | `/app/settings/security` |
| SET-03a | MFA Enrollment | `/app/settings/security/mfa` |
| SET-04 | Notifications Preferences | `/app/settings/notifications` |
| SET-05 | Privacy | `/app/settings/privacy` |
| SET-06 | Appearance | `/app/settings/appearance` |
| SET-07 | Billing | `/app/settings/billing` |
| SET-08 | Integrations | `/app/settings/integrations` |
| SET-09 | Workspace Settings | `/app/settings/workspace/:workspaceId` |
| SET-10 | Team Management | `/app/settings/workspace/:workspaceId/team` |
| SET-11 | Data Sources Management | `/app/settings/workspace/:workspaceId/sources` |
| SET-12 | Data Source Connect | `/app/settings/workspace/:workspaceId/sources/connect/:type` |
| SET-13 | Goals and Projects | `/app/settings/workspace/:workspaceId/goals` |
| SET-14 | Advanced / AI Controls | `/app/settings/advanced` |
| SET-15 | Memory Controls | `/app/settings/memory` |
| SET-16 | Automation Policies | `/app/settings/automation-policies` |
| SET-17 | Organization Settings | `/app/settings/organization` |
| SET-18 | Activity Log | `/app/settings/activity` |

## A.12 Profile and Utility Screens

| ID | Screen | Route |
|----|--------|-------|
| PRF-01 | Profile | `/app/profile` |
| PRF-02 | Active Sessions | `/app/profile/sessions` |

## A.13 Support Screens

| ID | Screen | Route |
|----|--------|-------|
| SUP-01 | Help Center | `/app/help` |
| SUP-02 | Documentation | `/app/help/docs` |
| SUP-03 | Documentation Article | `/app/help/docs/:slug` |
| SUP-04 | FAQ | `/app/help/faq` |
| SUP-05 | Contact Support | `/app/help/contact` |
| SUP-06 | Report Bug | `/app/help/report-bug` |
| SUP-07 | Report Intelligence Inaccuracy | overlay |
| SUP-08 | Support Ticket Detail | `/app/help/tickets/:id` |
| SUP-09 | Incident Status | `/app/help/status` |
| SUP-10 | Support AI Chat | overlay |

## A.14 Workspace Management Screens

| ID | Screen | Route |
|----|--------|-------|
| WKS-01 | Workspace Create (in-app) | `/app/workspaces/new` |
| WKS-02 | Workspace Archive Confirm | overlay |
| WKS-03 | Workspace Delete Confirm | overlay |

## A.15 System Screens

| ID | Screen | Route |
|----|--------|-------|
| SYS-01 | Permission Denied | overlay or `/app/denied` |
| SYS-02 | Plan Limit Reached | overlay |
| SYS-03 | Maintenance Notice | `/maintenance` |
| SYS-04 | Not Found | `/404` |

## A.16 Screen Count Summary

| Category | Count |
|----------|-------|
| Public | 7 |
| Onboarding | 6 |
| App Shell | 6 |
| Command Center | 16 |
| Reports | 7 |
| Automation | 6 |
| Knowledge | 5 |
| Strategy | 8 |
| Marketplace | 4 |
| Settings | 19 |
| Profile | 2 |
| Support | 10 |
| Workspace Mgmt | 3 |
| System | 4 |
| **Total** | **102 screens** |

---

# PART B — SCREEN SPECIFICATIONS

## B.1 Specification Index

Full specifications below. **Default:** `GIS Inheritance: Full — see UXMD-III` applies to every screen unless **GIS Overrides** or explicit fields are listed. Primary and gap-remediation screens include full detail; remaining screens inherit GIS and differ only by purpose, route, intelligence, and actions documented in Part A inventory.

---

### PUB-01 — Landing Page

| Field | Specification |
|-------|---------------|
| **Route** | `/` |
| **Purpose** | Convert visitors by explaining Conquest as Intelligence Command Center — not chatbot |
| **User Goal** | Understand value; begin signup or login |
| **Entry Paths** | Direct URL; marketing link; logged-out redirect |
| **Exit Paths** | Sign Up; Login; Documentation (public docs if enabled) |
| **Information Displayed** | Value proposition; differentiation from AI chat and dashboards; plan overview (high level) |
| **Actions Available** | Start free trial / Sign up; Log in; View documentation |
| **Permission Rules** | Public |
| **Success State** | User proceeds to signup or login with correct mental model |
| **Loading State** | Minimal static content load |
| **Empty State** | N/A |
| **Error State** | Page unavailable — retry |
| **Recovery State** | Refresh; status page link |
| **Offline State** | Cached static message if available |
| **Desktop Behavior** | Full content sections |
| **Mobile Behavior** | Stacked sections; primary CTA always visible |
| **Light/Dark Mode** | System default; content identical |
| **Notifications Triggered** | None |
| **Memory Interactions** | None |
| **Support Entry Points** | Footer help link |
| **Related Screens** | PUB-02, PUB-03, SUP-02 |

---

### PUB-02 — Sign Up

| Field | Specification |
|-------|---------------|
| **Route** | `/signup` |
| **Purpose** | Create account with minimal friction |
| **User Goal** | Register and proceed to verification |
| **Entry Paths** | Landing; Login link; Invite flow (may skip if invite embeds account) |
| **Exit Paths** | Email Verification; Login (existing account) |
| **Information Displayed** | Required fields; plan selection if applicable; terms acceptance |
| **Actions Available** | Submit registration; switch to login |
| **Permission Rules** | Public |
| **Success State** | Account created; redirect to verification prompt |
| **Loading State** | Submit in progress — disable form |
| **Empty State** | N/A |
| **Error State** | Field validation errors inline; email exists; rate limit |
| **Recovery State** | Correct fields; use login if account exists; wait on rate limit |
| **Offline State** | Cannot submit — message to reconnect |
| **Desktop Behavior** | Centered form |
| **Mobile Behavior** | Full-width form; keyboard-friendly |
| **Light/Dark Mode** | Identical fields and validation |
| **Notifications Triggered** | Verification email sent |
| **Memory Interactions** | None |
| **Support Entry Points** | Help link |
| **Related Screens** | PUB-04, ONB-01 |

---

### PUB-03 — Login

| Field | Specification |
|-------|---------------|
| **Route** | `/login` |
| **Purpose** | Authenticate returning users |
| **User Goal** | Access Conquest |
| **Entry Paths** | Landing; session expired; logout; deep link redirect |
| **Exit Paths** | Command Center (B1); Onboarding (if incomplete); Email verification (if unverified) |
| **Information Displayed** | Credentials; SSO options (enterprise); remember device |
| **Actions Available** | Login; forgot password; sign up; SSO |
| **Permission Rules** | Public |
| **Success State** | Authenticated; routed per account state |
| **Loading State** | Auth in progress |
| **Empty State** | N/A |
| **Error State** | Invalid credentials; account locked; SSO failure |
| **Recovery State** | Retry; password recovery; contact support |
| **Offline State** | Cannot login |
| **Desktop/Mobile** | Standard form; SSO prominent on enterprise |
| **Light/Dark Mode** | Identical |
| **Notifications Triggered** | Security alert on new device (if enabled) |
| **Memory Interactions** | Session Memory on success |
| **Support Entry Points** | Help link |
| **Related Screens** | PUB-05, CC-01, ONB-01, SHL-06 |

---

### PUB-04 — Email Verification

| Field | Specification |
|-------|---------------|
| **Route** | `/verify-email` |
| **Purpose** | Confirm identity before full product access |
| **User Goal** | Complete verification |
| **Entry Paths** | Post-signup; email link; login block if unverified |
| **Exit Paths** | Onboarding Welcome |
| **Information Displayed** | Verification status; resend option; expiry notice |
| **Actions Available** | Resend email; enter code (if code flow); continue after verified |
| **Permission Rules** | Authenticated or token-based |
| **Success State** | Verified; auto-advance to onboarding |
| **Loading State** | Verifying token |
| **Empty State** | Awaiting user action |
| **Error State** | Expired link; invalid code |
| **Recovery State** | Resend; request new link |
| **Offline State** | Cannot verify until online |
| **Desktop/Mobile** | Same flow |
| **Notifications Triggered** | Resend verification email |
| **Memory Interactions** | None |
| **Support Entry Points** | Contact support if persistent failure |
| **Related Screens** | ONB-01 |

---

### PUB-05 — Password Recovery Request

| Field | Specification |
|-------|---------------|
| **Route** | `/forgot-password` |
| **Purpose** | Initiate password reset securely |
| **User Goal** | Receive reset link |
| **Entry Paths** | Login screen |
| **Exit Paths** | Login; email client (external) |
| **Information Displayed** | Email field; confirmation after submit (no account enumeration) |
| **Actions Available** | Submit email; return to login |
| **Permission Rules** | Public |
| **Success State** | Generic "if account exists, email sent" message |
| **Loading State** | Submitting |
| **Error State** | Invalid email format; rate limit |
| **Recovery State** | Wait; retry |
| **Notifications Triggered** | Reset email if account exists |
| **Related Screens** | PUB-06, PUB-03 |

---

### PUB-06 — Password Reset

| Field | Specification |
|-------|---------------|
| **Route** | `/reset-password` |
| **Purpose** | Set new password via secure token |
| **User Goal** | Regain account access |
| **Entry Paths** | Email link |
| **Exit Paths** | Login |
| **Information Displayed** | New password fields; strength requirements |
| **Actions Available** | Submit new password |
| **Permission Rules** | Valid reset token |
| **Success State** | Password updated; redirect login |
| **Error State** | Expired token; weak password |
| **Recovery State** | Request new reset link |
| **Related Screens** | PUB-03, PUB-05 |

---

### PUB-07 — Invitation Accept

| Field | Specification |
|-------|---------------|
| **Route** | `/invite/:token` |
| **Purpose** | Onboard invited team member to workspace |
| **User Goal** | Accept invite and join workspace |
| **Entry Paths** | Email invite link |
| **Exit Paths** | Sign up (new user); Login (existing); Command Center abbreviated orientation |
| **Information Displayed** | Inviter; workspace name; role offered |
| **Actions Available** | Accept; decline; create account or login |
| **Permission Rules** | Valid invite token |
| **Success State** | Member added; workspace accessible |
| **Error State** | Expired invite; revoked; wrong account |
| **Recovery State** | Request new invite from admin |
| **Memory Interactions** | Minimal User Memory scaffold |
| **Related Screens** | PUB-02, PUB-03, CC-01, SET-10 |

---

### ONB-01 — Onboarding Welcome

| Field | Specification |
|-------|---------------|
| **Route** | `/onboarding` |
| **Purpose** | Orient new user to Conquest operating model |
| **User Goal** | Understand what happens next |
| **Entry Paths** | Post-verification; first login incomplete onboarding |
| **Exit Paths** | Onboarding Orientation |
| **Information Displayed** | Four beats: Command Center concept; Workspace scopes everything; Connect data activates intelligence; You decide |
| **Actions Available** | Continue; skip only if returning user with workspace |
| **Permission Rules** | Authenticated; onboarding incomplete |
| **Success State** | User proceeds informed |
| **Loading State** | N/A |
| **Empty State** | N/A |
| **Error State** | Session lost — return login |
| **Recovery State** | Re-login |
| **Desktop/Mobile** | Same content; mobile shorter copy allowed |
| **Related Screens** | ONB-02, ONB-03 |

---

### ONB-02 — Onboarding Orientation

| Field | Specification |
|-------|---------------|
| **Route** | `/onboarding/orientation` |
| **Purpose** | Reinforce intelligence command center mental model |
| **User Goal** | Know what Conquest will do automatically |
| **Entry Paths** | ONB-01 |
| **Exit Paths** | Workspace Creation |
| **Information Displayed** | What Conquest does in background; what user controls |
| **Actions Available** | Continue |
| **Permission Rules** | Authenticated onboarding |
| **Related Screens** | ONB-03 |

---

### ONB-03 — Workspace Creation

| Field | Specification |
|-------|---------------|
| **Route** | `/onboarding/workspace` |
| **Purpose** | Create first workspace |
| **User Goal** | Define operating context |
| **Entry Paths** | Onboarding; no workspace redirect from B1 |
| **Exit Paths** | First Data Connection Prompt; Command Center (if skip connect offered) |
| **Information Displayed** | Name; type; primary goal (required) |
| **Actions Available** | Create workspace; back |
| **Permission Rules** | Authenticated; plan workspace limits |
| **Success State** | Workspace created; Dormant state |
| **Loading State** | Creating workspace |
| **Empty State** | N/A |
| **Error State** | Validation; plan limit |
| **Recovery State** | Fix fields; upgrade plan |
| **Memory Interactions** | Project Memory scaffold; Organization registry |
| **Related Screens** | ONB-04, CC-01, WKS-01 |

---

### ONB-04 — First Data Connection Prompt

| Field | Specification |
|-------|---------------|
| **Route** | `/onboarding/connect` |
| **Purpose** | Drive first activation |
| **User Goal** | Connect first data source |
| **Entry Paths** | Post workspace creation |
| **Exit Paths** | Data Source Connect; Initialization Progress; skip to Dormant Command Center (discouraged) |
| **Information Displayed** | Recommended sources for workspace type |
| **Actions Available** | Select source type; skip with consequence explained |
| **Permission Rules** | Workspace owner/member |
| **Success State** | Connection initiated |
| **Related Screens** | SET-12, ONB-05, CC-01 |

---

### ONB-05 — Initialization Progress

| Field | Specification |
|-------|---------------|
| **Route** | `/onboarding/initializing` |
| **Purpose** | Show C3 initialization progress |
| **User Goal** | Wait for first intelligence |
| **Entry Paths** | First source connected |
| **Exit Paths** | Onboarding Complete; Command Center when ready |
| **Information Displayed** | Plain-language progress messages; no pipeline names |
| **Actions Available** | None (wait); cancel not available |
| **Permission Rules** | Workspace member+ |
| **Success State** | Initialization complete |
| **Loading State** | Primary state — progressive messages |
| **Error State** | Sparse data — honest limited; empty source |
| **Recovery State** | Add another source; retry |
| **Desktop/Mobile** | Full-screen focus on progress |
| **Notifications Triggered** | "Intelligence ready" if enabled |
| **Related Screens** | ONB-06, CC-01 |

---

### ONB-06 — Onboarding Complete

| Field | Specification |
|-------|---------------|
| **Route** | `/onboarding/complete` |
| **Purpose** | Celebrate milestone; route to value |
| **User Goal** | Enter Command Center |
| **Entry Paths** | Initialization success |
| **Exit Paths** | Command Center; First Report Milestone offer |
| **Information Displayed** | Summary of what was built; next steps: review recommendations, generate first report |
| **Actions Available** | Go to Command Center; Generate first report |
| **Success State** | User lands Command Center Ready |
| **Related Screens** | CC-01, RPT-07 |

---

### SHL-01 — App Shell

| Field | Specification |
|-------|---------------|
| **Route** | `/app/*` |
| **Purpose** | Persistent authenticated layout — nav, utility bar, workspace context |
| **User Goal** | Navigate product without losing context |
| **Entry Paths** | Post-login; any authenticated route |
| **Exit Paths** | All app screens |
| **Information Displayed** | Primary nav (7 items); workspace selector; notifications; profile; active route indicator |
| **Actions Available** | Nav switch; open overlays; workspace switch; theme via settings |
| **Permission Rules** | Authenticated; nav items per role |
| **Success State** | Child screen renders in content area |
| **Loading State** | Shell loads; child may load separately |
| **Error State** | Auth failure — session expired screen |
| **Recovery State** | Re-login |
| **Desktop Behavior** | Persistent sidebar nav; expanded default |
| **Mobile Behavior** | Bottom nav or hamburger drawer — see Part C |
| **Related Screens** | All authenticated screens |

---

### CC-01 — Command Center Home

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId` |
| **Purpose** | Daily intelligence cockpit — home |
| **User Goal** | Know situation; decide; act |
| **Entry Paths** | Login default; nav; workspace switch; onboarding complete |
| **Exit Paths** | All detail screens; other modules; Settings |
| **Information Displayed** | Priority zones P0–P10 per UXMD-I D.3: alerts, recommendations, executive summary, risks, opportunities, predictions, goals, KPIs, execution, activity, memory insights |
| **Actions Available** | Ask Conquest; approve/reject/defer/modify recommendations; drill KPI; open alerts; correct intelligence; generate report; create automation; connect data; configure widgets; switch mode |
| **Permission Rules** | Viewer+ read; Member+ act on recommendations and automations |
| **Success State** | User oriented and can act |
| **Loading State** | Skeleton zones; plain-language "Loading intelligence…" |
| **Empty State** | Dormant: connect data CTA; honest, no fabrication |
| **Error State** | Degraded per source; corrupt data fallback |
| **Recovery State** | Reconnect source; refresh; support |
| **Offline State** | Last verified snapshot with offline banner and timestamp |
| **Desktop Behavior** | Multi-column zones; sidebar nav visible |
| **Mobile Behavior** | Stacked P0→P1 first; zones collapsible; FAB or prominent Ask Conquest |
| **Light/Dark Mode** | Identical intelligence; priority visible in both |
| **Notifications Triggered** | None directly — receives push |
| **Memory Interactions** | Read Session, User, Project, Evidence refs; write on decisions |
| **Support Entry Points** | Report inaccuracy on any element; help |
| **Related Screens** | CC-02–CC-15, STR-*, RPT-02, AUT-02, SET-11 |

**Behavioral states on CC-01:**

| State | Display |
|-------|---------|
| Dormant | Empty + connect CTA |
| Initializing | Progress overlay or inline |
| Ready | Full zones |
| Awaiting Decision | Recommendations elevated |
| Degraded | Zone-level notices |
| Processing | Freshness indicator + background refresh |

---

### CC-02 — Ask Conquest Input

| Field | Specification |
|-------|---------------|
| **Route** | overlay on CC-01 |
| **Purpose** | Capture structured intelligence request |
| **User Goal** | Ask specific question |
| **Entry Paths** | Command Center Ask action |
| **Exit Paths** | CC-03 response; cancel to CC-01 |
| **Information Displayed** | Input field; scope indicator (workspace); stakes hint for complex questions |
| **Actions Available** | Submit; cancel |
| **Permission Rules** | Member+ |
| **Success State** | Question submitted |
| **Loading State** | Transitions to CC-03 |
| **Empty State** | Placeholder examples — not chat history |
| **Error State** | Empty submit blocked |
| **Mobile Behavior** | Full-screen input sheet |
| **Related Screens** | CC-03 |

---

### CC-03 — Ask Conquest Response

| Field | Specification |
|-------|---------------|
| **Route** | overlay on CC-01 |
| **Purpose** | Deliver structured intelligence — not chat stream |
| **User Goal** | Understand and act |
| **Entry Paths** | CC-02 submit |
| **Exit Paths** | Evidence viewer; recommendation action; Strategy depth; CC-01 dismiss |
| **Information Displayed** | Assessment + confidence; hypotheses; evidence summary; recommendation; prediction if applicable; clarification question if needed |
| **Actions Available** | View evidence; approve action; correct; export to report; open Strategy depth |
| **Permission Rules** | Member+ for actions; Viewer read-only |
| **Success State** | User understands next step |
| **Loading State** | Plain-language progress: "Analyzing…" "Reviewing evidence…" |
| **Empty State** | N/A |
| **Error State** | Insufficient evidence message |
| **Recovery State** | Narrow scope; connect more data |
| **Mobile Behavior** | Full-screen structured sections |
| **Memory Interactions** | Read full relevant; write session artifact |
| **Related Screens** | CC-05, CC-04, STR-06 |

---

### CC-04 — Recommendation Detail

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/recommendations/:id` |
| **Purpose** | Full recommendation before decision |
| **User Goal** | Decide with full information |
| **Entry Paths** | Command Center panel; notification |
| **Exit Paths** | Approve flow; CC-09 confirmation; Automation builder; CC-01 |
| **Information Displayed** | Title; rationale; confidence; risk; evidence; alternatives; actions |
| **Actions Available** | Approve; reject; defer; modify; view alternatives; view evidence; automate; correct |
| **Permission Rules** | Member+ act; Viewer view only |
| **Success State** | Decision recorded (D7) |
| **Error State** | Execution authorization fail |
| **Recovery State** | Modify; contact admin |
| **Mobile Behavior** | Full-screen; sticky action bar |
| **Notifications Triggered** | Reminder on defer |
| **Related Screens** | CC-09, CC-11, CC-12, AUT-02, CC-05 |

---

### CC-05 — Evidence Viewer

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/evidence/:id` |
| **Purpose** | Show evidence lineage for trust |
| **User Goal** | Verify claims |
| **Entry Paths** | Any intelligence element "view evidence" |
| **Exit Paths** | Return to source screen; Knowledge article |
| **Information Displayed** | Sources; recency; evidence class; conflicts if any; gaps |
| **Actions Available** | Navigate source; request correction |
| **Permission Rules** | Viewer+ |
| **Success State** | User verified or accepts limitation |
| **Empty State** | No evidence — explicit |
| **Related Screens** | KNW-03, CC-08 |

---

### CC-06 — Alert Detail

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/alerts/:id` |
| **Purpose** | P0/P1 alert investigation |
| **User Goal** | Understand and respond to alert |
| **Entry Paths** | Alert zone; notification |
| **Exit Paths** | Related metric; recommendation; dismiss to CC-01 |
| **Information Displayed** | Alert type; metric; expected vs actual; confidence; recommended investigate action |
| **Actions Available** | Investigate drill-down; dismiss with reason; create automation |
| **Permission Rules** | Viewer+ |
| **Related Screens** | CC-07, STR-03 |

---

### CC-07 — KPI Drill-down

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/metrics/:id` |
| **Purpose** | Metric hierarchy depth |
| **User Goal** | Understand metric drivers |
| **Entry Paths** | KPI card tap |
| **Exit Paths** | Parent metric; report; CC-01 |
| **Information Displayed** | Trend analysis; period; contributing factors; freshness |
| **Actions Available** | Change period; export to report; correct |
| **Permission Rules** | Viewer+ |
| **Empty State** | Insufficient history — reduced confidence notice |
| **Related Screens** | RPT-02, CC-01 |

---

### CC-08 — Correction Flow

| Field | Specification |
|-------|---------------|
| **Route** | overlay |
| **Purpose** | Capture user truth (E3) |
| **User Goal** | Fix wrong intelligence |
| **Entry Paths** | Correct action on any major element |
| **Exit Paths** | Source screen after acknowledgment |
| **Information Displayed** | Original reference; correction input; scope: instance vs persistent |
| **Actions Available** | Submit; cancel |
| **Success State** | "Correction recorded — Conquest will apply going forward" |
| **Error State** | Ambiguous scope — one clarifying question |
| **Memory Interactions** | Correction Memory immediate write |
| **Related Screens** | All intelligence screens |

---

### CC-09 — Decision Confirmation (Irreversible)

| Field | Specification |
|-------|---------------|
| **Route** | overlay |
| **Purpose** | BH-9 explicit authorization |
| **User Goal** | Confirm understanding of stakes |
| **Entry Paths** | Approve irreversible recommendation |
| **Exit Paths** | Execution; cancel to CC-04 |
| **Information Displayed** | Action summary; consequences; cannot undo warning |
| **Actions Available** | Confirm; cancel |
| **Permission Rules** | Member+ with execution permission |
| **Success State** | Execution begins |
| **Related Screens** | CC-04, AUT-03 |

---

### CC-10 — Widget Configuration

| Field | Specification |
|-------|---------------|
| **Route** | overlay |
| **Purpose** | User adjusts Command Center presentation |
| **User Goal** | Personalize within rules |
| **Entry Paths** | Configure widgets action |
| **Exit Paths** | CC-01 |
| **Information Displayed** | Available widgets; order; mode selection |
| **Actions Available** | Add/remove/reorder; save; reset default |
| **Permission Rules** | Member+; conditional widgets per workspace type |
| **Empty State** | Widgets unavailable until data connected — explained |
| **Related Screens** | CC-01, SET-06 |

---

### CC-11 — Recommendation Modify

| Field | Specification |
|-------|---------------|
| **Route** | overlay on CC-04 |
| **Purpose** | Capture user modification before re-verification (PDD D7) |
| **User Goal** | Adjust recommendation within bounds |
| **Entry Paths** | CC-04 Modify action |
| **Exit Paths** | CC-04 updated recommendation; CC-09 if material change irreversible |
| **Information Displayed** | Original recommendation; editable fields per modifiable scope |
| **Actions Available** | Submit modification; cancel |
| **GIS Inheritance** | Full — UXMD-III |
| **GIS Overrides** | Loading: "Re-verifying modified recommendation…"; Success: routes to CC-04 with updated record; Error: material change requires full re-verification notice |
| **Permission Rules** | GIS Inherit PERM-CC-ACT — Member+ |
| **Related Screens** | CC-04, CC-09 |

---

### CC-12 — Recommendation Alternatives Detail

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/recommendations/:id/alternatives` |
| **Purpose** | Show rejected options with rationale (DEC ranking transparency) |
| **User Goal** | Understand why alternatives were not selected |
| **Entry Paths** | CC-04 "View alternatives" |
| **Exit Paths** | CC-04; promote alternative → CC-11 modify flow |
| **Information Displayed** | Ranked alternatives; scores; rejection rationale; confidence per option |
| **Actions Available** | Select alternative as basis for modify; view evidence per option |
| **GIS Inheritance** | Full — UXMD-III |
| **GIS Overrides** | Empty: "No alternatives met threshold" with explanation |
| **Permission Rules** | GIS Inherit PERM-CC-READ — Viewer+ |
| **Related Screens** | CC-04, CC-05, CC-11 |

---

### CC-13 — Prediction Detail

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/predictions/:id` |
| **Purpose** | Full prediction lifecycle view (CCIS §VII) |
| **User Goal** | Understand forecast, assumptions, and invalidation conditions |
| **Entry Paths** | Command Center Prediction Monitor; notification (prediction revised/invalidated) |
| **Exit Paths** | CC-05 evidence; STR-01; CC-15 outcome if measured |
| **Information Displayed** | Forecast; probability; horizon; assumptions; invalidation conditions; confidence; revision history summary; **Prediction** label mandatory |
| **Actions Available** | View evidence; correct; export to report; confirm outcome when due |
| **GIS Inheritance** | Full — UXMD-III |
| **GIS Overrides** | Notification: P2 on revision; P2 on invalidation; Offline: cached prediction with stale notice |
| **Permission Rules** | GIS Inherit PERM-CC-READ — Viewer+ |
| **Related Screens** | CC-01, CC-05, CC-15, RPT-02 |

---

### CC-14 — Execution Status Detail

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/executions/:id` |
| **Purpose** | Drill-down from Execution Status widget |
| **User Goal** | Monitor authorized action or automation run |
| **Entry Paths** | CC-01 execution widget; AUT-03; notification |
| **Exit Paths** | AUT-04 log; AUT-06 rollback; CC-15 outcome |
| **Information Displayed** | Status; steps completed; expected vs actual; deviation flags; timestamps |
| **Actions Available** | Cancel (if in progress); view full log; rollback (if reversible); confirm outcome |
| **GIS Inheritance** | Full — UXMD-III |
| **GIS Overrides** | Loading: step progress; Error: failure classification with recovery per GIS §6.5 |
| **Permission Rules** | GIS Inherit PERM-AUT — Member+ |
| **Related Screens** | AUT-03, AUT-04, AUT-06, CC-15 |

---

### CC-15 — Outcome Confirmation

| Field | Specification |
|-------|---------------|
| **Route** | overlay |
| **Purpose** | User confirms measured outcome for learning (PDD E1 / CCIS Measure) |
| **User Goal** | Validate whether recommendation/automation succeeded |
| **Entry Paths** | Notification reminder; CC-04 post-execution; CC-14; CC-13 prediction due |
| **Exit Paths** | Dismiss; CC-08 correction if outcome wrong |
| **Information Displayed** | Original action; expected outcome; measured outcome; match/miss indicator |
| **Actions Available** | Confirm success; report failure; defer measurement; correct |
| **GIS Inheritance** | Full — UXMD-III |
| **GIS Overrides** | Success: triggers E1/E2 learning path invisibly; user sees acknowledgment only |
| **Permission Rules** | GIS Inherit PERM-CC-ACT — Member+ |
| **Notifications Triggered** | Reminder if deferred (P3) |
| **Related Screens** | CC-04, CC-13, CC-14, SUP-07 |

---

### RPT-01 — Reports Center

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/reports` |
| **Purpose** | Browse and manage report history |
| **User Goal** | Find or create reports |
| **Entry Paths** | Nav; Command Center generate |
| **Exit Paths** | RPT-02, RPT-03, RPT-04, RPT-05 |
| **Information Displayed** | Report list: type, date, period; schedules summary |
| **Actions Available** | Generate new; open report; compare; manage schedules; delete per policy |
| **Permission Rules** | Viewer+ |
| **Success State** | User finds or creates report |
| **Loading State** | List loading |
| **Empty State** | No reports yet — generate first CTA; first report milestone |
| **Error State** | Load failure |
| **Recovery State** | Retry |
| **Desktop Behavior** | Table or card list with filters |
| **Mobile Behavior** | Card list; filters in sheet |
| **Related Screens** | RPT-02–RPT-07 |

---

### RPT-02 — Report Generate

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/reports/new` |
| **Purpose** | Configure and generate snapshot |
| **User Goal** | Create distributable intelligence |
| **Entry Paths** | Reports Center; Command Center; onboarding milestone |
| **Exit Paths** | RPT-03 viewer; back to list |
| **Information Displayed** | Report type; period; depth; freshness status |
| **Actions Available** | Generate; cancel |
| **Success State** | Report created — RPT-03 |
| **Loading State** | Freshness check; cycle if needed; verification; formatting messages |
| **Error State** | VRF fail — block with reason |
| **Recovery State** | Refresh intelligence; retry |
| **Notifications Triggered** | Report ready |
| **Related Screens** | RPT-03, RPT-07 |

---

### RPT-03 — Report Viewer

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/reports/:reportId` |
| **Purpose** | Read immutable snapshot |
| **User Goal** | Consume or share report |
| **Entry Paths** | Reports list; notification; share link |
| **Exit Paths** | Export; share; compare; regenerate new; back |
| **Information Displayed** | Full report; timestamp; confidence labels; prediction labels; gaps section |
| **Actions Available** | Export PDF; data appendix; share link; regenerate as new; report inaccuracy |
| **Permission Rules** | Viewer+ view; share per org policy |
| **Success State** | User consumed or exported |
| **Empty State** | N/A — report exists |
| **Offline State** | Cached report view if previously loaded |
| **Related Screens** | RPT-04, SUP-07 |

---

### RPT-04 — Report Compare

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/reports/compare` |
| **Purpose** | Build comparative analysis |
| **User Goal** | See deltas across periods or channels |
| **Entry Paths** | Reports Center |
| **Exit Paths** | New comparative report viewer |
| **Information Displayed** | Selection UI; comparison type |
| **Actions Available** | Select reports/periods; generate comparison |
| **Permission Rules** | Viewer+ |
| **Success State** | New comparative report created |
| **Desktop Behavior** | Side-by-side selection |
| **Mobile Behavior** | Sequential selection steps |
| **Related Screens** | RPT-03 |

---

### RPT-05 — Report Schedules

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/reports/schedules` |
| **Purpose** | Manage recurring reports |
| **User Goal** | Automate report delivery |
| **Entry Paths** | Reports Center |
| **Exit Paths** | RPT-06 editor |
| **Information Displayed** | Schedule list; next run; delivery channel |
| **Actions Available** | Create; edit; pause; delete |
| **Permission Rules** | Member+ |
| **Related Screens** | RPT-06, AUT-01 |

---

### RPT-06 — Report Schedule Editor

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/reports/schedules/:id` |
| **Purpose** | Configure schedule details |
| **User Goal** | Set recurrence and delivery |
| **Information Displayed** | Cron/recurrence; report type; email opt-in |
| **Actions Available** | Save; test run |
| **Related Screens** | RPT-05 |

---

### RPT-07 — First Report Milestone

| Field | Specification |
|-------|---------------|
| **Route** | overlay on RPT-02 |
| **Purpose** | Guide first report after C3 |
| **User Goal** | Complete first report milestone |
| **Entry Paths** | Onboarding complete; first visit after initialization |
| **Exit Paths** | RPT-02 pre-filled Executive Report |
| **Information Displayed** | Milestone explanation; Reports vs live Command Center |
| **Actions Available** | Generate first report; dismiss |
| **Related Screens** | ONB-06, RPT-02 |

---

### AUT-01 — Automation Center

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/automation` |
| **Purpose** | Catalog and monitor automations |
| **User Goal** | Manage automated workflows |
| **Entry Paths** | Nav; Command Center |
| **Exit Paths** | AUT-02–AUT-05 |
| **Information Displayed** | Automation list; status; success rate; pending approvals count |
| **Actions Available** | Create; open detail; pause; view approvals |
| **Permission Rules** | Member+ view; Manager+ some policies |
| **Empty State** | No automations — create from recommendation CTA |
| **Loading State** | List load |
| **Error State** | Load failure |
| **Related Screens** | AUT-02, AUT-05, CC-01 |

---

### AUT-02 — Automation Builder

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/automation/new` |
| **Purpose** | Define new automation |
| **User Goal** | Automate validated decision |
| **Entry Paths** | Automation Center; recommendation "automate"; template |
| **Exit Paths** | AUT-03; approval queue |
| **Information Displayed** | Trigger; conditions; actions; bounds; rollback plan (if reversible) |
| **Actions Available** | Save draft; submit for approval; test |
| **Permission Rules** | Member+ |
| **Success State** | Automation created; awaits first-run approval |
| **Error State** | Invalid config; missing rollback for reversible |
| **Recovery State** | Fix validation errors |
| **Related Screens** | AUT-05, CC-04 |

---

### AUT-03 — Automation Detail

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/automation/:id` |
| **Purpose** | View and control single automation |
| **User Goal** | Monitor and manage |
| **Information Displayed** | Definition; status; last run; success rate; next run |
| **Actions Available** | Pause; resume; revoke; edit; view log; retry; rollback |
| **Permission Rules** | Member+; revoke Owner/Manager |
| **Related Screens** | AUT-04, AUT-06 |

---

### AUT-04 — Automation Execution Log

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/automation/:id/log` |
| **Purpose** | Full execution trace |
| **User Goal** | Audit and debug |
| **Information Displayed** | Step-by-step log; timestamps; deviations |
| **Actions Available** | Export log; retry; rollback |
| **Permission Rules** | Member+ |
| **Related Screens** | AUT-03, AUT-06 |

---

### AUT-05 — Automation Approval Queue

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/automation/approvals` |
| **Purpose** | Pending authorization |
| **User Goal** | Approve or reject automations |
| **Information Displayed** | Queue with stakes indicators |
| **Actions Available** | Approve; reject; request changes |
| **Permission Rules** | Member+ first own; Manager+ threshold |
| **Related Screens** | AUT-02, AUT-03 |

---

### AUT-06 — Rollback Confirmation

| Field | Specification |
|-------|---------------|
| **Route** | overlay |
| **Purpose** | Authorize compensating action |
| **User Goal** | Reverse failed/partial execution |
| **Entry Paths** | AUT-03/04 rollback action |
| **Exit Paths** | AUT-03 with rollback status |
| **Information Displayed** | Steps to reverse; irreversibility notice if partial |
| **Actions Available** | Confirm rollback; cancel |
| **Error State** | Rollback failure — Support escalation |
| **Related Screens** | SUP-05 |

---

### KNW-01 — Knowledge Center

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/knowledge` |
| **Purpose** | Hub for organizational knowledge |
| **User Goal** | Find or add knowledge |
| **Entry Paths** | Nav |
| **Exit Paths** | KNW-02–KNW-05 |
| **Information Displayed** | Search; categories; recent; stale flags; distinction from live intelligence notice |
| **Actions Available** | Search; upload; browse categories |
| **Permission Rules** | Viewer+ read; Member+ upload |
| **Empty State** | No knowledge — upload CTA |
| **Related Screens** | KNW-04, CC-05 |

---

### KNW-02 — Knowledge Search Results

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/knowledge/search` |
| **Purpose** | Display retrieval results |
| **User Goal** | Find relevant knowledge |
| **Information Displayed** | Ranked results; freshness; relevance |
| **Actions Available** | Open article; refine search |
| **Empty State** | No results — suggestions |
| **Related Screens** | KNW-03 |

---

### KNW-03 — Knowledge Article View

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/knowledge/:articleId` |
| **Purpose** | Read validated knowledge |
| **Information Displayed** | Content; source; freshness; related intelligence indicator |
| **Actions Available** | Annotate; request correction; cite in report |
| **Permission Rules** | Viewer+ |
| **Related Screens** | CC-08, CC-05 |

---

### KNW-04 — Knowledge Upload

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/knowledge/upload` |
| **Purpose** | C4 document intake |
| **User Goal** | Add document intelligence |
| **Information Displayed** | File intake; tags optional |
| **Actions Available** | Upload; cancel |
| **Loading State** | Upload progress; processing status |
| **Success State** | Document in Knowledge after validation |
| **Error State** | Parse fail; validation fail — stored unvalidated with notice |
| **Related Screens** | KNW-01, KNW-03 |

---

### KNW-05 — Knowledge Category Browse

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/knowledge/category/:slug` |
| **Purpose** | Navigate hierarchical knowledge |
| **Information Displayed** | Category articles list |
| **Related Screens** | KNW-03 |

---

### STR-01 — Strategy Center Overview

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/strategy` |
| **Purpose** | Strategic depth hub |
| **User Goal** | Plan and track strategically |
| **Information Displayed** | Opportunities; threats; competitors summary; initiatives; risk summary |
| **Actions Available** | Open details; create initiative; export report |
| **Permission Rules** | Viewer+ |
| **Empty State** | Awaiting intelligence — connect data or wait for cycle |
| **Related Screens** | STR-02–STR-08 |

---

### STR-02 — Opportunity Detail

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/strategy/opportunities/:id` |
| **Purpose** | Full opportunity analysis |
| **Information Displayed** | Impact; evidence; confidence; expiry; recommended action |
| **Actions Available** | Link initiative; dismiss; export; correct |
| **Related Screens** | STR-05, CC-04 |

---

### STR-03 — Threat Detail

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/strategy/threats/:id` |
| **Purpose** | Threat analysis and mitigation |
| **Information Displayed** | Severity; likelihood; mitigation options; second-order effects |
| **Actions Available** | Mitigation actions; dismiss; escalate alert |
| **Related Screens** | STR-07, CC-06 |

---

### STR-04 — Competitor Profile

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/strategy/competitors/:id` |
| **Purpose** | Competitive intelligence depth |
| **Information Displayed** | Position; moves; vulnerabilities; evidence |
| **Actions Available** | Correct identity; track; export competitive report |
| **Related Screens** | RPT-02, CC-08 |

---

### STR-05 — Strategic Initiative Detail

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/strategy/initiatives/:id` |
| **Purpose** | Track strategic initiative |
| **Information Displayed** | Goal link; status; linked recommendations; team assignments |
| **Actions Available** | Update status; assign member; link recommendation |
| **Permission Rules** | Member+ update; Manager assign |
| **Related Screens** | SET-13, CC-04 |

---

### STR-06 — Research Findings Detail

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/strategy/research/:id` |
| **Purpose** | Extended research presentation |
| **Information Displayed** | Findings; sources; gaps; confidence |
| **Actions Available** | Save to knowledge; generate report; request deeper research |
| **Related Screens** | CC-03, KNW-04 |

---

### STR-07 — Risk Register

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/strategy/risks` |
| **Purpose** | Comprehensive risk landscape |
| **Information Displayed** | Risk matrix; mitigations; confidence |
| **Actions Available** | Open risk detail; export |
| **Related Screens** | STR-03, RPT-02 |

---

### STR-08 — Growth Plan View

| Field | Specification |
|-------|---------------|
| **Route** | `/app/w/:workspaceId/strategy/growth-plan` |
| **Purpose** | Phased growth actions toward goal |
| **Information Displayed** | Phases; dependencies; expected impact; risks per phase |
| **Actions Available** | Approve phase; link initiatives |
| **Related Screens** | STR-05, CC-04 |

---

### MKT-01 — Marketplace Browse

| Field | Specification |
|-------|---------------|
| **Route** | `/app/marketplace` |
| **Purpose** | Discover extensions |
| **User Goal** | Find capability extensions |
| **Information Displayed** | Categories; search; featured |
| **Actions Available** | View detail; filter |
| **Permission Rules** | Manager+ browse install; Viewer may browse read-only per org |
| **Related Screens** | MKT-02 |

---

### MKT-02 — Extension Detail

| Field | Specification |
|-------|---------------|
| **Route** | `/app/marketplace/:extensionId` |
| **Purpose** | Evaluate before install |
| **Information Displayed** | Capabilities; permissions; data access; reviews |
| **Actions Available** | Install; request admin install |
| **Permission Rules** | Admin install; Member request |
| **Success State** | G2 install flow begins |
| **Error State** | Governance block with reason |
| **Related Screens** | MKT-04 |

---

### MKT-03 — Installed Extensions

| Field | Specification |
|-------|---------------|
| **Route** | `/app/marketplace/installed` |
| **Purpose** | Organization extension inventory |
| **Actions Available** | Configure; uninstall |
| **Permission Rules** | Admin+ |
| **Related Screens** | MKT-04, SET-08 |

---

### MKT-04 — Extension Configure

| Field | Specification |
|-------|---------------|
| **Route** | `/app/marketplace/installed/:id/configure` |
| **Purpose** | Scope and credential setup |
| **Information Displayed** | Workspace scope; credentials; capability toggles |
| **Success State** | Extension operational in modules |
| **Related Screens** | SET-12, CC-01 |

---

### SET-01 — Settings Home

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings` |
| **Purpose** | Settings navigation hub |
| **Information Displayed** | Settings categories list |
| **Actions Available** | Navigate to subsection |
| **Permission Rules** | Role-filtered categories |
| **Related Screens** | SET-02–SET-18 |

---

### SET-02 — Account

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/account` |
| **Purpose** | Profile and account identity |
| **Information Displayed** | Name; email; organization membership |
| **Actions Available** | Update profile; change email; delete account request |
| **Permission Rules** | Self |
| **Related Screens** | PRF-01 |

---

### SET-03 — Security Center

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/security` |
| **Purpose** | Account and org security |
| **Information Displayed** | Password; MFA; SSO status; active sessions link |
| **Actions Available** | Change password; enable MFA; revoke sessions |
| **Permission Rules** | Self; Admin for org SSO |
| **Related Screens** | PRF-02 |

---

### SET-03a — MFA Enrollment

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/security/mfa` |
| **Purpose** | Enroll multi-factor authentication |
| **User Goal** | Secure account per org policy |
| **Entry Paths** | SET-03; onboarding verification prompt; org enforcement redirect |
| **Exit Paths** | SET-03 success; CC-01 if onboarding complete |
| **Information Displayed** | MFA method options; setup instructions; backup codes notice |
| **Actions Available** | Enroll authenticator; verify code; skip only if org allows |
| **GIS Inheritance** | Full — UXMD-III |
| **GIS Overrides** | Error: invalid code retry; Recovery: backup code path; Success: security notification |
| **Permission Rules** | Self |
| **Related Screens** | PUB-04, SET-03, SHL-06 |

---

### SET-04 — Notifications Preferences

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/notifications` |
| **Purpose** | Control notification channels and categories |
| **Information Displayed** | Per-category toggles; quiet hours; email digest |
| **Actions Available** | Save preferences |
| **Related Screens** | Part G |

---

### SET-05 — Privacy

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/privacy` |
| **Purpose** | Data privacy controls |
| **Information Displayed** | Retention; export request; deletion request |
| **Actions Available** | Request export; request deletion |
| **Permission Rules** | Self; Admin org export |
| **Related Screens** | SET-15 |

---

### SET-06 — Appearance

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/appearance` |
| **Purpose** | Theme and density preferences |
| **Information Displayed** | Light / Dark / System; density |
| **Actions Available** | Select theme; preview behavior description |
| **Behavior** | Theme applies immediately; intelligence unchanged |
| **Related Screens** | Part K UXMD-I |

---

### SET-07 — Billing

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/billing` |
| **Purpose** | Subscription and payment |
| **Information Displayed** | Plan; usage; limits; invoices |
| **Actions Available** | Upgrade; downgrade; payment method; credits; cancel |
| **Permission Rules** | Owner+ |
| **Success State** | Plan updated — intelligence unchanged (PD-12) |
| **Error State** | Payment fail — retry |
| **Related Screens** | SYS-02 |

---

### SET-08 — Integrations

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/integrations` |
| **Purpose** | Connected services inventory |
| **Information Displayed** | Integrations; marketplace extensions; health |
| **Actions Available** | Connect; disconnect; configure |
| **Permission Rules** | Admin+ |
| **Related Screens** | MKT-03, SET-12 |

---

### SET-09 — Workspace Settings

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/workspace/:workspaceId` |
| **Purpose** | Workspace configuration hub |
| **Information Displayed** | Name; type; state; archive/delete |
| **Actions Available** | Edit; navigate subsections |
| **Permission Rules** | Manager+ edit; Owner delete |
| **Related Screens** | SET-10–SET-13, WKS-02/03 |

---

### SET-10 — Team Management

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/workspace/:workspaceId/team` |
| **Purpose** | Members and invites |
| **Information Displayed** | Roster; roles; pending invites |
| **Actions Available** | Invite; change role; remove |
| **Permission Rules** | Manager+ invite; Admin remove |
| **Related Screens** | PUB-07 |

---

### SET-11 — Data Sources Management

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/workspace/:workspaceId/sources` |
| **Purpose** | Source inventory and health |
| **Information Displayed** | Sources; status; freshness; errors |
| **Actions Available** | Connect new; disconnect; reconnect |
| **Permission Rules** | Member+ connect; Manager disconnect |
| **Empty State** | No sources — connect CTA |
| **Degraded State** | Per-source degraded badges |
| **Related Screens** | SET-12, ONB-04 |

---

### SET-12 — Data Source Connect

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/workspace/:workspaceId/sources/connect/:type` |
| **Purpose** | Authorize specific source type |
| **Information Displayed** | Type-specific fields; OAuth flow |
| **Success State** | Connected; initialization if first |
| **Error State** | Auth denied; invalid config |
| **Recovery State** | Retry OAuth; verify credentials |
| **Related Screens** | ONB-05, CC-01 |

---

### SET-13 — Goals and Projects

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/workspace/:workspaceId/goals` |
| **Purpose** | Goal and project hierarchy management |
| **Actions Available** | Add/edit/archive goals and projects |
| **Permission Rules** | Member+ |
| **Related Screens** | STR-05, CC-01 |

---

### SET-14 — Advanced / AI Controls

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/advanced` |
| **Purpose** | Bounded AI behavior preferences |
| **Information Displayed** | Cycle depth preference; challenge intensity (admin increase only) |
| **Prohibited** | Disable verification; disable challenge; confidence inflation |
| **Permission Rules** | Admin+ |
| **Related Screens** | SET-15, SET-16 |

---

### SET-15 — Memory Controls

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/memory` |
| **Purpose** | Memory retention and governance preferences |
| **Actions Available** | Retention settings; export; forget requests |
| **Permission Rules** | Admin+; Enterprise correction review |
| **Related Screens** | SET-05 |

---

### SET-16 — Automation Policies

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/automation-policies` |
| **Purpose** | Org-wide automation approval thresholds |
| **Information Displayed** | Cost thresholds; regulated domain gates |
| **Permission Rules** | Admin+ |
| **Related Screens** | AUT-05 |

---

### SET-17 — Organization Settings

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/organization` |
| **Purpose** | Org-wide governance |
| **Information Displayed** | Org name; policies; SSO; audit |
| **Permission Rules** | Admin+ |
| **Related Screens** | SET-03, SET-18 |

---

### SET-18 — Activity Log

| Field | Specification |
|-------|---------------|
| **Route** | `/app/settings/activity` |
| **Purpose** | Audit trail of significant actions |
| **Information Displayed** | User actions; intelligence events; admin events |
| **Permission Rules** | Manager+ workspace; Admin org |
| **Related Screens** | CC-01 activity feed (user-facing subset) |

---

### PRF-01 — Profile

| Field | Specification |
|-------|---------------|
| **Route** | `/app/profile` |
| **Purpose** | Quick profile access from utility menu |
| **Exit Paths** | SET-02; logout; PRF-02 |
| **Actions Available** | Edit profile; settings; logout |
| **Related Screens** | SET-02, PUB-03 |

---

### PRF-02 — Active Sessions

| Field | Specification |
|-------|---------------|
| **Route** | `/app/profile/sessions` |
| **Purpose** | Session security management |
| **Actions Available** | Revoke session |
| **Related Screens** | SET-03 |

---

### SUP-01 — Help Center

| Field | Specification |
|-------|---------------|
| **Route** | `/app/help` |
| **Purpose** | Self-service support hub |
| **Information Displayed** | Search; popular topics; contact options |
| **Actions Available** | Search; FAQ; docs; contact; report bug; chat |
| **Permission Rules** | Authenticated |
| **Related Screens** | SUP-02–SUP-10 |

---

### SUP-02 — Documentation

| Field | Specification |
|-------|---------------|
| **Route** | `/app/help/docs` |
| **Purpose** | Product documentation browse |
| **Related Screens** | SUP-03 |

---

### SUP-03 — Documentation Article

| Field | Specification |
|-------|---------------|
| **Route** | `/app/help/docs/:slug` |
| **Purpose** | Read help article |
| **Support Entry** | Related articles; contact if unresolved |

---

### SUP-04 — FAQ

| Field | Specification |
|-------|---------------|
| **Route** | `/app/help/faq` |
| **Purpose** | Quick answers |

---

### SUP-05 — Contact Support

| Field | Specification |
|-------|---------------|
| **Route** | `/app/help/contact` |
| **Purpose** | Human support ticket |
| **Information Displayed** | Category; description; auto-captured context |
| **Success State** | Ticket created — SUP-08 |
| **Notifications Triggered** | Ticket updates |

---

### SUP-06 — Report Bug

| Field | Specification |
|-------|---------------|
| **Route** | `/app/help/report-bug` |
| **Purpose** | Engineering defect report |
| **Information Displayed** | Reproduction; auto context |
| **Related Screens** | SUP-08 |

---

### SUP-07 — Report Intelligence Inaccuracy

| Field | Specification |
|-------|---------------|
| **Route** | overlay |
| **Purpose** | Priority inaccuracy with artifact chain |
| **Entry Paths** | Any intelligence element |
| **Information Displayed** | Linked artifact; user description |
| **Success State** | Submitted — E2 signal |
| **Related Screens** | CC-08, SUP-08 |

---

### SUP-08 — Support Ticket Detail

| Field | Specification |
|-------|---------------|
| **Route** | `/app/help/tickets/:id` |
| **Purpose** | Track support resolution |
| **Information Displayed** | Status; thread; SLA indicator |
| **Actions Available** | Reply; escalate; close |

---

### SUP-09 — Incident Status

| Field | Specification |
|-------|---------------|
| **Route** | `/app/help/status` |
| **Purpose** | Platform incident transparency |
| **Information Displayed** | Current incidents; history |

---

### SUP-10 — Support AI Chat

| Field | Specification |
|-------|---------------|
| **Route** | overlay |
| **Purpose** | Product usage help — NOT Ask Conquest |
| **Behavior** | Escalates to human if unresolved |
| **Related Screens** | SUP-05 |

---

### WKS-01 — Workspace Create (in-app)

| Field | Specification |
|-------|---------------|
| **Route** | `/app/workspaces/new` |
| **Purpose** | Additional workspace beyond onboarding |
| **Same behavior as** | ONB-03 |
| **Related Screens** | CC-01 |

---

### WKS-02 / WKS-03 — Archive / Delete Confirm

| Field | Specification |
|-------|---------------|
| **Route** | overlay |
| **Purpose** | Governed destructive actions |
| **Permission Rules** | Owner only |
| **Success State** | Workspace archived or deleted per policy |

---

### SHL-02 — Workspace Selector Panel

| Field | Specification |
|-------|---------------|
| **Route** | overlay |
| **Purpose** | Switch workspace context |
| **Information Displayed** | Recent workspaces; org grouping; create new |
| **Actions Available** | Switch; create workspace |
| **Success State** | Command Center reloads scoped state |
| **Mobile Behavior** | Full-screen sheet |

---

### SHL-03 — Notification Panel

| Field | Specification |
|-------|---------------|
| **Route** | overlay |
| **Purpose** | Priority-ordered notification list |
| **Information Displayed** | P0–P4 notifications; unread state |
| **Actions Available** | Open target; mark read; dismiss |
| **Mobile Behavior** | Full-screen sheet from top |

---

### SHL-04 — Profile Menu

| Field | Specification |
|-------|---------------|
| **Route** | overlay |
| **Actions Available** | Profile; settings; help; logout |
| **Mobile Behavior** | Bottom sheet or dropdown |

---

### SHL-05 — Global Search

| Field | Specification |
|-------|---------------|
| **Route** | overlay |
| **Purpose** | Cross-module search |
| **Scope** | Knowledge; reports; automations; help docs; intelligence elements |
| **Empty State** | No results — suggestions |
| **Mobile Behavior** | Full-screen search |

---

### SHL-06 — Session Expired

| Field | Specification |
|-------|---------------|
| **Route** | `/session-expired` |
| **Purpose** | Auth recovery |
| **Exit Paths** | Login with return URL |
| **Related Screens** | PUB-03 |

---

### SYS-01 — Permission Denied

| Field | Specification |
|-------|---------------|
| **Purpose** | Clear denial — no broken UI |
| **Information Displayed** | Missing permission; contact admin |
| **Recovery State** | Return; request access |

---

### SYS-02 — Plan Limit Reached

| Field | Specification |
|-------|---------------|
| **Purpose** | Upgrade path |
| **Exit Paths** | SET-07 billing |
| **Recovery State** | Upgrade or reduce usage |

---

### SYS-03 — Maintenance Notice

| Field | Specification |
|-------|---------------|
| **Route** | `/maintenance` |
| **Purpose** | Platform maintenance communication |

---

### SYS-04 — Not Found

| Field | Specification |
|-------|---------------|
| **Route** | `/404` |
| **Exit Paths** | Command Center; Help |

---

# PART C — NAVIGATION SPECIFICATION

## C.1 Primary Sidebar (Desktop)

| Behavior | Specification |
|----------|---------------|
| **Default state** | Expanded — icons + labels |
| **Collapsed state** | User toggle — icons only; tooltips on hover (behavioral) |
| **Persistence** | Collapse preference saved per user |
| **Active item** | Current module highlighted |
| **Home** | Command Center always first |
| **Role filter** | Hidden items not shown — not disabled ghost items |
| **Keyboard** | Arrow navigate; Enter activate |

## C.2 Mobile Navigation Drawer

| Behavior | Specification |
|----------|---------------|
| **Trigger** | Hamburger or bottom nav primary |
| **Content** | Same 7 items as desktop |
| **Workspace** | Selector at top of drawer |
| **Close** | Route change auto-closes |
| **Gesture** | Swipe to close drawer |

## C.3 Bottom Navigation (Mobile Alternative)

| Behavior | Specification |
|----------|---------------|
| **Items** | Command Center; Reports; Automation; More (drawer for remaining) |
| **Rationale** | Thumb reach for primary daily actions |
| **More drawer** | Knowledge; Strategy; Marketplace; Settings |

## C.4 Breadcrumb Behavior

| Context | Behavior |
|---------|----------|
| **Module root** | Module name only |
| **Detail screens** | Module → Entity type → Name |
| **Settings** | Settings → Section |
| **Mobile** | Collapsed to back + title |
| **Click** | Each segment navigates |

## C.5 Workspace Switching Behavior

| Step | Behavior |
|------|----------|
| Open selector | SHL-02 |
| Select workspace | Immediate context switch |
| Loading | Command Center reload with scoped state |
| Failure | Error toast; remain on prior workspace |
| Create new | WKS-01 or ONB-03 flow |

## C.6 Notification Panel Behavior

| Behavior | Specification |
|----------|---------------|
| **Open** | Badge count on utility bar |
| **Order** | P0 first — strict priority |
| **Action** | Tap navigates to target screen with context |
| **Dismiss** | Swipe or dismiss; P0 requires confirm optional reason |
| **Mark all read** | Available |
| **Empty** | "No notifications" |

## C.7 Profile Menu Behavior

| Item | Action |
|------|--------|
| Profile | PRF-01 |
| Settings | SET-01 |
| Help | SUP-01 |
| Theme quick toggle | Cycles Light/Dark only — System in Appearance |
| Logout | Confirm; redirect login |

## C.8 Theme Switch Behavior

| Context | Behavior |
|---------|-------|
| Settings Appearance | Full Light/Dark/System |
| Quick toggle | Light ↔ Dark |
| Apply | Immediate; no reload required |
| Intelligence | Unchanged |

## C.9 Search Behavior

| Scope | Results lead to |
|-------|-----------------|
| Knowledge | KNW-03 |
| Reports | RPT-03 |
| Automations | AUT-03 |
| Help | SUP-03 |
| Intelligence | CC-04, STR-*, CC-06 as appropriate |

## C.10 Deep Link Behavior

| Link type | Behavior |
|-----------|----------|
| Authenticated | Open target if permitted |
| Unauthenticated | Login with return URL |
| Wrong workspace | Prompt switch or deny |
| Expired invite | PUB-07 error state |

---

# PART D — AUTHENTICATION EXPERIENCE

## D.1 Complete Lifecycle Map

| Stage | Screen(s) | Success exit | Failure recovery |
|-------|-----------|--------------|------------------|
| Visitor | PUB-01 | PUB-02 or PUB-03 | — |
| Registration | PUB-02 | PUB-04 | Inline validation; login if exists |
| Verification | PUB-04 | ONB-01 | Resend link |
| Onboarding | ONB-01–06 | CC-01 Ready | Skip paths documented per screen |
| Workspace | ONB-03, WKS-01 | ONB-04 or CC-01 Dormant | Plan limit → SYS-02 |
| Data connection | ONB-04, SET-12 | ONB-05 | Retry OAuth |
| First intelligence | ONB-05 | ONB-06 | Sparse data honest state |
| First report | RPT-07, RPT-02 | RPT-03 | VRF fail retry |
| Retention | CC-01 daily | Ongoing | Re-onboarding offer |
| Power user | STR-*, AUT-* | Depth usage | Support escalation |

## D.2 Session Behavior

| Event | Experience |
|-------|------------|
| Login success | Route per account state |
| Session resume | Silent if valid |
| Session expiry | SHL-06; preserve return URL |
| New device | Security notification if enabled |
| Logout | Confirm; clear client state; PUB-03 |

## D.3 SSO (Enterprise)

| Step | Behavior |
|------|----------|
| SSO button on login | Redirect IdP |
| Success | Same routing as password login |
| Failure | Clear error; fallback login |

## D.4 Invite Flow

| User state | Path |
|------------|------|
| New | PUB-07 → PUB-02 → verify → abbreviated ONB → CC-01 orientation |
| Existing | PUB-07 → PUB-03 → CC-01 orientation |

---

# PART E — SETTINGS EXPERIENCE

## E.1 Settings Navigation Model

Settings Home (SET-01) lists categories filtered by role. Each section is independent — save per section where applicable.

## E.2 Section Behavioral Summary

| Section | Primary user job | Key actions | Restrictions |
|---------|------------------|-------------|--------------|
| **Account** | Manage identity | Update profile, email | Self only |
| **Security** | Protect account | MFA, password, sessions | Cannot weaken org SSO |
| **Notifications** | Control attention | Category toggles, quiet hours | P0 may override quiet for critical |
| **Privacy** | Data control | Export, deletion request | Governed timelines |
| **Appearance** | Comfort | Theme, density | No intelligence change |
| **Billing** | Manage spend | Plan, payment, invoices | Owner only; PD-12 |
| **Integrations** | Connected services | Connect, disconnect | Admin+ |
| **Workspace** | Scope config | Name, type, archive | Manager+ |
| **Team** | Collaboration | Invite, roles | Manager+ invite |
| **Advanced** | AI bounds | Depth preference | Cannot disable VRF/CHL |
| **Memory** | Retention | Export, forget request | Admin+ |
| **Automation policies** | Governance | Thresholds | Admin+ |
| **Organization** | Org governance | SSO, policies | Admin+ |
| **Activity log** | Audit | View | Manager+/Admin |

## E.3 Settings Save Behavior

| Result | Experience |
|--------|------------|
| Success | Inline confirmation |
| Failure | Specific error; values preserved |
| Destructive | Confirmation overlay required |

---

# PART F — SUPPORT EXPERIENCE

## F.1 Support Hierarchy

```
Help Center Search / FAQ
   ↓ unresolved
Documentation Article
   ↓ unresolved
Support AI Chat (product help only)
   ↓ unresolved
Contact Support (human ticket)
   ↓ critical
Escalation per plan SLA
```

## F.2 Channel Purposes

| Channel | For | Not for |
|---------|-----|---------|
| FAQ | Quick product questions | Intelligence analysis |
| Documentation | How-to | Account-specific data |
| Support AI | Navigation, usage | "Why are sales dropping?" |
| Ask Conquest | Intelligence | Billing disputes |
| Contact Support | Account, bugs, persistent issues | — |
| Report Inaccuracy | Wrong intelligence | UI preferences |
| Report Bug | Defects | Intelligence disagreement |
| Incident Status | Platform outages | — |

## F.3 Auto-Captured Context

Every support submission from authenticated app includes: user ID; org; workspace; current screen; artifact ID if intelligence-related; timestamp.

## F.4 Escalation SLAs

| Plan | First response |
|------|----------------|
| Starter | 48h |
| Professional | 24h |
| Business | 8h |
| Enterprise | 4h |

## F.5 Recovery Flows

| Issue type | Recovery path |
|------------|---------------|
| Cannot connect source | SET-12 guided + SUP-01 article |
| Intelligence seems wrong | SUP-07 inaccuracy → E3 if user correction |
| Automation failed | AUT-04 log → rollback → SUP-05 |
| Locked out | PUB-05 → SET-03 MFA recovery → Support |
| Billing dispute | SET-07 → SUP-05 billing category |

---

# PART G — NOTIFICATION EXPERIENCE

## G.1 Categories and Priority

| Priority | Category | Default channel | User can disable |
|----------|----------|-----------------|------------------|
| P0 | Critical alerts | In-app + push | No |
| P1 | Recommendations pending | In-app + push | Partial |
| P2 | Warnings (degraded, stale) | In-app | Yes |
| P3 | Reminders | In-app + email opt-in | Yes |
| P4 | Informational | In-app | Yes |

## G.2 Delivery Channels

| Channel | Behavior |
|---------|----------|
| In-app | SHL-03 panel + badge |
| Email | Opt-in per category; digest option |
| Push | P0–P1 only; opt-in |

## G.3 User Controls (SET-04)

Per-category toggles; quiet hours; email digest frequency. P0 critical may break quiet hours with user acknowledgment at onboarding.

## G.4 Reminder System

| Reminder | Trigger screen |
|----------|----------------|
| Deferred recommendation | CC-04 defer date |
| Scheduled report ready | RPT-03 |
| Stale source | SET-11 → SET-12 |
| Initiative milestone | STR-05 |

## G.5 Escalation Rules

| Condition | Escalation |
|-----------|------------|
| P0 unacknowledged 1h | Repeat push |
| Automation critical failure | P0 + email if enabled |
| Support ticket SLA breach | Auto-escalate tier |

---

# PART H — STATE ARCHITECTURE

> **Superseded by UXMD Volume III Part 1** for global state standards. This section retains Command Center–specific state matrix only. All other screens inherit GIS §1.

## H.1 Universal State Definitions

See UXMD-III GIS Part 1 (GIS-S1 through GIS-S10).

| State | User sees | Duration | Transitions to |
|-------|-----------|----------|----------------|
| **Success** | Expected outcome + confirmation if non-obvious | Permanent until change | — |
| **Loading** | Plain-language progress; skeleton for content areas | Until complete | Success, Error, Empty |
| **Empty** | Honest explanation + primary CTA | Until data exists | Loading, Success |
| **Error** | Specific failure message | Until recovery | Recovery, Loading |
| **Recovery** | Actionable next steps | User-initiated | Loading, Success |
| **Offline** | Banner + last verified snapshot timestamp | Until online | Loading |

## H.2 State Rules (All Screens)

| Rule | Requirement |
|------|-------------|
| No false success | Never show unverified intelligence as success |
| No silent error | Every failure visible or logged with user notice if impactful |
| Preserve input | Forms retain values on recoverable error |
| Loading language | Plain language — never system IDs |
| Empty honesty | BH-8 — no fabricated content |
| Degraded ≠ error | Degraded is partial capability with notice |

## H.3 Command Center State Matrix

| Workspace state | CC-01 display |
|-----------------|---------------|
| Dormant | Empty + connect |
| Initializing | Loading primary |
| Ready | Success full |
| Awaiting Decision | Success + P1 emphasis |
| Degraded | Partial success + zone notices |
| Processing | Success snapshot + refresh indicator |
| Paused | Read-only notice |

## H.4 Authentication State Matrix

| State | Screen |
|-------|--------|
| Unauthenticated | Public routes only |
| Authenticated unverified | PUB-04 |
| Authenticated onboarding incomplete | ONB-* |
| Authenticated complete | App shell |
| Session expired | SHL-06 |

---

# PART I — MOBILE EXPERIENCE

## I.1 Mobile Principle

Mobile is **behavioral adaptation** — not shrunk desktop. Priority and thumb reach govern layout decisions.

## I.2 What Changes on Mobile

| Desktop | Mobile |
|---------|--------|
| Persistent sidebar | Drawer or bottom nav |
| Multi-column Command Center | Stacked P0→P1 first |
| Side-by-side report compare | Sequential selection |
| Hover tooltips | Long-press or inline labels |
| Wide tables | Card lists |
| Keyboard shortcuts | Not available — touch actions |

## I.3 What Disappears on Mobile

| Element | Mobile behavior |
|---------|-----------------|
| Collapsed sidebar labels | Icons only in bottom nav |
| Secondary KPI columns | Behind "view all" |
| Breadcrumb full path | Back + title |
| Multi-panel Strategy views | Tabbed sections |

## I.4 Drawers and Sheets

| Component | Mobile pattern |
|-----------|----------------|
| Navigation | Left drawer or bottom nav |
| Workspace selector | Full-screen sheet |
| Notifications | Full-screen sheet |
| Ask Conquest | Full-screen sheet |
| Correction | Bottom sheet |
| Filters | Bottom sheet |
| Profile menu | Bottom sheet |

## I.5 Swipe Actions

| Context | Swipe |
|---------|-------|
| Notification list | Dismiss |
| Recommendation card | Defer (optional) |
| Automation list | Pause (Manager+) |

## I.6 Mobile-Specific Journeys

| Journey | Mobile note |
|---------|-------------|
| Onboarding | Single-column; larger touch targets |
| Data OAuth | System browser return |
| Report PDF export | Share sheet native |
| First report | Milestone overlay full-screen |

## I.7 Mobile Limitations (Explicit)

| Task | Mobile | Desktop preferred |
|------|--------|-------------------|
| Approve recommendation | Supported | Either |
| Automation builder complex | Supported simplified | Preferred |
| Report comparison | Supported sequential | Preferred side-by-side |
| Strategy initiative board | Supported tabbed | Preferred |

---

# PART J — FIRST-TIME USER EXPERIENCE (FTUE)

## J.1 FTUE Milestone Map

| Milestone | Screen | Success indicator | Recovery if skipped |
|-----------|--------|-------------------|---------------------|
| **First visit** | PUB-01 | Signup or login | — |
| **First registration** | PUB-02 | Account created | Validation recovery |
| **First login** | PUB-03 | Enter app | Password recovery |
| **First workspace** | ONB-03 | Workspace exists | WKS-01 later |
| **First data connection** | SET-12 / ONB-04 | Source connected | Dormant CC-01 prompts |
| **First intelligence** | ONB-05 → CC-01 | Ready state populated | Honest sparse state |
| **First report** | RPT-07 → RPT-03 | Snapshot created | Prompt in Reports empty |
| **First recommendation decision** | CC-04 | D7 recorded | Recommendations remain queued |
| **First saved report** | RPT-03 export or history | Report in RPT-01 | — |
| **First automation** | AUT-02 → AUT-05 → AUT-03 | First run approved | Prompt from approved rec |
| **Power user transition** | STR-01 + AUT-01 + MKT-01 | Multi-module depth usage | Progressive discovery hints |

## J.2 FTUE Guidance Rules

| Rule | Behavior |
|------|----------|
| Maximum 4 onboarding beats | No tutorial overload |
| No machinery names | Plain language only |
| Skippable after first workspace | Except verification |
| Re-offer incomplete milestones | Contextual prompts not nagging |
| Milestone celebrations | Subtle — ONB-06, RPT-07 — not gamification theater |

## J.3 Abbreviated FTUE (Invited Member)

| Step | Screen |
|------|--------|
| Accept invite | PUB-07 |
| Login or register | PUB-03 or PUB-02 |
| Abbreviated orientation | Overlay on CC-01 |
| Begin | CC-01 scoped to role |

## J.4 Power User Transition Signals

| Signal | Unlocked experience |
|--------|---------------------|
| 3+ recommendation decisions | Automation prompt emphasis |
| 2+ reports generated | Schedule prompt |
| 5+ Ask Conquest uses | Strategy Center depth hint |
| Manager role | Marketplace, team management |
| 30+ days active | Memory insights emphasis |

---

# PART K — ROUTE AND PERMISSION MODEL

## K.1 Route Guards (Behavioral)

| Guard | Redirect |
|-------|----------|
| Unauthenticated → app | PUB-03 + return URL |
| Unverified → app | PUB-04 |
| Onboarding incomplete | ONB-* resume point |
| No workspace | ONB-03 or WKS-01 |
| Wrong role | SYS-01 |
| Plan limit | SYS-02 |

## K.2 Permission Matrix (Summary)

| Screen group | Viewer | Member | Manager | Admin | Owner |
|--------------|--------|--------|---------|-------|-------|
| Command Center read | ✓ | ✓ | ✓ | ✓ | ✓ |
| Recommendations act | — | ✓ | ✓ | ✓ | ✓ |
| Automation | — | ✓ | ✓ | ✓ | ✓ |
| Marketplace install | — | — | ✓ | ✓ | ✓ |
| Settings full | — | limited | ✓ | ✓ | ✓ |
| Billing | — | — | — | — | ✓ |
| Team invite | — | — | ✓ | ✓ | ✓ |
| Workspace delete | — | — | — | — | ✓ |

---

# PART L — APPROVAL CRITERIA FOR UXMD VOLUME II

UXMD Volume II is complete when:

- [x] All 102 screens inventoried
- [x] Six review-gap screens added (CC-11–CC-15, SET-03a)
- [x] GIS inheritance rule documented
- [x] Navigation behavior specified
- [x] Authentication lifecycle unambiguous
- [x] All settings sections defined
- [x] Support hierarchy and escalation defined
- [x] Notification system complete (via GIS §5)
- [x] State architecture references UXMD-III
- [x] Mobile behavioral spec via GIS §4
- [x] FTUE milestones mapped to screens
- [x] Permission model via GIS §2
- [x] No UI design, colors, CSS, APIs, databases

---

# PART M — DOCUMENT SEQUENCE (LOCKED)

```
✅ CCIS → ✅ AMD I–IV → ✅ PDD I–II → ✅ UXMD I → ✅ UXMD III (GIS) → 🔵 UXMD II v1.1
⬜ UXMD Final Review (re-run)
⬜ UXMD Approval (I + II + III)
⬜ SDD Volume I
⬜ SDD Review → Data Architecture → Supabase → UI Design System → Build
```

**SDD Volume I does not begin until UXMD Volume II is reviewed and approved.**

---

*End of UXMD Volume II — Screen and Interaction Specification v1.0*
