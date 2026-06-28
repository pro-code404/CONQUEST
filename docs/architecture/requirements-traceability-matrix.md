# Conquest — Requirements Traceability Matrix (RTM)

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | Requirements Traceability Matrix |
| **Abbreviation** | RTM |
| **Status** | Master Verification Artifact — Active |
| **Version** | 1.1 |
| **Effective Date** | 2026-06-21 |
| **Governed By** | [ARCHITECTURE-FREEZE.md](ARCHITECTURE-FREEZE.md) v1.0 |
| **Supersedes** | Ad-hoc cross-references in individual volume reviews |

### Mission

Provide **complete forward and backward traceability** from CCIS intelligence requirements through AMD, PDD, UXMD, SDD, ADR, future implementation, and future test coverage. The RTM is the master verification artifact for the engineering program.

### Traceability Chain

```
CCIS Requirement → AMD Principle → PDD Workflow → UXMD Screen(s)
  → SDD Component(s) → ADR Decision(s) → Future Implementation Phase → Future Test Coverage
```

### Column Definitions

| Column | Definition |
|--------|------------|
| **Requirement ID** | Unique RTM identifier — never reused |
| **Description** | Testable requirement statement |
| **Source document** | Authoritative origin |
| **Downstream documents** | Where requirement is elaborated or enforced |
| **Engineering owner** | SDD layer, platform service, or subsystem |
| **Verification method** | How compliance is proven |
| **Implementation status** | `Not Started` \| `Specified` \| `In Build` \| `Verified` |
| **Build phase** | When implementation authorized |
| **Related ADRs** | Binding architectural decisions |
| **Links** | Relative paths to source sections |

### Status Legend

| Status | Meaning |
|--------|---------|
| **Not Started** | Requirement traced; no implementation |
| **Specified** | Engineering architecture defines enforcement (SDD I–III) |
| **In Build** | Implementation authorized and underway |
| **Verified** | Test evidence confirms compliance |

**Current program state:** Build-1 authorized (BAR-2026-06-26-001). Platform RTM rows `In Build`.

---

# Part A — Intelligence & Cognitive Requirements

| ID | Description | Source | Downstream | Engineering Owner | Verification | Status | Build Phase | ADRs | Links |
|----|-------------|--------|------------|-------------------|--------------|--------|-------------|------|-------|
| RTM-INT-001 | Twelve-stage CCIS cognitive loop must be preserved in orchestration | CCIS §II | AMD IV §69; SDD-II Part 5; SDD-IV (pending) | Orchestration Layer | Lifecycle integration test; artifact chain audit | Specified | Build-2 Orchestration | 0007 | [ccis.md](ccis.md), [../sdd/volume-ii-data-intelligence-architecture.md](../sdd/volume-ii-data-intelligence-architecture.md) |
| RTM-INT-002 | Verify → Decide → Recommend stage order | CCIS §II.6–8 | AMD IV §67; SDD-II v1.2 Part 5 | Intelligence Layer | Stage-order contract test | Specified | Build-2 | 0006, 0007 | [ccis.md](ccis.md) |
| RTM-INT-003 | No major intelligence release without VRF pass | CCIS §II.6; BH-5 | SDD-II IL-1; SDD-III INF-4 | Orchestration + Gateway | Release gate test; IL-1 audit | Specified | Build-2 | 0006 | [../pdd/volume-i-product-behavior-architecture.md](../pdd/volume-i-product-behavior-architecture.md) |
| RTM-INT-004 | Challenge before Verify on major conclusions | CCIS §II.5–6 | AMD IV Challenge; SDD-II §5.5 | Challenge engine | Challenge artifact present in chain | Specified | Build-2 | 0007 | [amd/volume-iv-intelligence-systems.md](amd/volume-iv-intelligence-systems.md) |
| RTM-INT-005 | Learning never modifies production code | CCIS L3; BH-6 | SDD-I Learning Boundary; SDD-II §5.12 | Learning Boundary | Deploy pipeline gate; no code path from LRN | Specified | Build-3 | 0009 | [ccis.md](ccis.md) |
| RTM-INT-006 | Execution only when authorized | CCIS §II.9; BH-9 | PDD D7; SDD-I L5E; SDD-II §5.9 | Execution Layer | Authorization record required pre-run | Specified | Build-2 | 0015 | [../pdd/volume-ii-module-specifications.md](../pdd/volume-ii-module-specifications.md) |
| RTM-INT-007 | AI provider calls behind Intelligence Layer only | SDD-I §7.4 | SDD-III Part 6; SDD-IV | Intelligence + Integration | Static analysis; no client SDK | Specified | Build-2 | 0011, 0020 | [../sdd/volume-i-system-architecture.md](../sdd/volume-i-system-architecture.md) |
| RTM-INT-008 | Evidence classification hierarchy enforced | CCIS §III | AMD IV Evidence; SDD-II Part 9 | Evidence Intelligence | Evidence class in EVD artifacts | Specified | Build-2 | 0008 | [ccis.md](ccis.md) |
| RTM-INT-009 | Predictions distinguishable from verified facts | CCIS P1; BH-3 | UXMD CC-13; SDD-II Part 11 | Experience + Intelligence | UI label contract; taxonomy test | Specified | Build-2 | — | [../uxmd/volume-ii-screen-interaction-specification.md](../uxmd/volume-ii-screen-interaction-specification.md) |
| RTM-INT-010 | User corrections override inferred memory | CCIS M3; BH-4 | PDD workflows; SDD-II IL-3 | Memory Manager | Correction precedence integration test | Specified | Build-2 | 0008 | [ccis.md](ccis.md) |

