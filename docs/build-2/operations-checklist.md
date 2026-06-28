# Operations Checklist

**Build-2 M3-O** — day-2 operations

---

## Health monitoring

- [ ] Poll `GET /api/health/live` every 30s (process up)
- [ ] Poll `GET /api/health/ready` every 60s (Postgres reachable)
- [ ] Review `GET /api/ops/status` daily — check `overall`, `database.reachable`, email failures

## Metrics to watch

| Signal | Source | Action threshold |
|--------|--------|------------------|
| Rate limit blocks | `metrics.operational.rateLimit.blocked` | Sustained spike → investigate abuse |
| Auth failures | `security.authFailures` | Spike → credential stuffing |
| Email failures | `email.failedCount` | >0 → check SMTP/console provider |
| Queue DLQ | `metrics.queue.deadLetter` | >0 → inspect failed jobs |
| Cache provider | `cache.provider` | Should be `redis` in multi-instance prod |

## Backup

- [ ] Daily backup manifest logged (`backup_manifest_created` event)
- [ ] Weekly `pg_dump` to object storage (ops pipeline)
- [ ] Monthly restore drill per [dr-drill-plan-v1.0.md](../operations/dr-drill-plan-v1.0.md)

## Rotation

- [ ] `JWT_SECRET` rotation procedure documented
- [ ] `CONQUEST_API_KEY` rotation on compromise
- [ ] Postgres password rotation quarterly
