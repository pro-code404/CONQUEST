/** Conquest — charts matching reference UI */
const ChartEngine = (() => {
  function catmullRom(points, t = 0.3) {
    if (points.length < 2) return "";
    let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
      d += ` C ${(p1.x + (p2.x - p0.x) * t).toFixed(1)},${(p1.y + (p2.y - p0.y) * t).toFixed(1)} ${(p2.x - (p3.x - p1.x) * t).toFixed(1)},${(p2.y - (p3.y - p1.y) * t).toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  }

  function polyLinePath(points, ox = 0, oy = 0) {
    if (!points.length) return "";
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${(p.x + ox).toFixed(1)},${(p.y + oy).toFixed(1)}`).join(" ");
  }

  function toPts(data, w, h, padL, padT, padR, padB, maxVal) {
    const chartW = w - padL - padR;
    const chartH = h - padT - padB;
    const m = maxVal || 30;
    const step = chartW / (data.length - 1);
    return data.map((v, i) => ({
      x: padL + i * step,
      y: padT + chartH - (v / m) * chartH,
      v, i,
    }));
  }

  function formatY(v) {
    return v === 0 ? "0" : `${v}M`;
  }

  function flowPath(points, tension = 0.18) {
    return catmullRom(points, tension);
  }

  function renderPerformance(svg, content, product, opts = {}) {
    const w = opts.width || 1100;
    const h = opts.height || 320;
    const padL = 38, padR = 4, padT = 28, padB = 22;
    const maxM = 30;
    const days = opts.days || [];
    const events = opts.events || [];
    const peaks = opts.peaks || [];
    const chartW = w - padL - padR;
    const chartH = h - padT - padB;
    const axisY = padT + chartH;

    const contentM = content.map((v) => Math.max(0, Math.min(30, v)));
    const productM = product.map((v) => Math.max(0, Math.min(30, v)));

    const cPts = toPts(contentM, w, h, padL, padT, padR, padB, maxM);
    const pPts = toPts(productM, w, h, padL, padT, padR, padB, maxM);
    const cLine = flowPath(cPts);
    const pLine = flowPath(pPts);
    const cEcho = flowPath(cPts.map((p) => ({ ...p, y: p.y + 3, x: p.x + 2 })));
    const pEcho = flowPath(pPts.map((p) => ({ ...p, y: p.y + 3, x: p.x + 2 })));
    const cArea = `${cLine} L ${cPts[cPts.length - 1].x},${axisY} L ${cPts[0].x},${axisY} Z`;
    const pArea = `${pLine} L ${pPts[pPts.length - 1].x},${axisY} L ${pPts[0].x},${axisY} Z`;

    let html = `<defs>
      <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2F6FFF" stop-opacity="0.4"/><stop offset="100%" stop-color="#2F6FFF" stop-opacity="0"/></linearGradient>
      <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#16C784" stop-opacity="0.35"/><stop offset="100%" stop-color="#16C784" stop-opacity="0"/></linearGradient>
      <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;

    for (let m = 0; m <= maxM; m += 5) {
      const y = padT + chartH - (m / maxM) * chartH;
      html += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
      html += `<text x="${padL - 6}" y="${y + 3}" text-anchor="end" fill="#8B95A8" font-size="9" font-family="Inter,system-ui,sans-serif">${formatY(m)}</text>`;
    }

    events.forEach((ev) => {
      const pts = ev.series === "product" ? pPts : cPts;
      const pt = pts[ev.idx];
      if (!pt) return;
      const color = ev.type === "down" ? "rgba(239,68,68,0.35)" : "rgba(22,199,132,0.35)";
      html += `<line x1="${pt.x.toFixed(1)}" y1="${padT}" x2="${pt.x.toFixed(1)}" y2="${axisY}" stroke="${color}" stroke-width="1" stroke-dasharray="4 4"/>`;
    });

    html += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${axisY}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
    html += `<line x1="${padL}" y1="${axisY}" x2="${w - padR}" y2="${axisY}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;

    if (days.length) {
      days.forEach((label, i) => {
        const x = padL + (i / (days.length - 1)) * chartW;
        html += `<text x="${x}" y="${axisY + 14}" text-anchor="middle" fill="#8B95A8" font-size="8" font-family="Inter,system-ui,sans-serif">${label}</text>`;
      });
    }

    html += `<path d="${cArea}" fill="url(#cg)"/>`;
    html += `<path d="${pArea}" fill="url(#pg)"/>`;
    html += `<path d="${cEcho}" fill="none" stroke="#2F6FFF" stroke-width="1" stroke-opacity="0.18" stroke-linejoin="round" stroke-linecap="round"/>`;
    html += `<path d="${pEcho}" fill="none" stroke="#16C784" stroke-width="1" stroke-opacity="0.18" stroke-linejoin="round" stroke-linecap="round"/>`;
    html += `<path d="${cLine}" fill="none" stroke="#2F6FFF" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round" filter="url(#lineGlow)"/>`;
    html += `<path d="${pLine}" fill="none" stroke="#16C784" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round" filter="url(#lineGlow)"/>`;

    peaks.forEach((peak, pi) => {
      const pts = peak.series === "product" ? pPts : cPts;
      const pt = pts[peak.idx];
      if (!pt) return;
      const color = peak.series === "product" ? "#16C784" : "#2F6FFF";
      html += `<circle class="chart-peak-dot" data-peak="${pi}" cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.5" fill="${color}" stroke="#0A0E14" stroke-width="1.5" style="cursor:pointer;filter:drop-shadow(0 0 5px ${color})"/>`;
      html += `<circle class="chart-peak-hit" data-peak="${pi}" cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="10" fill="transparent" style="cursor:pointer"/>`;
    });

    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.innerHTML = html;
    return { points: [cPts, pPts], w, h, pad: padL, padT, padB, maxM, contentM, productM, peaks };
  }

  function renderDonut(svg, segments, opts = {}) {
    const size = opts.size || 160;
    const cx = size / 2, cy = size / 2, r = size * 0.38, ir = size * 0.26;
    let angle = -Math.PI / 2;
    let html = "";
    segments.forEach((s) => {
      const sweep = (s.pct / 100) * Math.PI * 2;
      const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
      const x2 = cx + r * Math.cos(angle + sweep), y2 = cy + r * Math.sin(angle + sweep);
      const xi1 = cx + ir * Math.cos(angle + sweep), yi1 = cy + ir * Math.sin(angle + sweep);
      const xi2 = cx + ir * Math.cos(angle), yi2 = cy + ir * Math.sin(angle);
      const large = sweep > Math.PI ? 1 : 0;
      html += `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${ir} ${ir} 0 ${large} 0 ${xi2} ${yi2} Z" fill="${s.color}"/>`;
      angle += sweep;
    });
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.innerHTML = html;
  }

  function renderSpark(svg, data, color) {
    const w = 100, h = 32, pad = 2;
    const pts = toPts(data, w, h, pad, pad, pad, pad, Math.max(...data) * 1.05);
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.innerHTML = `<path d="${catmullRom(pts)}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
  }

  function attachHover(wrap, tooltip, crosshair, meta, onHover) {
    const { points, w, h } = meta;
    wrap.onmousemove = (e) => {
      if (wrap.dataset.peakHover === "1") return;
      const rect = wrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * w;
      let best = 0, dist = Infinity;
      points[0].forEach((p, i) => { const d = Math.abs(p.x - x); if (d < dist) { dist = d; best = i; } });
      tooltip.classList.add("visible");
      tooltip.classList.remove("chart-tooltip--peak");
      tooltip.style.left = Math.min(e.clientX - rect.left + 10, rect.width - 180) + "px";
      tooltip.style.top = Math.max(e.clientY - rect.top - 70, 4) + "px";
      if (crosshair) {
        const pt = points[0][best];
        if (!crosshair.querySelector(".crosshair-v")) crosshair.innerHTML = '<div class="crosshair-v"></div><div class="crosshair-dot"></div>';
        crosshair.querySelector(".crosshair-v").style.left = `${(pt.x / w) * 100}%`;
        const dot = crosshair.querySelector(".crosshair-dot");
        dot.style.left = `${(pt.x / w) * 100}%`;
        dot.style.top = `${(pt.y / h) * 100}%`;
        crosshair.style.opacity = "1";
      }
      onHover?.(best, tooltip);
    };
    wrap.onmouseleave = () => {
      if (wrap.dataset.peakHover === "1") return;
      tooltip.classList.remove("visible");
      if (crosshair) crosshair.style.opacity = "0";
    };
  }

  function attachPeakHover(svg, wrap, tooltip, crosshair, meta) {
    const { peaks, contentM, productM } = meta;
    const showPeak = (pi, clientX, clientY) => {
      const peak = peaks[pi];
      if (!peak) return;
      wrap.dataset.peakHover = "1";
      const seriesLabel = peak.series === "product" ? "Product Reach" : "Content Reach";
      const val = peak.series === "product" ? productM[peak.idx] : contentM[peak.idx];
      tooltip.classList.add("visible", "chart-tooltip--peak");
      const sub = peak.subtitle ? `<br/>${peak.subtitle}` : "";
      const valLine = peak.value ? `<br/><span class="chart-tooltip__value">${peak.value}</span>` : `<br/><span class="chart-tooltip__value">${val?.toFixed(1) ?? "—"}M</span>`;
      tooltip.innerHTML = `<strong>${peak.label}</strong><br/><span class="chart-tooltip__series">${seriesLabel}</span><br/>${peak.title}${sub}${valLine}`;
      const rect = wrap.getBoundingClientRect();
      tooltip.style.left = Math.min(clientX - rect.left + 12, rect.width - 200) + "px";
      tooltip.style.top = Math.max(clientY - rect.top - 80, 4) + "px";
      if (crosshair) crosshair.style.opacity = "0";
      svg.querySelectorAll(".chart-peak-dot").forEach((el) => {
        el.setAttribute("r", el.dataset.peak === String(pi) ? "5" : "3.5");
      });
    };
    const hidePeak = () => {
      wrap.dataset.peakHover = "0";
      tooltip.classList.remove("visible", "chart-tooltip--peak");
      svg.querySelectorAll(".chart-peak-dot").forEach((el) => el.setAttribute("r", "3.5"));
    };
    svg.querySelectorAll(".chart-peak-hit, .chart-peak-dot").forEach((el) => {
      const pi = Number(el.dataset.peak);
      if (!peaks[pi]) return;
      el.addEventListener("mouseenter", (e) => showPeak(pi, e.clientX, e.clientY));
      el.addEventListener("mousemove", (e) => showPeak(pi, e.clientX, e.clientY));
      el.addEventListener("mouseleave", hidePeak);
    });
  }

  function generateSpark(seed, n = 20) {
    const out = []; let v = 40 + seed;
    for (let i = 0; i < n; i++) { v += Math.sin(i + seed) * 2 + 0.5; out.push(v); }
    return out;
  }

  return { renderPerformance, renderDonut, renderSpark, attachHover, attachPeakHover, generateSpark, toPts };
})();

if (typeof window !== "undefined") window.ChartEngine = ChartEngine;
