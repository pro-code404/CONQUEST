import postgres from "postgres";

/** Probe Postgres connectivity — used by contract tests and readiness checks. */
export async function isPostgresReachable(connectionString: string): Promise<boolean> {
  try {
    const client = postgres(connectionString, { max: 1, connect_timeout: 3 });
    await client`SELECT 1`;
    await client.end();
    return true;
  } catch {
    return false;
  }
}
