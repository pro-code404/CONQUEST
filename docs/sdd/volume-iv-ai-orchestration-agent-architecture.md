# SDD VOLUME IV — AI ORCHESTRATION & AGENT ARCHITECTURE

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | SDD Volume IV — AI Orchestration & Agent Architecture |
| **Abbreviation** | SDD-IV |
| **Status** | Engineering Architecture Authority — Volume 4 of 5 |
| **Version** | 1.0 |
| **Supreme Authority** | CCIS |
| **Subordinate To** | CCIS, AMD III–IV, SDD I v1.1, SDD II v1.1, SDD III v1.0 |
| **Derived From** | Frozen corpus, [RTM](../architecture/requirements-traceability-matrix.md), ADR-0001–0035 |
| **Precedes** | SDD Volume V; all AI implementation |

### Mission

Define **how Conquest orchestrates intelligence** — cognitive pipeline execution, agent coordination, reasoning boundaries, verification gating, memory/knowledge integration, learning governance, safety, and observability — as production-grade **architectural specification only**.

| Document | Question |
|----------|----------|
| SDD Volume I | How is the platform engineered? |
| SDD Volume II | How does information behave? |
| SDD Volume III | How is infrastructure secured? |
| **SDD Volume IV** | **How does AI orchestration and agent architecture work?** |
| SDD Volume V | How is build governed? |

### Strict Prohibitions

No source code, prompts, APIs, workflow code, agent framework configuration, orchestration scripts, model configuration files, infrastructure configuration, or runtime artifacts.

**Build phase has not started.**

### Authority Reconciliation — Cognitive Stage Order

**ADR-0007 and CCIS §II prevail.** SDD-IV Part 2 engineers:

```
Challenge → Verify → Decide → Recommend
```

Where SDD-II v1.1 §5.6–5.8 lists Decide before Verify, **SDD-IV is authoritative for orchestration** pending SDD-II v1.2 errata.

---

# PART 0 — AUTHORITY & COMPLIANCE

## 0.1 Compliance Matrix

| Source | SDD-IV relationship |
|--------|---------------------|
| CCIS | Supreme — lifecycle, evidence, learning laws |
| AMD III | Memory integration Part 7 — read/write governance |
| AMD IV | Intelligence systems + agent binding Part 4 |
| PDD I–II | Workflows drive cycle triggers — not redefined |
| Authority Bridge | Conditional PDD-I — no block |
| UXMD I–III | Experience projection timing — GIS unchanged |
| Architecture Freeze | No frozen element altered |
| RTM | Parts A, E, INT rows — extended in §0.4 |
| SDD I | Orchestration L6, Intelligence L7, Learning Boundary |
| SDD II | Artifacts UAC, IL laws, lifecycle detail |
| SDD III | Safety, observability, trust zones |

## 0.2 Architecture Freeze Compliance

SDD-IV does **not** change: navigation, modules, GIS, CCIS loop semantics, Memory Manager authority, Learning Boundary non-execution, or infrastructure topology.

## 0.3 ADR Compliance (0001–0035)

| ADR range | Binding |
|-----------|---------|
| 0001, 0013 | Document hierarchy |
| 0006, 0007 | Verification gate + stage order — Part 2, 9 |
| 0008, 0009 | Memory + Learning — Parts 7, 10 |
| 0010 | Events — Part 5 |
| 0011, 0020 | AI provider abstraction — agents never call providers directly |
| 0015 | Execution Agent — Part 11 |
| 0016–0025 | Infrastructure constraints on orchestration |
| 0026–0035 | AI-specific — Parts 1–15 |

## 0.4 RTM Traceability

| RTM ID | SDD-IV binding |
|--------|----------------|
| RTM-INT-001–010 | Part 2 cognitive pipeline |
| RTM-INT-007 | Agent/provider boundary Part 4 |
| RTM-MEM-001–006 | Part 7 |
| RTM-ENG-003 | Orchestration never concludes Part 3 |
| RTM-ENG-004 | Learning Boundary Part 10 |
| RTM-INF-011 | Safety Part 12 |

*RTM v1.1 will add AI-specific rows RTM-AI-001–015 on seal.*

## 0.5 Cross-Document References

| Document | Path |
|----------|------|
| CCIS | [`../architecture/ccis.md`](../architecture/ccis.md) |
| AMD IV | [`../architecture/amd/volume-iv-intelligence-systems.md`](../architecture/amd/volume-iv-intelligence-systems.md) |
| AMD III | [`../architecture/amd/volume-iii-memory-architecture.md`](../architecture/amd/volume-iii-memory-architecture.md) |
| Cognitive Pipeline | [`../architecture/cognitive-pipeline.md`](../architecture/cognitive-pipeline.md) — subordinate |
| SDD-II Part 5 | Lifecycle artifacts — order reconciled here |

## 0.6 Known Constraints

| ID | Constraint |
|----|------------|
| C-IV-1 | SDD-II P0-1 lifecycle errata — SDD-IV order authoritative |
| C-IV-2 | No model vendor selection |
| C-IV-3 | Stakes-compressed cycles — stages present, duration reduced |
| C-IV-4 | PDD-I v2.1 open workflows — Build only |

## 0.7 Open Architectural Assumptions

| Assumption | Resolution owner |
|------------|------------------|
| Single System Coordinator per cycle (logical) | SDD-IV Part 3 |
| Specialist domain agents optional per routing profile | Orchestration config in SDD V |
| Human-in-loop default for high-stakes execution | GIS + BH-9 |

