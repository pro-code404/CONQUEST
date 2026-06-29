# 16 — Common Misconceptions

**Explicit false beliefs and why they are wrong.**

If you hold any belief below, **do not implement features** until you have read the cited chapter and verified against code.

---

## Misconception 1: "Conquest is an AI wrapper"

### The false belief

Conquest is a React frontend that sends user text to OpenAI/Anthropic and displays the response. The cognitive stack is cosmetic.

### Why people believe it

- `ai-gateway` package exists  
- Stub providers return deterministic text in dev  
- Industry norm: most "AI products" are wrappers  
- `ResearchService.analyze` sounds like "call the model"  

### Why it is false

| Requirement of AI wrapper | Conquest reality |
|---------------------------|------------------|
| Single hop: input → LLM → output | Multi-stage: evidence → reasoning → decision → **verification** |
| No evidence model | `EvidenceEngine`, evidence refs on recommendations |
| No verification gate | ADR-0006; `DecisionEngine` sets `executionReady: false` until governed |
| Provider in UI | Forbidden — presentation has zero provider imports |
| Prompts in feature code | `@conquest/prompt-management` registry |
| Memory = chat history | `CognitiveMemoryManager`, AMD III lifecycle |

**Code proof:** `services/cognitive` — orchestrator runs engines in order; `services/ai-gateway` is behind platform only.

**Read:** [01 — Philosophy](./01-philosophy-and-identity.md), [08 — Cognitive](./08-cognitive-architecture.md)

---

## Misconception 2: "Conquest is a chatbot"

### False

Primary navigation is Command Center, not a conversation thread. UXMD forbids chatbot-primary patterns (RTM-UX-009).

### True

Structured research sessions, intelligence feed, recommendation approval — not free-form multi-turn chat as the product core.

---

## Misconception 3: "Conquest is an automation platform"

### False

Automation is **one module** inside the OS. Execution engine is **not live**. `manualRun` writes audit only.

### True

Automation CRUD exists; execution is M5-gated behind BAR B-25–B-28.

---

## Misconception 4: "Conquest is a dashboard / BI tool"

### False

Analytics uses formula KPIs (`100 - index*7`) — visualization layer deferred. Product home is **decision intelligence**, not charts.

### True

Command Center zones bind to intelligence feed; honest empty states when no cognitive output exists.

---

## Misconception 5: "Intelligence feed is seeded fake data"

### False (post M1)

`IntelligenceService.ensureSeed` was **removed**. Empty feed is **honest**.

### True

Recommendations appear after `POST .../research/sessions/:id/analyze` runs cognitive pipeline.

---

## Misconception 6: "Everything is in-memory only"

### False (post M2)

`DATABASE_URL` → `DrizzleAuthRepository`. Sessions, workflows, research, legal acceptance persist.

### True

CI uses `MEMORY_REPO=true` fallback. Production path is Postgres.

---

## Misconception 7: "Automation already executes workflows"

### False

`executionReady: false` in cognitive orchestrator. `AutomationService.manualRun` → audit record with deferred message.

### True

M5 introduces execution engine — not authorized yet.

---

## Misconception 8: "The prototype in docs/archive is the live app"

### False

`apps/`, `packages/`, `services/` are **authorized Build-1/2 implementation**.

### True

Only `docs/archive/prototype/` is quarantined historical spike.

---

## Misconception 9: "Recovery Phase 2 changed routing and broke the app"

### False

Recovery Phase 2 was documentation sync. Preview crash was **pre-existing** `CookieConsentBanner` outside `RouterProvider` (since M2).

### True

See `docs/build-2/preview-regression-rca.md`.

---

## Misconception 10: "Any engineer can start M5 without BAR"

### False

Build-2 M5 requires formal BAR closing B-25–B-28.

### True

Governance checklist + `docs/governance/build-authorization-checklist-v1.0.md`.

---

## Misconception 11: "GIS is optional styling"

### False

GIS is frozen interaction law (UXMD-III). Hardcoded colors/spacing in features are defects.

### True

All presentation uses `@conquest/gis` tokens.

---

## Misconception 12: "Learning layer can deploy code changes"

### False

ADR-0009 learning boundary — proposals only; no autonomous production deploy.

---

## Misconception 13: "knowledge-base supersedes CCIS"

### False

Knowledge base summarizes. CCIS wins on conflict.

### True

**Project Brain** is supreme for engineering memory; CCIS is supreme for intelligence law.

---

## Misconception 14: "One LLM call equals one recommendation"

### False

Recommendations are pipeline outputs with evidence chain, confidence, verification status.

---

## Misconception 15: "Workspace is a nav item"

### False

Workspace is **context** (ADR-0003). Primary nav has seven items; workspace selected via session.

---

## Self-test before committing code

Answer yes/no:

1. I can name the verification gate owner.  
2. I know why `executionReady` is false.  
3. I know where memory writes are allowed.  
4. I know why UI must not import `@conquest/cognitive`.  
5. I can trace research analyze to recommendation without a single "chat completion" mental model.  

**All must be yes.**

---

*See also: [01 — Philosophy](./01-philosophy-and-identity.md)*
