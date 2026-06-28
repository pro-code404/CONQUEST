import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const testPath = join(dirname(fileURLToPath(import.meta.url)), "..", "apps", "api", "src", "app.test.ts");
let content = readFileSync(testPath, "utf8");

content = content.replace(
  `import { createApiApp } from "./app.js";
import type { ApiApp } from "./app.js";`,
  `import { AsyncMemoryAuthRepository } from "@conquest/auth";
import { createApiApp, type ApiApp } from "./app.js";

type ApiContext = Awaited<ReturnType<typeof createApiApp>>;

async function createTestApi(): Promise<ApiContext> {
  return createApiApp({ repo: new AsyncMemoryAuthRepository() });
}`,
);

content = content.replace(/createApiApp\(\)\.app/g, "(await createTestApi()).app");
content = content.replace(/ctx = createApiApp\(\)/g, "ctx = await createTestApi()");
content = content.replace(/ReturnType<typeof createApiApp>/g, "ApiContext");
content = content.replace(/beforeEach\(\(\) => \{/g, "beforeEach(async () => {");
content = content.replace(/app = \(await createTestApi\(\)\)\.app;/g, "const testCtx = await createTestApi();\n    app = testCtx.app;");

// Fix double async beforeEach
content = content.replace(/beforeEach\(async async/g, "beforeEach(async");

// Repo direct access -> sync
content = content.replace(/repo\.users/g, "repo.sync.users");
content = content.replace(/repo\.invites/g, "repo.sync.invites");
content = content.replace(/repo\.updateUser/g, "repo.sync.updateUser");
content = content.replace(/repo\.createOrg/g, "repo.sync.createOrg");
content = content.replace(/repo\.createWorkspace/g, "repo.sync.createWorkspace");

writeFileSync(testPath, content);
console.log("Migrated app.test.ts");
