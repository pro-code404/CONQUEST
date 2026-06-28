# Build-2 Simulation Inventory

**Status:** Authoritative — post B2-M2 Production Persistence (2026-06-28)  
**Baseline:** 257 tests passing · M1 + M2 complete  
**Rule:** Every remaining simulation is classified. No undocumented mocks.

---

## Classification Key

| Class | Meaning |
|-------|---------|
| **Production** | Real logic on authorized path; suitable for demo with known limits |
| **Temporary** | In-memory or stub backing; replaceable without contract change |
| **Deferred** | Planned Build-2+; not started |
| **Blocked** | Governance or BAR gate forbids until approval |

---

## Removed in B2-M1

| Simulation | Former location | Replacement |
|------------|-----------------|-------------|
| Intelligence auto-seed | `IntelligenceService.ensureSeed` | Honest empty state; cognitive materialization via `analyzeFromResearch` |
| CC zone placeholders (when data exists) | Static presentation shells | `buildCommandCenterDashboard` + `GET .../command-center/dashboard` |
| Route guard hardcoded exceptions | `route-access.ts` primary-nav-only check | `@conquest/gis` `parseWorkspaceModulePath` + `MODULE_MIN_READ_ROLE` |
| Opaque automation run message | `AutomationService` engine message | Honest deferred-execution wording |

## Removed in B2-M2

| Simulation | Former location | Replacement |
|------------|-----------------|-------------|
| Token-only email (no delivery) | Identity/invite flows | `NotificationService` + delivery audit |
| Legal acceptance (none) | N/A | `LegalService` + `auth_legal_acceptances` |
| Guest-only legal routes | `RequireGuest` wrapper | Public legal routes for all users |
| No cookie consent | N/A | `CookieConsentBanner` + API |

---

## Remaining Simulations

### Persistence & infrastructure

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| `MemoryAuthRepository` / `AsyncMemoryAuthRepository` | CI and `MEMORY_REPO=true` | **Temporary** | Default when no `DATABASE_URL` |
| `DrizzleAuthRepository` | Production path | **Production** | Set `DATABASE_URL`; auto-migrates on startup |
| In-memory cache | `@conquest/cache` | **Temporary** | Redis factory exists; `REDIS_URL` not passed to API bootstrap |
| In-memory jobs | `@conquest/jobs` | **Temporary** | DLQ scaffold only |
| Cognitive session manager | `services/session` | **Temporary** | Postgres adapter exists; not wired to API |
| In-memory AI audit | `@conquest/ai-audit` | **Temporary** | Real audit shape; no durable store |

### AI & cognitive

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| Stub AI providers | `createStubProviders()` in `@conquest/ai-gateway` | **Temporary** | Deterministic `[stub:provider]` responses |
| Cognitive execution phase | `CognitiveOrchestrator` | **Blocked** | `executionReady: false` per Build-2 governance |
| Legacy PipelineRunner | `services/orchestrator` | **Deferred** | 10-phase prototype; not on API path |

### Domain data

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| Analytics KPI formula | `AnalyticsService` | **Temporary** | `100 - index*7` formula; charts deferred |
| Billing seeded plan | Org creation | **Temporary** | Mock plan on new org |
| Integration connect | Settings integrations | **Stub** | Status flip only; no OAuth |
| Research source ingestion | `ResearchService` | **Stub** | Sessions real; external sync not implemented |
| Operations dashboard extras | `OperationsService` | **Hybrid** | Queue/cache from live platform; other tiles partial |

### External delivery

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| Email (verify, invite, reset) | `NotificationService` | **Production** (console provider in dev; swap for SMTP) |
| Privacy export/deletion | `SettingsService` | **Stub** | Request recorded; no background job |
| Activity export | `EXPORT_PLACEHOLDER_MESSAGE` | **Deferred** | Constant in `@conquest/config` |

### UI placeholders

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| CC placeholder zones (empty data) | `CommandCenterHomeView.renderPlaceholderZones` | **Production** | Honest empty state when dashboard has no items |
| Knowledge / Strategy / Marketplace | `ModulePlaceholder` | **Deferred** | Primary nav items 4–6; PDD modules not started |
| Onboarding connect / initialize | Onboarding screens 4–5 | **Temporary** | Cosmetic loading; skip works |
| Legal page copy | `/legal/*` screens | **Temporary** | Versioned; counsel review still required |
| Cookie consent | `CookieConsentBanner` | **Production** | Local + durable when authenticated |
| Legal routes guest-only | — | **Removed M2** | Routes public for all users |

### Automation

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| Workflow execution engine | `AutomationService.manualRun` | **Blocked** | Audit record only; autonomous execution deferred per governance |

### Security & ops

| Simulation | Location | Class | Notes |
|------------|----------|-------|-------|
| Rate limiting | API middleware | **Stub** | Headers emitted; no enforcement |
| Distributed tracing | `@conquest/observability` | **Deferred** | `runWithTraceContext` unused |

---

## Production (no simulation)

These paths use real logic and honest empty states:

| Capability | Evidence |
|------------|----------|
| RBAC + tenant isolation | `@conquest/gis`, `assertOrgAccess`, route guards |
| MFA (TOTP) | `SecurityService` |
| Cognitive pipeline (deterministic) | `@conquest/platform` → evidence → reasoning → decision |
| Research → analyze → recommendation | `POST .../research/sessions/:id/analyze` |
| Command Center dashboard aggregation | `buildCommandCenterDashboard` |
| Module route authorization | `parseWorkspaceModulePath` + `MODULE_MIN_READ_ROLE` |
| Correlation IDs + cognitive telemetry | API middleware, orchestrator audit |
| Prompt injection boundaries | `@conquest/prompt-security` |
| Automation CRUD + approvals | `AutomationService` (minus execution) |

---

## Count Summary

| Class | Count (approx.) |
|-------|-----------------|
| Removed in M1 | 4 |
| Production (honest) | 9 capabilities |
| Temporary | 12 |
| Stub | 5 |
| Deferred | 6 |
| Blocked | 3 |

---

*Update when simulations are removed or reclassified. Cross-reference: [integration-matrix.md](./integration-matrix.md), [production-blockers.md](./production-blockers.md).*
