/** Security event counters — surfaced via /api/ops/status. */
export const securityEvents = {
  authFailures: 0,
  forbidden: 0,
  tenantViolations: 0,
  validationFailures: 0,
};

export function recordSecurityEvent(
  kind: keyof typeof securityEvents,
): void {
  securityEvents[kind] += 1;
}
