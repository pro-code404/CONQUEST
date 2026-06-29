import { test, expect } from "@playwright/test";

async function dismissCookieBanner(page: import("@playwright/test").Page) {
  const accept = page.getByRole("button", { name: "Accept" });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }
}

test.describe("Preview route smoke", () => {
  test("landing renders without runtime error", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await dismissCookieBanner(page);

    await expect(page.getByRole("heading", { name: /Your Intelligence Command Center/i })).toBeVisible();
    await page.screenshot({ path: "docs/build-2/preview-landing-verified.png", fullPage: true });
    expect(errors.some((m) => m.includes("basename"))).toBe(false);
  });

  test("login route renders", async ({ page }) => {
    await page.goto("/login");
    await dismissCookieBanner(page);
    await expect(page.getByRole("button", { name: /sign in|log in/i })).toBeVisible();
  });

  test("legal routes render outside guest shell", async ({ page }) => {
    await page.goto("/legal/privacy");
    await expect(page.getByRole("heading")).toBeVisible();
  });
});
