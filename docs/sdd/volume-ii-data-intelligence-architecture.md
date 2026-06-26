# SDD VOLUME II — DATA & INTELLIGENCE ARCHITECTURE

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | SDD Volume II — Data & Intelligence Architecture |
| **Abbreviation** | SDD-II |
| **Status** | Engineering Architecture Authority — Volume 2 of 5 |
| **Version** | 1.2 |
| **Supreme Authority** | CCIS |
| **Subordinate To** | CCIS, AMD Volumes I–IV, SDD Volume I v1.1 |
| **Derived From** | CCIS, AMD I–IV, PDD I–II (+ Authority Bridge), UXMD I–III, SDD-I v1.1, Cognitive Pipeline |
| **Precedes** | SDD Volume III, IV, V; all implementation |

### Mission

Define **how information flows through Conquest** as definitive engineering architecture — every origin, owner, lifecycle, transition, validation, confidence relationship, permission, observability trace, history, and retirement rule for data, intelligence, memory, evidence, research, prediction, recommendation, learning, and knowledge.

| Document | Question |
|----------|----------|
| SDD Volume I | How is the platform engineered as a system? |
| **SDD Volume II** | **How does information behave as an engineered system?** |
| SDD Volume III | How is infrastructure and security engineered? |
| SDD Volume IV | How does AI orchestration and agent architecture work? |

### Engineering Principle

Information is **not static**. Every information object has: origin, owner, lifecycle, transitions, validation, confidence, relationships, permissions, observability, history, retirement. Intelligence artifacts behave as **engineered systems** — not inert stored records.

### Authority Resolution

```
CCIS > AMD > PDD > UXMD > SDD
```

### Authority Bridge Note

PDD-I memory **behavioral** specs remain on v2.1 track before **Build**. SDD-II v1.1 binds AMD III at engineering depth sufficient for SDD III–V and architecture review. PDD-I v2.1 required before cognitive/memory **implementation**.

### Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0 | 2026-06-21 | Initial data & intelligence architecture — 18 parts |
| 1.1 | 2026-06-21 | Definitive revision: cognitive lifecycle, universal artifact contract, state machine, memory/evidence/research/recommendation/prediction/learning engineering, observability, permission propagation, expanded IL framework |
| 1.2 | 2026-06-26 | Class B errata (P0-1): Part 5 §5.5–5.8 and §5.15 aligned to ADR-0007 — `Challenge → Verify → Decide → Recommend` |

### Strict Prohibitions

No implementation code, database schemas, SQL, table definitions, API endpoints, storage technology selections, UI designs, or infrastructure configuration.

**Build phase has not started. SDD Volume III blocked until Volume II v1.1 passes re-review.**

---

# PART 1 — INFORMATION PHILOSOPHY

## 1.1 Core Tenet

> Information exists to improve decisions — not to accumulate.

## 1.2 Information Ownership (Authoritative)

| Class | Owner | Scope | Mutability |
|-------|-------|-------|------------|
| Domain data | Domain L5 | `org_id`, `workspace_id` | CRUD per policy |
| Observation records | Data / Ingestion | `workspace_id`, `cycle_id` | Immutable after seal |
| Intelligence artifacts | Data artifact store | `cycle_id` | Immutable after release |
| Memory records | Memory Manager | Per category | Versioned governance |
| Evidence records | Evidence Memory + EVD | `workspace_id` | Versioned |
| Projections | Experience L9 | `workspace_id` | Derived rebuildable |
| Report snapshots | Data snapshot store | `report_id` | Immutable write-once |
| Execution traces | Execution L5E / Data | `run_id` | Append-only |
| Learning proposals | Learning Boundary | `workspace_id` | State machine |
| Graph / vectors | Data subsystems | `workspace_id` | Versioned |
| Audit | Security / Data | `org_id` | Append-only |

## 1.3 Provenance Philosophy

Every information object records: **who/what created it**, **from what inputs**, **under what authority**, **at what time**. Provenance is mandatory — not optional metadata. Downstream consumers may reject objects without complete provenance.

## 1.4 Confidence Philosophy

Confidence is **calibrated**, **earned**, and **scoped**. Artifacts, evidence, memory, predictions, and projections carry confidence with basis. Confidence may increase only through validation, corroboration, or outcome confirmation — never through presentation.

| Band | Range | Active use |
|------|-------|------------|
| High | ≥ 0.85 | Major conclusions, high-stakes paths |
| Medium | 0.60–0.84 | Inform reasoning; VRF required for release |
| Low | < 0.60 | Flag uncertainty; cannot drive major release alone |

## 1.5 Freshness Philosophy

Every projection and surfaced intelligence carries `freshness_at`. Stale intelligence is explicit (EL-20, GIS-S6). Memory freshness decays retrieval score. Evidence freshness validated on reuse.

## 1.6 Immutability Doctrine

| Object | Rule |
|--------|------|
| Released intelligence artifacts | Immutable; supersede only via new version/cycle |
| Report snapshots | Write-once |
| Execution traces | Append-only |
| Sealed decisions | Immutable record |
| Audit log | Append-only |
| Domain entities | Mutable with version audit |

## 1.7 Lineage & Traceability

Backward chain required: recommendation → decision → VRF → evidence → sources → ingestion. Forward chain: decision → execution → measurement → learning → memory.

## 1.8 Decision Utility

Retention requires: decision improved, scope defined, confidence/evidence basis, expiration/supersession rule.

## 1.9 Permission Philosophy

Permissions propagate with information — never widen silently. Retrieval, reasoning, reporting, and learning inherit scope and role constraints (Part 23).

## 1.10 Observability Philosophy

Every lifecycle transition emits trace events (Part 22). Untraced information transition is an architectural violation.

---

# PART 2 — INFORMATION CLASSIFICATION

## 2.1 Taxonomy (Complete)

