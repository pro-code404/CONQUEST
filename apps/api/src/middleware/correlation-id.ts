import { randomUUID } from "node:crypto";
import type { MiddlewareHandler } from "hono";
import { API_CONSTANTS } from "@conquest/config";

export const correlationIdMiddleware: MiddlewareHandler = async (c, next) => {
  const incoming =
    c.req.header(API_CONSTANTS.CORRELATION_HEADER) ??
    c.req.header(API_CONSTANTS.REQUEST_ID_HEADER) ??
    randomUUID();
  c.set("correlationId", incoming);
  c.header(API_CONSTANTS.CORRELATION_HEADER, incoming);
  c.header(API_CONSTANTS.REQUEST_ID_HEADER, incoming);
  await next();
};

declare module "hono" {
  interface ContextVariableMap {
    correlationId: string;
  }
}
