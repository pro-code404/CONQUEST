# SEV-1 — Suspected Cross-Tenant Exposure

**Severity:** SEV-1 | **RTM:** RTM-INF-001, RTM-INF-013 | **ADR:** 0024

## Immediate actions (0–15 min)

1. Engage `emergency_lock` kill switch (`CONQUEST_KILL_EMERGENCY_LOCK=1`).
2. Engage `intelligence_release` kill switch.
3. Initiate mass session revocation (Auth service).
4. Notify program architecture authority and security lead.
5. Preserve audit logs — do not delete.

## Investigation (15–60 min)

1. Identify affected org IDs and time window.
2. Run tenant isolation audit (TI-12, TI-13 from test plan).
3. Determine data classes exposed.
4. Open ADR exception only if architecture defect confirmed.

## Communication

- Customer notification per contract if exposure confirmed.
- Regulatory notification per jurisdiction requirements.

## Recovery

1. Root cause fix through normal change control (ADR if architectural).
2. Release kill switches after verification.
3. Post-incident review within 48h — feeds learning proposals only (CCIS L3).

## Verification drill

Tabletop quarterly. Kill switch drill uses `KillSwitchRegistry.engage()` in staging.
