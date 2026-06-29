# Build-2 Integration Matrix

**Status:** Authoritative — synchronized post Build-2 M4 + Recovery Phase 2  
**Baseline:** 278 tests · M1–M4 complete · Build-1 BAR active  
**Rule:** No assumptions — every row reflects verified implementation state

> **M4 delta:** Postgres persistence, Redis cache/jobs, email providers, Playwright e2e, legal acceptance, ops endpoints. See [m4-closed-beta-completion-report.md](./m4-closed-beta-completion-report.md).

---

## Classification Key

| Status | Meaning |
|--------|---------|
| **Production** | Real logic on authorized path; suitable for demo with known limits |
| **Wired** | Frontend ↔ API ↔ service connected; data may be in-memory or seeded |
| **Hybrid** | Partial real integration; UI or data deferred |
| **Placeholder** | Static shell or draft content; no backend |
| **Stub** | API exists; external system faked (OAuth, execution) |
| **Blocked** | Governance or architecture forbids until gate passes |
| **Deferred** | Planned post-beta; not implemented |

---

## Executive Summary

| Layer | Screens/Routes | Wired to API | Production persistence | Demo-ready |
|-------|----------------|--------------|------------------------|------------|
| Public auth | 8 routes | 8/8 | Postgres when `DATABASE_URL` set | Yes |
| Onboarding | 6 routes | 4/6 hybrid | Postgres | Partial (steps 4–5 cosmetic) |
| Settings | 18 routes | 18/18 | Postgres | Yes |
| Workspace modules | 22 routes | 22/22 | Postgres | Yes |
| Cognitive API | 8 endpoints | 8/8 | Postgres + platform | Yes via research analyze |
| Legal | 5 routes + API | 5/5 UI + API | Postgres acceptance | Partial (draft copy) |
| Ops | 2 endpoints | 2/2 | N/A | Yes |

**Critical finding (M4):** Platform is **integration-complete** at API contract layer with **Postgres persistence** when `DATABASE_URL` is configured. CI uses `MEMORY_REPO=true`. Redis cache and job queue activate when `REDIS_URL` is set. Automation execution remains audit-only (M5).

---

## Part A — Frontend Routes

### Public & auth

| Route | Screen | Presentation | Application | Backend | Persistence | Telemetry | AuthZ | Status |
|-------|--------|--------------|-------------|---------|-------------|-----------|-------|--------|
| `/` | Landing | Yes | Yes | No | — | Dev console | Guest | Wired — legal footer links |
| `/login` | Login | Yes | Yes | `/api/auth/login` | PG | No | Guest | Wired |
| `/signup` | Sign up | Yes | Yes | `/api/auth/signup` | PG | No | Guest | Wired |
| `/forgot-password` | Forgot | Yes | Yes | `/api/auth/password/forgot` | PG | No | Guest | Wired (email via NotificationService) |
| `/reset-password` | Reset | Yes | Yes | `/api/auth/password/reset` | PG | No | Guest | Wired |
| `/invite/:token` | Invite accept | Yes | Yes | `/api/auth/invite/*` | PG | No | Mixed | Wired |
| `/verify-email` | Verify | Yes | Yes | `/api/auth/verify-email` | PG | No | Session | Wired (dev token) |

### Legal

| Route | Screen | Backend | Status |
|-------|--------|---------|--------|
| `/legal/privacy` | PrivacyPolicy | `GET /api/legal/documents` | Wired — draft copy; counsel review pending |
| `/legal/terms` | Terms | same | Wired — draft |
| `/legal/cookies` | Cookies | same | Wired — draft |
| `/legal/ai-transparency` | AI Transparency | same | Wired — draft |
| `/legal/security` | Security | same | Wired — draft |

Legal routes are **public** for all users (including authenticated). Acceptance via `POST /api/legal/accept`.

### Onboarding

| Route | Screen | Backend | Status |
|-------|--------|---------|--------|
| `/onboarding` | Welcome | `POST /api/auth/onboarding/stage` | Hybrid — static copy |
| `/onboarding/orientation` | Orientation | stage API | Hybrid |
| `/onboarding/workspace` | Workspace | `POST /api/auth/onboarding/complete` | Wired |
| `/onboarding/connect` | Connect | stage API | Placeholder — no connector |
| `/onboarding/initializing` | Initializing | stage API | Placeholder — fake loading |
| `/onboarding/complete` | Complete | `POST /api/auth/onboarding/finish` | Wired |

### Settings (`/app/settings/*`)

