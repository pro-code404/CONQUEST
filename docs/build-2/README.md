# Build-2 — Integration-First Program

**Authorization:** Build-2 Integration-First Strategy (2026-06-27)  
**Baseline:** B2-M4 Closed Beta complete · 278 tests · Playwright e2e in CI  
**Recovery:** Phase 4 complete (judgment + continuity test) — see [Project Brain](../project-brain/README.md)

Build-2 prioritizes **production readiness** over feature count. Every task must move Conquest closer to a demonstrable, production-ready platform.

---

## Deliverables

| # | Document | Status |
|---|----------|--------|
| 1 | [Integration Matrix](./integration-matrix.md) | **Authoritative** — post M4 + Recovery Phase 2 |
| 2 | [Launch Readiness Report](./launch-readiness-report.md) | **Authoritative** — ~96% closed-beta |
| 3 | [Production Blocker List](./production-blockers.md) | **Authoritative** — post M4 |
| 4 | [Implementation Roadmap](./implementation-roadmap.md) | Complete — M5 gated |
| 5 | [Simulation Inventory](./simulation-inventory.md) | **Authoritative** — post M4 |
| 6 | [Recovery Phase 2 Report](./recovery-phase-2-report.md) | **Complete** — knowledge sync |
| 7 | [M4 Closed Beta Completion Report](./m4-closed-beta-completion-report.md) | Complete |
| 8 | [Database Health Report](./database-health-report.md) | Updated M4 |
| 9 | [M1–M3 milestone reports](./m1-integration-batch-report.md) | Historical snapshots |

---

## Milestone Status

| Milestone | Status | Demo readiness |
|-----------|--------|----------------|
| B2-M1 Integration Batch | ✅ Complete | ~78% |
| B2-M2 Production Persistence | ✅ Complete | ~85% |
| B2-M3 Production Hardening | ✅ Complete | ~92% |
| B2-M4 Closed Beta | ✅ Complete | ~96% |
| B2-M5 Execution Boundary | 📋 Gated — not started | — |

---

## B2-M4 Highlights

- Resend + SMTP email providers with audit trail
- Redis job queue with DLQ, retry, in-memory CI fallback
- Playwright closed-beta journey e2e in CI
- `/api/ops/degradation` dependency probes
- Six master knowledge-base documents (Recovery Phase 2)

**To enable full persistence:** `DATABASE_URL=postgresql://conquest:conquest@localhost:5432/conquest`  
**Optional:** `REDIS_URL=redis://localhost:6379`

---

## Immediate Next Step

**B2-M5 Execution Boundary** — gated. Requires formal Build-2 BAR closure on governance rows B-25–B-28 and stakeholder authorization. Recovery Phase 4 (documentation) is complete.

**AI agent entry:** [`docs/knowledge-base/ai-agent-onboarding.md`](../knowledge-base/ai-agent-onboarding.md)

---

*Last updated: Recovery Phase 4 (2026-06-21).*
