# 05 — Product Architecture

Every module, primary screens, workflows, and user journeys.

---

## 1. Primary navigation (frozen)

Per UXMD + ADR-0005:

| # | Module | Path segment | Status M4 |
|---|--------|--------------|-----------|
| 1 | Command Center | `command-center` | Implemented |
| 2 | Intelligence | `intelligence` | Implemented |
| 3 | Research | `research` | Implemented |
| 4 | Automation | `automation` | Implemented (run audit-only) |
| 5 | Strategy Center | `strategy` | Placeholder |
| 6 | Operations | `operations` | Implemented |
| 7 | Settings | `settings` | Implemented (18+ screens) |

Workspace is **context** (`/app/w/:workspaceId/...`), not nav item #8.

---

## 2. Module deep dive

### Command Center (home)

**Job:** Synthesize intelligence into decision-ready awareness.

| Zone | Source M4 |
|------|-----------|
| Recommendations | Intelligence feed |
| Alerts | Operations / intelligence |
| Status | Workspace + platform health |

**Behavioral states:** Dormant → active when intelligence exists (honest empty before).

### Intelligence

**Job:** Feed, categories, recommendation detail, approval.

| Screen | API |
|--------|-----|
| Home | `/api/workspaces/:id/intelligence/home` |
| Feed | `.../intelligence/feed` |
| Recommendation detail | `.../recommendations/:id` |
| Status update | `POST .../status` |

### Research

**Job:** Structured sessions → cognitive analyze.

| Step | User action |
|------|-------------|
| Create session | Title, objective |
| Add sources | Attach evidence inputs |
| Analyze | Triggers full pipeline |

### Automation

**Job:** Workflow CRUD, approvals, execution log.

| Today | M5 |
|-------|-----|
| Create/edit workflows | Same |
| Manual run → audit | Real execution |

### Operations

**Job:** Queue depth, cache, AI provider telemetry.

### Administration

**Job:** Feature flags — in Settings nav for admins.

### Settings (18 screens)

Account, security, MFA, team, org, workspace, billing (stub), integrations (stub), privacy, legal acceptance, activity log, automation policies, AI controls, memory controls, data sources, goals, appearance, administration.

### Placeholders

Strategy Center, Knowledge, Marketplace — `ModulePlaceholder` with GIS Load state.

---

## 3. Public & auth journeys

```
Landing → Signup → Verify email → Onboarding (workspace) → App shell
Login → Session restore → Workspace select → Command Center
Forgot/reset password → Email (Resend/SMTP/console)
Invite accept → Join workspace
Legal pages → Public routes + acceptance API
```

**Onboarding:** Steps 4–5 (connect/initialize) cosmetic; skip works.

---

## 4. Closed-beta demo script

See `docs/build-2/launch-readiness-report.md` — full path landing → logout → reconnect.

---

## 5. Screen ID map (UXMD)

Public: PUB-01–07. Onboarding: ONB-01–06. Settings: SET-*. Intelligence: INT-*. Research: RSH-*. Automation: AUT-*.

Telemetry: `logScreenEvent` in feature screens.

---

*Next: [06 — Repository architecture](./06-repository-architecture.md)*
