import type { MiddlewareHandler } from "hono";
import { recordSecurityEvent } from "../infrastructure/security-events.js";

/** Records security counters from HTTP status codes on API routes. */
export const securityAuditMiddleware: MiddlewareHandler = async (c, next) => {
  await next();
  const status = c.res.status;
  if (status === 401) recordSecurityEvent("authFailures");
  if (status === 403) recordSecurityEvent("forbidden");
};
