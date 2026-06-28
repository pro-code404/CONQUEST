import { ApplicationServiceBase } from "./application-service.js";

/** Platform infrastructure services (config, secrets references, health aggregation). */
export abstract class InfrastructureServiceBase extends ApplicationServiceBase {
  readonly domain = "infrastructure" as const;

  protected async checkDependency(
    name: string,
    probe: () => Promise<{ healthy: boolean; details?: string }>,
  ): Promise<{ name: string; healthy: boolean; details?: string }> {
    const result = await probe();
    const entry: { name: string; healthy: boolean; details?: string } = {
      name,
      healthy: result.healthy,
    };
    if (result.details !== undefined) {
      entry.details = result.details;
    }
    return entry;
  }
}
