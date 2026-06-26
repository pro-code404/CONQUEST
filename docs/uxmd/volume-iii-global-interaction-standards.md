# UXMD VOLUME III — GLOBAL INTERACTION STANDARDS (GIS)

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | UXMD Volume III — Global Interaction Standards |
| **Abbreviation** | UXMD-III / GIS |
| **Status** | Global Standards Authority — Inherited by all screens |
| **Version** | 1.0 |
| **Supreme Authority** | CCIS |
| **Subordinate To** | CCIS, AMD I–IV, PDD I–II, UXMD Volume I |
| **Inherited By** | UXMD Volume II (all screens), UXMD Volume I (where referenced) |
| **Precedes** | SDD Volume I (only after full UXMD approval) |

### Mission

Establish **universal behavioral standards** inherited by every screen in UXMD Volume II. GIS eliminates duplication while ensuring architectural consistency across the entire product.

| Document | Question |
|----------|----------|
| UXMD Volume I | How should Conquest feel? |
| UXMD Volume II | What does every screen do? |
| **UXMD Volume III** | **What standards does every screen inherit?** |

### Inheritance Rule

Unless a UXMD-II screen specification contains an explicit **GIS Override** field, all behaviors defined in this document apply automatically. Screen specs declare only **screen-specific** behavior plus overrides.

### Strict Prohibitions

No UI design, colors, CSS, components, databases, APIs, or implementation.

---

# PART 1 — GLOBAL STATE INHERITANCE

## 1.1 State Taxonomy

Every screen exists in exactly one primary state at a time. Sub-states (e.g. zone-level degraded within Ready) are additive, not replacements.

| State | Code | Definition |
|-------|------|------------|
| **Loading** | `S-LOAD` | Work in progress; content not yet authoritative |
| **Empty** | `S-EMPTY` | No data exists; honest — never fabricated |
| **Success** | `S-SUCCESS` | Expected content available and authoritative |
| **Error** | `S-ERROR` | Operation or load failed |
| **Recovery** | `S-RECOVER` | User-directed path out of error |
| **Offline** | `S-OFFLINE` | Network unavailable; cached content only |

## 1.2 Universal State Rules

| Rule ID | Rule |
|---------|------|
| **GIS-S1** | Never show unverified intelligence as Success |
| **GIS-S2** | Empty must include honest explanation + primary CTA where applicable |
| **GIS-S3** | Error messages must be specific — never "something went wrong" alone |
| **GIS-S4** | Recovery must offer at least one actionable next step |
| **GIS-S5** | Loading uses plain language — never system IDs or agent names |
| **GIS-S6** | Offline shows last verified snapshot + timestamp + banner |
| **GIS-S7** | Degraded is not Error — partial capability with explicit notice |
| **GIS-S8** | Form input preserved on recoverable Error |
| **GIS-S9** | Success confirmation required for destructive or irreversible actions |
| **GIS-S10** | State transitions must be visible — no silent jumps |

## 1.3 Loading State Standard (`S-LOAD`)

| Element | Behavior |
|---------|----------|
| **Indicator** | Skeleton for content areas OR plain-language status text |
| **Language** | User-facing progress: "Loading intelligence…", "Connecting…", "Generating report…" |
| **Duration** | Show progress escalation after 10s: "Still working…" |
| **Timeout** | At 60s: offer Retry + Support link |
| **Interaction** | Non-destructive navigation allowed unless operation is modal-critical |
| **Prohibited** | Fake progress; agent names; pipeline stage names |

## 1.4 Empty State Standard (`S-EMPTY`)

| Element | Behavior |
|---------|----------|
| **Message** | Honest explanation of why empty |
| **CTA** | Single primary action when user can resolve (e.g. "Connect a data source") |
| **Secondary** | Help link when user may not know how to proceed |
| **Prohibited** | Fabricated sample data; placeholder intelligence; lorem ipsum metrics |
| **Dormant workspace** | "Connect a data source to activate intelligence" |

## 1.5 Success State Standard (`S-SUCCESS`)

