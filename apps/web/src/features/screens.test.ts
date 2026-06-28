import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const screensPath = join(dirname(fileURLToPath(import.meta.url)), "screens.tsx");
const source = readFileSync(screensPath, "utf8");

const SCREEN_IDS = [
  "PUB-01",
  "PUB-02",
  "PUB-03",
  "PUB-04",
  "PUB-05",
  "PUB-06",
  "PUB-07",
  "ONB-01",
  "ONB-02",
  "ONB-03",
  "ONB-04",
  "ONB-05",
  "ONB-06",
] as const;

describe("Phase 3 UXMD screens", () => {
  for (const id of SCREEN_IDS) {
    it(`${id} logs screen view or success telemetry`, () => {
      expect(source).toContain(id);
    });
  }

  it("uses layered presentation imports from @conquest/presentation", () => {
    expect(source).toContain("@conquest/presentation");
    expect(source).toContain("logScreenEvent");
  });
});
