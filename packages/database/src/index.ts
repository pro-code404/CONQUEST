import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as schema from "./schema.js";

export * from "./schema.js";

const migrationsFolder = join(dirname(fileURLToPath(import.meta.url)), "..", "drizzle");

export function createDb(connectionString: string, options?: { maxConnections?: number }) {
  const client = postgres(connectionString, { max: options?.maxConnections ?? 10 });
  return drizzle(client, { schema });
}

export type ConquestDatabase = ReturnType<typeof createDb>;

/** Run pending Drizzle migrations — call at API startup when DATABASE_URL is set. */
export async function runMigrations(connectionString: string): Promise<void> {
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);
  await migrate(db, { migrationsFolder });
  await client.end();
}

export { migrationsFolder };
export * from "./backup.js";
