# Conquest Implementation



**Build-1 authorized** per [BAR-2026-06-26-001](governance/build-authorization-record-build-1-2026-06-26.md). Milestone 1 in progress.



## Status



| Item | Path |

|------|------|

| Build-1 BAR (issued) | [`governance/build-authorization-record-build-1-2026-06-26.md`](governance/build-authorization-record-build-1-2026-06-26.md) |

| Build-1 authorization package | [`governance/build-1-authorization-package-v1.0.md`](governance/build-1-authorization-package-v1.0.md) |

| Milestone 1 plan | [`governance/build-1-milestone-1-plan-v1.0.md`](governance/build-1-milestone-1-plan-v1.0.md) |

| Build-0 completion | [`governance/build-0-completion-report-v1.0.md`](governance/build-0-completion-report-v1.0.md) |

| Build gate checklist | [`governance/build-authorization-checklist-v1.0.md`](governance/build-authorization-checklist-v1.0.md) |



## Engineering



```bash

pnpm install

pnpm verify:build-0    # packages/services CI parity

pnpm dev               # @conquest/web — authorized app shell

```



## Active work (Milestone 1)



| Package | Purpose |

|---------|---------|

| `packages/gis` | GIS tokens + navigation constants (UXMD-III) |

| `packages/presentation` | Shared shell components |

| `apps/web` | Application shell, routing, auth scaffold |



## Authority



`CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → RTM → Architecture Freeze`

