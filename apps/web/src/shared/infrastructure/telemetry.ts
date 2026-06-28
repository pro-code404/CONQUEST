/** Lightweight screen observability hooks (Build-1). */
export function logScreenEvent(screenId: string, event: string, metadata?: Record<string, unknown>): void {
  if (typeof console !== "undefined" && import.meta.env?.DEV) {
    console.info(JSON.stringify({ screenId, event, ...metadata, timestamp: new Date().toISOString() }));
  }
}
