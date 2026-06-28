# Master Specification Consolidation Plan

**Objective:** Reduce prompt ambiguity for future implementation by consolidating the frozen corpus into authoritative master references — without duplicating existing documents.

**Principle:** Master documents **point to** frozen sources; they do not replace CCIS, SDD, PDD, UXMD, RTM, or ADRs.

---

## Current Corpus (frozen, authoritative)

```
CCIS (supreme)
  └── AMD I–IV
        └── PDD I–II + Authority Bridge
              └── UXMD I–III + Document X
                    └── SDD I–V
                          └── RTM v1.1 (78 rows)
                                └── ADRs 0001–0038
```

**Build governance:** Build-0 BAR, Build-1 BAR (active). Build-2 BAR template exists; not yet issued.

**Known staleness (do not treat as truth):**
- `docs/architecture/README.md` — pre-Build-1
- `docs/sdd/README.md` — "Build not authorized" (contradicts Build-1 BAR)
- `docs/architecture/adr/README.md` — ends at ADR-0035 (0036–0038 exist)
- `docs/IMPLEMENTATION.md` — Build-1 only

---

## Proposed Master Documents

Six master references. Each is a **single entry point** with scope, authority chain, and links — not a copy of underlying volumes.

### 1. Master Product Requirements Document (MPRD)

| Field | Value |
|-------|-------|
| **Path** | `docs/master/mprd.md` |
| **Consolidates** | PDD I–II, UXMD I (behavioral laws), CCIS Parts B–F, RTM Part C (PDD rows) |
| **Purpose** | What Conquest does for users; module behaviors; approval workflows |
| **Does NOT duplicate** | 102 screen specs (link to UXMD-II index) |
| **Build-2 focus** | RTM-PDD-004–006 (user decision, outcomes, rollback); intelligence invisible nav law |

**Sections to author:**
1. Product mission and behavioral hierarchy (CCIS BH-*)
2. Module catalog with status (from integration matrix)
3. User journey requirements (onboarding → CC → intelligence)
4. Decision and approval requirements (D7, advisory framework)
5. Deferred capabilities (execution, Ask Conquest) with gate references
6. Link table: requirement ID → RTM row → ADR

### 2. Master Technical Architecture (MTA)

| Field | Value |
|-------|-------|
| **Path** | `docs/master/mta.md` |
| **Consolidates** | SDD I–III, AMD III–IV, ADR index, ARCHITECTURE-FREEZE, cognitive-pipeline.md |
| **Purpose** | Layer model, service boundaries, data flow, security zones |
| **Does NOT duplicate** | Full SDD volume text |

**Sections to author:**
1. Layer diagram (Presentation → Application → Domain → Infrastructure)
2. Service inventory with integration status (from integration matrix Part C)
3. Cognitive architecture (Phase 10–11 stack vs legacy PipelineRunner)
4. Tenant isolation model (current MEM → target Postgres RLS)
5. AI surface map (gateway, prompts, audit, cognitive orchestrator)
6. ADR decision index (0001–0038 one-line summaries)

### 3. Master Application Flow (MAF)

| Field | Value |
|-------|-------|
| **Path** | `docs/master/maf.md` |
| **Consolidates** | UXMD-II screen flows, GIS global states, route guards, onboarding path |
| **Purpose** | End-to-end user flows with route/API mapping |
| **Does NOT duplicate** | Per-screen interaction detail |

**Sections to author:**
1. Closed-beta demo flow (from launch readiness report) with route + API per step
2. Auth state machine (guest → verified → onboarding → app shell)
3. Route guard decision tree (`route-access.ts` behavior documented)
4. Settings navigation map (18 routes + administration gap)
5. Workspace module access (7-item nav + intelligence/research/operations pattern)
6. Error and degraded-state flows (GIS S-RECOVER)

### 4. Master Backend Data Model (MBDM)

| Field | Value |
|-------|-------|
| **Path** | `docs/master/mbdm.md` |
| **Consolidates** | SDD-II data architecture, `@conquest/database` schema, contracts DTOs, MemoryAuthRepository entities |
| **Purpose** | Entity model, persistence strategy, migration path |
| **Does NOT duplicate** | Drizzle schema file (link to `packages/database`) |

