# ADR-0028: Agent Isolation

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends (agents) |

---

## Context

AMD IV defines many specialist agents. Without isolation rules, agents could exceed intelligence authority, call providers directly, or write memory.

---

## Decision

**Each agent operates within exactly one primary intelligence authority** unless Orchestration assigns documented multi-authority specialist scope.

- Agent registry enforces allowed inputs/outputs per authority  
- Agents **cannot**: call AI providers directly, write memory, execute externally, release to users, bypass Coordinator  
- Execution agents live in Execution Layer — not Cognitive  
- Memory Manager is governance service — not autonomous agent  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| General-purpose super-agent | Unbounded blast radius |
| Per-module agents with direct UI | Exposes machinery |
| Shared agent runtime without registry | No scope enforcement |

---

## Rationale

AMD IV §70. AI-6, AI-11. ADR-0014 module boundaries.

---

## Consequences

### Positive

- Testable agent contracts  
- Security review per agent type |

### Negative / Trade-offs

- More agent types to operate |

### Neutral

- Specialist agents optional per routing profile |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| New specialist domain | Registry entry + scope ADR if cross-authority |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-IV Part 4 | Agent catalog |
| AMD IV §70 | Binding |
| AI-6, AI-24 | Laws |
