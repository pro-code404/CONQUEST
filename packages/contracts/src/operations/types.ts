export interface ServiceHealthSummaryView {
  name: string;
  healthy: boolean;
  details: string | null;
}

export interface QueueMonitorView {
  queued: number;
  running: number;
  completed: number;
  failed: number;
  deadLetter: number;
}

export interface CacheStatusView {
  provider: string;
  healthy: boolean;
  hits: number;
  misses: number;
}

export interface AiProviderStatusSummaryView {
  id: string;
  name: string;
  status: "available" | "degraded" | "unavailable";
}

export interface OperationsDashboardView {
  workspaceId: string;
  systemHealthy: boolean;
  services: ServiceHealthSummaryView[];
  queue: QueueMonitorView;
  cache: CacheStatusView;
  aiProviders: AiProviderStatusSummaryView[];
  auditEventCount: number;
  lastCheckedAt: string;
}

export function operationsHomeRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/operations`;
}
