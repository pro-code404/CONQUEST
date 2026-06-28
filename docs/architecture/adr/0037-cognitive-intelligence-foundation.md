# ADR-0037: Cognitive Intelligence Foundation (Build-1 Phase 10)

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-27 |
| **Deciders** | Platform engineering |
| **Architecture Freeze** | v1.0 — Amends implementation scope; does not authorize autonomous execution |

---

## Context

Phase 10 introduces Conquest's first production cognitive foundation: orchestrated intelligence with deterministic, explainable, auditable pipelines. Build-1 prohibits experimental AI behavior and autonomous execution. All provider access must route through the AI Gateway with prompt security and audit logging.

---

## Decision

We will implement Phase 10 as composable services wired through `@conquest/platform`:

| Subsystem | Package/Service | Responsibility |
|-----------|-----------------|----------------|
| Orchestrator | `@conquest/cognitive` `CognitiveOrchestrator` | Coordinate memory, evidence, reasoning, decision, cache, jobs, audit — no business logic |
| Reasoning | `ReasoningEngine` | Explainable reasoning chains with evidence refs |
| Evidence | `EvidenceEngine` | Collect, normalize, dedupe, rank — consumed by recommendations |
| Decision | `DecisionEngine` | Deterministic scoring and tradeoffs — output only, no execution |
| Memory | `CognitiveMemoryManager` | Tenant-scoped segments via `MemoryPlatform` |
| Prompts | `@conquest/prompt-management` | Versioned registry; rendering via `@conquest/prompt-security` only |
| Providers | `AiProviderOrchestrator` | Task-type routing and usage accounting on `AiGateway` |

The legacy `PipelineRunner` (`services/orchestrator`) remains for reference; production cognitive flows use `CognitiveOrchestrator`.

---

## Consequences

- Cognitive API endpoints are session-gated, rate-limited, and correlation-ID aware
- No cognitive service bypasses AI Gateway for provider calls
- Execution pipelines and autonomous agents remain future phases
