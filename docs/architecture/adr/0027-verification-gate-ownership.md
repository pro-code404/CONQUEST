# ADR-0027: Verification Gate Ownership

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends (orchestration) |

---

## Context

Multiple subsystems touch release timing: Orchestration, Experience, Execution, Reports. Without sole VRF ownership, gates could be bypassed inconsistently.

---

## Decision

**Verification Intelligence / Verification Agent is the sole authority** to issue release-gating VRF artifacts.

- Orchestration **enforces** VRF — does not issue VRF  
- No other agent or layer may mark `release_authorized`  
- VRF must pass before: Decide (inputs validated), Recommend surfacing, Report seal, Execution authorization (major class)  
- Verify stage occurs **before** Decide per ADR-0007  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Orchestration self-verifies | Violates layer boundary |
| Application releases on timeout | False confidence |
| Provider self-certifies output | Untrusted |

---

## Rationale

ADR-0006. IL-1. AMD IV Verification Intelligence. INF-4 infrastructure enforcement.

---

## Consequences

### Positive

- Single audit point for release decisions  
- Clear penetration test target |

### Negative / Trade-offs

- Verification Agent availability on critical path |

### Neutral

- Stakes-compressed minor class may use lighter VRF profile — documented in routing profile |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| New release surface (e.g., API) | Extend gate checklist |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-IV Part 9 | Full spec |
| ADR-0006 | Verify before release |
| AI-4, AI-5, AI-20 | Laws |
