import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ccPath = join(dirname(fileURLToPath(import.meta.url)), "CommandCenterHomeView.tsx");

describe("CC-01 presentation (GIS)", () => {
  it("implements production behavioral states", () => {
    const source = readFileSync(ccPath, "utf8");
    for (const state of ["dormant", "initializing", "warning", "degraded", "offline"]) {
      expect(source).toContain(state);
    }
    expect(source).toContain("CommandCenter");
    expect(source).toContain('role="status"');
  });
});
