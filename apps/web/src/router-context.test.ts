import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const webSrc = join(dirname(fileURLToPath(import.meta.url)));

function read(relative: string): string {
  return readFileSync(join(webSrc, relative), "utf8");
}

/**
 * Regression guard: any file importing react-router-dom runtime APIs must be
 * reachable only through createBrowserRouter route elements (inside RouterProvider).
 */
describe("router context composition", () => {
  it("App.tsx does not mount router hook consumers as RouterProvider siblings", () => {
    const app = read("App.tsx");
    expect(app).not.toContain("CookieConsentBanner");
    expect(app).toMatch(/RouterProvider router=\{router\}/);
  });

  it("global chrome that uses Link lives under RootLayout inside the route tree", () => {
    const routes = read("routes/index.tsx");
    const rootLayout = read("layouts/RootLayout.tsx");
    expect(routes).toContain("RootLayout");
    expect(rootLayout).toContain("CookieConsentBanner");
    expect(rootLayout).toContain("<Outlet />");
  });

  it("main.tsx nests AuthProvider outside RouterProvider (session before routes)", () => {
    const main = read("main.tsx");
    const authIndex = main.indexOf("AuthProvider");
    const appIndex = main.indexOf("<App");
    expect(authIndex).toBeGreaterThan(-1);
    expect(appIndex).toBeGreaterThan(authIndex);
  });
});
