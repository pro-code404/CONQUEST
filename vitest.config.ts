import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    include: [
      "packages/*/src/**/*.test.ts",
      "services/*/src/**/*.test.ts",
      "apps/api/src/**/*.test.ts",
      "apps/web/src/**/*.test.ts",
      "apps/web/src/**/*.test.tsx",
      "tools/load-testing/**/*.test.ts",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "apps/gateway/**",
      "docs/archive/**",
    ],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
