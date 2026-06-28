export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export interface HealthCheckResult {
  name: string;
  status: HealthStatus;
  message?: string;
  latencyMs?: number;
}

export interface ServiceHealthReport {
  service: string;
  status: HealthStatus;
  checks: HealthCheckResult[];
  timestamp: string;
}

export async function runHealthChecks(
  service: string,
  checks: Array<{ name: string; check: () => Promise<HealthCheckResult> | HealthCheckResult }>,
): Promise<ServiceHealthReport> {
  const results: HealthCheckResult[] = [];
  for (const { name, check } of checks) {
    const start = Date.now();
    const result = await check();
    results.push({ ...result, name, latencyMs: Date.now() - start });
  }
  const status: HealthStatus = results.some((r) => r.status === "unhealthy")
    ? "unhealthy"
    : results.some((r) => r.status === "degraded")
      ? "degraded"
      : "healthy";
  return { service, status, checks: results, timestamp: new Date().toISOString() };
}
