# ADR-0016: Tenant Isolation Strategy

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends freeze (infrastructure) |

---

## Context

Conquest is multi-tenant enterprise software. Organizations must never read, write, or observe another organization's data, events, logs, or secrets. Workspace provides secondary scope within org. SDD-I establishes `org_id` as non-negotiable isolation key.

---

## Decision

**Organization (`org_id`) is the hard tenant boundary** enforced at every persistence, messaging, logging, and secret layer.

- Workspace (`workspace_id`) scopes intelligence within org — not a tenant replacement  
- Cross-org queries, events (EP-6), and storage paths are **architecturally prohibited**  
- Gateway injects validated `org_id` from session — never from client body alone  
- Backups, restores, and DR are org-partitioned  
- Optional future: org cells for blast-radius reduction — still org-scoped  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Workspace as tenant** | Breaks org-level admin, billing, SSO |
| **Schema-per-tenant only** | Insufficient without application guards |
| **Shared tables with optional filter** | Error-prone — requires defense in depth anyway |
| **Row-level security only** | Good layer — not sole control |

---

## Rationale

EL-8 Organization isolation. RTM-INF-001. Enterprise requirement. Workspace context (ADR-0003) complements — does not replace org boundary.

---

## Consequences

### Positive

- Clear penetration test scope  
- Predictable data residency partitioning  
- Event bus safety  

### Negative / Trade-offs

- Every query carries org_id — engineering discipline  
- Cross-org analytics only in anonymized platform ops tier  

### Neutral

- Physical co-tenancy acceptable with logical isolation |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Regulated data residency per org | ADR for region pinning |
| Cell-based sharding | ADR-0016 amendment |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-III Part 3 | Full specification |
| SDD-I EL-8, EP-6 | Source laws |
| INF-1, INF-18 | Engineering laws |
| RTM-INF-001, RTM-ENG-002 | Traceability |
| ADR-0003 | Workspace scope |
