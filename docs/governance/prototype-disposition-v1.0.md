# Prototype Disposition v1.0

| Field | Value |
|-------|-------|
| **Authority** | SDD-V Part 11 §11.3 (BAR §6); [`PROTOTYPE.md`](../../PROTOTYPE.md) |
| **Date** | 2026-06-21 |
| **Build status** | **Build-0 AUTHORIZED** — BAR-2026-06-21-001 |
| **Scope** | Pre-authorization prototype in `apps/`, `packages/`, `services/`, workspace infra |

## Classification legend

| Class | Meaning |
|-------|---------|
| **Reusable** | Patterns or modules may be adapted under Build governance after ADR/SDD review |
| **Reference-only** | Inform design decisions; do not copy into production without rewrite |
| **Discard before implementation** | Remove or replace before authorized implementation in affected area |
| **Undecided** | Requires explicit BAR §6 decision at Build Authorization |

## Organization-level recommendation (BAR §6)

**Recommended selection:** **Quarantine and realign** — retain prototype in place until Build-0; realign gradually to SDD-V §2.1 per [`repository-structure-approval-v1.0.md`](repository-structure-approval-v1.0.md). Do not discard entire tree without engineering lead sign-off.

Per-area classifications below govern reuse decisions during Build.

---

## `apps/`

| Path | Class | Rationale |
|------|-------|-----------|
| `apps/gateway/` | **Discard before implementation** | Hono gateway + static preview demo; not UXMD-II application shell; `hono` resolution fails full workspace build; excluded from `scripts/build.mjs` |
| `apps/gateway/public/preview.*` | **Reference-only** | Demo charts/data — not authoritative product UI; see [Chart reference patterns](#chart-reference-patterns-appsgatewaypublic) below |

### Chart reference patterns (`apps/gateway/public`)

Accepted as **reference-quality** for future production reimplementation only. **Do not invest Build-1 engineering effort** in this path unless required for validation.

**Preserve concepts for production (GIS + React + Presentation + domain visualization services):**

| Concept | Production target |
|---------|-------------------|
| Configurable chart options | Shared visualization configuration package |
| Reusable rendering APIs | Presentation-layer chart components |
| Improved SVG scaling | GIS-bound responsive SVG primitives |
| Cleaner KPI layouts | Command Center / Analytics presentation modules |
| Visualization patterns | Domain visualization services |

**Do not carry forward:**

- Large `innerHTML` rendering
- Prototype-specific data generators
- Hard-coded visualization constants
- Direct DOM manipulation

Reimplement under `@conquest/gis`, `@conquest/presentation`, and authorized domain services during Build-1+ milestones — not by extending `apps/gateway/public`.

---

## `packages/`

| Path | Class | Rationale |
|------|-------|-----------|
| `packages/core/` | **Reusable** | Pipeline phase enum, artifact types, message envelope, service contracts — conceptually aligned with ADR-0007; requires SDD-I/SDD-II conformance review |
| `packages/core/src/pipeline/` | **Reusable** | Ten-phase model matches cognitive pipeline; verify stage order vs ADR-0007 |
| `packages/core/src/services/contract.ts` | **Reusable** | Universal message contract pattern — align to SDD-I §5 UAC |
| `packages/core/src/evolution/` | **Reference-only** | Learning/evolution spike — must conform to ADR-0009 before any reuse |
| `packages/engines/` | **Reference-only** | Monolithic engine implementations; lifecycle order gaps vs ADR-0007; not SDD-IV provider abstraction |
| `packages/engines/src/orchestration.ts` | **Discard before implementation** | Orchestrator logic belongs in `services/orchestrator` per spike — not SDD-IV System Coordinator |
| `packages/engines/src/verification.ts` | **Reference-only** | VRF patterns — rewrite under ADR-0027 ownership |
| `packages/database/` | **Reference-only** | Drizzle schema spike; not IL-2 Memory Manager governed; tables are exploratory |
| `packages/database/src/schema.ts` | **Reference-only** | Session/memory/routing tables — redesign under SDD-II Part 8 + ADR-0008 |
| `packages/ui/` | **Discard before implementation** | Pre-GIS design tokens (`tokens.ts`); contradicts UXMD-III GIS inheritance |
| `packages/ui/src/dataConsistency.ts` | **Reference-only** | Data consistency helper — review if needed for presentation layer |
| `packages/observability/` | **Reusable** | Telemetry collector pattern — align to ADR-0023 / SDD-III observability |
| `packages/config/` | **Reusable** | Environment config loading — standard platform utility |

---

## `services/`

| Path | Class | Rationale |
|------|-------|-----------|
| `services/orchestrator/` | **Reference-only** | `PipelineRunner` spike — not SDD-IV System Coordinator; embeds optimization/learning inline |
| `services/orchestrator/src/pipeline-runner.ts` | **Reference-only** | Sequential phase runner — useful pattern; rewrite for event-driven SDD-I §5 |
| `services/orchestrator/src/pipeline-runner.test.ts` | **Reusable** | Test structure for pipeline integration — update against authorized contracts |
| `services/memory/` | **Reference-only** | Memory service spike — not Memory Manager sole-write authority (IL-2) |
| `services/auth/` | **Reference-only** | Auth spike — redesign under ADR-0017 / SDD-III |
| `services/session/` | **Reference-only** | Session spike — align to ADR-0017; comments updated to SDD-II |
| `services/shared/` | **Reusable** | Shared service utilities — low-risk platform code |

---

## Workspace infrastructure

| Path | Class | Rationale |
|------|-------|-----------|
| `package.json` (root) | **Reusable** | pnpm workspace scripts — update when gateway disposition finalized |
| `pnpm-workspace.yaml` | **Reusable** | Workspace definition — remove `apps/*` if gateway discarded |
| `scripts/build.mjs` | **Reusable** | Ordered compile script — authoritative for CI prototype scope |
| `docker-compose.yml` | **Reusable** | Local Postgres/Redis — replace with production topology in Build-1 |
| `vitest.integration.config.ts` | **Reusable** | Integration test harness scaffold |
| `.github/workflows/ci.yml` | **Reusable** | Build-0 governance + prototype CI — expand per B-21 roadmap |

---

## Summary counts

| Class | Count |
|-------|------:|
| Reusable | 11 |
| Reference-only | 14 |
| Discard before implementation | 3 |
| Undecided | 0 |

## BAR §6 decision matrix

| Option | When to select |
|--------|----------------|
| **Quarantine and realign** (recommended) | Default — preserve spike for reference; implement from frozen architecture |
| **Replace** | If engineering lead determines rewrite is cheaper than selective reuse |
| **Discard** | If entire prototype tree creates confusion — not recommended at Build-0 |

## Rules during Build-0

1. No prototype repair (gateway, hono) without Build Authorization.
2. No prototype modernization.
3. Any file marked **Reusable** still requires SDD/ADR conformance review before counting toward Build progress.
4. Files marked **Discard** must not be extended — only removed during authorized realignment.

---

*Prototype disposition v1.0 — prepared for Build Authorization Record §6. Not an authorization to implement.*