---

# PART 1 — AI ARCHITECTURE PHILOSOPHY

## 1.1 Purpose

Orchestrate CCIS-compliant intelligence cycles that improve decision quality — invisible to users, auditable to operators, bounded for safety.

## 1.2 Goals

| Goal | Expression |
|------|------------|
| Decision superiority | Measurable outcome improvement |
| Trustworthy conclusions | Verification before release |
| Operational scale | Async queue-driven cycles |
| Governed learning | Proposals — not code mutation |
| Replaceable cognition | Engines swappable; pipeline stable |

## 1.3 Reasoning Principles

- Reason produces **candidate explanations** — not final answers (CCIS §II.4)  
- Challenge attacks conclusions before verification  
- Evidence constrains all inference (CCIS §III)  
- Uncertainty explicit — never rhetorical confidence  

## 1.4 Verification-First Philosophy

No major conclusion reaches Experience without VRF pass (IL-1, ADR-0006). Orchestration enforces — agents cannot self-release.

## 1.5 Deterministic Execution Philosophy

Execution steps are **idempotent** where possible. Intelligence may be probabilistic; **authorization and execution records** are deterministic and auditable.

## 1.6 Human Oversight

High-stakes paths require human decision (D7, BH-9). User Decision sits between Recommend and Execute. Emergency stop halts execution — not silent continue.

## 1.7 Trust Model

| Actor | Trust |
|-------|-------|
| User input | Untrusted — sanitize at Intelligence ingress |
| Agent output | Untrusted until VRF |
| Memory read | Governed — scope validated |
| Provider response | Untrusted — evidence classified |

## 1.8 Intelligence Boundaries

Intelligence Layer concludes internally — presents only through Recommendation after VRF. Application never reasons. Orchestration never concludes.

## 1.9 Learning Boundaries

Learning agents produce proposals to Learning Boundary only. No execution, no release bypass, no code deploy (ADR-0009).

## 1.10 Safety Principles

Fail closed. Escalate on ambiguity. Emergency stop available. Prompt boundary defense (SDD-III INF-13). No unsafe recommendation release.

---

# PART 2 — COMPLETE COGNITIVE PIPELINE

## 2.1 Master Transition Graph (Authoritative)

```
Observe → Understand → Research → Reason* → Challenge
  → [Predict ∥ Strategic] → Verify → Decide → Recommend
  → [User Decision] → Execute → Measure → Reflect → Learn → Optimize
  → (memory update) → (next cycle)

Report ← branches from Verify pass + Release authorization
Planning ← optional between Decide and Execute (complex runs)

* Reason stage = "Analyze" in product language — RSN artifact
```

**Forbidden global transitions:** Verify → skipped silently; Decide → Recommend without VRF; Learn → Execute; any → Memory write bypassing Memory Manager; Orchestration → user-facing release.

## 2.2 Stage Specifications

Each stage: Purpose, Inputs, Outputs, Ownership, Artifacts, Allowed transitions, Forbidden transitions, Failure, Verification, Observability.

### 2.2.1 Observe

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Capture signals without premature interpretation |
| **Inputs** | User commands, ingestion events, schedules, workspace state |
| **Outputs** | Observation Record (OBS) |
| **Ownership** | Orchestration intake + Data ingestion |
| **Artifacts** | OBS (UAC) |
| **Allowed →** | Understand |
| **Forbidden →** | Reason, Recommend, Execute directly |
| **Failure** | Incomplete OBS — flag partial; no silent fill |
| **Verification** | Completeness score threshold |
| **Observability** | `observation.recorded` |

### 2.2.2 Understand

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Extract intent, context, urgency — not literal text only |
| **Inputs** | OBS, Session Memory, User Memory |
| **Outputs** | Understanding Artifact (UND) |
| **Ownership** | Understanding Intelligence / Understanding Agent |
| **Artifacts** | UND |
| **Allowed →** | Research, Context assembly |
| **Forbidden →** | Recommend, Execute |
| **Failure** | Ambiguity → Experience clarification; cycle pause |
| **Verification** | Intent hypothesis documented |
| **Observability** | `intelligence.understanding.completed` |

### 2.2.3 Research

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Evidence acquisition — not search alone |
| **Inputs** | UND, research plan, memory/knowledge/graph/vector queries |
| **Outputs** | Research Artifact (RES) |
| **Ownership** | Research Intelligence / Research Agent |
| **Artifacts** | RES |
| **Allowed →** | Evidence Assessment |
| **Forbidden →** | Release to user |
| **Failure** | Gaps explicit — never false completeness |
| **Verification** | Completeness vs decision threshold |
| **Observability** | `research.domain.completed` |

### 2.2.4 Reason (Analyze)

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Generate candidate explanations with uncertainty |
| **Inputs** | EVD, CTX, UND, governed memory retrieval |
| **Outputs** | Reasoning Artifact (RSN) |
| **Ownership** | Reasoning Intelligence / Analysis Agent |
| **Artifacts** | RSN |
| **Allowed →** | Challenge, Predict (parallel feed) |
| **Forbidden →** | Recommend, Execute |
| **Failure** | Cannot conclude — explicit status |
| **Verification** | Evidence sufficiency for claims |
| **Observability** | `intelligence.reasoning.completed` |

