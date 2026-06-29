# Product Master Specification

Authoritative product specification for Conquest. Consolidates PDD intent, UXMD experience, and as-built implementation status.

On conflict: frozen PDD/UXMD in `docs/pdd/` and `docs/uxmd/` prevail for *intent*; this document prevails for *implementation status*.

Cross-reference: [conquest-complete-reference](./conquest-complete-reference.md) · [product-knowledge](./product-knowledge.md) · [development-memory](./development-memory.md)

---

## 1. Vision

Conquest is an **Adaptive Cognitive Intelligence Operating System (CIOS)**. Users operate from a **Command Center** that synthesizes research, intelligence, automation, and operations into decision-ready awareness — with evidence-backed recommendations and verification-first release.

**Sources:** [CCIS](../architecture/ccis.md) · [PDD Volume I](../pdd/volume-i-product-behavior-architecture.md) · [UXMD Volume I](../uxmd/volume-i-user-experience-master-document.md)

---

## 2. What Conquest is NOT

- A chatbot or single-model prompt UI
- A passive analytics dashboard
- An engine catalog (Research/Memory/Models as primary nav)
- Autonomous self-modifying software
- A finished product — the First Law applies

---

## 3. Business goals

| Goal | How Conquest addresses it |
|------|---------------------------|
| Decision quality | Evidence → reasoning → decision pipeline with confidence |
| Operational coherence | Command Center aggregates modules |
| Trust | Verification gate, legal acceptance, audit trails |
| Multi-tenant SaaS | Org/workspace isolation, RBAC |
| Governed AI | Gateway, prompt registry, safety boundaries |

---

## 4. User goals

| User need | Product response |
|-----------|------------------|
| Understand situation quickly | Command Center zones + intelligence feed |
| Research deeply | Research sessions → cognitive analyze |
| Act on recommendations | Approve/status API; execution deferred M5 |
| Automate workflows | Automation CRUD; run is audit-only today |
| Govern org | Settings, administration, feature flags |
| Trust compliance | Legal docs, cookie consent, acceptance records |

---

## 5. Primary navigation (frozen)

Per [ADR-0005](../architecture/adr/0005-seven-item-primary-navigation.md):

1. Command Center (home)
2. Intelligence
3. Research
4. Automation
5. Strategy Center
6. Operations
7. Settings

Workspace is **context**, not nav ([ADR-0003](../architecture/adr/0003-workspace-as-context.md)).

---

## 6. Module status (as-built, post M4)

| Module | Status | Notes |
|--------|--------|-------|
| Auth & sessions | **Implemented** | Postgres + cookies |
| Onboarding | **In Progress** | Steps 4–5 cosmetic |
| Command Center | **Implemented** | Dashboard zones |
| Intelligence | **Implemented** | Cognitive via research analyze |
| Research | **Implemented** | Ingestion stub |
| Automation | **Partial** | CRUD yes; execution no |
| Operations | **Implemented** | Live queue/cache telemetry |
| Settings (18 screens) | **Implemented** | Billing/OAuth stub |
| Administration | **Implemented** | Admin nav + flags |
| Analytics | **Deferred** | Formula KPIs |
| Legal | **Partial** | API + banner; counsel review |
| Strategy / Knowledge / Marketplace | **Planned** | Placeholders |

---

## 7. Closed-beta journey

```
Landing → Signup → Verify → Login → Onboarding → Command Center
→ Research → Analyze → Intelligence → Automation → Settings
→ Administration → Logout → Reconnect
```

**Demo readiness: ~96%** · **Production readiness: ~78%**

Verified by: Vitest integration tests + `e2e/closed-beta-journey.spec.ts`

---

## 8. Platform goals

| Goal | Status |
|------|--------|
| Durable persistence | ✅ Postgres |
| Production email | ✅ Resend/SMTP |
| Redis cache/queue | ✅ With fallback |
| Docker deploy | ✅ compose.prod |
| E2E regression | ✅ Playwright CI |
| Execution boundary | ❌ M5 gated |
| Real AI providers | ❌ Stubs |
| Legal production copy | ❌ Counsel |

---

## 9. Technical architecture (summary)

Monorepo: Hono API + Vite/React web + Drizzle Postgres + optional Redis.

Cognitive path: `Research analyze` → `IntelligenceCognitiveProvider` → `CognitiveOrchestrator` → evidence/reasoning/decision → recommendation.

Detail: [conquest-complete-reference](./conquest-complete-reference.md) · [architecture-reference](./architecture-reference.md)

---

## 10. Roadmap

### Completed (Build-2)

M1 Integration · M2 Persistence · M3 Hardening · M4 Closed-beta · Recovery P2 Docs

### Next (Build-2 M5) — gated

- Automation execution engine
- Approve → execute workflow
- BAR gates B-25–B-28, VRF
- Lift `executionReady` only with governance

### Post-beta

- Knowledge, Strategy, Marketplace modules (PDD)
- Real AI provider SDKs
- Analytics visualization
- Privacy export/deletion jobs
- Cognitive web UI (Ask Conquest)
- HA / multi-region ([ADR-0022](../architecture/adr/0022-high-availability-model.md))

---

## 11. Governance & compliance

| Item | Status |
|------|--------|
| Build-0 BAR | Issued |
| Build-1 BAR | Issued (BAR-2026-06-26-001) |
| Build-2 BAR | **Clarification needed** — cognitive shipped under integration program |
| RTM | 78 requirements; verification pass ongoing |
| Threat model | v1.0 |
| Legal counsel review | **Pending** (B2-P0-05) |

---

## 12. Success metrics (product)

- User completes closed-beta journey without workarounds
- Recommendations cite evidence with confidence
- Zero cross-tenant data exposure (test plan v1.0)
- Legal acceptance durable in Postgres
- Ops surfaces honest degradation when dependencies fail

---

*Supersedes scattered product status in older build-2 reports. Update on milestone completion.*
