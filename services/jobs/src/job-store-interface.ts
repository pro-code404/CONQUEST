import type { EnqueueJobInput, JobQueueMetrics, JobRecord } from "./types.js";

/** Persistence abstraction for job records — memory or Redis. */
export interface JobStore {
  enqueue(input: EnqueueJobInput): Promise<JobRecord>;
  get(id: string): Promise<JobRecord | null>;
  update(job: JobRecord): Promise<void>;
  listReady(now?: number): Promise<JobRecord[]>;
  listByStatus(status: JobRecord["status"]): Promise<JobRecord[]>;
  metrics(deadLetterSize: number): Promise<JobQueueMetrics>;
}
