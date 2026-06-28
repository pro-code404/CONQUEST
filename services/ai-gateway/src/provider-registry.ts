import type { AiProvider, AiProviderId } from "./types.js";

export class AiProviderRegistry {
  private readonly providers = new Map<AiProviderId, AiProvider>();

  register(provider: AiProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(id: AiProviderId): AiProvider | null {
    return this.providers.get(id) ?? null;
  }

  list(): AiProvider[] {
    return [...this.providers.values()];
  }

  listAvailable(): AiProvider[] {
    return this.list().filter((p) => p.status() === "available");
  }
}
