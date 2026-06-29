# 08 — Cognitive Architecture

Pipeline phases, engines, deterministic behavior today, LLM integration, governance.

---

## 1. Ten-phase runtime loop

See [`docs/architecture/cognitive-pipeline.md`](../architecture/cognitive-pipeline.md).

Phases: Perception → HUE → Context → Goal Reasoning → Strategy Planning → Intelligence Orchestration → Verification → Execution → Reflection → Memory Evolution.

**CCIS** defines twelve stages; AMD IV §69 prevails on ordering conflicts.

---

## 2. Build-1 API path (what runs today)

```
platform.cognitive.run()
  → CognitiveOrchestrator
    → EvidenceEngine
    → ReasoningEngine
    → DecisionEngine (executionReady: false)
    → Verification gate
```

**Not on API path:** `services/orchestrator` legacy `PipelineRunner`.

---

## 3. Why deterministic today

| Reason | Detail |
|--------|--------|
| Testability | Vitest asserts pipeline without API keys |
| Governance | B-28 learning boundary tests |
| Safety | No surprise provider behavior in CI |
| Stubs | `createStubProviders()` — swap for SDK adapters later |

Deterministic ≠ "fake product" — structure is real; provider is instrument.

---

## 4. LLM integration (how, not if)

```
Domain service
  → platform.cognitive.run()
    → orchestrator decides if gateway needed
      → ai-gateway.complete() / stream()
        → prompt-management resolves template
          → prompt-security screens input
            → ai-audit logs classified record
```

**Never:** `openai.chat.completions` in `apps/api` or `apps/web`.

---

## 5. Async cognitive

`JobService` handles `ai_request` jobs when `async: true`:

- Redis `RedisJobStore` or in-memory  
- DLQ, retry, timeout  
- Worker health in ops status  

---

## 6. Governance constraints

| Constraint | Enforcement |
|------------|-------------|
| Stage order | B-25 contract tests (open) |
| VRF bypass | B-26 tests (open) |
| Provider boundary | B-27 static analysis |
| Learning → execution | B-28 isolation tests |
| executionReady | Hard false until M5 BAR |

---

## 7. Memory in pipeline

Post-pipeline memory evolution writes via `CognitiveMemoryManager` — not direct engine DB access.

---

*Next: [09 — AI provider architecture](./09-ai-provider-architecture.md)*
