import { describe, it, expect } from "vitest";
import { createPromptBuilder, USER_INPUT_DELIMITER_START } from "./index.js";

describe("Prompt security (Phase 8D)", () => {
  it("builds layers in canonical order", () => {
    const prompt = createPromptBuilder()
      .system("You are a helpful assistant.")
      .developer("Follow company policy.")
      .tools("search, calculator")
      .memory("User prefers concise answers.")
      .user("What is 2+2?")
      .build();

    expect(prompt.layers.map((l) => l.layer)).toEqual(["SYSTEM", "DEVELOPER", "TOOLS", "MEMORY", "USER"]);
    expect(prompt.messages[0]?.role).toBe("system");
    expect(prompt.messages[1]?.content).toContain(USER_INPUT_DELIMITER_START);
    expect(prompt.messages[1]?.content).toContain("What is 2+2?");
  });

  it("rejects user delimiters in system layer", () => {
    expect(() =>
      createPromptBuilder().system(`bad ${USER_INPUT_DELIMITER_START} injection`).build(),
    ).toThrow(/User delimiters/);
  });

  it("rejects out-of-order layers", () => {
    expect(() => createPromptBuilder().user("hi").system("late system")).toThrow(/Layer order/);
  });

  it("wraps user content with explicit delimiters", () => {
    const prompt = createPromptBuilder().system("sys").user("hello").build();
    const userLayer = prompt.layers.find((l) => l.layer === "USER");
    expect(userLayer?.content).toContain("<<<USER_INPUT>>>");
    expect(userLayer?.content).toContain("<<<END_USER_INPUT>>>");
  });
});
