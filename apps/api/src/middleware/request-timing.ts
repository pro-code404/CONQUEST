import type { MiddlewareHandler } from "hono";
import { PERFORMANCE_CONSTANTS } from "@conquest/config";

/** Records request duration on every API response. */
export const requestTimingMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  await next();
  const durationMs = Date.now() - start;
  c.header(PERFORMANCE_CONSTANTS.REQUEST_TIMING_HEADER, String(durationMs));
};
