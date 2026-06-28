import { describe, it, expect } from "vitest";
import {
  resolveAppShellAccess,
  resolveGuestAccess,
  resolveOnboardingAccess,
  resolveProtectedRedirect,
  resolveVerifyEmailAccess,
  resolveWorkspaceRouteAccess,
  isValidWorkspaceId,
} from "./route-access.js";
import type { SessionUser } from "./types.js";

const completeUser: SessionUser = {
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

describe("route access (RTM-UX-010)", () => {
  it("blocks anonymous users from protected routes with return URL", () => {
    const result = resolveProtectedRedirect(null, false, "/app/w/x/command-center", "");
    expect(result.status).toBe("unauthenticated");
    expect(result.redirectTo).toContain("returnTo=");
  });

  it("redirects guests away from login when authenticated", () => {
    const result = resolveGuestAccess(completeUser, false);
    expect(result.status).toBe("guest_redirect");
    expect(result.redirectTo).toContain("/app/w/");
  });

  it("redirects verified users away from verify-email", () => {
    const result = resolveVerifyEmailAccess(completeUser, false);
    expect(result.redirectTo).toBe("/app/w/550e8400-e29b-41d4-a716-446655440000/command-center");
  });

  it("redirects incomplete onboarding away from app shell", () => {
    const result = resolveAppShellAccess(
      { ...completeUser, onboardingComplete: false, onboardingStage: "welcome" },
      false,
    );
    expect(result.status).toBe("onboarding_incomplete");
    expect(result.redirectTo).toBe("/onboarding");
  });

  it("redirects onboarded users without workspace", () => {
    const result = resolveAppShellAccess({ ...completeUser, activeWorkspaceId: null }, false);
    expect(result.redirectTo).toBe("/onboarding/workspace");
  });

  it("rejects invalid workspace IDs", () => {
    const result = resolveWorkspaceRouteAccess(
      completeUser,
      false,
      "/app/w/not-a-uuid/command-center",
    );
    expect(result.status).toBe("invalid_workspace");
  });

  it("redirects workspace mismatch to active workspace", () => {
    const result = resolveWorkspaceRouteAccess(
      completeUser,
      false,
      "/app/w/660e8400-e29b-41d4-a716-446655440001/command-center",
    );
    expect(result.status).toBe("workspace_mismatch");
    expect(result.redirectTo).toContain(completeUser.activeWorkspaceId!);
  });

  it("forbids viewers from automation module", () => {
    const viewer = { ...completeUser, role: "viewer" as const };
    const result = resolveWorkspaceRouteAccess(
      viewer,
      false,
      `/app/w/${completeUser.activeWorkspaceId}/automation`,
    );
    expect(result.status).toBe("forbidden_role");
    expect(result.redirectTo).toBe("/forbidden");
  });

  it("allows deep link to command center for authorized user", () => {
    const result = resolveWorkspaceRouteAccess(
      completeUser,
      false,
      `/app/w/${completeUser.activeWorkspaceId}/command-center`,
    );
    expect(result.status).toBe("allow");
  });

  it("allows secondary module home routes when GIS permissions exist", () => {
    for (const segment of ["intelligence", "research", "operations"] as const) {
      const result = resolveWorkspaceRouteAccess(
        completeUser,
        false,
        `/app/w/${completeUser.activeWorkspaceId}/${segment}`,
      );
      expect(result.status).toBe("allow");
    }
  });

  it("allows nested secondary module routes", () => {
    const result = resolveWorkspaceRouteAccess(
      completeUser,
      false,
      `/app/w/${completeUser.activeWorkspaceId}/intelligence/recommendations/rec-1`,
    );
    expect(result.status).toBe("allow");
  });

  it("rejects unknown workspace module segments", () => {
    const result = resolveWorkspaceRouteAccess(
      completeUser,
      false,
      `/app/w/${completeUser.activeWorkspaceId}/unknown-module`,
    );
    expect(result.status).toBe("invalid_workspace");
  });

  it("redirects unverified users from onboarding to verify-email", () => {
    const result = resolveOnboardingAccess(
      { ...completeUser, emailVerified: false, onboardingComplete: false },
      false,
    );
    expect(result.redirectTo).toBe("/verify-email");
  });

  it("validates workspace id format", () => {
    expect(isValidWorkspaceId("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    expect(isValidWorkspaceId("bad")).toBe(false);
  });
});
