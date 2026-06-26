# ADR-0006: Verification Before Release

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Conquest's core differentiator is trustworthy intelligence. Releasing unverified conclusions, overstated confidence, or policy-violating recommendations destroys user trust and violates CCIS engineering laws. Historical AMD Volume II §18.0 pipeline ordering placed Verify after Execute in some passages — explicitly reconciled in favor of CCIS.

---

## Decision

**No major intelligence conclusion reaches users without passing the Verification gate (VRF).**

- Verification tests evidentiary sufficiency, logical validity, policy compliance, and confidence calibration — distinct from Challenge (which tests plausibility)  
- VRF failure **blocks release** to Experience layer (IL-1)  
- VRF failure reroutes upstream with specific failure reasons — never silent skip  
- Execution authorization requires VRF pass for major releases  
- Report snapshot sealing requires VRF pass (SDD-II §5.14)  

**Stage order (see ADR-0007):** Verify occurs **before** Decide and **before** Recommend in the CCIS loop. IL-1 enforces gate at release boundary regardless of internal artifact sequencing.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Verify after Execute** | AMD II §18.0 — subordinate and invalid per AMD IV §960 |
| **Challenge replaces Verify** | Different purposes — Challenge is adversarial; Verify is standards gate |
| **User self-verifies (no system gate)** | Violates BH-5; unacceptable for enterprise |
| **Verify only for high-stakes** | Stakes compress cycle — VRF never silently skipped for major release |

---

## Rationale

CCIS §II.6 Verify; BH-5 Product Behavior Law. AMD IV Verification Intelligence. SDD-II IL-1 with enforcement at Orchestration blocking Experience release. Program Consistency Gate identified SDD-II §5.6–5.8 ordering errata — intent remains verify-before-release.

---

## Consequences

### Positive

- Enterprise auditability — VRF in artifact chain  
- Consistent trust model across modules  
- Clear reroute rules on failure  

### Negative / Trade-offs

- Latency for full verification on complex cycles  
- Engineering complexity for stakes-compressed paths (SDD IV)  

### Neutral

- Low-risk routing may compress stages — documented rules required; no silent skip |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Verification bottleneck in production | Optimize engines — do not remove gate |
| SDD-II v1.2 errata | Align §5.6–5.8 with ADR-0007 order |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| CCIS | §II.6 Verify; Engineering Laws |
| AMD IV | Verification Intelligence; §960 reconciliation |
| PDD-I | BH-5 |
| SDD-II | §5.6, IL-1, Part 5 |
| ADR-0007 | Lifecycle stage order |
