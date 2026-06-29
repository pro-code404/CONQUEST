# 08 — Failure Encyclopedia

**Institutional memory · Every known failure class, prevention, and architect lessons**

Failures are permanent knowledge unless disproven. This encyclopedia documents **symptoms, root causes, fixes, prevention, tests, ADRs, and lessons** for each failure class observed in Conquest Build-0 through Build-2 M4 and Recovery Phases 1–4.

**Cross-reference:** [16 Common Misconceptions](../project-brain/16-common-misconceptions.md) · [Preview Regression RCA](../build-2/preview-regression-rca.md) · [Engineering Constitution](../knowledge-base/engineering-constitution.md) · [Development Memory](../knowledge-base/development-memory.md)

---

## Table of contents

1. [Category error — AI wrapper](#1-category-error--ai-wrapper)
2. [ensureSeed fake intelligence](#2-ensureseed-fake-intelligence)
3. [RouterProvider context violation](#3-routerprovider-context-violation)
4. [In-memory persistence demo loss](#4-in-memory-persistence-demo-loss)
5. [Route guard blocking demos](#5-route-guard-blocking-demos)
6. [Rate limit headers-only](#6-rate-limit-headers-only)
7. [Execution without governance](#7-execution-without-governance)
8. [Provider SDK in UI](#8-provider-sdk-in-ui)
9. [Business logic in presentation](#9-business-logic-in-presentation)
10. [Memory writes bypassing manager](#10-memory-writes-bypassing-manager)
11. [Documentation drift — Recovery phases origin](#11-documentation-drift--recovery-phases-origin)
12. [CI vs production env mismatch — MEMORY_REPO](#12-ci-vs-production-env-mismatch--memory_repo)
13. [Appendix — Failure response playbook](#appendix--failure-response-playbook)

---

## 1. Category error — AI wrapper

### Symptoms

- Product described as "ChatGPT with a workspace"
- Features designed as single prompt → display response
- No evidence model in proposals
- Verification skipped "for speed"
- UI shows streaming chat as primary interaction
- Marketing/engineering conflates `@conquest/ai-gateway` with product identity

### Root cause

Industry norm conditions engineers to equate "AI product" with LLM wrapper. Conquest's multi-stage pipeline is invisible when stub providers return deterministic text quickly. `ResearchService.analyze` naming sounds like a single model call.

### Why it happened

- Gateway package existence suggests thin wrapper
- Dev stubs hide orchestrator complexity
- Pressure for demo-able "AI magic" quickly
- Insufficient onboarding on CCIS vs chat products

### Fix

- Reject chat-primary designs; enforce Command Center home (ADR-0002)
- Route all intelligence through `platform.cognitive.run` orchestrator
- Surface evidence refs, confidence, verification status in UI
- Onboarding: Project Brain 01, 16, institutional memory 02

### Prevention

| Control | Location |
|---------|----------|
| Architecture onboarding | [07 AI Onboarding Curriculum](./07-ai-onboarding-curriculum.md) Day 1, 3 |
| Misconception self-test | Project Brain Ch 16 |
| Code review checklist | No single-hop LLM in feature specs |
| UXMD | RTM-UX-009 structured Ask Conquest, not chat |

### Tests that catch it

- Cognitive orchestrator integration tests (stage order)
- Static: UI must not import `@conquest/cognitive`, `@conquest/platform`
- B-25 stage-order golden tests (open — must close for BAR)

### Related ADRs

- [ADR-0006](../architecture/adr/0006-verification-before-release.md) — Verification before release
- [ADR-0007](../architecture/adr/0007-ccis-cognitive-lifecycle-order.md) — Lifecycle order
- [ADR-0011](../architecture/adr/0011-ai-provider-abstraction.md) — Provider abstraction
- [ADR-0031](../architecture/adr/0031-evidence-first-reasoning.md) — Evidence first

### Lessons for architects

Category errors compound: each "quick AI feature" outside the pipeline makes the correct architecture harder to restore. **Reject wrapper patterns at design review**, not at PR review. The test question: "Which pipeline phase owns this, and what artifact does it produce?"

---

## 2. ensureSeed fake intelligence

### Symptoms

- Intelligence feed populated before any research analyze
- Recommendations appear in fresh workspace with no user action
- Demo looks credible but evidence chain is empty
- Stakeholders believe cognitive pipeline is live when viewing seed data
- Tests pass while product violates honest-empty law

### Root cause

Early Build-2 demo pressure led to `IntelligenceService.ensureSeed` injecting mock recommendations so Command Center did not look broken.

### Why it happened

- Empty CC zones felt "incomplete" for demos (B2-P1-01)
- Faster than wiring full research → analyze → feed path
- Misunderstanding of GIS-S1/S-EMPTY requirements

### Fix

- **Removed `ensureSeed` in M1**
- Intelligence feed empty until `POST .../research/sessions/:id/analyze` completes cognitive pipeline
- Command Center shows honest dormant state with CTA to research

### Prevention

| Control | Detail |
|---------|--------|
| GIS-S2 | Empty must be honest — no fabricated sample data |
| Code review | Ban seed/mock intelligence in production paths |
| Demo script | Document analyze step in launch readiness |
| Misconception 5 | Explicit false belief documentation |

### Tests that catch it

- `app.test.ts` Build-2 describe: feed empty before analyze
- Integration: analyze → recommendation appears with evidence refs
- Manual: fresh workspace → empty intelligence feed

### Related ADRs

- [ADR-0006](../architecture/adr/0006-verification-before-release.md)
- GIS empty state standard (UXMD-III)

### Lessons for architects

**Never trade trust for demo polish.** One seeded recommendation teaches users and stakeholders that Conquest fabricates intelligence. Honest empty states are a feature — they prove verification integrity.

---

## 3. RouterProvider context violation

### Symptoms

```
Conquest failed to load
Cannot destructure property 'basename' of 'React.useContext(...)' as it is null.
```

- Preview blocked (P0)
- Landing briefly visible then crash when cookie banner appears
- ErrorBoundary surfaces error after preview hardening

### Root cause

**`CookieConsentBanner` rendered `<Link>` from `react-router-dom` as sibling of `RouterProvider`, not descendant.**

Failure chain:

1. Banner mounts with `visible=false`
2. `useEffect` sets `visible=true` when no consent in `localStorage`
3. `<Link to={ROUTES.legal.cookies}>` calls `useContext(NavigationContext)` → null
4. Destructuring `basename` throws

### Why it happened

- M2 added cookie banner at App level for "global visibility"
- Engineer did not recognize router hook context requirement
- Latent defect — landing worked until banner became visible
- Unit tests did not render full React DOM tree

### Fix

| File | Change |
|------|--------|
| `App.tsx` | `RouterProvider` only — remove banner sibling |
| `RootLayout.tsx` | **New** — `Outlet` + banner inside router |
| `routes/index.tsx` | Wrap all routes in `RootLayout` |

### Prevention

| Control | Detail |
|---------|--------|
| Constitution rule 6 | No router APIs outside `RouterProvider` |
| `router-context.test.ts` | Static guard — banner not in App.tsx |
| `App.runtime.test.tsx` | Runtime with empty localStorage |
| `e2e/preview-routes.spec.ts` | Playwright smoke |
| Engineering constitution | Router rule documented |

### Tests that catch it

- **`App.runtime.test.tsx`** — clears localStorage, asserts banner without crash
- **`router-context.test.ts`** — composition static analysis
- **E2E preview smoke** — landing + cookie link

**Why prior tests missed it:**

| Test type | Gap |
|-----------|-----|
| Vitest unit (node) | No DOM render |
| `route-access.test.ts` | Pure functions, no Link |
| API tests | No frontend |
| E2E | Cookie timing; browser install gaps |

### Related ADRs

- Engineering constitution presentation §6 (operational rule, not ADR)

### Lessons for architects

**Global chrome using router APIs belongs in route layout (`RootLayout`), never beside `RouterProvider`.** Latent timing bugs hide until state changes — always add runtime composition tests for provider boundaries.

**Misconception 9 correction:** Recovery Phase 2 did **not** introduce this bug — documentation-only phase was falsely blamed.

---

## 4. In-memory persistence demo loss

### Symptoms

- All user data lost on API restart
- Demo signup works until server redeploy
- Sessions, workspaces, research vanish between CI runs
- Stakeholders conclude "Conquest is not production-ready" (correctly)

### Root cause

Pre-M2 architecture used in-memory repositories as default. No `DATABASE_URL` → ephemeral storage.

### Why it happened

- Build-1 prioritized shell and cognitive stack over persistence
- CI/Docker complexity deferred
- Demo environments restarted frequently exposing issue

### Fix

- **M2:** `DATABASE_URL` → `DrizzleAuthRepository`
- Sessions, workflows, research, legal acceptance persist in Postgres
- Docker prod stack in M3

### Prevention

| Control | Detail |
|---------|--------|
| Env validation | `validateApiEnvironment()` fail-fast |
| Production blockers | B2-P0-01 tracked until M2 resolved |
| Demo script | Document DATABASE_URL requirement |
| Never claim persistence without verification | production-blockers.md |

### Tests that catch it

- Integration tests with real Postgres in Docker CI
- `MEMORY_REPO=true` tests prove in-memory path explicitly scoped to CI
- Manual: restart API → session persists with DATABASE_URL

### Related ADRs

- [ADR-0016](../architecture/adr/0016-postgres-row-level-security.md) — RLS planned
- Repository abstraction patterns in SDD

### Lessons for architects

Distinguish **CI fallback** from **production architecture**. In-memory is a test convenience — document it loudly to prevent Misconception 6 ("everything in-memory").

---

## 5. Route guard blocking demos

### Symptoms

- Intelligence and Research nav items redirect to Command Center
- Demo script requires URL workarounds
- Closed-beta journey broken at research step
- B2-P0-02 blocker

### Root cause

`route-access.ts` and guards did not authorize member paths to intelligence/research modules — over-restrictive access matrix from Build-1 shell phase.

### Why it happened

- Build-1 shell wired nav before module routes finalized
- Access rules copied from placeholder phase
- Insufficient journey-driven testing

### Fix

- **M1:** Extended `route-access.ts` for intelligence/research paths
- Generalized GIS module path patterns — no hardcoded nav exceptions

### Prevention

| Control | Detail |
|---------|--------|
| Closed-beta journey e2e | M4 Playwright spec |
| route-access unit tests | Role × route matrix |
| Launch readiness journey table | Step-by-step assessment |

### Tests that catch it

- `route-access.test.ts` — pure function matrix
- `e2e/closed-beta-journey.spec.ts` — full path
- `app.test.ts` — integration flows

### Related ADRs

- [ADR-0003](../architecture/adr/0003-workspace-as-context.md) — Workspace context
- [ADR-0014](../architecture/adr/0014-module-boundaries.md) — Module boundaries

### Lessons for architects

**Test the demo journey, not just individual routes.** Access control bugs are product blockers even when API works. Fix in access layer — never nav hacks or hidden admin routes.

---

## 6. Rate limit headers-only

### Symptoms

- Rate limit headers present but requests not blocked
- Abuse possible despite "rate limiting implemented" claims
- B2-P1-06 partial blocker

### Root cause

Early M3 implementation emitted `X-RateLimit-*` headers without enforcing 429 responses in all paths.

### Why it happened

- Incremental delivery: observability before enforcement
- Miscommunication of "partial" status in reports

### Fix

- **M3:** 120 req/min per IP enforced in-process on `/api/*`
- Redis-distributed upgrade planned post-beta

### Prevention

| Control | Detail |
|---------|--------|
| Constitution rule 33 | Never disable rate limiting in production |
| Integration test | 429 after threshold |
| production-blockers | Honest partial → resolved status |

### Tests that catch it

- API middleware tests exceeding limit → 429
- Load test in staging (manual)

### Related ADRs

- SDD-V operational standards

### Lessons for architects

**Headers without enforcement is not a feature — document as partial.** Security controls need test proof, not configuration presence.

---

## 7. Execution without governance

### Symptoms

- Workflow "run" appears to execute but only writes audit
- Feature requests to "just enable executionReady"
- User expectation mismatch on automation module
- Risk of autonomous side effects if engineer bypasses gates

### Root cause

Execution layer intentionally disabled: `Decision.window` false in `DecisionEngine`; M5 not authorized.

### Why it happened

- Product language "automation" implies execution
- Cognitive stack completeness confused with execution authorization
- Missing BAR for Build-2 M5

### Fix

- **No code fix until gated** — product honesty: manual run shows deferred message
- Governance path: Build-2 BAR + B-25–B-28 + M5 slices 5A–5D

### Prevention

| Control | Detail |
|---------|--------|
| ADR-0015 | Execution layer separation |
| Constitution rules 21–22, 36 | executionReady and manualRun |
| B-28 | Learning → execution isolation |
| Launch readiness B2-P1-03 | Documented as post-BAR |

### Tests that catch it

- Orchestrator tests assert `executionReady: false`
- B-26 VRF bypass tests (open)
- Manual run returns audit-only payload

### Related ADRs

- [ADR-0015](../architecture/adr/0015-execution-layer-separation.md)
- [ADR-0009](../architecture/adr/0009-learning-boundary.md)
- [ADR-0006](../architecture/adr/0006-verification-before-release.md)

### Lessons for architects

**Planning ≠ execution.** Users must see honest deferred states. Enabling execution without BAR is a constitution violation — worse than missing feature.

---

## 8. Provider SDK in UI

### Symptoms

- `openai`, `@anthropic-ai/sdk`, or `@google/genai` in `apps/web` dependencies
- API keys in browser bundle risk
- Streaming chat implemented client-side
- B-27 gate failure

### Root cause

Engineer familiar with LLM SDKs defaults to client-side integration for "speed."

### Why it happened

- Industry pattern: frontend calls OpenAI directly
- Misunderstanding of ADR-0011 gateway boundary

### Fix

- Remove SDK from web; route through API → platform → `@conquest/ai-gateway`
- Structured intelligence via REST, not client streaming

### Prevention

| Control | Detail |
|---------|--------|
| Constitution rules 3, 16 | No cognitive/platform in UI; gateway only |
| B-27 | Static analysis — no client SDK |
| Dependency audit | CI check web package.json |

### Tests that catch it

- B-27 static analysis (planned/open)
- `pnpm why openai` in apps/web → must fail
- Secret scanning

### Related ADRs

- [ADR-0011](../architecture/adr/0011-ai-provider-abstraction.md)
- [ADR-0019](../architecture/adr/0019-secrets-management-strategy.md)

### Lessons for architects

**The browser is untrusted.** Provider keys, prompt assembly, and audit belong server-side behind gateway. UI fetches typed contracts only.

---

## 9. Business logic in presentation

### Symptoms

- Complex conditionals in React components determining authorization or intelligence logic
- Duplicate validation in web and API
- Untestable UI components
- Tenant checks in presentation layer

### Root cause

Pressure to ship UI quickly without API endpoints; "just this once" logic in components.

### Why it happened

- Split codebase unfamiliarity
- Missing API for every UI action in early builds

### Fix

- Move logic to `services/auth` or platform services
- Presentation renders props and dispatches actions via `fetch`
- API validates with Zod contracts

### Prevention

| Control | Detail |
|---------|--------|
| Constitution rules 1, 6 | Presentation render-only; no duplicate domain in API |
| Layer review | `packages/presentation` — callbacks only |
| ENG-12 package boundaries |

### Tests that catch it

- Domain unit tests in services (not UI)
- API integration tests for business rules
- Lint/architecture rules (future)

### Related ADRs

- [ADR-0014](../architecture/adr/0014-module-boundaries.md)
- SDD layer separation

### Lessons for architects

**If it's a business rule, it lives in a service.** UI duplication guarantees drift between what user sees and what API enforces.

---

## 10. Memory writes bypassing manager

### Symptoms

- Direct writes to memory stores from engines or services
- Inconsistent memory lifecycle
- AMD III violations
- Untraceable memory mutations

### Root cause

Engineer adds "quick cache" or session store without routing through `CognitiveMemoryManager`.

### Why it happened

- Memory manager indirection feels heavy for prototypes
- Unclear sole-write rule during Build-1 spikes

### Fix

- Route all memory mutations through `CognitiveMemoryManager`
- Remove parallel write paths

### Prevention

| Control | Detail |
|---------|--------|
| ADR-0008 | Memory governance |
| Constitution rule 12 | No direct memory writes |
| Code review grep | `.memory.` write sites |

### Tests that catch it

- Memory manager integration tests
- Grep audit in CI (future)

### Related ADRs

- [ADR-0008](../architecture/adr/0008-memory-governance.md)

### Lessons for architects

Memory is **compression of verified patterns**, not a junk drawer. Sole-write enables audit, promotion rules, and learning boundary enforcement.

---

## 11. Documentation drift — Recovery phases origin

### Symptoms

- Docs say in-memory; code uses Postgres
- Docs blame Recovery Phase 2 for routing bug
- New agents read stale knowledge-base and implement wrong patterns
- Recovery Phase 1 audit found widespread drift

### Root cause

Implementation outpaced documentation during Build-2 M1–M4 sprints. Chat history held truth not in repo.

### Why it happened

- **First Law tension:** code moved faster than institutional memory
- No mandatory doc update gate on milestone close
- False attribution easier than RCA (Phase 2 blamed for routing)

### Fix

- **Recovery Phases 1–4:** Project Brain, institutional memory, knowledge-base sync
- Preview RCA explicitly clears Recovery Phase 2 routing blame
- AGENTS.md + README program state banners

### Prevention

| Control | Detail |
|---------|--------|
| Recovery phase process | Doc sync mandatory on milestone |
| IMPLEMENTATION.md banner | Current build state |
| Milestone reports | M1–M4 completion docs |
| Bidirectional links | institutional memory ↔ project brain |

### Tests that catch it

- [`architectural-continuity-test.md`](../project-brain/architectural-continuity-test.md)
- [`recovery-phase-4-validation.md`](../project-brain/recovery-phase-4-validation.md)
- Cross-reference validation artifact

### Related ADRs

- ENG-20 documentation standards (SDD-V)

### Lessons for architects

**The repository is the engineering brain — chat is ephemeral.** When code changes behavior, update Project Brain, institutional memory, or knowledge-base in the same PR wave. Document *why* Recovery phases exist: prevent repeat drift.

---

## 12. CI vs production env mismatch — MEMORY_REPO

### Symptoms

- CI passes; production behaves differently
- Tests use in-memory repo; production uses Postgres
- Engineer sets `MEMORY_REPO=true` locally thinking it's "easier"
- Startup failure if MEMORY_REPO in production env

### Root cause

Dual persistence mode for CI when Docker/Postgres unavailable. Environment variable semantics unclear to new agents.

### Why it happened

- M2 introduced Postgres with CI fallback requirement
- Essential for 278 tests without Docker dependency

### Fix

- `MEMORY_REPO=true` explicitly scoped to CI/test injection
- Production validation rejects MEMORY_REPO
- `createApiApp({ repo, persistenceMode })` for test control

### Prevention

| Control | Detail |
|---------|--------|
| Constitution rule 14 | Never MEMORY_REPO in production |
| `validateApiEnvironment()` | Fail-fast |
| ai-agent-onboarding | Document test injection pattern |
| development-memory M2 lesson | CI fallback essential |

### Tests that catch it

- Env validation unit tests
- CI runs with MEMORY_REPO explicitly
- Production config integration test (staging)

### Related ADRs

- [ADR-0019](../architecture/adr/0019-secrets-management-strategy.md) — env handling

### Lessons for architects

**Two persistence paths require loud documentation.** CI convenience must never become silent production path. Tests prove in-memory; staging proves Postgres.

---

## Appendix — Failure response playbook

When a new failure is discovered:

1. **Classify** — map to existing entry or create new class
2. **Symptom log** — exact error, user impact, severity (P0–P2)
3. **Root cause** — code path, not blame narrative
4. **RCA document** — if P0/P1, write dated RCA in `docs/build-2/`
5. **Fix** — minimal correct diff
6. **Prevention** — test + constitution/rule + onboarding update
7. **Institutional memory** — update this encyclopedia
8. **Misconception check** — add to Ch 16 if false belief emerges

### Severity guide

| Level | Definition | Example |
|-------|------------|---------|
| P0 | Blocks preview, auth, or data integrity | RouterProvider crash |
| P1 | Degrades demo journey or security partial | Route guard block |
| P2 | Post-beta polish | Placeholder modules |

### Cross-links

| Document | Purpose |
|----------|---------|
| [06 UX Intelligence Bible](./06-ux-intelligence-bible.md) | UX failure patterns |
| [07 AI Onboarding Curriculum](./07-ai-onboarding-curriculum.md) | Prevention through training |
| [09 Future Vision Encyclopedia](./09-future-vision-encyclopedia.md) | Risks not yet failures |

---

*Institutional memory document 08 — Failure Encyclopedia. New entries append via governance record.*
