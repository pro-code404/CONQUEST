import { describe, it, expect } from "vitest";
import {
  isWorkspaceModule,
  isPrimaryNavSegment,
  parseWorkspaceModulePath,
  workspaceModuleSegments,
} from "./modules.js";

describe("GIS workspace modules (Build-2 M1)", () => {
  it("includes secondary modules with permissions", () => {
    const segments = workspaceModuleSegments();
    expect(segments).toContain("intelligence");
    expect(segments).toContain("research");
    expect(segments).toContain("operations");
    expect(segments).toContain("command-center");
  });

  it("distinguishes primary nav from all workspace modules", () => {
    expect(isPrimaryNavSegment("command-center")).toBe(true);
    expect(isPrimaryNavSegment("intelligence")).toBe(false);
    expect(isWorkspaceModule("intelligence")).toBe(true);
    expect(isWorkspaceModule("unknown-module")).toBe(false);
  });

  it("parses nested workspace module paths", () => {
    const parsed = parseWorkspaceModulePath(
      "/app/w/550e8400-e29b-41d4-a716-446655440000/intelligence/recommendations/abc",
    );
    expect(parsed?.workspaceId).toBe("550e8400-e29b-41d4-a716-446655440000");
    expect(parsed?.moduleSegment).toBe("intelligence");
  });
});
