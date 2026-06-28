# Deployment Checklist

**Build-2 M3-O** — production deployment

---

## Pre-deploy

- [ ] `POSTGRES_PASSWORD` generated (≥16 chars)
- [ ] `JWT_SECRET` generated (≥32 chars, not placeholder)
- [ ] `APP_BASE_URL` set to public HTTPS origin
- [ ] `CORS_ORIGINS` matches web origin(s)
- [ ] `EMAIL_PROVIDER` configured (or accept console for internal beta)
- [ ] Secrets stored in platform secret manager (not in git)

## Deploy

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

- [ ] All four services healthy (`docker compose ps`)
- [ ] `GET /api/health/live` → 200
- [ ] `GET /api/health/ready` → 200
- [ ] `GET /api/ops/status` → JSON with cache/queue/db sections
- [ ] Web loads at `WEB_PORT` (default 8080)
- [ ] Signup flow completes end-to-end

## Post-deploy

- [ ] Configure daily `pg_dump` per [backup-recovery.md](../operations/backup-recovery.md)
- [ ] Monitor ready probe (503 = Postgres/Redis down)
- [ ] Document rollback: `docker compose down` + restore from backup

---

*Guide: [deployment.md](../operations/deployment.md)*
