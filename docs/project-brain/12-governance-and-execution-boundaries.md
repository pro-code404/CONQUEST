# 12 — Governance and Execution Boundaries

BAR, B-25–B-28, approval model, human oversight, why execution is disabled.

---

## 1. Build Authorization Record (BAR)

| BAR | Date | Scope |
|-----|------|-------|
| BAR-2026-06-21-001 | Build-0 | Architecture → engineering transition |
| BAR-2026-06-26-001 | Build-1 | Platform foundation, shell, cognitive stack |
| **Build-2 BAR** | **Not issued** | Required for M5 execution |

**No BAR → no execution implementation.**

---

## 2. Open governance gates (B-25–B-28)

| Gate | Requirement |
|------|-------------|
| B-25 | Stage-order golden tests — CCIS loop preserved |
| B-26 | VRF bypass impossible — verification gate tests |
| B-27 | Provider boundary — no client SDK, static analysis |
| B-28 | Learning boundary — no execution from learning path |

Referenced in: `docs/governance/build-authorization-checklist-v1.0.md`, SDD-V.

---

## 3. Approval model

| Stage | Approver |
|-------|----------|
| Architecture change | ADR + governance review |
| Build wave | BAR issuance |
| Recommendation release | Verification engine + user status |
| Workflow execution (future) | User approval + authorization record |
| Learning proposal (future) | Governance review |

---

## 4. Why execution remains disabled

| Reason | Detail |
|--------|--------|
| ADR-0015 | Execution layer separation not complete |
| Safety | No autonomous side effects |
| BAR | M5 not authorized |
| Code | `executionReady: false` in `DecisionEngine` |
| Product | `manualRun` audit-only message |

**Enabling execution without BAR is a constitution violation.**

---

## 5. Human oversight

- Users approve/defer/reject recommendations  
- Automation requires explicit run action  
- Legal acceptance versioned  
- MFA available for sensitive accounts  

---

*Next: [13 — Development history](./13-development-history.md)*