| Element | Behavior |
|---------|----------|
| **Content** | Authoritative per screen purpose |
| **Confirmation** | Inline confirmation for mutations: "Saved", "Correction recorded" |
| **Destructive success** | Explicit acknowledgment: "Workspace archived" |
| **Intelligence** | Confidence labels on all major outputs |
| **Freshness** | Timestamp on time-sensitive content |

## 1.6 Error State Standard (`S-ERROR`)

| Element | Behavior |
|---------|----------|
| **Message** | What failed + why (when known) |
| **Scope** | Field-level for forms; screen-level for loads |
| **Classification** | User-recoverable vs system failure |
| **Support** | Persistent failures link to Support with context |
| **Prohibited** | Stack traces; internal error codes exposed to user |

## 1.7 Recovery State Standard (`S-RECOVER`)

| Element | Behavior |
|---------|----------|
| **Actions** | Retry; correct input; alternate path; contact admin; Support |
| **Preservation** | User input retained where applicable |
| **Escalation** | After 2 failed retries: suggest Support |
| **Irreversible block** | Clear reason + who can authorize |

## 1.8 Offline State Standard (`S-OFFLINE`)

| Applicability | Screens with live or cached intelligence content |

| Element | Behavior |
|---------|----------|
| **Banner** | "You are offline. Showing last verified data from [timestamp]." |
| **Content** | Last verified snapshot only |
| **Actions** | Read allowed; mutations queued or blocked with notice |
| **Reconnect** | Auto-resume on connectivity; refresh prompt |
| **Prohibited** | Silent stale data without offline notice |

## 1.9 Module State Profiles

Screens inherit module defaults unless overridden:

| Module | Default Empty | Default Loading | Default Offline |
|--------|---------------|-----------------|-----------------|
| **Public** | N/A | Form submit | Block submit |
| **Command Center** | Dormant CTA | Zone skeletons | Cached snapshot |
| **Reports** | Generate CTA | Generation progress | Cached if viewed |
| **Automation** | Create CTA | List load | Read-only list |
| **Knowledge** | Upload CTA | Search/upload | Cached articles |
| **Strategy** | Await intelligence | Detail load | Cached detail |
| **Marketplace** | Browse categories | Install progress | Browse cached catalog |
| **Settings** | N/A | Section load | Read settings; block save |
| **Support** | Search suggestions | Ticket submit | Read help; queue ticket |

---

# PART 2 — PERMISSION INHERITANCE

## 2.1 Role Hierarchy

```
Owner > Admin > Manager > Member > Viewer
```

Higher roles inherit all lower-role capabilities unless explicitly restricted.

## 2.2 Role Definitions

| Role | Default capability |
|------|-------------------|
| **Viewer** | Read intelligence; export per policy; no mutations |
| **Member** | Viewer + act on recommendations; create automations; upload knowledge |
| **Manager** | Member + invite members; approve threshold automations; full workspace settings |
| **Admin** | Manager + org settings; marketplace install; integrations; SSO |
| **Owner** | Admin + billing; workspace delete; org ownership transfer |

## 2.3 Module Permission Defaults

| Module | Viewer | Member | Manager | Admin | Owner |
|--------|--------|--------|---------|-------|-------|
| Command Center read | ✓ | ✓ | ✓ | ✓ | ✓ |
| Recommendation act | — | ✓ | ✓ | ✓ | ✓ |
| Ask Conquest submit | — | ✓ | ✓ | ✓ | ✓ |
| Correction submit | — | ✓ | ✓ | ✓ | ✓ |
| Reports view/export | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reports delete | — | — | ✓ | ✓ | ✓ |
| Automation view | — | ✓ | ✓ | ✓ | ✓ |
| Automation create | — | ✓ | ✓ | ✓ | ✓ |
| Automation approve threshold | — | — | ✓ | ✓ | ✓ |
| Knowledge read | ✓ | ✓ | ✓ | ✓ | ✓ |
| Knowledge upload | — | ✓ | ✓ | ✓ | ✓ |
| Strategy read | ✓ | ✓ | ✓ | ✓ | ✓ |
| Strategy initiative edit | — | ✓ | ✓ | ✓ | ✓ |
| Marketplace browse | ✓ | ✓ | ✓ | ✓ | ✓ |
| Marketplace install | — | — | ✓ | ✓ | ✓ |
| Settings account | self | self | self | self | self |
| Settings workspace | — | limited | ✓ | ✓ | ✓ |
| Settings org/billing | — | — | — | ✓ | ✓ |
| Billing | — | — | — | — | ✓ |

