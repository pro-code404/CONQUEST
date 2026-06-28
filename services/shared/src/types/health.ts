/** Standard health probe result for Build-1 services. */
export interface ServiceHealthResult {
  healthy: boolean;
  service: string;
  version: string;
  details?: string;
}
