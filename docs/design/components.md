# Component Standards

Reusable components for the Conquest Command Center. All must align with [`design-tokens.md`](design-tokens.md).

---

## SmartSummaryCard

**Purpose:** Replace static KPI tiles.

### Props

```typescript
interface SmartSummaryCardProps {
  label: string;
  value: number | string;
  change24h: { value: number; direction: "up" | "down" | "flat" };
  change7d: { value: number; direction: "up" | "down" | "flat" };
  change30d: { value: number; direction: "up" | "down" | "flat" };
  insight: string;
  confidence: number; // 0-1
  prediction?: { text: string; invalidation?: string };
  onDrillDown: () => void;
  sparkline?: number[];
}
```

### States

- Default, Hover (sparkline + insight preview), Expanded (full drill-down panel), Loading (skeleton), Low confidence (amber border)

---

## CommandBar

**Purpose:** Primary pipeline input.

- Inline phase progress (10 dots) during execution
- Shows confidence + verification on result
- Supports voice attach (Phase 5)
- Never a floating chat widget — embedded in Command Layer

---

## IntelligenceDock

Sections as collapsible panels. Real-time via SSE.

### DockRecommendation

```typescript
interface DockRecommendation {
  id: string;
  text: string;
  confidence: number;
  action?: { label: string; href: string };
  module: string;
}
```

---

## ReachTimeline

Layered line chart. Required hover payload:

```typescript
interface TimelineHoverData {
  platform: string;
  content?: string;
  product?: string;
  conversions: number;
  audience: string;
  revenue: number;
  timestamp: string;
  prediction?: number;
  recommendation?: string;
}
```

---

## DrillDownPanel

Slide-over or inline expand. Breadcrumb navigation.

```
Followers > Instagram > United States > 25-34 > ...
```

Back navigation preserves parent state.

---

## ModelSwitcher

Dropdown in Command Layer. Shows model icon, name, one-line description.

---

## ModuleRailItem

Icon + label + optional badge. Keyboard navigable.

---

## ConfidenceBadge

| Range | Variant |
|-------|---------|
| ≥0.85 | success |
| 0.5–0.84 | warning |
| <0.5 | danger |

Always show numeric % on hover.

---

## PipelinePhaseIndicator

10 segments. States: pending, active, complete, rerouted, failed.

Used in Command Bar and execution modals.

---

## DataTable

High-density. Not default admin table.

- Sticky header
- Row actions contextual
- Confidence column where applicable
- Export + "Automate from selection"

---

## EmptyState

Never generic "No data." Always actionable:

- "Connect Instagram to see Followers" + CTA
- "Run research on competitors" + command prefill

---

## Forbidden components

- `StatCard` with only label + value (use SmartSummaryCard)
- `SidebarNav` with nested pages (use ModuleRail)
- `ChatBubble` as primary UI (use CommandBar + Dock)
- `DashboardGrid` of 6 identical cards

---

## Telemetry

All interactive components emit:

```typescript
{ component, action, module, model, traceId, timestamp }
```

Feeds evolution engine — UI interaction patterns improve routing.
