# CI Law Mapping — B-21

| Field | Value |
|-------|-------|
| **Gate** | SDD-V §11.1 B-21 — EL, IL, INF, AI, ENG law CI mapping |
| **Authority** | SDD-V Part 13 §13.2 |
| **Version** | 1.0 (Build-0 scaffold) |
| **Date** | 2026-06-26 |

## Purpose

Map frozen engineering laws to automatable CI checks. Build-0 implements scaffold checks; full enforcement expands per build phase.

## Law tier → CI enforcement

| Tier | Laws | Build-0 CI check | Build phase |
|------|------|------------------|-------------|
| **ENG** | ENG-1, ENG-2, ENG-6, ENG-10, ENG-12, ENG-20 | Docs present; no secrets in diff; workflow exists | Build-0 |
| **EL** | EL-1–EL-5 (layer boundaries) | Dependency import lint (scaffold) | Build-0 → Build-1 |
| **IL** | IL-1, IL-2 | Contract tests (scaffold) | Build-2 |
| **INF** | INF-1, INF-10, INF-13 | Security scan gate | Build-1 |
| **AI** | AI-2, AI-4, AI-10 | Stage-order + VRF bypass tests | Build-2 |

## Build-0 automated checks (`.github/workflows/ci.yml`)

| Check | Law | Method |
|-------|-----|--------|
| TypeScript compile | ENG-3 | `pnpm typecheck` |
| Unit tests | ENG-15 | `pnpm test` |
| No `.env` committed | ENG-10 | Path filter in workflow |
| Architecture docs exist | ENG-6 | Verify `docs/architecture/ARCHITECTURE-FREEZE.md` |
| Build Authorization Record present | ENG-20 | `docs/governance/build-authorization-record-build-0-2026-06-21.md` exists |

## Build-1 additions (planned)

| Check | Law |
|-------|-----|
| ESLint boundary rules | EL-1–EL-5, ENG-12 |
| `pnpm audit` / dependency policy | ENG-24 |
| A11y scan on UI PRs | ENG-23 |

## Build-2 additions (planned)

| Check | Law |
|-------|-----|
| Stage-order golden test | AI-2, RTM-INT-002 |
| VRF bypass attempt fails | AI-4, ENG-22 |
| Memory write authority test | IL-2, AI-9 |

## RTM synchronization

RTM row status updates occur at Build Authorization per ENG-5. CI does not modify RTM — it verifies traceability evidence.

## Related

- [SDD-V Part 13](../sdd/volume-v-engineering-standards-build-governance.md)
- [Build Authorization Checklist](build-authorization-checklist-v1.0.md)
