export interface StructuredApiError {
  error: string;
  reason?: string;
  correlationId?: string;
  requestId?: string;
}

export function toStructuredError(
  error: string,
  options?: { reason?: string; correlationId?: string; requestId?: string },
): StructuredApiError {
  return {
    error,
    ...(options?.reason ? { reason: options.reason } : {}),
    ...(options?.correlationId ? { correlationId: options.correlationId } : {}),
    ...(options?.requestId ? { requestId: options.requestId } : {}),
  };
}
