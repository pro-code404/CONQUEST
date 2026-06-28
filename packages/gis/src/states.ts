/**
 * GIS global state identifiers (UXMD-III Part 1).
 */
export const GisState = {
  Load: "S-LOAD",
  Empty: "S-EMPTY",
  Success: "S-SUCCESS",
  Error: "S-ERROR",
  Recover: "S-RECOVER",
  Offline: "S-OFFLINE",
} as const;

export type GisStateId = (typeof GisState)[keyof typeof GisState];

export const GisStateLabels: Record<GisStateId, string> = {
  [GisState.Load]: "Loading",
  [GisState.Empty]: "No data yet",
  [GisState.Success]: "Success",
  [GisState.Error]: "Error",
  [GisState.Recover]: "Recovering",
  [GisState.Offline]: "Offline",
};
