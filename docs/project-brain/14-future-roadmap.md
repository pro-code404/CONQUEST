# 14 — Future Roadmap

Remaining work grouped by milestone, dependencies, risks, prerequisites.

---

## 1. Immediate gate (before M5)

| Item | Prerequisite | Risk if skipped |
|------|--------------|-----------------|
| Recovery Phase 4 merge | Ch 18 + continuity test | Architectural drift |
| Preview operational | Router fix + e2e smoke | Cannot validate UX |
| Stakeholder sign-off | Phase 3 validation | Unauthorized scope |

---

## 2. Build-2 M5 — Execution boundary (gated)

| Slice | Deliverable | Depends on |
|-------|-------------|------------|
| 5A | Execution engine service | Build-2 BAR |
| 5B | Approve → execute workflow | B-25–B-28 closed |
| 5C | `executionReady` flag governance | ADR-0015 |
| 5D | RTM verification tests | Contract test suite |

**Acceptance:** Manual run performs real action with audit + rollback path designed.

---

## 3. Post-beta product

| Item | Milestone | Dependency |
|------|-----------|------------|
| Legal counsel review | P0 | External |
| Postgres RLS | P1 | DBA review |
| Real AI SDK adapters | P1 | Gateway |
| Analytics visualization | P1 | visualization-config |
| Strategy/Knowledge/Marketplace | P2 | PDD modules |
| Privacy export/delete jobs | P2 | Job workers |
| Billing OAuth | P2 | Integrations |
| Distributed tracing | P2 | Observability sink |
| HA multi-region | P3 | ADR-0022 |

---

## 4. Governance

| Item | Status |
|------|--------|
| Issue Build-2 BAR | Not done |
| Close B-25–B-28 | Open |
| RTM Verified rows | Partial |

---

## 5. Risk register

| Risk | Mitigation |
|------|------------|
| M5 starts without BAR | Constitution + Project Brain gate |
| Category drift to AI wrapper | Chapters 01, 16 |
| Doc drift returns | Recovery phases as process |
| Provider key leakage | Gateway + env only |

---

*Next: [15 — Engineering standards](./15-engineering-standards.md)*
