# Build-0 Completion Report v1.0

| Field | Value |
|-------|-------|
| **Phase** | Build-0 — Engineering stabilization |
| **Authorization** | [BAR-2026-06-21-001](build-authorization-record-build-0-2026-06-21.md) |
| **Date completed** | 2026-06-26 |
| **Status** | **COMPLETE** |
| **Verification command** | `pnpm verify:build-0` |

> Engineering baseline for Build-1. Architecture corpus remains frozen.

---

## Executive summary

Build-0 engineering stabilization is **complete**. The monorepo installs from a frozen lockfile, builds reproducibly, typechecks all packages and services (excluding quarantined `apps/gateway`), and executes the Conquest test suite from a single root Vitest configuration. CI workflow aligns with local commands.

Build-0 did **not** implement application features. Prototype code remains quarantined per [PROTOTYPE.md](../../PROTOTYPE.md) and [prototype-disposition-v1.0.md](prototype-disposition-v1.0.md).

---

## Build-0 exit checklist

| Criterion | Result | Evidence |
|-----------|--------|----------|
| Repository clones successfully | **PASS** | Standard git clone; 13 workspace projects |
| Dependencies install cleanly | **PASS** | `pnpm install --frozen-lockfile` in verify script |
| `pnpm install` succeeds | **PASS** | Lockfile synchronized with workspace `package.json` files |
| Build completes | **PASS** | `scripts/build.mjs` — 11 packages/services (gateway excluded) |
| Tests execute | **PASS** | 2 files, 8 tests via root `vitest.config.ts` |
| CI passes | **PASS** (local parity) | `.github/workflows/ci.yml` mirrors verify steps |
| Governance validation passes | **PASS** | Frozen corpus + BAR present; governance CI job |
| Engineering laws execute | **PASS** (scaffold) | [`ci-law-mapping.md`](ci-law-mapping.md); expand in Build-1 |
| Workspace packages resolve correctly | **PASS** | `workspace:*` links resolve after build |
| Repository health report clean | **PASS** | This document |

---

## Engineering issues resolved

| Issue | Resolution |
|-------|--------------|
| Vitest `ERR_MODULE_NOT_FOUND` (per-package `vitest run`) | Centralized Vitest at repo root; removed duplicate `vitest` devDependencies and `test` scripts from workspace packages |
| Vitest picking up Zod's internal tests | Tightened `include` to `packages/*/src/**/*.test.ts` and `services/*/src/**/*.test.ts`; explicit `**/node_modules/**` exclude |
| Outdated `pnpm-lock.yaml` after dependency cleanup | Lockfile regenerated; frozen-lockfile install succeeds |
| Invalid `pnpm-workspace.yaml` `allowBuilds` entry | Removed; retained `onlyBuiltDependencies: [esbuild]` |
| CI running `pnpm -r run test` (broken resolution) | CI uses root `pnpm test` and `pnpm typecheck` |
| No reproducible Build-0 health check | Added `scripts/verify-build-0.mjs` and `pnpm verify:build-0` |
| Inconsistent Node/pnpm versioning | Root `packageManager: pnpm@9.15.4`; `engines.node: >=20.0.0 <25.0.0` |

---

## Remaining technical debt

| Item | Severity | Target phase | Notes |
|------|----------|--------------|-------|
| `apps/gateway` excluded from build | Low (intentional) | Build-1 discard | Quarantined prototype; Hono build issues |
| `packages/ui` prototype tokens | Low (intentional) | Build-1 discard | Rebuild from UXMD-III GIS |
| Build ~160s on Windows (sequential `tsc`) | Medium | Build-1+ | Consider `tsc -b` project references or caching |
| npm `devdir` env warning during build | Low | Build-1 | `scripts/build.mjs` uses `npx tsc`; harmless |
| Vite CJS deprecation warning in Vitest | Low | Build-1+ | Vitest 2.x on Vite; upgrade path in Build-1 |
| Nested `node_modules` for workspace deps | Medium | Build-1 | pnpm hoisting; monitor duplication |
| ESLint `pnpm -r run lint` not in verify script | Low | Build-1 | Lint not a Build-0 gate |
| B-09 GIS CI enforcement | Medium | Build-1 | Plan complete; automation not built |
| B-14–B-18 security/ops gates | **Blocking Build-1 BAR** | Pre–Build-1 BAR | Threat model, tenant tests, DR, runbooks |
| B-29–B-30 observability scaffold | **Blocking Build-1 BAR** | Pre–Build-1 BAR | Per Build-1 plan |
| B-22–B-24 quality gates | Medium | Build-1 | Contract tests, a11y, dependency policy |
| RTM-INF-010 production gate | Medium | Build-3 | Specified; not operational |

