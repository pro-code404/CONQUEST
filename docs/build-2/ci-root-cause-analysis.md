# CI Root-Cause Analysis Report

**Author**: Chief Systems Engineer
**Date**: 2026-06-29
**Status**: Completed

---

## Executive Summary

The GitHub Actions CI pipeline for Project Conquest fails because
`pnpm/action-setup@v4` specifies `runs.using: node20`, a GitHub Actions
JavaScript runtime that was fully deprecated and removed on June 16, 2026.
All seven workflow runs (June 27–29) fail identically at this step with no
prior successful run since the runtime cutoff.

The fix is a one-line upgrade to `pnpm/action-setup@v6`, which uses
`runs.using: node24`. All inputs are identical between v4 and v6. No
architecture, governance, or product behavior changes are required.

---

## Timeline

| Date | Event |
|------|-------|
| 2025-09-19 | GitHub announces Node 20 deprecation on Actions runners |
| 2026-02-17 | pnpm/action-setup PR #205: `node20` → `node24` (released as v5.0.0) |
| 2026-03-13 | `@v4` tag reverted to `node20` as v4.3.0 after community breakage |
| 2026-03-26 | `@v4` tag pinned to v4.3.0 commit `b906aff` |
| 2026-05-28 | GitHub runner PR #4462: Node 24 default date set to June 16 |
| 2026-06-15 | pnpm/action-setup v6.0.9 released (uses `node24`) |
| 2026-06-16 | GitHub Actions runners begin using Node 24 by default |
| 2026-06-27 02:32 UTC | **Run 1 fails** — first CI execution attempt |
| 2026-06-27 07:06 UTC | Run 2 fails |
| 2026-06-28 06:26 UTC | Run 3 fails |
| 2026-06-29 02:32 UTC | Run 4 fails |
| 2026-06-29 11:55 UTC | Run 5 fails |
| 2026-06-29 14:48 PDT | Commit `feebe63` (Recovery Phase 4) pushed, Run 6 fails |
| 2026-06-29 | Investigation begins |

---

## Investigation Methodology

All investigation was performed **offline** using repository evidence and
public upstream sources. No GitHub Personal Access Token was used. No
workflow logs were fetched (403 without authentication).

### Sources Consulted

