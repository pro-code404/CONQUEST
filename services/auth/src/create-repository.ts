import { createDb, runMigrations, type ConquestDatabase } from "@conquest/database";
import type { AuthRepository } from "./auth-repository.js";
import { AsyncMemoryAuthRepository } from "./async-memory-repository.js";
import { DrizzleAuthRepository } from "./drizzle-repository.js";

export type RepositoryMode = "memory" | "postgres";

export interface CreateAuthRepositoryOptions {
  /** Force in-memory store (CI default). */
  forceMemory?: boolean;
  connectionString?: string;
  /** Skip migrations (tests with pre-migrated DB). */
  skipMigrations?: boolean;
}

let sharedDb: ConquestDatabase | null = null;

export function resolveRepositoryMode(options?: CreateAuthRepositoryOptions): RepositoryMode {
  if (options?.forceMemory || process.env.MEMORY_REPO === "true") return "memory";
  const url = options?.connectionString ?? process.env.DATABASE_URL;
  if (!url) return "memory";
  return "postgres";
}

/** Bootstrap auth persistence — B2-M2. */
export async function createAuthRepository(options?: CreateAuthRepositoryOptions): Promise<{
  repo: AuthRepository;
  mode: RepositoryMode;
  db: ConquestDatabase | null;
}> {
  const mode = resolveRepositoryMode(options);

  if (mode === "memory") {
    return { repo: new AsyncMemoryAuthRepository(), mode, db: null };
  }

  const connectionString = options?.connectionString ?? process.env.DATABASE_URL!;
  if (!options?.skipMigrations) {
    await runMigrations(connectionString);
  }
  sharedDb = createDb(connectionString);
  return { repo: new DrizzleAuthRepository(sharedDb), mode: "postgres", db: sharedDb };
}

/** Close shared Postgres client on graceful shutdown. */
export async function closeAuthRepository(): Promise<void> {
  sharedDb = null;
}
