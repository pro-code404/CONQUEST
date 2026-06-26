# ADR-0033: Learning Proposal Governance

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends (learning) |

---

## Context

Learning agents could propose changes that weaken verification, mutate routing to skip stages, or apply without sample validation.

---

## Decision

**All learning applies through Learning Boundary validation.**

| Rule | Enforcement |
|------|-------------|
| LRN/OPT proposals only — no direct apply | Learning Boundary |
| Sample threshold + holdout required | Validation gate |
| Critical domain → human approval | GIS escalation |
| Proposals cannot weaken VRF thresholds | Reject rule |
| No production code mutation | BH-6 |
| Rollback via Memory versioning | Manager |

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Online learning without gate | Unsafe drift |
| User-blind auto-apply | Trust erosion |
| Learning triggers execution | ADR-0009 violation |

---

## Rationale

ADR-0009. CCIS L1–L4. SDD-IV Part 10. AI-10.

---

## Consequences

### Positive

- Safe continuous improvement  
- Auditable what changed and why |

### Negative / Trade-offs

- Slower improvement velocity |

### Neutral

- OPT routing changes versioned — not code deploy |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Federated learning across orgs | New ADR — privacy review |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-IV Part 10 | Learning architecture |
| SDD-I §3.13 | Learning Boundary |
| AI-10 | Law |
