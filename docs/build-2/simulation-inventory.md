# Build-2 Simulation Inventory

**Status:** Authoritative — synchronized post Build-2 M4 + Recovery Phase 2  
**Baseline:** 278 tests · M1–M4 complete  
**Rule:** Every remaining simulation is classified. No undocumented mocks.

Cross-reference: [integration-matrix.md](./integration-matrix.md) · [production-blockers.md](./production-blockers.md)

---

## Classification Key

| Class | Meaning |
|-------|---------|
| **Production** | Real logic on authorized path; suitable for demo with known limits |
| **Temporary** | In-memory or stub backing; replaceable without contract change |
| **Deferred** | Planned post-beta; not started |
| **Blocked** | Governance or BAR gate forbids until approval |

---

## Removed simulations

### B2-M1
Intelligence auto-seed · CC static placeholders · route guard exceptions · opaque automation message

### B2-M2
Token-only email · no legal acceptance · guest-only legal routes · no cookie consent

### B2-M3
Rate limit headers-only · Redis not bootstrapped · no ops status · no env fail-fast

### B2-M4
Console-only email · in-memory-only jobs · no E2E journey · no degradation probes

---

## Remaining simulations

### Persistence & infrastructure

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| `AsyncMemoryAuthRepository` | CI / `MEMORY_REPO=true` | **Temporary** | Intentional CI fallback |
| `DrizzleAuthRepository` | `DATABASE_URL` set | **Production** | Auto-migrate at startup |
| In-memory cache | No `REDIS_URL` or unreachable Redis | **Temporary** | Redis wired when URL set |
| In-memory jobs | No Redis / test / CI | **Temporary** | `RedisJobStore` when `REDIS_URL` set |
| In-memory AI audit | `@conquest/ai-audit` | **Temporary** | Shape correct; no durable store |
| Session service Postgres | `services/session` | **Deferred** | Sessions durable via Drizzle repo |

### AI & cognitive

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| Stub AI providers | `createStubProviders()` | **Temporary** | Real SDK wiring deferred |
| `executionReady: false` | `DecisionEngine` | **Blocked** | M5 + governance |
| `PipelineRunner` | `services/orchestrator` | **Deferred** | Not on API path |

### Domain data

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| Analytics KPI formula | `AnalyticsService` | **Temporary** | Charts deferred |
| Billing seeded plan | Org creation | **Temporary** | |
| Integration connect | Settings | **Stub** | Status flip only |
| Research source ingestion | `ResearchService` | **Stub** | Sessions real |
| Privacy export/deletion | `SettingsService` | **Stub** | Request only |

### Security & ops

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| In-process rate limiter | API middleware | **Temporary** | Redis-distributed deferred |
| Centralized log sink | Service emit hooks | **Deferred** | Structured JSON local only |

### UI

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| Onboarding connect/initialize | Steps 4–5 | **Temporary** | Skip works |
| Legal copy | `/legal/*` | **Temporary** | Counsel review pending |
| Knowledge/Strategy/Marketplace | `ModulePlaceholder` | **Deferred** | |

### Automation

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| Workflow execution | `manualRun` | **Blocked** | Audit only until M5 |

---

## Production capabilities (no simulation)

RBAC + tenant isolation · MFA · cognitive pipeline · research analyze → recommendation · CC dashboard · module route auth · correlation IDs · prompt security boundaries · automation CRUD · Resend/SMTP email with audit · Postgres persistence · Redis cache/jobs when configured · rate limit enforcement · Playwright e2e · ops/degradation endpoints

---

## Count summary

| Class | Approx. count |
|-------|----------------|
| Removed (cumulative) | 16+ |
| Temporary | 10 |
| Stub | 4 |
| Deferred | 6 |
| Blocked | 3 |

*Update when simulations are removed or reclassified.*
