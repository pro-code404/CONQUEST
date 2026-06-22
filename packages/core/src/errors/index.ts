export enum ConquestErrorCode {
  VALIDATION_FAILED = "VALIDATION_FAILED",
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
  AUTHORIZATION_FAILED = "AUTHORIZATION_FAILED",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  PIPELINE_REROUTE = "PIPELINE_REROUTE",
  VERIFICATION_FAILED = "VERIFICATION_FAILED",
  CONFIDENCE_TOO_LOW = "CONFIDENCE_TOO_LOW",
  EXECUTION_FAILED = "EXECUTION_FAILED",
  RECOVERABLE_FAILURE = "RECOVERABLE_FAILURE",
  CRITICAL_FAILURE = "CRITICAL_FAILURE",
  EXTERNAL_FAILURE = "EXTERNAL_FAILURE",
  TRANSIENT_FAILURE = "TRANSIENT_FAILURE",
}

export enum FailureClass {
  Transient = "transient",
  Recoverable = "recoverable",
  Critical = "critical",
  External = "external",
  Internal = "internal",
}

export class ConquestError extends Error {
  constructor(
    public readonly code: ConquestErrorCode,
    message: string,
    public readonly recoverable: boolean,
    public readonly failureClass: FailureClass = FailureClass.Internal,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ConquestError";
  }
}

export function isRecoverable(error: unknown): boolean {
  return error instanceof ConquestError && error.recoverable;
}
