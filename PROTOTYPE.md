# Conquest — Prototype Disposition

| Field | Value |
|-------|-------|
| **Live implementation** | `apps/`, `packages/`, `services/` at repo root |
| **Historical prototype** | `docs/archive/prototype/` only |
| **Build authorization** | Build-0 + Build-1 BAR; Build-2 integration program complete through M4 |

## What is authoritative

The **root monorepo** (`apps/api`, `apps/web`, `packages/*`, `services/*`) is the authorized Build-1/2 implementation. It implements the frozen architecture under active Build-2 milestones.

Do **not** treat the live codebase as a quarantined spike.

## What is archived (not authoritative)

The following paths are **historical pre-authorization prototypes** archived under `docs/archive/prototype/`:

- `docs/archive/prototype/apps/gateway/` — legacy API gateway and preview demo UI
- `docs/archive/prototype/packages/ui/` — pre-GIS design tokens

These do not define product behavior, UX, or current engineering architecture.

## Disposition record

Full disposition: [`docs/governance/prototype-disposition-v1.0.md`](docs/governance/prototype-disposition-v1.0.md)

## Frozen architecture

Implement only from:

`CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → RTM → Architecture Freeze → Build Authorization`

See [`docs/architecture/README.md`](docs/architecture/README.md).

## Onboarding

New contributors and AI agents: [`docs/knowledge-base/ai-agent-onboarding.md`](docs/knowledge-base/ai-agent-onboarding.md)
