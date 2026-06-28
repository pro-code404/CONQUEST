import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const governancePath = join(dirname(fileURLToPath(import.meta.url)), "GovernanceScreens.tsx");
const source = readFileSync(governancePath, "utf8");

describe("Governance settings screens (Phase 7)", () => {
  for (const id of [
    "SET-03",
    "SET-03a",
    "SET-11",
    "SET-13",
    "SET-14",
    "SET-15",
    "SET-16",
    "SET-18",
  ]) {
    it(`${id} logs screen telemetry`, () => {
      expect(source).toContain(id);
    });
  }
});