| Class | Contents | Store | Part |
|-------|----------|-------|------|
| **I1** | Domain transactional | Primary | 6 |
| **I2** | Ingestion + observation records | Ingestion log | 6 |
| **I3** | Intelligence artifacts (OBS, UND, CTX, RES, EVD, RSN, CHL, PRD, STR, HUM, PLN, DEC, VRF, REF, LRN, OPT, FAIL) | Artifact store | 5, 7 |
| **I4** | Memory records (11 AMD types) | Memory store | 8 |
| **I5** | Graph entities/edges | Graph store | 16 |
| **I6** | Vector embeddings | Vector index | 17 |
| **I7** | Projections | Cache | 19–20 |
| **I8** | Report snapshots | Snapshot store | 18 |
| **I9** | Execution traces | Execution log | 5, 12 |
| **I10** | Recommendations (surfaced entity) | Projection + decision record | 12 |
| **I11** | Predictions (tracked entity) | Artifact + prediction registry | 11 |
| **I12** | Audit | Audit store | 21 |

## 2.2 Classification Rules

| Rule | Requirement |
|------|-------------|
| CL-1 | One primary class per object |
| CL-2 | Artifacts ≠ memory until governed promotion |
| CL-3 | Projections never authoritative |
| CL-4 | Evidence Memory (I4) stores long-term source scores; EVD artifact (I3) is per-cycle assessment |
| CL-5 | Graph (I5) stores entities; Project Memory (I4) stores workspace initiative synthesis |
| CL-6 | LRN/OPT exist as I3 artifacts AND as Learning Boundary proposal state — linked by `proposal_id` |
| CL-7 | Help vectors isolated from workspace knowledge vectors |
| CL-8 | New classes register via Marketplace governance — no ad hoc stores |

---

# PART 3 — UNIVERSAL ARTIFACT CONTRACT (UAC)

Every information artifact and governed memory record **inherits** UAC unless explicitly overridden (documented).

| Field | Requirement |
|-------|-------------|
| `identifier` | Globally unique `artifact_id` or `memory_id` |
| `owner` | Authoritative engineering context |
| `origin` | Provenance: source system, cycle, actor, parent IDs |
| `confidence` | Calibrated score + basis reference |
| `freshness` | `freshness_at`, `freshness_status` |
| `lineage` | `parent_ids[]`, `cycle_id`, `correlation_id` |
| `permissions` | Scope + effective role requirements |
| `audit_history` | Append-only transition log |
| `verification_status` | pending \| passed \| failed \| not_required |
| `retention_policy` | R0–R5 class |
| `observability_hooks` | Trace span IDs, metric labels |
| `lifecycle_status` | State machine position (Part 4) |

### UAC Inheritance

| Type | Overrides |
|------|-----------|
| Observation (OBS) | `verification_status` = not_required at create |
| Released DEC/VRF | `lifecycle_status` = Active; immutability enforced |
| Memory records | Add `memory_category`, `validation_status` |
| Projections | `owner` = Experience; rebuildable flag true |

---

# PART 4 — INFORMATION STATE MACHINE

## 4.1 Universal States

| State | Code | Meaning |
|-------|------|---------|
| Created | `S_CREATED` | Instantiated, not validated |
| Validated | `S_VALID` | Passed schema/governance checks |
| Active | `S_ACTIVE` | Authorized for intended use |
| Updated | `S_UPDATED` | New version superseding prior Active |
| Challenged | `S_CHALL` | Adversarial or user dispute pending |
| Superseded | `S_SUPER` | Replaced by newer version |
| Archived | `S_ARCH` | Retained; not active use |
| Expired | `S_EXP` | TTL/freshness failure |
| Deleted | `S_DEL` | Removed per policy; audit retained |

## 4.2 Allowed Transitions

```
S_CREATED → S_VALID | S_DEL
S_VALID → S_ACTIVE | S_CHALL | S_DEL
S_ACTIVE → S_UPDATED | S_CHALL | S_SUPER | S_EXP | S_ARCH
S_UPDATED → S_ACTIVE (new version becomes Active; prior → S_SUPER)
S_CHALL → S_VALID | S_ACTIVE | S_SUPER (resolution paths)
S_SUPER → S_ARCH
S_EXP → S_ARCH | S_DEL (per policy)
S_ARCH → S_DEL (per policy)
```

## 4.3 Forbidden Transitions

| Transition | Reason |
|------------|--------|
| S_DEL → any | Deletion irreversible except restore-as-new |
| S_ARCH → S_ACTIVE | Requires new version with validation |
| S_SUPER → S_ACTIVE | Cannot resurrect without new artifact |
| Skip S_VALID for memory promotion | Governance required |
| S_ACTIVE → S_CREATED | No regression |

## 4.4 Ownership Transfer

| Event | Transfer rule |
|-------|---------------|
| Cycle complete | OBS/artifacts remain Data; ownership context = artifact store |
| Memory promotion | Owner remains Memory Manager; category assigned |
| Release to projection | Experience owns projection; source artifacts unchanged |
| Execution handoff | Execution owns trace; decision ref immutable |
| Workspace archive | All workspace-scoped → S_ARCH cascade |

---

# PART 5 — COMPLETE COGNITIVE LIFECYCLE ENGINEERING

Maps CCIS §II, Cognitive Pipeline, AMD IV. **No stage implied. Every stage defines next transition.**

## 5.0 Lifecycle Stage Template

Each stage defines: Inputs, Outputs, Ownership, Transition rules, Failure paths, Retry, Observability, Downstream consumers, Upstream dependencies, Completion criteria.

## 5.1 Observation

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | User commands, ingestion events, system signals, schedule triggers, workspace state |
| **Outputs** | Observation Record (OBS) — raw/normalized pointers, completeness, change detection |
| **Ownership** | Data ingestion context; sealed before Understanding |
| **Transition** | OBS sealed → Understanding invoked |
| **Failure** | Incomplete OBS → cycle flagged partial; no silent fill |
| **Retry** | Ingestion retry per SDD-I §5.8; OBS rebuild from ingestion log |
| **Observability** | `observation.recorded`, source attribution metrics |
| **Downstream** | Understanding, Research scoping |
| **Upstream** | Integration, Application, schedulers |
| **Completion** | OBS `completeness` scored; `lifecycle_status` = S_VALID |