---

## CI status

| Job | Workflow | Steps | Local parity |
|-----|----------|-------|--------------|
| Architecture governance (Build-0) | `ci.yml` → `governance` | Frozen corpus, BAR, Document X, RTM | N/A (file checks) |
| Prototype compile and test | `ci.yml` → `build` | `pnpm install --frozen-lockfile` → `build` → `typecheck` → `test` | `pnpm verify:build-0` |

**Node:** 20 (CI) | **pnpm:** 9 (CI) | **packageManager pin:** `pnpm@9.15.4` (root)

---

## Build metrics

Measured on 2026-06-26 via `pnpm verify:build-0` (Windows, Node 20):

| Step | Duration |
|------|----------|
| `pnpm install --frozen-lockfile` | 14.7s |
| `pnpm build` | 160.2s |
| `pnpm typecheck` | 58.9s |
| `pnpm test` | 10.9s |
| **Total verify** | **~245s** |

**Packages built:** 11 (core, observability, config, database, ui, engines, shared, auth, session, memory, orchestrator)

**Excluded from build:** `apps/gateway` (quarantined)

---

## Test metrics

| Metric | Value |
|--------|-------|
| Test files | 2 |
| Tests | 8 |
| Passed | 8 |
| Failed | 0 |
| Duration | ~4–11s (after build) |

| File | Tests |
|------|-------|
| `packages/core/src/index.test.ts` | 6 |
| `services/orchestrator/src/pipeline-runner.test.ts` | 2 |

---

## Repository health

| Area | Status |
|------|--------|
| Git repository | Healthy; BAR commit `1d14a5f`; tags `build-0-authorized`, `architecture-freeze-v1.0` |
| Workspace layout | 13 projects (`packages/*`, `services/*`, `apps/*`) |
| Lockfile | Synchronized; frozen install passes |
| Governance corpus | Frozen; CODEOWNERS on frozen paths |
| Prototype disposition | Quarantine and realign — unchanged |
| Developer onboarding | `pnpm install` → `pnpm verify:build-0` from root |
| Build-0 gates (B-01–B-10, B-19–B-21) | Complete per [checklist](build-authorization-checklist-v1.0.md) |

---

## Build-1 readiness assessment

### Engineering foundation: **READY**

The engineering environment is stable enough that Build-1 implementation should not be blocked by install, build, typecheck, or test infrastructure failures on a clean clone.

### Build-1 authorization: **NOT RECOMMENDED YET**

Per [build-1-implementation-plan-v1.0.md](build-1-implementation-plan-v1.0.md) and [build-authorization-checklist-v1.0.md](build-authorization-checklist-v1.0.md), the following **must be satisfied before a Build-1 BAR**:

| Prerequisite | Status |
|--------------|--------|
| Build-0 complete | **Complete** (this report) |
| Build-1 BAR (B-10) | **Not issued** — separate from Build-0 BAR |
| B-14–B-18 (threat model, tenant tests, DR, runbooks) | **Remaining** |
| B-29–B-30 (observability scaffold) | **Remaining** |
| Prototype discard plan acknowledged | Documented; execution in Build-1 |

### Recommendation

1. **Accept Build-0 completion** — engineering stabilization objectives met.
2. **Commit Build-0 infrastructure changes** — lockfile, vitest centralization, verify script, CI alignment.
3. **Open Build-1 authorization package** — address B-14–B-18 and B-29–B-30 before issuing Build-1 BAR.
4. **Do not begin UXMD screen implementation** until Build-1 BAR is issued.

---

## Verification reproduction

```bash
git clone <repository>
cd conquest
pnpm install
pnpm verify:build-0
```

Expected: `Build-0 verification PASSED` with install, build, typecheck, and test metrics.

---

*Build-0 completion report v1.0 — engineering baseline for Build-1. 2026-06-26.*
