# Incident Response Checklist

**Build-2 M3-O** — first response playbook

---

## Severity classification

| SEV | Definition | Example |
|-----|------------|---------|
| SEV-1 | Cross-tenant data exposure | Wrong org data in API response |
| SEV-2 | Auth outage or runaway errors | All logins fail; 5xx >50% |
| SEV-3 | Provider degradation | AI/cognitive latency; partial features |
| SEV-4 | Non-critical defect | UI glitch; single feature down |

Runbooks: [docs/operations/runbooks/](../operations/runbooks/)

---

## Immediate steps (all severities)

1. Capture `x-correlation-id` from affected requests
2. Check `GET /api/ops/status` for dependency health
3. Check `GET /api/health` for per-service status
4. Review recent deploys (`docker compose` / Git tag)
5. Assign incident commander and comms channel

---

## SEV-1 — Cross-tenant exposure

- [ ] Enable maintenance mode / block writes if confirmed
- [ ] Rotate `JWT_SECRET` and invalidate all sessions
- [ ] Audit `auth_audit_events` for scope violations
- [ ] Follow [sev-1-cross-tenant-exposure.md](../operations/runbooks/sev-1-cross-tenant-exposure.md)
- [ ] Legal/compliance notification per counsel guidance

---

## SEV-2 — Auth outage

- [ ] Verify Postgres: `GET /api/health/ready`
- [ ] Check `security.authFailures` in ops status
- [ ] Review rate limit blocks (false positive vs attack)
- [ ] Follow [sev-2-auth-outage-runaway.md](../operations/runbooks/sev-2-auth-outage-runaway.md)

---

## Rollback

```bash
docker compose -f docker-compose.prod.yml down
# restore Postgres from backup
docker compose -f docker-compose.prod.yml up -d
```

- [ ] Verify `GET /api/health/ready` → 200
- [ ] Smoke test signup/login journey

---

## Post-incident

- [ ] Timeline with correlation IDs
- [ ] Root cause + remediation ticket
- [ ] Update runbook if gap found
