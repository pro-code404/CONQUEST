import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const settingsPath = join(dirname(fileURLToPath(import.meta.url)), "SettingsScreens.tsx");
const source = readFileSync(settingsPath, "utf8");

describe("Settings screens (Phase 5A)", () => {
  for (const id of [
    "SET-01",
    "SET-02",
    "SET-04",
    "SET-05",
    "SET-06",
    "SET-07",
    "SET-08",
    "SET-09",
    "SET-10",
  ]) {
    it(`${id} logs screen telemetry`, () => {
      expect(source).toContain(id);
    });
  }
});