## 5.2 Understanding

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | OBS, Session Memory, User Memory |
| **Outputs** | Understanding Artifact (UND) |
| **Ownership** | Intelligence / Understanding engine |
| **Transition** | UND → Research (if gaps) OR Context if gaps closed |
| **Failure** | Ambiguity → clarification via Experience; cycle pause |
| **Retry** | Orchestration re-invoke once on transient failure |
| **Observability** | `intelligence.understanding.completed` |
| **Downstream** | Context, Research |
| **Upstream** | Observation |
| **Completion** | Intent hypothesis + ambiguity flags declared |

## 5.3 Research

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | UND, CTX (partial), research plan, memory/knowledge/graph/vector queries |
| **Outputs** | Research Artifact (RES) |
| **Ownership** | Intelligence / Research engine |
| **Transition** | RES → Evidence Assessment |
| **Failure** | Gaps explicit in RES; never false completeness |
| **Retry** | Parallel source retry per domain (Part 10) |
| **Observability** | `research.domain.completed`, gap count |
| **Downstream** | Evidence, Reasoning |
| **Upstream** | Understanding, all research domains (Part 10) |
| **Completion** | Completeness score vs decision threshold |

## 5.4 Reasoning

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | EVD, CTX, UND, memory retrieval |
| **Outputs** | Reasoning Artifact (RSN) |
| **Ownership** | Intelligence / Reasoning engine |
| **Transition** | RSN → Challenge |
| **Failure** | Insufficient evidence → explicit cannot-conclude |
| **Retry** | None on logic failure — reroute Research |
| **Observability** | `intelligence.reasoning.completed` |
| **Downstream** | Challenge, Prediction, Strategic |
| **Upstream** | Evidence Assessment |
| **Completion** | Candidate conclusions with uncertainty |

## 5.5 Challenge

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | RSN, EVD, historical comparisons |
| **Outputs** | Challenge Artifact (CHL) |
| **Ownership** | Intelligence / Challenge engine |
| **Transition** | CHL → [PRD, STR] → Verification (mandatory major) |
| **Failure** | All hypotheses defeated → no recommendation path |
| **Retry** | Reroute Reasoning if surviving hypotheses = 0 and stakes high |
| **Observability** | `intelligence.challenge.completed`, suppression count |
| **Downstream** | Prediction, Strategic, Verification |
| **Upstream** | Reasoning |
| **Completion** | Surviving hypotheses set declared |

## 5.6 Verification

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | CHL survivors, RSN, EVD, STR, PRD candidates, evidence citations |
| **Outputs** | Verification Artifact (VRF) |
| **Ownership** | Intelligence / Verification engine |
| **Transition** | VRF pass → Decision; fail → reroute upstream (IL-1) |
| **Failure** | VRF fail blocks release (IL-1) |
| **Retry** | One reroute cycle per Orchestration policy |
| **Observability** | `intelligence.verification.passed\|failed` |
| **Downstream** | Decision, Planning (optional), Recommendation gate |
| **Upstream** | Challenge, Strategic, Prediction |
| **Completion** | VRF `verification_status` = passed \| failed |

## 5.7 Decision

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | VRF pass (required), CHL survivors, STR, PRD, governance scores |
| **Outputs** | Decision Artifact (DEC) |
| **Ownership** | Intelligence / Decision engine |
| **Transition** | DEC → Recommend (Planning optional for complex execution paths) |
| **Failure** | No option meets threshold → honest empty |
| **Retry** | N/A |
| **Observability** | `intelligence.decision.recorded` |
| **Downstream** | Recommendation, Planning |
| **Upstream** | Verification |
| **Completion** | Selected option with ranked alternatives |

## 5.8 Recommendation

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | DEC + VRF pass, HUM calibration |
| **Outputs** | Recommendation entity (I10), HUM artifact, Experience projection |
| **Ownership** | Experience assembly; Decision record in Domain |
| **Transition** | Surfaced → Await user decision (WS_AWAIT) |
| **Failure** | VRF fail → suppress panel |
| **Retry** | N/A |
| **Observability** | `recommendation.surfaced` |
| **Downstream** | User decision, Reports (optional) |
| **Upstream** | Verification, Human Intelligence |
| **Completion** | User-visible package with evidence refs (Part 12) |

## 5.9 Execution

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | Approved decision, PLN, authorization record |
| **Outputs** | Execution trace (I9), run events |
| **Ownership** | Execution Layer L5E |
| **Transition** | Run complete → Measurement scheduled |
| **Failure** | Pause, alert, rollback path (Part 12) |
| **Retry** | Idempotent step retry per SDD-I §5.8 |
| **Observability** | `execution.run.*` |
| **Downstream** | Measurement, Automation module |
| **Upstream** | Orchestration handoff post-VRF |
| **Completion** | `run_status` = completed \| failed \| rolled_back |

## 5.10 Measurement

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | Execution results, prediction horizons, decision refs |
| **Outputs** | Outcome record, measurement artifact |
| **Ownership** | Application / Domain outcome store |
| **Transition** | Outcome → Reflection |
| **Failure** | Unmeasured outcome → reminder (CC-15) |
| **Retry** | User confirmation retry |
| **Observability** | `outcome.measured\|pending` |
| **Downstream** | Reflection, Learning |
| **Upstream** | Execution, Prediction monitoring |
| **Completion** | Outcome validated \| invalidated \| pending |

## 5.11 Reflection

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | Measurement, VRF/DEC refs, execution trace |
| **Outputs** | Reflection Artifact (REF) |
| **Ownership** | Intelligence / Reflection engine |
| **Transition** | REF → Learning proposal generation |
| **Failure** | Insufficient outcome data → defer learning |
| **Retry** | N/A |
| **Observability** | `intelligence.reflection.completed` |
| **Downstream** | Learning, Optimization |
| **Upstream** | Measurement |
| **Completion** | Attribution analysis complete |

