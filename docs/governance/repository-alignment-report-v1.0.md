# Conquest — Repository Alignment Report v1.0

| Field | Value |
|-------|-------|
| **Date** | 2026-06-26 |
| **Authority baseline** | CCIS, AMD I–IV, PDD I–II (+ Authority Bridge), UXMD I–III, SDD I–V, ADR-0001–0035, RTM v1.1, Architecture Freeze v1.0, FAA v1.0 |
| **Purpose** | Full repository alignment audit before Build Authorization |
| **Safety rule** | **No deletions executed.** Recommendations only. |

### Classification legend

| Cat | Name | Action |
|-----|------|--------|
| **A** | Canonical | Keep unchanged |
| **B** | Legacy but valuable | Archive when appropriate |
| **C** | Prototype | Quarantine; adapt or replace under Build governance |
| **D** | Obsolete | Recommend removal after approval |

---

## Executive summary

| Metric | Count |
|--------|------:|
| Files audited (excl. `node_modules`) | ~340 on disk |
| **Category A** (canonical) | ~95 |
| **Category B** (legacy valuable) | ~12 |
| **Category C** (prototype) | ~55 source + config |
| **Category D** (obsolete / remove) | ~180 (`dist/` build artifacts on disk) |
| Alignment gaps requiring updates | 18 files |
| Broken / stale references | 9 |
| Duplicate document pairs | 4 |
| Legacy prompt files | **0** (none in repo) |
| WDD/WSDD standalone documents | **0** (references only) |

**Verdict:** The **frozen documentation corpus is substantially aligned** after Phase 1 P0 closures (AMD I–II, SDD-II v1.2). The **repository as a whole is not aligned**: root README, AGENTS.md, cursor rules, design folder, prototype TypeScript, and build artifacts contradict or predate the frozen architecture.

---

# 1. Files to keep (Category A — Canonical)

## 1.1 Architecture program

| Path | Notes |
|------|-------|
| `docs/architecture/ccis.md` | CCIS v1.0 — supreme |
| `docs/architecture/amd/volume-i-critical-architectural-expansion.md` | AMD I v1.0 — frozen |
| `docs/architecture/amd/volume-ii-architectural-layer-model.md` | AMD II v1.0 — frozen |
| `docs/architecture/amd/volume-iii-memory-architecture.md` | AMD III v1.0 — frozen |
| `docs/architecture/amd/volume-iv-intelligence-systems.md` | AMD IV v1.0 — frozen |
| `docs/architecture/cognitive-pipeline.md` | Subordinate to CCIS (needs metadata banner — see §3) |
| `docs/architecture/how-conquest-thinks.md` | Subordinate elaboration |
| `docs/architecture/how-conquest-evolves.md` | Subordinate elaboration |
| `docs/architecture/ARCHITECTURE-FREEZE.md` | Active governance |
| `docs/architecture/final-architecture-audit-v1.0.md` | FAA artifact |
| `docs/architecture/requirements-traceability-matrix.md` | RTM v1.1 |
| `docs/architecture/README.md` | Index (needs SDD-II v1.2 version — see §3) |
| `docs/architecture/adr/0001`–`0035` | 35 Accepted ADRs |
| `docs/architecture/adr/template.md` | ADR template |
| `docs/architecture/adr/README.md` | ADR index |

## 1.2 PDD

| Path | Notes |
|------|-------|
| `docs/pdd/volume-i-product-behavior-architecture.md` | PDD-I v2.0 conditional (header fix — see §3) |
| `docs/pdd/pdd-volume-i-authority-bridge.md` | Authority Bridge v1.0 |
| `docs/pdd/volume-ii-module-specifications.md` | MSD v1.0 |
| `docs/pdd/pdd-volume-i-review-checklist.md` | Executed review artifact |
| `docs/pdd/README.md` | Index (remove interim PDD link prominence — see §3) |

## 1.3 UXMD