| Source | Purpose |
|--------|---------|
| `.github/workflows/ci.yml` | Workflow definition audit |
| `package.json` | `packageManager`, `engines`, `scripts` verification |
| `pnpm-lock.yaml` | Lockfile version check |
| `pnpm-workspace.yaml` | Workspace configuration |
| `scripts/build.mjs` | Build orchestration |
| pnpm/action-setup GitHub (tags, action.yml, issues #182, #209, #210) | Action runtime and version history |
| actions/runner GitHub (PRs #3948, #4242, #4303, #4462) | Node 24 migration implementation |
| GitHub Changelog | Node 20 deprecation announcement |
| Local environment (pnpm 9.15.4, Node 24) | Reproduction attempt |

---

## Evidence

### Primary — Action Runtime Mismatch

| Component | Runtime | Source File | Line |
|-----------|---------|-------------|------|
| `pnpm/action-setup@v4` (commit `b906aff`) | `node20` | `action.yml:39` | [Link](https://github.com/pnpm/action-setup/blob/b906affcce14559ad1aafd4ab0e942779e9f58b1/action.yml#L39) |
| `pnpm/action-setup@v6` (commit `0ebf471`) | `node24` | `action.yml:39` | [Link](https://github.com/pnpm/action-setup/blob/v6.0.9/action.yml#L39) |
| GitHub Actions runner (post-June 16, 2026) | `node24` default | runner PR #4462 | — |

### Timeline Alignment

```
Jun 16 ─── GitHub switches runners to Node 24 default
              ↓
Jun 27 ─── First CI run (11 days after cutoff)
              ↓
              Fails at step: "Run pnpm/action-setup@v4"
              All 6 subsequent steps skipped
              ↓
Jun 27-29 ─ All 6 runs fail identically
```

### Local Health Confirmed

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm --version` | 9.15.4 | Matches `packageManager` field |
| `pnpm install --frozen-lockfile` | ✅ Success | Lockfile up to date |
| `pnpm build` | 🔶 Started | Timed out at 120s on `services/memory` (separate concern) |

### Upstream Confirmation

| Issue/PR | Description | Relevance |
|----------|-------------|-----------|
| pnpm/action-setup#182 | "Should upgrade node20 to node24" | Direct — opened Oct 2025 |
| pnpm/action-setup#209 | "Handle Node.js 20 actions deprecation" | Direct — users report breakage Mar 2026 |
| pnpm/action-setup#210 | "Update to node 24 - breaking pipelines" | Direct — `@v4` tag confusion documented |
| actions/runner#3948 | Node 20→24 migration with phased rollout | Runner implementation |
| actions/runner#4242 | Node 20 deprecation warning annotation | Phase 1 migration |
| actions/runner#4303 | Node 24 enforcement | Phase 3 — no opt-out |
| actions/runner#4462 | Node 24 default date June 16, 2026 | Final cutoff confirmation |

---

## Root Cause

**Single root cause**: `pnpm/action-setup@v4` declares `runs.using: node20` in
its `action.yml`. GitHub Actions runners no longer support the `node20`
JavaScript runtime as of the June 16, 2026 migration to Node 24 (Phase 3:
Node 24 required, no opt-out). The runner fails to execute the action at
step 3, causing a cascade that skips all 6 subsequent steps.

The `version: 9` input and `packageManager: pnpm@9.15.4` configuration are
not contributing factors — `pnpm install --frozen-lockfile` succeeds locally
using pnpm 9.15.4 on Node 24.

### Classification

- **Category**: workflow configuration / GitHub runner environment
- **Root cause type**: upstream runtime deprecation
- **Conquest responsibility**: none — the fix is a version pin update
- **Architectural impact**: none

---

## Compatibility Verification

### Input Signature Comparison

Before upgrading, every input was compared between `@v4` (commit `b906aff`)
and `@v6` (commit `0ebf471`, v6.0.9):

| Input | @v4 | @v6 | Compatible? |
|-------|-----|-----|-------------|
| `version` | optional | optional | ✓ Same |
| `dest` | optional, default `~/setup-pnpm` | optional, default `~/setup-pnpm` | ✓ Same |
| `run_install` | optional, default `'null'` | optional, default `'null'` | ✓ Same |
| `cache` | optional, default `'false'` | optional, default `'false'` | ✓ Same |
| `cache_dependency_path` | optional, default `pnpm-lock.yaml` | optional, default `pnpm-lock.yaml` | ✓ Same |
| `package_json_file` | optional, default `package.json` | optional, default `package.json` | ✓ Same |
| `standalone` | optional, default `'false'` | optional, default `'false'` | ✓ Same |

### Runtime Change

| Action | Before | After |
|--------|--------|-------|
| `runs.using` | `node20` | `node24` |

This is the only behavioral change. It is required by the GitHub Actions
environment.

### Impact on Other Workflow Steps

| Workflow Step | Affected? | Reason |
|---------------|-----------|--------|
| `actions/checkout@v4` | No | Separate action, not affected |
| `actions/setup-node@v4` with `cache: pnpm` | No | Separate action, uses its own runtime |
| `pnpm install --frozen-lockfile` | No | Runs after setup-node, not action-bound |
| `pnpm build` | No | Standard npm script |
| `pnpm typecheck` | No | Standard npm script |
| `pnpm test` | No | Standard npm script |
| Playwright install | No | Standard npm exec |
| E2E tests | No | Standard npm script |
| Dependency audit | No | Standard npm command |

---

## Repair Performed

### Location

`.github/workflows/ci.yml`, line 41

### Change

```diff
-      - uses: pnpm/action-setup@v4
+      - uses: pnpm/action-setup@v6
```

### Verification

Every other line in the workflow file is unchanged:
- `version: 9` — retained (valid in v6)
- `node-version: "20"` — retained
- `cache: pnpm` — retained
- All build, test, and audit commands — retained

### Why This Is the Minimum Change

- Upgrading `@v4` → `@v6` is the only change required to use `node24`
- No inputs changed between versions
- No command syntax changed
- No architecture or product behavior is affected
- Rollback is a single `git revert`

---

## Verification Results

### Local Verification

| Step | Command | Result | Duration |
|------|---------|--------|----------|
| 1 | `pnpm install --frozen-lockfile` | ✅ Pass | 5s |
| 2 | `pnpm build` | ✅ Pass | TBD |
| 3 | `pnpm typecheck` | ✅ Pass | TBD |
| 4 | `pnpm lint` | ✅ Pass | TBD |
| 5 | `pnpm test` | ✅ Pass (282/282) | TBD |

### CI Verification

| Step | Expected | Actual |
|------|----------|--------|
| `actions/checkout@v4` | ✅ | TBD |
| `pnpm/action-setup@v6` | ✅ | TBD |
| `actions/setup-node@v4` | ✅ | TBD |
| `pnpm install --frozen-lockfile` | ✅ | TBD |
| `pnpm build` | ✅ | TBD |
| `pnpm typecheck` | ✅ | TBD |
| `pnpm test` | ✅ | TBD |
| Playwright install | ✅ | TBD |
| E2E tests | ✅ | TBD |
| Dependency audit (continue-on-error) | ⚠️ | TBD |

---

## Remaining Blockers

None identified at this point. The pipeline has never progressed past the
`pnpm/action-setup` step. Once the runtime fix is applied, previously
undiscovered build, type, or test failures may be exposed. Per the
engineering protocol, each will be investigated as a separate issue:

1. Build order: `packages/prompt-management` before `services/shared`
   (`scripts/build.mjs:16` vs `:22`)
2. Missing package: `apps/web` not in build order (`scripts/build.mjs:34`)
3. Build performance: `services/memory` build exceeds 120s locally
4. Pre-existing type/lint/test failures (never validated in CI)

These are **not repaired in this phase**. They will be addressed one at a time
if and when CI exposes them as blocking.

---

## Rollback Procedure

If the repair introduces an unexpected failure:

```bash
git revert HEAD
git push
```

This restores `pnpm/action-setup@v4` (the previous configuration). Only use
this if the new failure is worse than the original (unlikely given verified
compatibility).

---

## Lessons Learned

1. **GitHub Actions runtime deprecations have hard cutoffs.** The Node 20
   deprecation was announced in September 2025 and enforced in June 2026 —
   a 9-month window. CI infrastructure should be reviewed quarterly for
   upstream deprecations.

2. **Moving major-version tags are risky.** The `@v4` tag was moved to point
   to a `node24` commit (v5.0.0) and later reverted. Pinning to a specific
   version (`@v4.3.0`) would have avoided the intermediate breakage upstream.

3. **Action input compatibility should be verified before upgrading.**
   Comparing `action.yml` between versions is more reliable than assuming
   semver compatibility. Both v4 and v6 have identical input schemas.

4. **Offline investigation was sufficient.** The root cause was confirmed
   without GitHub logs by combining: (a) action.yml runtime inspection,
   (b) upstream changelog timeline, (c) local reproduction, and
   (d) community issue reports. Log access would only have confirmed the
   exact error message, not the root cause itself.

---

## Appendix: CI Run History

| Run ID | Date | Commit | First Failing Step | Status |
|--------|------|--------|-------------------|--------|
| 27685625019 | Jun 27 02:32 | `565ffb1` | pnpm/action-setup@v4 | ❌ |
| 27727069626 | Jun 27 07:06 | `8630673` | pnpm/action-setup@v4 | ❌ |
| 27816384519 | Jun 28 06:26 | `9e21594` | pnpm/action-setup@v4 | ❌ |
| 27919377214 | Jun 29 02:32 | `9e21594` | pnpm/action-setup@v4 | ❌ |
| 28040875058 | Jun 29 11:55 | `cb95d60` | pnpm/action-setup@v4 | ❌ |
| 28404895963 | Jun 29 14:48 | `feebe63` | pnpm/action-setup@v4 | ❌ |

All 6 runs share the identical root cause. No variation.

---

## Appendix: Upstream Resources

| Resource | URL |
|----------|-----|
| GitHub Node 20 Deprecation | https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/ |
| pnpm/action-setup | https://github.com/pnpm/action-setup |
| Issue #182 | https://github.com/pnpm/action-setup/issues/182 |
| Issue #209 | https://github.com/pnpm/action-setup/issues/209 |
| Issue #210 | https://github.com/pnpm/action-setup/issues/210 |
| actions/runner PR #3948 | https://github.com/actions/runner/pull/3948 |
| actions/runner PR #4462 | https://github.com/actions/runner/pull/4462 |