## 5.12 Learning

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | REF, corrections, outcomes, predictions |
| **Outputs** | Learning Proposal Artifact (LRN), `learning.*` events |
| **Ownership** | Learning Boundary |
| **Transition** | Validated proposal → Memory promotion |
| **Failure** | Rejected proposal → audit only |
| **Retry** | N/A |
| **Observability** | `learning.proposal.*` |
| **Downstream** | Memory Manager, Orchestration profiles |
| **Upstream** | Reflection, corrections |
| **Completion** | Proposal validated \| rejected \| applied |

## 5.13 Optimization (Improve)

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | REF, LRN history, efficiency metrics |
| **Outputs** | Optimization Proposal Artifact (OPT) |
| **Ownership** | Learning Boundary + Optimization engine |
| **Transition** | OPT validated → routing/efficiency params — never code |
| **Failure** | Reject if violates verification/challenge |
| **Retry** | N/A |
| **Observability** | `optimization.proposal.*` |
| **Downstream** | Orchestration, SDD IV |
| **Upstream** | Reflection, Learning history |
| **Completion** | Governed apply or reject |

## 5.14 Reporting (Intelligence Capture)

| Dimension | Specification |
|-----------|---------------|
| **Inputs** | Released artifact chain, VRF pass |
| **Outputs** | Report snapshot (I8) |
| **Ownership** | Reports module + Data |
| **Transition** | Snapshot sealed → distribution (Part 18) |
| **Failure** | VRF fail blocks seal |
| **Retry** | Regeneration = new snapshot ID |
| **Observability** | `report.snapshot.sealed` |
| **Downstream** | Distribution, history, compare |
| **Upstream** | Released intelligence |
| **Completion** | Immutable snapshot with lineage |

## 5.15 Master Transition Graph

```
Observe → Understand → Research → Reason → Challenge → Verify → Decide → [Plan]
  → Recommend → [User Decision] → Execute → Measure → Reflect → Learn → Optimize
  → (memory update) → (next Observe cycle)
Report branches from Verify+Release. VRF failure reroutes to Research/Reason/Challenge.
```

---

# PART 6 — DATA LIFECYCLE

## 6.1 Stages

`Receive → Validate → Normalize → Enrich → Route → Persist → Signal → Retire`

## 6.2 Enrichment

| Step | Behavior |
|------|----------|
| Entity extraction | Candidate graph nodes (I5) — Proposed state |
| Classification | Source type, domain tags |
| Deduplication | Source event ID |
| Quality score | Ingestion completeness |

Enrichment never creates released intelligence — prepares for Observation.

## 6.3 Routing Rules

| Data type | Route |
|-----------|-------|
| Metric/time-series | Domain + optional Orchestration (anomaly) |
| Document | Knowledge pipeline + vector index |
| Event | Domain state + Observation trigger |
| Billing webhook | Billing service only (PD-12) |

## 6.4 Persistence Assignment

On persist: assign retention class (R0–R5), scope keys, owner. Durability tier per SDD-I §8.7 / Part 21.

## 6.5–6.7

Domain categories, ingestion idempotency, failure handling — per v1.0 §3.3–3.6 (retained).

---

# PART 7 — INTELLIGENCE ARTIFACT LIFECYCLE

Artifact chain per §5; all artifacts inherit UAC. Release gate IL-1. Artifact types OBS through OPT in I3 taxonomy. Stakes-compressed cycles documented in SDD IV — VRF never silently skipped for major release.

---

# PART 8 — MEMORY ENGINEERING

## 8.1 Memory Manager (sole write authority)

Operations: Retrieve, Propose, Validate, Promote, Supersede, Expire, Archive, Rollback.

## 8.2 Session Memory Promotion Architecture

```
Session Memory (ephemeral)
  → [session end | explicit promotion trigger | outcome validation]
  → Promotion candidate
  → Validation (purpose, scope, sample if pattern)
  → Promote to Project Memory | User Memory | discard
```

| Rule | Requirement |
|------|-------------|
| PROMO-1 | Session never auto-promotes without validation |
| PROMO-2 | Clarifications discard at session end unless promoted |
| PROMO-3 | Promotion audit required |

## 8.3 Universal Memory Type Template

Each type defines: purpose, stores, when used, improves decisions, scope, promotion, merge, conflict, inheritance, expiration, confidence evolution, retrieval priority, persistence, observability, governance.

## 8.4 Memory Types (Summary Table)

| Type | Expiration | Retrieval priority | Promotion source |
|------|------------|-------------------|------------------|
| User | Long TTL; preference refresh | High for HUM/UND | Session, explicit settings |
| Session | Session end | Highest in session | — |
| Project | Workspace lifetime | High for workspace cycles | Session, outcomes |
| Organization | Org policy | Medium; org-scoped cycles | Aggregated patterns (validated) |
| Knowledge | Document lifecycle | High for Research | Upload pipeline |
| Evidence | Source-dependent decay | High for EVD/VRF | EVD promotion post-VRF |
| Success | Pattern reinforcement window | Medium-high | Outcome learning |
| Failure | Long prevention window | High in Challenge/PLN | Outcome learning |
| Correction | Until disproven | **Highest** | User correction |
| Workflow | Automation lifetime | High for AUT | Execution outcomes |
| Graph entities | Entity TTL + versioning | Contextual traverse | Ingestion, cycles, learning |

### 8.4.1–8.4.11 Detailed Specs

Each v1.0 §5.3 type retained and extended with: **merge policy** (no silent merge — conflict flag), **conflict resolution** (Correction > Failure > Success > other), **inheritance** (Session→Project per §8.2), **confidence evolution** (reinforce/decay rules per AMD III §42), **governance** (validation gates per category).

## 8.5 AMD III §28 Universal Attributes

All memory records carry UAC plus: category, validation_status, purpose, retention_class, relationships[], evidence_class where applicable.

## 8.6 Memory Conflict Resolution

1. Correction Memory precedence (IL-4)
2. Higher validation status
3. Higher confidence × freshness
4. Escalate to Challenge in cycle — never silent merge

