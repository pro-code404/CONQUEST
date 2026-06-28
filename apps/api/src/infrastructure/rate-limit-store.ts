import { API_CONSTANTS } from "@conquest/config";

export interface RateLimitStore {
  increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}

/** In-memory sliding window — single-instance fallback. */
export class InMemoryRateLimitStore implements RateLimitStore {
  private readonly buckets = new Map<string, { count: number; resetAt: number }>();

  async increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }> {
    const now = Date.now();
    const existing = this.buckets.get(key);
    if (!existing || existing.resetAt <= now) {
      const resetAt = now + windowMs;
      this.buckets.set(key, { count: 1, resetAt });
      return { count: 1, resetAt };
    }
    existing.count += 1;
    return { count: existing.count, resetAt: existing.resetAt };
  }
}

/** Redis-backed counter — multi-instance safe. */
export class RedisRateLimitStore implements RateLimitStore {
  constructor(
    private readonly redis: {
      incr(key: string): Promise<number>;
      pExpire(key: string, ms: number): Promise<boolean>;
      pTTL(key: string): Promise<number>;
    },
    private readonly prefix = "conquest:ratelimit:",
  ) {}

  async increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }> {
    const fullKey = `${this.prefix}${key}`;
    const count = await this.redis.incr(fullKey);
    if (count === 1) {
      await this.redis.pExpire(fullKey, windowMs);
    }
    const ttl = await this.redis.pTTL(fullKey);
    const resetAt = Date.now() + (ttl > 0 ? ttl : windowMs);
    return { count, resetAt };
  }
}

export const rateLimitEvents = {
  blocked: 0,
  allowed: 0,
};

export function createRateLimitStore(redisClient?: {
  incr(key: string): Promise<number>;
  pExpire(key: string, ms: number): Promise<boolean>;
  pTTL(key: string): Promise<number>;
}): RateLimitStore {
  if (redisClient) return new RedisRateLimitStore(redisClient);
  return new InMemoryRateLimitStore();
}

export const RATE_LIMIT_MAX = API_CONSTANTS.RATE_LIMIT_MAX_REQUESTS;
export const RATE_LIMIT_WINDOW_MS = API_CONSTANTS.RATE_LIMIT_WINDOW_MS;
