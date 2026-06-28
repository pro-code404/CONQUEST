/** Immutable prompt layers — Phase 8D. Order is enforced by PromptBuilder. */

export const PROMPT_LAYER_ORDER = ["SYSTEM", "DEVELOPER", "TOOLS", "MEMORY", "USER"] as const;

export type PromptLayer = (typeof PROMPT_LAYER_ORDER)[number];

export const USER_INPUT_DELIMITER_START = "<<<USER_INPUT>>>";
export const USER_INPUT_DELIMITER_END = "<<<END_USER_INPUT>>>";

export interface PromptLayerContent {
  layer: PromptLayer;
  content: string;
}

export interface BuiltPrompt {
  layers: readonly PromptLayerContent[];
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  /** Combined text for providers that accept a single prompt string. */
  text: string;
}
