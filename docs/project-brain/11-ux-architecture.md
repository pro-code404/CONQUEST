# 11 — UX Architecture

UX philosophy, navigation, GIS, Command Center vision, interaction model.

---

## 1. UX philosophy

| Principle | Implementation |
|-----------|----------------|
| Decision-first | Command Center home — not chat |
| Honest states | Empty zones when no intelligence — no fake data |
| Verification visible | Confidence, evidence, status on recommendations |
| Workspace context | URL `/app/w/:id/module` — nav stays seven items |
| GIS everywhere | Tokens from `@conquest/gis` — no magic numbers |
| Accessibility | Labeled forms, `aria-busy`, route status |

---

## 2. Interface hierarchy

```
AppShell (workspace layout)
├── Primary nav (7 items)
├── Utility bar (workspace label, user menu)
└── Content outlet (module screens)

SettingsLayout
├── Settings categories sidebar
└── Settings section views

PublicAuthLayout
└── Auth forms (signup, login, …)
```

---

## 3. Navigation model

**Frozen:** ADR-0005 — seven primary items.

**Route guards:** `RequireGuest`, `RequireAuth`, `RequireAppShell`, `RequireWorkspaceRoute`.

**Global chrome:** `RootLayout` — `CookieConsentBanner` **inside** RouterProvider (preview regression fix).

---

## 4. Command Center vision

### Today (M4)

- Integrated dashboard zones  
- Recommendations from intelligence API  
- Dormant → active transition when data exists  

### Future

- Live operational pulse  
- Structured "Ask Conquest" panel (RTM-UX-009)  
- Alert acknowledgment workflows  
- Multi-zone personalization per workspace goals  

### Wireframe (logical)

```
┌────────────────────────────────────────────────────────┐
│ [CC] [Intel] [Research] [Auto] [Strategy] [Ops] [Set]  │
├────────────────────────────────────────────────────────┤
│ Command Center — Workspace Alpha                        │
├──────────────────┬─────────────────────────────────────┤
│ Recommendations  │ Alerts / Status                      │
│ [card][card]     │ [item][item]                         │
├──────────────────┴─────────────────────────────────────┤
│ Quick actions / deep links to intelligence & research    │
└────────────────────────────────────────────────────────┘
```

---

## 5. Visual principles (GIS)

| Token category | Examples |
|----------------|----------|
| color | surface, textPrimary, accent |
| spacing | xs–xxl rem scale |
| typography | fontSizeSm–Xl |
| timing | fast/normal/slow transitions |

Dark-first: `--cq-color-surface: #0f1419` in `global.css`.

---

## 6. Responsive philosophy

Shell targets desktop-first command center; mobile degradation acceptable for beta. Full responsive spec in UXMD-III.

---

*Next: [12 — Governance](./12-governance-and-execution-boundaries.md)*
