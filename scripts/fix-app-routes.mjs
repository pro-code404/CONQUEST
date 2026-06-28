import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const appPath = join(dirname(fileURLToPath(import.meta.url)), "..", "apps", "api", "src", "app.ts");
let content = readFileSync(appPath, "utf8");

const routes = [
  `app.get("/api/auth/session", async (c) =>`,
  `app.post("/api/auth/logout", async (c) =>`,
  `app.post("/api/auth/verify-email/resend", async (c) =>`,
  `app.post("/api/auth/onboarding/finish", async (c) =>`,
  `app.get("/api/auth/invite/:token", async (c) =>`,
  `app.post("/api/auth/invite/:token/accept", async (c) =>`,
  `app.post("/api/auth/workspace/:workspaceId/select", async (c) =>`,
  `app.get("/api/auth/workspace/:workspaceId/validate", async (c) =>`,
  `app.get("/api/workspaces", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/command-center/status", async (c) =>`,
  `app.get("/api/settings/categories", async (c) =>`,
  `app.get("/api/settings/account", async (c) =>`,
  `app.get("/api/settings/preferences", async (c) =>`,
  `app.get("/api/settings/organization", async (c) =>`,
  `app.get("/api/settings/organization/members", async (c) =>`,
  `app.delete("/api/settings/organization/members/:userId", async (c) =>`,
  `app.get("/api/settings/notifications", async (c) =>`,
  `app.get("/api/settings/privacy", async (c) =>`,
  `app.post("/api/settings/privacy/export", async (c) =>`,
  `app.post("/api/settings/privacy/deletion", async (c) =>`,
  `app.get("/api/settings/billing", async (c) =>`,
  `app.get("/api/settings/integrations", async (c) =>`,
  `app.post("/api/settings/integrations/:integrationId/connect", async (c) =>`,
  `app.post("/api/settings/integrations/:integrationId/disconnect", async (c) =>`,
  `app.get("/api/settings/workspace/:workspaceId", async (c) =>`,
  `app.get("/api/settings/workspace/:workspaceId/team", async (c) =>`,
  `app.delete("/api/settings/workspace/:workspaceId/team/:userId", async (c) =>`,
  `app.get("/api/profile", async (c) =>`,
  `app.get("/api/profile/sessions", async (c) =>`,
  `app.delete("/api/profile/sessions/:sessionId", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/automation/workflows", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/automation/workflows/:workflowId", async (c) =>`,
  `app.delete("/api/workspaces/:workspaceId/automation/workflows/:workflowId", async (c) =>`,
  `app.post("/api/workspaces/:workspaceId/automation/workflows/:workflowId/enable", async (c) =>`,
  `app.post("/api/workspaces/:workspaceId/automation/workflows/:workflowId/disable", async (c) =>`,
  `app.post("/api/workspaces/:workspaceId/automation/workflows/:workflowId/pause", async (c) =>`,
  `app.post("/api/workspaces/:workspaceId/automation/workflows/:workflowId/resume", async (c) =>`,
  `app.post("/api/workspaces/:workspaceId/automation/workflows/:workflowId/run", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/automation/workflows/:workflowId/executions", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/automation/approvals", async (c) =>`,
  `app.post("/api/workspaces/:workspaceId/automation/approvals/:workflowId/approve", async (c) =>`,
  `app.post("/api/workspaces/:workspaceId/automation/approvals/:workflowId/reject", async (c) =>`,
  `app.get("/api/settings/security", async (c) =>`,
  `app.post("/api/settings/security/mfa/enroll", async (c) =>`,
  `app.post("/api/settings/security/mfa/regenerate", async (c) =>`,
  `app.get("/api/settings/security/devices", async (c) =>`,
  `app.delete("/api/settings/security/devices/:deviceId", async (c) =>`,
  `app.get("/api/settings/automation-policies", async (c) =>`,
  `app.get("/api/settings/advanced", async (c) =>`,
  `app.get("/api/settings/memory", async (c) =>`,
  `app.get("/api/settings/activity", async (c) =>`,
  `app.get("/api/settings/workspace/:workspaceId/sources", async (c) =>`,
  `app.delete("/api/settings/workspace/:workspaceId/sources/:sourceId", async (c) =>`,
  `app.get("/api/settings/workspace/:workspaceId/goals", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/intelligence/home", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/intelligence/feed", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/intelligence/recommendations", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/intelligence/recommendations/:recommendationId", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/intelligence/opportunities", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/intelligence/risks", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/intelligence/timeline", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/research/sessions", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/research/sessions/:researchSessionId", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/analytics/dashboard", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/analytics/metrics", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/analytics/saved-views", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/operations/dashboard", async (c) =>`,
  `app.get("/api/settings/administration", async (c) =>`,
  `app.get("/api/workspaces/:workspaceId/cognitive/requests/:requestId", async (c) =>`,
  `app.get("/api/settings/prompts", async (c) =>`,
];

for (const route of routes) {
  const broken = "app.(, async (c) =>";
  const idx = content.indexOf(broken);
  if (idx === -1) {
    console.error("No more broken routes; remaining:", (content.match(/app\.\(,/g) || []).length);
    break;
  }
  content = content.slice(0, idx) + route + content.slice(idx + broken.length);
}

content = content.replace(
  `export const { app } = createApiApp();

export type ApiApp = typeof app;`,
  `export type ApiApp = Awaited<ReturnType<typeof createApiApp>>["app"];`,
);

// Fix double await in Promise.all
content = content.replace(
  `await Promise.all([
        await identity.healthCheck(),
        await workspace.healthCheck(),
        await settings.healthCheck(),
        await automation.healthCheck(),`,
  `await Promise.all([
        identity.healthCheck(),
        workspace.healthCheck(),
        settings.healthCheck(),
        automation.healthCheck(),`,
);

const remaining = (content.match(/app\.\(,/g) || []).length;
writeFileSync(appPath, content);
console.log(`Fixed routes. Remaining broken: ${remaining}`);
