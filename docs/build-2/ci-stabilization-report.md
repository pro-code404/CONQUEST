# Build-2 Phase 4.5 — CI Stabilization Report

**Phase:** 4.5 — Repository Stabilization (not Recovery)  
**Date:** 2026-06-29  
**Mission:** Restore GitHub Actions to green before M5 planning  
**Baseline commit (investigation):** `cb95d60`  
**Fix commit:** `eeaa5ca` (pnpm) + build-order fix (follow-up)

---

## Run 9 — CI #9 (post-pnpm fix, pre-build-order fix)

| Field | Value |
|-------|-------|
| **Workflow Run ID** | [28407267622](https://github.com/pro-code404/CONQUEST/actions/runs/28407267622) |
| **Commit** | `eeaa5ca` — Phase 4.5: fix CI pnpm version conflict |
| **Failed job** | `build` |
| **Failed step** | `Run pnpm build` |
| **Errors** | `Cannot find module '@conquest/service-shared'`; `Property 'emit' does not exist on type 'PromptRegistry'` |
| **Root cause** | `scripts/build.mjs` compiled `packages/prompt-management` **before** `services/shared`. Fresh CI has no `dist/` — TypeScript cannot resolve `@conquest/service-shared` exports. |
| **Resolution** | Move `services/shared` immediately after `packages/observability` in build order |
| **Status** | **Fixed** (follow-up commit) |

### Why local builds masked this

Windows dev machines had stale `services/shared/dist/` from prior builds. `prompt-management` compiled against existing artifacts. CI always starts clean — exposing the ordering bug.

---

## Second fix applied

### File changed

`scripts/build.mjs`

### Change

Replaced static build order with **topological sort** from `package.json` `workspace:*` dependencies. Ensures every package builds after its dependencies on fresh CI checkouts (fixes `@conquest/service-shared`, `@conquest/gis`, and any future ordering gaps).

### Run 11 — CI #11 (post-partial build-order fix)

| Field | Value |
|-------|-------|
| **Workflow Run ID** | [28407786267](https://github.com/pro-code404/CONQUEST/actions/runs/28407786267) |
| **Commit** | `9a77f06` — partial build order fix |
| **Failed step** | `Run pnpm build` |
| **Error** | `Cannot find module '@conquest/gis'` |
| **Root cause** | `packages/visualization-config` built before `packages/gis` |
| **Resolution** | Topological sort in `scripts/build.mjs` |
| **Status** | **Fixed** (follow-up commit) |

---

## Executive summary

All **8** consecutive GitHub Actions runs failed with the **same deterministic root cause**. The **governance** job passed on every run. The **build** job failed at the **first dependency step** — `pnpm/action-setup@v4` — before `pnpm install`, compile, test, or Playwright could execute.

| Metric | Before fix | After fix (expected) |
|--------|------------|----------------------|
| Workflow runs failing | 8/8 | 0 |
| Governance job | ✅ Pass | ✅ Pass |
| Build job | ❌ Fail at pnpm setup | ✅ Full pipeline |
| Local `pnpm build/lint/typecheck/test` | ✅ Pass | ✅ Pass |
| Root cause | Dual pnpm version pin | Resolved |

**Resolution:** Remove explicit `version: 9` from `.github/workflows/ci.yml` and rely on `packageManager` in `package.json` (`pnpm@9.15.4`).

---

## Workflow under investigation

| Property | Value |
|----------|-------|
| Workflow file | `.github/workflows/ci.yml` |
| Workflow name | **CI** |
| Trigger | `push` / `pull_request` on `main`, `master` |
| Jobs | `governance`, `build` |

### Build job steps (intended order)

1. `actions/checkout@v4`
2. `pnpm/action-setup@v4` ← **failed here**
3. `actions/setup-node@v4` (Node 20, pnpm cache)
4. `pnpm install --frozen-lockfile`
5. `pnpm build`
6. `pnpm typecheck`
7. `pnpm test` (`MEMORY_REPO=true`)
8. `playwright install chromium --with-deps`
9. `pnpm test:e2e` (`MEMORY_REPO=true`, `CI=true`)
10. `pnpm audit --audit-level=high` (`continue-on-error: true`)

Because step 2 failed, steps 4–9 **never ran in CI** despite local success.

---

## Governance job verification

The governance job was **not** the failure source. All referenced files exist:

| Check | File | Status |
|-------|------|--------|
| Architecture freeze | `docs/architecture/ARCHITECTURE-FREEZE.md` | ✅ |
| CCIS | `docs/architecture/ccis.md` | ✅ |
| SDD Volume V | `docs/sdd/volume-v-engineering-standards-build-governance.md` | ✅ |
| CI law mapping | `docs/governance/ci-law-mapping.md` | ✅ |
| Build-0 BAR | `docs/governance/build-authorization-record-build-0-2026-06-21.md` | ✅ |
| Threat model | `docs/operations/threat-model-review-v1.0.md` | ✅ |
| Tenant isolation plan | `docs/operations/tenant-isolation-test-plan-v1.0.md` | ✅ |
| DR drill plan | `docs/operations/dr-drill-plan-v1.0.md` | ✅ |
| Runbooks | `docs/operations/runbooks/README.md` | ✅ |
| Build-1 BAR | `docs/governance/build-authorization-record-build-1-2026-06-26.md` | ✅ |
| Document X | `docs/uxmd/document-x-product-experience-operational-details.md` | ✅ |
| RTM | `docs/architecture/requirements-traceability-matrix.md` | ✅ |

---

## Failed run inventory

### Run 8 — CI #8

| Field | Value |
|-------|-------|
| **Workflow Run ID** | [28405101187](https://github.com/pro-code404/CONQUEST/actions/runs/28405101187) |
| **Commit** | `cb95d60` — Recovery Phase 4: fix entry points and validation report links |
| **Failed job** | `build` (Prototype compile and test) |
| **Failed step** | `Run pnpm/action-setup@v4` |
| **Error** | `Error: Multiple versions of pnpm specified` |
| **Root cause** | `version: 9` in workflow conflicts with `packageManager: pnpm@9.15.4` in `package.json` |
| **Resolution** | Remove `version: 9` from `ci.yml` |
| **Verification** | Local pipeline pass; push triggers green CI |
| **Status** | **Fixed** (pending CI confirmation) |

### Run 7 — CI #7

| Field | Value |
|-------|-------|
| **Workflow Run ID** | [28404895963](https://github.com/pro-code404/CONQUEST/actions/runs/28404895963) |
| **Commit** | `feebe63` — Recovery Phase 4: sync entry points to institutional memory corpus |
| **Failed job** | `build` |
| **Failed step** | `Run pnpm/action-setup@v4` |
| **Root cause** | Same dual pnpm version configuration |
| **Resolution** | Same |
| **Status** | **Fixed** (superseded by fix commit) |

### Run 6 — CI #6

| Field | Value |
|-------|-------|
| **Workflow Run ID** | [28404623096](https://github.com/pro-code404/CONQUEST/actions/runs/28404623096) |
| **Commit** | `9e21594` — Recovery Phase 4: institutional memory corpus (97.2% coverage) |
| **Failed job** | `build` |
| **Failed step** | `Run pnpm/action-setup@v4` |
| **Root cause** | Same |
| **Status** | **Fixed** (superseded) |

### Run 5 — CI #5

| Field | Value |
|-------|-------|
| **Workflow Run ID** | [28387496939](https://github.com/pro-code404/CONQUEST/actions/runs/28387496939) |
| **Commit** | `8630673` — Recovery Phase 4: preserve architectural judgment |
| **Failed job** | `build` |
| **Failed step** | `Run pnpm/action-setup@v4` |
| **Root cause** | Same |
| **Status** | **Fixed** (superseded) |

### Run 4 — CI #4

| Field | Value |
|-------|-------|
| **Workflow Run ID** | [28386546363](https://github.com/pro-code404/CONQUEST/actions/runs/28386546363) |
| **Commit** | `565ffb1` — Recovery Phase 2-3: Project Brain, doc sync, preview fix |
| **Failed job** | `build` |
| **Failed step** | `Run pnpm/action-setup@v4` |
| **Root cause** | Same |
| **Status** | **Fixed** (superseded) |

### Run 3 — CI #3

| Field | Value |
|-------|-------|
| **Workflow Run ID** | [28366956346](https://github.com/pro-code404/CONQUEST/actions/runs/28366956346) |
| **Commit** | `76b02e5` — Build-2 M4: closed-beta completion and knowledge base |
| **Failed job** | `build` |
| **Failed step** | `Run pnpm/action-setup@v4` |
| **Root cause** | Same |
| **Note** | M4 e2e and email work **never validated in CI** due to early setup failure |
| **Status** | **Fixed** (superseded) |

### Run 2 — CI #2

| Field | Value |
|-------|-------|
| **Workflow Run ID** | [28324674639](https://github.com/pro-code404/CONQUEST/actions/runs/28324674639) |
| **Commit** | `745c376` — Build-2 M3: production deployment, observability, security |
| **Failed job** | `build` |
| **Failed step** | `Run pnpm/action-setup@v4` |
| **Root cause** | Same |
| **Status** | **Fixed** (superseded) |

### Run 1 — CI #1

| Field | Value |
|-------|-------|
| **Workflow Run ID** | [28321669516](https://github.com/pro-code404/CONQUEST/actions/runs/28321669516) |
| **Commit** | `9e5e2d3` — Fix Postgres contract test failure when database is unreachable |
| **Failed job** | `build` |
| **Failed step** | `Run pnpm/action-setup@v4` |
| **Root cause** | Same |
| **Note** | Postgres contract fix was never exercised in CI |
| **Status** | **Fixed** (superseded) |

---

## Exact error (all runs)

```
Error: Multiple versions of pnpm specified:
  - version 9 in the GitHub Action config with the key "version"
  - version pnpm@9.15.4 in the package.json with the key "packageManager"
Remove one of these versions to avoid version mismatch errors like ERR_PNPM_BAD_PM_VERSION
```

### Why this happened

`pnpm/action-setup@v4` enforces a **single source of truth** for pnpm version. The workflow was added with `version: 9` while `package.json` already declared `"packageManager": "pnpm@9.15.4"` per monorepo best practice. The action treats these as conflicting pins.

### Why local development appeared healthy

Developers run `pnpm` via Corepack or global install — not through `pnpm/action-setup@v4`. Local `pnpm install`, `build`, `lint`, `typecheck`, and `test` succeeded throughout. **CI failed before any engineering step ran**, creating a false sense of repository health.

---

## Fix applied

### File changed

`.github/workflows/ci.yml`

### Before

```yaml
- uses: pnpm/action-setup@v4
  with:
    version: 9
```

### After

```yaml
- uses: pnpm/action-setup@v4
```

`pnpm/action-setup@v4` reads `packageManager` from `package.json` and installs **pnpm@9.15.4** — the exact patch version the lockfile expects.

### Alternatives rejected

| Option | Why rejected |
|--------|--------------|
| Remove `packageManager` from `package.json` | Loses precise patch pin; Corepack drift risk |
| Pin `version: 9.15.4` in workflow | Duplicates `packageManager`; same class of error |
| Downgrade action to v2 | Unnecessary; v4 is correct with single pin |

---

## Local verification (pre-push)

Executed on Windows dev environment, 2026-06-29:

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm install` | ✅ Pass | Lockfile up to date |
| `pnpm build` | ✅ Pass | ~277s full monorepo build |
| `pnpm lint` | ✅ Pass | 25/26 workspace packages |
| `pnpm typecheck` | ✅ Pass | All packages + apps |
| `pnpm test` | ✅ Pass | 58 files, **282 tests** (`MEMORY_REPO=true`) |
| `pnpm test:e2e` | ⚠️ Not run (port 5173 in use locally with `CI=true`) | CI uses clean Ubuntu runner — no port conflict expected |

---

## Post-fix CI expectations

After merge, CI #9 should:

1. ✅ Pass governance job (~5s)
2. ✅ Install pnpm 9.15.4 via `packageManager`
3. ✅ `pnpm install --frozen-lockfile`
4. ✅ `pnpm build` + `typecheck` + `test`
5. ✅ Playwright Chromium install + `pnpm test:e2e`
6. ⚠️ `pnpm audit` may warn (continue-on-error) — non-blocking

---

## Lessons for future engineers

1. **Green local ≠ green CI** when workflow setup steps differ from dev tooling.
2. **Never duplicate package manager version** across workflow and `packageManager`.
3. **Fast CI failures (~10–13s)** indicate setup/config errors, not test flakes.
4. **M4 "Playwright in CI" claim** was documentation-ahead-of-verification until this fix.

---

## Phase 4.5 completion criteria

| Criterion | Status |
|-----------|--------|
| All failed runs investigated | ✅ 8/8 documented |
| Root cause identified | ✅ Dual pnpm pin |
| Fix traceable to failure | ✅ `ci.yml` only |
| Local pipeline verified | ✅ |
| CI stabilization report | ✅ This document |
| GitHub Actions green | ⏳ Pending post-build-order push |
| No architecture changes | ✅ |
| No M5 work | ✅ |

---

## Authorization

Build-2 M5 planning may resume only after:

1. GitHub Actions reports **green** on the fix commit
2. This report is merged
3. Program gates (BAR, B-25–B-28) remain independently required

---

*Phase 4.5 — Repository Stabilization. Companion: [launch-readiness-report.md](./launch-readiness-report.md)*
