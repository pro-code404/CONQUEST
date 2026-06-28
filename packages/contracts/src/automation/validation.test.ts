import { describe, it, expect } from "vitest";
import {
  validateCronExpression,
  validateSchedule,
  validateTrigger,
  validateWorkflowTriggerSchedule,
} from "./validation.js";

describe("automation validation", () => {
  it("accepts valid cron expressions", () => {
    expect(validateCronExpression("0 9 * * *")).toBeNull();
    expect(validateCronExpression("@daily")).toBeNull();
  });

  it("rejects invalid cron expressions", () => {
    expect(validateCronExpression("")).toBeTruthy();
    expect(validateCronExpression("invalid")).toBeTruthy();
  });

  it("requires event name for event triggers", () => {
    expect(validateTrigger({ type: "event" })).toBeTruthy();
    expect(validateTrigger({ type: "event", eventName: "alert.created" })).toBeNull();
  });

  it("validates schedule when enabled", () => {
    expect(
      validateSchedule({ enabled: true, cron: "bad", timezone: "UTC" }),
    ).toBeTruthy();
    expect(
      validateSchedule({ enabled: true, cron: "0 9 * * *", timezone: "UTC" }),
    ).toBeNull();
  });

  it("requires schedule for schedule triggers", () => {
    expect(
      validateWorkflowTriggerSchedule({ type: "schedule" }, null),
    ).toBeTruthy();
    expect(
      validateWorkflowTriggerSchedule(
        { type: "schedule" },
        { enabled: true, cron: "0 9 * * *", timezone: "UTC" },
      ),
    ).toBeNull();
  });

  it("rejects enabled schedule on non-schedule triggers", () => {
    expect(
      validateWorkflowTriggerSchedule(
        { type: "manual" },
        { enabled: true, cron: "0 9 * * *", timezone: "UTC" },
      ),
    ).toBeTruthy();
  });
});
