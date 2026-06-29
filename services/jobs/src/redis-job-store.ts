import { randomUUID } from "node:crypto";
import { JOB_CONSTANTS } from "@conquest/config";
import type { EnqueueJobInput, JobRecord } from "./types.js";
import type { JobStore } from "./job-store-interface.js";

const PREFIX = "conquest:jobs:";
const INDEX_KEY = `${PREFIX}index`;

export interface JobRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<unknown>;
  del(key: string): Promise<unknown>;
  sadd(key: string, member: string): Promise<unknown>;
  smembers(key: string): Promise<string[]>;
  srem(key: string, member: string): Promise<unknown>;
}

function jobKey(id: string): string {
  return `${PREFIX}record:${id}`;
}

/** Redis-backed job store — durable queue for multi-instance deployments. */
export class RedisJobStore implements JobStore {
  constructor(private readonly redis: JobRedisClient) {}

  async enqueue(input: EnqueueJobInput): Promise<JobRecord> {
    const now = Date.now();
    const job: JobRecord = {
      id: randomUUID(),
      type: input.type,
      payload: input.payload,
      status: input.delayMs && input.delayMs > 0 ? "delayed" : "queued",
      correlationId: input.correlationId,
      tenant: input.tenant ?? null,
      progress: JOB_CONSTANTS.PROGRESS_MIN,
      attempts: 0,
      maxAttempts: input.maxAttempts ?? JOB_CONSTANTS.DEFAULT_MAX_ATTEMPTS,
      scheduledAt: now + (input.delayMs ?? 0),
      startedAt: null,
      completedAt: null,
      error: null,
      createdAt: now,
    };
    await this.redis.set(jobKey(job.id), JSON.stringify(job));
    await this.redis.sadd(INDEX_KEY, job.id);
    return job;
  }

  async get(id: string): Promise<JobRecord | null> {
    const raw = await this.redis.get(jobKey(id));
    return raw ? (JSON.parse(raw) as JobRecord) : null;
  }

  async update(job: JobRecord): Promise<void> {
    await this.redis.set(jobKey(job.id), JSON.stringify(job));
  }

  async listReady(now = Date.now()): Promise<JobRecord[]> {
    const ids = await this.redis.smembers(INDEX_KEY);
    const jobs: JobRecord[] = [];
    for (const id of ids) {
      const raw = await this.redis.get(jobKey(id));
      if (!raw) continue;
      const job = JSON.parse(raw) as JobRecord;
      if (
        (job.status === "queued" || job.status === "delayed") &&
        job.scheduledAt <= now
      ) {
        jobs.push(job);
      }
    }
    return jobs.sort((a, b) => a.scheduledAt - b.scheduledAt);
  }

  async listByStatus(status: JobRecord["status"]): Promise<JobRecord[]> {
    const ids = await this.redis.smembers(INDEX_KEY);
    const jobs: JobRecord[] = [];
    for (const id of ids) {
      const raw = await this.redis.get(jobKey(id));
      if (!raw) continue;
      const job = JSON.parse(raw) as JobRecord;
      if (job.status === status) jobs.push(job);
    }
    return jobs;
  }

  async metrics(deadLetterSize: number) {
    const ids = await this.redis.smembers(INDEX_KEY);
    const jobs: JobRecord[] = [];
    for (const id of ids) {
      const raw = await this.redis.get(jobKey(id));
      if (raw) jobs.push(JSON.parse(raw) as JobRecord);
    }
    return {
      queued: jobs.filter((j) => j.status === "queued" || j.status === "delayed").length,
      running: jobs.filter((j) => j.status === "running").length,
      completed: jobs.filter((j) => j.status === "completed").length,
      failed: jobs.filter((j) => j.status === "failed").length,
      deadLetter: deadLetterSize,
    };
  }
}