| Path | Notes |
|------|-------|
| `docs/uxmd/volume-i-user-experience-master-document.md` | UXMD-I |
| `docs/uxmd/volume-ii-screen-interaction-specification.md` | UXMD-II v1.1 — 102 screens |
| `docs/uxmd/volume-iii-global-interaction-standards.md` | GIS v1.0 |
| `docs/uxmd/uxmd-final-review-checklist.md` | APPROVED FOR SDD |
| `docs/uxmd/README.md` | Index |

## 1.4 SDD

| Path | Notes |
|------|-------|
| `docs/sdd/volume-i-system-architecture.md` | SDD-I v1.1 |
| `docs/sdd/volume-ii-data-intelligence-architecture.md` | **SDD-II v1.2** |
| `docs/sdd/volume-iii-infrastructure-security-architecture.md` | SDD-III v1.0 |
| `docs/sdd/volume-iv-ai-orchestration-agent-architecture.md` | SDD-IV v1.0 |
| `docs/sdd/volume-v-engineering-standards-build-governance.md` | SDD-V v1.0 |
| `docs/sdd/sdd-volume-i-review-checklist-v1.1.md` | Final SDD-I review |
| `docs/sdd/sdd-volume-ii-review-checklist-v1.1.md` | Final SDD-II review |
| `docs/sdd/sdd-volume-iii-review-checklist.md` | SDD-III review |
| `docs/sdd/sdd-volume-iv-review-checklist.md` | SDD-IV review |
| `docs/sdd/sdd-volume-v-review-checklist.md` | SDD-V review |
| `docs/sdd/README.md` | Index (SDD-II version stale — see §3) |

## 1.5 Governance (transition)

| Path | Notes |
|------|-------|
| `docs/governance/build-authorization-checklist-v1.0.md` | SDD-V §11.1 gate status |
| `docs/governance/build-authorization-record-template.md` | Template — not issued |
| `docs/governance/repository-migration-plan-v1.0.md` | Prior transition plan |
| `docs/governance/repository-audit-v1.0.md` | Superseded by this report — archive after approval |

## 1.6 Repository hygiene

| Path | Notes |
|------|-------|
| `.gitignore` | Correctly ignores `dist/`, `.netlify/` per SDD-V §2.9 |

---

# 2. Files to archive (Category B — Legacy but valuable)

Move to `docs/archive/` preserving path structure. Add `docs/archive/README.md` stating non-authoritative status.

| Current path | Archive destination | Justification |
|--------------|---------------------|---------------|
| `docs/pdd/product-design-document.md` | `docs/archive/pdd/product-design-document-v1.0-superseded.md` | Superseded by PDD-II MSD per Freeze §Supporting |
| `docs/sdd/system-design-document.md` | `docs/archive/sdd/system-design-document-v2.0-superseded.md` | Superseded by SDD I–V per ADR-0001, Freeze |
| `docs/sdd/sdd-volume-i-review-checklist.md` | `docs/archive/sdd/reviews/sdd-volume-i-review-checklist-v1.0-superseded.md` | Superseded by v1.1 re-review (81% → 94%) |
| `docs/sdd/sdd-volume-ii-review-checklist.md` | `docs/archive/sdd/reviews/sdd-volume-ii-review-checklist-v1.0-superseded.md` | Superseded by v1.1 re-review (73% → 92%) |
| `docs/IMPLEMENTATION.md` | `docs/archive/prototype/IMPLEMENTATION-pre-build-wsdd-era.md` | WDD/WSDD-era tracker; explicitly not authorized |
| `docs/governance/repository-audit-v1.0.md` | `docs/archive/governance/repository-audit-v1.0-superseded.md` | Superseded by this alignment report |

### `docs/design/` — Category B (subordinate, not frozen)

Per Architecture Freeze, `docs/design/` is **non-authoritative**. Retain in archive or keep in place with a mandatory banner. UXMD I–III + GIS prevail.

