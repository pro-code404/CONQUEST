# Build-2 Implementation Roadmap

**Strategy:** Integration-first — every milestone must leave Conquest more demonstrable than before.  
**Baseline:** B2-M4 complete · 278 tests · Build-1 BAR active  
**Companion:** [integration-matrix.md](./integration-matrix.md) · [production-blockers.md](./production-blockers.md)

---

## Mission

> Does this move Conquest closer to a production-ready, demonstrable platform?

Build-2 does **not** expand infrastructure unless it unblocks production. Implementation takes priority over architectural perfection.

---

## Milestone Overview

| Milestone | Theme | Demo impact | Target blockers |
|-----------|-------|-------------|-----------------|
| **B2-M1** | Integration fixes + persistence foundation | Journey navigable; data survives restart | P0-01, P0-02, P0-08, P0-12 |
| **B2-M2** | Real intelligence + Command Center | Credible recommendations in CC | P0-04, P0-03, P1-10 |
| **B2-M3** | Production hardening | Staging-deployable | ~~P0-09, P1-11–16~~ **Complete** |
| **B2-M4** | Closed-beta ready | Full demo + E2E + KB | ~~P0-03, P0-11, P1-11–12~~ **Complete** |
| **B2-M5** | Execution boundary (gated) | Approve → execute workflow | B-25–B-28, execution engine |

Each milestone maintains green CI: `pnpm build && pnpm typecheck && pnpm test`.

---

## B2-M1 — Integration Fixes & Persistence Foundation

**Goal:** Fix navigation blockers and establish durable storage.

### Slice 1A — Route access fix
- Extend `isKnownNavSegment` / `parseWorkspaceRoute` to allow `intelligence`, `research`, `operations`
- Add deep-link pattern for nested routes with consistent guard behavior
- Tests: `route-access.test.ts` for all module home paths
- **Unblocks:** Demo steps 9–10, B2-P0-02

### Slice 1B — Navigation discoverability
- Add Administration to `SETTINGS_CATEGORIES` (admin+ role)
- Add Command Center links to intelligence feed (per UXMD CC entry pattern)
- Footer legal links on landing page
- **Unblocks:** B2-P1-01, B2-P0-08

### Slice 1C — Postgres repository
- Implement `DrizzleAuthRepository` implementing existing repo interface
- Wire `createDb()` in `apps/api` bootstrap; feature-flag `MEMORY_REPO` for CI fallback
- Migrate: users, orgs, workspaces, sessions, settings
- **Unblocks:** B2-P0-01, B2-P0-10

### Slice 1D — Session durability
- Wire `services/session` `SessionManager` with Postgres adapter
- Replace in-memory session map in auth repository
- **Unblocks:** B2-P0-10, reconnect demo step

### Exit criteria
- [ ] Intelligence/research/operations home routes load
- [ ] Data survives API restart
- [ ] Administration visible in settings for admins
- [ ] CI green with Postgres in integration test config

---

## B2-M2 — Real Intelligence & Command Center

**Goal:** Replace mock intelligence with cognitive pipeline output; populate Command Center.

### Slice 2A — Cognitive → Intelligence bridge
- On intelligence feed request: invoke `CognitiveOrchestrator` or cache cognitive output
- Replace `IntelligenceService.ensureSeed` with pipeline-backed recommendations
- Wire evidence references into recommendation detail view
- **Unblocks:** B2-P0-04, B2-P1-10

### Slice 2B — Command Center integration
- Bind CC zones (Recommendations, Alerts) to intelligence feed API
- Transition CC from dormant when intelligence data exists
- **Unblocks:** B2-P0-12

### Slice 2C — Research → Cognitive input
- Research session sources feed cognitive evidence collection
- Research session creation triggers cognitive run (async job)
- **Unblocks:** Demo research step

### Slice 2D — Recommendation approval flow
- Verify approve/modify/defer flows persist with audit trail
- Connect approval status to Command Center state
- Maps to RTM-PDD-004 (Specified → In Build)

### Exit criteria
- [ ] Recommendations originate from cognitive pipeline (not seed)
- [ ] CC shows live recommendations when data exists
- [ ] Evidence visible in recommendation detail
- [ ] Approve flow updates status with audit record

---

## B2-M3 — Production Hardening

**Goal:** Staging-deployable with real external integrations.

### Slice 3A — Email notifications
- Notification service for verify, invite, password reset
- Environment-configured provider (SMTP/Resend/SendGrid)
- **Unblocks:** B2-P0-03

### Slice 3B — Redis + job queue
- Bootstrap `REDIS_URL` → Redis client → `createPlatformServices({ redisClient })`
- Evaluate external job store for cognitive async + privacy jobs
- **Unblocks:** B2-P1-11, B2-P1-12

### Slice 3C — AI provider adapters
- Replace `createStubProviders()` with SDK adapters behind kill switch
- Wire real provider calls into cognitive pipeline (where deterministic path ends)
- **Unblocks:** B2-P1-13

### Slice 3D — Rate limiting enforcement
- Redis-backed rate limiter; return 429 on threshold
- **Unblocks:** B2-P0-09