## 2.4 Screen Override Syntax

UXMD-II screens use:

```
GIS Inherit: PERM-[MODULE]-[ACTION]
GIS Override: [explicit rule]
```

Example: `GIS Inherit: PERM-CC-READ` + `GIS Override: Member+ for approve actions`

## 2.5 Route Guards (Global)

| Guard | Redirect | Message |
|-------|----------|---------|
| Unauthenticated | `/login` + return URL | — |
| Unverified email | `/verify-email` | Complete verification |
| Onboarding incomplete | `/onboarding` resume | — |
| No workspace | `/onboarding/workspace` or `/app/workspaces/new` | — |
| Wrong role | `SYS-01` | Missing permission; contact admin |
| Plan limit | `SYS-02` | Upgrade path |

## 2.6 Escalation Rules

| Situation | Escalation |
|-----------|------------|
| Member needs Admin action | "Contact your workspace admin" + name if visible |
| Manager needs Owner action | "Contact workspace owner" |
| Irreversible blocked | Explicit authorization holder identified |
| Enterprise SSO required | Redirect to org admin |

## 2.7 Prohibited Permissions

No role may:

- Disable verification (BH-5)
- Disable challenge for major conclusions
- Force confidence inflation
- Bypass irreversible action confirmation
- Browse raw memory stores

---

# PART 3 — ACCESSIBILITY STANDARDS

## 3.1 Commitment

**WCAG 2.2 Level AA** behavioral target for all user-facing experiences.

## 3.2 Keyboard Navigation

| Requirement | Standard |
|-------------|----------|
| **Full navigation** | All primary flows completable without pointer |
| **Tab order** | Logical; matches visual priority on Command Center |
| **Focus visible** | Focus indicator on all interactive elements |
| **Skip link** | Skip to main content on app shell |
| **Modals** | Focus trap; Escape closes non-destructive modals |
| **Destructive modals** | Escape does not confirm — requires explicit action |
| **Shortcuts** | `?` opens keyboard help overlay (future) |

## 3.3 Screen Reader Behavior

| Content | Announcement |
|---------|--------------|
| **Page title** | Screen purpose on navigation |
| **Confidence** | "Confidence: [band]" before claim |
| **Prediction** | "Prediction:" prefix before forecast |
| **Alert P0** | "Critical alert:" prefix |
| **State change** | Live region: loading complete, new alert, recommendation added |
| **Form errors** | Associated with field; announced on submit |
| **Success mutation** | "Correction recorded" etc. via live region |

## 3.4 Focus Management

| Event | Focus behavior |
|-------|----------------|
| Route change | Move to main heading |
| Modal open | Focus first interactive element |
| Modal close | Return focus to trigger |
| Error on submit | Focus first invalid field |
| New P0 alert | Optional focus — never steal from active input |

## 3.5 Reduced Motion

| Preference | Behavior |
|------------|----------|
| `prefers-reduced-motion: reduce` | No decorative animation |
| State transitions | Instant or minimal fade (≤150ms) |
| Real-time updates | Content swap without motion |
| Loading | Static indicator acceptable |

## 3.6 Contrast Requirements (Behavioral)

| Element | Requirement |
|---------|-------------|
| **Text** | Readable on all theme backgrounds |
| **Confidence bands** | Not conveyed by color alone — text label required |
| **Alert priority** | P0 uses text + icon — not color alone |
| **Degraded/stale** | Text label always present |
| **Links** | Distinguishable from body text without color alone |

## 3.7 Accessible Error Messaging