## 8.7 Memory Versioning & Rollback

New version on every material change. Rollback = new version pointing to parent — audit mandatory.

---

# PART 9 — EVIDENCE ENGINEERING

## 9.1 Lifecycle

`Acquire → Attribute source → Classify (CCIS hierarchy) → Score → Cite → Verify → [Promote to Evidence Memory] → Decay → Supersede`

## 9.2 Source Ownership

| Source type | Owner |
|-------------|-------|
| Connected data | Integration adapter + workspace credential scope |
| User upload | Knowledge module / workspace |
| External research | Intelligence engine + provider log |
| User correction | User actor — overrides derived |

## 9.3 Citation Chain

```
Recommendation (I10) → DEC → VRF → EVD → RES evidence portfolio entries → source_id → ingestion record
```

Reports (I8) snapshot citation chain IDs. Every surfaced evidence link resolves this chain.

## 9.4 Contradiction Handling

Surface in CHL and VRF. Correction precedence. No averaging.

## 9.5 Confidence Decay

Evidence Memory source scores decay on: failed validation, stale freshness check, contradicted by newer evidence.

## 9.6 Freshness Validation

On retrieval: re-validate source freshness. Failed → downgrade or exclude from active portfolio.

## 9.7 Replacement Policy

Supersede on higher-class corroborated evidence. Expire on TTL. User correction immediate supersede of targeted evidence.

---

# PART 10 — RESEARCH ENGINEERING

## 10.1 Domain Architecture

| Domain | Scope | Cache | Invalidation | Owner |
|--------|-------|-------|--------------|-------|
| **Internal** | Memory, knowledge, graph, vectors | Retrieval cache 15m | Memory write, supersession | Data / Memory Manager |
| **External** | Connected sources, providers | Per-source 5–60m | Source health change, webhook | Integration |
| **Historical** | Success/failure memory, past cycles, analogies | 1h | New outcome, correction | Data |
| **Competitive** | Competitor graph, STR artifacts | 30m | Competitor entity update | Strategic engine |
| **Market** | Market entities, external market data | 60m | Source refresh | Research engine |
| **Continuous** | Scheduled monitors, anomaly feeds | Rolling window | Event-driven immediate | Orchestration scheduler |

## 10.2 Historical Comparison Engineering

| Step | Behavior |
|------|----------|
| Query | Success/failure memory + graph analogies + past DEC outcomes |
| Match | Similarity score on context signature |
| Apply | RSN/PRD/CHL reference — not auto-conclusion |
| Lineage | `analogy_refs[]` in RSN |

Addresses CCIS §2.2, Authority Bridge strategic gap at engineering layer.

## 10.3 Research Invalidation

| Trigger | Action |
|---------|--------|
| Source `integration.SourceHealthChanged` | Invalidate external cache; mark RES stale |
| Correction submitted | Invalidate affected portfolio entries |
| Memory supersession | Invalidate retrieval cache |
| Scheduled TTL | Soft invalidate — re-fetch on next cycle |

## 10.4 Continuous Research

Background scheduler → Observation → scoped RES update → event if material change → notification per GIS §5.4.

## 10.5 Failure

Incomplete RES → explicit gaps; Reasoning constrained.

---

# PART 11 — PREDICTION ENGINEERING

## 11.1 Prediction Registry (I11)

Tracks predictions across cycles with UAC fields plus: `prediction_id`, `horizon`, `validation_criteria`, `dependency_refs[]`, `revision_chain[]`.

## 11.2 Dependency Graph

Predictions link to: evidence IDs, graph entities, assumptions in PRD. Dependency invalidation triggers revision workflow.

## 11.3 Lifecycle

`Generated → Challenged → Verified → Active → Monitored → Outcome → Validated | Invalidated → Superseded → Archived`

## 11.4 Expiration

Horizon expiry → `S_EXP` → notification if material → learning signal.

## 11.5 Revision History

Immutable revision chain. Each revision = new PRD artifact + registry entry `supersedes`.

## 11.6 Outcome Measurement

CC-15 binds outcome to `prediction_id`. Feeds Reflection → Learning.

## 11.7 Confidence Evolution

Increase on validated outcomes; decrease on invalidation; bounded by evidence class caps.

---

# PART 12 — RECOMMENDATION ENGINEERING

## 12.1 Recommendation as Evolving Entity (I10)

| State | Meaning |
|-------|---------|
| Generated | DEC+VRF released to projection |
| Surfaced | Visible in Command Center |
| Modified | CC-11 cycle in flight |
| Approved | User decision recorded |
| Executing | Run active |
| Completed | Outcome measured |
| Rejected | Negative decision |
| Superseded | New recommendation replaces |
| Retired | Expired or workspace archived |

## 12.2 Alternatives

DEC carries ranked alternatives. CC-12 detail view. Alternatives share citation chain.

## 12.3 Modification

CC-11 → new cycle → new DEC → new VRF → supersedes prior recommendation entity.

## 12.4 Rollback Linkage

Execution rollback (AUT-06) → recommendation `run_status` = rolled_back → Reflection triggered.

## 12.5 Historical Comparison

Compare current recommendation to prior DEC outcomes in workspace — `prior_decision_refs[]`, outcome success rate in projection metadata.

## 12.6 Retirement

Supersede on new cycle, reject, or workspace archive. Immutable decision audit retained.

---

# PART 13 — LEARNING ENGINEERING

## 13.1 Learning Types

| Type | Input | Storage destination | Validation |
|------|-------|---------------------|------------|
| **Correction** | User correction (E3) | Correction Memory | Immediate governance |
| **Outcome** | CC-15, execution | Success/Failure Memory | Sample threshold |
| **Pattern** | REF + repeated outcomes | Success/Failure + graph | Holdout + sample |
| **Strategic** | STR outcome validation | Project + graph | Human gate if critical |
| **Organizational** | Cross-workspace patterns | Organization Memory | Admin gate + aggregation policy |

## 13.2 Learning Artifact Contract