| Path | Issue | Recommendation |
|------|-------|----------------|
| `docs/design/README.md` | WDD/WSDD hierarchy | Archive entire `docs/design/` **or** keep with `NON-AUTHORITATIVE` banner |
| `docs/design/design-architecture-constitution.md` | Referenced by `.cursor/rules` | Keep if rules updated to cite UXMD-III GIS |
| `docs/design/modules-registry.md` | Uses "Dashboard" not Command Center | Archive — contradicts ADR-0002, ADR-0005 |
| `docs/design/layout-system.md` | Pre-UXMD shell | Archive |
| `docs/design/visual-language.md` | Pre-GIS tokens | Archive |
| `docs/design/design-tokens.md` | Pre-GIS | Archive |
| `docs/design/components.md` | Pre-UXMD-II screens | Archive |
| `docs/design/intelligence-models.md` | Pre-PDD-II module framing | Archive |

**Recommended:** Archive whole `docs/design/` folder to `docs/archive/design-pre-uxmd/` as a single unit.

---

# 3. Files that require updating (not removal)

| File | Issue | Required change |
|------|-------|-----------------|
| `AGENTS.md` | Governance chain cites `Constitution → WDD → WSDD`; Cognitive Pipeline as runtime contract over CCIS | Replace with `CCIS → AMD → PDD → UXMD → SDD`; cite ADR-0007 + AMD IV §69 for pipeline subordination |
| `README.md` | Presents prototype as primary; links `IMPLEMENTATION.md`; omits frozen corpus | Add architecture program index; mark prototype as pre-authorization; link governance checklist |
| `docs/architecture/README.md` | SDD-II listed as v1.1 | Update to **v1.2** |
| `docs/sdd/README.md` | SDD-II listed as v1.1 | Update to **v1.2**; link governance folder |
| `docs/pdd/volume-i-product-behavior-architecture.md` | `Subordinate To: … SDD` | Fix per ADR-0001: subordinate to CCIS, AMD only |
| `docs/pdd/README.md` | Promotes interim `product-design-document.md` | Point to PDD-II; link archive after move |
| `docs/architecture/cognitive-pipeline.md` | WDD/WSDD mapping table without supersession note | Add subordination header; mark mapping as legacy |
| `docs/architecture/ccis.md` | Acknowledges WDD/WSDD | Add footnote: superseded by SDD program |
| `docs/architecture/final-architecture-audit-v1.0.md` | Verdict still "APPROVED WITH P0 BLOCKERS" | Add errata note: P0 closed 2026-06-26 (Class B) |
| `.cursor/rules/conquest-cios.mdc` | Ten-phase loop as supreme; no CCIS/ADR reference | Add frozen authority chain; subordinate pipeline |
| `.cursor/rules/conquest-design.mdc` | References design constitution | Point to UXMD-III GIS |
| `packages/database/src/schema.ts` | Comments cite WDD/WSDD | Update to AMD III / SDD-II (when prototype retained) |
| `packages/core/src/services/contract.ts` | WSDD §6 comment | Update to SDD-I §5 |
| `services/session/src/index.ts` | WSDD §7 comment | Update to SDD-II / ADR-0017 |
| `docs/governance/repository-migration-plan-v1.0.md` | Phase 1 marked done | Reference this report as authoritative audit |
| `docs/governance/build-authorization-checklist-v1.0.md` | — | No change unless gates close |
| `pnpm-workspace.yaml` / root `package.json` | No architecture alignment marker | Add comment: prototype — pending B-19 approval |
| `.gitignore` | `dist/` ignored but present on disk | Verify no tracked dist (confirmed: 0 tracked) |

---

# 4. Files recommended for removal (Category D)

**Justification required for each.** Do not delete until this report is approved.

## 4.1 Build artifacts on disk (not in git)

| Pattern | Count | Justification |
|---------|------:|---------------|
| `**/dist/**` | ~170 files | Compiled output; `.gitignore` excludes; pollutes alignment audit; reproducible via `pnpm build` |

**Action:** `git clean` or manual delete of all `dist/` directories. Not a git history operation.

## 4.2 Superseded documents (after archive copy)

| File | Justification |
|------|---------------|
| `docs/pdd/product-design-document.md` | Fully superseded by `volume-ii-module-specifications.md`; duplicate module catalog |
| `docs/sdd/system-design-document.md` | SDD v2.0 monolith duplicates SDD I–V; creates dual engineering authority |
| `docs/IMPLEMENTATION.md` | Claims WDD/WSDD "Adopted"; contradicts Freeze "build not authorized"; replaced by governance checklist |

