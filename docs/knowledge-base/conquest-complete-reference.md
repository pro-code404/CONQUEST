# Conquest Complete Reference

Single technical reference for Conquest. Read [ai-agent-onboarding](./ai-agent-onboarding.md) first for resume workflow.

**Baseline:** Build-2 M4 complete · commit on `main` · 278 tests · ~96% closed-beta readiness

---

## 1. Purpose & philosophy

**Conquest** is a Strategic Intelligence Operating System (CIOS). It transforms organizational activity through a governed cognitive pipeline — not a single LLM call.

**Core philosophy:**
- Intelligence emerges from orchestrated phases (evidence → reasoning → decision → verification)
- Modules are cognitive functions within one OS, not isolated features
- Verification before user-facing release
- Tenant-safe multi-workspace operation
- Continuous evolution under governance (First Law)

**Problems solved:** Fragmented research, unexplainable AI outputs, non-durable sessions, demo-grade integrations masquerading as product.

Detail: [product-master-spec](./product-master-spec.md) · [CCIS](../architecture/ccis.md)

---

## 2. Authority chain

```
CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → RTM → Governance → BAR → Build
```

Frozen corpus: `docs/architecture/`. Knowledge base **summarizes**; does not override.

---

## 3. Repository structure

```
apps/
  api/     Hono server — routes, middleware, bootstrap (server.ts)
  web/     Vite/React — UXMD shell, features, routing
packages/
  cache, config, contracts, core, database, engines, gis,
  observability, performance, presentation, prompt-management,
  prompt-security, visualization-config
services/
  auth/         Domain services + DrizzleAuthRepository
  platform/     Cognitive, AI, cache, jobs composition root
  cognitive/    Evidence, reasoning, decision engines
  jobs/         Queue framework (Redis + memory)
  ai-gateway/   Provider abstraction (stubs)
  ai-audit/     AI usage audit
  memory/       Memory platform + cognitive memory manager
  session/      Session helpers (partial Postgres wiring)
  orchestrator/ Legacy PipelineRunner (not on API path)
  shared/       Service base classes
docs/
  architecture/   Frozen ADR, CCIS, RTM
  knowledge-base/ Authoritative summaries (this folder)
  build-2/        Milestone reports, blockers
  operations/     Deploy, backup, runbooks
scripts/          build.mjs, verify, migrate helpers
e2e/              Playwright closed-beta journey
docker-compose.yml / docker-compose.prod.yml
```

---

## 4. Application layers

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Presentation | `apps/web`, `presentation`, `gis` | Render, route, tokens — no domain logic |
| Application/API | `apps/api` | HTTP, auth middleware, compose services |
| Domain | `services/auth` | Business rules, repositories |
| Intelligence platform | `services/platform`, `cognitive` | Pipeline, AI, cache, jobs |
| Infrastructure | `database`, `cache`, `jobs` | Persistence, queue, config |

---

## 5. Request lifecycle

1. Browser → nginx (prod) or Vite proxy (dev) → `/api/*`
2. Middleware: correlation/trace → security headers → timing → security audit → rate limit → CORS
3. Route handler: session cookie → domain service → `AuthRepository`
4. Cognitive routes: `cognitiveScope()` → `platform.cognitive.run()`
5. Response: JSON + correlation/timing headers

---

## 6. Workspace model

- **Org** → **Workspaces** → **Members** with GIS roles
- Workspace scopes intelligence, automation, research data
- `session.orgId` must match `workspace.orgId` on every scoped call
- Workspace selection: `POST /api/auth/workspace/:id/select`

ADRs: [0003](../architecture/adr/0003-workspace-as-context.md), [0016](../architecture/adr/0016-tenant-isolation-strategy.md)

---

## 7. GIS & permissions

- `@conquest/gis` — design tokens + `parseWorkspaceModulePath` + `MODULE_MIN_READ_ROLE`
- `apps/web/src/auth/route-access.ts` — route guards
- API enforces roles in domain services + `canAccessModuleRead`

