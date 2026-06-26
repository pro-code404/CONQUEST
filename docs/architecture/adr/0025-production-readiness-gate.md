# ADR-0025: Production Readiness Gate

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends freeze (infrastructure) |

---

## Context

SDD-I states production readiness is an engineering gate, not a checkbox. Build authorization does not yet exist. Before any production tenant traffic, infrastructure and security controls must be verified against frozen architecture, RTM, and INF laws.

---

## Decision

**INF-25 Production Readiness Gate** blocks production deploy until checklist passes.

Minimum gate items:

1. RTM Part F rows at Specified minimum — INF requirements implemented  
2. INF-1–INF-25 enforcement verified  
3. DR restore drill completed (INF-20)  
4. Incident runbooks published (INF-24)  
5. Kill switches tested (INF-22)  
6. RBAC matrix matches GIS §2 (INF-3)  
7. Tenant isolation penetration test passed (INF-1)  
8. Observability dashboards and alerts live (INF-12, ADR-0023)  
9. SDD V CI pipeline attached — future  
10. Explicit build authorization issued — future  

No production deploy on Fridays without on-call (SDD-III §13.9).

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Deploy first, harden later** | Enterprise unacceptable |
| **Manual CEO approval only** | Not repeatable |
| **Identical gate for preview and prod** | Preview may relax DR — prod cannot |

---

## Rationale

SDD-I §1.16 production readiness. Architecture Freeze §6.4 Build criteria. Closes gap between architecture and implementation.

---

## Consequences

### Positive

- Single go/no-go artifact  
- Sales and compliance confidence  

### Negative / Trade-offs

- Slower first production deploy  
- Gate maintenance in SDD V |

### Neutral

- Automated vs manual checklist items — SDD V detail |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| First production deploy | Retrospective on gate items |
| New INF law | Add gate item |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-III Part 13, INF-25 | Specification |
| SDD-I §1.16 | Source philosophy |
| Architecture Freeze §6.4 | Build criteria |
| RTM-INF-010 | Traceability |
| ADR-0021, 0024 | DR and IR prerequisites |
