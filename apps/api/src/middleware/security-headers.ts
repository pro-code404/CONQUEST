import type { MiddlewareHandler } from "hono";

export function securityHeadersMiddleware(isProduction: boolean): MiddlewareHandler {
  return async (c, next) => {
    c.header("X-Content-Type-Options", "nosniff");
    c.header("X-Frame-Options", "DENY");
    c.header("Referrer-Policy", "strict-origin-when-cross-origin");
    c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (isProduction) {
      c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    await next();
  };
}