---

## 8. Domain modules (services/auth)

| Service | Responsibility |
|---------|------------------|
| `IdentityService` | Signup, login, verify, password, onboarding |
| `WorkspaceService` | Workspaces, invites |
| `SettingsService` | 18 settings domains, scoped documents |
| `AutomationService` | Workflows, runs, approvals — **execution audit-only** |
| `IntelligenceService` | Feed, recommendations, home — cognitive provider |
| `ResearchService` | Sessions, sources, analyze trigger |
| `AnalyticsService` | Dashboard metrics — formula mock |
| `OperationsService` | Ops dashboard — live queue/cache |
| `AdministrationService` | Feature flags |
| `LegalService` | Documents, acceptance, cookie consent |
| `NotificationService` | Email delivery + audit |
| `SecurityService` | MFA, devices |
| `AuditService` | Audit events |

---

## 9. Platform layer (services/platform)

`createPlatformServices({ redisClient, jobService })` wires:

| Component | Package | Role |
|-----------|---------|------|
| Cache | `@conquest/cache` | Redis or in-memory |
| Jobs | `@conquest/jobs` | Queue + DLQ + `ai_request` handler |
| AI Gateway | `@conquest/ai-gateway` | Stub providers |
| Cognitive | `@conquest/cognitive` | Orchestrator |
| Memory | `@conquest/memory-service` | Cognitive memory |
| Prompts | `@conquest/prompt-management` | Registry |
| Metrics | `@conquest/performance` | Platform + cognitive collectors |

---

## 10. Cognitive pipeline

**Runtime path (API):**
```
Research analyze → IntelligenceCognitiveProvider
  → CognitiveOrchestrator.run()
  → EvidenceEngine → ReasoningEngine → DecisionEngine
  → recommendation + evidence refs + confidence
```

**Governance:** `executionReady: false` on all decisions. No autonomous execution.

**Async:** `JobService` type `ai_request` → `cognitive.completeQueued()`

Docs: [cognitive-pipeline](../architecture/cognitive-pipeline.md) · [data-flow-reference](./data-flow-reference.md)

---

## 11. Memory, evidence, reasoning, decision

| Engine | Package | Rule |
|--------|---------|------|
| Evidence | `cognitive` | Portfolio before reasoning |
| Reasoning | `cognitive` | Cites evidence |
| Decision | `cognitive` | Ranked candidates; no execution |
| Memory | `memory-service` | Writes via `CognitiveMemoryManager` only |

---

## 12. Prompt management & security

- `PromptRegistry` — versioned prompts, `ensureDefaults()`
- `@conquest/prompt-security` — injection sanitization boundaries
- Never log raw prompts in production audit ([config constants](../../packages/config/src/constants.ts))

---

## 13. AI provider orchestration

- All calls through `AiGateway` + `AiProviderOrchestrator`
- **Current:** `createStubProviders()` — deterministic stubs
- **Future:** SDK adapters behind gateway ([ADR-0011](../architecture/adr/0011-ai-provider-abstraction.md))
- Usage recorded in `@conquest/ai-audit` (in-memory)

---

## 14. Automation & execution boundary

- Full workflow CRUD, enable/disable, pause/resume, approvals
- `manualRun` → execution **audit record only** — honest deferred message
- M5 will introduce execution engine per [ADR-0015](../architecture/adr/0015-execution-layer-separation.md)

---

## 15. Database (Postgres)

**Schema:** `packages/database/src/auth-schema.ts`  
**Migration:** `packages/database/drizzle/0000_initial.sql`

**Tables (15):** `auth_orgs`, `auth_users`, `auth_server_sessions`, `auth_workspaces`, `auth_workspace_members`, `auth_scoped_documents`, `auth_tokens`, `auth_team_invites`, `auth_org_invites`, `auth_workflows`, `auth_executions`, `auth_research_sessions`, `auth_domain_audit_events`, `auth_legal_acceptances`, `auth_email_deliveries`