### 2.2.5 Challenge

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Adversarial test of reasoning — differentiate from Verify |
| **Inputs** | RSN, EVD, historical comparisons |
| **Outputs** | Challenge Artifact (CHL) |
| **Ownership** | Challenge Intelligence / Risk Agent |
| **Artifacts** | CHL |
| **Allowed →** | Predict, Strategic, **Verify** |
| **Forbidden →** | Recommend (must pass Verify first) |
| **Failure** | All hypotheses defeated — no recommendation path |
| **Verification** | Surviving hypotheses declared |
| **Observability** | `intelligence.challenge.completed` |

### 2.2.6 Predict

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Forward estimates with validation plans |
| **Inputs** | RSN, CHL survivors, historical series |
| **Outputs** | Prediction Artifact (PRD) |
| **Ownership** | Prediction Intelligence / Prediction Agent |
| **Artifacts** | PRD |
| **Allowed →** | Verify (feeds calibration) |
| **Forbidden →** | Presented as verified fact |
| **Failure** | Miscalibration → reroute |
| **Verification** | Horizon-appropriate confidence bands |
| **Observability** | `prediction.registered` |

### 2.2.7 Verify

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Standards, evidence, policy, confidence gate **before** Decide |
| **Inputs** | CHL survivors, RSN, EVD, RES, PRD, STR (as applicable) |
| **Outputs** | Verification Artifact (VRF) |
| **Ownership** | Verification Intelligence / Verification Agent |
| **Artifacts** | VRF |
| **Allowed →** | Decide (on pass); reroute Research/Reason/Challenge (on fail) |
| **Forbidden →** | Recommend, Execute on fail; **skipped silently** |
| **Failure** | VRF fail blocks release (IL-1) |
| **Verification** | Per-category pass/fail — ADR-0027 |
| **Observability** | `intelligence.verification.passed\|failed` |

### 2.2.8 Decide

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Select option with recorded rationale — **after** VRF |
| **Inputs** | VRF pass, CHL survivors, PRD, STR, governance scores |
| **Outputs** | Decision Artifact (DEC) |
| **Ownership** | Decision Intelligence / Decision engine |
| **Artifacts** | DEC |
| **Allowed →** | Recommend, Planning (optional) |
| **Forbidden →** | Execute without Recommend + user gate when required |
| **Failure** | No option meets threshold — honest empty |
| **Verification** | Rejected alternatives recorded |
| **Observability** | `intelligence.decision.recorded` |

### 2.2.9 Recommend

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Human-calibrated actionable guidance |
| **Inputs** | DEC, VRF pass, Human Intelligence calibration |
| **Outputs** | Recommendation (I10), HUM artifact |
| **Ownership** | Experience assembly + Recommendation Agent (presentation) |
| **Artifacts** | I10, HUM |
| **Allowed →** | User Decision, Report (optional) |
| **Forbidden →** | Execute without authorization |
| **Failure** | Suppress panel on missing VRF |
| **Verification** | Confidence bands visible |
| **Observability** | `recommendation.surfaced` |

### 2.2.10 Execute

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Authorized action in the world |
| **Inputs** | Approved user decision, PLN, auth record, VRF ref |
| **Outputs** | Execution trace (I9) |
| **Ownership** | Execution Layer / Execution Agent |
| **Artifacts** | I9 |
| **Allowed →** | Measure |
| **Forbidden →** | Conclude, verify, learn directly |
| **Failure** | Pause, rollback, alert |
| **Verification** | Authorization record present |
| **Observability** | `execution.run.*` |

### 2.2.11 Measure

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Outcome vs prediction/decision |
| **Inputs** | Execution results, PRD horizons, DEC refs |
| **Outputs** | Outcome record |
| **Ownership** | Application / Domain |
| **Allowed →** | Reflect |
| **Forbidden →** | Memory write without Learning Boundary |
| **Failure** | Pending outcome reminder (CC-15) |
| **Observability** | `outcome.measured\|pending` |

### 2.2.12 Reflect

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Post-cycle attribution |
| **Inputs** | Measurement, VRF/DEC, execution trace |
| **Outputs** | Reflection Artifact (REF) |
| **Ownership** | Reflection Intelligence / Reflection Agent |
| **Allowed →** | Learn, Optimize |
| **Forbidden →** | Direct memory apply |
| **Observability** | `intelligence.reflection.completed` |

### 2.2.13 Learn

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Validated improvement proposals |
| **Inputs** | REF, corrections, outcomes |
| **Outputs** | Learning Proposal (LRN) |
| **Ownership** | Learning Boundary / Learning Agent |
| **Allowed →** | Memory Manager (governed) |
| **Forbidden →** | Execute, code mutation |
| **Observability** | `learning.proposal.*` |

### 2.2.14 Optimize

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Routing/efficiency improvement — Improve sub-stage |
| **Inputs** | REF, LRN history, metrics |
| **Outputs** | Optimization Proposal (OPT) |
| **Ownership** | Learning Boundary |
| **Allowed →** | Orchestration profile update (governed) |
| **Forbidden →** | Code deployment |
| **Observability** | `optimization.proposal.*` |

### 2.2.15 Report

| Dimension | Specification |
|-----------|---------------|
| **Purpose** | Immutable intelligence snapshot |
| **Inputs** | Released chain, VRF pass |
| **Outputs** | Report snapshot (I8) |
| **Ownership** | Report Agent + Reports module |
| **Allowed →** | Distribution |
| **Forbidden →** | Seal without VRF |
| **Observability** | `report.snapshot.sealed` |

## 2.3 Stakes-Compressed Cycles

Low-risk routing may compress duration — **every stage accounted for in audit chain**. VRF never silently skipped for major class (AI-3).

---