---

# Part B — Memory & Data Requirements

| ID | Description | Source | Downstream | Engineering Owner | Verification | Status | Build Phase | ADRs | Links |
|----|-------------|--------|------------|-------------------|--------------|--------|-------------|------|-------|
| RTM-MEM-001 | All memory writes through Memory Manager only | AMD III §41; IL-2 | SDD-I Data Layer; SDD-III Part 7 | Data / Memory Manager | Write-path audit; IL-2 gate | Specified | Build-2 | 0008 | [amd/volume-iii-memory-architecture.md](amd/volume-iii-memory-architecture.md) |
| RTM-MEM-002 | Memory lifecycle Proposed→Active→Expired→Archived→Deleted | AMD III §40 | SDD-II Part 8 | Memory Manager | State transition tests | Specified | Build-2 | 0008 | [amd/volume-iii-memory-architecture.md](amd/volume-iii-memory-architecture.md) |
| RTM-MEM-003 | Universal memory attributes per AMD III §28 | AMD III §28 | SDD-II UAC Part 3 | Memory Manager | Attribute schema conformance | Specified | Build-2 | 0008 | [amd/volume-iii-memory-architecture.md](amd/volume-iii-memory-architecture.md) |
| RTM-MEM-004 | Workspace-scoped memory retrieval | AMD III; SDD-I scope | SDD-III Part 3 | Data Layer | Cross-workspace read denied | In Build | Build-1 | 0003, 0016 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-MEM-005 | Session memory promotion governed | SDD-II IL-18; Part 8.2 | PDD workflows | Memory Manager | Promotion audit trail | Specified | Build-2 | 0008 | [../sdd/volume-ii-data-intelligence-architecture.md](../sdd/volume-ii-data-intelligence-architecture.md) |
| RTM-MEM-006 | Evidence citation chain to source | SDD-II Part 9; IL-17 | UXMD CC-* evidence UI | Intelligence + Data | Lineage resolution test | Specified | Build-2 | 0008 | [../sdd/volume-ii-data-intelligence-architecture.md](../sdd/volume-ii-data-intelligence-architecture.md) |
| RTM-MEM-007 | Report snapshots immutable after seal | SDD-II §5.14; PDD Reports | UXMD RPT-* | Reports module + Data | Seal immutability test | Specified | Build-2 | 0014 | [../pdd/volume-ii-module-specifications.md](../pdd/volume-ii-module-specifications.md) |
| RTM-MEM-008 | Retention classes R0–R5 enforced | SDD-II; SDD-III Part 7 | SDD-III INF-15 | Storage + Data | Retention job audit | In Build | Build-1 | 0018, 0021 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |

---

# Part C — Product Behavior & Workflow Requirements

| ID | Description | Source | Downstream | Engineering Owner | Verification | Status | Build Phase | ADRs | Links |
|----|-------------|--------|------------|-------------------|--------------|--------|-------------|------|-------|
| RTM-PDD-001 | Intelligence systems invisible to user navigation | BH-2; AMD IV §71 | UXMD-I NAV-3; PDD-II MSD | Application modules | Nav inventory test | In Build | Build-1 | 0005 | [../pdd/volume-i-product-behavior-architecture.md](../pdd/volume-i-product-behavior-architecture.md) |
| RTM-PDD-002 | Degraded state always explicit | BH-7 | GIS S-RECOVER; SDD-I | Experience + Gateway | Stale banner test | In Build | Build-1 | 0012 | [../uxmd/volume-iii-global-interaction-standards.md](../uxmd/volume-iii-global-interaction-standards.md) |
| RTM-PDD-003 | Empty workspace honestly empty | BH-8 | GIS §1.4; UXMD ONB-* | Command Center module | `CommandCenterHomeView.test.ts` (dormant) | Verified | Build-1 | 0002 | [../uxmd/volume-iii-global-interaction-standards.md](../uxmd/volume-iii-global-interaction-standards.md) |
| RTM-PDD-004 | D7 user decision on recommendations | PDD-II D7; Part B | UXMD CC-11, CC-14 | Command Center + Orchestration | Approve/modify/defer flows | Specified | Build-2 | 0014, 0015 | [../pdd/volume-ii-module-specifications.md](../pdd/volume-ii-module-specifications.md) |
| RTM-PDD-005 | Outcome measurement after execution | PDD workflows; BH-10 | UXMD CC-15; SDD-II §5.10 | Application + Domain | Outcome record test | Specified | Build-2 | 0015 | [../uxmd/volume-ii-screen-interaction-specification.md](../uxmd/volume-ii-screen-interaction-specification.md) |
| RTM-PDD-006 | Automation rollback on failure | PDD-II AUT; UXMD AUT-06 | SDD-I Execution; SDD-III DR | Execution Layer | Rollback integration test | Specified | Build-2 | 0015, 0021 | [../uxmd/volume-ii-screen-interaction-specification.md](../uxmd/volume-ii-screen-interaction-specification.md) |
| RTM-PDD-007 | Billing never alters intelligence | PD-12; IL-14 | SDD-I §7.6 | Billing platform service | Entitlement isolation test | In Build | Build-1 | 0014 | [../sdd/volume-i-system-architecture.md](../sdd/volume-i-system-architecture.md) |
| RTM-PDD-008 | Marketplace extensions do not expand nav | PDD-II MSD-13; Part H | SDD-I Marketplace hooks | Marketplace module | Extension manifest test | Specified | Build-3 | 0005, 0014 | [../pdd/volume-ii-module-specifications.md](../pdd/volume-ii-module-specifications.md) |

---

# Part D — User Experience Requirements

