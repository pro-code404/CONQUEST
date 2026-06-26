# ADR-0003: Workspace as Context

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Conquest serves organizations with multiple business contexts (brands, divisions, clients). Intelligence, memory, automation, and reports must be scoped. Exposing Workspace as a parallel product module in primary navigation would fragment the intelligence experience and duplicate Settings paths.

---

## Decision

**Workspace is scoped operating context — not a primary navigation destination.**

- Workspace selector appears in the **utility bar** — always visible  
- `workspace_id` scopes intelligence, memory, automation, reports, and goals (SDD-I)  
- Workspace configuration lives in Workspace settings (reachable from Settings and contextual actions)  
- Workspace is a **product module** (`workspace`) for engineering bounded context — not nav item #8  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Workspace as 8th nav item** | Violates NAV-1 maximum 7 items; treats context as destination |
| **Org-only scoping (no workspace)** | Insufficient for multi-brand operators |
| **Workspace per browser tab only** | No persistent team-scoped intelligence boundary |
| **Implicit workspace (single hidden)** | Blocks multi-workspace customers |

---

## Rationale

PDD-II Part C: "Workspace is not a parallel product." UXMD-I NAV table lists Workspace under utility bar. MSD-13 freezes nav at 7. Engineering requires hard `workspace_id` boundary for tenant data isolation and projection caching (SDD-II Part 19).

---

## Consequences

### Positive

- Clean nav — users navigate outcomes, not context machinery  
- Clear engineering scope key for all subsystems  
- Workspace switch invalidates projections predictably  

### Negative / Trade-offs

- Workspace switch mid-intelligence-cycle requires graceful handling (SDD-I failure modes)  
- Users must understand scoping — onboarding explains workspace concept  

### Neutral

- Organization-level policy can span workspaces via Settings  

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Enterprise multi-workspace UX research | UXMD amendment only — nav rule unchanged unless ADR supersedes |
| Federated cross-workspace intelligence | New ADR — must not break scope isolation without explicit governance |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| PDD-II | Part C — Module 2 Workspace |
| UXMD-I | Navigation — utility bar |
| SDD-I | Workspace scope; switching |
| SDD-II | Projection cache invalidation on workspace switch |
| GIS | WKS-* screens; dormant workspace empty state |
| ADR-0005 | Seven-item navigation |
