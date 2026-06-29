# Conquest Master Spec

Highest-level consolidated specification. **This document summarizes** authoritative corpora; on conflict, higher-order sources win per [ADR-0001](../architecture/adr/0001-document-authority-hierarchy.md).

Cross-reference: [product-knowledge](./product-knowledge.md) · [architecture-reference](./architecture-reference.md) · [adr-index](./adr-index.md) · [`docs/build-2/`](../build-2/)

---

## 1. Product definition

### Vision

Conquest is an **Adaptive Cognitive Intelligence Operating System (CIOS)** that transforms every user interaction through a continuous intelligence pipeline — from perception through memory evolution.

**Sources:** [CCIS](../architecture/ccis.md) · [PDD Volume I](../pdd/pdd-volume-i-authority-bridge.md) · [UXMD Volume I](../uxmd/volume-i-user-experience-master-document.md)

### Product promise

Users land in a **Command Center** that synthesizes live intelligence into decision-ready awareness. They research, receive evidence-backed recommendations, govern automation, and operate with tenant-safe, verification-first AI.

**Not:** a chatbot, generic dashboard, or engine catalog UI.

### Primary navigation (frozen)

1. Command Center · 2. Intelligence · 3. Research · 4. Automation · 5. Strategy Center · 6. Operations · 7. Settings

**Sources:** [ADR-0002](../architecture/adr/0002-command-center-as-home.md) · [ADR-0005](../architecture/adr/0005-seven-item-primary-navigation.md) · [UXMD Volume II](../uxmd/volume-ii-screen-interaction-specification.md)

---

## 2. Technical definition

### Architecture style

- **Monorepo:** `apps/api`, `apps/web`, `packages/*`, `services/*`
- **API:** Hono HTTP server, session cookies, 100 REST routes
- **Persistence:** PostgreSQL via Drizzle (`DATABASE_URL`); memory fallback for CI
- **Cache/queue:** Redis optional (`REDIS_URL`); in-memory fallback
- **Cognitive:** Orchestrated pipeline — evidence → reasoning → decision → verification
- **AI:** Provider abstraction via `@conquest/ai-gateway`

**Sources:** [SDD Volume I](../sdd/volume-i-system-architecture.md) · [SDD Volume II](../sdd/volume-ii-data-intelligence-architecture.md) · [system-overview](./system-overview.md)

### Cognitive lifecycle (canonical)

CCIS twelve-stage order frozen in [ADR-0007](../architecture/adr/0007-ccis-cognitive-lifecycle-order.md). Runtime expression: ten-phase pipeline in [cognitive-pipeline.md](../architecture/cognitive-pipeline.md).

| Phase | Output artifact |
|-------|-----------------|
| Perception | ObservationContext |
| Human Understanding | HumanContext + CommunicationStrategy |
| Context Reconstruction | ReconstructedContext |
| Goal Reasoning | SuccessCriteria |
| Strategy Planning | ExecutionPlan |
| Intelligence Orchestration | OrchestrationResult |
| Verification | VerificationReport |
| Execution | ExecutionResult |
| Reflection | ReflectionRecord |
| Memory Evolution | MemoryDelta |

### Layer model

| SDD layer | Implementation |
|-----------|----------------|
| Presentation | `apps/web`, `@conquest/presentation`, `@conquest/gis` |
| Application | `apps/api` |
| Domain | `@conquest/auth` services |
| Intelligence platform | `@conquest/platform`, `@conquest/cognitive` |
| Infrastructure | `@conquest/database`, `@conquest/cache`, `@conquest/jobs` |

**Source:** [AMD Volume II](../architecture/amd/volume-ii-architectural-layer-model.md) · [ADR-0014](../architecture/adr/0014-module-boundaries.md) · [ADR-0015](../architecture/adr/0015-execution-layer-separation.md)

---

## 3. Requirements traceability

Requirements are tracked in the [Requirements Traceability Matrix (RTM)](../architecture/requirements-traceability-matrix.md).

| Status | Meaning |
|--------|---------|
| Specified | In PDD/UXMD/RTM |
| In Build | Active BAR scope |
| Implemented | Verified in codebase |
| Deferred | Post-beta or gated |
| Planned | Not yet in build |

**Build-2 integration matrix:** [`docs/build-2/integration-matrix.md`](../build-2/integration-matrix.md)

