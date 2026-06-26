# ADR-0021: Disaster Recovery Strategy

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends freeze (infrastructure) |

---

## Context

Conquest stores governed memory, immutable reports, audit logs, and intelligence artifacts. Data loss or extended outage violates enterprise trust. SDD-I §8.7 defers RTO/RPO to SDD-III.

---

## Decision

**Org-scoped backup and restore** with tier-class RTO/RPO targets.

| Tier | RTO (conceptual) | RPO (conceptual) |
|------|------------------|------------------|
| Auth + Gateway | < 15 min | < 5 min |
| Application read | < 30 min | < 5 min |
| Intelligence async | < 4 hr backlog clear | < 15 min |
| Full data restore | < 24 hr | per store class |
| Audit log | < 15 min | 0 (sync replicate) |

- Backups encrypted (ADR-0018) — tested restore quarterly (INF-20)  
- Event log replay supplements store recovery for intelligence lineage  
- Memory versioning enables logical rollback without full restore  
- Regional failure: active-passive minimum — SDD V selects topology  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Backup without restore testing** | False confidence |
| **Global backup blob** | Cross-tenant restore risk |
| **No event replay** | Artifact chain gaps |
| **Synchronous cross-region every write** | Cost — tiered approach |

---

## Rationale

INF-20, INF-21. RTM-INF-008, 015. BH-7 requires honest degradation — not silent loss.

---

## Consequences

### Positive

- Enterprise SLA credible  
- Drill-driven ops maturity  

### Negative / Trade-offs

- Storage and ops cost  
- Drill time |

### Neutral

- Cloud region strategy — implementation |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| 99.99% SLA customer | RTO/RPO ADR amendment |
| Multi-region active-active | New ADR |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-III Part 11 | Full specification |
| SDD-I §8.7 | Deferral source |
| INF-20, INF-21 | Laws |
| ADR-0016, 0018 | Isolation and encryption |
