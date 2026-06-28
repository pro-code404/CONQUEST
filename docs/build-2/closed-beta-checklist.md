# Closed Beta Checklist

Reflects actual codebase state post Build-2 M3.

---

## Account & onboarding

- [ ] Landing page loads with legal footer links
- [ ] Signup creates user + verification token (dev) / email (prod console)
- [ ] Email verification completes onboarding path
- [ ] Workspace creation + onboarding finish sets session
- [ ] Login restores session cookie (`httpOnly`, `secure` in production)

## Core product journey

- [ ] Research session create → analyze triggers cognitive pipeline
- [ ] Intelligence home shows recommendations after analyze
- [ ] Command Center dashboard loads integrated zones
- [ ] Settings screens reachable (18 routes)
- [ ] Administration visible for admin role in settings nav
- [ ] Automation CRUD works for member+ role

## Legal & compliance

- [ ] Cookie consent banner on first visit
- [ ] Legal documents readable when logged in (`/api/legal/*`)
- [ ] Legal acceptance recorded via `POST /api/legal/accept`
- [ ] Counsel review of draft legal copy completed (external)

## Production infrastructure

- [ ] `DATABASE_URL` set — Postgres persistence (not `MEMORY_REPO`)
- [ ] `JWT_SECRET` ≥ 32 chars, non-default
- [ ] `CONQUEST_API_KEY` set
- [ ] `APP_BASE_URL` matches deployed web origin
- [ ] `docker compose -f docker-compose.prod.yml up` succeeds
- [ ] `GET /api/health/ready` → `ok: true`
- [ ] `GET /api/ops/status` → `overall: healthy`

## Security

- [ ] Rate limit returns 429 when threshold exceeded
- [ ] Security headers present (`X-Content-Type-Options`, `X-Frame-Options`)
- [ ] CORS restricted to `CORS_ORIGINS` / `APP_BASE_URL`
- [ ] Tenant isolation on workspace-scoped routes verified

## Known gaps (acceptable for closed beta)

- SMTP email provider not implemented (console provider in dev)
- Automation execution is audit-only
- No Playwright E2E for full demo journey
- Analytics visualizations deferred
