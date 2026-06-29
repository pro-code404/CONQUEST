# 04 — Architectural Philosophy

Why every structural decision exists.

---

## 1. Why monorepo

| Reason | Explanation |
|--------|-------------|
| Contract sharing | `@conquest/contracts` — single Zod source of truth |
| Atomic refactors | API + domain + presentation change together |
| GIS inheritance | Tokens flow to presentation without version skew |
| Build gates | One CI proves whole system |

---

## 2. Why packages vs services

### Packages (`packages/`)

**Reusable libraries** with no HTTP entry. Imported by apps and services.

| Package | Why separate |
|---------|--------------|
| `contracts` | Cross-boundary messages — never duplicate DTOs |
| `gis` | Frozen design law — zero business logic |
| `presentation` | Shared UI — rendering only |
| `database` | Schema ownership — migrations one place |
| `cognitive` pieces in services | Engines testable in isolation |

### Services (`services/`)

**Deployable or composable runtime units** with domain or platform responsibility.

| Service | Why separate |
|---------|--------------|
| `auth` | Domain boundary — tenant rules live here |
| `platform` | Composition root — wires cache, jobs, AI, cognitive |
| `cognitive` | Pipeline — largest intellectual complexity |
| `jobs` | Async — different scaling profile |
| `ai-gateway` | Provider boundary — swap without touching domain |

**Rule:** `apps/api` **wires**; it does not **own** business rules.

---

## 3. Why apps/api is thin

Hono server responsibilities only:

- HTTP routing  
- Middleware (correlation, rate limit, security, session)  
- Bootstrap (`createApiApp`, env validation)  
- Delegate to `services/auth` and `services/platform`  

**Anti-pattern:** 200-line route handler with SQL and LLM calls.

---

## 4. Why apps/web is thin

- React Router + route guards  
- Feature screens call `fetch('/api/...')`  
- `@conquest/presentation` for GIS-bound views  
- **Zero** `@conquest/cognitive`, `@conquest/platform`, provider SDKs  

---

## 5. Why governance exists

Cognitive OS complexity exceeds what ad-hoc PR review can hold.

| Mechanism | Purpose |
|-----------|---------|
| Architecture freeze | Stop spec drift |
| ADR program | Record decisions |
| BAR | Authorize build waves |
| RTM | Trace requirements to tests |
| B-25–B-28 | Intelligence contract gates |

---

## 6. Why execution is isolated

**Planning ≠ execution** (ADR-0015).

Reasoning can recommend; execution requires authorization record, audit trail, and separate service boundary. Prevents "the model ran curl" catastrophes.

---

## 7. Why cognitive systems are separated

| Engine | Single responsibility |
|--------|----------------------|
| Evidence | Classify inputs |
| Reasoning | Infer |
| Decision | Propose + set execution flag |
| Verification | Gate release |

Monolithic "AI service" would collapse audit boundaries and testability.

---

## 8. Why recommendations never auto-execute

CCIS: execute **when authorized**. PDD D7: user decision. Current code: `executionReady: false` always until M5 BAR.

---

## 9. Layer diagram (SDD-I)

```
Presentation (L10)  → apps/web, presentation, gis
Application (L9)    → apps/api
Domain (L7-8)       → services/auth
Intelligence (L5-6) → services/cognitive, platform
Integration (L4)    → ai-gateway, jobs, email
Data (L3)           → database, memory-service
Infrastructure (L2) → cache, observability, docker
```

Dependencies flow **downward** only.

---

*Next: [05 — Product architecture](./05-product-architecture.md)*