| Route | Screen | Backend | AuthZ | Status |
|-------|--------|---------|-------|--------|
| `/app/settings` | Home | `GET /api/settings/categories` | Viewer+ | Wired |
| `/app/settings/account` | Account | GET/PUT account | Viewer+ | Wired |
| `/app/settings/security` | Security | security API | Viewer+ | Wired |
| `/app/settings/security/mfa` | MFA | enroll/confirm | Viewer+ | Wired (real TOTP) |
| `/app/settings/activity` | Activity | audit log | Manager+ | Wired |
| `/app/settings/automation-policies` | Policies | GET/PUT | Admin+ | Wired |
| `/app/settings/advanced` | AI controls | GET/PUT | Viewer+ | Wired |
| `/app/settings/memory` | Memory | GET/PUT | Admin+ | Hybrid — UI notes Build-1 placeholders |
| `/app/settings/workspace/:id/sources` | Sources | CRUD sources | Manager+ | Stub (no real sync) |
| `/app/settings/workspace/:id/goals` | Goals | CRUD goals | Manager+ | Wired |
| `/app/settings/notifications` | Notifications | GET/PUT | Viewer+ | Wired |
| `/app/settings/privacy` | Privacy | export/deletion request | Viewer+ | Stub (no job runs) |
| `/app/settings/appearance` | Appearance | GET/PUT preferences | Viewer+ | Wired |
| `/app/settings/billing` | Billing | GET billing | Owner | Mock (seeded plan) |
| `/app/settings/integrations` | Integrations | connect/disconnect | Admin+ | Stub (status flip) |
| `/app/settings/organization` | Organization | org settings | Admin+ | Wired |
| `/app/settings/organization/members` | Members | CRUD + invite | Admin+ | Stub (no email) |
| `/app/settings/workspace/:id` | Workspace | GET/PUT | Manager+ | Wired |
| `/app/settings/workspace/:id/team` | Team | invite/remove | Manager+ | Stub (no email) |
| `/app/settings/administration` | Administration | admin dashboard | Admin+ | Wired — **in settings nav** (M1) |

### Workspace modules (`/app/w/:workspaceId/*`)

| Route | Screen | Backend | Nav | AuthZ | Status |
|-------|--------|---------|-----|-------|--------|
| `.../command-center` | Command Center | status + **dashboard API** | Primary (1) | Viewer+ | **Wired** — zones from platform data (M1) |
| `.../automation` | Automation center | workflows API | Primary (3) | Member+ | Wired |
| `.../automation/new` | Builder | create workflow | — | Member+ | Wired |
| `.../automation/:id` | Detail | full lifecycle | — | Member+ | Wired |
| `.../automation/:id/log` | Execution log | executions API | — | Member+ | Stub (no engine) |
| `.../automation/approvals` | Approvals | approvals API | — | Member+ | Wired |
| `.../reports` | Analytics | dashboard API | Primary (2) | Viewer+ | Hybrid — KPIs mock; charts deferred |
| `.../reports/saved` | Saved views | CRUD views | — | Viewer+ | Wired |
| `.../intelligence` | Intelligence home | intelligence API | **Not in nav** | Viewer+ | **Wired** — home accessible (M1) |
| `.../intelligence/feed` | Feed | feed API | — | Viewer+ | Wired — cognitive-backed after analyze |
| `.../intelligence/recommendations` | Recommendations | list API | — | Viewer+ | Wired — cognitive materialization (M1) |
| `.../intelligence/recommendations/:id` | Detail | detail + status | — | Viewer+ | Wired — evidence refs from pipeline |
| `.../intelligence/opportunities` | Opportunities | API | — | Viewer+ | Hybrid — empty until feed has opportunities |
| `.../intelligence/risks` | Risks | API | — | Viewer+ | Hybrid — empty until feed has risks |
| `.../intelligence/timeline` | Timeline | API | — | Viewer+ | Hybrid — derived from feed events |
| `.../research` | Research home | sessions API | **Not in nav** | Viewer+ | **Wired** — home accessible (M1) |
| `.../research/:sessionId` | Session | session + **analyze API** | — | Viewer+ | Wired — cognitive analyze button (M1) |
| `.../operations` | Operations | dashboard API | **Not in nav** | Viewer+ | **Wired** — home accessible (M1) |
| `.../knowledge` | ModulePlaceholder | None | Primary (4) | Viewer+ | Placeholder |
| `.../strategy` | ModulePlaceholder | None | Primary (5) | Viewer+ | Placeholder |
| `.../marketplace` | ModulePlaceholder | None | Primary (6) | Viewer+ | Placeholder |

