const PHASES = [
  "Perception", "Human Understanding", "Context Reconstruction", "Goal Reasoning",
  "Strategy Planning", "Intelligence Orchestration", "Verification", "Execution",
  "Reflection", "Memory Evolution",
];

let token = null;
let data = null;

function init() {
  data = ConquestData.build();
  initPhaseStrip();
  initNav();
  renderKpis();
  requestAnimationFrame(() => {
    renderPerformanceChart();
    window.addEventListener("load", renderPerformanceChart, { once: true });
  });
  renderPlatforms();
  renderAiInsights();
  renderDonut();
  renderIntel();
  renderUptimeSpark();
  initLucide();
  bindEvents();
  setInterval(updateStatusMeta, 3000);
}

function initLucide() {
  if (window.lucide) lucide.createIcons();
}

function initPhaseStrip() {
  const strip = document.getElementById("phaseStrip");
  PHASES.forEach(() => {
    const d = document.createElement("div");
    d.className = "phase-dot";
    strip.appendChild(d);
  });
}

function initNav() {
  const rail = document.getElementById("navRail");
  ConquestData.NAV.forEach((item, i) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "nav-item" + (i === 0 ? " active" : "");
    el.innerHTML = `<i data-lucide="${item.icon}" class="icon"></i><span>${item.label}</span>`;
    el.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
      el.classList.add("active");
    });
    rail.appendChild(el);
  });
  initLucide();
}

function renderKpis() {
  document.getElementById("kpiRow").innerHTML = data.kpis.map((k) => `
    <article class="kpi-card">
      <div class="kpi-card__label">${k.label}</div>
      <div class="kpi-card__body">
        <div class="kpi-card__metrics">
          <div class="kpi-card__value">${k.display}</div>
          <div class="kpi-card__change">${k.change}</div>
        </div>
        <svg class="kpi-card__spark" id="kpi-spark-${k.id}"></svg>
      </div>
    </article>
  `).join("");
  data.kpis.forEach((k) => {
    ChartEngine.renderSpark(
      document.getElementById(`kpi-spark-${k.id}`),
      ChartEngine.generateAnalysisSpark(k.seed, 9),
      k.color,
      ChartEngine.analysisSparkOpts,
    );
  });
}

function renderPerformanceChart() {
  const wrap = document.getElementById("vizCanvas");
  const rect = wrap.getBoundingClientRect();
  const w = Math.max(Math.round(rect.width), 400);
  const h = Math.max(Math.round(rect.height), 340);
  const meta = ChartEngine.renderPerformance(
    document.getElementById("reachChart"),
    data.chartSeries.content,
    data.chartSeries.product,
    {
      width: w,
      height: h,
      days: data.chartDays,
      events: data.chartEvents,
      peaks: data.chartPeaks,
    },
  );

  const annEl = document.getElementById("chartAnnotations");
  annEl.innerHTML = data.chartEvents.map((ev) => {
    const seriesIdx = ev.series === "product" ? 1 : 0;
    const pt = meta.points[seriesIdx][ev.idx];
    if (!pt) return "";
    const left = (pt.x / meta.w) * 100;
    const valueHtml = ev.value
      ? `<div class="chart-annotation-ref__value chart-annotation-ref__value--${ev.type}">${ev.value}</div>`
      : "";
    const subHtml = ev.subtitle
      ? `<div class="chart-annotation-ref__sub chart-annotation-ref__sub--${ev.type}">${ev.subtitle}</div>`
      : "";
    return `<div class="chart-annotation-ref chart-annotation-ref--${ev.type}" style="left:${left}%">
      <div class="chart-annotation-ref__box">
        <div class="chart-annotation-ref__date">${ev.label}</div>
        <div class="chart-annotation-ref__title">${ev.title}</div>
        ${subHtml}
        ${valueHtml}
      </div>
    </div>`;
  }).join("");

  ChartEngine.attachPeakHover(
    document.getElementById("reachChart"),
    wrap,
    document.getElementById("vizTooltip"),
    document.getElementById("vizCrosshair"),
    meta,
  );

  ChartEngine.attachHover(
    wrap,
    document.getElementById("vizTooltip"),
    document.getElementById("vizCrosshair"),
    meta,
    (idx, tip) => {
      const day = data.chartDays[Math.round((idx / (data.chartSeries.content.length - 1)) * (data.chartDays.length - 1))] ?? `Point ${idx + 1}`;
      const mC = meta.contentM[idx]?.toFixed(1) ?? "—";
      const mP = meta.productM[idx]?.toFixed(1) ?? "—";
      tip.innerHTML = `<strong>${day}</strong><br/>Content: ${mC}M<br/>Product: ${mP}M`;
    },
  );
}

