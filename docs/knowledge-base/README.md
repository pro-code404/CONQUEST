# Conquest Knowledge Base

Authoritative, maintainable reference for engineers, operators, and AI agents working on Conquest. Facts reflect the codebase **post Build-2 M4** (June 2026): Postgres persistence, Redis job queue with in-memory fallback, Resend/SMTP email, 270+ Vitest tests, Playwright e2e, `docker-compose.prod.yml`.

## Document authority

This knowledge base **summarizes** frozen architecture; it does not override it.

```
CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → Governance → Build Authorization
```

When this KB conflicts with [`docs/architecture/`](../architecture/) or an ADR, the architecture corpus wins.

## Index

| # | Document | Purpose |
|---|----------|---------|
| 1 | [system-overview.md](./system-overview.md) | Architecture, monorepo layout, request lifecycle, service interactions, layer boundaries |
| 2 | [product-knowledge.md](./product-knowledge.md) | What Conquest is/is not, mission, Build-1/2 summary, roadmap, status labels |
| 3 | [architecture-reference.md](./architecture-reference.md) | Subsystem catalog: auth, workspace, automation, research, intelligence, cognitive, memory, AI, ops, etc. |
| 4 | [data-flow-reference.md](./data-flow-reference.md) | End-to-end pipelines: auth, research, cognitive, automation, memory, recommendations, audit, telemetry |
| 5 | [repository-guide.md](./repository-guide.md) | Top-level folders, ownership, dependencies, entry points, startup flow |
| 6 | [api-reference.md](./api-reference.md) | All ~100 API routes from `apps/api/src/app.ts`, grouped by domain |
| 7 | [package-reference.md](./package-reference.md) | Every `packages/*` and `services/*` package: purpose, API, deps, consumers |
| 8 | [adr-index.md](./adr-index.md) | Readable index of ADRs 0001–0038 (titles + one-line summaries) |
| 9 | [development-guide.md](./development-guide.md) | Local run, test, deploy, debug, CI, migrations, Docker, Redis, Postgres |
| 10 | [agent-handbook.md](./agent-handbook.md) | Resume guide for AI agents: goals, standards, blockers, patterns |
| 11 | [conquest-master-spec.md](./conquest-master-spec.md) | Highest-level consolidated spec with cross-refs to PDD, SDD, UXMD, Build-2, governance |

## Related corpora

| Corpus | Path |
|--------|------|
| Architecture freeze | [`docs/architecture/ARCHITECTURE-FREEZE.md`](../architecture/ARCHITECTURE-FREEZE.md) |
| CCIS | [`docs/architecture/ccis.md`](../architecture/ccis.md) |
| Cognitive pipeline | [`docs/architecture/cognitive-pipeline.md`](../architecture/cognitive-pipeline.md) |
| ADRs (canonical) | [`docs/architecture/adr/`](../architecture/adr/) |
| PDD | [`docs/pdd/`](../pdd/) |
| SDD | [`docs/sdd/`](../sdd/) |
| UXMD | [`docs/uxmd/`](../uxmd/) |
| Build-2 program | [`docs/build-2/`](../build-2/) |
| Governance / BAR | [`docs/governance/`](../governance/) |
| Operations | [`docs/operations/`](../operations/) |
| Agent instructions | [`AGENTS.md`](../../AGENTS.md) |

## Quick facts (current build)

| Item | Value |
|------|-------|
| Monorepo | `apps/api`, `apps/web`, `packages/*`, `services/*` |
| API framework | Hono (`@conquest/api`, port `CONQUEST_API_PORT` default 3001) |
| Web | Vite + React (`@conquest/web`) |
| Persistence | `DATABASE_URL` → Drizzle/Postgres; `MEMORY_REPO=true` for CI |
| Cache / queue | `REDIS_URL` optional; in-memory cache and job fallback |
| Email | `EMAIL_PROVIDER`: `console`, `resend`, `smtp` |
| Tests | 278 Vitest unit/integration; Playwright e2e (`pnpm test:e2e`) |
| Demo readiness | ~96% (closed-beta target per Build-2 M4) |

*Last updated: Build-2 M4 baseline, 2026-06-21.*
