import { test, expect } from "@playwright/test";

const unique = Date.now();
const email = `e2e-${unique}@conquest.test`;
const password = "password123";
const displayName = "E2E User";

async function completeOnboarding(page: import("@playwright/test").Page) {
  await page.waitForURL(/\/onboarding/);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /create your workspace/i }).click();
  await page.getByLabel("Workspace name").fill(`E2E Workspace ${unique}`);
  await page.getByLabel("Workspace type").fill("team");
  await page.getByLabel("Primary goal").fill("Closed beta validation");
  await page.getByRole("button", { name: "Create workspace" }).click();
  await page.getByRole("button", { name: /skip for now/i }).click();
  await page.waitForURL(/\/app/);
}

test.describe("Closed beta journey", () => {
  test("full demo path from landing to logout", async ({ page }) => {
    // Landing
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Your Intelligence Command Center/i })).toBeVisible();

    // Cookie banner
    const acceptCookies = page.getByRole("button", { name: "Accept" });
    if (await acceptCookies.isVisible().catch(() => false)) {
      await acceptCookies.click();
    }

    // Signup
    await page.goto("/signup");
    await page.getByLabel("Full name").fill(displayName);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: /create account/i }).click();

    // Verify email (dev token in URL)
    await page.waitForURL(/verify-email/);
    await page.getByRole("button", { name: /verify email/i }).click();

    // Onboarding → workspace → skip connect
    await completeOnboarding(page);

    // Login after session established (logout then re-authenticate)
    await page.request.post("/api/auth/logout");
    const loginPage = await page.goto("/login");
    expect(loginPage?.ok()).toBeTruthy();
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await page.waitForURL(/\/app/);

    // Command Center reachable
    await expect(page.getByRole("heading", { name: /command center/i })).toBeVisible({ timeout: 15_000 });

    // Correlation IDs on API
    const health = await page.request.get("/api/health/live");
    expect(health.headers()["x-correlation-id"]).toBeTruthy();
    expect(health.headers()["x-trace-id"]).toBeTruthy();

    // Research + cognitive analysis (tenant-scoped)
    const workspacesRes = await page.request.get("/api/workspaces");
    expect(workspacesRes.ok()).toBeTruthy();
    const workspaces = (await workspacesRes.json()) as { workspaces: Array<{ id: string }> };
    const workspaceId = workspaces.workspaces[0]?.id;
    expect(workspaceId).toBeTruthy();

    const sessionRes = await page.request.post(`/api/workspaces/${workspaceId}/research/sessions`, {
      data: { title: "E2E Research", objective: "Evaluate closed beta readiness" },
    });
    expect(sessionRes.ok()).toBeTruthy();
    const sessionBody = (await sessionRes.json()) as { session: { id: string } };

    const analyze = await page.request.post(
      `/api/workspaces/${workspaceId}/research/sessions/${sessionBody.session.id}/analyze`,
      { data: {} },
    );
    expect(analyze.ok()).toBeTruthy();
    expect(analyze.headers()["x-correlation-id"]).toBeTruthy();

    // Intelligence recommendations
    const intel = await page.request.get(`/api/workspaces/${workspaceId}/intelligence/home`);
    expect(intel.ok()).toBeTruthy();

    // Automation
    const automation = await page.request.get(`/api/workspaces/${workspaceId}/automation/workflows`);
    expect(automation.ok()).toBeTruthy();

    // Settings + administration UI
    await page.goto("/app/settings/account");
    await expect(page.getByLabel("Full name")).toBeVisible({ timeout: 10_000 });

    await page.goto("/app/settings/administration");
    await expect(page.getByText(/administration|feature flag/i).first()).toBeVisible({ timeout: 10_000 });

    // Legal status
    const legal = await page.request.get("/api/legal/status");
    expect(legal.ok()).toBeTruthy();

    // Ops status + degradation probes
    const ops = await page.request.get("/api/ops/status");
    expect(ops.ok()).toBeTruthy();
    const degradation = await page.request.get("/api/ops/degradation");
    expect(degradation.ok()).toBeTruthy();
    const probe = (await degradation.json()) as { overall: string; probes: Array<{ name: string }> };
    expect(probe.overall).toMatch(/healthy|degraded/);
    expect(probe.probes.map((p) => p.name)).toEqual(
      expect.arrayContaining(["database", "redis", "email", "ai", "queue"]),
    );

    // Logout
    await page.request.post("/api/auth/logout");
    const afterLogout = await page.request.get("/api/auth/session");
    const sessionAfter = (await afterLogout.json()) as { user: unknown };
    expect(sessionAfter.user).toBeNull();
  });
});
