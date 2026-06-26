# ADR-0020: Infrastructure Trust Boundaries

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends freeze (infrastructure) |

---

## Context

SDD-I defines logical layers with allowed/forbidden communication. SDD-III must map trust zones to network and service boundaries without redefining layer responsibilities.

---

## Decision

**Zero-trust zone model** with explicit allowed communication paths.

| Zone | Trust |
|------|-------|
| Client | Untrusted |
| Edge/DMZ (Gateway) | Validation anchor |
| Application/Orchestration | Authenticated context required |
| Cognitive/Execution | System + delegated scope |
| Data | Memory Manager API only |
| Integration | Scoped credentials |

**Hard prohibitions:**
- Client → Data direct  
- Application → AI provider direct  
- Cognitive → Integration direct  
- Learning → Execution direct  
- Any tier → Memory write bypassing Memory Manager  

Internal calls authenticated — not IP-trust alone.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Flat trusted internal network** | Lateral movement risk |
| **Client direct to Intelligence API** | Bypass Gateway gates |
| **Shared superuser service account** | Audit and blast radius failure |

---

## Rationale

SDD-I layer templates. ADR-0014 module boundaries. ADR-0015 execution separation. INF-2.

---

## Consequences

### Positive

- Clear security review perimeters  
- Penetration test scope  

### Negative / Trade-offs

- mTLS/service identity operational cost |

### Neutral

- Network policy implementation technology — SDD V |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| New tier (e.g., edge functions) | Zone ADR amendment |
| Zero-trust vendor tooling | Implementation only |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-III Part 2, 6 | Topology and network |
| SDD-I §3 layers | Source |
| INF-2, INF-13, INF-16 | Laws |
| RTM-INF-002, 011, 012 | Traceability |
| ADR-0014, 0015 | Boundaries |
