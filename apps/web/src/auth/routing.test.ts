import { describe, it, expect } from "vitest";
import { resolveAuthenticatedPath, buildLoginRedirect } from "./routing.js";
import type { SessionUser } from "./types.js";

const baseUser: SessionUser = {
  sessionId: "s1",
  userId: "u1",
  orgId: "o1",
  activeWorkspaceId: "550e8400-e29b-41d4-a716-446655440000",
  email: "a@b.com",
  displayName: "User",
  role: "owner",
  emailVerified: true,
  onboardingComplete: true,
  onboardingStage: "done",
  authStrength: "password",
};

describe("auth routing (RTM-UX-010)", () => {
  it("routes unverified users to verify-email", () => {
    expect(resolveAuthenticatedPath({ ...baseUser, emailVerified: false })).toBe("/verify-email");
  });

  it("routes incomplete onboarding to welcome", () => {
    expect(
      resolveAuthenticatedPath({ ...baseUser, onboardingComplete: false, onboardingStage: "welcome" }),
    ).toBe("/onboarding");
  });

  it("routes complete users to command center", () => {
    expect(resolveAuthenticatedPath(baseUser)).toBe(
      "/app/w/550e8400-e29b-41d4-a716-446655440000/command-center",
    );
  });

  it("routes onboarded users without workspace to workspace setup", () => {
    expect(resolveAuthenticatedPath({ ...baseUser, activeWorkspaceId: null })).toBe("/onboarding/workspace");
  });

  it("sanitizes login redirect", () => {
    expect(buildLoginRedirect("//evil.com")).toBe("/login");
    expect(buildLoginRedirect("/app/w/x/command-center")).toContain("returnTo=");
  });
});
