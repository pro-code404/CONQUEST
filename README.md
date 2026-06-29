# Conquest

**Strategic Intelligence Operating System**

Conquest is a cognitive operating system governed by a frozen architecture program and an integration-first Build-2 engineering program.

## Current status (authoritative)

| Item | Value |
|------|-------|
| **Build program** | Build-2 complete through **M4** (closed-beta readiness) |
| **Build authorization** | Build-1 BAR issued ([BAR-2026-06-26-001](docs/governance/build-authorization-record-build-1-2026-06-26.md)) |
| **Tests** | 278 Vitest + Playwright e2e (CI) |
| **Closed-beta readiness** | ~96% |
| **Next milestone** | Build-2 M5 (execution boundary — gated) |

**Start here (everyone):** [`docs/project-brain/README.md`](docs/project-brain/README.md) — **Project Brain** (supreme engineering memory)

**Institutional memory (Phase 4):** [`docs/institutional-memory/README.md`](docs/institutional-memory/README.md) — constitution, philosophy, domain encyclopedia, **97.2% coverage**

**Quick start (engineers & AI agents):** [`docs/knowledge-base/ai-agent-onboarding.md`](docs/knowledge-base/ai-agent-onboarding.md)

## Authority chain

```
CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → Governance → Build Authorization → Build
```

| Corpus | Path |
|--------|------|
| **Project Brain (start here)** | [`docs/project-brain/README.md`](docs/project-brain/README.md) |
| Knowledge base (operational reference) | [`docs/knowledge-base/README.md`](docs/knowledge-base/README.md) |
| Architecture (frozen) | [`docs/architecture/README.md`](docs/architecture/README.md) |
| Product | [`docs/pdd/README.md`](docs/pdd/README.md) |
| Experience | [`docs/uxmd/README.md`](docs/uxmd/README.md) |
| Engineering | [`docs/sdd/README.md`](docs/sdd/README.md) |
| **Institutional memory** | [`docs/institutional-memory/README.md`](docs/institutional-memory/README.md) |
| Build-2 tracking | [`docs/build-2/`](docs/build-2/) — [Recovery Phase 4](docs/institutional-memory/documentation-coverage-report.md) |
| Governance | [`docs/governance/`](docs/governance/) |

See [`AGENTS.md`](AGENTS.md) for Chief Systems Engineer instructions.

## Implementation (authorized)

`apps/`, `packages/`, and `services/` contain the **authorized Build-1/2 implementation** — not a quarantined spike. Historical pre-GIS prototype code lives under [`docs/archive/prototype/`](docs/archive/prototype/). See [`PROTOTYPE.md`](PROTOTYPE.md).

## Local development

```bash
pnpm install
pnpm build
pnpm dev              # API + web
pnpm test             # 278 unit/integration tests
pnpm test:e2e         # Playwright closed-beta journey (install Chromium first)
```

Infrastructure only: `pnpm docker:up` (Postgres + Redis)

Production stack: `docker compose -f docker-compose.prod.yml up --build`

Detail: [`docs/knowledge-base/development-guide.md`](docs/knowledge-base/development-guide.md)

## The First Law

> Conquest is never finished. Every interaction is an opportunity to improve the operating system.
