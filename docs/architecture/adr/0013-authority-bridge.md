# ADR-0013: Authority Bridge

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

PDD Volume I v2.0 received **Rejected** status (58%) on architectural review while UXMD Volumes I–III and SDD Volumes I–II proceeded to operationalize user-facing and engineering expression. Without formal reconciliation, dual authority over product behavior would block SDD and create implementation conflicts.

---

## Decision

**The PDD Volume I Authority Bridge is the active reconciliation instrument** for PDD-I conditional authority.

- PDD-I v2.0 retains authority for: workflows (B1–G2), Product Behavior Laws (BH-1–BH-10), intelligence output catalog, behavioral interaction matrix  
- PDD-I **does not block UXMD or SDD** for items resolved in the Bridge gap matrix (screens, GIS, per-screen states/permissions)  
- **Open PDD-I v2.1 items block Build** — not SDD III — for affected subsystems (memory type behavioral specs, CCIS loop PDD workflows, strategic dependencies, unified analysis engine)  
- UXMD is authoritative for user-facing expression of resolved gaps  
- SDD gate rule: SDD proceeds when UXMD approved + Bridge active  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Block all SDD until PDD-I re-approved** | Delays engineering; UXMD fully specifies user-facing gaps |
| **Ignore PDD-I rejection** | Loses behavioral law authority |
| **UXMD supersedes PDD entirely** | Wrong hierarchy — PDD owns behavior, UXMD owns experience |
| **Rewrite PDD-I before any SDD** | Serial bottleneck — Bridge preserves parallel progress |

---

## Rationale

Pragmatic governance without abandoning PDD behavioral laws. UXMD final review 91% APPROVED FOR SDD. Program Consistency Gate accepted Bridge as mitigation. Document hierarchy (ADR-0001) unchanged.

---

## Consequences

### Positive

- SDD III authorized with clear PDD open-item boundary  
- Traceability matrix for each PDD-I gap  
- Build gate explicitly requires PDD-I v2.1  

### Negative / Trade-offs

- Conditional authority requires agent awareness  
- PDD-I v2.1 still required before memory/cognitive build  

### Neutral

- Bridge itself frozen — amendments only via Class A |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| PDD-I v2.1 sealed | Update Bridge — close open items; may deprecate sections |
| New PDD-I rejection | New Bridge or v2.2 track — do not bypass |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| PDD Authority Bridge | Full document |
| PDD-I Review | Rejection record |
| UXMD Final Review | APPROVED FOR SDD |
| Architecture Freeze | §3.3 PDD-I v2.1 track |
| ADR-0001 | Document hierarchy |
