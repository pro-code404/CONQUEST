# Conquest Architecture

The architecture of Conquest is documented in layers of understanding and governed by an **Architecture Freeze** and **ADR program**.

## Final Architecture Audit (FAA)

**[`final-architecture-audit-v1.0.md`](final-architecture-audit-v1.0.md)** — v1.0 (2026-06-21)

**Verdict:** Architecture Transition Program complete. **Build-0 complete** — [`../governance/build-authorization-record-build-0-2026-06-21.md`](../governance/build-authorization-record-build-0-2026-06-21.md). **Build-1 authorized; Build-2 M4 complete** (integration-first program).

## Architecture Freeze

**[`ARCHITECTURE-FREEZE.md`](ARCHITECTURE-FREEZE.md)** — v1.0 (2026-06-21)

## Requirements Traceability Matrix

**[`requirements-traceability-matrix.md`](requirements-traceability-matrix.md)** — v1.1 — Master verification artifact (78 requirements)

Formal declaration of locked architectural elements (CCIS, AMD I–IV, PDD, UXMD, SDD I–V), change-control process, versioning rules, and infrastructure conformance requirements.

**SDD program complete.** Build requires explicit Build Authorization (SDD-V Part 11).

## Architecture Decision Records (ADR)

**[`adr/README.md`](adr/README.md)** — ADR program index (**38 Accepted** decisions: ADR-0001–0038)

| Resource | Purpose |
|----------|---------|
| [`adr/template.md`](adr/template.md) | Template for new ADRs |
| [`adr/0001`–`0038`](adr/) | Frozen architectural decisions |

## Governance hierarchy

**Canonical authority** (where documents conflict, higher prevails):

```
CCIS
  ↓
AMD Volumes I–IV
  ↓
PDD Volumes I–II (+ Authority Bridge)
  ↓
UXMD Volumes I–III
  ↓
Document X (operational UX — subordinate to GIS)
  ↓
SDD Volumes I–V
  ↓
ADR Program (0001–0038)
  ↓
Governance (build gates, alignment)
  ↓
Build Authorization (Build-0 BAR; Build-1 BAR-2026-06-26-001)
  ↓
Build-1 / Build-2 (M4 complete — closed-beta readiness)
```

See [ADR-0001](adr/0001-document-authority-hierarchy.md) for rationale.

## Intelligence foundation

| Document | Question | Scope |
|----------|----------|-------|
| [`ccis.md`](ccis.md) | **What is the intelligence foundation?** | Supreme authority — identity, evidence, reasoning, memory, learning, laws |
| [`cognitive-pipeline.md`](cognitive-pipeline.md) | **What is the nervous system?** | Ten-phase runtime loop — subordinate to CCIS (see AMD IV §69) |
| [`how-conquest-thinks.md`](how-conquest-thinks.md) | **How does Conquest think?** | Reasoning, confidence, prediction, HUE, multimodal, live reasoning |
| [`how-conquest-evolves.md`](how-conquest-evolves.md) | **How does Conquest evolve?** | First Law, self-improvement, routing, failure detection, safety boundaries |

## AMD (Architectural Authority)

| Volume | Path | Status |
|--------|------|--------|
| I — Critical Expansion | [`amd/volume-i-critical-architectural-expansion.md`](amd/volume-i-critical-architectural-expansion.md) | v1.0 — frozen |
| II — Layer Model | [`amd/volume-ii-architectural-layer-model.md`](amd/volume-ii-architectural-layer-model.md) | v1.0 — frozen |
| III — Memory | [`amd/volume-iii-memory-architecture.md`](amd/volume-iii-memory-architecture.md) | v1.0 — frozen |
| IV — Intelligence | [`amd/volume-iv-intelligence-systems.md`](amd/volume-iv-intelligence-systems.md) | v1.0 — frozen |

## Product & experience (frozen)

| Corpus | Path |
|--------|------|
| PDD-I + Bridge | [`../pdd/`](../pdd/README.md) |
| UXMD I–III | [`../uxmd/`](../uxmd/README.md) |
| Document X | [`../uxmd/document-x-product-experience-operational-details.md`](../uxmd/document-x-product-experience-operational-details.md) |

## Engineering (SDD program complete)

| Volume | Path | Status |
|--------|------|--------|
| SDD I | [`../sdd/volume-i-system-architecture.md`](../sdd/volume-i-system-architecture.md) | v1.1 — frozen |
| SDD II | [`../sdd/volume-ii-data-intelligence-architecture.md`](../sdd/volume-ii-data-intelligence-architecture.md) | v1.2 — frozen |
| SDD III | [`../sdd/volume-iii-infrastructure-security-architecture.md`](../sdd/volume-iii-infrastructure-security-architecture.md) | v1.0 — frozen |
| SDD IV | [`../sdd/volume-iv-ai-orchestration-agent-architecture.md`](../sdd/volume-iv-ai-orchestration-agent-architecture.md) | v1.0 — frozen |
| SDD V | [`../sdd/volume-v-engineering-standards-build-governance.md`](../sdd/volume-v-engineering-standards-build-governance.md) | v1.0 — frozen |

**Build-0 authorized** until Build-1 BAR per SDD-V Part 11.

## Subordinate / archived

| Path | Note |
|------|------|
| [`../archive/sdd/system-design-document-v2.0-superseded.md`](../archive/sdd/system-design-document-v2.0-superseded.md) | SDD v2.0 monolith — archived |
| [`../archive/pdd/product-design-document-v1.0-superseded.md`](../archive/pdd/product-design-document-v1.0-superseded.md) | PDD v1.0 interim — archived |
| [`../archive/design-pre-uxmd/`](../archive/design-pre-uxmd/) | Pre-UXMD design — archived |
| [`../design/README.md`](../design/README.md) | Retired path — redirects to archive |
| [`../IMPLEMENTATION.md`](../IMPLEMENTATION.md) | Build not authorized — stub |
| [`../../PROTOTYPE.md`](../../PROTOTYPE.md) | Quarantined pre-authorization code |
| [`../archive/README.md`](../archive/README.md) | Archive index |

## The First Law

> Conquest is never finished. Every interaction is an opportunity to improve the operating system. Every success strengthens future intelligence. Every mistake creates a correction. Every correction becomes permanent knowledge unless disproven.

## Agent entry point

All agents begin with [`../../AGENTS.md`](../../AGENTS.md).

## Change control

| Class | Action |
|-------|--------|
| **Frozen element change** | ADR → document amendment → freeze update |
| **Errata** | Targeted fix — see freeze §7 errata log |

---

*Architecture README — updated 2026-06-21 for Repository Alignment Phase B*
