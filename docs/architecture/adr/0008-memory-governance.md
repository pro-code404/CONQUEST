# ADR-0008: Memory Governance

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Conquest accumulates intelligence across sessions, projects, and organizations. Ungoverned memory writes create inconsistent conclusions, security leaks, and irreversible corruption. Multiple intelligence engines produce memory candidates — a single authority must govern persistence.

---

## Decision

**All memory writes occur exclusively through the Memory Manager** — no engine, module, or agent writes memory stores directly.

- Memory belongs to **AMD Layer 5 — Memory Layer**  
- Memory categories per AMD III: User, Session, Project, Organization, Knowledge, Evidence, Success, Failure, Correction, Workflow + Business Memory Graph  
- Universal memory attributes, lifecycle (Proposed → Active → Expired → Archived → Deleted), confidence, versioning, and governance per AMD III  
- Intelligence artifacts inherit **Universal Artifact Contract (UAC)** in SDD-II — lineage to sources required  
- IL-2: Memory Manager sole write — enforced at Data layer  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Per-engine memory stores** | Inconsistent retrieval; no unified governance |
| **Application-layer memory cache as authority** | Cache is not source of truth |
| **Client-side memory persistence** | Security and consistency failure |
| **Direct graph writes from Reasoning** | Bypasses validation and audit |

---

## Rationale

AMD III §41 governed retrieval; §43 governance. SDD-II IL-2, IL-3, IL-10. CCIS §VIII Memory philosophy. Learning proposals route through Learning Boundary → Memory Manager — never direct engine writes.

---

## Consequences

### Positive

- Auditable memory lineage  
- Conflict resolution and confidence scoring centralized  
- Enterprise retention and deletion policies enforceable  

### Negative / Trade-offs

- Memory Manager is critical path — must scale (SDD III)  
- Latency on promotion workflows  

### Neutral

- Retrieval caches (15m) allowed — writes still governed |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| New memory category | AMD III amendment + ADR if architectural |
| PDD-I v2.1 memory type behavioral specs | PDD elaboration — does not change write authority |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| CCIS | §VIII Memory |
| AMD III | Full volume |
| SDD-II | IL-2, IL-3, UAC, Part 8 |
| SDD-I | Data Layer §3.8 |
| ADR-0009 | Learning Boundary |
