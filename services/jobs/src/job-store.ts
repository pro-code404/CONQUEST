import { randomUUID } from "node:crypto";
import { JOB_CONSTANTS } from "@conquest/config";
import type { EnqueueJobInput, JobQueueMetrics, JobRecord } from "./types.js";

export class InMemoryJobStore {
  private readonly jobs = new Map<string, JobRecord>();

  enqueue(input: EnqueueJobInput): JobRecord {
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
    this.jobs.set(job.id, job);
    return job;
  }

  get(id: string): JobRecord | null {
    return this.jobs.get(id) ?? null;
  }

  update(job: JobRecord): void {
    this.jobs.set(job.id, job);
  }

  listReady(now = Date.now()): JobRecord[] {
    return [...this.jobs.values()].filter(
      (job) =>
        (job.status === "queued" || job.status === "delayed") && job.scheduledAt <= now,
    );
  }

  listByStatus(status: JobRecord["status"]): JobRecord[] {
    return [...this.jobs.values()].filter((job) => job.status === status);
  }

  metrics(deadLetterSize: number): JobQueueMetrics {
    const values = [...this.jobs.values()];
    return {
      queued: values.filter((j) => j.status === "queued" || j.status === "delayed").length,
      running: values.filter((j) => j.status === "running").length,
      completed: values.filter((j) => j.status === "completed").length,
      failed: values.filter((j) => j.status === "failed").length,
      deadLetter: deadLetterSize,
    };
  }
}
