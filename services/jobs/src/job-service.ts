import { JOB_CONSTANTS } from "@conquest/config";
import { SERVICE_NAMES } from "@conquest/core";
import { InfrastructureServiceBase } from "@conquest/service-shared";
import { InMemoryDeadLetterQueue } from "./dead-letter-queue.js";
import { InMemoryJobStore } from "./job-store.js";
import type { JobStore } from "./job-store-interface.js";
import { RedisDeadLetterQueue } from "./redis-dead-letter-queue.js";
import type {
  DeadLetterQueue,
  EnqueueJobInput,
  JobHandler,
  JobQueueMetrics,
  JobRecord,
  JobType,
} from "./types.js";

export interface JobServiceOptions {
  store?: JobStore;
  deadLetter?: DeadLetterQueue;
  queueLabel?: "redis" | "in-memory";
  redisMode?: boolean;
}


function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Job timeout exceeded")), timeoutMs);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

async function deadLetterSize(dlq: DeadLetterQueue, redisMode: boolean): Promise<number> {
  if (redisMode && dlq instanceof RedisDeadLetterQueue) {
    return dlq.sizeAsync();
  }
  return dlq.size();
}

/**
 * Platform job framework — queue, delay, retry, cancellation, progress, timeout.
 * Handlers register by job type; execution engines are plugged in later.
 */
export class JobService extends InfrastructureServiceBase {
  readonly serviceName = SERVICE_NAMES.JOBS;
  readonly queueLabel: "redis" | "in-memory";

  private readonly store: JobStore;
  private readonly deadLetter: DeadLetterQueue;
  private readonly redisMode: boolean;
  private readonly handlers = new Map<JobType, JobHandler>();
  private processing = false;
  private lastWorkerBeat = Date.now();

  constructor(options: JobServiceOptions = {}) {
    super();
    this.store = options.store ?? new InMemoryJobStore();
    this.deadLetter = options.deadLetter ?? new InMemoryDeadLetterQueue();
    this.queueLabel = options.queueLabel ?? "in-memory";
    this.redisMode = options.redisMode ?? false;
  }

  registerHandler(handler: JobHandler): void {
    this.handlers.set(handler.type, handler);
  }

  async enqueue(input: EnqueueJobInput): Promise<JobRecord> {
    const job = await this.store.enqueue(input);
    this.emit("job_enqueued", "info", {
      jobId: job.id,
      type: job.type,
      correlationId: job.correlationId,
    });
    return job;
  }

  async getJob(id: string): Promise<JobRecord | null> {
    return this.store.get(id);
  }

  async cancel(id: string): Promise<JobRecord> {
    const job = await this.store.get(id);
    if (!job) throw new Error("Job not found");
    if (job.status === "running") {
      throw new Error("Cannot cancel a running job");
    }
    if (job.status === "completed" || job.status === "cancelled") {
      return job;
    }
    job.status = "cancelled";
    job.completedAt = Date.now();
    await this.store.update(job);
    this.emit("job_cancelled", "info", { jobId: id, correlationId: job.correlationId });
    return job;
  }

  async reportProgress(id: string, progress: number): Promise<JobRecord> {
    const job = await this.store.get(id);
    if (!job) throw new Error("Job not found");
    job.progress = Math.min(
      JOB_CONSTANTS.PROGRESS_MAX,
      Math.max(JOB_CONSTANTS.PROGRESS_MIN, progress),
    );
    await this.store.update(job);
    return job;
  }

  async processNext(now = Date.now()): Promise<JobRecord | null> {
    const ready = await this.store.listReady(now);
    const job = ready[0];
    if (!job) return null;
    return this.execute(job);
  }

  async processAll(limit = 10, now = Date.now()): Promise<JobRecord[]> {
    const results: JobRecord[] = [];
    for (let i = 0; i < limit; i += 1) {
      const result = await this.processNext(now);
      if (!result) break;
      results.push(result);
    }
    return results;
  }

  private async execute(job: JobRecord): Promise<JobRecord> {
    if (this.processing) return job;
    const handler = this.handlers.get(job.type);
    if (!handler) {
      job.status = "failed";
      job.error = `No handler registered for ${job.type}`;
      job.completedAt = Date.now();
      await this.store.update(job);
      return job;
    }

    this.processing = true;
    this.lastWorkerBeat = Date.now();
    job.status = "running";
    job.startedAt = Date.now();
    job.attempts += 1;
    await this.store.update(job);

    const timeoutMs =
      typeof job.payload.timeoutMs === "number"
        ? job.payload.timeoutMs
        : JOB_CONSTANTS.DEFAULT_JOB_TIMEOUT_MS;

    try {
      await withTimeout(
        handler.handle(job, (progress) => {
          job.progress = progress;
          void this.store.update(job);
        }),
        timeoutMs,
      );
      job.status = "completed";
      job.progress = JOB_CONSTANTS.PROGRESS_MAX;
      job.completedAt = Date.now();
      job.error = null;
      await this.store.update(job);
      this.emit("job_completed", "info", { jobId: job.id, correlationId: job.correlationId });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Job failed";
      job.error = message;
      if (job.attempts >= job.maxAttempts) {
        job.status = "dead_letter";
        job.completedAt = Date.now();
        if (this.redisMode && this.deadLetter instanceof RedisDeadLetterQueue) {
          await this.deadLetter.pushAsync(job);
        } else {
          this.deadLetter.push(job);
        }
        this.emit("job_dead_letter", "error", {
          jobId: job.id,
          correlationId: job.correlationId,
          error: message,
        });
      } else {
        job.status = "delayed";
        const delay = Math.min(
          JOB_CONSTANTS.DEFAULT_RETRY_DELAY_MS * 2 ** (job.attempts - 1),
          JOB_CONSTANTS.MAX_RETRY_DELAY_MS,
        );
        job.scheduledAt = Date.now() + delay;
        this.emit("job_retry_scheduled", "warn", {
          jobId: job.id,
          attempt: job.attempts,
          correlationId: job.correlationId,
          delayMs: delay,
        });
      }
      await this.store.update(job);
    } finally {
      this.processing = false;
      this.lastWorkerBeat = Date.now();
    }

    return job;
  }

  async getMetrics(): Promise<JobQueueMetrics> {
    const dlqSize = await deadLetterSize(this.deadLetter, this.redisMode);
    return this.store.metrics(dlqSize);
  }

  async listDeadLetter(limit?: number): Promise<JobRecord[]> {
    if (this.redisMode && this.deadLetter instanceof RedisDeadLetterQueue) {
      return this.deadLetter.listAsync(limit);
    }
    return this.deadLetter.list(limit);
  }

  workerHealthy(maxIdleMs = 300_000): boolean {
    return Date.now() - this.lastWorkerBeat < maxIdleMs;
  }

  override async healthCheck() {
    const base = await super.healthCheck();
    const metrics = await this.getMetrics();
    return {
      ...base,
      healthy: base.healthy && this.workerHealthy(),
      details: `backend=${this.queueLabel} queued=${metrics.queued} running=${metrics.running} dlq=${metrics.deadLetter}`,
    };
  }
}
