# Repository Structure Approval — B-19

| Field | Value |
|-------|-------|
| **Gate** | SDD-V §11.1 B-19 — Repository structure approved |
| **Version** | 1.0 |
| **Date** | 2026-06-21 |
| **Status** | **APPROVED for Build-0** — signature pending on Build Authorization Record |
| **Validation** | [`build-0-authorization-package-v1.0.md`](build-0-authorization-package-v1.0.md) §4 |

## SDD-V Part 2 logical layout

| Logical area (SDD-V §2.1) | Purpose |
|---------------------------|---------|
| `presentation/` | UXMD-II screens, GIS |
| `application/` | PDD-II module bounded contexts |
| `domain/` | PDD use cases |
| `orchestration/` | Cycle routing — no conclusion |
| `intelligence/` | Engines — provider abstraction |
| `execution/` | L5E adapters |
| `platform/` | Auth, notifications, billing |
| `integration/` | External adapters |
| `data/` | Memory Manager, stores |
| `docs/` | Authoritative architecture only |

Exact directory names are implementation choices — **boundaries are not**.

## Approved documentation layout

```
docs/
  architecture/   # CCIS, AMD, ADR, Freeze, FAA, RTM
  pdd/            # PDD I–II, Authority Bridge
  uxmd/           # UXMD I–III, Document X
  sdd/            # SDD I–V
  governance/     # Build gates, alignment, CI mapping
  archive/        # Superseded historical material
```

## Prototype → logical mapping (interim)

Until Build-0 realignment, the quarantined prototype maps as follows:

| Prototype path | Target logical area | Notes |
|----------------|---------------------|-------|
| `apps/gateway/` | `integration/` + `presentation/` (preview only) | Not UXMD app |
| `services/orchestrator/` | `orchestration/` | Spike — not SDD-IV System Coordinator |
| `packages/engines/` | `intelligence/` | Spike — lifecycle gaps vs ADR-0007 |
| `packages/database/`, `services/memory/` | `data/` | Spike — schema not IL-2 governed |
| `services/auth/`, `services/session/` | `platform/` | Spike |
| `packages/core/` | Shared contracts | Spike |
| `packages/ui/` | `presentation/` tokens | Subordinate to UXMD-III GIS |

## Approval statement

Upon Build Authorization for **Build-0**, the program architecture authority approves:

1. Documentation layout as listed above.
2. Prototype quarantine per [`PROTOTYPE.md`](../../PROTOTYPE.md).
3. Gradual realignment of code paths to SDD-V §2.1 during Build-0 — no big-bang rename without ADR.

**Signature:** Pending Build Authorization Record §7.
