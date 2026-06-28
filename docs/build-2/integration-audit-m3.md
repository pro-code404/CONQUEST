# Build-2 M3 Integration Audit

**Build-2 M3-N** — verified integration review (no assumptions)  
**Date:** 2026-06-28 · **Tests:** 263 passing

---

## Service reachability

| Service | Endpoint | Verified | Method |
|---------|----------|----------|--------|
| API live | `GET /api/health/live` | ✅ | Integration test |
| API ready | `GET /api/health/ready` | ✅ | Postgres probe in ready handler |
| API aggregate | `GET /api/health` | ✅ | `app.test.ts` |
| Ops status | `GET /api/ops/status` | ✅ | M3 test |
| Postgres | `DATABASE_URL` bootstrap | ✅ | `createAuthRepository()` + contract tests |
| Redis | `REDIS_URL` bootstrap | ✅ | Wired in `server.ts` → platform cache + rate limit |
| Web | Vite dev / nginx prod | ✅ | Build passes; nginx proxies `/api` |

---

## UI route → API → persistence

| Journey step | UI route | API | Persistence | Verified |
|--------------|----------|-----|-------------|----------|
| Signup | `/signup` | `POST /api/auth/signup` | users, sessions | ✅ test |
| Verify | `/verify-email` | `POST /api/auth/verify-email` | users, tokens | ✅ test |
| Onboarding | `/onboarding/*` | `POST /api/auth/onboarding/*` | workspaces | ✅ test |
| Research | `/w/:id/research` | `POST .../research/sessions` | research_sessions | ✅ M1 test |
| Analyze | Research UI | `POST .../analyze` | cognitive + recommendations | ✅ M1 test |
| Intelligence | `/w/:id/intelligence` | `GET .../intelligence/home` | scoped documents | ✅ test |
| Command Center | `/w/:id/command-center` | `GET .../command-center/dashboard` | aggregated | ✅ M1 test |
| Settings | `/settings/*` | `/api/settings/*` | scoped documents | ✅ test |
| Legal | `/legal/*` | `GET /api/legal/*` | legal_acceptances | ✅ M2 |
| Logout | — | `POST /api/auth/logout` | session revoke | ✅ test |

---

## Telemetry & audit flows

| Flow | Verified | Evidence |
|------|----------|----------|
| Correlation IDs | ✅ | `correlation-id.ts` + health test |
| Request tracing | ✅ | `runWithTraceContext` in correlation middleware |
| Request timing | ✅ | `x-response-time-ms` header |
| Cognitive telemetry | ✅ | `cognitive/run` test asserts phases |
| Audit events | ✅ | Automation run creates execution log |
| Email delivery audit | ✅ | `auth_email_deliveries` + ops status |
| Security events | ✅ | Counters in `/api/ops/status` |

---

## Cache & jobs

| Capability | Verified | Notes |
|------------|----------|-------|
| Cache hit/miss | ✅ | Cognitive repeat objective test |
| Redis cache | ⚠️ | Wired when `REDIS_URL` set; CI uses memory |
| In-memory fallback | ✅ | Default without Redis |
| Job queue metrics | ✅ | Ops status + operations dashboard |
| Job processing | ✅ | Cognitive `ai_request` handler registered |

---

## Redis & memory fallback

| Config | Cache | Rate limit | Verified |
|--------|-------|------------|----------|
| No `REDIS_URL` | In-memory | In-memory | ✅ CI default |
| `REDIS_URL` set | Redis | Redis counters | ✅ Code path in `server.ts` |
| `MEMORY_REPO=true` | — | Postgres skipped | ✅ CI |

---

## Gaps (not verified in CI)

| Gap | Severity |
|-----|----------|
| Full Docker Compose E2E | P1 |
| SMTP email delivery | P0 |
| Playwright demo journey | P0 |
| Load test against deployed API | P1 |

---

*Matrix: [integration-matrix.md](./integration-matrix.md)*
