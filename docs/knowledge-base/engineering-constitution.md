# Engineering Constitution

Permanent engineering rules for Conquest. Violations are defects, not style preferences.

Cross-reference: [ai-agent-onboarding.md](./ai-agent-onboarding.md) · [`AGENTS.md`](../../AGENTS.md) · [adr-index](./adr-index.md)

---

## Authority

```
CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → Governance → Build Authorization → Build
```

Code expresses architecture. Architecture is not retrofitted to code.

---

## Presentation layer

1. **Never place business logic in presentation** — `apps/web` and `packages/presentation` render and route only.
2. **Never bypass GIS** — all colors, spacing, typography from `@conquest/gis` tokens.
3. **Never import cognitive or platform packages in UI** — use `fetch('/api/...')` with credentials.
4. **Never substitute generic admin layouts** for UXMD-specified screens.
5. **Never expose intelligence machinery** (engines, models, pipelines) as primary navigation.
6. **Never use React Router APIs outside `RouterProvider`** — `Link`, `NavLink`, `Navigate`, `Outlet`, and hooks (`useNavigate`, `useLocation`, `useParams`, `useRoutes`) must render under the route tree (e.g. `RootLayout`), never as siblings of `RouterProvider`.

---

## API layer

6. **Never duplicate domain logic in `apps/api`** — delegate to `services/auth` or platform services.
7. **Never parse environment variables outside `@conquest/config`** — use `validateApiEnvironment()`.
8. **Never skip correlation ID propagation** — middleware sets `x-correlation-id`, `x-trace-id`, `x-request-id`.
9. **Never return unverified intelligence as fact** — verification gate applies ([ADR-0006](../architecture/adr/0006-verification-before-release.md)).
10. **Never weaken tenant isolation** — workspace routes must verify `session.orgId === workspace.orgId`.

---

## Persistence

11. **Never bypass repository abstraction** — use `AuthRepository` / `DrizzleAuthRepository`; no raw SQL in domain services.
12. **Never write memory stores directly** — all memory writes through `CognitiveMemoryManager` ([ADR-0008](../architecture/adr/0008-memory-governance.md)).
13. **Never commit secrets** — env vars only; see [ADR-0019](../architecture/adr/0019-secrets-management-strategy.md).
14. **Never use `MEMORY_REPO=true` in production** — validated at startup.

---

## Cognitive & AI

15. **Never bypass Cognitive Orchestrator** — intelligence flows through `platform.cognitive.run`.
16. **Never bypass AI Gateway** — no direct OpenAI/Anthropic/Gemini SDK in domain or UI ([ADR-0011](../architecture/adr/0011-ai-provider-abstraction.md)).
17. **Never bypass Prompt Registry** — prompts registered and versioned in `@conquest/prompt-management`.
18. **Never bypass Prompt Security** — user content sanitized via `@conquest/prompt-security`.
19. **Never bypass evidence collection** — reasoning must cite evidence portfolio ([ADR-0031](../architecture/adr/0031-evidence-first-reasoning.md)).
20. **Never generate recommendations without explainable reasoning** — evidence refs and confidence required.
21. **Never set `executionReady: true` without governance approval** — execution blocked per Build-2 ([ADR-0015](../architecture/adr/0015-execution-layer-separation.md)).
22. **Never execute workflows autonomously** — `AutomationService.manualRun` records audit only until M5 BAR.

---

## Contracts & duplication

23. **Never duplicate contracts** — cross-module messages in `packages/contracts` with Zod validation.
24. **Never duplicate DTOs** — one canonical shape per boundary.
25. **Never introduce parallel table models** — Drizzle schema is single source for Postgres.

---

## Quality gates

26. **Never merge failing build** — `pnpm build` must pass.
27. **Never merge failing typecheck** — `pnpm typecheck` must pass.
28. **Never merge failing lint** — `pnpm lint` must pass.
29. **Never merge failing tests** — `pnpm test` must pass (278+).
30. **Never skip meaningful tests for behavior changes** — especially auth, tenant isolation, cognitive paths.

---

## Production integrity

31. **Never introduce demo-only code that activates silently in production** — feature-flag or env-gate explicitly.
32. **Never hardcode production URLs or secrets**.
33. **Never disable rate limiting in production** — 120 req/min per IP on `/api/*`.
34. **Never ship without security headers** in production profile.
35. **Never log prompt content by default** — `AI_AUDIT_CONSTANTS` govern redaction.

---

## Governance

36. **Never implement execution features without Build Authorization** — M5 requires BAR scope for B-25–B-28.
37. **Never modify frozen architecture corpus without ADR** — see [ARCHITECTURE-FREEZE.md](../architecture/ARCHITECTURE-FREEZE.md).
38. **Never deploy learning/reflection outputs to production code paths** ([ADR-0009](../architecture/adr/0009-learning-boundary.md)).

---

## Approved patterns

| Pattern | Location |
|---------|----------|
| UI → API | `fetch` with credentials |
| API → domain | Service method on `services/auth` |
| Intelligence → cognitive | `IntelligenceCognitiveProvider` → `platform.cognitive.run` |
| Async cognitive | `JobService` enqueue `ai_request` |
| Email | `NotificationService` → `createEmailProvider()` |
| Cache | `createCacheProvider({ redisClient })` |
| Jobs | `createJobService({ redisUrl })` |
| Constants | `packages/config/src/constants.ts` |
| Feature flags | `AdministrationService` |

---

*Amend this constitution only via ADR or explicit governance record.*
