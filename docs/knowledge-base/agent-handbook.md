# Agent Handbook

Resume guide for AI agents (and engineers) working on Conquest. Cross-reference: [`AGENTS.md`](../../AGENTS.md) · [**ai-agent-onboarding**](./ai-agent-onboarding.md) · [system-overview](./system-overview.md) · [development-guide](./development-guide.md)

## Mission (read first)

Conquest is a **cognitive operating system**, not a chatbot. Every change must strengthen the ten-phase pipeline, preserve single source of truth, and avoid duplicate module responsibility.

**First Law:** Conquest is never finished. Every interaction improves the OS.

## Authority before code

```
CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → Governance → Build Authorization → Build
```

1. Confirm Build Authorization scope permits the change
2. Name pipeline phase / SDD layer affected
3. Define structured artifacts consumed and produced
4. Confirm no duplicate module responsibility
5. Route cross-engine work through Orchestration (SDD-IV)

**Build-1 BAR active.** Build-2 M4 complete. See [product-knowledge](./product-knowledge.md).

## Current build status (B2-M4 complete)

| Metric | Value |
|--------|-------|
| Demo readiness | ~96% closed-beta |
| Tests | 278 Vitest; Playwright e2e (`pnpm test:e2e`) |
| API routes | 100 in `apps/api/src/app.ts` |
| Persistence | Postgres via `DATABASE_URL`; `MEMORY_REPO=true` in CI |
| Email | Resend + SMTP + console providers |
| Queue | Redis jobs with in-memory fallback |
| Docker | `docker-compose.prod.yml` + Dockerfiles |

## Architecture quick map

| Layer | Location | Rule |
|-------|----------|------|
| Presentation | `apps/web`, `packages/presentation` | Render only — no business logic |
| API | `apps/api` | Wire routes; middleware; no domain logic duplication |
| Domain | `services/auth` | Identity, settings, automation, intelligence, research, legal |
| Platform | `services/platform` | Cognitive, AI, cache, jobs, memory, prompts |
| Contracts | `packages/contracts` | All cross-module messages — Zod validated |
| Config | `packages/config` | Constants and env — no scattered magic numbers |

## Coding standards

1. **Minimize scope** — smallest correct diff
2. **Match conventions** — read surrounding code before editing
3. **Structured messages only** between services (include `requestId`, `correlationId`, `origin`, `destination`, `intent`, `payload`, `confidence`, `priority`, `timestamp`, `version`)
4. **GIS for all UI** — tokens from `@conquest/gis`; no hardcoded colors/spacing
5. **Validate public inputs early** — Zod at API boundary
6. **Tenant scope every workspace call** — `session.orgId === workspace.orgId`
7. **Memory writes** — only via `CognitiveMemoryManager`
8. **Verification mandatory** — no unverified user-facing intelligence
9. **Observability** — correlation ID, phase boundaries on significant events
10. **Tests** — meaningful behavior tests; `MEMORY_REPO=true` for CI-safe tests

## Layer rules (forbidden vs approved)

### Forbidden

- UI importing `@conquest/cognitive`, `@conquest/platform` directly
- Engines writing memory stores directly
- Skipping verification before recommendations reach users
- Autonomous production code deploy from learning/reflection
- Generic admin dashboard layout substituting for UXMD screens
- Intelligence machinery as primary navigation items
- Scattered env parsing outside `@conquest/config`
- Duplicating domain logic in `apps/api` that belongs in `services/auth`

### Approved

- UI → `fetch('/api/...')` with credentials
- API → domain services → repository
- Intelligence → `IntelligenceCognitiveProvider` → `platform.cognitive.run`
- Async cognitive → `JobService` with `async: true`
- Email → `NotificationService` → `createEmailProvider()`
- Feature flags → `AdministrationService`
- Constants → `packages/config/src/constants.ts`

## Testing

```bash
pnpm build && pnpm typecheck && pnpm test
MEMORY_REPO=true pnpm test   # CI parity
pnpm test:e2e                # Playwright
```

