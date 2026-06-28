import type { ServiceHealthResult } from "./types/health.js";

export function createHealthResult(params: {
  healthy: boolean;
  service: string;
  version: string;
  details?: string;
}): ServiceHealthResult {
  const result: ServiceHealthResult = {
    healthy: params.healthy,
    service: params.service,
    version: params.version,
  };
  if (params.details !== undefined) {
    result.details = params.details;
  }
  return result;
}
