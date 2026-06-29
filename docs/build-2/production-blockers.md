# Build-2 Production Blocker List

**Prioritized tracked work** — missing production requirements, not future assumptions.  
**Baseline:** B2-M4 complete · Recovery Phase 2 synchronized · 278 tests · 2026-06-29

---

## Priority Legend

| Tier | Meaning | Target |
|------|---------|--------|
| **P0** | Closed-beta blocker | Build-2 Milestone 1 |
| **P1** | Beta quality / credibility | Build-2 Milestone 2 |
| **P2** | Post-beta / scale | Build-2 Milestone 3+ |

---

## P0 — Closed Beta Blockers

### Integration

| ID | Blocker | Domain | Verification |
|----|---------|--------|--------------|
| B2-P0-01 | Postgres not wired to API | Persistence | ~~Wire database~~ **Resolved M2** — set `DATABASE_URL`; CI uses `MEMORY_REPO` |
| B2-P0-02 | Intelligence/research/operations home routes guard-blocked | Frontend | ~~Direct nav~~ **Resolved M1** |
| B2-P0-03 | No email delivery (verify, invite, password reset) | Notifications | ~~Email received~~ **Resolved M4** — Resend + SMTP + retry + audit |
| B2-P0-04 | Intelligence feed is auto-seeded mock data | Intelligence | ~~Cognitive pipeline~~ **Partial M1** — via research analyze |
| B2-P0-05 | Legal pages are draft stubs | Legal | **Partial M2** — versioned copy + acceptance API; counsel review still required |
| B2-P0-06 | No cookie consent banner | Legal/GDPR | ~~Banner~~ **Resolved M2** — `CookieConsentBanner` + API |
| B2-P0-07 | Legal pages inaccessible to authenticated users | Legal | ~~Policies readable~~ **Resolved M2** — routes outside `RequireGuest` |
| B2-P0-08 | Landing page has no legal footer links | Legal | ~~Footer links~~ **Resolved M1** |

### Security

| ID | Blocker | Domain | Verification |
|----|---------|--------|--------------|
| B2-P0-09 | Rate limiting sets headers only — does not block | Security | ~~429 returned~~ **Resolved M3** — `createRateLimitMiddleware` enforces threshold |
| B2-P0-10 | Sessions in-memory — not durable across instances | Security | ~~Session survives restart~~ **Resolved M2** — `auth_server_sessions` in Postgres when `DATABASE_URL` set |

### Demonstration

| ID | Blocker | Domain | Verification |
|----|---------|--------|--------------|
| B2-P0-11 | No E2E test for closed-beta demo journey | QA | ~~Playwright~~ **Resolved M4** — `e2e/closed-beta-journey.spec.ts` |
| B2-P0-12 | Command Center zones have no live intelligence data | UX | ~~Recommendations visible~~ **Resolved M1** |

---

## P1 — Beta Quality

### Integration

| ID | Blocker | Domain |
|----|---------|--------|
| B2-P1-01 | Administration not in settings navigation | UX | ~~Resolved M1** — settings nav |
| B2-P1-02 | Automation `manualRun` records audit only — no execution | Automation |
| B2-P1-03 | Analytics KPIs use formula mock | Analytics |
| B2-P1-04 | Research source registration has no ingestion | Research |
| B2-P1-05 | Privacy export/deletion requests not processed | Compliance |
| B2-P1-06 | Integration connect/disconnect is status flip only | Integrations |
| B2-P1-07 | Data source connect has no real connector sync | Workspace |
| B2-P1-08 | Billing is seeded starter plan | Billing |
| B2-P1-09 | Cognitive API has no web client | Cognitive/UX |
| B2-P1-10 | Evidence review not exposed in UI | Intelligence |

### Security & scaling

| ID | Blocker | Domain |
|----|---------|--------|
| B2-P1-11 | `REDIS_URL` not passed to platform bootstrap | Scaling | ~~Wired~~ **Resolved M3** — `server.ts` → `createPlatformServices` |
| B2-P1-12 | Jobs use in-memory store only | Scaling | ~~Resolved M4** — `createJobService` Redis backend + fallback |
| B2-P1-13 | AI providers are stubs | AI |
| B2-P1-14 | RLS not enforced at database layer | Security | Application-level isolation only |
| B2-P1-15 | Secrets management not production-configured | Security |

### Operations

| ID | Blocker | Domain |
|----|---------|--------|
| B2-P1-16 | Distributed tracing not wired (`runWithTraceContext`) | Observability | ~~Resolved M3** — correlation middleware |
| B2-P1-17 | Web telemetry is dev console only | Observability |
| B2-P1-18 | Backup/restore not validated against Postgres | DR | ~~Partial M3** — `BackupProvider` + scheduler |
| B2-P1-19 | Load test scaffold not connected to deployed API | Performance |

### Legal & compliance

| ID | Blocker | Domain |
|----|---------|--------|
| B2-P1-20 | GDPR data retention mapping incomplete | Compliance |
| B2-P1-21 | CCPA readiness not documented | Compliance |
| B2-P1-22 | Data deletion workflow is request-only | Compliance |
| B2-P1-23 | IP review checklist not completed | Legal |

---

## P2 — Post-Beta / Scale