| Rule | Standard |
|------|----------|
| **Association** | Error linked to field programmatically |
| **Clarity** | Plain language; how to fix |
| **Multiple errors** | Summary at top + field-level |
| **Persistence** | Errors remain until resolved or dismissed |
| **Icon** | Decorative icons marked aria-hidden; text carries meaning |

## 3.8 Intelligence Accessibility

| Output | Requirement |
|--------|-------------|
| Recommendations | Structured headings; confidence announced |
| Evidence viewer | Navigable list of sources |
| KPI values | Value + trend direction in text |
| Charts (future UI) | Data table alternative required in UXMD-II screen |

---

# PART 4 — MOBILE ADAPTATION STANDARDS

## 4.1 Breakpoint Behavior (Conceptual)

| Context | Behavior |
|---------|----------|
| **Desktop** | Sidebar nav; multi-column Command Center |
| **Mobile** | Bottom nav + drawer; stacked priority zones |
| **Tablet** | Inherits mobile nav unless landscape + width threshold — collapsible sidebar |

*Exact breakpoints — UI Design System. GIS defines behavioral split only.*

## 4.2 Navigation (Mobile)

| Element | Mobile behavior |
|---------|-----------------|
| **Primary nav** | Bottom bar: Command Center, Reports, Automation, More |
| **More drawer** | Knowledge, Strategy, Marketplace, Settings |
| **Workspace selector** | Top bar; full-screen sheet on tap |
| **Back** | System back returns one level; exits app from CC home |

## 4.3 Drawer Patterns

| Drawer | Trigger | Content | Close |
|--------|---------|---------|-------|
| **Nav drawer** | Hamburger / More | Full nav list | Route change or swipe |
| **Workspace sheet** | Workspace selector | Switch list + create | Selection or dismiss |
| **Notification sheet** | Bell icon | Priority-ordered list | Dismiss |
| **Filter sheet** | Filter action | Filter controls | Apply or cancel |

## 4.4 Bottom Sheet Patterns

| Sheet | Use |
|-------|-----|
| **Correction** | CC-08 |
| **Quick actions** | Recommendation defer/dismiss |
| **Profile menu** | SHL-04 |
| **Share/export** | Report actions |

## 4.5 Responsive Layout Rules

| Zone | Mobile |
|------|--------|
| Command Center P0–P1 | Always visible first |
| Lower zones | Collapsed sections; expand on tap |
| Tables | Card list transformation |
| Side-by-side compare | Sequential steps |
| Settings | Single column |

## 4.6 Gesture Behavior

| Gesture | Context | Action |
|---------|---------|--------|
| **Swipe dismiss** | Notification item | Dismiss with optional reason |
| **Swipe defer** | Recommendation card | Defer (Member+) |
| **Pull refresh** | Command Center | Request freshness check |
| **Long press** | — | Not used for primary actions |

## 4.7 Mobile Offline

Same as GIS §1.8. Mutations blocked with queue notice. OAuth uses system browser.

## 4.8 Mobile-Specific Prohibitions

- No hover-only actions
- No critical-only-desktop workflows without documented desktop-preferred flag

---

# PART 5 — NOTIFICATION STANDARDS

## 5.1 Priority Model

| Priority | Code | Description | Quiet hours |
|----------|------|-------------|-------------|
| **P0** | Critical | Immediate attention required | May break quiet* |
| **P1** | High | Decision or action needed | Respects quiet |
| **P2** | Elevated | Warning | Respects quiet |
| **P3** | Scheduled | Reminder | Respects quiet |
| **P4** | Info | Informational | Respects quiet |

*P0 break requires user opt-in acknowledgment at onboarding.

## 5.2 Delivery Channels

| Channel | P0 | P1 | P2 | P3 | P4 |
|---------|----|----|----|----|-----|
| In-app | ✓ | ✓ | ✓ | ✓ | ✓ |
| Push | ✓ | ✓ | — | — | — |
| Email | opt-in | opt-in | digest | ✓ | digest |

## 5.3 User Preferences (SET-04)

Per-category toggles within priority constraints. P0 in-app cannot be disabled.

## 5.4 Escalation

