# Development Memory

Institutional knowledge that must not live only in chat history.

Cross-reference: [product-master-spec](./product-master-spec.md) · [development-memory.md](./development-memory.md) · [`docs/build-2/`](../build-2/)

---

## Why Conquest exists

Organizations need a system that **perceives, understands, reasons, plans, verifies, and recommends** — not another chat window. Conquest treats intelligence as an operating system with governed phases, tenant-safe workspaces, and evidence-first outputs.

**First Law:** Conquest is never finished. Every interaction improves the OS.

---

## Build evolution

### Build-0 (2026-06) — Architecture freeze

- Frozen CCIS, AMD, PDD, UXMD, SDD, 38 ADRs, RTM
- Governance CI, threat model, runbooks, BAR template
- **Lesson:** Implementation without freeze produces unmergeable drift

### Build-1 (2026-06) — Platform foundation

- Authorized BAR-2026-06-26-001 for application shell, GIS, auth framework, platform modules
- Shipped: `apps/web` UXMD shell, `@conquest/platform` cognitive stack, domain services in `@conquest/auth`
- **Lesson:** BAR scope was shell + platform; cognitive landed in code ahead of formal Build-2 BAR — documented as scope expansion requiring governance reconciliation

### Build-2 (2026) — Integration-first production readiness

**Why Build-1 became Build-2:** Demo journeys failed on navigation guards, in-memory-only persistence, mock intelligence, and missing production ops. Build-2 prioritized *demonstrable integration* over new modules.

| Milestone | Key outcome | Lesson |
|-----------|-------------|--------|
| **M1** | Route access fixed; CC dashboard wired; cognitive via research analyze | Generalize GIS module paths — never hardcode nav exceptions |
| **M2** | Postgres via `DrizzleAuthRepository`; legal acceptance; email audit | `MEMORY_REPO` CI fallback essential when Docker unavailable |
| **M3** | Docker prod stack; env fail-fast; rate limit enforce; ops status | In-process rate limit OK for beta; Redis-distributed deferred |
| **M4** | Resend/SMTP email; Redis jobs; Playwright e2e; knowledge base | Repository must hold all knowledge — chat is ephemeral |
| **Recovery P1** | Audit found doc drift | Single truth requires active synchronization |
| **Recovery P2** | This document set | Permanent onboarding for humans and AI |

---

## Architectural decisions (why)

### Why execution remains disabled

- [ADR-0015](../architecture/adr/0015-execution-layer-separation.md): planning/orchestration ≠ execution
- `DecisionEngine` returns `executionReady: false` always
- `AutomationService.manualRun` writes audit records only
- **Reason:** Autonomous execution requires VRF, BAR gates B-25–B-28, and execution engine — M5 scope

### Why providers stay behind gateway

- [ADR-0011](../architecture/adr/0011-ai-provider-abstraction.md): no direct SDK coupling
- Stubs in dev; production SDK wiring deferred
- **Reason:** Provider swap, cost accounting, audit, and safety boundaries

### Why recommendation approval exists

- [ADR-0006](../architecture/adr/0006-verification-before-release.md): verification before user-facing release
- Users approve recommendation status via API
- **Reason:** Unverified intelligence damages trust and violates CCIS

### Why governance exists

- SDD-V Build Authorization prevents scope creep
- Build-0/1 BARs gate what may be implemented
- **Reason:** Cognitive OS complexity requires explicit authorization

### Why Prompt Registry exists

- Centralized prompt versions; no scattered strings in services
- **Reason:** Auditability, injection review, A/B and rollback

### Why evidence precedes reasoning

- [ADR-0031](../architecture/adr/0031-evidence-first-reasoning.md)
- `EvidenceEngine` feeds `ReasoningEngine` feeds `DecisionEngine`
- **Reason:** Explainable, challengeable intelligence

---

## Problems encountered

| Problem | Response |
|---------|----------|
| Postgres tests fail when Docker down | `postgres-probe.ts` + skip; CI uses `MEMORY_REPO=true` |
| Rate limit broke test suite | Skip enforcement when `NODE_ENV=test` / `VITEST` |
| Intelligence felt fake | Removed `ensureSeed`; honest empty states + cognitive analyze |
| Legal pages blocked logged-in users | Routes outside `RequireGuest` |
| Doc drift after fast milestones | Recovery Phase 2 synchronization |
| Playwright browser download timeout | CI installs Chromium; local may need `pnpm test:e2e:install` |

---

## Rejected approaches

| Approach | Why rejected |
|----------|--------------|
| Auto-seed intelligence mock data | Violates verification-first; replaced by cognitive pipeline |
| Synchronous-only cognitive for all paths | Job queue for `ai_request` async completion |
| `netlify-identity-widget` / `gotrue-js` | Deprecated; custom session model per ADR-0017 |
| PipelineRunner on API path | Legacy 10-phase prototype; `CognitiveOrchestrator` is Build-1 path |
| Immediate execution on manual run | Governance — audit-only until M5 |

---

## Current truth (post M4)

- **278** Vitest tests; Playwright e2e in CI
- **~96%** closed-beta demo readiness
- **~78%** production readiness (legal, RLS, HA, load test gaps)
- **Commit baseline:** Build-2 M4 on `main`

---

*Update this document when major decisions are made — not after the fact in chat only.*
