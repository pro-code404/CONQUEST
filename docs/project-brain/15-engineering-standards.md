# 15 — Engineering Standards

Coding principles, testing, observability, security, documentation, review.

---

## 1. Coding principles

Full rules: [`docs/knowledge-base/engineering-constitution.md`](../knowledge-base/engineering-constitution.md)

**Summary:**

- Minimize scope — smallest correct diff  
- Match conventions — read before edit  
- No business logic in presentation  
- No provider SDK outside gateway  
- No memory writes outside manager  
- No router APIs outside RouterProvider  
- Tenant scope every workspace call  

---

## 2. Testing philosophy

| Layer | Tool | Expectation |
|-------|------|-------------|
| Unit | Vitest | Behavior tests — 278+ baseline |
| Integration | `app.test.ts` | API routes + domain |
| Router context | `App.runtime.test.tsx` | Cookie banner + landing |
| Static composition | `router-context.test.ts` | No router siblings |
| E2E | Playwright | Closed-beta journey + preview smoke |
| CI | GitHub Actions | build, typecheck, test, e2e |

**Never merge** failing test or lint.

---

## 3. Observability

- Correlation IDs on all API requests  
- Structured JSON bootstrap logs  
- `/api/ops/status`, `/api/ops/degradation`  
- Cognitive metrics collectors (scaffold)  
- Centralized sink — roadmap  

---

## 4. Security

- Session cookies httpOnly  
- Rate limit 120/min/IP  
- `prompt-security` at intelligence boundary  
- Secrets in env only  
- Threat model: `docs/operations/threat-model-review-v1.0.md`  
- Tenant isolation: org + workspace checks  

---

## 5. Performance

- Cognitive TTL cache  
- Redis when available  
- Pagination cursors — P2 at scale  
- Load testing scaffold: `tools/load-testing/`  

---

## 6. Documentation

| Change type | Update |
|-------------|--------|
| Architectural decision | ADR |
| As-built behavior | Project Brain or knowledge-base |
| Milestone completion | build-2 report |
| Misconception discovered | Chapter 16 |

---

## 7. Review process

1. BAR scope check  
2. Pipeline phase identified  
3. Constitution rules checked  
4. Tests added for behavior  
5. No duplicate contracts  

---

## 8. Decision framework

When unsure:

1. Read Project Brain 01 + 16  
2. Check ADR index  
3. Check engineering constitution  
4. Propose ADR if architecture changes  
5. Do not ship "quick LLM call" shortcuts  

---

*Next: [16 — Misconceptions](./16-common-misconceptions.md)*
