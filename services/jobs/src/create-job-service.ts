import { JobService } from "./job-service.js";
import { InMemoryDeadLetterQueue } from "./dead-letter-queue.js";
import { InMemoryJobStore } from "./job-store.js";
import { RedisDeadLetterQueue } from "./redis-dead-letter-queue.js";
import { RedisJobStore } from "./redis-job-store.js";
import { createJobRedisClient } from "./redis-job-client.js";

export interface CreateJobServiceResult {
  service: JobService;
  label: "redis" | "in-memory";
}

export interface CreateJobServiceOptions {
  redisUrl?: string | null;
  forceMemory?: boolean;
}

/** Creates job service with Redis backend when available; falls back to in-memory for CI. */
export async function createJobService(
  options: CreateJobServiceOptions = {},
): Promise<CreateJobServiceResult> {
  const forceMemory =
    options.forceMemory ||
    process.env.MEMORY_REPO === "true" ||
    process.env.NODE_ENV === "test" ||
    !options.redisUrl;

  if (!forceMemory && options.redisUrl) {
    const client = await createJobRedisClient(options.redisUrl);
    if (client) {
      return {
        service: new JobService({
          store: new RedisJobStore(client),
          deadLetter: new RedisDeadLetterQueue(client),
          queueLabel: "redis",
          redisMode: true,
        }),
        label: "redis",
      };
    }
  }

  return {
    service: new JobService({
      store: new InMemoryJobStore(),
      deadLetter: new InMemoryDeadLetterQueue(),
      queueLabel: "in-memory",
    }),
    label: "in-memory",
  };
}