function renderPlatforms() {
  const meta = data.platformsMeta;
  document.getElementById("platformsPeriod").textContent = meta.period;
  document.getElementById("platformsSummary").innerHTML = `
    <div class="platforms-summary__item">
      <span class="platforms-summary__val">${meta.totalReach}</span>
      <span class="platforms-summary__lbl">Combined Reach</span>
    </div>
    <div class="platforms-summary__item">
      <span class="platforms-summary__val">${meta.avgEngagement}</span>
      <span class="platforms-summary__lbl">Avg Engagement</span>
    </div>
    <div class="platforms-summary__item">
      <span class="platforms-summary__val">${meta.topPlatform}</span>
      <span class="platforms-summary__lbl">Top Platform</span>
    </div>
  `;
  document.getElementById("platformsInsight").innerHTML = `
    <i data-lucide="bar-chart-2" class="icon icon--sm platforms-insight__icon"></i>
    <span>${meta.insight}</span>
  `;

  document.getElementById("platformsList").innerHTML = data.platforms.map((p, i) => `
    <article class="platform-cell">
      <header class="platform-cell__head">
        <div class="platform-cell__icon" style="color:${p.color}"><i data-lucide="${p.icon}" class="icon icon--sm"></i></div>
        <span class="platform-cell__name">${p.name}</span>
        <span class="platform-cell__rank">#${p.rank}</span>
      </header>
      <div class="platform-cell__metrics">
        <span class="platform-cell__reach">${p.reach}</span>
        <span class="platform-cell__change">${p.change}</span>
      </div>
      <div class="platform-cell__share">
        <div class="platform-cell__share-top">
          <span class="platform-cell__share-lbl">Reach share</span>
          <span class="platform-cell__share-pct">${p.share}%</span>
        </div>
        <div class="platform-cell__share-track">
          <div class="platform-cell__share-fill" style="width:${p.share}%;background:${p.color}"></div>
        </div>
      </div>
      <div class="platform-cell__stats">
        <div class="platform-stat">
          <span class="platform-stat__lbl">Engagement</span>
          <span class="platform-stat__val">${p.engagement}</span>
        </div>
        <div class="platform-stat">
          <span class="platform-stat__lbl">Content</span>
          <span class="platform-stat__val">${p.content}</span>
        </div>
        <div class="platform-stat">
          <span class="platform-stat__lbl">Clicks</span>
          <span class="platform-stat__val">${p.clicks}</span>
        </div>
        <div class="platform-stat">
          <span class="platform-stat__lbl">Conv. rate</span>
          <span class="platform-stat__val">${p.conv}</span>
        </div>
      </div>
      <div class="platform-cell__trend">
        <span class="platform-cell__trend-lbl">7-day trend</span>
        <svg class="platform-cell__spark" id="platformSpark${i}"></svg>
      </div>
      <p class="platform-cell__insight">${p.insight}</p>
    </article>
  `).join("");

  data.platforms.forEach((p, i) => {
    const el = document.getElementById(`platformSpark${i}`);
    if (el) {
      ChartEngine.renderSpark(
        el,
        ChartEngine.generateAnalysisSpark(p.seed, 9),
        p.color,
        { ...ChartEngine.analysisSparkOpts, width: 72, height: 22 },
      );
    }
  });
  initLucide();
}

function renderAiInsights() {
  document.getElementById("aiInsightsList").innerHTML = data.aiInsights.map((ins) => `
    <div class="ai-insight">
      <div class="ai-insight__text">${ins.text}</div>
      <span class="ai-insight__tag ai-insight__tag--${ins.level}">${ins.impact} · Confidence ${ins.conf}%</span>
    </div>
  `).join("");
}

function renderDonut() {
  const meta = data.revenueMeta;
  ChartEngine.renderDonut(document.getElementById("donutChart"), data.revenueBreakdown, { size: 120 });
  document.getElementById("donutCenter").textContent = data.revenueTotal;
  document.getElementById("revenuePeriod").textContent = meta.period;
  document.getElementById("revenueChange").textContent = `${meta.change} MoM`;

  document.getElementById("revenueKpis").innerHTML = `
    <div class="revenue-kpi">
      <span class="revenue-kpi__val">${meta.recurringShare}</span>
      <span class="revenue-kpi__lbl">${meta.recurringLabel}</span>
    </div>
    <div class="revenue-kpi">
      <span class="revenue-kpi__val">${meta.arpu}</span>
      <span class="revenue-kpi__lbl">${meta.arpuLabel}</span>
    </div>
    <div class="revenue-kpi">
      <span class="revenue-kpi__val">${meta.margin}</span>
      <span class="revenue-kpi__lbl">${meta.marginLabel}</span>
    </div>
  `;

  document.getElementById("revenueStack").innerHTML = data.revenueBreakdown.map((s) =>
    `<span class="revenue-stack__seg" style="width:${s.pct}%;background:${s.color}" title="${s.label} ${s.pct}%"></span>`
  ).join("");

  document.getElementById("donutLegend").innerHTML = data.revenueBreakdown.map((s) => `
    <div class="revenue-row">
      <div class="revenue-row__head">
        <span class="revenue-row__dot" style="background:${s.color}"></span>
        <span class="revenue-row__name">${s.label}</span>
        <span class="revenue-row__amount">${s.amount}</span>
      </div>
      <div class="revenue-row__bar-wrap">
        <div class="revenue-row__bar" style="width:${s.pct}%;background:${s.color}"></div>
      </div>
      <div class="revenue-row__foot">
        <span class="revenue-row__pct">${s.pct}% of total</span>
        <span class="revenue-row__change revenue-row__change--${s.trend}">${s.change}</span>
      </div>
    </div>
  `).join("");

  document.getElementById("revenueInsight").innerHTML = `
    <i data-lucide="trending-up" class="icon icon--sm revenue-insight__icon"></i>
    <span>${meta.insight}</span>
  `;
  initLucide();
}

