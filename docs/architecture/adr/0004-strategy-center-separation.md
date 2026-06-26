# ADR-0004: Strategy Center Separation

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Command Center delivers synthesized operational intelligence for daily decisions. Strategic users need depth beyond summary cards — initiative tracking, opportunity analysis, prediction monitoring, and long-horizon planning. Collapsing strategic depth into Command Center would overload the home cockpit or hide strategic capability.

---

## Decision

**Strategy Center is a separate primary navigation module** (#5) for strategic depth beyond Command Center summary cards.

- Command Center surfaces strategic **signals and cards** — Strategy Center provides **depth, tracking, and planning**  
- Same D7 user decision path applies in both modules (PDD-II)  
- Strategic intelligence systems (Strategic, Prediction) surface outcomes here — not as nav labels  
- Strategy Center ≠ duplicate Command Center — complementary scopes  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **All strategy in Command Center drill-downs** | Overloads home; fails strategic user persona |
| **Strategy as Settings subsection** | Hides primary product value for strategic users |
| **"Planning" or "Goals" as nav label** | Subsumed under Strategy Center naming in UXMD-I |
| **Separate Prediction nav item** | Exposes internal intelligence system — AMD IV §71 rejects |

---

## Rationale

UXMD-I nav justification: "Cards insufficient for planning and tracking — strategic users lose depth." PDD-II Part D defines Strategy Center workflows. AMD IV maps Strategic and Prediction intelligence to Strategy Center consumption — not navigation labels.

---

## Consequences

### Positive

- Progressive disclosure — casual users stay in Command Center  
- Power users get dedicated strategic workspace  
- Clear module bounded context in SDD-I (`strategy`)  

### Negative / Trade-offs

- Some intelligence appears in both modules at different depth — requires consistent data lineage  
- Screen inventory includes STR-* family (UXMD-II)  

### Neutral

- Cross-linking from Command Center cards to Strategy Center detail is expected UX pattern  

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Strategy Center unused in analytics | UX research — do not remove without ADR |
| Merge proposal with Command Center | Class A change — rejected unless mission change |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| PDD-II | Part D — Module 3 Strategy Center |
| UXMD-I | Nav item 5; rejected nav labels |
| UXMD-II | STR-* screens |
| AMD IV | Strategic Intelligence; §71 surface mapping |
| ADR-0002 | Command Center as home |
| ADR-0005 | Seven-item navigation |