LRN inherits UAC: inputs, validation_status, target_memory_category, expected_impact, rollback_plan, approval_requirement.

## 13.3 Promotion & Application

Validated LRN → Memory Manager promote → versioned write → `learning.ProposalApplied`.

## 13.4 Rollback Protection

Every applied learning has rollback pointer to prior memory version. Negative outcome → initiate rollback (AMD III §45).

## 13.5 Feedback Learning

Implicit signals (dismissals with reason, defer patterns) → Proposed learning only — never direct memory write.

## 13.6 Safety Boundaries

EL-30–33, IL-10. No code mutation. No verification bypass.

---

# PART 14 — REFLECTION & OPTIMIZATION

## 14.1 Reflection (REF)

Post-measurement only. Not substitute for Challenge. Lifecycle: Measurement → REF → LRN/OPT proposals.

## 14.2 Optimization (OPT)

Efficiency and routing improvements. Governed apply to Orchestration parameters — SDD IV detail. Never weakens VRF/CHL.

---

# PART 15 — WORKFLOW PERSISTENCE

Retained from v1.0 Part 11 with UAC on persisted workflow records.

---

# PART 16 — KNOWLEDGE GRAPH ARCHITECTURE

## 16.1–16.6

Retained from v1.0 with additions:

## 16.7 Temporal Evolution

Entity versions with `valid_from`, `valid_to`. Historical queries return point-in-time view. Supersession on attribute change.

## 16.8 Organizational Intelligence

Org-level aggregates require: minimum workspace sample, admin policy, no PII leakage across workspaces. Stored in Organization Memory + org-scoped graph partition.

## 16.9 Cross-Workspace Isolation

VEC-1, IL-7. Graph traverse scoped to `workspace_id` unless org aggregate policy.

---

# PART 17 — VECTOR INTELLIGENCE ARCHITECTURE

Retained from v1.0 with additions:

## 17.6 Embedding Ownership

Data Layer owns indices. Intelligence consumes chunk refs only.

## 17.7 Freshness Invalidation

Document update → re-embed → supersede chunk IDs → invalidate vector cache.

## 17.8 Cache Poisoning Protection

| Control | Requirement |
|---------|-------------|
| VEC-5 | Chunk hash verified on retrieval |
| VEC-6 | Workspace scope enforced at query |
| VEC-7 | No user-controlled embedding metadata without validation |
| VEC-8 | Index rebuild from authoritative document store only |

---

# PART 18 — REPORT & SNAPSHOT ARCHITECTURE

## 18.1–18.5 Retained

## 18.6 Report History

Indexed by `workspace_id`, `generated_at`. RPT-01 list reads snapshot metadata — not live intelligence.

## 18.7 Distribution Data Flow

```
snapshot sealed → domain.ReportGenerated → [platform.NotificationRequested] → export file → share link (permission scoped)
```

Share inherits workspace role permissions.

---

# PART 19 — SYNCHRONIZATION STRATEGY

Retained from v1.0 with:

## 19.7 Offline Reconcile Contract

| Step | Behavior |
|------|----------|
| Reconnect | Fetch global scope + fresh projections |
| Pending commands | Idempotency key dedup |
| Stale client data | Server wins; GIS-S6 banner |
| Conflict | No merge of decisions — server authoritative |

## 19.8 Cache Synchronization

Projection cache invalidates on: intelligence events, domain events, workspace switch, permission change.

---

# PART 20 — CACHE STRATEGY

## 20.1–20.4 Retained

## 20.5 Eviction Policy

| Cache | Eviction |
|-------|----------|
| Projection | LRU + event invalidation; max TTL 24h |
| Retrieval | TTL 15m default; write-through invalidate |
| Vector | LRU; max 10k queries/workspace |
| Client offline | Workspace switch clears all |

## 20.6 Warm-up

On workspace load: prefetch Command Center projection + active recommendation IDs. On report open: prefetch snapshot metadata only.

## 20.7 Poisoning Protection

See VEC-5–8; CACHE-6: projection rebuild only from artifact store; CACHE-7: signed cache keys server-side.

---

# PART 21 — RETENTION & ARCHIVAL

Retained R0–R5 with:

## 21.7 Legal Hold

`legal_hold` flag on org/workspace. Blocks S_DEL and overrides TTL until released. Audit who set/release.

## 21.8 Data Integrity

Lineage validation on restore. Checksum on snapshot seal (conceptual). Broken chain → quarantine + alert.

---

# PART 22 — INFORMATION OBSERVABILITY

## 22.1 Purpose

Dedicated information-layer observability — complements SDD-I §9.5.

## 22.2 Trace Architecture

| Trace type | Spans |
|------------|-------|
| **Lineage** | `correlation_id` across OBS→VRF→DEC→execution→outcome |
| **Retrieval** | Memory/graph/vector query purpose, scope, result count |
| **Memory** | promote, supersede, rollback events |
| **Recommendation** | surfaced, decisioned, superseded |
| **Prediction** | generated, revised, validated, invalidated |
| **Learning** | proposal created, validated, applied, rejected |

## 22.3 Metrics (Conceptual)

| Metric | Owner |
|--------|-------|
| Cycle latency by stage | Orchestration |
| VRF pass/fail rate | Intelligence |
| Memory promotion rate | Learning Boundary |
| Retrieval cache hit | Data |
| Stale projection count | Experience |
| Evidence decay events | Evidence Memory |

## 22.4 Requirement

Every UAC `observability_hooks` populated on state transition. Untraced transition = IL-20 violation.

---

# PART 23 — PERMISSION PROPAGATION

## 23.1 Principle

Permissions **never widen** through information flow. Inherit narrowest scope.

## 23.2 Propagation Matrix

| Stage | Rule |
|-------|------|
| **Ingestion** | Workspace scope on record; credential scope on source |
| **Storage** | `org_id`, `workspace_id` mandatory on write |
| **Retrieval** | GIS §2 role check + scope filter before return |
| **Reasoning** | Engines receive only permitted retrieval results |
| **Reporting** | Snapshot inherits generation-time permissions; share respects role |
| **Recommendation** | Viewer role: read-only; no approve |
| **Learning** | Cannot promote cross-workspace patterns without org policy |

