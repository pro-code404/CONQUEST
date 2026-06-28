import { GisState, type GisStateId } from "@conquest/gis";

/** Application-layer UI state for screen view models. */
export type ScreenUiState = "idle" | "loading" | "success" | "error" | "empty";

export function gisStateForUi(state: ScreenUiState): GisStateId {
  switch (state) {
    case "loading":
      return GisState.Load;
    case "empty":
      return GisState.Empty;
    case "error":
      return GisState.Error;
    case "success":
      return GisState.Success;
    default:
      return GisState.Load;
  }
}
