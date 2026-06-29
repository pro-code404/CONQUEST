# Repository Guide

Cross-reference: [system-overview](./system-overview.md) · [package-reference](./package-reference.md) · [development-guide](./development-guide.md)

## Top-level structure

| Path | Ownership | Purpose |
|------|-----------|---------|
| `apps/api` | Platform team | Hono HTTP server, middleware, route wiring |
| `apps/web` | Experience team | Vite/React SPA, routing, feature screens |
| `packages/*` | Shared libraries | Contracts, config, GIS, cache, database, engines |
| `services/*` | Domain/platform | Auth domain, cognitive, AI, jobs, memory, platform composition |
| `docs/` | Architecture program | Frozen specs — **authoritative** over code |
| `scripts/` | Engineering | `build.mjs`, `verify-build-0.mjs`, migrate helpers |
| `.github/workflows/` | Engineering | CI: governance + build + test |
| `e2e/` or `tests/e2e/` | QA | Playwright end-to-end specs |
| `docker-compose.yml` | Ops | Local Postgres + Redis |
| `docker-compose.prod.yml` | Ops | Full production stack |
| `Dockerfile.api`, `Dockerfile.web` | Ops | Container images |

Prototype archive: [`docs/archive/prototype/`](../archive/prototype/) — superseded spike code.

## Dependency direction (allowed)

```
apps/web  →  packages (gis, presentation, contracts) — NOT services directly
apps/api  →  services, packages
services/auth  →  packages, service-shared
services/platform  →  cognitive, ai-gateway, jobs, memory, cache, …
packages/contracts  →  (leaf — schemas only)
packages/core  →  zod
```

**Forbidden:** `packages/*` importing `apps/*`; `services/*` importing `apps/*`; Presentation importing cognitive engines.

## Entry points

| Entry | File | Command |
|-------|------|---------|
| API server | `apps/api/src/server.ts` | `pnpm dev:api` or `pnpm --filter @conquest/api start` |
| API app factory | `apps/api/src/app.ts` | `createApiApp()` — used in tests |
| Web dev server | `apps/web` (Vite) | `pnpm dev` |
| Web root | `apps/web/src/main.tsx` | React bootstrap + router |
| Platform factory | `services/platform/src/index.ts` | `createPlatformServices()` |
| Auth public API | `services/auth/src/index.ts` | Re-exports all domain services |

## Startup flow (production)

```
1. node apps/api/dist/server.js
2. validateApiEnvironment()
     - CONQUEST_PROFILE, DATABASE_URL, REDIS_URL, JWT_SECRET, CORS_ORIGINS, …
3. if postgres: runMigrations(DATABASE_URL)
4. createRedisClient(REDIS_URL) — optional
5. createJobService({ redisUrl }) — redis | in-memory label
6. createApiApp({ apiEnv, redisClient, jobService, jobQueueLabel })
7. serve Hono on CONQUEST_API_PORT (default 3001)
8. if production + DATABASE_URL: IntervalBackupScheduler (24h Postgres backup)
9. SIGTERM/SIGINT → graceful shutdown, closeAuthRepository()
```

Web container (`Dockerfile.web`) serves static build; nginx proxies `/api` to API service.

## Workspace packages (pnpm)

Root `package.json` workspaces include `apps/*`, `packages/*`, `services/*`. Package manager: **pnpm 9.15.4**, Node **>=20 <25**.

| Script | Action |
|--------|--------|
| `pnpm install` | Install all workspace deps |
| `pnpm build` | `node scripts/build.mjs` — topological build |
| `pnpm dev` | Build web deps + parallel api/web dev |
| `pnpm test` | Vitest unit/integration |
| `pnpm test:e2e` | Playwright |
| `pnpm typecheck` | All packages + apps |
| `pnpm db:migrate` | Drizzle migrations |
| `pnpm docker:up` | Local compose |

## Configuration surface

Centralized in `@conquest/config`:

- `validateApiEnvironment()` — `packages/config/src/env-validation.ts`
- `API_CONSTANTS`, `JOB_CONSTANTS`, etc. — `packages/config/src/constants.ts`

**Never** scatter magic numbers in feature code (SDD-V ENG standards).

## Test layout

| Config | Scope |
|--------|-------|
| `vitest.config.ts` | Unit tests across packages, services, apps |
| `vitest.integration.config.ts` | Integration tests |
| `playwright.config.ts` | E2E browser tests |
| `MEMORY_REPO=true` | CI uses in-memory auth repository |

## Documentation map

| Need | Read |
|------|------|
| API routes | [api-reference](./api-reference.md) |
| Package APIs | [package-reference](./package-reference.md) |
| ADR decisions | [adr-index](./adr-index.md) |
| Build-2 status | [`docs/build-2/`](../build-2/) |
| Deploy | [`docs/operations/deployment.md`](../operations/deployment.md) |
| Agent rules | [agent-handbook](./agent-handbook.md), [`AGENTS.md`](../../AGENTS.md) |

## Git & governance

- Build Authorization required before treating `apps/` code as production architecture
- BAR Build-1: [`docs/governance/build-authorization-record-build-1-2026-06-26.md`](../governance/build-authorization-record-build-1-2026-06-26.md)
- CI governance job verifies frozen corpus files exist (`.github/workflows/ci.yml`)
