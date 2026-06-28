# ADR-0036: Intelligence Platform Module Foundations (Build-1 Phase 9)

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-27 |
| **Deciders** | Platform engineering |
| **Architecture Freeze** | v1.0 — Amends implementation scope only; does not change frozen navigation |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Phase 9 replaces major module placeholders with production-grade foundations while preserving the seven-item primary navigation freeze (ADR-0005). Intelligence, research, operations, and administration are logical modules reached from Command Center or Settings — not primary nav items (RTM-PDD-001).

Build-1 prohibits autonomous reasoning, AI execution, and intelligence pipelines. Module services orchestrate seeded or user-supplied data only.

---

## Decision

We will implement Phase 9 modules using the established Presentation → Application → Domain → Infrastructure layering:

- **Contracts** in `@conquest/contracts` for all cross-layer types
- **Application services** in `@conquest/auth` backed by `MemoryAuthRepository` (Build-1)
- **Presentation** display-only views in `@conquest/presentation`
- **API** session-gated routes in `apps/api`
- **Visualization** configuration centralized in `@conquest/visualization-config` (no prototype innerHTML chart generators)

Advisory recommendations are explainable (`rationale`, `evidenceRefs`, `recommendedActions`) with manager approval workflow. Operations aggregates telemetry from `@conquest/platform` (cache, jobs, AI gateway). Administration reuses governance services and org-scoped feature flags.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Separate microservices per module | Violates Build-1 scope; duplicates platform wiring |
| Prototype chart code in Reports | Forbidden — innerHTML SVG generators; use visualization-config abstractions |
| Intelligence in primary nav | Violates ADR-0005 and RTM-PDD-001 |

---

## Consequences

- INT-01–INT-06, RPT-01–02, RES-01–02, OPS-01, ADM-01 screens are routable and testable
- Chart rendering deferred to Build-2 consumers of `@conquest/visualization-config`
- Cognitive pipeline integration remains Build-2 (RTM-INT-001–010)
