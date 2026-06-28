import { randomUUID } from "node:crypto";
import type { MiddlewareHandler } from "hono";
import { API_CONSTANTS } from "@conquest/config";
import { runWithTraceContext } from "@conquest/observability";

export const correlationIdMiddleware: MiddlewareHandler = async (c, next) => {
  const correlationId =
    c.req.header(API_CONSTANTS.CORRELATION_HEADER) ??
    c.req.header(API_CONSTANTS.REQUEST_ID_HEADER) ??
    randomUUID();
  const traceId = c.req.header("x-trace-id") ?? correlationId;
  const requestId = randomUUID();
  c.set("correlationId", correlationId);
  c.header(API_CONSTANTS.CORRELATION_HEADER, correlationId);
  c.header(API_CONSTANTS.REQUEST_ID_HEADER, requestId);
  c.header("x-trace-id", traceId);
  await runWithTraceContext({ traceId, correlationId, requestId }, () => next());
};

declare module "hono" {
  interface ContextVariableMap {
    correlationId: string;
  }
}
