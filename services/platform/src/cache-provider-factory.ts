import {
  InMemoryCacheProvider,
  RedisCacheProvider,
  type CacheProvider,
  type RedisLikeClient,
} from "@conquest/cache";

export interface CacheProviderFactoryOptions {
  /** Inject a Redis client adapter when available (production). */
  redisClient?: RedisLikeClient;
}

/** Selects cache backend — in-memory for local/CI; Redis when client is injected. */
export function createCacheProvider(options: CacheProviderFactoryOptions = {}): {
  provider: CacheProvider;
  label: string;
} {
  if (options.redisClient) {
    return {
      provider: new RedisCacheProvider({ client: options.redisClient }),
      label: "redis",
    };
  }
  return {
    provider: new InMemoryCacheProvider(),
    label: "in-memory",
  };
}