| ID | Description | Source | Downstream | Engineering Owner | Verification | Status | Build Phase | ADRs | Links |
|----|-------------|--------|------------|-------------------|--------------|--------|-------------|------|-------|
| RTM-UX-001 | Command Center is home | UXMD-I UX-12 | PDD-II Part B; SDD-I | Presentation + Gateway default route | `CommandCenterScreen`; `CommandCenterHomeView.test.ts` | Verified | Build-1 | 0002 | [../uxmd/volume-i-user-experience-master-document.md](../uxmd/volume-i-user-experience-master-document.md) |
| RTM-UX-002 | Seven-item primary navigation frozen | UXMD-I NAV-1; MSD-13 | SDD-I §4 | Presentation Layer | Nav count regression | In Build | Build-1 | 0005 | [../uxmd/volume-i-user-experience-master-document.md](../uxmd/volume-i-user-experience-master-document.md) |
| RTM-UX-003 | Workspace selector in utility bar | UXMD-I; PDD-II Part C | SDD-I workspace switch | Presentation | UI placement test | In Build | Build-1 | 0003 | [../pdd/volume-ii-module-specifications.md](../pdd/volume-ii-module-specifications.md) |
| RTM-UX-004 | GIS global states inherited | UXMD-III Part 1 | SDD-I Presentation | Client application | Per-screen state audit | In Build | Build-1 | 0012 | [../uxmd/volume-iii-global-interaction-standards.md](../uxmd/volume-iii-global-interaction-standards.md) |
| RTM-UX-005 | RBAC Owner>Admin>Manager>Member>Viewer | GIS §2 | SDD-III Part 4; SDD-II Part 23 | Security + Application | `permissions.test.ts` | Verified | Build-1 | 0012, 0017 | [../uxmd/volume-iii-global-interaction-standards.md](../uxmd/volume-iii-global-interaction-standards.md) |
| RTM-UX-006 | Fail closed on permission denial | GIS §2.5; EL-19 | SDD-III Part 4, 8 | Gateway + Application | `route-access.test.ts`; `app.test.ts` (403) | Verified | Build-1 | 0017, 0020 | [../uxmd/volume-iii-global-interaction-standards.md](../uxmd/volume-iii-global-interaction-standards.md) |
| RTM-UX-007 | MFA enrollment SET-03a | UXMD-II SET-03a | SDD-I §7.9; SDD-III Part 4 | Auth platform service | MFA flow E2E | In Build | Build-1 | 0017 | [../uxmd/volume-ii-screen-interaction-specification.md](../uxmd/volume-ii-screen-interaction-specification.md) |
| RTM-UX-008 | WCAG 2.2 AA binding | GIS Part 3; SDD-I §1.15 | SDD-V (pending) | Presentation | A11y audit gate | In Build | Build-1 | 0012, 0025 | [../uxmd/volume-iii-global-interaction-standards.md](../uxmd/volume-iii-global-interaction-standards.md) |
| RTM-UX-009 | Ask Conquest structured — not chat | UXMD-I §D.5 | PDD-I; UXMD CC-Ask | Command Center | UX pattern review | Specified | Build-2 | 0002 | [../uxmd/volume-i-user-experience-master-document.md](../uxmd/volume-i-user-experience-master-document.md) |
| RTM-UX-010 | Route guards for auth/onboarding/workspace | GIS §2.5 | SDD-III Part 4 | Gateway | `route-access.test.ts`; `app.test.ts` (Phase 2) | Verified | Build-1 | 0017 | [../uxmd/volume-iii-global-interaction-standards.md](../uxmd/volume-iii-global-interaction-standards.md) |

---

# Part E — Engineering & Platform Requirements

