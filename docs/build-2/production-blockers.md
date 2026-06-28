# Build-2 Production Blocker List

**Prioritized tracked work** — missing production requirements, not future assumptions.  
**Baseline:** B2-M3 complete · 263+ tests · 2026-06-21

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
| B2-P0-03 | No email delivery (verify, invite, password reset) | Notifications | ~~Email received~~ **Partial M2** — `NotificationService` + console provider; SMTP adapter deferred |
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
| B2-P0-11 | No E2E test for closed-beta demo journey | QA | Playwright passes full script |
| B2-P0-12 | Command Center zones have no live intelligence data | UX | ~~Recommendations visible~~ **Resolved M1** |

---

## P1 — Beta Quality

### Integration

| ID | Blocker | Domain |
|----|---------|--------|
| B2-P1-01 | Administration not in settings navigation | UX |
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
| B2-P1-12 | Jobs use in-memory store only | Scaling | Partial — metrics exposed; Redis job store deferred |
| B2-P1-13 | AI providers are stubs | AI |
| B2-P1-14 | RLS not enforced at database layer (no DB yet) | Security |
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
| B2-P2-15 | ADR index stale (ends at 0035; 0036–0038 exist) | Docs |

---

## Simulation Replacement Strategy

| Simulation | Class | Replace with | Priority |
|------------|-------|--------------|----------|
| `MemoryAuthRepository` | Temporary | `DrizzleAuthRepository` on Postgres | P0 |
| `IntelligenceService.ensureSeed` | Mock | Cognitive orchestrator output → feed | P0 |
| `AnalyticsService` KPI formula | Mock | Metric warehouse or aggregated queries | P1 |
| `createStubProviders()` | Stub | OpenAI/Anthropic/Gemini SDK adapters | P1 |
| `InMemoryCacheProvider` default | Temporary | Redis via `REDIS_URL` bootstrap | P1 |
| `InMemoryJobStore` | Temporary | Redis/Bull or managed queue | P1 |
| Automation execution message | Stub | Execution engine service | P1 (post-BAR) |
| Email token storage only | Stub | `@conquest/notifications` or provider | P0 |
| OAuth status flip | Stub | Provider OAuth flows | P2 |
| `ModulePlaceholder` (3 modules) | Deferred | PDD module screens | P2 |
| CC zone shells | Placeholder | Intelligence API data binding | P0 |
| Onboarding theater steps | Placeholder | Connector handshake API | P2 |
| Legal draft copy | Placeholder | Counsel-reviewed content | P0 |

---

## Production Foundations Checklist

### Security (verify, not assume)

| Requirement | Current | Target |
|-------------|---------|--------|
| Tenant isolation | `assertOrgAccess` + workspace scope (MEM) | + Postgres RLS |
| Secrets management | Env vars in config | Vault / Netlify secrets |
| Prompt injection protection | `@conquest/prompt-security` | Verified in CI |
| Rate limiting | Headers only | Enforced + Redis |
| Audit coverage | In-memory audit service | Durable audit store |
| Permission enforcement | GIS RBAC + route guards | + API middleware |
| Session lifecycle | Sliding TTL, revocation (MEM) | Durable session store |

### Scaling

| Requirement | Current | Target |
|-------------|---------|--------|
| Redis | Factory exists; unused | Bootstrapped from `REDIS_URL` |
| Async jobs | In-memory | External queue |
| Database indexing | Schema defined | Migrations applied |
| Load testing | Scaffold only | Staging stress runs |
| Horizontal scaling | Single-instance state | Shared cache + DB |
| Caching strategy | 5min cognitive TTL | Documented + Redis |

### Operations

| Requirement | Current | Target |
|-------------|---------|--------|
| Observability | Health + cognitive metrics | + tracing |
| Structured logs | Service emit hooks | Centralized log sink |
| Correlation IDs | API middleware | End-to-end propagation |
| Health aggregation | `/api/health` | + dependency dashboards |
| Backup readiness | DR plan doc | Postgres backup validated |
| Disaster recovery | Runbooks exist | Drill executed |
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

## Appendix — API Endpoint Counts by Status

| Status | ~Count |
|--------|--------|
| MEM/REAL (wired, in-memory) | 55 |
| MEM/STUB (external faked) | 18 |
| MEM/MOCK (seeded/formula) | 15 |
| PARTIAL (mixed) | 10 |
| REAL stateless | 2 |
| **Total** | **104** |

---

*Track blockers in Build-2 milestones. Close P0 before closed-beta invite.*
