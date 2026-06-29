#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** All workspace packages/services with a tsconfig build step. */
const packages = [
  "packages/core",
  "packages/observability",
  "services/shared",
  "packages/config",
  "packages/contracts",
  "packages/database",
  "packages/prompt-security",
  "packages/prompt-management",
  "packages/cache",
  "packages/gis",
  "packages/visualization-config",
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

function readPackageName(rel) {
  const pkgPath = join(root, rel, "package.json");
  if (!existsSync(pkgPath)) return null;
  return JSON.parse(readFileSync(pkgPath, "utf8")).name;
}

function workspaceDependencies(rel, nameToPath) {
  const pkgPath = join(root, rel, "package.json");
  if (!existsSync(pkgPath)) return [];
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const merged = { ...pkg.dependencies, ...pkg.devDependencies };
  const deps = [];
  for (const [name, version] of Object.entries(merged)) {
    if (version === "workspace:*" && nameToPath.has(name)) {
      deps.push(nameToPath.get(name));
    }
  }
  return deps;
}

function topologicalSort(paths) {
  const pathSet = new Set(paths);
  const nameToPath = new Map();
  for (const rel of paths) {
    const name = readPackageName(rel);
    if (name) nameToPath.set(name, rel);
  }

  const depMap = new Map(
    paths.map((rel) => [rel, workspaceDependencies(rel, nameToPath).filter((d) => pathSet.has(d))]),
  );

  const inDegree = new Map(paths.map((rel) => [rel, depMap.get(rel).length]));
  const queue = paths.filter((rel) => inDegree.get(rel) === 0);
  const sorted = [];

  while (queue.length > 0) {
    const current = queue.shift();
    sorted.push(current);
    for (const rel of paths) {
      if (!depMap.get(rel).includes(current)) continue;
      inDegree.set(rel, inDegree.get(rel) - 1);
      if (inDegree.get(rel) === 0) queue.push(rel);
    }
  }

  if (sorted.length !== paths.length) {
    throw new Error("Circular workspace dependency detected in build graph");
  }

  return sorted;
}

const order = topologicalSort(packages);

for (const rel of order) {
  const path = join(root, rel);
  if (!existsSync(join(path, "tsconfig.json"))) continue;
  console.log(`Building ${rel}...`);
  execSync("npx tsc -p tsconfig.json", { cwd: path, stdio: "inherit" });
}

console.log("Build complete.");
