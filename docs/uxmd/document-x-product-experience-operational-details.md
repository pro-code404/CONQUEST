# Document X — Product Experience & Operational Details

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | Document X — Product Experience & Operational Details |
| **Abbreviation** | UXMD-X / DX |
| **Version** | 1.0 |
| **Status** | **Architecture documentation — APPROVED** (see [Architecture Review](#architecture-review-v10)) |
| **Date** | 2026-06-26 |
| **Supreme Authority** | [CCIS](../architecture/ccis.md) |
| **Subordinate To** | CCIS, AMD I–IV, [PDD I–II](../pdd/README.md), [UXMD I–III](README.md) |
| **Complements** | [SDD I–V](../sdd/README.md) — UX expectations only; no engineering specification |
| **Does Not Replace** | UXMD-I (philosophy), UXMD-II (102 screens), UXMD-III (GIS) |

### Mission

Capture **operational product experience details** that make Conquest behave like a polished production application — the small decisions that prevent dozens of forgotten UX choices during implementation.

Document X **fills gaps**. It does not redefine product behavior (PDD), global standards (GIS), or screen specifications (UXMD-II).

### Inheritance Rule

| Layer | Rule |
|-------|------|
| **GIS** | All GIS standards apply unless this document cites an explicit **DX Override** |
| **UXMD-II** | Screen routes, states, and workflows prevail where specified |
| **Document X** | Applies where UXMD-II is silent or under-specified on polish and cross-cutting operational behavior |
| **Conflict** | GIS > UXMD-II screen spec > Document X |

### Strict Prohibitions

No APIs, databases, code, prompts, visual design tokens, infrastructure, or implementation tasks.

---

# PART 1 — GLOBAL PRODUCT EXPERIENCE

*Inherits GIS Part 1 (`S-LOAD`, `S-EMPTY`, `S-ERROR`, `S-OFFLINE`, etc.). This part adds operational polish only.*

## 1.1 Loading Behavior

| ID | Behavior |
|----|----------|
| **DX-L1** | First paint within authenticated shell shows shell chrome immediately; content zones load independently per GIS §1.3 |
| **DX-L2** | Skeleton layout mirrors final content structure — never generic spinner-only for primary zones |
| **DX-L3** | Zone-level loading: Command Center zones skeleton independently; one slow zone does not block others |
| **DX-L4** | Stale-while-revalidate: show last verified snapshot with freshness label while refreshing (not `S-OFFLINE`) |
| **DX-L5** | Background refresh never steals focus or scroll position |
| **DX-L6** | Long operations (>10s) show plain-language phase: "Analyzing sources…", "Preparing report…" — never pipeline stage names |

## 1.2 Empty States

| ID | Behavior |
|----|----------|
| **DX-E1** | Every empty state names **why** empty and **what unlocks** content — per GIS §1.4 |
| **DX-E2** | First-time empty differs from returning-user empty ("You haven't created…" vs "No items match…") |
| **DX-E3** | Filtered-empty shows "Clear filters" as secondary action |
| **DX-E4** | Permission-empty explains role limitation + who to contact — not generic empty |

## 1.3 Skeleton States

| Zone | Skeleton behavior |
|------|-------------------|
| Command Center KPI row | 3–5 placeholder bars matching KPI count |
| Intelligence feed | 2–3 card-shaped placeholders |
| List screens | Row placeholders with avatar + text lines |
| Detail screens | Header + 2 content blocks |
| Settings sections | Label + field placeholders per section |

Skeletons disappear atomically per zone — no partial skeleton/text mix in one zone.

## 1.4 Error States

*Inherits GIS §1.6–1.7. Adds:*

| ID | Behavior |
|----|----------|
| **DX-ER1** | Transient errors auto-clear on successful retry without full page reload |
| **DX-ER2** | Permission errors never masquerade as system errors |
| **DX-ER3** | Concurrent edit conflict: "Updated elsewhere — refresh to see latest" with Refresh action |
| **DX-ER4** | Rate-limit errors state when user may retry |

## 1.5 Offline Behavior

*Inherits GIS §1.8. Adds:*

| ID | Behavior |
|----|----------|
| **DX-O1** | Offline banner persists across navigation until reconnect |
| **DX-O2** | Queued actions show "Will send when online" with cancel option |
| **DX-O3** | Read-only modules remain browsable offline where cached |
| **DX-O4** | Mutation attempts offline show inline notice — not silent failure |

## 1.6 Reconnect Behavior

| Step | UX |
|------|-----|
| 1 | Detect connectivity restoration |
| 2 | Dismiss offline banner with brief "Back online" acknowledgment (3s) |
| 3 | Auto-refresh stale primary content without full page reload |
| 4 | Process queued mutations in order; report per-item failure |
| 5 | If session expired during offline, route to login with return URL — per GIS §7.3 |

## 1.7 Confirmation Dialogs

*Inherits GIS §6.2. Adds operational taxonomy:*

| Class | Examples | Confirmation |
|-------|----------|--------------|
| **Type A — Acknowledge** | Logout with unsaved work | Stay / Leave |
| **Type B — Confirm** | Archive workspace, revoke automation | Confirm + optional reason |
| **Type C — Typed confirm** | Delete workspace, delete organization | User types entity name |
| **Type D — Step-up** | Export sensitive data, billing change | Re-auth or MFA per GIS §7.2 |

Destructive dialogs: primary action is never the default focused button.

## 1.8 Success Messages

| Context | Pattern |
|---------|---------|
| Inline save | Brief text: "Saved" — GIS §1.5 |
| Toast | Low-stakes completion — GIS §6.3 |
| Full success | Irreversible completion with summary + next step |
| Intelligence action | "Recommendation recorded" / "Correction submitted" — never "AI understood" |

## 1.9 Warning Messages

| Type | When | UX |
|------|------|-----|
| **W1 — Degraded capability** | Partial intelligence; stale data | Persistent inline notice until resolved |
| **W2 — Approaching limit** | Plan quota 80%+ | Non-blocking banner with upgrade path |
| **W3 — Irreversible preview** | Action has permanent effect | Pre-confirm warning copy |
| **W4 — Stale context** | Workspace data not refreshed >24h | "Intelligence may be outdated — Refresh" |
| **W5 — Validation caution** | High-stakes with medium confidence | Confidence band + explicit user acknowledgment |

Warnings are never alarmist theater — measured tone per UXMD-I calm authority.

## 1.10 Destructive Actions

| Rule | Behavior |
|------|----------|
| **DX-D1** | All destructive actions require GIS §6.2 confirmation class B or C |
| **DX-D2** | Destructive buttons use distinct label ("Delete workspace", not "Continue") |
| **DX-D3** | Success states name what was destroyed and what remains |
| **DX-D4** | Cascade effects listed before confirm ("3 automations will stop") |

## 1.11 Undo Patterns

*Inherits GIS §6.4. Adds:*

| Action | Undo window | Mechanism |
|--------|-------------|-----------|
| Dismiss non-critical notification | 5s | Toast with Undo |
| Archive report | None | Confirm required |
| Snooze alert | Until snooze ends | Notification panel |
| Bulk selection clear | Immediate | Re-select |
| Filter apply | Immediate | Clear filters |

No global undo stack. Corrections to intelligence use correction flow — not undo.

---

# PART 2 — NAVIGATION DETAILS

*Primary nav: UXMD-I §C.2 (7 items, frozen). Utility bar: UXMD-I §C.4.*

## 2.1 Navigation Areas

| Area | Expected behavior | Breadcrumbs | Back |
|------|-------------------|-------------|------|
| **Command Center** | Home; always one click from anywhere | `Command Center` only at root | N/A at root |
| **Reports** | List → detail → editor hierarchy | `Reports › [Name]` | Back to list preserves filters |
| **Automation** | Center → builder → detail → log | `Automation › [Name]` | Builder warns if unsaved |
| **Knowledge** | Browse → article → search results | `Knowledge › [Category/Article]` | Search preserves query |
| **Strategy Center** | Overview → entity detail | `Strategy › [Type] › [Name]` | Back to overview scroll position |
| **Marketplace** | Browse → extension → configure | `Marketplace › [Extension]` | Installed vs browse context preserved |
| **Settings** | Hub → section → subsection | `Settings › [Section]` | Section-level back |
| **Support / Help** | Hub → article → ticket | `Help › [Topic]` | Search context preserved |
| **Onboarding** | Linear with skip where allowed | Step indicator, not full breadcrumb | Back only within onboarding |

## 2.2 Breadcrumbs

| Rule | Behavior |
|------|----------|
| **DX-N1** | Breadcrumbs appear on depth ≥2 within a module |
| **DX-N2** | Current page is terminal — not linked |
| **DX-N3** | Truncate middle segments with ellipsis on narrow viewports |
| **DX-N4** | Workspace name is not a breadcrumb segment — shown in utility bar |

## 2.3 Back Navigation

| Context | Behavior |
|---------|----------|
| Browser back | Respects in-app history; unsaved warning per GIS §6.7 |
| In-app back | Preferred on mobile — returns to logical parent |
| Modal / overlay | Close returns focus to trigger — GIS §3.4 |
| Deep link entry | Back goes to module home if no history |

## 2.4 Deep Links

| Rule | Behavior |
|------|----------|
| **DX-N5** | Authenticated deep links include workspace context in URL where applicable |
| **DX-N6** | Unauthenticated deep link → login → return to intended destination |
| **DX-N7** | Invalid or expired deep link → honest error + path home |
| **DX-N8** | Permission-insufficient deep link → SYS-01 with request-access guidance |

## 2.5 Recent Items

| Location | Content | Limit |
|----------|---------|-------|
| Global search | Recent searches + recent screens | 10 |
| Reports | Recently viewed reports | 5 |
| Knowledge | Recently viewed articles | 5 |
| Command Center | Recently viewed drill-downs | 3 |

Recent items are per-user, per-workspace. Clearing is available in Privacy settings.

## 2.6 Favorites

| Entity | Behavior |
|--------|----------|
| Reports | Star to pin in Reports home |
| Knowledge articles | Star for quick access |
| Strategy entities | Star for Strategy overview widget |

Favorites are per-user within workspace. Unfavoriting is immediate — no confirm.

## 2.7 Pinning

| Pin target | Effect |
|------------|--------|
| Command Center widget | Stays in layout across sessions — per workspace memory |
| Alert | Pinned alerts remain at top of alert zone until resolved |
| Report schedule | Pin icon in list for manager+ — visual priority only |

## 2.8 Search Behavior

| Scope | Behavior |
|-------|----------|
| **Global (utility)** | Modules, help articles, settings sections — ranked by relevance |
| **In-module** | Scoped to current module; respects workspace |
| **Help** | Documentation + FAQ unified |
| **Empty query** | Recent items + suggested actions |
| **No results** | Honest empty + broaden suggestion |

Search never returns unverified intelligence as fact. Results label content type.

## 2.9 Keyboard Shortcuts

*Inherits GIS §3.2. Operational set:*

| Shortcut | Action | Scope |
|----------|--------|-------|
| `?` | Keyboard help overlay | App |
| `/` | Focus global search | App |
| `g` then `c` | Go to Command Center | App |
| `g` then `r` | Go to Reports | App |
| `Esc` | Close overlay / cancel non-destructive | Context |
| `Enter` | Activate focused primary action | Context |

Shortcuts never conflict with text input — disabled when typing in fields.

## 2.10 Accessibility Expectations (Navigation)

*Inherits GIS Part 3. Adds:*

| Requirement | Behavior |
|-------------|------------|
| Skip link | To main content — first focusable element |
| Landmark regions | `nav`, `main`, `complementary` per module layout |
| Current page | `aria-current="page"` on active nav item |
| Mobile nav | Bottom bar items have accessible names matching desktop |

---

# PART 3 — WORKSPACE DETAILS

*Inherits UXMD-I Part G, PDD-II workspace model.*

## 3.1 Workspace Switching

| Step | UX |
|------|-----|
| Open selector | Shows current + recents (max 5) + "All workspaces" |
| Select workspace | Instant switch; loading zones per module |
| No access | Explain + contact admin — not empty shell |
| Create new | WKS-01 or onboarding path |

Switching preserves each workspace's last visited module separately.

## 3.2 Remembered Layouts

| Element | Persistence |
|---------|-------------|
| Command Center widget order | Per user, per workspace |
| Collapsed/expanded zones | Per user, per workspace |
| Strategy overview filters | Per user, per workspace |
| Reports list sort/filter | Per user, per workspace |

Reset layout available in Appearance settings (SET-06).

## 3.3 Last Opened Context

| Data | Restored on return |
|------|-------------------|
| Last module visited | Per workspace |
| Last report viewed | Optional — user preference |
| Unfinished automation draft | Prompt to resume or discard |
| Scroll position | Restored on back navigation within session |

## 3.4 Tab Behavior

| Context | Behavior |
|---------|----------|
| Module sub-views | Tabs within page — not browser tabs |
| Settings sections | Left nav + content — tabs only where UXMD-II specifies |
| Multi-entity compare | Maximum 2 side-by-side on desktop; toggle on mobile |

Active tab reflected in URL where shareable.

## 3.5 Split Views

| Use | Layout |
|-----|--------|
| Report preview + editor | Side-by-side desktop; stacked mobile |
| Knowledge article + Ask | Optional panel — dismissible |
| Evidence viewer + recommendation | Overlay on mobile; split on wide desktop |

User can collapse split; preference remembered per screen type.

## 3.6 Panel Persistence

| Panel | Behavior |
|-------|----------|
| Notification panel | Closes on outside click; state not persisted |
| Help drawer | Persists until dismissed; does not block mutations |
| Filter panel | Persists while in list view |
| Ask Conquest panel | Collapsed/expanded per session; not cross-device |

---

# PART 4 — SETTINGS (UX EXPECTATIONS)

*Screen IDs from UXMD-II §A.11. UX only — no implementation.*

## 4.1 Account (SET-02)

| User sees | User does | Success | Failure |
|-----------|-----------|---------|---------|
| Name, email, avatar, language, timezone | Edit profile fields | "Profile updated" | Field-level validation |
| Connected identities | Link/unlink OAuth | Confirmation per provider | Provider error explained |
| Delete account entry | Starts deletion flow — Part 10 | — | — |

## 4.2 Organization (SET-17)

| User sees | User does | Success | Failure |
|-----------|-----------|---------|---------|
| Org name, plan summary, member count | Edit org profile (admin+) | Saved | Permission denied |
| Default policies | Configure org-wide defaults | Saved with scope notice | Conflict explained |
| Danger zone | Delete org — typed confirm | — | Cascade warning |

## 4.3 Workspace (SET-09–SET-13)

| User sees | User does | Success | Failure |
|-----------|-----------|---------|---------|
| Workspace name, type, goals | Edit metadata | Saved | Validation |
| Team (SET-10) | Invite, role change, remove | Invitation sent / role updated | Permission errors |
| Data sources (SET-11–12) | Connect, disconnect, test | Connection status visible | Connection error + retry |
| Goals and projects (SET-13) | Define hierarchy | Saved | Orphan rules explained |

## 4.4 Notifications (SET-04)

| User sees | User does | Success | Failure |
|-----------|-----------|---------|---------|
| Category toggles per GIS §5.3 | Enable/disable channels | Saved | P0 in-app cannot disable |
| Quiet hours | Set schedule | Saved | Invalid range prevented |
| Digest preferences | Daily/weekly/off | Saved | — |

## 4.5 Privacy (SET-05)

| User sees | User does | Success | Failure |
|-----------|-----------|---------|---------|
| Data retention summary | Adjust where permitted | Saved | Policy floor explained |
| Activity visibility | Team vs private | Saved | — |
| Clear recents | Confirm | Cleared | — |
| Export my data | Request export | Email when ready | Rate limit notice |

## 4.6 AI Preferences (SET-14, SET-15)

| User sees | User does | Success | Failure |
|-----------|-----------|---------|---------|
| Explanation depth default | Adjust slider/level | Saved | — |
| Automation autonomy level | Set per org policy max | Saved | Policy cap explained |
| Memory controls | View, correct, delete categories | Per action confirm | Irreversible warnings |
| Challenge sensitivity | Admin-configurable band | Saved | — |

No exposure of model names, agents, or pipeline stages.

## 4.7 Integrations (SET-08)

| User sees | User does | Success | Failure |
|-----------|-----------|---------|---------|
| Connected services list | Connect, configure, disconnect | Status badge updated | OAuth/API errors plain language |
| Marketplace link | Browse extensions | Navigate MKT-01 | — |
| Per-integration health | Test connection | Pass/fail indicator | Retry + help link |

## 4.8 Billing (SET-07)

| User sees | User does | Success | Failure |
|-----------|-----------|---------|---------|
| Current plan, usage, renewal | Upgrade/downgrade | Confirmation + receipt | Payment failure recovery |
| Invoice history | Download PDF | Download starts | — |
| Payment method | Update card | Saved | PCI-safe error messages |
| Cancel subscription | Multi-step confirm | End-of-period notice | Retention offer optional — not blocking |

## 4.9 Accessibility (SET-06 + DX)

| User sees | User does | Success | Failure |
|-----------|-----------|---------|---------|
| Theme (light/dark/system) | Select | Immediate preview | — |
| Font size preference | Adjust | Immediate preview | — |
| Reduced motion | Toggle | Honors GIS §3.5 | — |
| High contrast mode | Toggle | Immediate preview | — |
| Reset layout | Button | Layout defaults restored | Confirm |

## 4.10 Security (SET-03, SET-03a, PRF-02)

| User sees | User does | Success | Failure |
|-----------|-----------|---------|---------|
| Password change | Update credentials | Success + optional re-login | Strength requirements |
| MFA enrollment | Setup TOTP/hardware | Backup codes shown once | Step-by-step recovery |
| Active sessions (PRF-02) | Revoke sessions | Session ended | Cannot revoke current without confirm |
| Security log | View recent events | Read-only list | — |

---

# PART 5 — HELP SYSTEM

*Inherits GIS Part 8. Maps to UXMD-II §A.13.*

| Surface | Route / ID | UX expectation |
|---------|------------|----------------|
| **Help Center** | SUP-01 | Search-first hub; categorized entry points; contextual "popular articles" |
| **Contact Support** | SUP-05 | Form with category, severity, description; auto-context per GIS §8.5 |
| **Documentation** | SUP-02, SUP-03 | Version-aligned articles; breadcrumb; "Was this helpful?" |
| **Tutorials** | SUP-01 section | Guided multi-step flows for first report, first automation, first connection |
| **Product Tour** | Overlay | Optional on first Command Center visit; skippable; never blocks P0 alerts |
| **FAQ** | SUP-04 | Expandable answers; link to docs for depth |
| **Feedback** | SUP-05 category | "Share feedback" — not bug severity; thank-you acknowledgment |
| **Bug Report** | SUP-06 | Repro steps, expected vs actual; optional screenshot |
| **Feature Request** | SUP-05 category | Problem statement focus — not solution prescription |
| **Live Chat placeholder** | SUP-10 | Label: "Support AI — product help only"; escalates to human per GIS §8.3 |
| **Status page** | SUP-09 | Incident list, component health, subscribe link |
| **Release Notes** | SUP-01 / public | What's new since last visit; dismissible banner in app |

Help is always reachable within 2 interactions from any authenticated screen.

---

# PART 6 — MARKETING / PUBLIC PAGES

*UXMD-II defines PUB-01–PUB-07. Document X specifies additional public surfaces.*

| Page | Route (conceptual) | UX expectation |
|------|-------------------|----------------|
| **Landing** | `/` (PUB-01) | Value proposition, trust signals, primary CTA signup, secondary login |
| **About** | `/about` | Mission, team narrative, link to Trust Center |
| **Pricing** | `/pricing` | Plan comparison, feature matrix, FAQ anchor, CTA per tier |
| **Careers** | `/careers` | Open roles list, culture summary, apply CTA |
| **Contact** | `/contact` | Sales vs support routing; form or mailto placeholder |
| **Privacy** | `/privacy` | Policy readable; last updated date; table of contents |
| **Terms** | `/terms` | Same readability standard as Privacy |
| **Cookies** | `/cookies` | Consent categories explained; link from cookie banner |
| **Security** | `/security` | Practices summary; link to Trust Center |
| **Trust Center** | `/trust` | Compliance posture, subprocessors summary, status link |
| **Blog** | `/blog` | Article list + detail; no product login required |
| **Changelog** | `/changelog` | Version history; mirrors in-app Release Notes |

Public pages: no authenticated shell; minimal nav (Product, Pricing, Trust, Login, Sign up). Cookie consent banner on first visit — preferences remembered.

---

# PART 7 — COMMUNICATION

*Inherits GIS Part 5.*

## 7.1 Email Notifications

| Type | Default | User control |
|------|---------|--------------|
| Transactional (verify, reset, invite) | On | Cannot disable |
| Security alerts | On | Cannot disable |
| Product updates | Opt-in | SET-04 |
| Digest | Opt-in | Frequency in SET-04 |

Emails: plain-language subject; single primary CTA; unsubscribe where applicable.

## 7.2 In-App Notifications

| Element | Behavior |
|---------|----------|
| Badge | Unread count on utility icon |
| Panel (SHL-03) | Priority-ordered; P0 pinned top |
| Read state | Mark read on open; bulk mark read |
| Action | Deep link to resolution screen — GIS §5.5 |

## 7.3 Digest Emails

| Content | Rules |
|---------|-------|
| Summary | Unresolved P1+, completed reports, automation failures |
| Frequency | User-selected daily/weekly |
| Empty digest | Do not send — or "Nothing requiring attention" per preference |

## 7.4 Reminders

| Source | UX |
|--------|-----|
| Scheduled report | P3 notification + optional email |
| Stale intelligence | W4 warning in Command Center |
| Onboarding incomplete | P4 nudge — max 3 over 7 days |
| Trial ending | P1 with billing CTA |

## 7.5 Announcement Banners

| Type | Behavior |
|------|----------|
| Product announcement | Dismissible; persists dismiss per user |
| Maintenance | Non-dismissible until window passes; links SUP-09 |
| Incident | Severity-colored per GIS — text label required |
| Promotion | Opt-in plans only; dismissible |

Banners stack max 2 visible — priority order: incident > maintenance > product.

---

# PART 8 — USER LIFECYCLE

*Maps to UXMD-II PUB, ONB, SET screens and UXMD-I Part B.*

## 8.1 Sign Up (PUB-02)

Progressive disclosure: email/password or OAuth → verify → onboarding. Inline validation. Existing email routes to login with message.

## 8.2 Sign In (PUB-03)

Remember device optional. Failed attempt count visible after 3. SSO where org requires. Session expired message with return URL.

## 8.3 Onboarding (ONB-01–06)

Linear with progress indicator. Skip only where UXMD-II allows. Never blocks on optional steps. Ends at Command Center Dormant or first intelligence.

## 8.4 Invitations (PUB-07)

Token validation first. New user: abbreviated signup. Existing user: accept → workspace orientation. Expired: request new invite flow.

## 8.5 Organization Creation

During onboarding or Settings: name, plan selection, first workspace. Owner role assigned. Billing if paid tier.

## 8.6 Password Reset (PUB-05, PUB-06)

Email link expires — stated in UI. Single-use token. Success routes to login. Invalid token: request new link.

## 8.7 MFA (SET-03a)

Enrollment: QR + backup codes. Challenge: TOTP primary; backup fallback. Lost device: admin recovery or support — documented path.

## 8.8 Account Deletion

Multi-step: export offer → confirm consequences → typed confirm → grace period if org sole owner blocked. Final email acknowledgment.

---

# PART 9 — SOCIAL PRESENCE (PLACEHOLDERS)

Footer and public pages may link to brand presence. No URLs required in this document.

| Channel | UX expectation |
|---------|------------------|
| **LinkedIn** | Company updates, hiring |
| **X** | Product announcements |
| **GitHub** | Open-source or community repos if applicable |
| **YouTube** | Tutorials and release demos |
| **Community** | User forum or Discord — linked from Help |
| **Newsletter** | Opt-in from public footer; double confirm |

Social links open in new tab with accessible label ("Conquest on LinkedIn").

---

# PART 10 — ACCESSIBILITY (BEYOND GIS)

*Extends GIS Part 3 — does not relax any GIS requirement.*

| ID | Guidance |
|----|----------|
| **DX-A1** | All time-sensitive content offers text alternative to relative time ("2 hours ago" + absolute on focus) |
| **DX-A2** | Intelligence tables have sortable headers announced to screen readers |
| **DX-A3** | Video tutorials require captions before publish |
| **DX-A4** | Product tour steps are screen-reader navigable with pause |
| **DX-A5** | Public pages meet same WCAG 2.2 AA behavioral target as app |
| **DX-A6** | Language changes re-render chrome without full logout |
| **DX-A7** | Error summaries receive focus on submit failure |

---

# PART 11 — MOBILE EXPECTATIONS

*Inherits GIS Part 4.*

## 11.1 Desktop

Full sidebar nav, multi-column Command Center, split views enabled, keyboard shortcuts active.

## 11.2 Tablet

Portrait: mobile nav pattern. Landscape (≥ threshold): collapsible sidebar. Touch targets ≥44px. No hover-only actions.

## 11.3 Mobile

Bottom nav (4 + More), stacked zones, sheets instead of side panels, swipe to dismiss non-destructive overlays. Critical P0 alerts use full-width banner. Forms single-column.

## 11.4 Cross-Form-Factor

| Element | Rule |
|---------|------|
| Content parity | Same capabilities — layout adapts, features do not disappear without explanation |
| Sync | Layout preferences may differ per device |
| Orientation change | Reflow without data loss |

---

# PART 12 — INTERNATIONALIZATION

*Build-time locale support is SDD scope. UX expectations:*

## 12.1 Language Selector

| Location | Behavior |
|----------|----------|
| SET-02 Account | Primary selector |
| Public footer | Same languages offered |
| First visit | Browser locale suggested — user confirms |

Partial translation: UI chrome translated; user-generated content not auto-translated unless product feature exists.

## 12.2 Timezone

| Rule | Behavior |
|------|----------|
| Detection | Suggest from browser; confirm in account |
| Display | All timestamps in user timezone with label on hover/focus |
| Scheduling | Reports and automations show timezone explicitly |

## 12.3 Regional Formatting

| Element | Behavior |
|---------|----------|
| Dates | Locale-appropriate format |
| Numbers | Locale separators |
| Currency | Billing displays user/org locale + currency code |

---

# PART 13 — FUTURE EXTENSION AREAS (RESERVED)

Sections reserved for post-v1.0 expansion **without architecture change**. Content intentionally minimal.

| Section ID | Reserved for |
|------------|--------------|
| **DX-F1** | Multi-language intelligence output preferences |
| **DX-F2** | Collaborative cursors / shared Command Center |
| **DX-F3** | Custom roles beyond five-role hierarchy |
| **DX-F4** | White-label / partner-branded workspaces |
| **DX-F5** | Offline-first mobile app behaviors |
| **DX-F6** | Voice input / output interaction patterns |
| **DX-F7** | Widget marketplace layout presets |

Amendments to reserved sections are Class C documentation changes per Architecture Freeze §7.

---

# PART 14 — CROSS-REFERENCE MATRIX

| Topic | CCIS | PDD | UXMD | SDD | Document X |
|-------|------|-----|------|-----|------------|
| Trust & honesty | §XV | BH-7, BH-8 | UX-7, UX-8 | ENG-20 | §1 warnings |
| User authority | §XV.2 Control | BH-9 | UX-9 | — | §1.10 destructive |
| Navigation | — | MSD-13 | §C | SDD-I topology | Part 2 |
| Workspace scope | Memory | PDD-II | Part G | SDD-II data | Part 3 |
| Notifications | — | — | GIS §5 | SDD-III | Part 7 |
| Support | — | MSD Support | GIS §8 | — | Part 5 |
| Accessibility | HUM | — | GIS §3 | ENG-23 | Part 10 |
| Build gates | — | — | — | SDD-V §11 | — |

---

# PART 15 — DOCUMENT X LAWS

| # | Law |
|---|-----|
| **DX-1** | Inherit GIS first — override only with explicit DX Override field |
| **DX-2** | Never introduce behavior that contradicts PDD behavioral laws |
| **DX-3** | Never expose intelligence machinery in user-facing copy |
| **DX-4** | Polish serves trust — not decoration |
| **DX-5** | Every operational pattern has success, failure, and recovery |
| **DX-6** | Public and authenticated experiences share honesty standards |
| **DX-7** | Reserved sections are not implicit commitments |

---

# Architecture Review v1.0

| Field | Value |
|-------|-------|
| **Reviewer** | Conquest Architecture Program |
| **Date** | 2026-06-26 |
| **Scope** | Single review — Document X v1.0 completeness and authority compliance |

## Findings

| ID | Severity | Finding | Resolution |
|----|----------|---------|------------|
| **RV-X-01** | Critical | Missing explicit subordination to GIS inheritance rule | **Fixed** — Part 0 Inheritance Rule added |
| **RV-X-02** | Critical | Marketing pages could be read as new primary nav items | **Fixed** — Part 6 states public-only minimal nav |
| **RV-X-03** | Major | Settings "AI preferences" risked machinery exposure | **Fixed** — §4.6 prohibits model/agent names |
| **RV-X-04** | Major | Undo section could conflict with GIS §6.4 | **Fixed** — explicit GIS inheritance cited |
| **RV-X-05** | Minor | No cross-reference to SDD-V ENG-23 accessibility gate | **Fixed** — Part 14 matrix |

## Verdict

**APPROVED** — Document X v1.0 is complete. No critical findings remain.

## Completion declaration

Document X closes the final architecture-level documentation gap identified for transition. **No additional architecture volumes are required** before Build Authorization (B-10).

**Next step:** Proceed to Build Authorization Record issuance per [Build Authorization Checklist](../governance/build-authorization-checklist-v1.0.md).

---

*Document X v1.0 — Product Experience & Operational Details — 2026-06-26*