| ID | Blocker | Domain |
|----|---------|--------|
| B2-P2-01 | Knowledge module placeholder | Module |
| B2-P2-02 | Strategy module placeholder | Module |
| B2-P2-03 | Marketplace module placeholder | Module |
| B2-P2-04 | Onboarding connect/initialize cosmetic | Onboarding |
| B2-P2-05 | Analytics chart rendering deferred | Analytics |
| B2-P2-06 | Memory governance UI placeholders | Settings |
| B2-P2-07 | Horizontal scaling — lifecycle maps in-process | Cognitive |
| B2-P2-08 | Legacy `PipelineRunner` quarantined | Orchestration |
| B2-P2-09 | 12-stage CCIS loop not on API path | Orchestration |
| B2-P2-10 | VRF release gate not implemented | Governance |
| B2-P2-11 | Execution engines blocked (`executionReady: false`) | Execution |
| B2-P2-12 | Ask Conquest structured UI (RTM-UX-009) | UX |
| B2-P2-13 | RTM 69/78 rows still "Specified" not "Verified" | Governance |
| B2-P2-14 | Per-screen RTM traceability (102 UXMD screens) | Governance |
| B2-P2-15 | ADR index stale | Docs | ~~Resolved** — `docs/knowledge-base/adr-index.md` includes 0001–0038 |

---

## Simulation Replacement Strategy

| Simulation | Class | Replace with | Priority | Status |
|------------|-------|--------------|----------|--------|
| `MemoryAuthRepository` (CI only) | Temporary | Keep as CI fallback | — | **By design** |
| `IntelligenceService.ensureSeed` | Mock | Cognitive pipeline | P0 | **Removed M1** |
| `AnalyticsService` KPI formula | Mock | Metric warehouse | P1 | Open |
| `createStubProviders()` | Stub | SDK adapters | P1 | Open |
| In-memory cache (no Redis) | Temporary | Redis when `REDIS_URL` set | P1 | **Partial M4** |
| In-memory jobs (no Redis) | Temporary | Redis job store | P1 | **Partial M4** |
| Automation execution | Stub | Execution engine | P1 | M5 gated |
| Email console in dev | Temporary | Resend/SMTP in prod | P0 | **Resolved M4** |
| OAuth status flip | Stub | Provider OAuth | P2 | Open |
| `ModulePlaceholder` (3 modules) | Deferred | PDD modules | P2 | Open |
| CC zone shells | Placeholder | Intelligence API | P0 | **Resolved M1** |
| Onboarding theater steps | Placeholder | Connector API | P2 | Open |
| Legal draft copy | Placeholder | Counsel-reviewed | P0 | Open |

---

## Production Foundations Checklist

### Security (verify, not assume)

| Requirement | Current | Target |
|-------------|---------|--------|
| Tenant isolation | `assertOrgAccess` + workspace scope + Drizzle repo | + Postgres RLS |
| Secrets management | Env vars via `validateApiEnvironment()` | Vault / platform secrets |
| Prompt injection protection | `@conquest/prompt-security` | Verified in CI |
| Rate limiting | Enforced 120/min in-process | Redis-distributed |
| Audit coverage | `auth_domain_audit_events` in Postgres | + centralized sink |
| Permission enforcement | GIS RBAC + route guards + API checks | Maintained |
| Session lifecycle | Durable `auth_server_sessions` in Postgres | Multi-region replication |

### Scaling

| Requirement | Current | Target |
|-------------|---------|--------|
| Redis | Bootstrapped from `REDIS_URL` when set | Multi-instance shared |
| Async jobs | Redis `RedisJobStore` or in-memory fallback | Dedicated workers |
| Database indexing | Migrations applied at startup | Query tuning at scale |
| Load testing | Scaffold in `tools/load-testing/` | Staging stress runs |
| Horizontal scaling | Shared Postgres + optional Redis | Multi-API + LB |
| Caching strategy | Cognitive TTL + Redis option | Documented CDN static |

### Operations

| Requirement | Current | Target |
|-------------|---------|--------|
| Observability | Health, ops status, degradation probes, correlation IDs | Centralized tracing sink |
| Structured logs | JSON bootstrap events | Centralized log aggregation |
| Correlation IDs | Middleware + trace context | Full distributed trace |
| Health aggregation | `/api/health`, `/api/ops/*` | Dashboards + alerting |
| Backup readiness | `BackupProvider` + scheduler hook | Validated `pg_dump` pipeline |
| Disaster recovery | DR plan + runbooks | Executed drill record |
| Incident runbooks | SEV-1–4 in `docs/operations/` | Team trained |

### Legal

| Requirement | Current | Target |
|-------------|---------|--------|
| Privacy Policy | Draft `/legal/privacy` | Production copy |
| Terms of Service | Draft | Production copy |
| Cookie Policy | Draft | Production copy |
| AI Transparency | Draft | Production copy |
| GDPR readiness | Export/deletion request UI | Full workflow |
| CCPA readiness | Not documented | Disclosure + opt-out |
| Data retention mapping | Static text in privacy settings | Enforced retention jobs |
| Data deletion workflow | Request recorded | Executed deletion |
| IP review checklist | Not present | Completed |

---

## Appendix — API Endpoint Summary (M4)

| Category | ~Count | Persistence | Notes |
|----------|--------|-------------|-------|
| Wired domain routes | ~90 | Postgres when configured | Full CRUD + cognitive |
| Stub external (OAuth, execution) | ~8 | Postgres audit | Honest deferred messaging |
| Mock/formula (analytics KPIs) | ~4 | Postgres | Charts deferred |
| Ops/health (stateless) | ~5 | N/A | Live probes |
| **Total** | **~100** | | See [api-reference](../knowledge-base/api-reference.md) |

---

*Track blockers in Build-2 milestones. Close P0 before closed-beta invite.*
