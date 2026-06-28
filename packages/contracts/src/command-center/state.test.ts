import { describe, it, expect } from "vitest";
import { computeCommandCenterState } from "./state.js";

describe("computeCommandCenterState", () => {
  const base = {
    dataSourceConnected: true,
    initializationInProgress: false,
    warningCount: 0,
    degradedZoneCount: 0,
    offline: false,
  };

  it("returns dormant without data sources", () => {
    expect(computeCommandCenterState({ ...base, dataSourceConnected: false })).toBe("dormant");
  });

  it("returns initializing during setup", () => {
    expect(computeCommandCenterState({ ...base, initializationInProgress: true })).toBe("initializing");
  });

  it("returns ready when healthy", () => {
    expect(computeCommandCenterState(base)).toBe("ready");
  });

  it("returns warning before ready when warnings present", () => {
    expect(computeCommandCenterState({ ...base, warningCount: 2 })).toBe("warning");
  });

  it("returns degraded when zones are degraded", () => {
    expect(computeCommandCenterState({ ...base, degradedZoneCount: 1 })).toBe("degraded");
  });

  it("returns offline when connectivity is lost", () => {
    expect(computeCommandCenterState({ ...base, offline: true })).toBe("offline");
  });
});