---

## 4. Governance & build authorization

### Document hierarchy

```
CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → RTM → Architecture Freeze → BAR → Build
```

### Build records

| Build | Record | Status |
|-------|--------|--------|
| Build-0 | [BAR 2026-06-21](../governance/build-authorization-record-build-0-2026-06-21.md) | Complete |
| Build-1 | [BAR 2026-06-26](../governance/build-authorization-record-build-1-2026-06-26.md) | Authorized — M1 in progress |
| Build-2 | Integration-first strategy (2026-06-27) | Active program |

**Engineering standards:** [SDD Volume V](../sdd/volume-v-engineering-standards-build-governance.md)

### Architecture freeze

[ARCHITECTURE-FREEZE.md](../architecture/ARCHITECTURE-FREEZE.md) — v1.0 frozen. Changes require ADR + governance review.

---

## 5. Security & compliance

| Area | Specification | Implementation |
|------|---------------|----------------|
| Tenant isolation | [ADR-0016](../architecture/adr/0016-tenant-isolation-strategy.md) | `cognitiveScope()`, repository org checks |
| Identity | [ADR-0017](../architecture/adr/0017-identity-session-model.md) | httpOnly session cookies, Drizzle sessions |
| Secrets | [ADR-0019](../architecture/adr/0019-secrets-management-strategy.md) | `validateApiEnvironment()` |
| Encryption | [ADR-0018](../architecture/adr/0018-encryption-key-custody.md) | Password hashing, MFA secrets |
| Trust boundaries | [ADR-0020](../architecture/adr/0020-infrastructure-trust-boundaries.md) | Docker network isolation |
| Incident response | [ADR-0024](../architecture/adr/0024-security-incident-response.md) | Runbooks in `docs/operations/runbooks/` |
| AI safety | [ADR-0035](../architecture/adr/0035-ai-safety-boundaries.md) | Prompt security, gateway boundaries |
| Legal / GDPR | [Document X](../uxmd/document-x-product-experience-operational-details.md) | LegalService, cookie consent API |

**Threat model:** [`docs/operations/threat-model-review-v1.0.md`](../operations/threat-model-review-v1.0.md)

---

## 6. Production & operations

### Readiness gate

[ADR-0025](../architecture/adr/0025-production-readiness-gate.md) · [production-acceptance-report](../build-2/production-acceptance-report.md) (when present)

**Current readiness: ~92%** for closed-beta demo per [launch-readiness-report](../build-2/launch-readiness-report.md).

### Infrastructure (post M3)

| Component | Spec | Implementation |
|-----------|------|----------------|
| API container | `Dockerfile.api` | Hono + Node 20 |
| Web container | `Dockerfile.web` | Vite static + nginx |
| Database | Postgres 16 | `docker-compose.prod.yml` |
| Cache/queue | Redis 7 | Optional `REDIS_URL` |
| Health | k8s-style probes | `/api/health/live`, `/api/health/ready` |
| Backup | [ADR-0021](../architecture/adr/0021-disaster-recovery-strategy.md) | `PostgresBackupProvider`, 24h scheduler in prod |
| Observability | [ADR-0023](../architecture/adr/0023-monitoring-observability-strategy.md) | `/api/ops/status`, metrics collectors |
| Rate limiting | 120/min/IP | `createRateLimitMiddleware` |
| Email | Transactional | Resend, SMTP, console providers |

**Deploy guide:** [`docs/operations/deployment.md`](../operations/deployment.md) · [`docs/build-2/deployment-checklist.md`](../build-2/deployment-checklist.md)

### HA & DR (target state)

[ADR-0022](../architecture/adr/0022-high-availability-model.md) · [ADR-0021](../architecture/adr/0021-disaster-recovery-strategy.md) · [`docs/operations/dr-drill-plan-v1.0.md`](../operations/dr-drill-plan-v1.0.md)

Single-region Docker compose is current beta topology; multi-region HA is roadmap.

---

## 7. Scaling considerations