## 23.3 Inheritance Rules

| Rule | Requirement |
|------|-------------|
| PERM-1 | Child artifact inherits parent scope — never expands |
| PERM-2 | Admin-only memories excluded from Member retrieval |
| PERM-3 | Export requires explicit permission per GIS |
| PERM-4 | Cross-org retrieval forbidden (IL-7) |

## 23.4 Failure

Permission denied → fail closed; no partial data leak (GIS §2.5).

---

# PART 24 — INFORMATION ENGINEERING LAWS

Each law: **Rationale | Enforcement | Verification | Failure consequence | Related laws**

## IL-1 — Verification Gate

| | |
|-|-|
| **Statement** | No major intelligence release without VRF pass |
| **Rationale** | CCIS Verify-before-release |
| **Enforcement** | Orchestration blocks Experience release |
| **Verification** | Audit artifact chain for VRF before Released state |
| **Failure** | IL-20 violation; incident P0 |
| **Related** | IL-1, EL-19 |

## IL-2 — Memory Manager Sole Write

| | |
|-|-|
| **Statement** | Memory writes only through Memory Manager |
| **Rationale** | AMD III governance |
| **Enforcement** | Data layer API |
| **Verification** | Static + integration audit |
| **Failure** | Quarantine unauthorized writes |
| **Related** | IL-3, IL-10 |

## IL-3 — Memory Provenance

| | |
|-|-|
| **Statement** | Every memory has scope, purpose, confidence, provenance |
| **Rationale** | AMD III §28 |
| **Enforcement** | UAC validation on write |
| **Verification** | Memory record audit |
| **Failure** | Reject write |
| **Related** | IL-2 |

## IL-4 — Correction Precedence

| | |
|-|-|
| **Statement** | Correction Memory wins conflicts |
| **Rationale** | User authority |
| **Enforcement** | Retrieval ranking |
| **Verification** | Conflict resolution tests |
| **Failure** | Wrong intelligence surfaced — P0 |
| **Related** | IL-8 |

## IL-5 — Projection Non-Authority

| | |
|-|-|
| **Statement** | Projections derived — never authoritative |
| **Rationale** | Rebuild safety |
| **Enforcement** | Experience layer |
| **Verification** | Rebuild test from artifacts |
| **Failure** | Stale UI — rebuild |
| **Related** | IL-12 |

## IL-6 — Snapshot Immutability

| | |
|-|-|
| **Statement** | Report snapshots write-once |
| **Rationale** | Audit/compliance |
| **Enforcement** | Snapshot store |
| **Verification** | Write attempt on sealed ID fails |
| **Failure** | Integrity alert |
| **Related** | IL-17 |

## IL-7 — Tenant Isolation

| | |
|-|-|
| **Statement** | No cross-tenant information access |
| **Rationale** | Multi-tenant security |
| **Enforcement** | Gateway + retrieval filters |
| **Verification** | Penetration test |
| **Failure** | Incident critical |
| **Related** | PERM-4, EL-8 |

## IL-8 — Evidence Class Cap

| | |
|-|-|
| **Statement** | Evidence class caps inference strength |
| **Rationale** | CCIS evidence hierarchy |
| **Enforcement** | Reasoning + VRF engines |
| **Verification** | Artifact audit |
| **Failure** | Overconfident conclusion |
| **Related** | IL-1 |

## IL-9 — Vector Non-Evidence

| | |
|-|-|
| **Statement** | Vector similarity ≠ verified fact |
| **Rationale** | Semantic ≠ evidentiary |
| **Enforcement** | Research pipeline |
| **Verification** | EVD must classify vector-sourced items |
| **Failure** | False confidence |
| **Related** | VEC-4 |

## IL-10 — Learning Validation

| | |
|-|-|
| **Statement** | Learning proposals require validation before memory promotion |
| **Rationale** | CCIS §10.6 |
| **Enforcement** | Learning Boundary |
| **Verification** | Proposal audit trail |
| **Failure** | Rollback memory version |
| **Related** | IL-2, EL-32 |

## IL-11 — Ingestion Idempotency

| | |
|-|-|
| **Statement** | Ingestion idempotent on source identity |
| **Rationale** | EL-22 |
| **Enforcement** | Integration dedup |
| **Verification** | Replay test |
| **Failure** | Duplicate records — reconcile |
| **Related** | EL-22 |

## IL-12 — Freshness Explicit

| | |
|-|-|
| **Statement** | Freshness on every projection |
| **Rationale** | GIS-S6, EL-20 |
| **Enforcement** | Experience payloads |
| **Verification** | Payload schema audit |
| **Failure** | Silent stale — P1 |
| **Related** | IL-5 |

## IL-13 — Help/Knowledge Isolation

| | |
|-|-|
| **Statement** | Help index isolated from workspace knowledge |
| **Rationale** | Security/privacy |
| **Enforcement** | Separate indices |
| **Verification** | Cross-query test fails |
| **Failure** | Data leak |
| **Related** | VEC-1 |

## IL-14 — Billing Isolation

| | |
|-|-|
| **Statement** | Billing never alters intelligence/memory content |
| **Rationale** | PD-12 |
| **Enforcement** | Domain boundary |
| **Verification** | Event audit |
| **Failure** | Trust violation |
| **Related** | — |

## IL-15 — Deleted Exclusion

| | |
|-|-|
| **Statement** | Deleted info excluded from active retrieval |
| **Rationale** | Retention policy |
| **Enforcement** | Retrieval filters |
| **Verification** | Retrieval test |
| **Failure** | Policy violation |
| **Related** | IL-7 |

## IL-16 — Citation Chain Integrity

| | |
|-|-|
| **Statement** | Recommendations/reports must resolve citation chain to source |
| **Rationale** | Verifiability |
| **Enforcement** | Experience assembly |
| **Verification** | Chain walk audit |
| **Failure** | Block release |
| **Related** | IL-1, IL-8 |