## 4.3 Duplicate review artifacts (after archive copy)

| File | Justification |
|------|---------------|
| `docs/sdd/sdd-volume-i-review-checklist.md` | Superseded by v1.1 re-review — historical only |
| `docs/sdd/sdd-volume-ii-review-checklist.md` | Superseded by v1.1 re-review — historical only |

## 4.4 Design folder (after archive copy)

| Path | Justification |
|------|---------------|
| `docs/design/*` (8 files) | Non-authoritative per Freeze; module names and nav contradict ADR-0005; UXMD supersedes |

## 4.5 Optional — prototype source (decision required at Build Authorization)

**Not recommended for removal before Build-0.** Listed for completeness.

| Path | Justification if removed |
|------|--------------------------|
| `apps/`, `packages/`, `services/` | Pre-authorization spike; wrong lifecycle order vs ADR-0007; not UXMD; not SDD-V Part 2 layout |

**Recommended disposition:** **Category C quarantine** — retain with `PROTOTYPE.md` banner until Build-0 scope decision in Build Authorization Record §6.

---

# 5. Folder restructuring needed

## 5.1 Target structure (aligned with SDD-V Part 2 + Freeze)

```
docs/
  architecture/     # A — CCIS, AMD, ADR, Freeze, FAA, RTM, trilogy
  pdd/              # A — PDD I–II, Bridge, reviews
  uxmd/             # A — UXMD I–III, reviews
  sdd/              # A — SDD I–V, final reviews only
  governance/       # A — Build gates, alignment report, BAR template
  archive/          # B — superseded + historical
    pdd/
    sdd/
    design-pre-uxmd/
    prototype/
    governance/
```

## 5.2 Root-level additions (post-cleanup)

| File | Purpose |
|------|---------|
| `PROTOTYPE.md` | States `apps/packages/services` are pre-authorization; not production |
| `docs/IMPLEMENTATION.md` | Stub: "Build not authorized — see `docs/governance/build-authorization-checklist-v1.0.md`" |

## 5.3 Future implementation layout (Build-0+ — do not rename yet)

Per SDD-V §2.1 logical areas — approve in B-19, implement during Build-0:

| Logical (SDD-V) | Current prototype |
|-----------------|-------------------|
| `presentation/` | `apps/gateway/public/` + future client |
| `application/` | TBD |
| `orchestration/` | `services/orchestrator/` |
| `intelligence/` | `packages/engines/` |
| `data/` | `packages/database/`, `services/memory/` |
| `platform/` | `services/auth/`, `services/session/` |

## 5.4 Missing folders (to create at Build-0)

| Path | Gate |
|------|------|
| `.github/workflows/` | B-20 |
| `docs/governance/ci-law-mapping.md` | B-21 |

---

# 6. Broken references

| Source | Reference | Issue |
|--------|-----------|-------|
| `README.md` | `docs/IMPLEMENTATION.md` | Will break after archive — update to governance checklist |
| `docs/pdd/README.md` | `product-design-document.md` | Points to obsolete doc |
| `docs/sdd/README.md` | SDD-II "v1.1" | Stale version |
| `docs/architecture/README.md` | SDD-II "v1.1" | Stale version |
| `AGENTS.md` | `how-conquest-evolves.md` (relative) | Broken relative path — should be `docs/architecture/...` |
| `docs/architecture/README.md` | FAA "APPROVED WITH P0 BLOCKERS" | Stale — P0 closed |
| `docs/pdd/pdd-volume-i-authority-bridge.md` | §4 "SDD Volume I blocked until UXMD" | Stale — SDD complete |
| Freeze §3.5 | "SDD Volume III blocked until Volume II" | Stale prohibition text in SDD-II header |
| `docs/sdd/volume-ii-data-intelligence-architecture.md` | §Strict Prohibitions "SDD III blocked" | Stale |

No broken **file path** links detected in ADR cross-links. Relative links within `docs/architecture/adr/` are valid.

---

