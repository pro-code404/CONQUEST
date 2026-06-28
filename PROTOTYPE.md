# Conquest — Pre-Authorization Prototype (Quarantined)

| Field | Value |
|-------|-------|
| **Status** | Historical engineering spike |
| **Build Authorization** | **Build-0 authorized** — BAR-2026-06-21-001 |
| **Authority** | Does not supersede frozen architecture |

## Classification

The following paths contain **prototype code** archived under `docs/archive/prototype/`:

- `docs/archive/prototype/apps/gateway/` — API gateway and preview demo UI
- `docs/archive/prototype/packages/ui/` — pre-GIS design tokens
- `services/` — orchestrator, memory, auth, session, shared
- `docker-compose.yml`, `scripts/build.mjs`, root `package.json` workspace

## Rules

1. **Not authoritative** — does not define product behavior, UX, or engineering architecture.
2. **Not counted toward Build progress** — capability claims in archived trackers are void.
3. **Not production-ready** — may contradict ADR-0007, SDD-IV, UXMD, and IL-2 memory governance.
4. **Review required** — disposition documented in [`docs/governance/prototype-disposition-v1.0.md`](docs/governance/prototype-disposition-v1.0.md); BAR §6 decision required at Build Authorization.

## Frozen architecture

Implement only from:

`CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → RTM → Architecture Freeze`

See [`docs/architecture/README.md`](docs/architecture/README.md).

## Local development

Prototype may be run for exploration only. It does not constitute authorized implementation.
