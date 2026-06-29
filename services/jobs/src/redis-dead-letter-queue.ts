import { JOB_CONSTANTS } from "@conquest/config";
import type { DeadLetterQueue, JobRecord } from "./types.js";
import type { JobRedisClient } from "./redis-job-store.js";

const DLQ_KEY = "conquest:jobs:dlq";

export class RedisDeadLetterQueue implements DeadLetterQueue {
  constructor(private readonly redis: JobRedisClient) {}

  push(job: JobRecord): void {
    void this.pushAsync(job);
  }

  async pushAsync(job: JobRecord): Promise<void> {
    const entry = { ...job, status: "dead_letter" as const, completedAt: Date.now() };
    const raw = await this.redis.get(DLQ_KEY);
    const list: JobRecord[] = raw ? (JSON.parse(raw) as JobRecord[]) : [];
    list.push(entry);
    const cutoff = Date.now() - JOB_CONSTANTS.DEAD_LETTER_RETENTION_MS;
    const trimmed = list.filter((item) => item.createdAt >= cutoff);
    await this.redis.set(DLQ_KEY, JSON.stringify(trimmed));
  }

  list(_limit = 50): JobRecord[] {
    throw new Error("Redis DLQ requires listAsync");
  }

  async listAsync(limit = 50): Promise<JobRecord[]> {
    const raw = await this.redis.get(DLQ_KEY);
    const list: JobRecord[] = raw ? (JSON.parse(raw) as JobRecord[]) : [];
    return list.slice(-limit);
  }

  size(): number {
    throw new Error("Redis DLQ requires sizeAsync");
  }

  async sizeAsync(): Promise<number> {
    const raw = await this.redis.get(DLQ_KEY);
    const list: JobRecord[] = raw ? (JSON.parse(raw) as JobRecord[]) : [];
    return list.length;
  }
}
