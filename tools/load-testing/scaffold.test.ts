import { describe, it, expect } from "vitest";
import { runLoadScenarios, type LoadTestScenario } from "./scaffold.js";

describe("Load testing scaffold (Phase 8H)", () => {
  it("runs registered scenarios", async () => {
    const scenario: LoadTestScenario = {
      name: "smoke",
      concurrency: 2,
      iterations: 5,
      async run() {
        return { success: 5, failure: 0, avgMs: 1 };
      },
    };
    const results = await runLoadScenarios([scenario]);
    expect(results[0]?.success).toBe(5);
    expect(results[0]?.scenario).toBe("smoke");
  });
});
