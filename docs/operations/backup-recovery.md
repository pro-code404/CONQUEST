# Backup & Recovery

**Status:** Architecture ready · cloud dump implementation deferred

---

## Components

| Component | Location | Role |
|-----------|----------|------|
| `BackupProvider` | `packages/database/src/backup.ts` | Create backup manifests, verify restore interface |
| `PostgresBackupProvider` | same | Validates URL, records manifest (no pg_dump in-process) |
| `IntervalBackupScheduler` | same | Hooks for cron/interval backup jobs |
| API startup | `apps/api/src/server.ts` | Schedules daily manifest in production |

---

## Backup flow (production)

1. Scheduler fires every 24h
2. `PostgresBackupProvider.createBackup()` validates `DATABASE_URL` and writes a manifest
3. Ops pipeline runs `pg_dump` / cloud snapshot using manifest ID as correlation

---

## Restore verification

```typescript
import { PostgresBackupProvider } from "@conquest/database";

const provider = new PostgresBackupProvider();
const result = await provider.verifyRestore({
  databaseUrl: process.env.DATABASE_URL!,
  manifestId: "manifest-uuid",
});
```

Returns `{ ok, message }` — deployment pipelines should run `pg_restore --dry-run` before cutover.

---

## Startup recovery validation

`GET /api/health/ready` probes Postgres via a lightweight repository query.  
`GET /api/ops/status` includes `database.reachable` and `overall` health.

---

## DR drill

See [dr-drill-plan-v1.0.md](./dr-drill-plan-v1.0.md) for tabletop exercises.