# 7. Duplicate documents

| Pair | Relationship | Resolution |
|------|--------------|------------|
| `product-design-document.md` ↔ `volume-ii-module-specifications.md` | v1.0 interim ↔ v1.0 MSD | Archive + remove interim |
| `system-design-document.md` ↔ SDD I–V | v2.0 monolith ↔ frozen program | Archive + remove monolith |
| `sdd-volume-i-review-checklist.md` ↔ `sdd-volume-i-review-checklist-v1.1.md` | Initial ↔ final review | Archive v1.0 |
| `sdd-volume-ii-review-checklist.md` ↔ `sdd-volume-ii-review-checklist-v1.1.md` | Initial ↔ final review | Archive v1.0 |
| `repository-audit-v1.0.md` ↔ this report | Partial overlap | Archive audit v1.0 |

---

# 8. Legacy prompts

| Finding | Detail |
|---------|--------|
| `prompts/` directory | **Does not exist** |
| Standalone prompt template files | **None** |
| `.cursor/rules/*.mdc` | Agent instructions — **not** architecture prompts; require update (§3) not removal |
| `AGENTS.md` | Agent operating law — canonical after hierarchy fix |

No orphaned prompt libraries to remove.

---

# 9. Superseded WDD/WSDD material

| Item | Status | Replaced by |
|------|--------|-------------|
| `WDD.md` | Never committed | PDD I–II, UXMD I–III |
| `WSDD.md` | Never committed | SDD I–V |
| `docs/IMPLEMENTATION.md` "Working Design/System Design Document" | Committed | SDD-V + governance checklist |
| `docs/architecture/cognitive-pipeline.md` §WDD/WSDD mapping | Committed section | AMD IV §69, SDD-IV, ADR-0026 |
| Code comments (`schema.ts`, `contract.ts`, `session`) | Committed | AMD III, SDD-I/II |
| `AGENTS.md` / `docs/design/README.md` hierarchy strings | Committed | ADR-0001 chain |

---

# 10. Repository structure improvements

| # | Improvement | Priority | Gate |
|---|-------------|----------|------|
| 1 | Create `docs/archive/` with README | High | Pre-cleanup |
| 2 | Archive superseded PDD/SDD/reviews/design | High | Pre-cleanup |
| 3 | Replace `IMPLEMENTATION.md` with stub | High | Pre-cleanup |
| 4 | Update AGENTS.md + README.md authority chain | High | Pre-Build Auth |
| 5 | Add `PROTOTYPE.md` at root | Medium | Pre-Build Auth |
| 6 | Delete local `dist/` artifacts | Medium | Anytime |
| 7 | Fix stale version refs (SDD-II v1.2) | Medium | Pre-Build Auth |
| 8 | Update `.cursor/rules` to frozen architecture | Medium | Pre-Build Auth |
| 9 | Add `.github/workflows/ci.yml` | High | B-20 |
| 10 | Add `docs/governance/ci-law-mapping.md` | High | B-21 |
| 11 | Approve SDD-V §2.1 mapping in BAR | High | B-19 |
| 12 | Consolidate `docs/sdd/reviews/` for final checklists only | Low | Post-cleanup |

---

# 11. Prototype alignment assessment (Category C detail)

| Component | Adaptable? | Gap vs frozen architecture |
|-----------|------------|----------------------------|
| `packages/core/pipeline/phases.ts` | Partial | 10-phase cognitive pipeline — subordinate expression OK per ADR-0026, but omits CCIS Challenge/Decide/Recommend as named stages |
| `packages/engines/*` | Partial | Engine decomposition useful; order and VRF gate differ from SDD-IV |
| `packages/database/schema.ts` | Partial | Memory store list ≠ AMD III memory taxonomy; schema pre-IL-2 governance |
| `services/orchestrator` | Partial | Single runner — aligns with ADR-0030 direction; not System Coordinator per SDD-IV |
| `apps/gateway` | Low | `/preview` demo — not UXMD 102-screen app; not GIS-bound |
| `apps/gateway/public/preview.*` | Low | Experimental UI — not Presentation layer per SDD-I |
| `docker-compose.yml` | Yes | Local dev infra — acceptable scaffold |
| `vitest.config.ts` + 2 tests | Yes | Expand under B-21 |

