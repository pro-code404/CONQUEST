import type { MiddlewareHandler } from "hono";
import { API_CONSTANTS } from "@conquest/config";
import type { OperationalMetricsCollector } from "@conquest/performance";

export interface RateLimitEvent {
  timestamp: string;
  clientKey: string;
  blocked: boolean;
}

interface WindowState {
  count: number;
  resetAt: number;
}

const windows = new Map<string, WindowState>();
const MAX_EVENTS = 200;

function clientKey(c: { req: { header: (name: string) => string | undefined } }): string {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
    c.req.header("x-real-ip") ??
    "anonymous"
  );
}

export function createRateLimitMiddleware(
  metrics: OperationalMetricsCollector,
  events: RateLimitEvent[],
): MiddlewareHandler {
  const record = (event: RateLimitEvent) => {
    events.push(event);
    if (events.length > MAX_EVENTS) events.shift();
  };

  return async (c, next) => {
    if (process.env.NODE_ENV === "test" || process.env.VITEST === "true") {
      await next();
      return;
    }
    const key = clientKey(c);
    const now = Date.now();
    const windowMs = API_CONSTANTS.RATE_LIMIT_WINDOW_MS;
    const max = API_CONSTANTS.RATE_LIMIT_MAX_REQUESTS;
    const state = windows.get(key) ?? { count: 0, resetAt: now + windowMs };
    if (now > state.resetAt) {
      state.count = 0;
      state.resetAt = now + windowMs;
    }
    state.count += 1;
    windows.set(key, state);

    c.header("X-RateLimit-Limit", String(max));
    c.header("X-RateLimit-Window-Ms", String(windowMs));
    c.header("X-RateLimit-Remaining", String(Math.max(0, max - state.count)));

    if (state.count > max) {
      metrics.recordRateLimitBlocked();
      record({ timestamp: new Date().toISOString(), clientKey: key, blocked: true });
      return c.json({ error: "Too many requests", reason: "rate_limit_exceeded" }, 429);
    }

    metrics.recordRateLimitAllowed();
    record({ timestamp: new Date().toISOString(), clientKey: key, blocked: false });
    await next();
  };
}
