# ADR-0029: Memory Read/Write Authority

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen (elaboration) |

---

## Context

All cognitive agents need memory access. Ungoverned reads leak cross-scope data; ungoverned writes corrupt intelligence.

---

## Decision

**Memory Manager is the sole write authority.** All agents read through governed retrieval API.

| Operation | Rule |
|-----------|------|
| **Read** | Scoped query via Manager; role-filtered |
| **Write** | Manager only — from validated LRN or governed promotion |
| **Propose** | Learning Agent → LRN → Learning Boundary → Manager |
| **Forbidden** | Agent direct store access; client memory authority |

Knowledge Agent assists retrieval — does not bypass Manager for writes.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Agent-local caches as truth | Inconsistency |
| Read/write per engine | IL-2 violation |
| User client writes correction | Must route through Application → Manager |

---

## Rationale

ADR-0008. IL-2. AMD III §41, §43. SDD-IV Part 7.

---

## Consequences

### Positive

- Unified audit and conflict resolution  
- Permission propagation single path |

### Negative / Trade-offs

- Manager latency on hot paths — cache read-through allowed |

### Neutral

- Retrieval cache TTL per SDD-II |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| New memory category | AMD III + Manager API extension |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-IV Part 7 | Integration |
| AMD III | Memory architecture |
| AI-9, AI-18 | Laws |
