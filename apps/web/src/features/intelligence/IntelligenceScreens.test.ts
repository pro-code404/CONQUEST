import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const intelligenceSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "IntelligenceScreens.tsx"),
  "utf8",
);

describe("Intelligence screens (Phase 9A)", () => {
  for (const id of ["INT-01", "INT-02", "INT-03", "INT-04", "INT-05", "INT-06"]) {
    it(`${id} logs screen telemetry`, () => {
      expect(intelligenceSource).toContain(id);
    });
  }
});

describe("Phase 9 routes", () => {
  const routesSource = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../../routes/index.tsx"),
    "utf8",
  );

  it("registers intelligence and analytics module routes", () => {
    expect(routesSource).toContain("intelligence/feed");
    expect(routesSource).toContain("reports/saved");
    expect(routesSource).toContain("operations");
    expect(routesSource).toContain("research");
  });

  it("excludes reports from placeholder modules", () => {
    expect(routesSource).toContain('item.id !== "reports"');
  });
});