### Profile

| Route | Screen | Backend | Status |
|-------|--------|---------|--------|
| `/app/profile` | Profile | `GET /api/profile` | Wired |
| `/app/profile/sessions` | Sessions | list/revoke | Wired |

### Route access (M1 — resolved)

`resolveWorkspaceRouteAccess` in `apps/web/src/auth/route-access.ts`:

- `parseWorkspaceModulePath` from `@conquest/gis` resolves first path segment against `MODULE_MIN_READ_ROLE`.
- Primary nav segments (`PRIMARY_NAV_ITEMS`) and secondary workspace modules share one authorization model — no per-module hardcoding.
- Nested paths (e.g. `/intelligence/feed`) inherit first-segment module auth.
- **Result:** `/intelligence`, `/research`, `/operations` home paths load for authorized roles.

`canAccessModuleRead` in `@conquest/gis` defines roles for all modules; routing now uses the same source of truth.

---

## Part B — Backend Endpoints (~100 routes)

All routes live in `apps/api/src/app.ts`. Cross-cutting: session cookie auth, correlation ID middleware, rate limit 120 req/min (enforced in-process).

### Persistence summary

| Category | Count | Description |
|----------|-------|-------------|
| Postgres/REAL | ~90 | Drizzle repo when `DATABASE_URL` set; real business logic |
| STUB | ~8 | OAuth, execution engine — honest deferred messaging |
| MOCK/FORMULA | ~4 | Analytics KPI formula; charts deferred |
| STATELESS | ~5 | Health, ops, degradation probes |

CI uses `MEMORY_REPO=true` for test isolation.

### API groups

| Group | Endpoints | Service | Persistence | Notes |
|-------|-----------|---------|-------------|-------|
| Auth & identity | 16 | `IdentityService` | Postgres | Email via Resend/SMTP/console (M4) |
| Workspaces & CC | 3 | `WorkspaceService`, `buildCommandCenterDashboard` | Postgres | Integrated dashboard zones |
| Profile | 3 | `IdentityService` | Postgres | Session revocation works |
| Settings | 45 | `SettingsService`, `WorkspaceService`, `SecurityService`, `AuditService` | Postgres | Privacy export/deletion stubbed |
| Automation | 16 | `AutomationService` | Postgres | `manualRun` audit-only — no engine (M5) |
| Intelligence | 9 | `IntelligenceService` | Postgres | Cognitive-backed; honest empty state |
| Research | 5 | `ResearchService`, `IntelligenceService` | Postgres | Sessions + `POST .../analyze` cognitive bridge |
| Analytics | 4 | `AnalyticsService` | Postgres | KPI formula `100 - index*7` |
| Operations | 1 | `OperationsService` | Postgres + platform | Queue/cache from live platform |
| Cognitive | 8 | `@conquest/platform` | In-memory pipeline | Deterministic; stub AI; `executionReady: false` |
| Health / Ops | 5 | Multiple | N/A | Ready, status, degradation probes |

Full endpoint inventory: see appendix in [production-blockers.md](./production-blockers.md).

---

## Part C — Platform Services

| Component | Package | Wired | Backend | Class |
|-----------|---------|-------|---------|-------|
| Composition root | `@conquest/platform` | Yes | — | Production wiring |
| Cache | `@conquest/cache` | Yes | Redis when `REDIS_URL` set; in-memory fallback | Production-ready |
| Jobs | `@conquest/jobs` | Yes | Redis `RedisJobStore` or in-memory fallback | Production-ready |
| AI Gateway | `@conquest/ai-gateway` | Yes | Stub providers | Temporary |
| AI Audit | `@conquest/ai-audit` | Yes | In-memory | Temporary |
| Memory platform | `@conquest/memory-service` | Yes | In-memory kind stores | Temporary |
| Cognitive orchestrator | `@conquest/cognitive` | Yes | Full pipeline; `executionReady: false` | M5 gated |
| Evidence / Reasoning / Decision | `@conquest/cognitive` | Yes | Deterministic in-memory | Temporary |
| Prompt registry | `@conquest/prompt-management` | Yes | In-memory + prompt-security | Temporary |
| Metrics | `@conquest/performance` | Yes | In-process collectors | Production scaffold |
| Postgres | `@conquest/database` | **Yes** | Drizzle on API path when `DATABASE_URL` set | **Resolved M2** |
| Redis | `@conquest/cache`, `@conquest/jobs` | **Yes** | Bootstrapped from `REDIS_URL` | **Partial M4** |
| Session manager | `services/session` | Partial | Sessions durable via Drizzle repo | Acceptable |
| Legacy PipelineRunner | `services/orchestrator` | **No** | 10-phase prototype | Prototype only |