| ID | Description | Source | Downstream | Engineering Owner | Verification | Status | Build Phase | ADRs | Links |
|----|-------------|--------|------------|-------------------|--------------|--------|-------------|------|-------|
| RTM-ENG-001 | Event-driven decoupling at intelligence scale | SDD-I §5 | SDD-II observability | Message bus + all consumers | Idempotency + correlation test | In Build | Build-1 | 0010 | [../sdd/volume-i-system-architecture.md](../sdd/volume-i-system-architecture.md) |
| RTM-ENG-002 | Cross-org events forbidden | SDD-I EP-6 | SDD-III Part 3 | Gateway + bus | Cross-tenant event injection test | In Build | Build-1 | 0016 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-ENG-003 | Orchestration routes — never concludes | SDD-I EL | AMD IV | Orchestration Layer | Static boundary audit | Specified | Build-2 | 0014 | [../sdd/volume-i-system-architecture.md](../sdd/volume-i-system-architecture.md) |
| RTM-ENG-004 | Learning Boundary never triggers execution | SDD-I §3.13 | SDD-II §5.12 | Learning Boundary | No execution event from LRN path | Specified | Build-2 | 0009 | [../sdd/volume-i-system-architecture.md](../sdd/volume-i-system-architecture.md) |
| RTM-ENG-005 | Module bounded contexts — no direct engine calls | SDD-I §4; EP-3 | PDD-II Part K | Application modules | Dependency graph audit | In Build | Build-1 | 0014, 0010 | [../sdd/volume-i-system-architecture.md](../sdd/volume-i-system-architecture.md) |
| RTM-ENG-006 | Universal Artifact Contract on all intelligence artifacts | SDD-II Part 3 | SDD-III Part 7 | Data + Intelligence | UAC field conformance | Specified | Build-2 | 0008 | [../sdd/volume-ii-data-intelligence-architecture.md](../sdd/volume-ii-data-intelligence-architecture.md) |
| RTM-ENG-007 | Information Engineering Laws IL-1–IL-21 | SDD-II Part 24 | SDD-V CI gates | All layers | IL compliance suite | Specified | Build-1–3 | 0006, 0008 | [../sdd/volume-ii-data-intelligence-architecture.md](../sdd/volume-ii-data-intelligence-architecture.md) |
| RTM-ENG-008 | Correlation ID on all events | SDD-I §5.3 | SDD-III Part 10 | All publishers | Envelope field audit | In Build | Build-1 | 0023, 0038 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-ENG-009 | Circuit breaker per external provider | SDD-I §7.10 | SDD-III Part 11 | Integration Layer | Provider outage simulation | In Build | Build-1 | 0022 | [../sdd/volume-i-system-architecture.md](../sdd/volume-i-system-architecture.md) |
| RTM-ENG-010 | Platform services Auth/Notifications/Billing | SDD-I §6 | SDD-III Part 2 | Platform tier | `app.test.ts` (auth API); `identity-service.test.ts` | Verified | Build-1 | 0014 | [../sdd/volume-i-system-architecture.md](../sdd/volume-i-system-architecture.md) |

---

# Part F — Infrastructure & Security Requirements (SDD III)

