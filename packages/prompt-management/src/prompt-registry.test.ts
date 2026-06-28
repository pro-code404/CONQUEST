import { describe, it, expect, beforeEach } from "vitest";
import { PromptRegistry } from "./index.js";

describe("PromptRegistry (Phase 10E)", () => {
  let registry: PromptRegistry;

  beforeEach(() => {
    registry = new PromptRegistry();
    registry.registerTemplate({
      id: "test.prompt",
      label: "Test",
      systemTemplate: "Objective: {{objective}}",
      variables: ["objective"],
    });
  });

  it("renders via prompt-security builder without concatenation in caller", () => {
    const built = registry.render({
      templateId: "test.prompt",
      variables: { objective: "Analyze risk" },
      userInput: "What are the top risks?",
    });
    expect(built.layers.some((l) => l.layer === "USER")).toBe(true);
    expect(built.text).toContain("Analyze risk");
  });

  it("validates missing variables", () => {
    expect(() =>
      registry.render({ templateId: "test.prompt", userInput: "hello" }),
    ).toThrow(/Missing prompt variable/);
  });

  it("caches repeated prompt renders", () => {
    const input = {
      templateId: "test.prompt",
      variables: { objective: "Cached objective" },
      userInput: "repeat",
    };
    const first = registry.render(input);
    const second = registry.render(input);
    expect(first).toBe(second);
  });

  it("tests prompt templates", () => {
    const result = registry.test({
      templateId: "test.prompt",
      variables: { objective: "Test" },
      userInput: "input",
    });
    expect(result.valid).toBe(true);
  });
});
