# ADR-0034: AI Failure Recovery

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends (orchestration) |

---

## Context

Intelligence cycles fail from provider outage, timeout, logic cannot-conclude, VRF fail, and agent crash. Recovery must preserve audit chain and user trust (BH-7).

---

## Decision

**Classified failure recovery per stage:**

| Failure class | Recovery |
|---------------|----------|
| Transient provider | Retry once → degrade |
| Logic / evidence gap | Reroute upstream stage once |
| VRF fail | Reroute with reason — no release |
| Agent crash | Resume from last sealed artifact |
| Cancel | Cooperative abort — partial audit retained |
| Execution fail | Rollback if reversible — else alert |

Never: silent retry loop; false success; drop partial artifacts from audit.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Unlimited retries | Cost + infinite loops |
| Discard failed cycles | Audit loss |
| Return best-effort guess | BH-8 violation |

---

## Rationale

SDD-I §5.8. SDD-IV Part 3. ADR-0022 graceful degradation. AI-15 idempotent execution.

---

## Consequences

### Positive

- Predictable ops behavior  
- Supportable cycle states |

### Negative / Trade-offs

- DLQ and checkpoint storage cost |

### Neutral

- User messaging per GIS degraded states |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| New failure mode in production | Runbook + routing update |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-IV Part 3, 11 | Orchestration + execution |
| ADR-0022 | HA model |
| AI-15 | Law |