**Sections to author:**
1. Entity relationship overview (org, user, workspace, session, workflow, intelligence, research, audit)
2. Current in-memory model (`MemoryAuthRepository` maps)
3. Target Postgres schema mapping (existing Drizzle tables)
4. Tenant scoping rules per entity
5. Migration plan: MEM → Drizzle (ordered by demo impact)
6. Index and retention requirements

### 5. Master Integration Specification (MIS)

| Field | Value |
|-------|-------|
| **Path** | `docs/master/mis.md` |
| **Consolidates** | Integration matrix, API surface, contracts index, platform composition |
| **Purpose** | Authoritative wiring reference for Build-2 integration work |
| **Does NOT duplicate** | Full 104-endpoint list (link to integration-matrix.md) |

**Sections to author:**
1. API architecture (`apps/api` → services → platform)
2. Contract module index (25 modules → implementation → UI)
3. External integration points (email, OAuth, billing, AI providers) with status
4. Event and correlation ID propagation
5. Cache, queue, and cognitive pipeline integration diagram
6. Build-2 integration priorities (ordered)

### 6. Master Implementation Roadmap (MIR)

| Field | Value |
|-------|-------|
| **Path** | `docs/master/mir.md` |
| **Consolidates** | RTM Part H build phases, production blockers, Build-2 implementation roadmap |
| **Purpose** | What to build next, in what order, with exit criteria |
| **Does NOT duplicate** | Milestone task lists (link to `docs/build-2/implementation-roadmap.md`) |

**Sections to author:**
1. Build phase model (Build-0 through Build-3 from RTM)
2. Current state summary (Phase 11 complete)
3. Build-2 milestone overview with blocker mapping
4. RTM verification targets (69 Specified → Verified)
5. Governance gates (B-12, B-25–B-28)
6. Definition of done for closed beta

---

## Consolidation Workflow

| Step | Action | Owner | Output |
|------|--------|-------|--------|
| 1 | Refresh stale indexes (README, ADR index, IMPLEMENTATION.md) | Engineering | Updated cross-links |
| 2 | Author MIS + integration matrix (done) | Engineering | `docs/build-2/integration-matrix.md` |
| 3 | Author MBDM from database schema + memory repo audit | Engineering | `docs/master/mbdm.md` |
| 4 | Author MAF from route audit + launch readiness | Engineering | `docs/master/maf.md` |
| 5 | Author MTA from SDD-I + service inventory | Engineering | `docs/master/mta.md` |
| 6 | Author MPRD from PDD + UXMD behavioral laws | Product/Eng | `docs/master/mprd.md` |
| 7 | Author MIR from blockers + RTM | Engineering | `docs/master/mir.md` |
| 8 | Issue Build-2 BAR when B-12 rows closed | Governance | `docs/governance/build-authorization-record-build-2-*.md` |

**Rule:** When a master doc and a frozen volume conflict, the frozen volume wins. Master docs carry `last_synced` date and link to source commit/tag.

---

## Document Hierarchy (post-consolidation)

```
CCIS (unchanged — supreme)
Master docs (entry points — docs/master/)
  ├── mprd.md → PDD, UXMD-I
  ├── mta.md → SDD I–III, ADRs
  ├── maf.md → UXMD-II flows, GIS
  ├── mbdm.md → SDD-II, database package
  ├── mis.md → integration-matrix, contracts
  └── mir.md → RTM, build-2 roadmap
Build-2 working docs (docs/build-2/)
  ├── integration-matrix.md ✓
  ├── launch-readiness-report.md ✓
  ├── production-blockers.md ✓
  └── implementation-roadmap.md ✓
Frozen volumes (unchanged — source of truth)
Governance (BAR, checklists)
```

---

## Anti-patterns to avoid

- **Do not** copy SDD/UXMD text into master docs — link and summarize
- **Do not** create a seventh "master" doc for cognitive — use MTA + MIS + `cognitive-pipeline.md`
- **Do not** update ADRs during consolidation — only index them
- **Do not** mark RTM rows Verified until test evidence exists

---

*Step 2 complete. Steps 3–7 are Build-2 Milestone 1 documentation deliverables.*
