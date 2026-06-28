import { describe, it, expect, afterEach } from "vitest";
import {
  KillSwitchRegistry,
  KillSwitchEngagedError,
  resetKillSwitchRegistry,
  getKillSwitchRegistry,
} from "./kill-switch.js";

describe("KillSwitchRegistry (INF-22)", () => {
  afterEach(() => {
    resetKillSwitchRegistry();
  });

  it("defaults to open when not engaged", () => {
    const registry = new KillSwitchRegistry();
    expect(registry.isEngaged("execution")).toBe(false);
    registry.assertOpen("execution");
  });

  it("blocks when engaged via registry", () => {
    const registry = new KillSwitchRegistry();
    registry.engage("intelligence_release", "drill");
    expect(() => registry.assertOpen("intelligence_release")).toThrow(KillSwitchEngagedError);
  });

  it("releases after drill", () => {
    const registry = new KillSwitchRegistry();
    registry.engage("emergency_lock", "tabletop");
    registry.release("emergency_lock");
    registry.assertOpen("emergency_lock");
  });

  it("reads env override", () => {
    process.env.CONQUEST_KILL_EXECUTION = "1";
    const registry = getKillSwitchRegistry();
    expect(registry.isEngaged("execution")).toBe(true);
    delete process.env.CONQUEST_KILL_EXECUTION;
  });
});
