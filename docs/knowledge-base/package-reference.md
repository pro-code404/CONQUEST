# Package Reference

All workspace packages in `packages/` and `services/`. Cross-reference: [repository-guide](./repository-guide.md) · [architecture-reference](./architecture-reference.md)

---

## Apps

### `@conquest/api`

| | |
|---|---|
| **Purpose** | HTTP API — Hono app, middleware, route composition |
| **Public API** | `createApiApp()`, `server.ts` entry |
| **Dependencies** | `@conquest/auth`, `@conquest/platform`, `@conquest/config`, `@conquest/jobs`, `@conquest/cache`, `@conquest/contracts`, `@conquest/database`, `@conquest/gis`, `@conquest/performance`, `hono` |
| **Consumers** | Docker production image, Vitest `app.test.ts` |

### `@conquest/web`

| | |
|---|---|
| **Purpose** | React SPA — UXMD application shell, routing, feature screens |
| **Public API** | Vite entry `main.tsx`; no published npm API |
| **Dependencies** | `@conquest/presentation`, `@conquest/gis`, `@conquest/contracts`, `@conquest/auth` (types/client helpers), `react`, `react-router-dom` |
| **Consumers** | Browser, Playwright e2e |

---

## Packages

### `@conquest/contracts`

| | |
|---|---|
| **Purpose** | Zod schemas and TypeScript types for cross-module messages |
| **Public API** | `auth/schemas`, `cognitive/*`, `command-center/types`, `audit/types`, `operations/types`, `security/types` |
| **Dependencies** | `zod` |
| **Consumers** | All services, apps, presentation |

### `@conquest/core`

| | |
|---|---|
| **Purpose** | Pipeline artifacts, `TenantScope`, shared domain primitives |
| **Public API** | `TenantScope`, pipeline artifact types, security helpers |
| **Dependencies** | `zod` |
| **Consumers** | `@conquest/auth`, `@conquest/cognitive`, `@conquest/platform` |

### `@conquest/config`

| | |
|---|---|
| **Purpose** | Environment validation, centralized constants |
| **Public API** | `validateApiEnvironment()`, `API_CONSTANTS`, `JOB_CONSTANTS`, `EMAIL_CONSTANTS`, `toStructuredError()` |
| **Dependencies** | `zod` |
| **Consumers** | `apps/api`, all services needing env/constants |

### `@conquest/database`

| | |
|---|---|
| **Purpose** | Drizzle schema, migrations, Postgres backup |
| **Public API** | `runMigrations()`, `createDb()`, `PostgresBackupProvider`, `IntervalBackupScheduler` |
| **Dependencies** | `drizzle-orm`, `postgres` |
| **Consumers** | `@conquest/auth`, `apps/api/server.ts` |

### `@conquest/gis`

| | |
|---|---|
| **Purpose** | GIS design tokens, navigation constants, `canAccessModuleRead` permissions |
| **Public API** | Token exports, nav segments, permission helpers |
| **Dependencies** | None (pure) |
| **Consumers** | `apps/web`, `apps/api`, `@conquest/presentation`, `@conquest/auth` |

### `@conquest/presentation`

| | |
|---|---|
| **Purpose** | Shared React UI — shell, automation views, public screens |
| **Public API** | `AppShell`, `AutomationViews`, `PublicScreens`, layout primitives |
| **Dependencies** | `@conquest/gis`, `react` |
| **Consumers** | `apps/web` |

### `@conquest/cache`

| | |
|---|---|
| **Purpose** | Cache abstraction with metrics |
| **Public API** | `CacheService`, `RedisLikeClient` type, key helpers |
| **Dependencies** | None (Redis injected) |
| **Consumers** | `@conquest/platform`, `apps/api` |

### `@conquest/performance`

| | |
|---|---|
| **Purpose** | Operational and cognitive metrics collectors |
| **Public API** | `OperationalMetricsCollector`, `PlatformMetricsCollector`, `CognitiveMetricsCollector` |
| **Dependencies** | None |
| **Consumers** | `apps/api`, `@conquest/platform` |

### `@conquest/observability`

| | |
|---|---|
| **Purpose** | Tracing/logging hooks (foundation) |
| **Public API** | Trace context utilities |
| **Dependencies** | None |
| **Consumers** | `@conquest/auth`, `apps/api` |

### `@conquest/engines`

| | |
|---|---|
| **Purpose** | Human Understanding Engine helpers |
| **Public API** | `human-understanding` exports |
| **Dependencies** | `@conquest/core` |
| **Consumers** | `@conquest/cognitive` (future orchestration) |

### `@conquest/prompt-management`

| | |
|---|---|
| **Purpose** | Prompt template registry |
| **Public API** | `PromptRegistry` — `listTemplates()`, `registerTemplate()` |
| **Dependencies** | `@conquest/contracts` |
| **Consumers** | `@conquest/platform` |

### `@conquest/prompt-security`

| | |
|---|---|
| **Purpose** | Prompt injection and safety checks |
| **Public API** | Security validation functions |
| **Dependencies** | `@conquest/contracts` |
| **Consumers** | `@conquest/cognitive`, `@conquest/ai-gateway` |

