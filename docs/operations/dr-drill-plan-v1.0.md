# Disaster Recovery Drill Plan v1.0

| Field | Value |
|-------|-------|
| **Gate** | B-17 — DR drill plan |
| **Authority** | ADR-0021; SDD-III Part 11; INF-20, INF-21 |
| **RTM** | RTM-INF-008, RTM-INF-015 |
| **Date** | 2026-06-26 |
| **Status** | **ACTIVE** |

## Tier targets (ADR-0021)

| Tier | RTO | RPO | Build-1 drill |
|------|-----|-----|---------------|
| Auth + Gateway | < 15 min | < 5 min | Tabletop + local restore sim |
| Application read | < 30 min | < 5 min | Milestone 2+ |
| Intelligence async | < 4 hr | < 15 min | Build-2 |
| Audit log | < 15 min | 0 | Build-1 Milestone 3+ |

## Drill schedule

| Drill | Frequency | First execution |
|-------|-----------|-----------------|
| **D1 — Backup restore tabletop** | Quarterly | Before production (Build-3) |
| **D2 — Auth tier failover sim** | Semi-annual | Build-1 Milestone 3 |
| **D3 — Full org restore** | Annual | Build-3 |

## D1 procedure (tabletop — Build-1 gate evidence)

1. Select test org in staging namespace.
2. Verify backup exists and is encrypted (ADR-0018).
3. Walk through restore runbook steps without production impact.
4. Record RTO/RPO against tier table.
5. File post-drill notes in ops log.

## Build-1 scope

Build-1 requires **plan existence and first tabletop scheduled** — not production DR execution. Local `docker compose` Postgres volume backup/restore documented for dev validation.

## Dev validation command

```bash
pnpm docker:up
# backup: docker exec pg_dump ...
# restore: documented in ops runbook sev-2
```

## Sign-off

| Role | Status |
|------|--------|
| Operations | Plan drafted |
| Engineering Lead | Pending BAR §7 |

---

*Drill plan for B-17. Full exercises before INF-25 production gate.*