| Condition | Action |
|-----------|--------|
| P0 unacknowledged 1h | Repeat push |
| Automation critical failure | P0 + email if enabled |
| Support SLA breach | Auto-escalate tier |
| Prediction invalidated | P2 warning + in-app |

## 5.5 Notification Content Standard

| Field | Required |
|-------|----------|
| Title | Plain language |
| Body | What happened + what to do |
| Target | Deep link to resolution screen |
| Timestamp | Always |
| Prohibited | System IDs; agent names |

## 5.6 Inheritance

Screens declare `Notifications Triggered` only for **outbound** notifications they emit. Inbound display uses SHL-03 standard.

---

# PART 6 — INTERACTION STANDARDS

## 6.1 Form Validation

| Timing | Behavior |
|--------|----------|
| **On blur** | Field-level validation |
| **On submit** | Full form validation; focus first error |
| **Async** | Inline loading on async checks (email exists) |
| **Success** | Proceed without redundant confirmation for low-stakes |

## 6.2 Confirmation Dialogs

| Action type | Confirmation |
|-------------|--------------|
| **Low-stakes save** | None; inline success |
| **Defer/reject recommendation** | Optional reason — not blocking |
| **Irreversible action** | Required explicit confirm (CC-09) |
| **Delete workspace** | WKS-03; type name confirm |
| **Revoke automation** | Confirm |
| **Logout** | Optional confirm if unsaved (see 6.7) |

## 6.3 Toast Notifications

| Use | Duration | Behavior |
|-----|----------|----------|
| **Save success** | 3s auto-dismiss | Non-blocking |
| **Copy link** | 2s | "Link copied" |
| **Minor error** | 5s or dismiss | Retry action if applicable |
| **Prohibited** | Critical P0 — use alert zone not toast |

## 6.4 Undo Behavior

| Action | Undo |
|--------|------|
| **Dismiss alert** | No undo — logged |
| **Defer recommendation** | Undo via notification or panel |
| **Delete report** | No undo — confirm required |
| **Correction** | New correction to revert — not undo stack |

## 6.5 Retry Behavior

| Context | Retry |
|---------|-------|
| **Network failure** | Retry button; auto-retry 1x after 5s |
| **Report generation fail** | Retry + refresh intelligence option |
| **Automation failure** | Retry from AUT-04; rollback if reversible |
| **Ask Conquest fail** | Refine question; connect data |

## 6.6 Autosave

| Context | Behavior |
|---------|----------|
| **Automation builder draft** | Autosave every 30s |
| **Report schedule editor** | Save on explicit action only |
| **Settings** | Save per section — explicit button |
| **Correction** | No autosave — explicit submit |

## 6.7 Unsaved Changes Warning

| Trigger | Behavior |
|---------|----------|
| Navigate away with dirty form | "You have unsaved changes" — stay or discard |
| Session expiry with dirty form | Prompt save or lose — per field criticality |

---

# PART 7 — SESSION STANDARDS

## 7.1 Session Timeout

| Tier | Idle timeout | Warning |
|------|--------------|---------|
| **Standard** | 8 hours | 5 min warning |
| **Enterprise** | Configurable 1–12 hours | 5 min warning |
| **High-security org** | 30 min | 2 min warning |

## 7.2 Re-authentication

| Trigger | Behavior |
|---------|----------|
| Idle timeout | SHL-06 session expired |
| Sensitive action | Re-enter password or MFA step-up (enterprise) |
| SSO session end | Redirect IdP |

## 7.3 Recovery

| State | Path |
|-------|------|
| Session expired | Login with return URL preserved 15 min |
| MFA required | SET-03a enrollment or challenge |
| Locked account | Support contact |

## 7.4 Multi-Device Behavior

| Event | Behavior |
|-------|----------|
| New device login | Security notification if enabled |
| Concurrent sessions | Allowed unless org restricts |
| Revoke session | PRF-02; other devices remain |
| Real-time sync | Intelligence freshness per device — not shared live cursor |

---

# PART 8 — SUPPORT STANDARDS

## 8.1 Help Availability

