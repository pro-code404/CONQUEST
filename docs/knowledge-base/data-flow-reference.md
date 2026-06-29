# Data Flow Reference

End-to-end pipelines. Cross-reference: [architecture-reference](./architecture-reference.md) · [api-reference](./api-reference.md) · [`docs/architecture/cognitive-pipeline.md`](../architecture/cognitive-pipeline.md)

---

## Auth pipeline

```
Signup → hash password → create user (unverified)
      → NotificationService.sendVerificationEmail
      → audit record

Verify email → token validation → mark verified

Login → verify credentials → create ServerSession → Set-Cookie (SESSION_COOKIE_NAME)

Authenticated request → getCookie → findSession
                     → check revoked / expiresAt
                     → load user + org + workspace scope

Logout → revoke session → delete cookie
```

**Persistence:** `DrizzleAuthRepository` when `DATABASE_URL` set; all session/user/org writes transactional.

**Tenant gate:** Every workspace-scoped handler verifies `session.orgId === workspace.orgId`.

---

## Research → cognitive → intelligence pipeline

```
POST /research/sessions → ResearchService.create
POST /research/sessions/:id/sources → register sources (evidence inputs)

POST /research/sessions/:id/analyze
  → IntelligenceService.analyzeFromResearch(sessionId, workspaceId, sessionId, correlationId)
  → IntelligenceCognitiveProvider.analyze(scope, { objective, constraints, correlationId })
  → platform.cognitive.run(scope, CognitiveRequest)
       → EvidenceEngine.collect (from research sources)
       → ReasoningEngine.reason
       → DecisionEngine.evaluate
       → Verification gate (orchestrator internal)
       → optional async via JobService when async:true
  → persist recommendation + evidence refs in repository
  → return analysis payload

GET /intelligence/feed → IntelligenceService lists pipeline-backed items
GET /intelligence/recommendations/:id → detail with evidenceItems
POST .../recommendations/:id/status → approve | defer | dismiss + audit
```

**Command Center refresh:** `GET /command-center/dashboard` calls `buildCommandCenterDashboard` with intelligence feed + automation + ops snapshots.

---

## Cognitive pipeline (direct API)

```
POST /workspaces/:id/cognitive/run
  → cognitiveScope(repo, sessionId, workspaceId)  // tenant check
  → platform.cognitive.run(TenantScope, CognitiveRequest)
  → returns { requestId, correlationId, recommendationSummary, confidence, evidenceCount, ... }

GET /cognitive/requests/:requestId → platform.cognitive.getLifecycle(requestId)

POST /cognitive/evidence → platform.evidence.collect(workspaceId, body)
POST /cognitive/reasoning → platform.reasoning.reason(workspaceId, body)
POST /cognitive/decisions → platform.decision.evaluate(workspaceId, body)
POST /cognitive/providers/route → platform.aiProvider.route(body)
```

Phases (canonical): Perceive → Understand → Reconstruct → Reason → Plan → Orchestrate → **Verify** → Execute → Reflect → Learn.

---

## Automation pipeline

```
CRUD /automation/workflows → AutomationService → AuthRepository

enable | disable | pause | resume → state machine + audit

POST .../workflows/:id/run
  → AutomationService.runWorkflow
  → **current:** audit log + deferred execution message
  → **planned (B2-M5):** JobService enqueue → execution engine

GET /automation/approvals → pending approval workflows
POST .../approve | /reject → governance gate before future execution

POST /automation/validate/trigger | /schedule → schema validation only
```

Policies from `GET/PUT /api/settings/automation-policies` constrain concurrent runs (`AUTOMATION_GOVERNANCE_CONSTANTS`).

---

## Memory pipeline

```
Settings: GET/PUT /api/settings/memory → user/org memory preferences

Cognitive run → engines produce MemoryDelta candidates
             → CognitiveMemoryManager (sole write authority)
             → MemoryPlatform store (in-process; durable store planned)

Reads: intelligence/research may read scoped memory via platform services
Writes: **never** direct from Presentation or domain services
```

