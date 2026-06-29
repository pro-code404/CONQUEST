import type { JobRedisClient } from "./redis-job-store.js";

/** Connects to Redis for durable job storage. */
export async function createJobRedisClient(redisUrl: string): Promise<JobRedisClient | null> {
  try {
    const { createClient } = await import("redis");
    const client = createClient({ url: redisUrl });
    client.on("error", (error: Error) => {
      console.error(JSON.stringify({ event: "job_redis_error", message: error.message }));
    });
    await client.connect();
    return {
      get: (key) => client.get(key),
      set: (key, value) => client.set(key, value),
      del: (key) => client.del(key),
      sadd: (key, member) => client.sAdd(key, member),
      smembers: (key) => client.sMembers(key),
      srem: (key, member) => client.sRem(key, member),
    };
  } catch (error) {
    console.warn(
      JSON.stringify({
        event: "job_redis_unavailable",
        message: error instanceof Error ? error.message : "redis connect failed",
      }),
    );
    return null;
  }
}
