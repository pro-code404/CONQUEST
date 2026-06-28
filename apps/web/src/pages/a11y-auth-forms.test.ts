import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";

const srcDir = join(dirname(fileURLToPath(import.meta.url)), "..");

const AUTH_FORMS = [
  "features/screens.tsx",
] as const;

/** Static a11y contract for Milestone 1 auth forms (B-23 / ENG-23). */
describe("auth form accessibility (B-23)", () => {
  for (const file of AUTH_FORMS) {
    it(`${file} exposes labeled inputs and loading state`, () => {
      const source = readFileSync(join(srcDir, file), "utf8");      expect(source).toMatch(/htmlFor="/);
      expect(source).toMatch(/id="/);
      expect(source).toMatch(/aria-busy=/);
    });
  }
});
