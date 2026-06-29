/**
 * @vitest-environment happy-dom
 */
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App.js";
import { AuthProvider } from "./auth/AuthContext.js";

function mockFetch() {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/api/auth/session")) {
      return {
        ok: true,
        json: async () => ({ user: null }),
      } as Response;
    }
    if (url.includes("/api/legal/cookie-consent")) {
      return { ok: true, json: async () => ({ ok: true }) } as Response;
    }
    return { ok: true, json: async () => ({}) } as Response;
  });
}

describe("App runtime (router context)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", mockFetch());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders landing and cookie banner without React Router context failure", async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Your Intelligence Command Center/i })).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Accept" })).toBeTruthy();
    });

    expect(screen.queryByText(/Conquest failed to load/i)).toBeNull();
    expect(screen.queryByText(/basename/i)).toBeNull();
  });
});