### `@conquest/visualization-config`

| | |
|---|---|
| **Purpose** | Chart/theme config for analytics (deferred viz layer) |
| **Public API** | `theme` exports |
| **Dependencies** | `@conquest/gis` |
| **Consumers** | `apps/web` (analytics screens) |

---

## Services

### `@conquest/auth`

| | |
|---|---|
| **Purpose** | Domain layer: identity, workspace, settings, automation, intelligence, research, legal, notifications, audit, analytics, ops, administration |
| **Public API** | See `services/auth/src/index.ts` — all `*Service` classes, `createAuthRepository`, `DrizzleAuthRepository`, `createEmailProvider` |
| **Dependencies** | `@conquest/contracts`, `@conquest/core`, `@conquest/config`, `@conquest/database`, `@conquest/gis`, `@conquest/service-shared`, `@conquest/observability`, `drizzle-orm`, `nodemailer`, `postgres` |
| **Consumers** | `apps/api`, `apps/web` (limited) |

### `@conquest/platform`

| | |
|---|---|
| **Purpose** | Composition root for cache, jobs, AI, memory, cognitive engines, metrics |
| **Public API** | `createPlatformServices()`, `createRedisClient()`, `getPlatformHealthReport()`, `getCognitiveMetricsSnapshot()` |
| **Dependencies** | `@conquest/cache`, `@conquest/jobs`, `@conquest/ai-gateway`, `@conquest/ai-audit`, `@conquest/memory-service`, `@conquest/cognitive`, `@conquest/prompt-management`, `@conquest/performance`, `@conquest/contracts`, `@conquest/core` |
| **Consumers** | `apps/api` |

### `@conquest/cognitive`

| | |
|---|---|
| **Purpose** | Cognitive orchestrator and sub-engines |
| **Public API** | `CognitiveOrchestrator`, `EvidenceEngine`, `ReasoningEngine`, `DecisionEngine` |
| **Dependencies** | `@conquest/contracts`, `@conquest/core`, `@conquest/prompt-management`, `@conquest/prompt-security`, `@conquest/ai-gateway`, `@conquest/memory-service`, `@conquest/jobs` |
| **Consumers** | `@conquest/platform` |

### `@conquest/ai-gateway`

| | |
|---|---|
| **Purpose** | AI provider abstraction and routing |
| **Public API** | `AiGateway`, `AiProviderOrchestrator` |
| **Dependencies** | `@conquest/contracts`, `@conquest/config`, `@conquest/prompt-security`, `@conquest/ai-audit` |
| **Consumers** | `@conquest/platform`, `@conquest/cognitive` |

### `@conquest/ai-audit`

| | |
|---|---|
| **Purpose** | AI call audit logging |
| **Public API** | `AiAuditService` |
| **Dependencies** | `@conquest/config` |
| **Consumers** | `@conquest/platform`, `@conquest/ai-gateway` |

### `@conquest/jobs`

| | |
|---|---|
| **Purpose** | Job queue with Redis and in-memory backends, dead-letter queue |
| **Public API** | `JobService`, `createJobService()`, `RedisJobStore`, `RedisDeadLetterQueue` |
| **Dependencies** | `@conquest/config`, `@conquest/contracts` |
| **Consumers** | `apps/api/server.ts`, `@conquest/platform`, `@conquest/cognitive` |

### `@conquest/memory-service`

| | |
|---|---|
| **Purpose** | Memory platform and cognitive memory manager |
| **Public API** | `MemoryPlatform`, `CognitiveMemoryManager` |
| **Dependencies** | `@conquest/contracts`, `@conquest/core` |
| **Consumers** | `@conquest/platform`, `@conquest/cognitive` |

### `@conquest/orchestrator`

| | |
|---|---|
| **Purpose** | SDD-IV cross-engine orchestration (foundation) |
| **Public API** | Orchestrator exports |
| **Dependencies** | `@conquest/service-shared`, `@conquest/contracts` |
| **Consumers** | Planned multi-agent coordination |

### `@conquest/session`

| | |
|---|---|
| **Purpose** | Session manager abstraction |
| **Public API** | Session manager exports |
| **Dependencies** | `@conquest/contracts` |
| **Consumers** | Build-2 session durability wiring |

### `@conquest/service-shared`

| | |
|---|---|
| **Purpose** | Base classes for gateway and execution services |
| **Public API** | `GatewayService`, `ExecutionService` bases |
| **Dependencies** | `@conquest/contracts` |
| **Consumers** | `@conquest/auth`, `@conquest/orchestrator` |

---

## Dependency graph (simplified)

```
apps/web → presentation, gis, contracts
apps/api → auth, platform, config, jobs, database, performance
platform → cognitive, ai-gateway, jobs, memory, cache, prompt-management, performance, ai-audit
cognitive → ai-gateway, memory-service, jobs, prompt-*
auth → database, contracts, core, config, gis
```

---

## Build order

`scripts/build.mjs` builds packages before services before apps (topological). Always `pnpm build` before running API from `dist/`.