## IL-17 — Execution Trace Immutability

| | |
|-|-|
| **Statement** | Execution traces append-only |
| **Rationale** | Audit/automation |
| **Enforcement** | Execution log store |
| **Verification** | Mutate test fails |
| **Failure** | Integrity alert |
| **Related** | IL-6 |

## IL-18 — Session Promotion Gate

| | |
|-|-|
| **Statement** | Session memory promotion requires validation |
| **Rationale** | AMD III §30 |
| **Enforcement** | Memory Manager |
| **Verification** | Promotion audit |
| **Failure** | Discard or quarantine |
| **Related** | IL-2, PROMO-1 |

## IL-19 — Research Invalidation

| | |
|-|-|
| **Statement** | Stale research must invalidate before reuse |
| **Rationale** | BH-7 |
| **Enforcement** | Cache + RES metadata |
| **Verification** | Source change trigger test |
| **Failure** | Stale reasoning |
| **Related** | IL-12 |

## IL-20 — Traced Transitions

| | |
|-|-|
| **Statement** | Every lifecycle transition traced |
| **Rationale** | Observability |
| **Enforcement** | UAC hooks |
| **Verification** | Trace completeness audit |
| **Failure** | Engineering defect |
| **Related** | Part 22 |

## IL-21 — Privacy Minimization

| | |
|-|-|
| **Statement** | Retrieval returns minimum necessary fields per role |
| **Rationale** | Privacy/compliance |
| **Enforcement** | Permission projection |
| **Verification** | Role-based retrieval test |
| **Failure** | Over-exposure |
| **Related** | PERM-1, IL-7 |

---

# APPENDIX A — END-TO-END INFORMATION FLOW

(Updated — includes Reflect, Optimize, Measurement, full citation chain)

```
[External] → Ingest → Enrich → OBS → UND → RES → EVD → RSN → CHL → DEC → PLN → VRF
  → Recommend → [User] → Execute → Measure → REF → LRN/OPT → Memory
  → (next cycle)                    ↘ Snapshot (Report)
```

---

# APPENDIX B — SDD VOLUME I CROSS-REFERENCE

| SDD-I | SDD-II v1.1 |
|-------|-------------|
| L4 Data | Parts 3–24 |
| L7 Intelligence | Parts 5, 7, 9–14 |
| Learning Boundary §3.13 | Parts 5.12–5.13, 13 |
| Execution L5E | Parts 5.9, 12 |
| Event architecture | Lifecycle transitions |
| Workspace switch §6.8 | Parts 19–20 |
| GIS freshness | IL-12, Part 1 |

---

# APPENDIX C — CCIS STAGE TRACEABILITY

| CCIS Stage | SDD-II Part |
|------------|-------------|
| Observe | 5.1, 6 |
| Understand | 5.2 |
| Research | 5.3, 10 |
| Reason | 5.4 |
| Challenge | 5.5 |
| Verify | 5.6 |
| Decide | 5.7 |
| Recommend | 5.8, 12 |
| Execute | 5.9 |
| Measure | 5.10 |
| Learn | 5.12, 13 |
| Improve | 5.13, 14 |

---

# APPENDIX D — AUTHORITY TRACEABILITY

| Authority | SDD-II Coverage |
|-----------|-----------------|
| CCIS §II loop | Part 5 complete |
| CCIS evidence | Part 9 |
| CCIS §VII prediction | Part 11 |
| AMD III memory | Part 8 |
| AMD III graph | Part 16 |
| AMD IV artifacts | Parts 3, 5, 7 |
| PDD D4/D6/D7 | Parts 10, 12 |
| UXMD CC-11–15, RPT | Parts 11, 12, 18 |
| Authority Bridge gaps | Historical comparison §10.2; memory engineering §8 |

---

# APPENDIX E — IL VERIFICATION MATRIX

| Law | Verification method |
|-----|---------------------|
| IL-1–IL-4 | Artifact chain integration audit |
| IL-5 | Projection rebuild test |
| IL-6, IL-17 | Immutability mutate test |
| IL-7, IL-21 | Cross-tenant/role retrieval test |
| IL-8–IL-9 | Engine output audit |
| IL-10, IL-18 | Learning promotion audit |
| IL-11 | Ingestion replay test |
| IL-12 | Projection payload scan |
| IL-13 | Index isolation test |
| IL-14 | Billing event correlation |
| IL-15 | Post-delete retrieval test |
| IL-16 | Citation walk |
| IL-19 | Source change invalidation test |
| IL-20 | Trace span completeness |

*CI enforcement: SDD Volume V*

---

# APPENDIX F — APPROVAL CRITERIA FOR SDD VOLUME II v1.1

- [x] Information philosophy — provenance, confidence, immutability (Part 1)
- [x] Complete taxonomy (Part 2)
- [x] Universal Artifact Contract (Part 3)
- [x] Information state machine (Part 4)
- [x] Complete CCIS cognitive lifecycle — all stages (Part 5)
- [x] Data lifecycle with enrichment, routing, persistence (Part 6)
- [x] Memory engineering — all types + promotion + §28 (Part 8)
- [x] Evidence engineering — citation, source ownership (Part 9)
- [x] Research — six domains + invalidation (Part 10)
- [x] Prediction — dependency, history, expiration (Part 11)
- [x] Recommendation — full lifecycle + rollback (Part 12)
- [x] Learning — five types + safety (Part 13)
- [x] Reflection & Optimization (Part 14)
- [x] Knowledge graph temporal + org (Part 16)
- [x] Vector poisoning protection (Part 17)
- [x] Report history + distribution (Part 18)
- [x] Offline reconcile + cache sync (Part 19–20)
- [x] Legal hold + integrity (Part 21)
- [x] Information observability (Part 22)
- [x] Permission propagation (Part 23)
- [x] IL-1–IL-21 with verification framework (Part 24)
- [x] No code, schemas, SQL, APIs
- [ ] **Re-review passed**

---

*End of SDD Volume II — Data & Intelligence Architecture v1.1*
