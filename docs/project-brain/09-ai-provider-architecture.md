# 09 — AI Provider Architecture

Gateway, prompts, routing, fallback, and future multi-provider orchestration.

---

## 1. Design intent

The AI provider is an **instrument** — not the product. All provider access flows through `@conquest/ai-gateway` per ADR-0011.

---

## 2. Gateway responsibilities

| Function | Owner |
|----------|-------|
| Provider selection | Gateway router |
| Request shaping | Prompt registry templates |
| Safety screening | `@conquest/prompt-security` |
| Audit logging | `@conquest/ai-audit` |
| Cost / usage accounting | Platform metrics (scaffold) |
| Circuit breaking | ADR-0034 (future) |

---

## 3. Current implementation (M4)

- `createStubProviders()` — deterministic responses  
- No production API keys required for CI  
- Real SDK adapters — P1 post-beta  

---

## 4. Prompt management

| Component | Role |
|-----------|------|
| `PromptRegistry` | Versioned templates |
| Settings API | `GET/POST /api/settings/prompts` |
| Security | Injection patterns blocked at boundary |

**Never:** Hardcoded system prompts in route handlers.

---

## 5. Model routing (future)

| Stage | Behavior |
|-------|----------|
| Task classification | Route to model tier by cognitive phase |
| Fallback | Secondary provider on failure (ADR-0034) |
| Budget caps | Per-org limits |

---

## 6. Environment variables

| Var | Purpose |
|-----|---------|
| `EMAIL_PROVIDER` | Not AI — listed for confusion avoidance |
| Provider keys | Via env when SDKs wired — never in repo |

AI audit: prompts/responses classified per RTM-INF-009.

---

*Next: [10 — Data architecture](./10-data-architecture.md)*
