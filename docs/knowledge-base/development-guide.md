# Development Guide

Cross-reference: [repository-guide](./repository-guide.md) · [api-reference](./api-reference.md) · [`docs/operations/deployment.md`](../operations/deployment.md)

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20, < 25 |
| pnpm | >= 9 (repo pins 9.15.4) |
| Docker | Optional — Postgres, Redis, prod stack |
| Playwright | `pnpm test:e2e:install` for Chromium |

## Initial setup

```bash
git clone <repo>
cd conquest
pnpm install
pnpm build
```

## Local development

### API + Web (recommended)

```bash
pnpm dev
```

Starts `@conquest/api` (watch) and `@conquest/web` (Vite) in parallel. Web proxies API calls per Vite config.

### API only

```bash
pnpm dev:api
```

### Environment variables

Copy `.env.example` or set minimally:

| Variable | Purpose | Default / CI |
|----------|---------|--------------|
| `DATABASE_URL` | Postgres persistence | Omit for memory mode |
| `MEMORY_REPO` | Force in-memory auth repo | `true` in CI |
| `REDIS_URL` | Redis cache + job queue | Optional |
| `CONQUEST_API_PORT` | API listen port | `3001` |
| `CONQUEST_PROFILE` | `development` / `production` | `development` |
| `JWT_SECRET` | Token signing | Required in production |
| `CORS_ORIGINS` | Allowed origins | `http://localhost:5173` |
| `APP_BASE_URL` | Email link base | `http://localhost:5173` |
| `EMAIL_PROVIDER` | `console` / `resend` / `smtp` | `console` |
| `RESEND_API_KEY` | Resend API key | When provider=resend |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | SMTP | When provider=smtp |

Validated by `validateApiEnvironment()` in `@conquest/config`.

## Docker

### Local dependencies only

```bash
pnpm docker:up    # docker-compose.yml — Postgres + Redis
pnpm docker:down
```

Then:

```bash
export DATABASE_URL=postgresql://conquest:conquest@localhost:5432/conquest
export REDIS_URL=redis://localhost:6379
pnpm db:migrate
pnpm dev
```

### Full production stack

```bash
cp .env.production.example .env
# Set POSTGRES_PASSWORD, JWT_SECRET, CONQUEST_API_KEY, APP_BASE_URL
docker compose -f docker-compose.prod.yml up --build
```

Services: `postgres`, `redis`, `api`, `web` (port `${WEB_PORT:-8080}`).

## Database & migrations

```bash
pnpm db:generate   # Drizzle generate from schema changes
pnpm db:migrate    # Apply migrations (also runs on API startup when DATABASE_URL set)
```

Schema lives in `packages/database`. Auth domain uses `DrizzleAuthRepository` (83+ methods).

**CI:** Uses `MEMORY_REPO=true` — no Postgres required in default GitHub Actions job.

## Redis

When `REDIS_URL` is set at API startup:

- `createRedisClient()` — cache provider for platform
- `createJobService({ redisUrl })` — Redis job store + dead-letter queue

Without Redis: in-memory cache and in-memory job queue (labels exposed in `/api/ops/status`).

## Testing

### Unit & integration

```bash
pnpm test                    # vitest.config.ts — 268+ tests
pnpm test:integration        # vitest.integration.config.ts
MEMORY_REPO=true pnpm test   # CI parity
```

### E2E (Playwright)

```bash
pnpm test:e2e:install
pnpm test:e2e
```

Playwright config: `playwright.config.ts`. Covers closed-beta demo journey (expanding in B2-M4).

### Typecheck & lint

```bash
pnpm typecheck
pnpm lint
```

### Build verification

```bash
pnpm verify:build-0   # packages/services CI parity script
pnpm build
```

## CI pipeline

`.github/workflows/ci.yml`:

1. **Governance** — frozen corpus files, BAR records, RTM present
2. **Build** — `pnpm install`, `build`, `typecheck`, `test` with `MEMORY_REPO=true`, dependency audit

## Debugging

| Area | Approach |
|------|----------|
| API routes | `pnpm dev:api`; inspect `apps/api/src/app.ts` |
| Session issues | Check cookie, `GET /api/auth/session`, repository mode in startup log |
| Cognitive pipeline | `POST /api/workspaces/:id/cognitive/run`; check `GET .../requests/:requestId` |
| Rate limits | Disabled in test; check `X-RateLimit-*` headers in dev |
| Ops | `GET /api/ops/status`, `GET /api/health/ready` |
| Correlation | Pass `x-correlation-id` header; grep API logs |

Structured startup log from `server.ts`:

```json
{ "event": "api_started", "port": 3001, "profile": "development", "persistence": "postgres", "redis": true, "jobQueue": "redis" }
```

## Deploy

See [`docs/operations/deployment.md`](../operations/deployment.md) and [`docs/build-2/deployment-checklist.md`](../build-2/deployment-checklist.md).

Production checklist highlights:

- Set `CONQUEST_PROFILE=production`
- `DATABASE_URL`, `JWT_SECRET`, `REDIS_URL` (recommended)
- `EMAIL_PROVIDER=resend` or `smtp` with credentials
- Health probes: `/api/health/live`, `/api/health/ready`
- Backup scheduler auto-starts when production + `DATABASE_URL`

Netlify: project includes Netlify skills for functions/edge if gateway deployment is used — primary stack is Docker compose per Build-2 M3.

## Common issues

| Symptom | Fix |
|---------|-----|
| Data lost on restart | Set `DATABASE_URL`; do not use memory repo |
| Emails not sent | `EMAIL_PROVIDER=console` only logs; configure Resend/SMTP |
| 429 errors | Rate limit 120/min per IP; wait or adjust `API_CONSTANTS` in dev |
| CI test failures | Ensure `MEMORY_REPO=true`; no external Postgres in default job |
| CORS errors | Add web origin to `CORS_ORIGINS` |

## Related docs

- [agent-handbook](./agent-handbook.md) — coding standards for contributors
- [package-reference](./package-reference.md) — where to add code
- [`docs/build-2/production-blockers.md`](../build-2/production-blockers.md) — known gaps