**Recommendation:** Quarantine as **experimental spike**. Do not delete. Realign or replace during Build-0/Build-2 per Build Authorization Record prototype disposition.

---

# 12. Alignment scorecard

| Domain | Aligned? | Score |
|--------|----------|------:|
| CCIS + AMD I–IV | Yes | 100% |
| PDD + Bridge | Mostly (PDD-I header) | 95% |
| UXMD I–III | Yes | 98% |
| SDD I–V | Yes (index metadata stale) | 97% |
| ADR + RTM + Freeze + FAA | Yes | 98% |
| Governance transition docs | Yes | 95% |
| Root entry points (README, AGENTS) | No | 40% |
| Cursor rules | No | 45% |
| `docs/design/` | No | 20% |
| Prototype code | No | 25% |
| Build infrastructure (CI) | Missing | 0% |
| **Overall repository** | **Partial** | **72%** |

---

# 13. Prepared cleanup operation (execute after report approval)

Single ordered operation — **one PR, one review**.

## Phase A — Archive (no deletes)

```text
1. Create docs/archive/README.md
2. git mv docs/pdd/product-design-document.md → docs/archive/pdd/product-design-document-v1.0-superseded.md
3. git mv docs/sdd/system-design-document.md → docs/archive/sdd/system-design-document-v2.0-superseded.md
4. git mv docs/sdd/sdd-volume-i-review-checklist.md → docs/archive/sdd/reviews/sdd-volume-i-review-checklist-v1.0-superseded.md
5. git mv docs/sdd/sdd-volume-ii-review-checklist.md → docs/archive/sdd/reviews/sdd-volume-ii-review-checklist-v1.0-superseded.md
6. git mv docs/IMPLEMENTATION.md → docs/archive/prototype/IMPLEMENTATION-pre-build-wsdd-era.md
7. git mv docs/design/ → docs/archive/design-pre-uxmd/
8. git mv docs/governance/repository-audit-v1.0.md → docs/archive/governance/repository-audit-v1.0-superseded.md
```

## Phase B — Stubs and entry points

```text
9.  Write docs/IMPLEMENTATION.md stub (build not authorized)
10. Write PROTOTYPE.md at repo root
11. Update README.md, AGENTS.md, architecture/README.md, sdd/README.md, pdd/README.md
12. Fix PDD-I authority header
13. Add cognitive-pipeline.md subordination banner
14. Update .cursor/rules/conquest-cios.mdc and conquest-design.mdc
```

## Phase C — Remove build artifacts (local only)

```text
15. Remove all **/dist/** directories from working tree (not in git)
```

## Phase D — Link repair

```text
16. Update all references in §6
17. Add redirect notes in archive README for moved paths
```

## Phase E — Build-0 prerequisites (separate PR or same if approved)

```text
18. Create docs/governance/ci-law-mapping.md
19. Create .github/workflows/ci.yml
20. Update build-authorization-checklist-v1.0.md gate statuses
21. Issue Build Authorization Record (human signature — not automated)
```

## Post-cleanup verification checklist

- [ ] No file in `docs/pdd/`, `docs/sdd/`, `docs/uxmd/`, `docs/architecture/` contradicts Freeze §2
- [ ] No WDD/WSDD hierarchy in active entry points
- [ ] `docs/design/` not in active path (archived)
- [ ] `IMPLEMENTATION.md` stub only
- [ ] PROTOTYPE.md visible at root
- [ ] SDD-II version refs say v1.2
- [ ] Archive README lists all moved files with supersession mapping
- [ ] B-19–B-21 gates addressed before Build Authorization

---

# 14. Approval

| Role | Approved | Date |
|------|----------|------|
| Program Architecture Authority | ☐ | |
| Repository owner | ☐ | |

Upon approval, execute **§13 Prepared cleanup operation** as a single governed change set.

---

*Repository Alignment Report v1.0 — Audit complete. No files deleted during this audit.*
