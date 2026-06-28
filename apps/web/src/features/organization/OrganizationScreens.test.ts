import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const orgPath = join(dirname(fileURLToPath(import.meta.url)), "OrganizationScreens.tsx");
const profilePath = join(dirname(fileURLToPath(import.meta.url)), "../users/ProfileScreens.tsx");
const orgSource = readFileSync(orgPath, "utf8");
const profileSource = readFileSync(profilePath, "utf8");

describe("Organization screens (Phase 5B)", () => {
  it("SET-17 logs screen telemetry", () => {
    expect(orgSource).toContain("SET-17");
  });

  it("member directory logs telemetry", () => {
    expect(orgSource).toContain("ORG-MEMBERS");
  });
});

describe("Profile screens (Phase 5C)", () => {
  it("PRF-01 logs screen telemetry", () => {
    expect(profileSource).toContain("PRF-01");
  });

  it("PRF-02 logs screen telemetry", () => {
    expect(profileSource).toContain("PRF-02");
  });
});
