import { serve } from "@hono/node-server";
import { closeAuthRepository } from "@conquest/auth";
import { validateApiEnvironment } from "@conquest/config";
import {
  IntervalBackupScheduler,
  PostgresBackupProvider,
  runMigrations,
} from "@conquest/database";
import { createRedisClient } from "@conquest/platform";
import { createApiApp } from "./app.js";

const apiEnv = validateApiEnvironment();
const port = apiEnv.CONQUEST_API_PORT;

if (apiEnv.persistenceMode === "postgres" && apiEnv.DATABASE_URL) {
  await runMigrations(apiEnv.DATABASE_URL);
}

const redisClient = apiEnv.REDIS_URL ? await createRedisClient(apiEnv.REDIS_URL) : null;

const { app } = await createApiApp({
  apiEnv,
  ...(redisClient ? { redisClient } : {}),
});

let backupSchedulerCancel: (() => void) | undefined;
if (apiEnv.profile === "production" && apiEnv.DATABASE_URL) {
  const backupProvider = new PostgresBackupProvider();
  const scheduler = new IntervalBackupScheduler();
  const handle = scheduler.schedule(24 * 60 * 60 * 1000, async () => {
    const manifest = await backupProvider.createBackup({ databaseUrl: apiEnv.DATABASE_URL! });
    console.log(JSON.stringify({ event: "backup_manifest_created", manifestId: manifest.id }));
  });
  backupSchedulerCancel = handle.cancel;
}

const server = serve({ fetch: app.fetch, port }, () => {
  console.log(
    JSON.stringify({
      event: "api_started",
      port,
      profile: apiEnv.profile,
      persistence: apiEnv.persistenceMode,
      redis: Boolean(redisClient),
    }),
  );
});

async function shutdown(signal: string) {
  console.log(`Received ${signal} — shutting down gracefully`);
  backupSchedulerCancel?.();
  if (typeof server.close === "function") {
    server.close();
  }
  await closeAuthRepository();
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
