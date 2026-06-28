import type { MiddlewareHandler } from "hono";
import { API_CONSTANTS } from "@conquest/config";

/** Rate-limit scaffold — records window metadata without blocking in Build-1. */
export const rateLimitMiddleware: MiddlewareHandler = async (c, next) => {
  c.header("X-RateLimit-Limit", String(API_CONSTANTS.RATE_LIMIT_MAX_REQUESTS));
  c.header("X-RateLimit-Window-Ms", String(API_CONSTANTS.RATE_LIMIT_WINDOW_MS));
  await next();
};