| Location | Access |
|----------|--------|
| **Utility bar** | Always — SUP-01 |
| **Every authenticated screen** | Help icon or `?` link |
| **Error states** | Support link after 2 retries |
| **Permission denied** | Link to request access doc |

## 8.2 Error Assistance

| Error type | Assistance |
|------------|------------|
| Connection fail | Link to SET-12 help article |
| Verification fail | Explain + retry + inaccuracy report |
| Auth fail | Password recovery link |
| Plan limit | Billing + support |

## 8.3 Escalation Paths

```
Self-service (FAQ/Docs)
   → Support AI (product help only)
   → Contact Support (human)
   → SLA escalation per plan
```

## 8.4 Documentation Linkage

| Screen category | Default doc anchor |
|-----------------|-------------------|
| Command Center | `docs/command-center` |
| Data connect | `docs/connect-sources` |
| Automation | `docs/automation` |
| Reports | `docs/reports` |
| Billing | `docs/billing` |

## 8.5 Context Capture (All Support Submissions)

Auto-attach: user ID, org, workspace, screen ID, artifact ID if applicable, timestamp.

## 8.6 Support vs Ask Conquest

| Support | Ask Conquest |
|---------|--------------|
| Product usage | Business intelligence |
| Navigation help | Evidence-backed analysis |
| Billing, bugs | Recommendations |

---

# PART 9 — AUDIT AND ACTIVITY STANDARDS

## 9.1 User-Visible Activity

| Surface | Content |
|---------|---------|
| **Command Center Activity Feed** | Plain-language intelligence events |
| **SET-18 Activity Log** | User actions; admin events; filterable |
| **Automation log** | AUT-04 execution trace |

## 9.2 Logged Actions (User-Visible Summary)

| Action | Visible to |
|--------|------------|
| Recommendation decision | Workspace members |
| Correction | User + admin review queue (enterprise) |
| Automation run | Automation viewers |
| Team change | Admins |
| Settings security change | User + admin |
| Report export/share | Report owner + admin |

## 9.3 Sensitive Action Logging

| Action | Audit |
|--------|-------|
| Workspace delete | Full audit; irreversible confirm |
| Member remove | Audit with actor |
| Marketplace install | Audit with permissions granted |
| Billing change | Owner audit |
| MFA disable | Security alert |

## 9.4 Traceability

User-facing logs reference **artifact IDs** for support — never exposed as primary UI element. Support and inaccuracy reports attach full chain.

## 9.5 Prohibited in User Activity

- Agent names
- Pipeline stage names
- Raw memory record IDs as primary content

---

# PART 10 — CROSS-DOCUMENT INHERITANCE MATRIX

## 10.1 Document Hierarchy (Updated)

```
CCIS
  ↓
AMD I–IV
  ↓
PDD I–II (+ Authority Bridge)
  ↓
UXMD I (philosophy)
  ↓
UXMD III (GIS — global standards)  ← inherits from UXMD I
  ↓
UXMD II (screens — inherit GIS unless override)
  ↓
SDD Volume I (blocked until UXMD approved)
```

## 10.2 GIS Field Inheritance in UXMD-II

| UXMD-II Template Field | Source |
|------------------------|--------|
| Loading State | GIS §1.3 + module profile §1.9 unless override |
| Empty State | GIS §1.4 + module profile unless override |
| Success State | GIS §1.5 unless override |
| Error State | GIS §1.6 unless override |
| Recovery State | GIS §1.7 unless override |
| Offline State | GIS §1.8 if applicable |
| Permission Rules | GIS §2.3 + override §2.4 |
| Mobile Behavior | GIS §4 unless override |
| Accessibility | GIS §3 entirely |
| Notifications | GIS §5 |
| Support Entry | GIS §8.1 |
| Confirmations | GIS §6.2 |
| Session | GIS §7 |

## 10.3 Screen Category Inheritance Table

