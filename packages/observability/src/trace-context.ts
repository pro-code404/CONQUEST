import { AsyncLocalStorage } from "node:async_hooks";

export interface TraceContext {
  traceId: string;
  correlationId: string;
  requestId: string;
}

const storage = new AsyncLocalStorage<TraceContext>();

export function runWithTraceContext<T>(context: TraceContext, fn: () => T): T {
  return storage.run(context, fn);
}

export function getTraceContext(): TraceContext | undefined {
  return storage.getStore();
}

export function requireTraceContext(): TraceContext {
  const ctx = storage.getStore();
  if (!ctx) {
    throw new Error("Trace context required — correlation_id propagation (INF-12)");
  }
  return ctx;
}
