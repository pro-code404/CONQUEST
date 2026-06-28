# SEV-2 — Auth Outage or Runaway Execution

**Severity:** SEV-2 | **RTM:** RTM-INF-006, RTM-INF-014

## Immediate actions

1. Engage `execution` kill switch if runaway automation or execution detected.
2. Engage `automation` kill switch if workflow loop suspected.
3. Scale or restart Auth tier per DR plan (ADR-0021 tier Auth < 15 min RTO).
4. Enable degraded mode messaging (RTM-PDD-002).

## Auth outage

1. Verify database and session store connectivity.
2. Check JWT signing key rotation status (INF-11).
3. Fail closed — no anonymous elevation (GIS §2.5).

## Runaway execution

1. Halt execution workers via kill switch.
2. Audit in-flight jobs by `correlation_id`.
3. Rollback automation per PDD if applicable.

## Recovery

1. Release kill switches after stable metrics.
2. Post-incident review within 5 business days.
