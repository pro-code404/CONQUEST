/** ADR-0017 session timing — single source for auth service and API cookie TTL. */
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
export const SLIDING_REFRESH_MS = 60 * 60 * 1000;
export const SESSION_COOKIE_NAME = "conquest_session";

export function sessionCookieMaxAgeSec(): number {
  return Math.floor(SESSION_TTL_MS / 1000);
}
