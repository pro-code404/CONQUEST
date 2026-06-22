# Conquest Layout System

## Four-layer spatial contract

All screens implement the same shell. Custom layouts inside Level 3 only.

---

## Level 1 — Command Layer

**Height:** 56px (compact) / 64px (standard). Fixed `position: sticky; top: 0; z-index: 100`.

### Grid (desktop)

```
| Logo 16px | Search Everything flex-1 max 480px | Command Bar flex-2 | Accounts | Workspace | Model | Notif | Profile |
```

### Element specifications

| Element | Min width | Interaction |
|---------|-----------|-------------|
| Search Everything | 200px | Fuzzy search all modules; `⌘K` focuses command bar instead if empty |
| AI Command Bar | 320px+ | Pipeline input; shows phase progress inline on submit |
| Connected Accounts | 32px icon cluster | Tooltip health per integration |
| Workspace Switcher | 120px | Dropdown with recents |
| Model Switcher | 140px | Intelligence Model selector |
| Notifications | 32px | Panel dropdown |
| User Profile | 32px avatar | Menu |

**No scroll.** Overflow elements collapse to overflow menu (`···`).

---

## Level 2 — Global Navigation Rail

**Width:** 56px collapsed / 220px expanded. `position: fixed; left: 0`.

### Module order (default)

1. Dashboard
2. Analytics
3. Content Intelligence
4. Commerce Intelligence
5. Social Intelligence
6. Automation
7. Research
8. Growth
9. Planning
10. AI Studio
11. Memory
12. Knowledge
13. — separator —
14. Settings
15. Integrations
16. Developer
17. Administration

### Rail item anatomy

```
[icon 20px] [label] [badge optional]
```

- Active: left border accent 2px + background elevation
- Hover: subtle background
- Badge: running agents (blue), failures (amber), alerts (red)

### Collapse behavior

- `⌘\` / `Ctrl+\` toggles
- State persisted in session
- Collapsed: icons only + tooltips

---

## Level 3 — Module Workspace

**Area:** `margin-left: rail-width; margin-right: dock-width` (when dock open).

### Workspace scaffold (all modules)

```
┌─────────────────────────────────────────────────────────┐
│ Module Header                                           │
│ [Title] [Period ▾] [Filters] [Primary Action]           │
├─────────────────────────────────────────────────────────┤
│ Executive Zone — Smart Summary Cards (grid)               │
├─────────────────────────────────────────────────────────┤
│ Intelligence Visualization (min-height 320px)           │
├─────────────────────────────────────────────────────────┤
│ Operational Zone (tables / queues / calendar / library) │
├─────────────────────────────────────────────────────────┤
│ Recommendations Strip (horizontal scroll)               │
└─────────────────────────────────────────────────────────┘
```

### Zone spacing

| Zone | Padding | Gap |
|------|---------|-----|
| Module header | 24px horizontal, 16px vertical | 16px |
| Executive | 24px | 16px card grid |
| Visualization | 24px | — |
| Operational | 24px | 12px |
| Recommendations | 24px | 12px |

### Module transition

When switching modules:

1. Outgoing workspace fades out (150ms)
2. Rail active state updates
3. Incoming workspace fades in (150ms)
4. Dock recommendations refresh for module context

When switching **Intelligence Model** (within or across modules):

1. Smart Summary Cards morph metrics (200ms)
2. Primary visualization crossfades
3. Command bar placeholder updates

---

## Level 4 — Intelligence Dock

**Width:** 360px default. `position: fixed; right: 0; top: command-height; bottom: 0`.

### Sections (top to bottom, scrollable)

1. **Live status bar** — agents running, automations active
2. **Recommendations** — max 3 visible, expand for more
3. **Alerts** — verification failures, integration issues
4. **Predictions** — next 7d forecast snippet
5. **Recent conversations** — last 5, session-scoped
6. **Scheduled tasks** — next 5
7. **Health** — system + integrations mini-status

### Dock states

| State | Width |
|-------|-------|
| Open | 360px |
| Collapsed | 48px (icon strip) |
| Mobile | Bottom sheet 40vh, swipe up for full |

**Never fully hidden** on desktop — collapsed strip remains.

---

## Breakpoint reflow

### Tablet (768–1279px)

- Rail: collapsed by default
- Dock: overlay drawer from right
- Executive cards: 2 columns

### Mobile (<768px)

- Command layer: logo + command bar + menu
- Rail → bottom tab bar (5 primary + More)
- Dock → bottom sheet
- Executive cards: 1 column
- Visualization: full width, reduced height 240px

---

## Z-index stack

| Layer | z-index |
|-------|---------|
| Command Layer | 100 |
| Rail | 90 |
| Dock | 80 |
| Module modals | 200 |
| Command palette | 300 |
| Toasts | 400 |
