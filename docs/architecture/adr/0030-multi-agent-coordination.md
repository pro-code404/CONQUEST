# ADR-0030: Multi-Agent Coordination

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends (orchestration) |

---

## Context

Multi-agent systems often use peer-to-peer messaging, creating emergent behavior and audit gaps. Conquest requires deterministic, auditable cycles.

---

## Decision

**System Coordinator mediates all inter-agent communication.**

- Structured intelligence packets only — required fields per SDD-IV Part 5  
- **No conversational agent mesh** — no peer routing  
- Parallel work: Coordinator fan-out / merge  
- State transfer by artifact reference on bus  
- Conflicts between specialists escalated to Coordinator — not averaged silently (CCIS A2)  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Agent peer discovery | Emergent routing; audit loss |
| Shared blackboard without coordinator | Ownership ambiguity |
| Single monolithic agent | No specialization scale |

---

## Rationale

AMD IV §70 agent communication. AI-7, AI-8, AI-17. SDD-I orchestration mediation mandatory.

---

## Consequences

### Positive

- Reproducible cycle graphs  
- Single correlation_id owner |

### Negative / Trade-offs

- Coordinator scalability — horizontal cycle shards |

### Neutral

- Message bus technology — SDD V |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Coordinator SPOF evidence | Shard by org/cycle partition |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-IV Part 3, 5 | Coordinator + contracts |
| AMD IV §70 | Packets |
| AI-7, AI-8, AI-17 | Laws |
