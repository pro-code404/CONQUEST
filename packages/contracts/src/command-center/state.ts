import type {
  CommandCenterBehavioralState,
  CommandCenterStatusInput,
  CommandCenterStatusResponse,
} from "./types.js";

/** Pure domain state computation — no I/O (CC-01 / Phase 4C). */
export function computeCommandCenterState(input: CommandCenterStatusInput): CommandCenterBehavioralState {
  if (input.offline) return "offline";
  if (!input.dataSourceConnected) return "dormant";
  if (input.initializationInProgress) return "initializing";
  if (input.degradedZoneCount > 0) return "degraded";
  if (input.warningCount > 0) return "warning";
  return "ready";
}

export function toCommandCenterStatusResponse(
  workspaceId: string,
  input: CommandCenterStatusInput,
): CommandCenterStatusResponse {
  const state = computeCommandCenterState(input);
  const response: CommandCenterStatusResponse = { workspaceId, state };
  if (input.offlineTimestamp !== undefined) {
    response.offlineTimestamp = input.offlineTimestamp;
  }
  if (state === "warning" && input.warningCount > 0) {
    response.warningMessage = `${input.warningCount} item(s) need attention`;
  }
  if (state === "degraded" && input.degradedZoneCount > 0) {
    response.degradedZones = Array.from({ length: input.degradedZoneCount }, (_, i) => `zone-${i + 1}`);
  }
  return response;
}