Inject test deps via `createApiApp({ repo, persistenceMode, jobService })` in `app.test.ts`.

## Security

- Session cookies: httpOnly, SameSite=Lax, secure in production
- Rate limit: 120 req/min per IP on `/api/*` (skipped in vitest)
- Security headers middleware in production profile
- `securityAuditMiddleware` on all API routes
- MFA via `SecurityService` — TOTP + recovery codes
- Secrets in env only ([ADR-0019](../architecture/adr/0019-secrets-management-strategy.md))
- Prompt content not logged by default (`AI_AUDIT_CONSTANTS`)

## Conventions

| Item | Convention |
|------|------------|
| Package names | `@conquest/<name>` |
| Modules | ESM (`"type": "module"`) |
| API framework | Hono |
| Web | Vite + React 18 + react-router-dom 6 |
| ORM | Drizzle + postgres driver |
| Test runner | Vitest 2 |
| E2E | Playwright |
| Monorepo | pnpm workspaces |

## Active blockers (do not claim fixed without verification)

| ID | Blocker | Status |
|----|---------|--------|
| B2-P0-03 | Production email delivery | **Resolved M4** — Resend/SMTP; verify env in staging |
| B2-P1-03 | Automation execution | Deferred — run is audit-only (M5 gated) |
| B2-P1-04 | Full E2E demo journey | **Resolved M4** — Playwright in CI |
| B2-P1-05 | Analytics visualization | Deferred |
| B2-P2-01 | Knowledge/Strategy/Marketplace | Planned placeholders |
| B2-P2-03 | Privacy export/deletion jobs | Deferred |
| Legal counsel | Draft policy text | Human review required |

Full list: [`docs/build-2/production-blockers.md`](../build-2/production-blockers.md).

## Tech debt (known)

- In-memory rate limiter (not Redis-distributed) — acceptable for beta; upgrade planned
- `services/session` Postgres adapter not fully wired — sessions durable via Drizzle repo
- Orchestrator service is foundation only — cognitive orchestrator handles Build-1 scope
- Some onboarding steps cosmetic
- Distributed tracing hooks present but not fully wired (`B2-P2-07`)
- Dependency probe tests may need `jobService.workerHealthy` mock when extending JobService

## Where to start (common tasks)

| Task | Start here |
|------|------------|
| Add API route | `apps/api/src/app.ts` + domain service in `services/auth` |
| Add UI screen | `apps/web/src/features/` + UXMD screen spec |
| Cognitive change | `services/cognitive`, wire via `services/platform` |
| Schema change | `packages/database` → `pnpm db:generate` → `db:migrate` |
| New constant | `packages/config/src/constants.ts` |
| New contract | `packages/contracts/src/` |
| Email provider | `services/auth/src/email/` |

## Key documents

| Doc | Path |
|-----|------|
| Knowledge base index | [README.md](./README.md) |
| API catalog | [api-reference.md](./api-reference.md) |
| ADR index | [adr-index.md](./adr-index.md) |
| Master spec | [product-master-spec.md](./product-master-spec.md) (authoritative) · [conquest-master-spec.md](./conquest-master-spec.md) (legacy summary) |
| Cognitive pipeline | [`docs/architecture/cognitive-pipeline.md`](../architecture/cognitive-pipeline.md) |
| Build-2 roadmap | [`docs/build-2/implementation-roadmap.md`](../build-2/implementation-roadmap.md) |
| RTM | [`docs/architecture/requirements-traceability-matrix.md`](../architecture/requirements-traceability-matrix.md) |

## Resume checklist

When picking up work in a new session:

1. Read [**ai-agent-onboarding**](./ai-agent-onboarding.md) + this handbook + [product-knowledge](./product-knowledge.md) status table
2. Check [`docs/build-2/production-blockers.md`](../build-2/production-blockers.md)
3. Run `pnpm build && pnpm test` to establish baseline
4. Confirm which BAR milestone your task belongs to
5. Identify pipeline phase and artifacts before writing code
