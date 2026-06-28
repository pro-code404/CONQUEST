import { PERFORMANCE_CONSTANTS } from "@conquest/config";

export interface RequestTimingResult<T> {
  result: T;
  durationMs: number;
}

/** Measure async operation duration and flag slow operations. */
export async function withRequestTiming<T>(
  label: string,
  fn: () => Promise<T>,
  options?: {
    correlationId?: string;
    onSlow?: (record: { label: string; durationMs: number; correlationId?: string }) => void;
  },
): Promise<RequestTimingResult<T>> {
  const start = Date.now();
  const result = await fn();
  const durationMs = Date.now() - start;
  if (durationMs >= PERFORMANCE_CONSTANTS.SLOW_QUERY_THRESHOLD_MS) {
    const record: { label: string; durationMs: number; correlationId?: string } = {
      label,
      durationMs,
    };
    if (options?.correlationId !== undefined) {
      record.correlationId = options.correlationId;
    }
    options?.onSlow?.(record);
  }
  return { result, durationMs };
}

export function timingHeader(durationMs: number): Record<string, string> {
  return { [PERFORMANCE_CONSTANTS.REQUEST_TIMING_HEADER]: String(durationMs) };
}