| Screen category | GIS inherit | Typical overrides in UXMD-II |
|-----------------|-------------|------------------------------|
| **Public (PUB-*)** | State §1; Form §6.1; A11y §3 | Screen-specific errors |
| **Onboarding (ONB-*)** | State §1; Mobile §4 | Progress messages |
| **App Shell (SHL-*)** | Nav §4.2; Session §7 | — |
| **Command Center (CC-*)** | Module CC profile; PERM-CC; A11y live regions | Zone content; behavioral states |
| **Reports (RPT-*)** | Module RPT profile | Generation flow |
| **Automation (AUT-*)** | Module AUT profile | Rollback |
| **Knowledge (KNW-*)** | Module KNW profile | Upload validation |
| **Strategy (STR-*)** | Module STR profile | Detail content |
| **Marketplace (MKT-*)** | Module MKT profile | Install governance |
| **Settings (SET-*)** | Module SET profile | Section-specific |
| **Support (SUP-*)** | Support §8 entirely | Ticket context |
| **System (SYS-*)** | Guards §2.5 | — |

## 10.4 Override Declaration Format

In UXMD-II screen specs:

```markdown
**GIS Inheritance:** GIS-1.x, GIS-2.x, GIS-3, GIS-4, GIS-5, GIS-6, GIS-7, GIS-8, GIS-9
**GIS Overrides:** [field]: [screen-specific rule]
```

If no overrides: `**GIS Inheritance:** Full — see UXMD-III`

## 10.5 Screens Requiring Explicit Overrides (Never Fully Inherited)

| Screen | Override reason |
|--------|-----------------|
| CC-01 | Behavioral state matrix; zone priority |
| CC-09 | Irreversible confirmation |
| AUT-06 | Rollback confirmation |
| WKS-03 | Delete confirm |
| SYS-01 | Permission message |
| ONB-05 | Initialization progress |

## 10.6 PDD-I Gap Resolution Map

| PDD-I Review Gap | Resolved by |
|------------------|-------------|
| User lifecycle screens | UXMD-II PUB, ONB, SET |
| First report milestone | UXMD-II RPT-07 |
| Report history/compare | UXMD-II RPT-01, RPT-04 |
| Automation rollback | UXMD-II AUT-06 + GIS §6.5 |
| Modify recommendation | UXMD-II CC-11 |
| Outcome confirmation | UXMD-II CC-15 |
| Prediction detail | UXMD-II CC-13 |
| Per-screen states | UXMD-III GIS §1 |
| Per-screen permissions | UXMD-III GIS §2 |
| Per-screen mobile | UXMD-III GIS §4 |
| Accessibility binding | UXMD-III GIS §3 |
| Memory behavioral specs | PDD-I Authority Bridge §3 — remains PDD-I v2.1 track |
| Intelligence stage behaviors | PDD-I Authority Bridge §3 — UXMD expresses via screens |
| Prediction lifecycle workflow | UXMD-II CC-13 + CC-15 + PDD-I D8 track |

---

# PART 11 — GIS LAWS

| # | Law |
|---|-----|
| **GIS-L1** | GIS applies to every screen unless explicit override |
| **GIS-L2** | Overrides must be declared — never implied |
| **GIS-L3** | GIS does not define screen-specific intelligence content |
| **GIS-L4** | GIS does not contradict UXMD-I philosophy |
| **GIS-L5** | GIS does not contradict CCIS or PDD behavioral laws |
| **GIS-L6** | Empty is honest — GIS-S2 is permanent |
| **GIS-L7** | Accessibility is mandatory — not optional per screen |
| **GIS-L8** | Support is always reachable |
| **GIS-L9** | GIS changes require UXMD version increment |
| **GIS-L10** | SDD implements GIS — does not redefine it |

---

# PART 12 — APPROVAL CRITERIA FOR UXMD VOLUME III

UXMD Volume III is complete when:

- [x] Global state inheritance defined
- [x] Permission inheritance defined
- [x] Accessibility standards defined
- [x] Mobile adaptation standards defined
- [x] Notification standards defined
- [x] Interaction standards defined
- [x] Session standards defined
- [x] Support standards defined
- [x] Audit and activity standards defined
- [x] Cross-document inheritance matrix complete
- [x] No UI, API, database, or implementation content

---

*End of UXMD Volume III — Global Interaction Standards v1.0*