function renderIntel() {
  document.getElementById("dockRecommendations").innerHTML = data.recommendations.map((r) => `
    <div class="rec-item">
      <span class="rec-item__arrow">↗</span>
      <div>
        <span class="rec-item__text">${r.text}</span>
        <span class="rec-item__gain">Potential ${r.gain}</span>
      </div>
    </div>
  `).join("");

  document.getElementById("dockPredictions").innerHTML = data.predictions.map((p, i) => `
    <div class="pred-item">
      <span class="pred-item__label">${p.label}</span>
      <svg class="pred-item__spark" id="pred-spark-${i}"></svg>
      <span class="pred-item__value">${p.value}</span>
    </div>
  `).join("");
  data.predictions.forEach((p, i) => {
    ChartEngine.renderSpark(
      document.getElementById(`pred-spark-${i}`),
      ChartEngine.generateAnalysisSpark(p.seed, 9),
      "#16C784",
      { ...ChartEngine.analysisSparkOpts, width: 56, height: 20 },
    );
  });

  document.getElementById("dockActivity").innerHTML = data.activity.map((a) => `
    <div class="activity-item${a.type === "alert" ? " activity-item--alert" : ""}">
      <span class="activity-item__dot"></span>
      <span class="activity-item__text">${a.text}</span>
      <span class="activity-item__time">${a.time}</span>
    </div>
  `).join("");
}

function renderUptimeSpark() {
  ChartEngine.renderSpark(
    document.getElementById("uptimeSpark"),
    ChartEngine.generateAnalysisSpark(99, 8),
    "#16C784",
    { ...ChartEngine.analysisSparkOpts, width: 48, height: 20 },
  );
}

function updateStatusMeta() {
  const el = document.getElementById("statusMeta");
  if (el) el.textContent = "Last checked: 2s ago";
}

function logPipeline(msg, isPhase = false) {
  const log = document.getElementById("pipelineLog");
  const div = document.createElement("div");
  if (isPhase) div.innerHTML = `<span class="phase-name">${msg}</span>`;
  else div.textContent = msg;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function animatePhases(onComplete) {
  const dots = document.querySelectorAll(".phase-dot");
  dots.forEach((d) => { d.className = "phase-dot"; });
  let i = 0;
  function step() {
    if (i >= PHASES.length) { onComplete?.(); return; }
    dots[i].classList.add("active");
    logPipeline(`Phase ${i + 1}: ${PHASES[i]}`, true);
    setTimeout(() => {
      dots[i].classList.remove("active");
      dots[i].classList.add("done");
      i++;
      setTimeout(step, 55);
    }, 150);
  }
  step();
}

async function getToken() {
  if (token) return token;
  const r = await fetch("/v1/auth/token", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  token = (await r.json()).token;
  return token;
}

async function runPipeline() {
  const input = document.getElementById("commandInput");
  const text = input.value.trim();
  if (!text) return;

  document.getElementById("pipelineLog").innerHTML = "";
  logPipeline(`Query: "${text.slice(0, 60)}…"`);

  animatePhases(async () => {
    try {
      const t = await getToken();
      const r = await fetch("/v1/conquest", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
        body: JSON.stringify({ text, model: "social" }),
      });
      const j = await r.json();
      if (j.error) throw new Error(j.error);

      const answer = typeof j.response === "object" ? (j.response.answer ?? JSON.stringify(j.response)) : String(j.response);
      document.getElementById("pipelineOutput").classList.remove("card--hidden");
      document.getElementById("responseBody").textContent = answer;
      document.getElementById("responseMeta").innerHTML = `
        <span class="meta-chip">Confidence <strong>${(j.confidence * 100).toFixed(0)}%</strong></span>
        <span class="meta-chip">Verified <strong>${j.verification ? "Yes" : "No"}</strong></span>
      `;
      logPipeline(`Complete · ${j.metrics?.latencyMs ?? 0}ms`);

      const feed = document.getElementById("dockActivity");
      const item = document.createElement("div");
      item.className = "activity-item";
      item.innerHTML = `<span class="activity-item__dot"></span><span class="activity-item__text">Pipeline: ${j.pipeline?.goal ?? "complete"}</span><span class="activity-item__time">now</span>`;
      feed.prepend(item);
    } catch (e) {
      logPipeline("Failed: " + e.message);
    }
  });
}

function bindEvents() {
  const input = document.getElementById("commandInput");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); runPipeline(); }
    if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); input.focus(); }
  });
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      input.focus();
    }
  });
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderPerformanceChart, 120);
  });
}

init();
