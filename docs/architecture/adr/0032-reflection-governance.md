# ADR-0032: Reflection Governance

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends (learning path) |

---

## Context

Reflection analyzes outcomes and could incorrectly trigger immediate memory updates or execution changes. REF artifacts must feed governed learning — not direct action.

---

## Decision

**Reflection Agent produces REF only.** REF feeds Learning and Optimization proposals — never direct release or execution.

- Insufficient outcome data → defer learning — no speculative apply  
- REF required for outcome-based LRN on major cycles  
- Reflection does not alter VRF outcomes retroactively  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Auto-apply reflection insights | Bypasses Learning Boundary |
| Skip reflection on success | Loses learning signal |
| Reflection triggers re-release | Violates immutability |

---

## Rationale

SDD-II §5.11. ADR-0009. Learning Boundary separation.

---

## Consequences

### Positive

- Clear attribution before memory change  
- Prevents knee-jerk model routing swings |

### Negative / Trade-offs

- Delayed learning apply until validation |

### Neutral

- Lightweight reflection on minor cycles optional |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Real-time reflection demand | Stakes-class policy only |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-IV Part 2 §2.2.12, Part 10 | Reflection |
| ADR-0009 | Learning Boundary |
| AI-10 | Law |
