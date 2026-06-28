# Conquest Deployment Guide

**Audience:** Operators preparing closed-beta or production deployments.

---

## Profiles

| Profile | Trigger | Persistence | Required env |
|---------|---------|-------------|--------------|
| **development** | `NODE_ENV=development` (default) | Memory when `MEMORY_REPO=true` or no `DATABASE_URL` | None beyond defaults |
| **production** | `NODE_ENV=production` or `CONQUEST_PROFILE=production` | Postgres (`DATABASE_URL`) | See below |

Startup validation runs in `apps/api/src/server.ts` via `validateApiEnvironment()` — the process exits immediately if production secrets are missing.

### Production required variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Min 32 characters; no default placeholders |
| `APP_BASE_URL` | Public web origin (e.g. `https://app.example.com`) |
| `CONQUEST_API_KEY` | Min 16 characters; service-to-service auth |
| `REDIS_URL` | Recommended for shared cache across API instances |
| `CORS_ORIGINS` | Comma-separated allowed origins (defaults to `APP_BASE_URL`) |

Secrets must come from environment variables only — never commit `.env` files with production values.

---

## Local development

```bash
# Infrastructure only (Postgres + Redis)
docker compose up -d

# API + Web (from repo root)
pnpm install
pnpm build
MEMORY_REPO=true pnpm --filter @conquest/api start   # or set DATABASE_URL for Postgres
pnpm --filter @conquest/web dev
```

Health checks:

- `GET /api/health/live` — process alive
- `GET /api/health/ready` — persistence reachable
- `GET /api/health` — full dependency report
- `GET /api/ops/status` — consolidated operational metrics

---

## Production Docker Compose

```bash
cp .env.example .env
# Edit JWT_SECRET, CONQUEST_API_KEY, APP_BASE_URL, POSTGRES_PASSWORD

docker compose -f docker-compose.prod.yml up --build -d
```

Stack:

| Service | Image | Port |
|---------|-------|------|
| `postgres` | postgres:16-alpine | internal |
| `redis` | redis:7-alpine | internal |
| `api` | `Dockerfile.api` | internal 3001 |
| `web` | `Dockerfile.web` (nginx) | `${WEB_PORT:-8080}` |

The web container proxies `/api/*` to the API service (`apps/web/nginx.conf`).

---

## Startup sequence

1. `validateApiEnvironment()` — fail fast on missing config
2. `runMigrations(DATABASE_URL)` when persistence is Postgres
3. Redis client connect (falls back to in-memory cache if unavailable)
4. `createApiApp()` — wire services, middleware, ops endpoints
5. Backup scheduler hook (production only) — manifest-based `PostgresBackupProvider`

---

## Backup & recovery

See [backup-recovery.md](./backup-recovery.md). Cloud dump tooling plugs into `BackupProvider` without API changes.

---

## Observability

| Endpoint | Purpose |
|----------|---------|
| `/api/ops/status` | Cache, queue, DB, cognitive, AI, email, security counters |
| `/api/health` | Service dependency health |
| Response headers | `x-correlation-id`, `x-request-id`, `x-trace-id`, `x-request-duration-ms` |

---

## CI verification

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm lint
pnpm test
```

CI sets `MEMORY_REPO=true` for tests when Postgres is unavailable.
