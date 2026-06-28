import type { CacheProvider, CacheSetOptions } from "./types.js";

/**
 * Minimal Redis client surface — adapters (ioredis, node-redis) implement this
 * without coupling the cache layer to a specific SDK.
 */
export interface RedisLikeClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode?: "EX", ttlSeconds?: number): Promise<unknown>;
  del(...keys: string[]): Promise<number>;
  ping(): Promise<string>;
}

export interface RedisCacheProviderOptions {
  client: RedisLikeClient;
  keyPrefix?: string;
  defaultTtlMs?: number;
}

/**
 * Redis-ready cache provider — delegates to a {@link RedisLikeClient} adapter.
 * No feature should import Redis directly; inject this provider instead.
 */
export class RedisCacheProvider implements CacheProvider {
  readonly name = "redis";

  private readonly prefix: string;
  private readonly defaultTtlMs: number;
  private readonly tagSets = new Map<string, Set<string>>();

  constructor(private readonly options: RedisCacheProviderOptions) {
    this.prefix = options.keyPrefix ?? "conquest:cache:";
    this.defaultTtlMs = options.defaultTtlMs ?? 300_000;
  }

  private fullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.options.client.get(this.fullKey(key));
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  }

  async set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void> {
    const ttlMs = options?.ttlMs ?? this.defaultTtlMs;
    const serialized = JSON.stringify(value);
    const full = this.fullKey(key);
    if (ttlMs > 0) {
      await this.options.client.set(full, serialized, "EX", Math.ceil(ttlMs / 1000));
    } else {
      await this.options.client.set(full, serialized);
    }
    const tags = options?.tags ?? [];
    for (const tag of tags) {
      const keys = this.tagSets.get(tag) ?? new Set<string>();
      keys.add(key);
      this.tagSets.set(tag, keys);
    }
  }

  async delete(key: string): Promise<boolean> {
    const removed = await this.options.client.del(this.fullKey(key));
    return removed > 0;
  }

  async invalidateTags(tags: string[]): Promise<number> {
    let count = 0;
    for (const tag of tags) {
      const keys = this.tagSets.get(tag);
      if (!keys) continue;
      for (const key of [...keys]) {
        if (await this.delete(key)) count += 1;
      }
      this.tagSets.delete(tag);
    }
    return count;
  }

  async clear(): Promise<void> {
    this.tagSets.clear();
  }

  async healthCheck(): Promise<{ healthy: boolean; details?: string }> {
    try {
      const pong = await this.options.client.ping();
      return { healthy: pong === "PONG", details: pong };
    } catch (error) {
      return {
        healthy: false,
        details: error instanceof Error ? error.message : "Redis unreachable",
      };
    }
  }
}
