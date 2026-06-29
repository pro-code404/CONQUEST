# 00 — Supreme Authority

How Project Brain relates to every other document in the Conquest repository.

---

## The failure Recovery Phase 3 fixes

Recovery Phase 2 synchronized **facts** (test counts, persistence labels, blocker lists). Yet a new AI agent could still read the repository and conclude:

> "Conquest is an AI wrapper — a React app that calls an LLM."

That conclusion is **architecturally wrong** and **product-fatal** if acted upon. It means **intent** was not in the repository — only scattered facts. Recovery Phase 3 exists because **documentation that does not transmit intent has failed**.

Project Brain transmits intent.

---

## Three layers of truth

### Layer 1 — Normative law (frozen)

**Location:** `docs/architecture/`, `docs/pdd/`, `docs/uxmd/`, `docs/sdd/`

**Nature:** Specifications that define what Conquest **must** be. Changes require ADR + governance.

**Supreme for:** Product behavior law, intelligence loop order, UX navigation freeze, security boundaries.

**Examples:**
- CCIS: Conquest is a Strategic Intelligence Operating System
- ADR-0005: Seven-item primary navigation
- ADR-0006: Verification before release
- ADR-0015: Execution layer separation

### Layer 2 — Engineering memory (this corpus)

**Location:** `docs/project-brain/`

**Nature:** Exhaustive explanation of identity, architecture, history, as-built state, misconceptions, and reconstruction procedures.

**Supreme for:** Onboarding, AI agent orientation, preventing category errors ("AI wrapper"), understanding *why* the codebase is shaped as it is.

**Does not:** Override CCIS or ADRs. Explains them and connects them to code.

### Layer 3 — As-built implementation

**Location:** `apps/`, `packages/`, `services/`, `docs/build-2/`

**Nature:** What actually runs, ships, and tests green today.

**Supreme for:** "Does this feature exist?" "What port?" "What table?" "Is execution enabled?"

---

## Authority chain (full)

```
CCIS                    What intelligence IS (supreme intelligence law)
  ↓
AMD I–IV                Architectural expansion, layers, memory, intelligence systems
  ↓
PDD I–II                Product behavior, module specifications, workflows
  ↓
UXMD I–III + GIS        Experience, screens, interaction standards
  ↓
Document X              Operational UX details (subordinate to GIS)
  ↓
SDD I–V                 System design, data, infra, orchestration, engineering standards
  ↓
ADR 0001–0038           Binding architectural decisions
  ↓
RTM                     Requirements traceability
  ↓
Governance + BAR        Build authorization gates
  ↓
Build program           Build-0, Build-1, Build-2…
  ↓
Project Brain           Engineering memory (reconstruction + intent)  ← parallel to all above for readers
  ↓
Code                    Running system
```

**For implementers:** Read Project Brain first for *understanding*, then cite frozen corpus for *compliance*, then read code for *truth of implementation*.

---

## What superseded what

| Retired / archived | Replaced by |
|--------------------|-------------|
| Pre-UXMD design docs | `docs/uxmd/`, `@conquest/gis` |
| `docs/archive/prototype/` spike | Authorized `apps/`, `packages/`, `services/` |
| WDD / WSDD (historical) | PDD, UXMD, SDD |
| `conquest-master-spec.md` (summary) | `product-master-spec.md` + **Project Brain** |
| Chat session memory | **Project Brain** (mandatory) |

---

## Entry points updated to Project Brain

| Document | Points here |
|----------|-------------|
| Root `README.md` | First link |
| `AGENTS.md` | First read |
| `docs/knowledge-base/README.md` | Defers to Project Brain for identity |
| `docs/knowledge-base/ai-agent-onboarding.md` | Chapter 01 + 16 before coding |

---

## Recovery phases

| Phase | Mission | Status |
|-------|---------|--------|
| Phase 0 | Read-only audit | Complete |
| Phase 1 | Authoritative state sync | Absorbed into Phase 2 |
| Phase 2 | Document synchronization | Complete |
| Phase 3 | Engineering memory consolidation | Chapters 00–17 |
| **Phase 4** | **Cognitive preservation** | **institutional-memory/ (10 corpora, 97.2% coverage)** |

Build-2 **M5 does not start** until Recovery Phase 4 is merged **and** program gates (BAR, B-25–B-28) authorize execution work.

---

*Next: [01 — Philosophy & identity](./01-philosophy-and-identity.md)*
