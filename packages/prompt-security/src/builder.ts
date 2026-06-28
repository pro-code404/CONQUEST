import {
  PROMPT_LAYER_ORDER,
  USER_INPUT_DELIMITER_END,
  USER_INPUT_DELIMITER_START,
  type BuiltPrompt,
  type PromptLayer,
  type PromptLayerContent,
} from "./types.js";

const LAYER_RANK = Object.fromEntries(PROMPT_LAYER_ORDER.map((layer, index) => [layer, index])) as Record<
  PromptLayer,
  number
>;

function wrapUserContent(content: string): string {
  return `${USER_INPUT_DELIMITER_START}\n${content}\n${USER_INPUT_DELIMITER_END}`;
}

/**
 * Secure prompt builder — user content never enters the SYSTEM layer.
 * Layers are immutable once built; only append in canonical order.
 */
export class PromptBuilder {
  private readonly layers: PromptLayerContent[] = [];
  private frozen = false;

  system(content: string): this {
    return this.append("SYSTEM", content);
  }

  developer(content: string): this {
    return this.append("DEVELOPER", content);
  }

  tools(content: string): this {
    return this.append("TOOLS", content);
  }

  memory(content: string): this {
    return this.append("MEMORY", content);
  }

  /** User input is always delimiter-wrapped and isolated in the USER layer. */
  user(content: string): this {
    return this.append("USER", wrapUserContent(content));
  }

  private append(layer: PromptLayer, content: string): this {
    if (this.frozen) {
      throw new Error("PromptBuilder is frozen after build()");
    }
    const trimmed = content.trim();
    if (!trimmed) {
      throw new Error(`${layer} layer content cannot be empty`);
    }
    const lastLayer = this.layers[this.layers.length - 1]?.layer;
    if (lastLayer && LAYER_RANK[layer] < LAYER_RANK[lastLayer]) {
      throw new Error(`Layer order violation: ${layer} cannot follow ${lastLayer}`);
    }
    if (layer !== "USER" && content.includes(USER_INPUT_DELIMITER_START)) {
      throw new Error("User delimiters are only permitted in the USER layer");
    }
    this.layers.push({ layer, content: trimmed });
    return this;
  }

  build(): BuiltPrompt {
    this.frozen = true;
    const systemParts = this.layers
      .filter((l) => l.layer === "SYSTEM" || l.layer === "DEVELOPER" || l.layer === "TOOLS" || l.layer === "MEMORY")
      .map((l) => `[${l.layer}]\n${l.content}`);
    const userParts = this.layers.filter((l) => l.layer === "USER").map((l) => l.content);

    const systemContent = systemParts.join("\n\n");
    const userContent = userParts.join("\n\n");

    const messages: BuiltPrompt["messages"] = [];
    if (systemContent) messages.push({ role: "system", content: systemContent });
    if (userContent) messages.push({ role: "user", content: userContent });

    const text = [...systemParts, ...userParts].join("\n\n");
    return { layers: [...this.layers], messages, text };
  }
}

export function createPromptBuilder(): PromptBuilder {
  return new PromptBuilder();
}