---

## Part D — Contracts ↔ Implementation

| Contract module | Implementation | API | Web UI |
|-----------------|----------------|-----|--------|
| auth, settings, organization, users | `@conquest/auth` services | Yes | Yes |
| command-center | `WorkspaceService` + `buildCommandCenterDashboard` | Yes | Yes |
| automation, security, audit, governance | Auth services | Yes | Yes |
| intelligence, advisory | `IntelligenceService` (cognitive provider) | Yes | Yes |
| research | `ResearchService` | Yes | Yes |
| analytics | `AnalyticsService` (mock KPIs) | Yes | Yes |
| operations, administration | Auth services + platform telemetry | Yes | Yes (admin in nav) |
| cognitive/* (7 modules) | Platform cognitive stack | Yes | **Partial** — Research analyze UI (M1) |

All 25 contract surfaces have TypeScript implementations. Domain persistence uses **Postgres** when `DATABASE_URL` is configured; CI uses memory fallback.

---

## Part E — Observability & Security

| Capability | Status | Location |
|------------|--------|----------|
| Correlation IDs | Production | API middleware → cognitive runs |
| Health aggregation | Production | `GET /api/health` + platform deps |
| Cognitive metrics | Production scaffold | `/api/health` snapshot |
| Structured logging | Partial | Service `emit`; dev console on web |
| Distributed tracing | Deferred | `runWithTraceContext` unused |
| Tenant isolation | Wired (MEM) | `assertOrgAccess`, workspace scope |
| RBAC | Production | `@conquest/gis` + route guards |
| Rate limiting | Stub | Headers only; no enforcement |
| Prompt injection defense | Production scaffold | `@conquest/prompt-security` |
| MFA | Production (MEM) | Real TOTP in `SecurityService` |
| Audit trail | Wired (MEM) | `AuditService`, AI audit in-memory |

---

## Part F — Simulation Registry

> **Authoritative inventory:** [simulation-inventory.md](./simulation-inventory.md)

| Simulation | Location | Class | Replacement |
|------------|----------|-------|-------------|
| `MemoryAuthRepository` | All auth services | Temporary | Drizzle/Postgres repository |
| ~~Intelligence seed data~~ | ~~`IntelligenceService.ensureSeed`~~ | **Removed M1** | Cognitive pipeline via `analyzeFromResearch` |
| Analytics KPI formula | `AnalyticsService` | Mock | Warehouse / real metrics |
| Billing seeded plan | Org creation | Mock | Stripe or billing provider |
| Integration connect | Status flip only | Stub | OAuth flows |
| Email (verify, invite, reset) | Token in repo only | Stub | Notification service |
| Automation execution | Audit record only | Blocked | Execution engine (Build-2 gated) |
| Privacy export/deletion | Request recorded | Stub | Background jobs + compliance workflow |
| AI providers | `createStubProviders()` | Temporary | SDK adapters behind gateway |
| ~~CC zone content~~ | ~~Presentation shells~~ | **Removed M1** | `command-center/dashboard` aggregation |
| Knowledge/Strategy/Marketplace | `ModulePlaceholder` | Deferred | PDD module implementation |
| Onboarding connect/init | Static UI | Temporary | Real connector handshake |
| CC placeholder zones (no data) | `renderPlaceholderZones` | Production | Honest empty state |

---

## Integration Gaps (priority order)

1. **Postgres persistence** — unblock all durable workflows
2. ~~**Route guard fix**~~ — **Done (M1)**
3. ~~**Intelligence data**~~ — **Partial (M1)** — cognitive pipeline via research analyze; no passive feed without analysis
4. ~~**Command Center zones**~~ — **Done (M1)** — dashboard API aggregates live data
5. **Cognitive web client** — expand beyond research analyze (Ask Conquest)
6. **Email delivery** — verify, invite, password reset
7. **Automation execution engine** — after Build-2 BAR execution gate
8. **Redis bootstrap** — `REDIS_URL` → platform composition
9. **Legal production pass** — copy, cookie banner, public access for authenticated users
10. ~~**Administration nav**~~ — **Done (M1)**

---

*Derived from: `apps/web`, `apps/api`, `services/*`, `packages/*`, RTM v1.1, ADR-0036–0038. Last updated: B2-M1 Integration Batch.*
