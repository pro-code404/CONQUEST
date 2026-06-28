import type { TenantScope } from "@conquest/core";

/** Supported job workloads — execution engines plug in handlers later. */
export const JOB_TYPES = [
  "email",
  "import",
  "export",
  "ai_request",
  "indexing",
  "document_processing",
  "automation_execution",
] as const;

export type JobType = (typeof JOB_TYPES)[number];

export type JobStatus =
  | "queued"
  | "delayed"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "dead_letter";

export interface JobRecord {
  id: string;
  type: JobType;
  payload: Record<string, unknown>;
  status: JobStatus;
  correlationId: string;
  tenant: TenantScope | null;
  progress: number;
  attempts: number;
  maxAttempts: number;
  scheduledAt: number;
  startedAt: number | null;
  completedAt: number | null;
  error: string | null;
  createdAt: number;
}

export interface EnqueueJobInput {
  type: JobType;
  payload: Record<string, unknown>;
  correlationId: string;
  tenant?: TenantScope | null;
  delayMs?: number;
  maxAttempts?: number;
}

export interface JobHandler {
  readonly type: JobType;
  handle(job: JobRecord, reportProgress: (progress: number) => void): Promise<void>;
}

export interface DeadLetterQueue {
  push(job: JobRecord): void;
  list(limit?: number): JobRecord[];
  size(): number;
}

export interface JobQueueMetrics {
  queued: number;
  running: number;
  completed: number;
  failed: number;
  deadLetter: number;
}
