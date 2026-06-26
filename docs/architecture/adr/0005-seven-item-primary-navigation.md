# ADR-0005: Seven-Item Primary Navigation

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Navigation exposes product structure to users. Exposing internal intelligence systems (Research, Reasoning, Memory, Models) as menu items would make Conquest feel like machinery catalog rather than an Intelligence Command Center. Unlimited nav growth degrades discoverability.

---

## Decision

**Primary navigation is frozen at exactly seven items:**

| # | Item |
|---|------|
| 1 | Command Center |
| 2 | Reports |
| 3 | Automation |
| 4 | Knowledge |
| 5 | Strategy Center |
| 6 | Marketplace |
| 7 | Settings |

**Rules:**

- New primary nav item requires **UXMD amendment** (NAV-5) + **Class A change control** + ADR  
- Intelligence system names **never** appear in navigation (NAV-3)  
- Extensions via Marketplace add capability — **not** nav items (MSD-13, PDD-II)  
- Support, Billing, Profile, Workspace remain **non-nav** utility paths  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Unlimited nav with role-based visibility** | Complexity; still exposes machinery if misconfigured |
| **Intelligence Center as nav item** | AMD IV candidate — rejected as too vague |
| **Separate Dashboard + Command Center** | Duplicate — Command Center only |
| **Models in primary nav** | Infrastructure concern — Settings (admin) |
| **Five-item minimal nav** | Insufficient for Reports, Automation, Knowledge distinct workflows |

---

## Rationale

UXMD final review (91%, APPROVED FOR SDD). PDD-II MSD-13: "Maximum 7 primary nav items — unchanged from PDD interim." AMD IV §71 menu governance rule. Users navigate **decision workspaces**, not cognitive organs.

---

## Consequences

### Positive

- Stable IA for documentation, screens, and engineering module map  
- Forces drill-down over nav expansion (NAV-4)  
- Marketplace extensibility without nav creep  

### Negative / Trade-offs

- Some workflows require deeper routes — 102 screens in UXMD-II  
- AMD IV §71 legacy *Center candidates marked superseded  

### Neutral

- Mobile may collapse nav presentation — items unchanged

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Eighth nav proposal | Class A — requires executive/product architecture review |
| AMD V platform volume | Must align with this list — not redefine |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| UXMD-I | Part C Navigation; NAV-1–NAV-5 |
| PDD-II | Part A; MSD-13 |
| AMD IV | §71 Menu Discovery |
| UXMD Final Review | Category 6 Navigation — Pass |
| ADR-0002, 0003, 0004 | Module placement |
