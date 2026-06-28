import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const appPath = join(dirname(fileURLToPath(import.meta.url)), "..", "apps", "api", "src", "app.ts");
let content = readFileSync(appPath, "utf8");

const services = [
  "identity",
  "workspace",
  "settings",
  "automation",
  "security",
  "audit",
  "intelligence",
  "research",
  "analytics",
  "operations",
  "administration",
];

// Add await before service.method( when not already awaited
for (const svc of services) {
  const re = new RegExp(`(?<!await )(${svc}\\.\\w+\\()`, "g");
  content = content.replace(re, "await $1");
}

// Fix double-await
content = content.replace(/await await /g, "await ");

// Update imports
content = content.replace(
  `  IdentityService,
  MemoryAuthRepository,
  SESSION_COOKIE_NAME,`,
  `  IdentityService,
  createAuthRepository,
  SESSION_COOKIE_NAME,
  type AuthRepository,`,
);

content = content.replace(
  `function cognitiveScope(repo: MemoryAuthRepository, sessionId: string, workspaceId: string) {
  const session = repo.findSession(sessionId);
  if (!session || session.revoked || session.expiresAt < Date.now()) {
    throw new Error("Session expired");
  }
  const ws = repo.findWorkspace(workspaceId);`,
  `async function cognitiveScope(repo: AuthRepository, sessionId: string, workspaceId: string) {
  const session = await repo.findSession(sessionId);
  if (!session || session.revoked || session.expiresAt < Date.now()) {
    throw new Error("Session expired");
  }
  const ws = await repo.findWorkspace(workspaceId);`,
);

content = content.replace(
  `export function createApiApp(deps?: { repo?: MemoryAuthRepository }) {
  const repo = deps?.repo ?? new MemoryAuthRepository();`,
  `export async function createApiApp(deps?: { repo?: AuthRepository }) {
  const repo = deps?.repo ?? (await createAuthRepository()).repo;`,
);

content = content.replace(
  `export const { app } = createApiApp();

export type ApiApp = typeof app;`,
  `export type ApiApp = ReturnType<typeof createApiApp> extends Promise<infer T> ? T["app"] : never;`,
);

// cognitiveScope calls need await
content = content.replace(/(?<!await )cognitiveScope\(/g, "await cognitiveScope(");
content = content.replace(/await await cognitiveScope/g, "await cognitiveScope");

writeFileSync(appPath, content);
console.log("Migrated app.ts for async services");
