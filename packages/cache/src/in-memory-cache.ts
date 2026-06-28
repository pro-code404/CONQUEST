import { CACHE_CONSTANTS } from "@conquest/config";
import type { CacheProvider, CacheSetOptions } from "./types.js";

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
  tags: string[];
}

/**
 * In-memory cache provider for development and tests.
 * Production workloads should use Redis via {@link RedisCacheProvider}.
 */
export class InMemoryCacheProvider implements CacheProvider {
  readonly name = "memory";

  private readonly entries = new Map<string, CacheEntry<unknown>>();
  private readonly tagIndex = new Map<string, Set<string>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.entries.get(key);
    if (!entry) return null;
    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      await this.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void> {
    const ttlMs = options?.ttlMs ?? CACHE_CONSTANTS.DEFAULT_TTL_MS;
    const tags = options?.tags ?? [];
    const expiresAt = ttlMs > 0 ? Date.now() + ttlMs : null;

    const previous = this.entries.get(key);
    if (previous) {
      for (const tag of previous.tags) {
        this.tagIndex.get(tag)?.delete(key);
      }
    }

    this.entries.set(key, { value, expiresAt, tags });
    for (const tag of tags) {
      const keys = this.tagIndex.get(tag) ?? new Set<string>();
      keys.add(key);
      this.tagIndex.set(tag, keys);
    }
  }

  async delete(key: string): Promise<boolean> {
    const entry = this.entries.get(key);
    if (!entry) return false;
    for (const tag of entry.tags) {
      this.tagIndex.get(tag)?.delete(key);
    }
    return this.entries.delete(key);
  }

  async invalidateTags(tags: string[]): Promise<number> {
    let count = 0;
    for (const tag of tags) {
      const keys = this.tagIndex.get(tag);
      if (!keys) continue;
      for (const key of [...keys]) {
        if (await this.delete(key)) count += 1;
      }
      this.tagIndex.delete(tag);
    }
    return count;
  }

  async clear(): Promise<void> {
    this.entries.clear();
    this.tagIndex.clear();
  }

  async healthCheck(): Promise<{ healthy: boolean; details?: string }> {
    return { healthy: true, details: `entries=${this.entries.size}` };
  }
}
