import { describe, it, expect } from "vitest";
import { PRIMARY_NAV_ITEMS, assertPrimaryNavCount, workspacePath } from "./navigation.js";

describe("GIS navigation (NAV-1)", () => {
  it("defines exactly seven primary nav items", () => {
    expect(PRIMARY_NAV_ITEMS).toHaveLength(7);
    assertPrimaryNavCount(7);
  });

  it("builds workspace-scoped paths", () => {
    expect(workspacePath("ws-1", "command-center")).toBe("/app/w/ws-1/command-center");
  });

  it("rejects empty workspace id", () => {
    expect(() => workspacePath("", "reports")).toThrow();
  });
});