# PART 3 — ORCHESTRATION ARCHITECTURE

## 3.1 Coordinator Responsibilities (System Coordinator)

| Responsibility | Detail |
|----------------|--------|
| Cycle lifecycle | Create, track, complete `cycle_id` |
| Stage routing | Invoke agents per Part 2 graph |
| Artifact registry | Ensure UAC chain complete |
| Release gate | Block Experience without VRF |
| Handoff | Execution only post-authorization |
| Never | Conclude, reason, verify content, execute |

## 3.2 Execution Routing

| Trigger | Route |
|---------|-------|
| User Ask Conquest | Application → Orchestration → cycle |
| Ingestion event | OBS → optional auto-cycle |
| Schedule | Background priority queue |
| Correction | Fast-path to Learning proposal |
| Automation | Execution queue — separate from cognitive |

## 3.3 Pipeline Coordination

Single coordinator authority per cycle. Parallel fan-out: Research domains, disjoint evidence fetches. Merge points: Evidence Assessment, Orchestration before Verify.

## 3.4 Scheduling

| Priority | Class |
|----------|-------|
| P0 | Safety, auth-adjacent, execution bounds violation |
| P1 | User-initiated visible wait |
| P2 | Standard intelligence |
| P3 | Background refresh, learning |

## 3.5 Cancellation

User cancel → cooperative abort at stage boundary. In-flight provider calls cancelled where possible. Partial artifacts marked `cancelled` — retained in audit.

## 3.6 Timeouts

Per-stage SLA classes. Timeout → structured failure artifact → retry or abort per policy.

## 3.7 Retry Policy

Classified per SDD-I §5.8: transient provider → retry; logic failure → reroute; verification fail → one upstream cycle max (configurable).

## 3.8 Escalation

| Condition | Action |
|-----------|--------|
| Repeated VRF fail | Human review queue |
| Policy violation | Orchestration escalation event |
| Agent unavailable | Degraded mode — BH-7 |

## 3.9 Recovery

Checkpoint at stage completion. Resume from last sealed artifact. Idempotent stage re-entry.

## 3.10 State Ownership

| State | Owner |
|-------|-------|
| Cycle graph | Orchestration |
| Artifacts | Data / artifact store |
| Session context | Auth + Gateway |
| Queue depth | Infrastructure |

---

# PART 4 — AGENT ARCHITECTURE

## 4.1 Architectural Principle

**Agents are workers. Intelligence systems are authorities.** Agents operate within one authority boundary unless Orchestration assigns multi-authority specialist role with explicit scope (ADR-0030).

## 4.2 Agent Catalog

### System Coordinator

| Field | Specification |
|-------|---------------|
| **Purpose** | Mediate full cycle — sole routing authority |
| **Responsibilities** | Part 3 — no cognitive conclusion |
| **Inputs** | Cycle requests, artifact status |
| **Outputs** | Stage invocations, cycle events |
| **Dependencies** | All agents (invoke only) |
| **Authority** | Orchestration Layer |
| **Failure** | Cycle abort with audit |
| **Extension** | Routing profiles per workspace |
| **Interaction** | All agents via contracts Part 5 |
| **Observability** | `orchestration.cycle.*` |

### Research Agent

| Field | Specification |
|-------|---------------|
| **Purpose** | Execute Research Intelligence acquisition plans |
| **Authority** | Research Intelligence |
| **Outputs** | RES |
| **Failure** | Gap report — incomplete RES |
| **Observability** | Domain-level metrics |

### Analysis Agent (Reasoning)

| Field | Specification |
|-------|---------------|
| **Purpose** | Produce RSN candidate conclusions |
| **Authority** | Reasoning Intelligence |
| **Outputs** | RSN |
| **Forbidden** | Release, execute |
| **Observability** | `intelligence.reasoning.*` |

### Prediction Agent

| Field | Specification |
|-------|---------------|
| **Purpose** | Register and monitor predictions |
| **Authority** | Prediction Intelligence |
| **Outputs** | PRD |
| **Failure** | Calibration reroute |

### Verification Agent

| Field | Specification |
|-------|---------------|
| **Purpose** | Produce VRF — **sole release gate authority** (ADR-0027) |
| **Authority** | Verification Intelligence |
| **Outputs** | VRF |
| **Forbidden** | Decide, recommend, execute |
| **Failure** | Blocking fail with reroute target |

### Recommendation Agent

| Field | Specification |
|-------|---------------|
| **Purpose** | Assemble human-calibrated recommendation package |
| **Authority** | Human Intelligence (calibration) + Experience |
| **Inputs** | DEC, VRF, HUM rules |
| **Outputs** | I10 projection payload |
| **Forbidden** | Alter DEC or bypass VRF |

### Execution Agent

| Field | Specification |
|-------|---------------|
| **Purpose** | Execute authorized steps |
| **Authority** | Execution Layer |
| **Layer** | Execution — not cognitive |
| **Outputs** | I9 trace |
| **Failure** | Rollback path Part 11 |

### Reflection Agent

| Field | Specification |
|-------|---------------|
| **Purpose** | Post-outcome attribution |
| **Authority** | Reflection Intelligence |
| **Outputs** | REF |

### Learning Agent

| Field | Specification |
|-------|---------------|
| **Purpose** | Generate LRN proposals |
| **Authority** | Learning Intelligence → **Learning Boundary** |
| **Forbidden** | Apply memory, execute |

### Knowledge Agent

