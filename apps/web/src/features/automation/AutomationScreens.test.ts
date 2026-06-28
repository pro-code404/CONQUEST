import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "AutomationScreens.tsx"),
  "utf8",
);

describe("Automation screens (Phase 6A)", () => {
  for (const id of ["AUT-01", "AUT-02", "AUT-03", "AUT-04", "AUT-05"]) {
    it(`${id} logs screen telemetry`, () => {
      expect(source).toContain(id);
    });
  }
});

describe("Automation routes", () => {
  const routesSource = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../../routes/index.tsx"),
    "utf8",
  );

  it("registers automation module routes", () => {
    expect(routesSource).toContain("automation/new");
    expect(routesSource).toContain("automation/approvals");
    expect(routesSource).toContain("AutomationCenterScreen");
  });

  it("excludes automation from placeholder modules", () => {
    expect(routesSource).toContain('item.id !== "automation"');
  });
});
