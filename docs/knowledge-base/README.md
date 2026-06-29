# Conquest Knowledge Base

Operational reference for engineers and AI agents. **For identity, intent, and complete reconstruction, read [Project Brain](../project-brain/README.md) first.**

Facts reflect the codebase **post Build-2 M4** + Recovery Phase 3.

## Document authority

**Project Brain** (`docs/project-brain/`) is the supreme engineering memory entry point.

This knowledge base **summarizes** frozen architecture and operational detail; it does not override CCIS/ADR or Project Brain on identity.

```
CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → Governance → Build Authorization
```

When this KB conflicts with [`docs/architecture/`](../architecture/) or an ADR, the architecture corpus wins.

## Index

| # | Document | Purpose |
|---|----------|---------|
| **0** | [**Project Brain**](../project-brain/README.md) | **Supreme engineering memory — read first** |
| **M** | [conquest-complete-reference.md](./conquest-complete-reference.md) | Single largest technical reference (architecture, modules, builds) |
| **M** | [engineering-constitution.md](./engineering-constitution.md) | Permanent engineering rules — never bypass boundaries |
| **M** | [development-memory.md](./development-memory.md) | Institutional memory — decisions, rejections, build evolution |
| **M** | [production-architecture.md](./production-architecture.md) | Deploy topology, ops, scaling, DR, env vars |
| **M** | [product-master-spec.md](./product-master-spec.md) | Authoritative merged product specification |
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
| 11 | [conquest-master-spec.md](./conquest-master-spec.md) | Legacy consolidated spec — **prefer [product-master-spec.md](./product-master-spec.md)** |

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
| Build-2 program | [`docs/build-2/`](../build-2/) — [recovery-phase-2-report](../build-2/recovery-phase-2-report.md) |
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

*Last updated: Build-2 M4 complete + Recovery Phase 2 sync, 2026-06-21.*