| Field | Specification |
|-------|---------------|
| **Purpose** | Knowledge retrieval, upload processing assist |
| **Authority** | Knowledge Memory + vector index |
| **Reads** | Governed retrieval only |
| **Writes** | Via Memory Manager promotion |

### Memory Manager

| Field | Specification |
|-------|---------------|
| **Purpose** | **Sole memory write authority** — not an autonomous agent |
| **Type** | Governance service (ADR-0029) |
| **Forbidden** | Reason, recommend, execute |

### Report Agent

| Field | Specification |
|-------|---------------|
| **Purpose** | Seal and distribute report snapshots |
| **Authority** | Reports module + VRF gate |
| **Outputs** | I8 |

### Support Agent

| Field | Specification |
|-------|---------------|
| **Purpose** | Assist support workflows — read scoped intelligence |
| **Authority** | Support module — break-glass policy SDD-III |
| **Forbidden** | Mutate intelligence, bypass VRF |

### Automation Agent

| Field | Specification |
|-------|---------------|
| **Purpose** | Repeat authorized automation runs |
| **Authority** | Execution Layer + Automation module |
| **Distinction** | Product Automation vs cognitive agents |

### Marketplace Agent

| Field | Specification |
|-------|---------------|
| **Purpose** | Extension manifest verify, hook dispatch |
| **Authority** | Marketplace + Orchestration events |
| **Forbidden** | Nav expansion, direct Memory write |

### Risk Agent (Challenge)

| Field | Specification |
|-------|---------------|
| **Purpose** | Challenge Intelligence worker |
| **Authority** | Challenge Intelligence |
| **Outputs** | CHL |

### Planning Agent (Optional)

| Field | Specification |
|-------|---------------|
| **Purpose** | Execution planning post-Decide |
| **Authority** | Planning Intelligence |
| **Outputs** | PLN |
| **When** | Complex multi-step execution |

---

# PART 5 — INTER-AGENT COMMUNICATION

## 5.1 Contracts

Structured intelligence packets only (AMD IV §70):

| Field | Required |
|-------|----------|
| `task_id` | Yes |
| `cycle_id` | Yes |
| `source_agent` | Yes |
| `destination_agent` | Yes |
| `artifact_refs` | Yes |
| `confidence` | When applicable |
| `validation_status` | When applicable |
| `timestamp` | Yes |

**No** unstructured conversational agent mesh (ADR-0030).

## 5.2 Event Flow

Agents emit completion events — Coordinator subscribes. Domain events trigger cycles — never direct agent-to-agent bypass of Coordinator.

## 5.3 Ownership

Coordinator owns routing. Producing agent owns artifact until sealed to Data store.

## 5.4 Message Routing

All cognitive messages through Orchestration bus. Execution messages through Execution queue.

## 5.5 State Transfer

By artifact reference — not embedded full payloads on bus.

## 5.6 Retry

Consumer idempotent. Producer may retry transient failures once per stage policy.

## 5.7 Idempotency

`task_id` + `stage` + `cycle_id` composite idempotency key.

## 5.8 Dead-Letter Philosophy

Unprocessable after max retries → DLQ + alert + cycle `failed` with reason. Never silent drop.

## 5.9 Cancellation

Cancel token propagated; agents honor at boundary.

## 5.10 Backpressure

Queue depth thresholds → throttle P3, shed background, never shed P0/P1.

---

# PART 6 — REASONING ARCHITECTURE

## 6.1 Reasoning Layers

| Layer | Function |
|-------|----------|
| **Evidence** | Classify, score, cite |
| **Inference** | RSN generation |
| **Adversarial** | CHL |
| **Calibration** | PRD, confidence bands |
| **Decision** | DEC after VRF |
| **Communication** | HUM for Recommend |

## 6.2 Evidence Usage

All claims trace to EVD entries. Unsourced claims forbidden in released artifacts (IL-17).

## 6.3 Confidence Propagation

Confidence composed — weakest critical link wins for release threshold. Overconfidence triggers VRF fail.

## 6.4 Contradiction Handling

EVD conflicts → explicit resolution or cannot-conclude. Never average silently (CCIS §III.4).

## 6.5 Alternative Generation

RSN must include rejected hypotheses. DEC records rejected options.

## 6.6 Historical Comparison

Challenge and Research stages pull governed historical parallels.

## 6.7 Decision Synthesis

DEC after VRF — ranks surviving options with governance weights.

## 6.8 Recommendation Ranking

Presentation order by DEC rank — HUM adjusts communication not substance.

## 6.9 Verification Gating

No DEC inputs to Recommend without VRF pass. **Verify precedes Decide** in pipeline (ADR-0007, ADR-0026).

---

# PART 7 — MEMORY INTEGRATION

## 7.1 AMD III Memory Types

All reads via Memory Manager retrieval API. Types: User, Session, Project, Organization, Knowledge, Evidence, Success, Failure, Correction, Workflow + Business Memory Graph.

## 7.2 Memory Reads

Scoped by org_id, workspace_id, role. Session memory for UND. Evidence memory for EVD.

## 7.3 Memory Writes

**Memory Manager only** (IL-2, ADR-0029). Agents propose — Manager commits.

## 7.4 Promotion

Session → governed promotion (IL-18). Learning proposals → validated → promote.

## 7.5 Retrieval

Scoring per AMD III §41. Conflict surfaced — not hidden.

## 7.6 Conflict Handling

Manager resolves per governance rules. User Correction Memory overrides inferred (BH-4).

## 7.7 Versioning

All writes versioned. Rollback capable.

## 7.8 Confidence Evolution

