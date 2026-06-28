import { describe, it, expect } from "vitest";
import { routeForOnboardingStage } from "./onboarding-path.js";

describe("onboarding-path domain", () => {
  it("routes welcome stage to ONB-01", () => {
    expect(routeForOnboardingStage("welcome")).toBe("/onboarding");
  });

  it("routes connect stage to ONB-04", () => {
    expect(routeForOnboardingStage("connect")).toBe("/onboarding/connect");
  });

  it("routes done stage to app home redirect", () => {
    expect(routeForOnboardingStage("done")).toBe("/app");
  });
});