### Slice 3E — Observability expansion
- Wire `runWithTraceContext` from API middleware through cognitive pipeline
- Structured log sink configuration for staging
- **Unblocks:** B2-P1-16, B2-P1-17

### Exit criteria
- [ ] Emails delivered in staging
- [ ] Redis cache active when `REDIS_URL` set
- [ ] Rate limit returns 429 in test
- [ ] At least one real AI provider callable (staging keys)

---

## B2-M4 — Closed-Beta Ready

**Goal:** Complete demo script executable by non-engineers.

### Slice 4A — Legal production pass
- Counsel-reviewed Privacy, Terms, Cookies, AI Transparency
- Cookie consent banner (Document X §4.5)
- Legal routes accessible to all users (not guest-only)
- **Unblocks:** B2-P0-05–07

### Slice 4B — E2E demo test
- Playwright test covering full demo script (launch readiness report)
- Run in CI against test API + web
- **Unblocks:** B2-P0-11

### Slice 4C — Privacy compliance workflow
- Privacy export generates downloadable artifact (background job)
- Deletion request queues and executes per retention policy
- **Unblocks:** B2-P1-05, B2-P1-20–22

### Slice 4D — Analytics credibility
- Replace KPI formula with aggregated metrics from real data
- Basic chart rendering via `@conquest/visualization-config`
- **Unblocks:** B2-P1-03, B2-P2-05

### Slice 4E — Master docs (remaining)
- Author `docs/master/mbdm.md`, `maf.md`, `mta.md`, `mprd.md`, `mir.md` per consolidation plan
- Refresh stale README indexes and ADR index through 0038

### Exit criteria
- [ ] Full demo script passes E2E
- [ ] Legal pages production-ready
- [ ] Privacy export produces file
- [ ] Master docs authored

---

## B2-M5 — Execution Boundary (Governance-Gated)

**Do not start until B-12 and B-25–B-28 gates close.**

### Slice 5A — Build-2 authorization
- Close PDD-I Authority Bridge open rows
- Issue Build-2 BAR
- Add RTM contract tests for stage order, VRF, provider boundary

### Slice 5B — Automation execution engine
- Replace audit-only `manualRun` with real execution
- Workflow trigger → job queue → execution → outcome record
- Maps to RTM-PDD-005, RTM-INT-006

### Slice 5C — Decision execution gate
- Lift `executionReady: false` with VRF approval workflow
- User approve → execute → measure outcome (RTM-PDD-004–005)

### Slice 5D — Ask Conquest UI
- Structured intelligence query UI (RTM-UX-009)
- Web client for `/cognitive/run` with evidence display

### Exit criteria
- [ ] Build-2 BAR issued
- [ ] Automation manual run executes workflow steps
- [ ] Approved recommendation can trigger bounded execution
- [ ] Ask Conquest issues cognitive request from UI

---

## Continuous Requirements (every milestone)

| Requirement | Enforcement |
|-------------|-------------|
| Green CI | `pnpm build && pnpm typecheck && pnpm test` after every slice |
| Tenant isolation | Integration tests for cross-org 403 |
| No architectural shortcuts | ADR for any layer change |
| RTM updates | Mark rows Verified when test evidence exists |
| Deterministic cognitive path | No autonomous execution until M5 gate |
| Integration matrix update | Refresh `docs/build-2/integration-matrix.md` on wiring changes |

---

## RTM Verification Targets (Build-2)

| RTM area | Current | Build-2 target |
|----------|---------|----------------|
| RTM-INT-* (12-stage loop) | Specified | In Build (M5) |
| RTM-MEM-* (memory manager) | Specified | Verified (M1–M2) |
| RTM-PDD-004–006 (decision/execution) | Specified | In Build (M5) |
| RTM-UX-009 (Ask Conquest) | Specified | In Build (M5) |
| RTM-ENG-003–007 | Specified | Verified (M3) |
| COG-* cognitive | In Build | Verified (M2) |
| Total Verified rows | 9/78 | 25+ by M4 |

---

## What Build-2 explicitly defers

- Knowledge, Strategy, Marketplace modules (PDD Build-3 scope unless demo requires)
- 12-stage CCIS full loop replacement of CognitiveOrchestrator (evaluate in M5)
- Legacy `PipelineRunner` un-quarantine (reference only until coordinator decision)
- Marketplace, advanced enterprise (Build-3 per RTM Part H)
- Horizontal multi-instance cognitive lifecycle (document constraint; fix in scale phase)

---

## Success Definition

Build-2 is complete when:

1. Closed-beta demo script passes E2E without workarounds
2. Data persists across restarts (Postgres)
3. Intelligence recommendations originate from cognitive pipeline
4. Command Center displays live intelligence
5. Legal and cookie compliance production-ready
6. Staging deployment with Redis, email, and at least one real AI provider
7. Build-2 BAR issued and M5 execution boundary verified (if authorized)

---

*First actionable slice: **B2-M1 Slice 1A** (route access fix) — zero infrastructure expansion, immediate demo improvement.*
