import { describe, it, expect } from "vitest";
import { resolveChartSize, kpiSparklineConfig, chartA11yProps } from "./index.js";

describe("visualization-config (Phase 9E)", () => {
  it("resolves responsive chart dimensions", () => {
    const size = resolveChartSize(800);
    expect(size.width).toBe(800);
    expect(size.height).toBeGreaterThan(0);
  });

  it("builds sparkline config without DOM APIs", () => {
    const config = kpiSparklineConfig("Revenue", [1, 2, 3]);
    expect(config.kind).toBe("sparkline");
    expect(config.series[0]?.data.length).toBe(3);
  });

  it("provides chart accessibility props", () => {
    const a11y = chartA11yProps("KPI trend", "Revenue over 30 days");
    expect(a11y.title).toBe("KPI trend");
    expect(a11y.role).toBe("img");
  });
});
