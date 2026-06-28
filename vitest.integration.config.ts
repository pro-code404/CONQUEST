import { defineConfig } from "vitest/config";

/** Integration / load scaffold tests — Phase 8H. */
export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    include: ["tools/load-testing/**/*.test.ts"],
    testTimeout: 60_000,
  },
});