See [ADR-0008](../architecture/adr/0008-memory-governance.md), [ADR-0029](../architecture/adr/0029-memory-read-write-authority.md).

---

## Recommendations pipeline

```
Source: cognitive.run output OR analyzeFromResearch
     → IntelligenceService persists recommendation entity
     → links evidenceRefs, reasoningId, decisionId, confidence

Feed: GET /intelligence/feed (filtered, paginated)
Detail: GET /intelligence/recommendations/:id
Action: POST .../status { status: approved | deferred | dismissed }
     → audit trail via AuditService
     → Command Center zones update on next dashboard fetch
```

---

## Command Center pipeline

```
GET /command-center/status → workspace health summary
GET /command-center/dashboard
  → buildCommandCenterDashboard({
       workspace,
       intelligenceFeed,
       automationSummary,
       operationsTelemetry,
     })
  → zones: Recommendations, Alerts, Activity, Quick actions (UXMD-driven)
```

Empty states are **honest** when no intelligence data exists (post-M1 behavior).

---

## Settings pipeline

```
GET /settings/categories → role-filtered nav (GIS permissions via canAccessModuleRead)

Per-category GET/PUT → SettingsService → AuthRepository
  → account, preferences, organization, notifications, privacy,
    billing, integrations, workspace, team, security, automation-policies,
    advanced, memory, activity, sources, goals, prompts, administration

Side effects:
  - member invite → NotificationService.sendInviteEmail
  - privacy export/deletion → job placeholder (Deferred)
  - MFA enroll → SecurityService + TOTP secrets
```

---

## Legal & audit pipeline

```
GET /legal/documents → public document versions (no auth)
GET /legal/status → user acceptance state (auth)
POST /legal/accept → durable acceptance record + version pin
POST /legal/cookie-consent → consent preferences

All /api/* → securityAuditMiddleware → structured security events
Domain mutations → AuditService.append (auth, settings, automation, intelligence actions)
GET /settings/activity → paginated audit feed
```

---

## Telemetry & operations pipeline

```
requestTimingMiddleware → x-response-time-ms
rateLimitMiddleware → OperationalMetricsCollector (allowed/blocked)
platform.metrics + cognitiveMetrics → cognitive phase timings

GET /api/ops/status
  → buildOperationalStatus({ persistenceMode, probes, rateLimitEvents, cognitiveMetrics })
  → probeDependencies({ repo, jobService, redis, ... })

GET /api/ops/degradation → dependency failure summary

GET /workspaces/:id/operations/dashboard
  → OperationsService.getDashboard (queue, cache, AI providers)
```

**Health probes:** `/api/health`, `/api/health/live`, `/api/health/ready` for orchestrators (Docker, k8s).

---

## Email notification pipeline

```
NotificationService method (verify, invite, reset)
  → createEmailProvider() based on EMAIL_PROVIDER
       console → log only (dev)
       resend → ResendEmailProvider (API key)
       smtp → SmtpEmailProvider (nodemailer)
  → RetryingEmailProvider wrapper (MAX_ATTEMPTS, backoff)
  → persist EmailDeliveryRecord + audit
```

---

## Job queue pipeline (M4)

```
server.ts → createJobService({ redisUrl: REDIS_URL })
  → redis: RedisJobClient + RedisJobStore + RedisDeadLetterQueue
  → fallback: in-memory JobStore

cognitive.run({ async: true }) → JobService.enqueue
  → worker processes → updates lifecycle via CognitiveOrchestrator

GET /ops/status → queue metrics (queued, running, completed, failed, deadLetter)
```

---

## Cache pipeline

```
createPlatformServices → createCacheProvider({ redisClient })
  → Redis or in-memory CacheService
  → keys prefixed conquest:cache:
  → DEFAULT_TTL_MS 300_000

Cognitive/intelligence reads check cache before re-running pipeline (platform internal).
```

---

## Correlation & tracing

Every API request receives `correlationId` from `correlationIdMiddleware`. Cognitive requests pass `correlationId` through to platform for log alignment. Distributed tracing (`runWithTraceContext`) — **Planned** ([B2-P2-07](../build-2/launch-readiness-report.md)).