Post-outcome adjustment via Learning Boundary — not direct agent write.

## 7.9 Session Promotion

Explicit governance review for cross-category promotion.

## 7.10 Learning Interaction

LRN validated → Manager apply. No agent direct write.

## 7.11 Authority Preservation

Memory Agent (worker) ≠ Memory Manager (authority).

---

# PART 8 — KNOWLEDGE INTEGRATION

## 8.1 Knowledge Graph

Business Memory Graph entities for Research and Reason. Typed relationships per AMD III §39.

## 8.2 Vector Retrieval

Knowledge index — scoped retrieval. Distinct from help index (IL-13).

## 8.3 Evidence Retrieval

Evidence Memory + ingestion lineage.

## 8.4 Historical Retrieval

Success/Failure/Correction memory for Challenge and Reflect.

## 8.5 Context Assembly

Context Intelligence assembles CTX artifact — fed to Reason and Research.

## 8.6 Freshness

Stale knowledge flagged per BH-7. Expired memory excluded from active conclusions (M4).

## 8.7 Permission Propagation

GIS §2 + IL permission rules on retrieval.

## 8.8 Citation Preservation

Knowledge-sourced claims carry citation chain to I8/report seal.

---

# PART 9 — VERIFICATION ARCHITECTURE

## 9.1 VRF Ownership

**Verification Agent / Verification Intelligence** — sole authority to issue release-gating VRF (ADR-0027).

## 9.2 Verification Rules

Logical, numerical, source, consistency, policy, confidence categories per AMD IV.

## 9.3 Verification Artifacts

VRF with per-category pass/fail and reroute targets.

## 9.4 Confidence Thresholds

Stake-class dependent — major requires all categories pass.

## 9.5 Evidence Validation

Source class minimum for claim types.

## 9.6 Conflict Resolution

Unresolved conflict → fail or cannot-release.

## 9.7 Failure States

`passed | failed | partial` — partial never releases major.

## 9.9 Release Gates

Orchestration checks VRF before Experience projection and Execution authorization.

---

# PART 10 — LEARNING ARCHITECTURE

## 10.1 Learning Proposals

LRN from Learning Agent → Learning Boundary validation.

## 10.2 Reflection

REF required before LRN for outcome-based learning.

## 10.3 Pattern Extraction

Repeated verified success before reinforcement (L5).

## 10.4 Safety Constraints

No verification bypass. No execution trigger. No code mutation (BH-6).

## 10.5 Rollback Protection

Holdout validation. Manager versioning rollback.

## 10.6 Approval Requirements

Critical domain proposals require human approval.

## 10.7 Learning Boundaries

ADR-0032 — Learning Agent output ≠ apply.

## 10.8 Continuous Improvement

OPT proposals for routing efficiency — governed apply.

---

# PART 11 — EXECUTION ARCHITECTURE

## 11.1 Execution Authority

Execution Agent within L5E — requires authorization record + VRF ref for intelligence-derived actions.

## 11.2 Execution Contracts

PLN steps with idempotency keys. Bounds declared pre-run.

## 11.3 Rollback

Reversible automations — compensating steps per AUT-06.

## 11.4 Monitoring

Real-time bounds check. `execution.BoundsViolated` → pause.

## 11.5 Compensation

Failed partial execution — compensate or alert.

## 11.6 State Transitions

`pending → running → completed | failed | rolled_back`

## 11.7 Failure Recovery

Retry idempotent steps. Non-idempotent → human gate.

## 11.8 Audit

Full trace linked to DEC, user decision, VRF.

---

# PART 12 — SAFETY ARCHITECTURE

## 12.1 Hallucination Prevention

Evidence-required claims. VRF source validation. Cannot-conclude preferred over fabrication (BH-8).

## 12.2 Prompt Injection Defense

Ingress sanitization — SDD-III INF-13. Tool allowlist.

## 12.3 Unsafe Recommendation Prevention

VRF policy category. High-stakes human gate.

## 12.4 Policy Enforcement

Organization policy in VRF. Org Memory constraints.

## 12.5 Abuse Detection

Rate limits, anomaly signals — SDD-III Part 8.

## 12.6 Human Intervention

D7 paths. Emergency stop.

## 12.7 Emergency Stop

Kill switch — execution halt, optional release block (SDD-III INF-22).

## 12.8 Verification-Before-Execution

VRF + authorization before Execution Agent invoke (AI-4, ADR-0027).

---

# PART 13 — OBSERVABILITY

## 13.1 Pipeline Traces

`cycle_id` spans all stages.

## 13.2 Reasoning Traces

RSN, CHL metadata — not raw chain-of-thought in ops default view.

## 13.3 Memory Traces

Manager operation audit.

## 13.4 Verification Traces

VRF category results.

## 13.5 Execution Traces

I9 step events.

## 13.6 Learning Traces

Proposal lifecycle.

## 13.7 Correlation IDs

Align with SDD-III INF-12.

## 13.8 Audit Trails

Complete artifact chain AMD IV §68.

## 13.9 Metrics

Stage duration, VRF pass rate, proposal acceptance.

## 13.10 Health

Agent pool depth, provider circuit state.

---

# PART 14 — SCALABILITY

## 14.1 Parallel Reasoning

Disjoint Research domains parallel — merge before Reason.

## 14.2 Agent Scaling

Horizontal worker pools per agent type.

## 14.3 Queueing

Priority queues per §3.4.

## 14.4 Load Balancing

Per-org fairness scheduling.

## 14.5 Resource Isolation