| ID | Description | Source | Downstream | Engineering Owner | Verification | Status | Build Phase | ADRs | Links |
|----|-------------|--------|------------|-------------------|--------------|--------|-------------|------|-------|
| RTM-INF-001 | Organization tenant isolation non-negotiable | SDD-I; Freeze §2 | SDD-III Part 3; INF-1 | Gateway + Storage | `identity-service.test.ts` (tenant isolation) | Verified | Build-1 | 0016 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-002 | Zero trust between trust zones | SDD-III Part 1, 6, 8 | INF-2 | All tiers | Zone boundary audit | In Build | Build-1 | 0020 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-003 | Secrets never in client | SDD-I §7.4; INF-7 | SDD-III Part 5 | Security + Integration | Client bundle scan | In Build | Build-1 | 0011, 0019 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-004 | Encryption at rest for all durable stores | SDD-III Part 9; INF-9 | Storage tier | Encryption conformance audit | In Build | Build-1 | 0018 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-005 | Encryption in transit TLS 1.2+ minimum | SDD-III Part 9; INF-8 | Edge + Gateway | TLS scan | In Build | Build-1 | 0018 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-006 | Session rotation and revocation | SDD-I §7.9; SDD-III Part 4 | Auth service | `identity-service.test.ts`; `app.test.ts` | Verified | Build-1 | 0017 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-007 | Key rotation without plaintext exposure | SDD-III Part 5, 9; INF-11 | Security custody | Rotation drill | In Build | Build-1 | 0018, 0019 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-008 | RTO/RPO tier classes defined | SDD-I §8.7; SDD-III Part 11 | INF-20, 21 | Operations | DR drill per tier | In Build | Build-1 | 0021, 0022 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-009 | AI prompt/response logging classified | SDD-I §7.4; SDD-III Part 10 | Intelligence + Security | Log classification audit | Specified | Build-2 | 0011, 0023 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-010 | Production readiness gate before deploy | SDD-III Part 13; INF-25 | SDD-V | Release engineering | Gate checklist | Specified | Build-0 | 0025 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-011 | Prompt injection defense at intelligence boundary | SDD-III Part 8; INF-13 | Intelligence ingress | Red-team prompt test | Specified | Build-2 | 0020 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-012 | Rate limiting at edge and gateway | SDD-III Part 8; INF-16 | Edge + Gateway | Load abuse simulation | In Build | Build-1 | 0020 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-013 | Security incident response runbooks | SDD-III Part 8, 13; INF-24 | Operations | Tabletop exercise | In Build | Build-1 | 0024 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-014 | Kill switches for execution and intelligence release | SDD-III Part 13; INF-22 | Orchestration + Gateway | Kill switch drill | In Build | Build-1 | 0025 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |
| RTM-INF-015 | Backup encryption and restore verification | SDD-III Part 7, 9, 11 | Storage + Ops | Restore drill | In Build | Build-1 | 0021 | [../sdd/volume-iii-infrastructure-security-architecture.md](../sdd/volume-iii-infrastructure-security-architecture.md) |

---

# Part G — Screen-to-Requirement Index (Representative)

| Screen family | RTM IDs | Module |
|---------------|---------|--------|
| CC-* Command Center | RTM-UX-001, RTM-INT-003, RTM-PDD-004, RTM-UX-009 | command-center |
| STR-* Strategy | RTM-UX-002, RTM-INT-009 | strategy |
| RPT-* Reports | RTM-MEM-007, RTM-INT-003 | reports |
| INT-* Intelligence | RTM-PDD-001, RTM-INT-009 | intelligence (Command Center entry) |
| RES-* Research | RTM-ENG-005 | research |
| OPS-* Operations | RTM-INF-008, RTM-ENG-008 | operations |
| ADM-* Administration | RTM-UX-005, RTM-INF-006 | settings/administration |
| COG-* Cognitive | RTM-INT-001, RTM-ENG-005, RTM-INF-008 | cognitive |
| MEM-* Cognitive memory | RTM-MEM-001, RTM-MEM-004 | memory |
| EVD-* Evidence | RTM-INT-008, ADR-0031 | evidence |
| DEC-* Decision | RTM-INT-002, RTM-INT-006 | decision |
| PROMPT-* Prompt registry | RTM-INF-003, IL-2 | prompt-management |
| PROVIDER-* AI routing | RTM-INT-007, RTM-ENG-009 | ai-gateway |
| AUT-* Automation | RTM-PDD-006, RTM-INT-006 | automation |
| SET-* Settings | RTM-UX-005, RTM-UX-007, RTM-INF-006 | settings |
| ONB-* Onboarding | RTM-UX-010, RTM-PDD-003 | onboarding |
| SYS-* System | RTM-UX-006, RTM-PDD-002 | platform |
| PUB-* Public | RTM-INF-006, RTM-UX-010 | auth |

Full screen inventory: UXMD-II (102 screens). Each screen inherits GIS standards (RTM-UX-004).

---

# Part H — Build Phase Model

