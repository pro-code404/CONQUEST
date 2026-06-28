#!/usr/bin/env node
/**
 * Build-0 engineering health verification.
 * Run from repository root: pnpm verify:build-0
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const required = [
  "docs/architecture/ARCHITECTURE-FREEZE.md",
  "docs/governance/build-authorization-record-build-0-2026-06-21.md",
  "docs/governance/ci-law-mapping.md",
  "pnpm-lock.yaml",
  "vitest.config.ts",
];

function run(cmd, label) {
  const start = Date.now();
  console.log(`\n▶ ${label}`);
  execSync(cmd, { cwd: root, stdio: "inherit", env: process.env });
  const ms = Date.now() - start;
  console.log(`✓ ${label} (${ms}ms)`);
  return ms;
}

console.log("Build-0 verification — Conquest\n");

for (const rel of required) {
  if (!existsSync(join(root, rel))) {
    console.error(`✗ Missing required file: ${rel}`);
    process.exit(1);
  }
}
console.log("✓ Governance and lockfile present");

const metrics = {};
try {
  metrics.install = run("pnpm install --frozen-lockfile", "pnpm install --frozen-lockfile");
  metrics.build = run("pnpm build", "pnpm build");
  metrics.typecheck = run("pnpm typecheck", "pnpm typecheck");
  metrics.test = run("pnpm test", "pnpm test");
} catch {
  console.error("\n✗ Build-0 verification FAILED");
  process.exit(1);
}

console.log("\n══════════════════════════════════════");
console.log("Build-0 verification PASSED");
console.log("══════════════════════════════════════");
console.log(JSON.stringify(metrics, null, 2));
