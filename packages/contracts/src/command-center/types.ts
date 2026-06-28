/** CC-01 production behavioral states (Build-1 Milestone 2). */
export const COMMAND_CENTER_STATES = [
  "dormant",
  "initializing",
  "ready",
  "warning",
  "degraded",
  "offline",
] as const;

export type CommandCenterBehavioralState = (typeof COMMAND_CENTER_STATES)[number];

export interface CommandCenterStatusResponse {
  workspaceId: string;
  state: CommandCenterBehavioralState;
  offlineTimestamp?: string;
  warningMessage?: string;
  degradedZones?: string[];
}

export interface CommandCenterZoneItemView {
  id: string;
  label: string;
  summary: string;
  href?: string;
  confidence?: number;
  status?: string;
}

export interface CommandCenterZoneView {
  id: string;
  label: string;
  items: CommandCenterZoneItemView[];
  emptyMessage?: string;
}

export interface CommandCenterDashboardView {
  workspaceId: string;
  status: CommandCenterStatusResponse;
  zones: CommandCenterZoneView[];
  platformHealthy: boolean;
  cognitiveRequestCount: number;
  lastRefreshedAt: string;
}

export interface CommandCenterStatusInput {
  dataSourceConnected: boolean;
  initializationInProgress: boolean;
  warningCount: number;
  degradedZoneCount: number;
  offline: boolean;
  offlineTimestamp?: string;
}
