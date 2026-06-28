# ADR-0038: Cognitive Platform Hardening (Build-1 Phase 11)

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-27 |
| **Deciders** | Platform engineering |
| **Architecture Freeze** | v1.0 — Hardens Phase 10; does not authorize autonomous execution |

---

## Context

Phase 10 delivered the cognitive foundation (`CognitiveOrchestrator`, evidence, reasoning, decision, memory, prompts, provider routing). Before Build-2 autonomous execution, the platform must be production-hardened: verified end-to-end, observable, resilient under failure, and performance-profiled.

---

## Decision

Phase 11 hardens the existing cognitive stack without new execution capabilities:

| Slice | Scope |
|-------|-------|
| 11A | E2E verification — full pipeline, cache hit, tenant isolation, correlation IDs, async job completion |
| 11B | Performance — prompt render cache, graceful cache degradation, metrics aggregation |
| 11C | Reliability — failure lifecycle, audit on error, chaos tests (cache outage, memory failure, malformed prompts) |
| 11D | Observability — `CognitiveMetricsCollector`, telemetry on `CognitiveResponseView`, platform health aggregation |
| 11E | Security — prompt delimiter enforcement verified; user content isolated to USER layer |
| 11F | Scalability — env-driven cache factory (Redis when client injected), load-test scaffold scenario |
| 11G | DX — platform composition root documents cache label, health helpers, operational limits doc |

`CognitiveOrchestrator` registers `ai_request` job handler via `@conquest/platform` composition root. `executionReady` remains `false` on all decisions.

---

## Consequences

- `/api/health` includes platform dependency checks and cognitive metrics snapshot
- Cache failures degrade gracefully; pipeline does not abort on cache outage
- Async cognitive requests complete through registered job handler
- Build-2 execution engines, agents, and autonomous workflows remain blocked until Phase 11 verification is complete
