import { JOB_CONSTANTS } from "@conquest/config";
import { SERVICE_NAMES } from "@conquest/core";
import { InfrastructureServiceBase } from "@conquest/service-shared";
import { InMemoryDeadLetterQueue } from "./dead-letter-queue.js";
import { InMemoryJobStore } from "./job-store.js";
import type {
  DeadLetterQueue,
  EnqueueJobInput,
  JobHandler,
  JobQueueMetrics,
  JobRecord,
  JobType,
} from "./types.js";

export interface JobServiceOptions {
  store?: InMemoryJobStore;
  deadLetter?: DeadLetterQueue;
}

/**
 * Platform job framework — queue, delay, retry, cancellation, progress.
 * Handlers register by job type; execution engines are plugged in later.
 */
export class JobService extends InfrastructureServiceBase {
  readonly serviceName = SERVICE_NAMES.JOBS;

  private readonly store: InMemoryJobStore;
  private readonly deadLetter: DeadLetterQueue;
  private readonly handlers = new Map<JobType, JobHandler>();
  private processing = false;

  constructor(options: JobServiceOptions = {}) {
    super();
    this.store = options.store ?? new InMemoryJobStore();
    this.deadLetter = options.deadLetter ?? new InMemoryDeadLetterQueue();
  }

  registerHandler(handler: JobHandler): void {
    this.handlers.set(handler.type, handler);
  }

  enqueue(input: EnqueueJobInput): JobRecord {
    const job = this.store.enqueue(input);
    this.emit("job_enqueued", "info", {
      jobId: job.id,
      type: job.type,
      correlationId: job.correlationId,
    });
    return job;
  }

  getJob(id: string): JobRecord | null {
    return this.store.get(id);
  }

  cancel(id: string): JobRecord {
    const job = this.store.get(id);
    if (!job) throw new Error("Job not found");
    if (job.status === "running") {
      throw new Error("Cannot cancel a running job");
    }
    if (job.status === "completed" || job.status === "cancelled") {
      return job;
    }
    job.status = "cancelled";
    job.completedAt = Date.now();
    this.store.update(job);
    this.emit("job_cancelled", "info", { jobId: id, correlationId: job.correlationId });
    return job;
  }

  reportProgress(id: string, progress: number): JobRecord {
    const job = this.store.get(id);
    if (!job) throw new Error("Job not found");
    job.progress = Math.min(
      JOB_CONSTANTS.PROGRESS_MAX,
      Math.max(JOB_CONSTANTS.PROGRESS_MIN, progress),
    );
    this.store.update(job);
    return job;
  }

  async processNext(now = Date.now()): Promise<JobRecord | null> {
    const ready = this.store.listReady(now);
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
      this.store.update(job);
      return job;
    }

    this.processing = true;
    job.status = "running";
    job.startedAt = Date.now();
    job.attempts += 1;
    this.store.update(job);

    try {
      await handler.handle(job, (progress) => {
        job.progress = progress;
        this.store.update(job);
      });
      job.status = "completed";
      job.progress = JOB_CONSTANTS.PROGRESS_MAX;
      job.completedAt = Date.now();
      job.error = null;
      this.store.update(job);
      this.emit("job_completed", "info", { jobId: job.id, correlationId: job.correlationId });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Job failed";
      job.error = message;
      if (job.attempts >= job.maxAttempts) {
        job.status = "dead_letter";
        job.completedAt = Date.now();
        this.deadLetter.push(job);
        this.emit("job_dead_letter", "error", {
          jobId: job.id,
          correlationId: job.correlationId,
          error: message,
        });
      } else {
        job.status = "delayed";
        job.scheduledAt = Date.now() + JOB_CONSTANTS.DEFAULT_RETRY_DELAY_MS * job.attempts;
        this.emit("job_retry_scheduled", "warn", {
          jobId: job.id,
          attempt: job.attempts,
          correlationId: job.correlationId,
        });
      }
      this.store.update(job);
    } finally {
      this.processing = false;
    }

    return job;
  }

  getMetrics(): JobQueueMetrics {
    return this.store.metrics(this.deadLetter.size());
  }

  listDeadLetter(limit?: number): JobRecord[] {
    return this.deadLetter.list(limit);
  }

  override async healthCheck() {
    const base = await super.healthCheck();
    const metrics = this.getMetrics();
    return {
      ...base,
      details: `queued=${metrics.queued} running=${metrics.running} dlq=${metrics.deadLetter}`,
    };
  }
}