| Dimension | Beta | Production target |
|-----------|------|-------------------|
| API | Single instance | Horizontal replicas behind load balancer |
| Postgres | Single node | Managed Postgres, read replicas for analytics |
| Redis | Single instance | Redis Cluster for cache + job queue |
| AI providers | Gateway abstraction | Multi-provider routing, circuit breakers ([ADR-0034](../architecture/adr/0034-ai-failure-recovery.md)) |
| Cognitive | Sync + async jobs | Queue workers scale independently |
| Rate limits | In-memory per instance | Redis-backed distributed limiter |

**Cognitive operational limits:** [cognitive-operational-limits.md](../architecture/cognitive-operational-limits.md)

---

## 8. Build-2 program summary

**Mission:** Integration-first — production readiness over feature count.

| Milestone | Delivered | Demo % |
|-----------|-----------|--------|
| B2-M1 Integration batch | Route access, CC wiring, cognitive bridge | ~78% |
| B2-M2 Production persistence | DrizzleAuthRepository, legal, notifications | ~85% |
| B2-M3 Production hardening | Docker, env validation, rate limits, ops, backup | ~92% |
| B2-M4 Closed-beta ready | Resend/SMTP, Redis jobs, Playwright e2e | In progress |
| B2-M5 Execution boundary | Real workflow execution | Gated |

**Key artifacts:** [`docs/build-2/README.md`](../build-2/README.md)

---

## 9. Roadmap (post closed-beta)

| Priority | Item | Source |
|----------|------|--------|
| P0 | Automation execution engine | [ADR-0015](../architecture/adr/0015-execution-layer-separation.md), B2-M5 |
| P1 | Full E2E regression suite | Build-2 M4 |
| P1 | Analytics visualization layer | PDD reports module |
| P2 | Knowledge, Strategy depth, Marketplace | PDD placeholders |
| P2 | Cognitive web UI (“Ask Conquest”) | RTM-UX-009 |
| P2 | Privacy export/deletion workers | Document X compliance |
| P2 | Billing OAuth integrations | Settings integrations |
| P3 | Multi-agent orchestration | [ADR-0030](../architecture/adr/0030-multi-agent-coordination.md) |
| P3 | Distributed tracing | Observability package |

---

## 10. Experience authority (UXMD)

| Volume | Scope |
|--------|-------|
| [UXMD I](../uxmd/volume-i-user-experience-master-document.md) | Experience vision, Command Center |
| [UXMD II](../uxmd/volume-ii-screen-interaction-specification.md) | Screen-by-screen interaction |
| [UXMD III](../uxmd/volume-iii-global-interaction-standards.md) | GIS — accessibility, motion, focus |
| [Document X](../uxmd/document-x-product-experience-operational-details.md) | Legal, cookies, operational UX |

GIS tokens: `@conquest/gis`. Presentation: `@conquest/presentation`.

---

## 11. Intelligence platform (Build-1 phases 9–11)

| Phase | ADR | Modules |
|-------|-----|---------|
| 9 | [0036](../architecture/adr/0036-intelligence-platform-module-foundations.md) | Intelligence service, feed, recommendations |
| 10 | [0037](../architecture/adr/0037-cognitive-intelligence-foundation.md) | Cognitive orchestrator, evidence, reasoning, decision |
| 11 | [0038](../architecture/adr/0038-cognitive-platform-hardening.md) | Platform composition, cache, jobs, metrics |

---

## 12. Verification & quality

- **268+** automated tests (Vitest); Playwright e2e for demo journey
- CI: governance corpus check + build + typecheck + test
- Verification gate: [ADR-0006](../architecture/adr/0006-verification-before-release.md), [ADR-0027](../architecture/adr/0027-verification-gate-ownership.md)
- Tenant isolation test plan: [`docs/operations/tenant-isolation-test-plan-v1.0.md`](../operations/tenant-isolation-test-plan-v1.0.md)

---

## 13. Knowledge base map

This master spec is the entry point. Detailed operational docs:

| Document | Use |
|----------|-----|
| [README.md](./README.md) | Index |
| [api-reference.md](./api-reference.md) | All HTTP routes |
| [data-flow-reference.md](./data-flow-reference.md) | Pipelines |
| [agent-handbook.md](./agent-handbook.md) | AI agent resume |
| [development-guide.md](./development-guide.md) | Local dev & deploy |

---

*Consolidated per [master-spec-consolidation-plan](../build-2/master-spec-consolidation-plan.md). Baseline: Build-2 M3/M4, 2026-06-28.*
