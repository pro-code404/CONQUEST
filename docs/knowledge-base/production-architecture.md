# Production Architecture

As-built production deployment for Conquest (post Build-2 M4).

Cross-reference: [`docs/operations/deployment.md`](../operations/deployment.md) · [conquest-complete-reference](./conquest-complete-reference.md) · [engineering-constitution](./engineering-constitution.md)

---

## Topology

```
                    ┌─────────────┐
                    │   Browser   │
                    └──────┬──────┘
                           │ HTTPS (prod) / HTTP (dev)
                    ┌──────▼──────┐
                    │  Web (nginx) │  apps/web — static SPA
                    │  :8080       │  proxies /api → API
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  API (Hono)  │  apps/api — :3001
                    └──────┬──────┘
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼─────┐ ┌────▼────┐ ┌────▼────┐
       │ PostgreSQL │ │  Redis  │ │ Email   │
       │ (Drizzle)  │ │ optional│ │ Resend/ │
       └────────────┘ └─────────┘ │ SMTP    │
                                  └─────────┘
```

**Compose files:**
- `docker-compose.yml` — local Postgres + Redis
- `docker-compose.prod.yml` — api + web + postgres + redis

**Dockerfiles:** `Dockerfile.api`, `Dockerfile.web` (nginx)

---

## Components

| Component | Implementation | Fallback |
|-----------|----------------|----------|
| **Frontend** | Vite build → nginx (`apps/web/nginx.conf`) | `pnpm dev` with proxy |
| **API** | Node 22, `apps/api/dist/server.js` | `MEMORY_REPO` dev |
| **Database** | PostgreSQL 16, Drizzle migrations | In-memory repo (CI) |
| **Auth** | httpOnly session cookies, `auth_server_sessions` | — |
| **Cache** | Redis via `@conquest/cache` | In-memory |
| **Jobs** | Redis `RedisJobStore` + DLQ | In-memory |
| **Email** | Resend (preferred) / SMTP / console | Retry wrapper |

---

## Startup sequence (`server.ts`)

1. `validateApiEnvironment()` — fail fast in production
2. `runMigrations(DATABASE_URL)` when Postgres mode
3. `createRedisClient(REDIS_URL)` — null → in-memory cache
4. `createJobService({ redisUrl })` — Redis or in-memory
5. `createApiApp({ apiEnv, redisClient, jobService })`
6. Backup scheduler hook (production) — `PostgresBackupProvider` manifest

---

## Health & readiness

| Endpoint | Purpose |
|----------|---------|
| `GET /api/health/live` | Liveness — process up |
| `GET /api/health/ready` | Readiness — Postgres probe |
| `GET /api/health` | Aggregate dependency health |
| `GET /api/ops/status` | Metrics: cache, queue, email, security, cognitive |
| `GET /api/ops/degradation` | Probes: DB, Redis, email, AI, queue |

---

## Observability

| Concern | Implementation |
|---------|----------------|
| Correlation IDs | `x-correlation-id`, `x-request-id`, `x-trace-id` |
| Request timing | `x-response-time-ms` |
| Trace context | `runWithTraceContext` in correlation middleware |
| Security audit | `securityAuditMiddleware` — 401/403 counters |
| Rate limit | 120 req/min per IP; headers + 429 |
| Security headers | `X-Content-Type-Options`, `X-Frame-Options`, HSTS (prod) |
| Structured logs | JSON events in server bootstrap |
| Centralized logging | **Future** — hooks exist; no sink wired |

---

## Environment variables (production required)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection |
| `JWT_SECRET` | ≥32 chars, non-placeholder |
| `CONQUEST_API_KEY` | ≥16 chars |
| `APP_BASE_URL` | Public web origin |
| `CORS_ORIGINS` | Allowed origins |
| `REDIS_URL` | Recommended for cache + jobs |
| `EMAIL_PROVIDER` | `resend` or `smtp` |
| `RESEND_API_KEY` / SMTP vars | When applicable |

See `.env.example` and `validateApiEnvironment()` in `@conquest/config`.

---

## Secrets

- Loaded from environment only — never committed
- [ADR-0019](../architecture/adr/0019-secrets-management-strategy.md): vault rotation **future**
- Netlify/platform secret store recommended for hosted deploy

---

## Scaling (current vs future)

| Concern | Current (M4) | Future |
|---------|----------------|--------|
| API instances | Single instance | Horizontal + shared Redis/Postgres |
| Rate limit | In-process map | Redis-backed limiter |
| Jobs | Redis or in-memory | Dedicated workers |
| Cache | Redis or in-memory | CDN for static; Redis for cognitive TTL |
| Load balancing | nginx proxy in compose | ALB / ingress |
| Kubernetes/ECS | Not deployed | ADR-0022 HA model |
| Cognitive | In-process orchestrator | Queue workers at scale |

---

## Recovery & DR

| Item | Status |
|------|--------|
| Backup abstraction | `BackupProvider` + daily manifest hook |
| `pg_dump` pipeline | **Ops responsibility** — not in-app |
| DR plan | `docs/operations/dr-drill-plan-v1.0.md` |
| Runbooks | SEV-1–4 in `docs/operations/runbooks/` |
| Restore verification | `PostgresBackupProvider.verifyRestore()` interface |

---

## CI/CD

`.github/workflows/ci.yml`:
- Governance artifact checks
- `pnpm build`, `typecheck`, `test` (`MEMORY_REPO=true`)
- Playwright e2e install + `pnpm test:e2e`
- Dependency audit (continue-on-error)

**Future:** staging deploy gate, production promotion checklist in `docs/build-2/deployment-checklist.md`.

---

## Hosting notes

- Docker Compose documented for self-hosted beta
- Netlify skills apply for framework deploy (Vite SPA + API functions pattern) — see workspace Netlify rules
- CDN: static assets via nginx; image CDN not wired for user uploads

---

*Update when infrastructure changes. Cross-reference deployment checklist after each milestone.*