**Repository:** `AuthRepository` (83 methods) — `DrizzleAuthRepository` + memory fallback

**RLS:** Not implemented — application-level isolation only (blocker B2-P1-14)

---

## 16. Redis, cache, jobs

- `REDIS_URL` → Redis cache + `RedisJobStore` + `RedisDeadLetterQueue`
- Fallback: in-memory cache and `InMemoryJobStore` (CI, test, no URL)
- Job features: retry, exponential backoff, timeout, cancel, DLQ, metrics, `workerHealthy()`

---

## 17. Email

- `createEmailProvider()`: console | resend | smtp
- `RetryingEmailProvider` wrapper for production providers
- `NotificationService.deliver()` → `auth_email_deliveries` audit + correlation ID

---

## 18. Security (as-built)

| Control | Status |
|---------|--------|
| Session cookies | httpOnly, secure in prod |
| RBAC + GIS | Implemented |
| Tenant isolation | App-level |
| Rate limiting | 120/min enforced (in-process) |
| Security headers | Production middleware |
| MFA | TOTP + recovery codes |
| Prompt injection | Package present |
| Audit events | Durable in Postgres |
| RLS | Not implemented |
| Secrets vault | Env only |

Detail: [production-architecture](./production-architecture.md) · [engineering-constitution](./engineering-constitution.md)

---

## 19. Legal & compliance

- Versioned legal documents + `POST /api/legal/accept`
- Cookie consent banner + API
- **Draft copy** — external counsel review required (B2-P0-05)
- GDPR/CCPA workflows partial — export/deletion request only

---

## 20. API surface

~100 routes in `apps/api/src/app.ts`. Catalog: [api-reference](./api-reference.md)

Key groups: health/ops, auth, workspaces, settings, automation, intelligence, research, cognitive, legal.

---

## 21. Testing

| Suite | Command | Count |
|-------|---------|-------|
| Unit/integration | `pnpm test` | 278 |
| E2E | `pnpm test:e2e` | 1 journey spec |
| Contract | `auth-repository.contract.test.ts` | Postgres when reachable |

CI: `MEMORY_REPO=true`, Playwright in `.github/workflows/ci.yml`

---

## 22. Deployment

Docker Compose prod stack, env validation, backup scheduler hook.

Guide: [production-architecture](./production-architecture.md) · [`docs/operations/deployment.md`](../operations/deployment.md)

---

## 23. Build history

| Phase | Outcome |
|-------|---------|
| Build-0 | Architecture freeze |
| Build-1 | Shell + platform (BAR-2026-06-26) |
| B2-M1 | Integration batch |
| B2-M2 | Postgres persistence |
| B2-M3 | Production hardening |
| B2-M4 | Closed-beta + KB |
| Recovery P2 | Doc synchronization |

Reports: `docs/build-2/m*-*.md`, [development-memory](./development-memory.md)

---

## 24. Remaining blockers

Authoritative list: [`docs/build-2/production-blockers.md`](../build-2/production-blockers.md)

**P0:** Legal counsel review  
**P1:** Automation execution, AI stubs, analytics, RLS, …  
**M5:** Execution boundary (gated)

---

## 25. Future roadmap

M5 execution → real providers → module placeholders (Knowledge, Strategy, Marketplace) → HA scaling → RTM verification completion.

[product-master-spec](./product-master-spec.md) · [implementation-roadmap](../build-2/implementation-roadmap.md)

---

## 26. Package index

Full detail: [package-reference](./package-reference.md)

---

## 27. Engineering rules

[engineering-constitution](./engineering-constitution.md) — binding rules for all contributors and AI agents.

---

*This document is the technical anchor of the knowledge base. Update on milestone completion or architectural change.*