Workspace execution queues. Optional org cells.

## 14.6 Priority Scheduling

P0 preempts P3.

## 14.7 Graceful Degradation

Provider outage → structured degradation. Last verified read (ADR-0022).

---

# PART 15 — AI ENGINEERING LAWS

| Law | Title |
|-----|-------|
| AI-1 | Orchestration Never Concludes |
| AI-2 | CCIS Stage Order |
| AI-3 | No Silent Stage Skip |
| AI-4 | Verification Before Decide and Release |
| AI-5 | Verification Before Execution |
| AI-6 | Agent Authority Boundary |
| AI-7 | Coordinator Mediation |
| AI-8 | Structured Agent Packets Only |
| AI-9 | Memory Manager Sole Write |
| AI-10 | Learning Boundary Gate |
| AI-11 | No Agent Direct Provider |
| AI-12 | Evidence Citation Required |
| AI-13 | Challenge Before Verify |
| AI-14 | Human Gate High Stakes |
| AI-15 | Idempotent Execution Steps |
| AI-16 | Complete Artifact Chain |
| AI-17 | No Conversational Agent Mesh |
| AI-18 | Correction Precedence |
| AI-19 | Prediction Distinction |
| AI-20 | Fail Closed Release |
| AI-21 | Cycle Audit Retention |
| AI-22 | Emergency Stop Respect |
| AI-23 | Stakes Class Routing |
| AI-24 | Specialist Agent Scope |
| AI-25 | AI Production Gate |

### AI-1 — Orchestration Never Concludes

| | |
|-|-|
| **Purpose** | Preserve layer boundaries |
| **Rationale** | SDD-I EL; intelligence-first |
| **Enforcement** | Static boundary audit |
| **Verification** | Orchestration code review |
| **Failure** | Architecture violation |
| **ADRs** | 0026 |
| **SDD** | Part 3 |

### AI-2 — CCIS Stage Order

| | |
|-|-|
| **Purpose** | Canonical lifecycle |
| **Rationale** | ADR-0007 |
| **Enforcement** | Coordinator routing table |
| **Verification** | Integration stage-order test |
| **Failure** | Release blocker |
| **ADRs** | 0007, 0026 |
| **SDD** | Part 2 |

### AI-3 — No Silent Stage Skip

| | |
|-|-|
| **Purpose** | Audit completeness |
| **Rationale** | CCIS — compression ≠ skip |
| **Enforcement** | Cycle graph validation |
| **Verification** | Artifact chain audit |
| **Failure** | IL-20 class incident |
| **ADRs** | 0026 |
| **SDD** | Part 2 §2.3 |

### AI-4 — Verification Before Decide and Release

| | |
|-|-|
| **Purpose** | Trustworthy conclusions |
| **Rationale** | ADR-0006, 0027 |
| **Enforcement** | Coordinator gate |
| **Verification** | Bypass attempt test |
| **Failure** | SEV-1 |
| **ADRs** | 0006, 0027 |
| **SDD** | Part 2, 9 |

### AI-5 — Verification Before Execution

| | |
|-|-|
| **Purpose** | No unverified action |
| **Rationale** | CCIS Execute principle |
| **Enforcement** | Execution queue guard |
| **Verification** | Missing VRF reject test |
| **Failure** | SEV-1 |
| **ADRs** | 0015, 0027 |
| **SDD** | Part 11 |

### AI-6 — Agent Authority Boundary

| | |
|-|-|
| **Purpose** | Workers within authorities |
| **Rationale** | AMD IV §70 |
| **Enforcement** | Agent registry |
| **Verification** | Scope audit |
| **Failure** | Agent reject |
| **ADRs** | 0028 |
| **SDD** | Part 4 |

### AI-7 — Coordinator Mediation

| | |
|-|-|
| **Purpose** | Single routing authority |
| **Rationale** | ADR-0030 |
| **Enforcement** | No peer agent routing |
| **Verification** | Message path audit |
| **Failure** | Architecture violation |
| **ADRs** | 0030 |
| **SDD** | Part 3, 5 |

### AI-8 — Structured Agent Packets Only

| | |
|-|-|
| **Purpose** | Auditable communication |
| **Rationale** | AMD IV §70 |
| **Enforcement** | Bus schema validation |
| **Verification** | Contract test |
| **Failure** | Message reject |
| **ADRs** | 0030 |
| **SDD** | Part 5 |

### AI-9 — Memory Manager Sole Write

| | |
|-|-|
| **Purpose** | Governed memory |
| **Rationale** | IL-2, ADR-0029 |
| **Enforcement** | Data API |
| **Verification** | Write path test |
| **Failure** | Quarantine |
| **ADRs** | 0008, 0029 |
| **SDD** | Part 7 |

### AI-10 — Learning Boundary Gate

| | |
|-|-|
| **Purpose** | Safe learning |
| **Rationale** | ADR-0032 |
| **Enforcement** | LRN validation |
| **Verification** | Direct apply reject |
| **Failure** | Proposal reject |
| **ADRs** | 0009, 0032 |
| **SDD** | Part 10 |

### AI-11 — No Agent Direct Provider

| | |
|-|-|
| **Purpose** | Abstraction boundary |
| **Rationale** | ADR-0011 |
| **Enforcement** | Network policy |
| **Verification** | Egress audit |
| **Failure** | Block |
| **ADRs** | 0011 |
| **SDD** | Part 4 |

### AI-12 — Evidence Citation Required

