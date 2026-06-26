# Conquest — Repository Migration Plan v1.0

| Field | Value |
|-------|-------|
| **Date** | 2026-06-26 |
| **Prerequisite** | [`repository-audit-v1.0.md`](repository-audit-v1.0.md) |
| **Authority** | SDD-V Part 2; Architecture Freeze §4 Class B errata |
| **Principle** | No deletion without confirmed supersession; no architecture redesign |

---

## Phase 1 — Architecture blockers ✅ COMPLETE

| # | Action | Status |
|---|--------|--------|
| 1.1 | Commit AMD I → `docs/architecture/amd/volume-i-critical-architectural-expansion.md` | **Done** 2026-06-26 |
| 1.2 | Commit AMD II → `docs/architecture/amd/volume-ii-architectural-layer-model.md` | **Done** 2026-06-26 |
| 1.3 | Apply SDD-II v1.2 lifecycle errata (ADR-0007) | **Done** 2026-06-26 |
| 1.4 | Update Architecture Freeze errata log | **Done** 2026-06-26 |
| 1.5 | Update RTM-INT-002 reference | **Done** 2026-06-26 |

**No further architecture reviews required for Phase 1.**

---

## Phase 2 — Documentation alignment (non-destructive)

Execute in order. Each step is independently revertible.

### 2.1 Legacy hierarchy text → ADR-0001 chain

| File | Change | Risk |
|------|--------|------|
| `AGENTS.md` | Replace `Constitution → WDD → WSDD` with `CCIS → AMD → PDD → UXMD → SDD` | Low |
| `docs/design/README.md` | Same hierarchy update; mark subordinate to UXMD | Low |
| `docs/architecture/cognitive-pipeline.md` | Add header: subordinate to CCIS (ADR-0007); rename WDD/WSDD mapping table to "Legacy mapping (superseded)" | Low |
| `docs/pdd/volume-i-product-behavior-architecture.md` | Remove `Subordinate To: … SDD` from header; align to ADR-0001 | Low — metadata only |

### 2.2 Archive obsolete documents (move, do not delete)

| From | To | Confirmation |
|------|-----|--------------|
| `docs/pdd/product-design-document.md` | `docs/archive/pdd/product-design-document-v1.0-superseded.md` | Superseded by PDD-II per freeze |
| `docs/sdd/system-design-document.md` | `docs/archive/sdd/system-design-document-v2.0-superseded.md` | Subordinate to SDD I–V per freeze |

Add `docs/archive/README.md`:

```markdown
# Archive

Superseded documents retained for history. Not authoritative.
Current authority: Architecture Freeze + SDD I–V.
```

### 2.3 Prototype tracker quarantine

| Action | Detail |
|--------|--------|
| Move | `docs/IMPLEMENTATION.md` → `docs/archive/prototype/IMPLEMENTATION-pre-build.md` |
| Replace | New `docs/IMPLEMENTATION.md` stub: "Build not authorized. See SDD-V Part 11 and build-authorization-checklist-v1.0.md." |

### 2.4 Link verification

| Target | Action |
|--------|--------|
| All `docs/**/README.md` | Verify relative links to AMD I–II paths |
| `docs/architecture/README.md` | Link governance folder |
| Broken refs to `product-design-document.md` | Redirect to PDD-II or archive path |

---

## Phase 3 — Prototype code disposition

**Do not delete prototype code in Phase 3.** Classify and label only.

| Option | Recommendation |
|--------|----------------|
| **A — Quarantine** (recommended) | Add `PROTOTYPE-NOT-AUTHORIZED.md` at repo root; prefix README section "Pre-build scaffold" |
| **B — Realign** | After Build-0 authorization, map `apps/packages/services` to SDD-V Part 2 logical areas via ADR |
| **C — Discard** | Only after Build-0 scaffold replaces functionality — not now |

### 3.1 Code comment migration (Class B errata)

| File | Replace |
|------|---------|
| `packages/database/src/schema.ts` | `WSDD §7` → `SDD-II Part 8`; `WDD §5` → `AMD III` |
| `packages/core/src/services/contract.ts` | `WSDD §6` → `SDD-I §5` |
| `services/session/src/index.ts` | `WSDD §7` → `SDD-II session scope` |

### 3.2 Repository structure toward SDD-V Part 2

Current layout (`apps/`, `packages/`, `services/`) does **not** match SDD-V §2.1 logical names. **Do not rename before Build Authorization.**

| SDD-V logical area | Current prototype mapping (interim) |
|--------------------|-------------------------------------|
| `presentation/` | `apps/gateway/public/` + future client app |
| `orchestration/` | `services/orchestrator/` |
| `intelligence/` | `packages/engines/` |
| `data/` | `packages/database/`, `services/memory/` |
| `platform/` | `services/auth/`, `services/session/` |
| `integration/` | `apps/gateway/` (API boundary) |

Formal **B-19 approval** = sign migration mapping ADR or appendix to Build Authorization Record.

---

## Phase 4 — Build governance scaffolding (required for Build-0)

| # | Deliverable | Blocks |
|---|-------------|--------|
| 4.1 | `.github/workflows/ci.yml` — lint, typecheck, test, ENG-12 boundary checks | B-20 |
| 4.2 | `docs/governance/ci-law-mapping.md` — EL/IL/INF/AI/ENG automatable checks per SDD-V §13 | B-21 |
| 4.3 | Issue Build Authorization Record from template | B-10 |
| 4.4 | Approve repository structure mapping (§3.2) in Build Authorization Record | B-19 |

---

## Phase 5 — Explicitly out of scope

| Item | Reason |
|------|--------|
| PDD-I v2.1 content | Build-2 gate (B-12), not Build-0 |
| UXMD screen implementation | Build-1+ |
| New architecture volumes | Architecture program complete |
| Deleting prototype TypeScript | Await Build-0 scope decision |
| `prompts/` cleanup | Directory does not exist |

---

## Execution order

```
Phase 1 ✅ → Phase 2 (docs) → Phase 4.1–4.2 (CI) → Phase 4.3–4.4 (Build Auth Record)
         → Phase 3.1 (comments) → Phase 3.2 (post-auth realignment)
```

---

## Rollback

| Change type | Rollback |
|-------------|----------|
| Archive moves | `git mv` back |
| SDD-II v1.2 | Restore v1.1 from git; reopen P0-1 |
| AMD I–II commit | Remove files; reopen P0-2 |

---

*Migration Plan v1.0 — Execute Phase 2+ only after review of this plan. No destructive deletes in Phase 2.*
