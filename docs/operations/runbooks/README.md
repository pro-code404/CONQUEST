# Incident Response Runbooks

| Field | Value |
|-------|-------|
| **Gate** | B-18 — Incident runbooks drafted |
| **Law** | INF-24 |
| **Authority** | ADR-0024 |
| **RTM** | RTM-INF-013 |
| **Date** | 2026-06-26 |

## Index

| Severity | Runbook | Trigger |
|----------|---------|---------|
| SEV-1 | [sev-1-cross-tenant-exposure.md](sev-1-cross-tenant-exposure.md) | Suspected cross-tenant data access |
| SEV-2 | [sev-2-auth-outage-runaway.md](sev-2-auth-outage-runaway.md) | Auth outage, runaway execution |
| SEV-3 | [sev-3-provider-degradation.md](sev-3-provider-degradation.md) | AI provider degradation |
| SEV-4 | [sev-4-non-critical-defect.md](sev-4-non-critical-defect.md) | Non-critical defect |

## Kill switches (INF-22)

| Switch | Env variable | Registry API |
|--------|--------------|--------------|
| Execution | `CONQUEST_KILL_EXECUTION=1` | `KillSwitchRegistry` |
| Intelligence release | `CONQUEST_KILL_INTELLIGENCE_RELEASE=1` | `KillSwitchRegistry` |
| Emergency lock | `CONQUEST_KILL_EMERGENCY_LOCK=1` | `KillSwitchRegistry` |
| Automation | `CONQUEST_KILL_AUTOMATION=1` | `KillSwitchRegistry` |

Implementation: `packages/config/src/kill-switch.ts`

## Tabletop requirement

Quarterly tabletop per ADR-0024. First scheduled before production deploy.

---

*Runbook index for B-18.*
