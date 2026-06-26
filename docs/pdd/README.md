# Conquest Product Design Document (PDD) Corpus

## Document Hierarchy

```
CCIS → AMD I–IV → PDD I–II (+ Authority Bridge) → UXMD I–III → Document X → SDD I–V → ADR → Governance → Build Authorization → Build
```

See [`../architecture/ARCHITECTURE-FREEZE.md`](../architecture/ARCHITECTURE-FREEZE.md) for frozen corpus and change control.

## PDD Volumes

| Volume | Title | Status | Defines |
|--------|-------|--------|---------|
| **Volume I** | [Product Behavior Architecture](volume-i-product-behavior-architecture.md) | v2.0 — conditional authority | Workflows — see [Authority Bridge](pdd-volume-i-authority-bridge.md) |
| **Authority Bridge** | [PDD-I Authority Bridge](pdd-volume-i-authority-bridge.md) | v1.0 — frozen | Resolves PDD-I review vs UXMD hierarchy |
| **Volume I Review** | [Architectural Review Checklist](pdd-volume-i-review-checklist.md) | Executed 2026-06-21 | Review artifact |
| **Volume II** | [Module Specifications Document (MSD)](volume-ii-module-specifications.md) | v1.0 draft — frozen | Module boundaries and nav |

## Superseded material

Early PDD v1.0 catalog archived: [`../archive/pdd/product-design-document-v1.0-superseded.md`](../archive/pdd/product-design-document-v1.0-superseded.md)

## Reading Order

1. **Volume I** + **Authority Bridge** — Product behavior
2. **Volume II** — Module specifications (MSD)
3. **UXMD** — User experience

## What PDD Is Not

- Not architecture (AMD)
- Not engineering (SDD)
- Not visual design (UXMD)
- Not implementation (requires Build Authorization)
