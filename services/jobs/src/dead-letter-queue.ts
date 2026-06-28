import { JOB_CONSTANTS } from "@conquest/config";
import type { DeadLetterQueue, JobRecord } from "./types.js";

export class InMemoryDeadLetterQueue implements DeadLetterQueue {
  private readonly jobs: JobRecord[] = [];

  push(job: JobRecord): void {
    this.jobs.push({ ...job, status: "dead_letter", completedAt: Date.now() });
    const cutoff = Date.now() - JOB_CONSTANTS.DEAD_LETTER_RETENTION_MS;
    while (this.jobs.length > 0 && (this.jobs[0]?.createdAt ?? 0) < cutoff) {
      this.jobs.shift();
    }
  }

  list(limit = 50): JobRecord[] {
    return this.jobs.slice(-limit);
  }

  size(): number {
    return this.jobs.length;
  }
}