| Phase | Scope | RTM coverage |
|-------|-------|--------------|
| **Build-0** | Governance, CI, readiness gates | RTM-INF-010 |
| **Build-1** | Platform foundation: Gateway, Auth, tenant isolation, storage, observability | RTM-INF-*, RTM-UX-005–010, RTM-ENG-001–002, RTM-ENG-005 |
| **Build-2** | Intelligence pipeline, memory, execution, integrations | RTM-INT-*, RTM-MEM-*, RTM-PDD-004–006, RTM-ENG-003–007 |
| **Build-3** | Marketplace, advanced enterprise, optimization | RTM-PDD-008, RTM-INT-005 |

Build phases are **not authorized** until SDD V and explicit build authorization.

---

# Part I — Coverage Summary

| Corpus | Requirements traced | Specified | Verified |
|--------|---------------------|-----------|----------|
| CCIS | 10 (Part A) + laws in Parts B–F | 63 | 0 |
| AMD III–IV | 8 (Part B) + INT | 63 | 0 |
| PDD I–II | 8 (Part C) | 63 | 0 |
| UXMD I–III | 10 (Part D) + screen index | 63 | 0 |
| SDD I–II | 10 (Part E) | 63 | 0 |
| SDD IV | 15 (Part K) | 78 | 0 |
| **Total RTM rows** | **78** | **78** | **9** |

### Expansion Protocol

New requirements receive the next ID in category sequence. Each new SDD volume, PDD amendment, or ADR that introduces enforceable behavior must add RTM rows before seal approval.

---

# Part J — Maintenance

| Event | RTM action |
|-------|------------|
| ADR Accepted | Add/update RTM rows; link ADR column |
| SDD volume sealed | Mark Part F+ rows Specified |
| Build authorized | Set affected rows In Build |
| Test suite passing | Set Verified with test ID reference |
| Architecture Freeze amendment | Revalidate all affected rows |

---

# Part K — AI Orchestration Requirements (SDD-IV)

| ID | Description | Source | SDD-IV | ADRs | Status |
|----|-------------|--------|--------|------|--------|
| RTM-AI-001 | CCIS stage order in orchestration | ADR-0007 | Part 2 | 0026 | Specified |
| RTM-AI-002 | Orchestration never concludes | SDD-I | Part 3 | 0026 | Specified |
| RTM-AI-003 | Coordinator mediates all agents | AMD IV §70 | Part 3, 5 | 0030 | Specified |
| RTM-AI-004 | VRF sole release gate | IL-1 | Part 9 | 0027 | Specified |
| RTM-AI-005 | Verify before Decide and Recommend | CCIS §II | Part 2 | 0007, 0027 | Specified |
| RTM-AI-006 | Agent authority isolation | AMD IV §70 | Part 4 | 0028 | Specified |
| RTM-AI-007 | Memory Manager sole write | IL-2 | Part 7 | 0029 | Specified |
| RTM-AI-008 | Evidence-first reasoning | CCIS §III | Part 6 | 0031 | Specified |
| RTM-AI-009 | Learning via Learning Boundary | BH-6 | Part 10 | 0033 | Specified |
| RTM-AI-010 | No conversational agent mesh | AMD IV | Part 5 | 0030 | Specified |
| RTM-AI-011 | AI failure recovery classified | SDD-I §5.8 | Part 3 | 0034, 0038 | Verified |
| RTM-AI-012 | Safety layered boundaries | CCIS | Part 12 | 0035 | Specified |
| RTM-AI-013 | Complete artifact chain per cycle | AMD IV §68 | Part 2 | AI-16 | Specified |
| RTM-AI-014 | AI provider behind Intelligence only | SDD-I §7.4 | Part 4 | 0011, 0028 | Specified |
| RTM-AI-015 | AI production gate | INF-25 complement | Part 16 | 0035, AI-25 | Specified |

*RTM v1.1 — adds Part K on SDD-IV seal.*

---

*RTM v1.1 — Master verification artifact. Maintained alongside [ARCHITECTURE-FREEZE.md](ARCHITECTURE-FREEZE.md) and [adr/README.md](adr/README.md).*
