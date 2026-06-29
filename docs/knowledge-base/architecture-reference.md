# Architecture Reference

Subsystem catalog for Conquest. Cross-reference: [system-overview](./system-overview.md) · [data-flow-reference](./data-flow-reference.md) · [package-reference](./package-reference.md) · [adr-index](./adr-index.md)

Each subsystem lists: **purpose**, **primary code**, **key ADRs**, **status**.

---

## Auth & identity

| | |
|---|---|
| **Purpose** | Signup, login, logout, email verification, password reset, invites, session cookies, onboarding |
| **Code** | `services/auth` — `IdentityService`, `createAuthRepository`, `DrizzleAuthRepository` |
| **API** | `/api/auth/*` — [api-reference](./api-reference.md#authentication) |
| **ADRs** | [0017](../architecture/adr/0017-identity-session-model.md), [0016](../architecture/adr/0016-tenant-isolation-strategy.md) |
| **Status** | Implemented (Postgres persistence) |

Sessions are httpOnly cookies; `SESSION_TTL_MS` with sliding refresh. Dev returns `verificationToken` in non-prod signup response.

---

## Workspace

| | |
|---|---|
| **Purpose** | Multi-workspace org model; workspace selection; scoped operating context |
| **Code** | `WorkspaceService`, workspace records in `AuthRepository` |
| **API** | `/api/workspaces`, `/api/auth/workspace/:id/*` |
| **ADRs** | [0003](../architecture/adr/0003-workspace-as-context.md) |
| **Status** | Implemented |

Workspace is context for intelligence, automation, research — not primary navigation.

---

## Settings & profile

| | |
|---|---|
| **Purpose** | Account, preferences, org members, notifications, privacy, billing, integrations, workspace config, team, security, MFA, automation policies, memory prefs, activity, sources, goals, prompts, administration |
| **Code** | `SettingsService`, `SecurityService`, `AdministrationService`; screens in `apps/web` |
| **API** | `/api/settings/*`, `/api/profile/*` |
| **Status** | Implemented (billing/integrations OAuth deferred) |

`SETTINGS_CATEGORIES` drives settings nav including Administration for admin+ roles.

---

## Automation

| | |
|---|---|
| **Purpose** | Workflow CRUD, enable/disable/pause/resume, manual run, executions, approval gates, trigger/schedule validation |
| **Code** | `AutomationService` in `@conquest/auth` |
| **API** | `/api/workspaces/:id/automation/*`, `/api/automation/validate/*` |
| **ADRs** | [0015](../architecture/adr/0015-execution-layer-separation.md) |
| **Status** | CRUD Implemented; **execution engine Deferred** (run records audit only) |

Governance constants: `AUTOMATION_GOVERNANCE_CONSTANTS` in `@conquest/config`.

---

## Research

| | |
|---|---|
| **Purpose** | Research sessions, source registration, session detail; feeds cognitive evidence |
| **Code** | `ResearchService` |
| **API** | `/api/workspaces/:id/research/*` |
| **Status** | Implemented |

`POST .../analyze` delegates to `IntelligenceService.analyzeFromResearch` → cognitive pipeline.

---

## Intelligence

| | |
|---|---|
| **Purpose** | Home, feed, recommendations, opportunities, risks, timeline; recommendation status updates |
| **Code** | `IntelligenceService` + `IntelligenceCognitiveProvider` injection |
| **API** | `/api/workspaces/:id/intelligence/*` |
| **ADRs** | [0036](../architecture/adr/0036-intelligence-platform-module-foundations.md), [0031](../architecture/adr/0031-evidence-first-reasoning.md) |
| **Status** | Implemented (pipeline-backed after research analyze) |

---

## Cognitive platform

| | |
|---|---|
| **Purpose** | Full pipeline orchestration: perceive → … → learn; evidence, reasoning, decision sub-engines |
| **Code** | `services/cognitive` — `CognitiveOrchestrator`, `EvidenceEngine`, `ReasoningEngine`, `DecisionEngine` |
| **Composition** | `services/platform` — `createPlatformServices()` |
| **API** | `/api/workspaces/:id/cognitive/*` |
| **ADRs** | [0007](../architecture/adr/0007-ccis-cognitive-lifecycle-order.md), [0026](../architecture/adr/0026-cognitive-pipeline-authority.md), [0037](../architecture/adr/0037-cognitive-intelligence-foundation.md), [0038](../architecture/adr/0038-cognitive-platform-hardening.md) |
| **Status** | Implemented (API); cognitive web UI Planned |

`POST /cognitive/run` supports `async: true` for job-backed runs.

---

## Memory

| | |
|---|---|
| **Purpose** | Cognitive memory platform; compression of patterns/goals — not raw chat archives |
| **Code** | `services/memory` — `MemoryPlatform`, `CognitiveMemoryManager` |
| **Settings** | `/api/settings/memory` |
| **ADRs** | [0008](../architecture/adr/0008-memory-governance.md), [0029](../architecture/adr/0029-memory-read-write-authority.md) |
| **Status** | Implemented (manager); durable vector store Planned |

**Sole write authority:** Memory Manager only. Engines produce candidates, never direct writes.

---

## AI gateway & providers

| | |
|---|---|
| **Purpose** | Provider abstraction, routing, timeouts, retries, status reporting |
| **Code** | `services/ai-gateway` — `AiGateway`, `AiProviderOrchestrator` |
| **API** | `POST .../cognitive/providers/route`, ops AI status |
| **ADRs** | [0011](../architecture/adr/0011-ai-provider-abstraction.md), [0034](../architecture/adr/0034-ai-failure-recovery.md), [0035](../architecture/adr/0035-ai-safety-boundaries.md) |
| **Status** | Implemented (abstraction); live provider keys env-gated |

Constants: `AI_GATEWAY_CONSTANTS` in `@conquest/config`.

---

## Prompts & prompt security

| | |
|---|---|
| **Purpose** | Template registry, registration; injection/safety checks |
| **Code** | `packages/prompt-management` — `PromptRegistry`; `packages/prompt-security` |
| **API** | `GET/POST /api/settings/prompts` |
| **Status** | Implemented (registry); advanced prompt ops In Progress |

---

## Evidence & decision

| | |
|---|---|
| **Purpose** | Evidence portfolio collection; reasoning chains; decision evaluation with confidence |
| **Code** | `EvidenceEngine`, `ReasoningEngine`, `DecisionEngine` in `@conquest/cognitive` |
| **API** | `POST .../cognitive/evidence`, `.../reasoning`, `.../decisions` |
| **ADRs** | [0031](../architecture/adr/0031-evidence-first-reasoning.md), [0027](../architecture/adr/0027-verification-gate-ownership.md) |
| **Status** | Implemented |

---

## Operations & observability

| | |
|---|---|
| **Purpose** | Ops dashboard, queue/cache metrics, AI provider health, degradation reporting |
| **Code** | `OperationsService`, `operational-status.ts`, `dependency-probes.ts`, `@conquest/performance`, `@conquest/observability` |
| **API** | `/api/ops/*`, `/api/workspaces/:id/operations/dashboard` |
| **ADRs** | [0023](../architecture/adr/0023-monitoring-observability-strategy.md) |
| **Status** | Implemented |

---

## Administration

| | |
|---|---|
| **Purpose** | Org-level admin dashboard, feature flag toggles |
| **Code** | `AdministrationService` |
| **API** | `/api/settings/administration`, `PUT .../feature-flags/:flagId` |
| **Status** | Implemented |

---

## Legal & compliance

| | |
|---|---|
| **Purpose** | Public legal documents, acceptance records, cookie consent |
| **Code** | `LegalService` |
| **API** | `/api/legal/*` (public + authenticated accept) |
| **Status** | Implemented; counsel review of draft text Deferred |

---

## Platform composition

| | |
|---|---|
| **Purpose** | Single factory for cache, jobs, AI, memory, cognitive, metrics |
| **Code** | `services/platform` — `createPlatformServices`, `createRedisClient`, `getPlatformHealthReport` |
| **Status** | Implemented |

Wires Redis cache when `REDIS_URL` present; falls back to in-memory.

---

## Cache

| | |
|---|---|
| **Purpose** | TTL cache for cognitive outputs, session-adjacent data |
| **Code** | `packages/cache` — `CacheService`, key prefix `conquest:cache:` |
| **Status** | Implemented (memory + Redis providers) |

---

## Jobs & queue

| | |
|---|---|
| **Purpose** | Async cognitive runs, retries, dead-letter queue |
| **Code** | `services/jobs` — `JobService`, `RedisJobStore`, `RedisDeadLetterQueue`, in-memory fallback |
| **ADRs** | [0010](../architecture/adr/0010-event-driven-architecture.md) |
| **Status** | Implemented — Redis when `REDIS_URL` set; in-memory CI fallback |

`createJobService({ redisUrl })` selects queue backend at startup.

---

## Database

| | |
|---|---|
| **Purpose** | Drizzle schema, migrations, Postgres backup abstraction |
| **Code** | `packages/database` — `runMigrations`, `PostgresBackupProvider`, `IntervalBackupScheduler` |
| **Env** | `DATABASE_URL`; `MEMORY_REPO=true` skips Postgres |
| **ADRs** | [0021](../architecture/adr/0021-disaster-recovery-strategy.md) |
| **Status** | Implemented |

83+ repository methods on `DrizzleAuthRepository` for auth domain.

---

## Email & notifications

| | |
|---|---|
| **Purpose** | Transactional email: verify, invite, password reset |
| **Code** | `NotificationService`, `createEmailProvider()` — Resend, SMTP (nodemailer), console |
| **Env** | `EMAIL_PROVIDER`, `RESEND_API_KEY`, SMTP_* vars |
| **Status** | Implemented — Resend, SMTP, console providers (M4) |

Retry wrapper: `RetryingEmailProvider` with `EMAIL_CONSTANTS`.

---

## AI audit

| | |
|---|---|
| **Purpose** | Structured logging of AI calls; prompt content redacted by default |
| **Code** | `services/ai-audit` — `AiAuditService` |
| **Status** | Implemented |

`AI_AUDIT_CONSTANTS.LOG_PROMPT_CONTENT_DEFAULT: false`.

---

## Analytics

| | |
|---|---|
| **Purpose** | Dashboard metrics, metric registry, saved views |
| **Code** | `AnalyticsService` |
| **API** | `/api/workspaces/:id/analytics/*` |
| **Status** | API Implemented; chart visualization Deferred |

---

## Command Center

| | |
|---|---|
| **Purpose** | Product home; synthesized zones from intelligence, automation, ops |
| **Code** | `buildCommandCenterDashboard`, web Command Center screens |
| **API** | `/api/workspaces/:id/command-center/*` |
| **ADRs** | [0002](../architecture/adr/0002-command-center-as-home.md) |
| **Status** | Implemented |

---

## Engines (HUE / pipeline artifacts)

| | |
|---|---|
| **Purpose** | Human Understanding Engine helpers; pipeline artifact types |
| **Code** | `packages/engines`, `packages/core` — `TenantScope`, pipeline artifacts |
| **Status** | Implemented (library); full HUE orchestration In Progress |

---

## Orchestrator (SDD-IV)

| | |
|---|---|
| **Purpose** | Cross-engine coordination per SDD Volume IV |
| **Code** | `services/orchestrator` |
| **ADRs** | [0030](../architecture/adr/0030-multi-agent-coordination.md), [0028](../architecture/adr/0028-agent-isolation.md) |
| **Status** | Planned for full multi-agent; cognitive orchestrator covers Build-1 scope |

---

## GIS & presentation

| | |
|---|---|
| **Purpose** | Design tokens, navigation constants, permissions; shared React shell components |
| **Code** | `packages/gis`, `packages/presentation`, `packages/visualization-config` |
| **ADRs** | [0012](../architecture/adr/0012-gis-inheritance.md) |
| **Status** | Implemented |

---

## Session service

| | |
|---|---|
| **Purpose** | Session manager abstraction (companion to auth repository) |
| **Code** | `services/session` |
| **Status** | Partial — sessions durable via Drizzle repo; dedicated adapter optional |

---

## Security infrastructure

| | |
|---|---|
| **Purpose** | Rate limiting, security headers, audit middleware, MFA, device trust |
| **Code** | `apps/api/src/middleware/*`, `SecurityService` |
| **ADRs** | [0018](../architecture/adr/0018-encryption-key-custody.md), [0019](../architecture/adr/0019-secrets-management-strategy.md), [0020](../architecture/adr/0020-infrastructure-trust-boundaries.md), [0024](../architecture/adr/0024-security-incident-response.md) |
| **Status** | Implemented (baseline); Redis-backed distributed rate limit Planned |
