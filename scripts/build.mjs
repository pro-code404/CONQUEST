#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const order = [
  "packages/core",
  "packages/observability",
  "services/shared",
  "packages/config",
  "packages/contracts",
  "packages/database",
  "packages/prompt-security",
  "packages/prompt-management",
  "packages/cache",
  "packages/visualization-config",
  "packages/gis",
  "packages/presentation",
  "packages/engines",
  "services/auth",
  "services/session",
  "services/jobs",
  "services/ai-gateway",
  "services/ai-audit",
  "packages/performance",
  "services/memory",
  "services/cognitive",
  "services/orchestrator",
  "services/platform",
  "apps/api",
];

for (const rel of order) {
  const path = join(root, rel);
  if (!existsSync(join(path, "tsconfig.json"))) continue;
  console.log(`Building ${rel}...`);
  execSync("npx tsc -p tsconfig.json", { cwd: path, stdio: "inherit" });
}

console.log("Build complete.");
