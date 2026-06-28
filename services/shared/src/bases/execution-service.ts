import { BaseCognitiveService } from "./cognitive-service.js";

/** Execution-layer services require verification gate clearance (ADR-0015, ADR-0027). */
export abstract class ExecutionServiceBase<TInput = unknown, TOutput = unknown> extends BaseCognitiveService<
  TInput,
  TOutput
> {
  readonly domain = "execution" as const;

  /** When true, orchestrator must not invoke without prior verification approval. */
  protected abstract readonly requiresVerificationGate: boolean;

  protected assertVerificationApproved(approved: boolean): void {
    if (this.requiresVerificationGate && !approved) {
      throw new Error(`${this.name} blocked: verification gate not satisfied`);
    }
  }
}
