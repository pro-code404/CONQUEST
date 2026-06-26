# Conquest UXMD Corpus

## Document Hierarchy

```
CCIS → AMD I–IV → PDD I–II (+ Authority Bridge) → UXMD I–III → Document X → SDD I–V → ADR → Governance → Build Authorization → Build
```

## UXMD Volumes

| Volume | Title | Status | Defines |
|--------|-------|--------|---------|
| **Volume I** | [User Experience Master Document](volume-i-user-experience-master-document.md) | 🔵 v1.0 — draft | Experience philosophy, journeys, navigation, trust |
| **Volume III** | [Global Interaction Standards (GIS)](volume-iii-global-interaction-standards.md) | ✅ v1.0 | Inherited states, permissions, a11y, mobile, notifications, interactions |
| **Volume II** | [Screen and Interaction Specification](volume-ii-screen-interaction-specification.md) | 🔵 v1.1 — revision | 102 screens — inherits GIS unless override |
| **Document X** | [Product Experience & Operational Details](document-x-product-experience-operational-details.md) | ✅ v1.0 — **APPROVED** | Operational UX polish — subordinate to GIS |
| **Final Review** | [UXMD Final Review Checklist](uxmd-final-review-checklist.md) | ✅ Re-run 2026-06-21 | **APPROVED FOR SDD** (conditional) |

## Reading Order

1. **CCIS** — Intelligence philosophy
2. **PDD Volume I–II** — Behavior and modules
3. **UXMD Volume I** — Experience philosophy
4. **UXMD Volume III** — Global standards (read before Volume II)
5. **UXMD Volume II** — Every screen, route, and interaction
6. **Document X** — Operational product experience details (subordinate to GIS)

## GIS Inheritance Model

UXMD Volume III defines universal standards. UXMD Volume II screens inherit GIS by default and declare only screen-specific behavior and **GIS Overrides**. Document X fills operational gaps where UXMD-II is silent — it does not override GIS or screen specs.

## Locked Sequence

```
UXMD Approved (conditional) → Document X complete → SDD I–V complete → Build Authorization → Build
```

**Document X approved 2026-06-26.** SDD program complete. Build not authorized.
