# ADR-0002: Command Center as Home

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Conquest is positioned as a **Strategic Intelligence Operating System**, not a chatbot, generic AI assistant, passive analytics dashboard, or static reporting tool. Users need a daily operational destination that synthesizes live intelligence into decision-ready awareness.

Early designs used "Dashboard" terminology. AMD Volume IV and UXMD differentiated Command Center as an intelligence cockpit.

---

## Decision

**Command Center is the product home** — always the default landing destination after authentication and onboarding.

- Command Center is an **intelligence cockpit**, not a dashboard  
- **Ask Conquest** is a structured intelligence request surface within Command Center — **not chat**  
- Live intelligence surfaces here; Reports provide immutable snapshots (separate module)  
- Command Center is primary nav item **#1** and cannot be demoted or merged into another module  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Dashboard** (generic analytics home) | Implies passive data display — contradicts decision-superiority mission |
| **Chat / Ask as home** | Reinforces chatbot anti-pattern; exposes machinery |
| **Strategy Center as home** | Too narrow for daily operational awareness; strategic depth is secondary |
| **Intelligence Center** (AMD IV candidate) | Vague; exposes internal systems; superseded by Command Center |

---

## Rationale

UXMD-I UX-12: "Command Center is home — always." PDD-II Module 1 defines Command Center as the daily intelligence cockpit. Every element must improve understanding or decisions — cockpit principle from legacy SDD v2.0, now frozen in UXMD and PDD.

---

## Consequences

### Positive

- Single daily return destination for habit formation  
- Clear live vs archival boundary (Reports separate)  
- Consistent onboarding narrative ("land in Command Center")  

### Negative / Trade-offs

- Command Center widget complexity must be managed (progressive disclosure)  
- Deep intelligence drill-downs route to Strategy Center or screen-level detail — not new nav items  

### Neutral

- Dormant Command Center (empty workspace) is a valid first state with honest empty messaging per GIS  

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| User research shows home destination failure | Amend UXMD-I — requires ADR amendment if nav position changes |
| New primary surface proposed | Class A change — UXMD amendment + freeze update |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| UXMD-I | UX-12; Part D differentiation; §D.5 Ask Conquest |
| PDD-II | Part B — Module 1 Command Center |
| AMD IV | §71 — Command Center as operational workspace |
| UXMD-II | CC-* screen family |
| ADR-0005 | Seven-item navigation |
