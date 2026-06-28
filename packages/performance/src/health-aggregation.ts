import { runHealthChecks, type ServiceHealthReport } from "@conquest/observability";

export interface DependencyHealthInput {
  name: string;
  healthy: boolean;
  details?: string;
}

/** Aggregates dependency health into a platform report. */
export async function aggregatePlatformHealth(
  service: string,
  dependencies: DependencyHealthInput[],
): Promise<ServiceHealthReport> {
  return runHealthChecks(
    service,
    dependencies.map((dep) => ({
      name: dep.name,
      check: async () => ({
        name: dep.name,
        status: dep.healthy ? "healthy" : "unhealthy",
        message: dep.details,
      }),
    })),
  );
}
