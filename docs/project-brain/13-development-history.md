# 13 — Development History

Chronological evolution from architecture freeze through Recovery Phase 3.

---

## Timeline

| Date | Event | Outcome |
|------|-------|---------|
| 2026-06-21 | Build-0 BAR | Architecture freeze, 38 ADRs, RTM |
| 2026-06-21 | FAA complete | Engineering authorized |
| 2026-06-26 | Build-1 BAR | Platform + shell implementation |
| 2026 | Build-1 delivery | apps/web, platform, cognitive, auth domain |
| 2026-06-27 | Build-2 strategy | Integration-first over feature count |
| M1 | Integration batch | Routes, CC, cognitive bridge — ~78% demo |
| M2 | Production persistence | Postgres, legal, notifications — ~85% |
| M3 | Production hardening | Docker, rate limit, ops — ~92% |
| M4 | Closed beta | Email, Redis jobs, e2e, KB — ~96% |
| Recovery P0 | Audit | ~74% knowledge coverage |
| Recovery P2 | Doc sync | 6 master KB docs, single truth |
| Preview regression | Router context bug | CookieConsentBanner fix + RCA |
| **Recovery P3** | **Project Brain** | **Engineering memory consolidation** |

---

## Why Build-1 became Build-2

Build-1 delivered platform code but **demo journeys failed**:

- Route guards blocked intelligence/research  
- In-memory-only persistence  
- Mock intelligence seeds  
- Missing production ops  

Build-2 explicitly prioritized **demonstrability** over new modules.

---

## Major architectural improvements

| Improvement | Milestone |
|-------------|-----------|
| DrizzleAuthRepository | M2 |
| Removed intelligence seed | M1 |
| Cognitive via research analyze | M1 |
| Redis job queue | M4 |
| Production email providers | M4 |
| RootLayout router fix | Preview RCA |
| Project Brain | Recovery P3 |

---

## Lessons learned

1. **Repository must hold intent** — facts without philosophy → "AI wrapper" misconception  
2. **CI memory fallback essential** — `MEMORY_REPO=true`  
3. **Honest empty states** — better than fake demos  
4. **Global UI inside router** — React Router context violations crash app  
5. **Recovery phases** — doc sync alone insufficient without engineering memory  

---

*Next: [14 — Future roadmap](./14-future-roadmap.md)*