| | |
|-|-|
| **Purpose** | Traceable claims |
| **Rationale** | IL-17 |
| **Enforcement** | VRF source check |
| **Verification** | Lineage test |
| **Failure** | VRF fail |
| **ADRs** | 0031 |
| **SDD** | Part 6, 8 |

### AI-13 — Challenge Before Verify

| | |
|-|-|
| **Purpose** | Adversarial review |
| **Rationale** | CCIS §II |
| **Enforcement** | Stage graph |
| **Verification** | Missing CHL test |
| **Failure** | Cycle reject major |
| **ADRs** | 0026 |
| **SDD** | Part 2 |

### AI-14 — Human Gate High Stakes

| | |
|-|-|
| **Purpose** | Human authority |
| **Rationale** | BH-9 |
| **Enforcement** | Execution guard |
| **Verification** | Stakes class test |
| **Failure** | Block execute |
| **ADRs** | — |
| **SDD** | Part 2, 11 |

### AI-15 — Idempotent Execution Steps

| | |
|-|-|
| **Purpose** | Safe retry |
| **Rationale** | SDD-I §5.8 |
| **Enforcement** | Execution Agent |
| **Verification** | Duplicate step test |
| **Failure** | Duplicate detect |
| **ADRs** | 0034 |
| **SDD** | Part 11 |

### AI-16 — Complete Artifact Chain

| | |
|-|-|
| **Purpose** | Audit trail |
| **Rationale** | AMD IV §68 |
| **Enforcement** | Coordinator seal |
| **Verification** | Chain completeness |
| **Failure** | Cycle incomplete |
| **ADRs** | — |
| **SDD** | Part 2 |

### AI-17 — No Conversational Agent Mesh

| | |
|-|-|
| **Purpose** | Prevent emergent routing |
| **Rationale** | ADR-0030 |
| **Enforcement** | Bus topology |
| **Verification** | Peer message detect |
| **Failure** | Architecture violation |
| **ADRs** | 0030 |
| **SDD** | Part 5 |

### AI-18 — Correction Precedence

| | |
|-|-|
| **Purpose** | User truth wins |
| **Rationale** | BH-4, M3 |
| **Enforcement** | Memory Manager |
| **Verification** | Correction override test |
| **Failure** | Data integrity bug |
| **ADRs** | — |
| **SDD** | Part 7 |

### AI-19 — Prediction Distinction

| | |
|-|-|
| **Purpose** | No fact confusion |
| **Rationale** | CCIS P1 |
| **Enforcement** | HUM + Experience |
| **Verification** | UI contract |
| **Failure** | Release blocker |
| **ADRs** | — |
| **SDD** | Part 2 |

### AI-20 — Fail Closed Release

| | |
|-|-|
| **Purpose** | No partial leak |
| **Rationale** | GIS §2.5 |
| **Enforcement** | Gateway + Orchestration |
| **Verification** | VRF fail surfacing test |
| **Failure** | SEV-1 |
| **ADRs** | 0027 |
| **SDD** | Part 9 |

### AI-21 — Cycle Audit Retention

| | |
|-|-|
| **Purpose** | Forensics |
| **Rationale** | R2 retention |
| **Enforcement** | Artifact store policy |
| **Verification** | Retention audit |
| **Failure** | Compliance gap |
| **ADRs** | — |
| **SDD** | Part 13 |

### AI-22 — Emergency Stop Respect

| | |
|-|-|
| **Purpose** | Incident containment |
| **Rationale** | SDD-III INF-22 |
| **Enforcement** | Kill switch |
| **Verification** | Drill |
| **Failure** | Ops blocker |
| **ADRs** | 0035 |
| **SDD** | Part 12 |

### AI-23 — Stakes Class Routing

| | |
|-|-|
| **Purpose** | Proportional depth |
| **Rationale** | CCIS compression rules |
| **Enforcement** | Routing profiles |
| **Verification** | Profile matrix test |
| **Failure** | Over/under processing |
| **ADRs** | 0026 |
| **SDD** | Part 2 §2.3 |

### AI-24 — Specialist Agent Scope

| | |
|-|-|
| **Purpose** | Domain boundaries |
| **Rationale** | AMD IV A1 |
| **Enforcement** | Agent registry scope |
| **Verification** | Cross-domain reject |
| **Failure** | Escalate to Coordinator |
| **ADRs** | 0028, 0030 |
| **SDD** | Part 4 |

### AI-25 — AI Production Gate

| | |
|-|-|
| **Purpose** | No AI deploy without readiness |
| **Rationale** | Complements INF-25 |
| **Enforcement** | Release pipeline |
| **Verification** | AI gate checklist |
| **Failure** | Deploy blocked |
| **ADRs** | 0035 |
| **SDD** | Part 16 |

---

# PART 16 — APPROVAL CRITERIA

## 16.1 Architecture Completeness

- [x] Parts 0–16 complete
- [x] Full cognitive pipeline Part 2 (15 stages)
- [x] All candidate agents Part 4
- [x] AI-1–AI-25 complete

## 16.2 Authority Compliance

- [x] CCIS stage order per ADR-0007
- [x] No product/UX/infra redefinition
- [x] AMD IV agent binding respected

## 16.3 RTM Coverage

- [x] INT, MEM, ENG rows mapped §0.4

## 16.4 ADR Compliance

- [x] ADR-0026–0035 created

## 16.5 Review

- [x] `sdd-volume-iv-review-checklist.md` executed

---

*SDD Volume IV v1.0 — AI Orchestration & Agent Architecture. Architectural specification only.*
