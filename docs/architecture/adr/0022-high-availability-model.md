# ADR-0022: High Availability Model

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends freeze (infrastructure) |

---

## Context

Auth and Gateway outages block all users. Intelligence outages should not block read-only access to last verified projections. Provider failures must not cascade across tenants.

---

## Decision

**Tiered availability** with horizontal redundancy for stateless paths.

- Gateway + Auth: N+2 minimum in production — stateless with shared session store  
- Application: horizontal auto-scale — no session affinity required  
- Intelligence + Execution: queue-driven workers — scale on depth  
- Data: replicated primaries — read stale flagged per BH-7  
- Circuit breaker per external provider (INF-17)  
- Intelligence failure → read-only last-verified projections; auth remains up  
- Per-org fairness scheduling prevents noisy neighbor on shared workers  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Single instance all tiers** | Unacceptable downtime |
| **Intelligence blocks all reads** | Violates availability philosophy SDD-III §1.1 |
| **Active-active all regions day one** | Cost — phased per ADR-0021 |

---

## Rationale

SDD-I §8.5 fault isolation. INF-17. Correct availability over raw uptime.

---

## Consequences

### Positive

- Graceful degradation story for sales  
- Blast radius containment  

### Negative / Trade-offs

- Stale read complexity in Experience layer  
- Queue backlog monitoring required |

### Neutral

- Auto-scale metrics — implementation |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| SLO miss in production | Tune tier targets |
| Dedicated enterprise cells | HA model extension |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-III Part 11, 12 | DR and performance |
| SDD-I §8.3–8.5 | Topology scaling |
| INF-17, INF-21 | Laws |
| RTM-ENG-009, RTM-INF-008 | Traceability |
| ADR-0021 | DR complement |
