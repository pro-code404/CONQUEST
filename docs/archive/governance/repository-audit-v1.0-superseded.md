# Conquest — Repository Audit v1.0

| Field | Value |
|-------|-------|
| **Date** | 2026-06-26 |
| **Scope** | Full repository |
| **Authority** | SDD-V Part 2; Architecture Freeze; FAA v1.0 |
| **Purpose** | Classify every significant path for architecture-governed implementation transition |

## Classification legend

| Category | Definition |
|----------|------------|
| **Canonical** | Frozen architecture corpus (CCIS → AMD → PDD → UXMD → SDD → governance) |
| **Legacy** | Superseded nomenclature or documents replaced by frozen corpus |
| **Prototype** | Pre–Build Authorization code or trackers; not architecture-governed |
| **Obsolete** | Safe to archive after migration plan execution |

---

## 1. Top-level

| Path | Category | Notes |
|------|----------|-------|
| `AGENTS.md` | Canonical + Legacy text | Agent law; governance chain cites WDD/WSDD — update to ADR-0001 chain |
| `README.md` | Canonical | Human entry; describes prototype monorepo |
| `package.json` | Prototype | Root pnpm workspace |
| `pnpm-workspace.yaml` | Prototype | `packages/*`, `services/*`, `apps/*` |
| `pnpm-lock.yaml` | Prototype | Lockfile |
| `pnpm-builds.json` | Prototype | Build allowlist |
| `.npmrc` | Prototype | Package manager config |
| `.env.example` | Prototype | Env template |
| `.gitignore` | Canonical | Repo hygiene |
| `docker-compose.yml` | Prototype | Local Postgres + Redis |
| `vitest.config.ts` | Prototype | Unit tests (2 files) |
| `tsconfig.base.json` | Prototype | TS config |
| `scripts/build.mjs` | Prototype | Monorepo build |
| `.cursor/rules/` | Subordinate | CIOS + Design Constitution rules |

---

## 2. `docs/architecture/` — Canonical

| Path | Category |
|------|----------|
| `ccis.md` | Canonical |
| `cognitive-pipeline.md` | Canonical (subordinate to CCIS) |
| `how-conquest-thinks.md` | Canonical (subordinate) |
| `how-conquest-evolves.md` | Canonical (subordinate) |
| `amd/volume-i-critical-architectural-expansion.md` | Canonical — **committed 2026-06-26** |
| `amd/volume-ii-architectural-layer-model.md` | Canonical — **committed 2026-06-26** |
| `amd/volume-iii-memory-architecture.md` | Canonical |
| `amd/volume-iv-intelligence-systems.md` | Canonical |
| `ARCHITECTURE-FREEZE.md` | Canonical |
| `final-architecture-audit-v1.0.md` | Canonical |
| `requirements-traceability-matrix.md` | Canonical |
| `README.md` | Canonical |
| `adr/0001`–`0035`, `template.md`, `README.md` | Canonical |

---

## 3. `docs/pdd/` — Canonical + Legacy

| Path | Category | Superseded by |
|------|----------|---------------|
| `volume-i-product-behavior-architecture.md` | Canonical (conditional) | — |
| `pdd-volume-i-authority-bridge.md` | Canonical | — |
| `volume-ii-module-specifications.md` | Canonical | — |
| `pdd-volume-i-review-checklist.md` | Canonical (review artifact) | — |
| `README.md` | Canonical | — |
| `product-design-document.md` | **Obsolete** | `volume-ii-module-specifications.md` |

---

## 4. `docs/uxmd/` — Canonical

All files canonical: Volumes I–III, final review checklist, README.

---

## 5. `docs/sdd/` — Canonical + Legacy

| Path | Category | Notes |
|------|----------|-------|
| `volume-i` through `volume-v` | Canonical | SDD-II now **v1.2** |
| `sdd-volume-*-review-checklist*.md` | Canonical | Review artifacts |
| `README.md` | Canonical | — |
| `system-design-document.md` | **Legacy** | SDD v2.0 monolith — superseded by SDD I–V |

---

## 6. `docs/design/` — Subordinate / Legacy

| Path | Category | Notes |
|------|----------|-------|
| `design-architecture-constitution.md` | Subordinate | UX shell law; referenced by `.cursor/rules` |
| `layout-system.md`, `visual-language.md`, etc. | Subordinate | Pre-UXMD design aids |
| `README.md` | Legacy | Cites WDD/WSDD hierarchy |

**Not frozen.** UXMD I–III + GIS prevail for screen authority.

---

## 7. `docs/governance/` — Canonical (transition)

| Path | Category |
|------|----------|
| `repository-audit-v1.0.md` | Canonical (this document) |
| `repository-migration-plan-v1.0.md` | Canonical |
| `build-authorization-checklist-v1.0.md` | Canonical |
| `build-authorization-record-template.md` | Canonical (template — not issued) |

---

## 8. Other docs

| Path | Category | Notes |
|------|----------|-------|
| `docs/IMPLEMENTATION.md` | **Prototype** | Tracks WDD/WSDD-era scaffold; marked not authorized |

---

## 9. `apps/` — Prototype

| Path | Category | Notes |
|------|----------|-------|
| `apps/gateway/` | Prototype | Hono API + `/preview` demo UI |
| `apps/gateway/public/preview.*` | Prototype | Pipeline demo only (not UXMD) |

---

## 10. `packages/` — Prototype

| Path | Category | WDD/WSDD refs |
|------|----------|---------------|
| `packages/core/` | Prototype | `contract.ts` → WSDD §6 |
| `packages/engines/` | Prototype | 10-phase cognitive engines |
| `packages/database/` | Prototype | `schema.ts` → WDD/WSDD |
| `packages/observability/` | Prototype | — |
| `packages/config/` | Prototype | — |
| `packages/ui/` | Prototype | Design tokens only |

---

## 11. `services/` — Prototype

| Path | Category | Notes |
|------|----------|-------|
| `services/orchestrator/` | Prototype | PipelineRunner |
| `services/memory/` | Prototype | In-memory fallback |
| `services/auth/` | Prototype | Token auth |
| `services/session/` | Prototype | WSDD §7 comment |
| `services/shared/` | Prototype | Utilities |

---

## 12. Missing / not found

| Item | Status |
|------|--------|
| `prompts/` directory | Does not exist |
| WDD.md / WSDD.md standalone files | Never committed |
| `.github/` CI workflows | **Does not exist** — blocks B-20 |
| Build Authorization Record (issued) | **Does not exist** — blocks B-10 |
| AMD Volumes V–X | Deferred per freeze |

---

## 13. Summary counts

| Category | Approx. file groups |
|----------|---------------------|
| Canonical documentation | ~80 markdown files |
| Legacy | 3 (`system-design-document.md`, `product-design-document.md`, WDD/WSDD references) |
| Prototype code | 13 packages/services/apps |
| Obsolete (pending archive) | 2 documents |

---

*Repository Audit v1.0 — 2026-06-26. Execute migration plan before destructive changes.*
