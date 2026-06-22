#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const order = [
  "packages/core",
  "packages/observability",
  "packages/config",
  "packages/database",
  "packages/ui",
  "packages/engines",
  "services/shared",
  "services/auth",
  "services/session",
  "services/memory",
  "services/orchestrator",
  "apps/gateway",
];

for (const rel of order) {
  const path = join(root, rel);
  if (!existsSync(join(path, "tsconfig.json"))) continue;
  console.log(`Building ${rel}...`);
  execSync("npx tsc -p tsconfig.json", { cwd: path, stdio: "inherit" });
}

console.log("Build complete.");
