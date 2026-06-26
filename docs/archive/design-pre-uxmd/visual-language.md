# Conquest Visual Language

## Design intent

Enterprise mission control — not startup dashboard, not consumer social app.

References (principles only, not copies): Linear density, Vercel precision, Stripe clarity, Notion calm, Arc spatial efficiency.

---

## Color system

### Dark mode (default)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0a0e14` | App background |
| `--bg-elevated` | `#121820` | Cards, panels |
| `--bg-sunken` | `#060910` | Inputs, code |
| `--border-subtle` | `#1e2a3a` | Card borders |
| `--border-strong` | `#2d3d52` | Focus, emphasis |
| `--text-primary` | `#e6edf3` | Headings, values |
| `--text-secondary` | `#8b949e` | Labels, meta |
| `--text-muted` | `#5c6670` | Placeholders |
| `--accent` | `#3b82f6` | Primary actions |
| `--accent-muted` | `#1e3a5f` | Accent backgrounds |
| `--success` | `#22c55e` | Positive trend |
| `--warning` | `#f59e0b` | Caution |
| `--danger` | `#ef4444` | Negative trend, errors |
| `--confidence-high` | `#22c55e` | ≥85% |
| `--confidence-mid` | `#f59e0b` | 50–84% |
| `--confidence-low` | `#ef4444` | <50% |

### Light mode

| Token | Value |
|-------|-------|
| `--bg-base` | `#f8fafc` |
| `--bg-elevated` | `#ffffff` |
| `--bg-sunken` | `#f1f5f9` |
| `--border-subtle` | `#e2e8f0` |
| `--text-primary` | `#0f172a` |
| `--text-secondary` | `#64748b` |

### Gradients (sparingly)

Only for: command bar focus ring, model switcher active state, prediction confidence bands.

```css
--gradient-accent: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
```

Never as full-page backgrounds.

---

## Typography

### Font stack

```css
--font-sans: "Inter", "Segoe UI", system-ui, sans-serif;
--font-mono: "JetBrains Mono", "Cascadia Code", monospace;
```

### Scale

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `--text-xs` | 11px | 500 | Badges, timestamps |
| `--text-sm` | 13px | 400 | Secondary labels |
| `--text-base` | 15px | 400 | Body |
| `--text-lg` | 18px | 500 | Section titles |
| `--text-xl` | 24px | 600 | Module titles |
| `--text-2xl` | 32px | 600 | Metric values |
| `--text-3xl` | 40px | 700 | Hero metrics |

### Rules

- Metric values: `font-variant-numeric: tabular-nums`
- Insights: `--text-sm`, `--text-secondary`, max 2 lines
- No more than 3 weights per screen (400, 500, 600)

---

## Spacing

4px base grid.

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |

---

## Elevation

| Level | Shadow | Use |
|-------|--------|-----|
| 0 | none | Flat panels |
| 1 | `0 1px 2px rgba(0,0,0,0.2)` | Cards |
| 2 | `0 4px 12px rgba(0,0,0,0.25)` | Dropdowns |
| 3 | `0 8px 24px rgba(0,0,0,0.3)` | Modals |
| Dock | `−4px 0 24px rgba(0,0,0,0.2)` | Intelligence Dock |

Dark mode: shadows use black. Light mode: `rgba(15,23,42,0.08)`.

---

## Border radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 6px | Buttons, inputs |
| `--radius-md` | 8px | Cards |
| `--radius-lg` | 12px | Panels, modals |
| `--radius-full` | 9999px | Avatars, pills |

---

## Motion

### Duration

| Token | Value | Use |
|-------|-------|-----|
| `--duration-fast` | 150ms | Hover, toggle |
| `--duration-normal` | 200ms | Module switch |
| `--duration-slow` | 250ms | Model switch, dock |

### Easing

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
```

### Allowed motion

- Phase progress in command bar
- Card expand/collapse
- Module crossfade
- Dock slide
- Trend direction indicators
- Loading skeletons for pipeline

### Forbidden motion

- Decorative parallax
- Bouncing icons
- Infinite gradients
- Confetti / celebration effects
- Auto-playing carousels

`prefers-reduced-motion: reduce` → instant transitions.

---

## Iconography

- 20px standard, 16px compact, 24px module rail
- Stroke icons (Lucide-compatible)
- Semantic color only for status (success/warning/danger)
- No illustrative icons in data zones

---

## Data visualization palette

| Series | Color |
|--------|-------|
| Content reach | `#3b82f6` |
| Product reach | `#8b5cf6` |
| Revenue | `#22c55e` |
| Engagement | `#f59e0b` |
| Prediction band | `accent @ 20% opacity` |
| Anomaly | `#ef4444` dashed |

All charts: grid lines `--border-subtle`, axis labels `--text-muted`.
