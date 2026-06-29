# AI Agent Onboarding

**Read [Project Brain](../project-brain/README.md) first** — Chapters **01** (philosophy) and **16** (misconceptions) are mandatory before any code.

Then read this document for day-to-day workflow.

Cross-reference: [engineering-constitution](./engineering-constitution.md) · [`AGENTS.md`](../../AGENTS.md)

---

## What you are working on

Conquest is a **Strategic Intelligence Operating System (CIOS)** — **not an AI wrapper, not a chatbot**. It routes requests through a governed cognitive pipeline (evidence → reasoning → decision → verification) with multi-tenant workspaces and Command Center UX.

**Current program:** Build-2 **M4 complete**. **M5 execution is gated** — requires Build-2 BAR (B-25–B-28). Recovery Phase 4 institutional memory is complete ([97.2% coverage](../institutional-memory/documentation-coverage-report.md)).

**Git baseline:** 278 Vitest tests, Playwright e2e in CI.

---

## Required reading order

| Order | Document | Why |
|-------|----------|-----|
| 0 | [**Project Brain**](../project-brain/README.md) | Supreme engineering memory — identity & intent |
| 0b | [01 Philosophy](../project-brain/01-philosophy-and-identity.md) | Why Conquest is an Intelligence OS |
| 0c | [16 Misconceptions](../project-brain/16-common-misconceptions.md) | False beliefs that cause defects |
| 0d | [18 Decision framework](../project-brain/18-architectural-decision-framework.md) | How to make architectural decisions |
| 0e | [Institutional Memory](../institutional-memory/README.md) | Constitution, philosophy, domain encyclopedia |
| 0f | [AI Curriculum](../institutional-memory/07-ai-onboarding-curriculum.md) | Structured 7-day learning path |
| 1 | **This file** | Agent workflow |
| 2 | [engineering-constitution.md](./engineering-constitution.md) | Permanent rules |
| 3 | [agent-handbook.md](./agent-handbook.md) | Resume checklist |
| 4 | [api-reference.md](./api-reference.md) | When touching routes |
| 5 | [`docs/build-2/production-blockers.md`](../build-2/production-blockers.md) | What is not done |

Frozen architecture (when in doubt): `docs/architecture/` → CCIS, AMD, ADR, RTM.

---

## Repository structure

```
apps/api/          Hono HTTP API — routes, middleware, composition only
apps/web/          Vite/React SPA — presentation only
packages/          Shared libraries (contracts, config, GIS, database, cache, …)
services/auth/     Domain: identity, workspace, settings, automation, intelligence, research, legal
services/platform/ Composition root: cognitive, AI gateway, cache, jobs, memory
services/cognitive/ Evidence, reasoning, decision engines
services/jobs/     Job queue (Redis or in-memory)
docs/knowledge-base/  Authoritative summaries (this folder)
docs/build-2/      Milestone reports and blockers
docs/architecture/ Frozen architecture — wins on conflict
```

**Entry points:** `apps/api/src/server.ts` (bootstrap), `apps/api/src/app.ts` (routes), `services/platform/src/index.ts` (platform wiring).

---

## Coding standards

1. **Smallest correct diff** — no drive-by refactors
2. **Match existing conventions** in the file you edit
3. **Domain logic** belongs in `services/auth` or platform services — not duplicated in `apps/api`
4. **Contracts** in `packages/contracts` — Zod at API boundaries
5. **Constants** in `packages/config` — no magic numbers in services
6. **GIS tokens** from `@conquest/gis` — no hardcoded colors/spacing in UI
7. **Tenant scope** — `session.orgId === workspace.orgId` on every workspace route
8. **Memory writes** — only via `CognitiveMemoryManager`
9. **Tests** — `MEMORY_REPO=true` for CI-safe persistence

---

## Forbidden patterns

See [engineering-constitution.md](./engineering-constitution.md). Summary:

- UI importing `@conquest/cognitive` or `@conquest/platform` directly
- Direct provider SDK calls outside `@conquest/ai-gateway`
- Bypassing `AuthRepository` for persistence
- Skipping verification before user-facing recommendations
- Enabling `executionReady` or autonomous execution without governance BAR
- Merging with failing `pnpm build`, `typecheck`, `lint`, or `test`
- Demo-only code paths that silently activate in production

---

## How to verify work

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm lint
pnpm test                    # 278 tests; MEMORY_REPO=true in CI
pnpm test:e2e                # Playwright closed-beta journey (needs Chromium)
```

Inject test deps via `createApiApp({ repo, persistenceMode, jobService })` in `apps/api/src/app.test.ts`.

---

## Build progression (do not confuse)

| Build | Status | Scope |
|-------|--------|-------|
| Build-0 | Complete | Architecture freeze, governance CI |
| Build-1 | Authorized (BAR-2026-06-26) | Application shell, platform foundation |
| Build-2 M1 | Complete | Integration, route access, CC wiring |
| Build-2 M2 | Complete | Postgres persistence, legal, notifications |
| Build-2 M3 | Complete | Docker, env validation, ops, rate limits |
| Build-2 M4 | Complete | Email providers, Redis jobs, Playwright e2e, KB |
| Build-2 M5 | **Not started** | Execution boundary — gated |

---

## What must never be modified without ADR

- CCIS twelve-stage lifecycle order ([ADR-0007](../architecture/adr/0007-ccis-cognitive-lifecycle-order.md))
- Seven-item primary navigation ([ADR-0005](../architecture/adr/0005-seven-item-primary-navigation.md))
- Learning boundary — no autonomous production code deploy ([ADR-0009](../architecture/adr/0009-learning-boundary.md))
- Execution layer separation ([ADR-0015](../architecture/adr/0015-execution-layer-separation.md))
- Memory governance — writes through Memory Manager ([ADR-0008](../architecture/adr/0008-memory-governance.md))

---

## Where documentation lives

| Need | Location |
|------|----------|
| Single technical map | [conquest-complete-reference.md](./conquest-complete-reference.md) |
| Engineering rules | [engineering-constitution.md](./engineering-constitution.md) |
| Institutional memory | [development-memory.md](./development-memory.md) |
| Production deploy | [production-architecture.md](./production-architecture.md) |
| API routes | [api-reference.md](./api-reference.md) |
| ADR summaries | [adr-index.md](./adr-index.md) |
| Blockers | [production-blockers.md](../build-2/production-blockers.md) |
| Recovery status | [recovery-phase-2-report.md](../build-2/recovery-phase-2-report.md) |

---

## Resume checklist

1. Read this file + engineering constitution
2. `git log -1` — confirm you are on expected commit
3. `pnpm build && pnpm test` — establish green baseline
4. Check `production-blockers.md` — do not claim resolved without verification
5. Name the Build-2 milestone and pipeline phase your task affects
6. Implement minimal diff; update docs if behavior changes
