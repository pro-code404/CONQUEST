# Cognitive Platform — Operational Limits (Phase 11)

Production characteristics and known constraints for the Build-1 cognitive stack. No autonomous execution is enabled.

---

## Request lifecycle

| Parameter | Value | Notes |
|-----------|-------|-------|
| Sync pipeline phases | memory → prompt → evidence → reasoning → decision → persistence → provider route → audit | Deterministic; no LLM invocation in sync path |
| Async queue type | `ai_request` | Handler registered in `@conquest/platform` |
| Response cache TTL | 300 seconds (5 min) | Workspace-scoped key: `cognitive:{orgId}:{workspaceId}:{objective}` |
| Prompt render cache | 64 entries LRU | In-process; per `PromptRegistry` instance |

---

## Performance characteristics (baseline)

Measured in CI on in-memory cache provider:

| Metric | Typical range |
|--------|----------------|
| Sync cognitive run | &lt; 50 ms |
| Cache hit | &lt; 5 ms |
| Evidence collect + rank | &lt; 10 ms |
| Prompt compile (cached) | &lt; 1 ms |

Redis cache provider available when a `RedisLikeClient` is injected at platform composition; otherwise in-memory.

---

## Observability

Every completed cognitive request may include `telemetry` on `CognitiveResponseView`:

- `durationMs`, `cacheHit`, `auditId`, `phases`, `providerId`, `fallbackUsed`

`CognitiveMetricsCollector` aggregates request count, success/failure, cache hits, average duration and confidence. Exposed on `GET /api/health` as `cognitiveMetrics`.

---

## Failure and degradation

| Failure mode | Behavior |
|--------------|----------|
| Cache read error | Phase `cache_unavailable`; pipeline continues |
| Cache write error | Phase `cache_write_skipped`; response still returned |
| Memory / engine error | Lifecycle `failed`; failure audit recorded; error propagated |
| Malformed prompt | Render throws; request fails with validation error |
| Missing job handler | Job fails; no silent completion |
| Provider kill switch | Affects `AiGateway.complete` only; sync cognitive path uses registry listing |

---

## Security boundaries

- All prompts rendered through `@conquest/prompt-security` builder only
- User input delimiter-wrapped in USER layer; never in SYSTEM
- Cognitive API routes session-gated with workspace scope validation
- Rate limiting applied to `/api/*`

---

## Scalability assumptions

- Platform services are stateless per request; lifecycle maps are in-process (single-instance)
- Horizontal scaling requires shared Redis cache and external job store (Build-2 infrastructure)
- Concurrent requests safe within single process; cross-instance consistency not guaranteed in Build-1

---

## Known constraints

- No autonomous execution or agent loops
- `DecisionEngine` always returns `executionReady: false`
- In-memory job store and lifecycle tracking are not durable across restarts
- Load testing scaffold defines scenarios; production stress runs require deployed environment

---

*Phase 11 operational reference. See ADR-0037 (foundation) and ADR-0038 (hardening).*
