import type { RedisLikeClient } from "@conquest/cache";

/** Minimal Redis adapter — uses fetch to HTTP bridge or native when REDIS_URL is set. */
export async function createRedisClient(redisUrl: string): Promise<RedisLikeClient | null> {
  try {
    const { createClient } = await import("redis");
    const client = createClient({ url: redisUrl });
    client.on("error", (error: Error) => {
      console.error(JSON.stringify({ event: "redis_client_error", message: error.message }));
    });
    await client.connect();
    return {
      get: (key) => client.get(key),
      set: async (key, value, mode, ttlSeconds) => {
        if (mode === "EX" && ttlSeconds) {
          return client.set(key, value, { EX: ttlSeconds });
        }
        return client.set(key, value);
      },
      del: (...keys) => client.del(keys),
      ping: () => client.ping(),
    };
  } catch (error) {
    console.warn(
      JSON.stringify({
        event: "redis_unavailable",
        message: error instanceof Error ? error.message : "redis client failed",
      }),
    );
    return null;
  }
}
