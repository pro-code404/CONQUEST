# ADR-0012: GIS Inheritance

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

UXMD Volume II defines 102 screens. Duplicating loading, empty, error, permission, accessibility, and mobile standards in every screen spec would create inconsistency and review burden. SDD Presentation Layer must implement one coherent interaction contract.

---

## Decision

**UXMD Volume III (GIS) standards are inherited by all UXMD-II screens unless an explicit GIS Override is declared.**

**GIS governs:**

- Global states: `S-LOAD`, `S-EMPTY`, `S-SUCCESS`, `S-ERROR`, `S-RECOVER`, `S-OFFLINE`  
- Role hierarchy: Owner > Admin > Manager > Member > Viewer  
- Module permission defaults and route guards  
- Accessibility (WCAG 2.2 AA binding)  
- Mobile interaction minimums  
- Destructive action confirmations  

**Rules:**

- Screen specs declare **screen-specific behavior + overrides only**  
- Override syntax: `GIS Override: [standard] — [reason]`  
- SDD-I Presentation Layer **implements GIS** — engineered, not post-hoc  
- Fail closed on authority — permission denied, no partial leak (GIS §2.5)  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Per-screen duplicate standards** | 102× duplication; drift guaranteed |
| **GIS as optional guidelines** | Unenforceable; SDD cannot bind |
| **SDD defines UX standards** | Wrong layer — UXMD owns experience standards |
| **Component library as standards** | Implementation — GIS precedes components |

---

## Rationale

UXMD-III inheritance rule. UXMD final review Category 10 Pass. SDD-I §1.15 accessibility bound to GIS Part 3. SDD-II permission propagation references GIS.

---

## Consequences

### Positive

- Single amendment updates all screens  
- SDD III security aligns with GIS permission matrix  
- Build gate: a11y verification per GIS (SDD V)  

### Negative / Trade-offs

- Override discipline required — abuse creates exceptions debt  
- GIS amendments are Class A if changing frozen behavior  

### Neutral

- Design tokens in `docs/archive/design-pre-uxmd/` are non-authoritative — UXMD-III GIS prevails |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| New global state needed | GIS v1.1 + UXMD-II inheritance note |
| WCAG 2.2 → 3.0 | GIS amendment + SDD V gate update |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| UXMD-III | Full volume |
| UXMD-II | Inheritance header; 102 screens |
| SDD-I | GIS binding; Presentation Layer |
| SDD-II | Part 23 permission propagation |
| UXMD Final Review | Category 10 |
