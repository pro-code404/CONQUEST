# 06 — Repository Architecture

Every directory, package, service, script, and dependency flow.

---

## 1. Repository root

| Path | Why it exists |
|------|---------------|
| `apps/` | Deployable applications (api, web) |
| `packages/` | Shared libraries |
| `services/` | Domain + platform runtime |
| `docs/` | All knowledge — architecture, project-brain, build-2 |
| `e2e/` | Playwright journey tests |
| `scripts/` | `build.mjs`, verify-build-0 |
| `tools/load-testing/` | Load test scaffold |
| `.github/workflows/` | CI — build, typecheck, test, e2e |
| `docker-compose.yml` | Local Postgres + Redis |
| `docker-compose.prod.yml` | Production stack |
| `vitest.config.ts` | Unit/integration test runner |
| `playwright.config.ts` | E2E with webServer |
| `pnpm-workspace.yaml` | Monorepo workspace definition |
| `AGENTS.md` | Chief Systems Engineer instructions |
| `README.md` | Entry — points to Project Brain |

---

## 2. apps/api

| File / area | Purpose |
|-------------|---------|
| `src/server.ts` | HTTP server bootstrap |
| `src/app.ts` | ~100 routes, middleware stack |
| `src/app.test.ts` | Integration tests |
| `Dockerfile.api` | Production container |

**Depends on:** `@conquest/auth`, `@conquest/platform`, `@conquest/database`, `@conquest/config`

---

## 3. apps/web

| File / area | Purpose |
|-------------|---------|
| `src/main.tsx` | React root, AuthProvider, ErrorBoundary |
| `src/App.tsx` | RouterProvider only |
| `src/routes/index.tsx` | Full route tree + RootLayout |
| `src/auth/` | Session client, route guards, route-access |
| `src/features/` | Feature screens per UXMD module |
| `src/layouts/` | RootLayout, WorkspaceLayout, SettingsLayout |
| `vite.config.ts` | Dev server, proxy, workspace aliases |
| `index.html` | Boot splash before JS |

---

## 4. packages/ (complete)

| Package | Exports / role |
|---------|----------------|
| `@conquest/cache` | Cache provider + Redis factory |
| `@conquest/config` | Env validation, constants |
| `@conquest/contracts` | Zod schemas — 25 contract surfaces |
| `@conquest/core` | TenantScope, pipeline artifacts |
| `@conquest/database` | Drizzle schema, migrations, backup |
| `@conquest/engines` | HUE helpers |
| `@conquest/gis` | Tokens, nav constants, route parsers |
| `@conquest/observability` | Trace/logging hooks |
| `@conquest/performance` | Metrics collectors |
| `@conquest/presentation` | GIS-bound React views |
| `@conquest/prompt-management` | Prompt registry |
| `@conquest/prompt-security` | Injection checks |
| `@conquest/visualization-config` | Charts config (deferred) |

---

## 5. services/ (complete)

| Service | Role |
|---------|------|
| `auth` | Domain: identity, workspace, settings, automation, intelligence, research, legal, notifications, audit, analytics, ops, administration + DrizzleAuthRepository |
| `platform` | `createPlatformServices` composition root |
| `cognitive` | Orchestrator + evidence/reasoning/decision engines |
| `ai-gateway` | Provider abstraction (stubs) |
| `ai-audit` | AI call audit log |
| `jobs` | JobService, Redis/memory store, DLQ |
| `memory` | Memory platform + cognitive memory manager |
| `session` | Session manager abstraction |
| `orchestrator` | Legacy PipelineRunner — **not on API path** |
| `shared` | Service base classes |

---

## 6. docs/ map

| Folder | Content |
|--------|---------|
| `project-brain/` | **Supreme engineering memory** |
| `architecture/` | CCIS, AMD, ADR, RTM, freeze |
| `knowledge-base/` | Operational reference |
| `build-2/` | Milestones, blockers, recovery |
| `governance/` | BAR records |
| `pdd/`, `uxmd/`, `sdd/` | Frozen specs |
| `operations/` | Runbooks, DR, threat model |
| `archive/` | Historical only |

---

## 7. Build scripts

| Command | Script |
|---------|--------|
| `pnpm build` | `scripts/build.mjs` — topological package build |
| `pnpm dev` | Build web deps + parallel api/web dev |
| `pnpm dev:fast` | Skip full rebuild — api/web only |
| `pnpm test` | Vitest |
| `pnpm test:e2e` | Build + Playwright |
| `pnpm db:migrate` | Drizzle migrations |

---

## 8. Dependency flow

```
apps/web → presentation, gis, contracts, auth (types only)
apps/api → auth, platform, database, config
services/auth → database, contracts, core, config
services/platform → cognitive, ai-gateway, jobs, cache, memory, prompt-*
services/cognitive → engines, contracts, prompt-security
```

**Forbidden:** web → cognitive, web → platform, api → duplicate domain logic.

---

*Next: [07 — Runtime architecture](./07-runtime-architecture.md)*
