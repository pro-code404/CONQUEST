import { serve } from "@hono/node-server";
import { closeAuthRepository } from "@conquest/auth";
import { createApiApp } from "./app.js";

const port = Number(process.env.CONQUEST_API_PORT ?? 3001);

const { app } = await createApiApp();

const server = serve({ fetch: app.fetch, port }, () => {
  console.log(`Conquest API listening on http://localhost:${port}`);
  console.log(`Persistence: ${process.env.MEMORY_REPO === "true" || !process.env.DATABASE_URL ? "memory" : "postgres"}`);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal} — shutting down gracefully`);
  if (typeof server.close === "function") {
    server.close();
  }
  await closeAuthRepository();
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
