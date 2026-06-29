# Build-2 Launch Readiness Report

**Audience:** Closed-beta preparation  
**Baseline:** B2-M4 Closed Beta Completion · 278 tests · Build-1 BAR active  
**Date:** 2026-06-21 (updated post-M4)

> **M4 delta:** Demo readiness ~96% (was ~92%). Resend/SMTP email, Redis job queue, Playwright e2e, dependency probes, knowledge base. See [m4-closed-beta-completion-report.md](./m4-closed-beta-completion-report.md).

---

## Target Journey

```
Landing → Signup → Verify email → Create workspace → Onboarding
  → Settings → Automation → Research → Intelligence → Command Center
  → Administration → Logout → Reconnect (session restored)
```

---

## Journey Step Assessment

| Step | Can demo today? | Blocker severity | Notes |
|------|-----------------|----------------|-------|
| Landing | Yes | Low | Legal footer links on landing (M1) |
| Create account | Yes | Low | Dev verification token returned in non-prod |
| Verify email | Yes | Low | Email sent via `NotificationService` (console in dev) |
| Create workspace | Yes | — | ONB-03 calls `completeOnboarding` |
| Complete onboarding | Partial | Medium | Steps 4–5 cosmetic; skip works |
| Configure workspace | Yes | Low | Settings + workspace config wired |
| Invite member | Partial | Medium | API + email delivery; SMTP provider for production |
| Create automation | Yes | — | Full CRUD; member+ role required |
| Run research session | Yes | Low | Home route accessible; analyze triggers cognitive pipeline (M1) |
| Receive intelligence recommendation | Yes | Low | Cognitive-backed after research analyze; honest empty before (M1) |
| Review evidence | Partial | Medium | Evidence refs in recommendation detail; no dedicated evidence screen |
| Approve recommendation | Yes | Low | `POST .../recommendations/:id/status` wired |
| View command center | Yes | Low | Integrated dashboard zones; honest empty states (M1) |
| Modify settings | Yes | — | 18 settings screens wired |
| Administration | Yes | Low | Screen + API; in settings nav for admins (M1) |
| Logout | Yes | — | Session revoked |
| Reconnect / session restored | Yes | Low | Login + cookie restore; sessions durable in Postgres (M2) |

**Overall demo readiness: ~96%** — email providers, Redis jobs, Playwright e2e, degradation probes, and knowledge base complete. Legal counsel review and automation execution remain.

---

## P0 Blockers (must fix for closed beta)

| ID | Blocker | Impact | Fix |
|----|---------|--------|-----|
| B2-P0-01 | **No durable persistence** | All data lost on restart | ~~Wire database~~ **Resolved M2** — set `DATABASE_URL` |
| B2-P0-02 | **Intelligence/research route guard** | Demo paths redirect to CC | ~~Extend route-access.ts~~ **Resolved M1** |
| B2-P0-03 | **No email delivery** | Verify/invite/reset broken in prod | ~~SMTP adapter deferred~~ **Resolved M4** — Resend + SMTP + console via `createEmailProvider()` |
| B2-P0-04 | **Intelligence data is seeded mock** | Recommendations not credible | ~~Cognitive pipeline~~ **Partial M1** — via research analyze |
| B2-P0-05 | **Legal pages are drafts** | Cannot launch without counsel review | **Partial M2** — versioned + acceptance API; counsel review required |
| B2-P0-06 | **No cookie consent** | Document X / GDPR gap | ~~Cookie banner~~ **Resolved M2** |

---

## P1 Blockers (closed beta quality)

| ID | Blocker | Impact | Fix |
|----|---------|--------|-----|
| B2-P1-01 | Command Center zones empty | CC feels incomplete | ~~Wire intelligence feed~~ **Resolved M1** |
| B2-P1-02 | Administration not in nav | Ops users cannot discover | ~~Add to SETTINGS_CATEGORIES~~ **Resolved M1** |
| B2-P1-03 | Automation run is audit-only | "Run workflow" does nothing real | Execution engine (post-BAR) |
| B2-P1-04 | No E2E test for demo journey | Regression risk | ~~Playwright/Cypress full flow~~ **Resolved M4** — `e2e/closed-beta-journey.spec.ts` in CI |
| B2-P1-05 | Analytics charts deferred | Reports module incomplete | Visualization layer |
| B2-P1-06 | Rate limiting non-enforcing | Abuse risk | **Partial M3** — 120 req/min enforced in-process; Redis-distributed upgrade planned |
| B2-P1-07 | Legal routes guest-only | Logged-in users cannot read policies | ~~Public legal route group~~ **Resolved M2** |

---

## P2 Blockers (post-beta polish)

| ID | Blocker | Fix |
|----|---------|-----|
| B2-P2-01 | Knowledge/Strategy/Marketplace placeholders | Module implementation per PDD |
| B2-P2-02 | Onboarding connect/initialize cosmetic | Real connector flows |
| B2-P2-03 | Privacy export/deletion jobs | Background worker + compliance |
| B2-P2-04 | Billing/integrations OAuth | External provider wiring |
| B2-P2-05 | Cognitive web UI | Ask Conquest (RTM-UX-009) |
| B2-P2-06 | Redis not bootstrapped | `REDIS_URL` → platform | **Partial M4** — Redis cache/jobs when `REDIS_URL` set; in-memory CI fallback |
| B2-P2-07 | Distributed tracing | Wire `runWithTraceContext` |

---

## Demo Script (current — no route workarounds)

1. **Signup** at `/signup` — copy `verificationToken` from response (dev)
2. **Verify** at `/verify-email` — paste token
3. **Onboarding** — complete workspace step; skip connect/initialize
4. **Command Center** — primary nav; observe zone empty states
5. **Research** — navigate to `/app/w/{id}/research`; create session; **Run cognitive analysis**
6. **Recommendation** — follow link from session; review evidence-backed detail
7. **Intelligence** — `/app/w/{id}/intelligence` — feed populated after analysis
8. **Command Center** — refresh; recommendations zone shows live items
9. **Automation** — create workflow; manual run shows deferred-execution message
10. **Administration** — Settings → Administration (admin role)
11. **Logout** — AppShell menu
12. **Reconnect** — `/login`; session cookie restores workspace

---

## Test Coverage vs Demo

| Area | Unit/API tests | E2E demo test |
|------|----------------|---------------|
| Auth lifecycle | Yes (`app.test.ts`) | No |
| Onboarding guards | Yes (`route-access.test.ts`) | No |
| Automation CRUD | Yes | No |
| Intelligence API | Yes | No |
| M1 integration flow | Yes (`app.test.ts` Build-2 describe) | No |
| Cognitive pipeline | Yes (orchestrator, platform) | No |
| Full demo journey | Yes (`e2e/closed-beta-journey.spec.ts`) | **Resolved M4** |

---

## Governance Gate

Build-2 implementation is **authorized by this directive** but formal BAR gates remain open per SDD-V:

- **B-12** — PDD-I v2.1 Authority Bridge open rows
- **B-25–B-28** — Intelligence contract tests (stage order, VRF, provider boundary, learning boundary)

Close governance gates before treating execution or CCIS-fidelity work as production-complete.

---

*Companion: [integration-matrix.md](./integration-matrix.md) · [production-blockers.md](./production-blockers.md)*
