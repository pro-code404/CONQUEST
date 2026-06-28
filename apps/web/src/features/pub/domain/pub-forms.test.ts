import { describe, it, expect } from "vitest";
import { validateSignUp, validateWorkspaceForm } from "./pub-forms.js";

describe("pub-forms domain", () => {
  it("validates signup fields", () => {
    expect(
      validateSignUp({ displayName: "User", email: "a@b.com", password: "password123" }),
    ).toBeNull();
  });

  it("requires workspace goal for ONB-03", () => {
    expect(
      validateWorkspaceForm({ workspaceName: "Ops", workspaceType: "team", primaryGoal: "" }),
    ).toBeTruthy();
  });
});
