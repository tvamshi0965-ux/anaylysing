/* ═══════════════════════════════════════════════════
   EDU TECH – Dashboard JavaScript  (Enhanced v2)
   URL-based analysis · Real APIs · Solutions DB
   Daily Analyser · Performance insights
   ═══════════════════════════════════════════════════ */
"use strict";

/* ─────────────────────────────────────────────────
   CHART DEFAULTS
───────────────────────────────────────────────── */
Chart.defaults.color = "#8b949e";
Chart.defaults.borderColor = "#30363d";
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
const chartInstances = {};
function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ─────────────────────────────────────────────────
   URL PARSER  – extracts username from any profile URL
───────────────────────────────────────────────── */
function parseProfileUrl(raw) {
  raw = (raw || "").trim();
  const patterns = [
    { rx: /leetcode\.com\/u\/([^\/\?#\s]+)/i, platform: "leetcode" },
    { rx: /leetcode\.com\/([^\/\?#\s]+)\/?$/i, platform: "leetcode" },
    { rx: /github\.com\/([^\/\?#\s]+)\/?$/i, platform: "github" },
    { rx: /geeksforgeeks\.org\/user\/([^\/\?#\s]+)/i, platform: "gfg" },
  ];
  for (const p of patterns) {
    const m = raw.match(p.rx);
    if (m && m[1] && m[1] !== "login" && m[1] !== "signup") {
      return { username: m[1], platform: p.platform };
    }
  }
  // treat as raw username if no URL matched
  if (raw && !/\s/.test(raw)) return { username: raw, platform: "unknown" };
  return null;
}

/* ─────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────── */
function setText(id, val) {
  const e = document.getElementById(id);
  if (e) e.textContent = val;
}
function setAttr(id, attr, val) {
  const e = document.getElementById(id);
  if (e) e.setAttribute(attr, val);
}
function setBarWidth(id, pct) {
  const e = document.getElementById(id);
  if (e) e.style.width = Math.min(pct, 100) + "%";
}
function show(id) {
  const e = document.getElementById(id);
  if (e) e.style.display = "";
}
function hide(id) {
  const e = document.getElementById(id);
  if (e) e.style.display = "none";
}

function animateCounter(id, target, decimals = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  const dur = 800,
    t0 = performance.now();
  const tick = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const v = target * (1 - Math.pow(1 - p, 3));
    el.textContent =
      decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function showLoading(btn, txt = "Analysing…") {
  if (!btn) return;
  btn.disabled = true;
  btn.dataset.origHtml = btn.innerHTML;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${txt}`;
}
function hideLoading(btn) {
  if (!btn) return;
  btn.disabled = false;
  btn.innerHTML = btn.dataset.origHtml || "Analyse";
}

let toastQueue = 0;
function showToast(msg, type = "info") {
  let c = document.getElementById("toast-container");
  if (!c) {
    c = document.createElement("div");
    c.id = "toast-container";
    c.style.cssText =
      "position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;max-width:320px";
    document.body.appendChild(c);
  }
  const colors = {
    info: "#6e5ce7",
    success: "#2ea44f",
    error: "#e25555",
    warn: "#f89f1b",
  };
  const t = document.createElement("div");
  t.style.cssText = `background:#1c2333;border:1px solid #30363d;border-left:3px solid ${colors[type] || colors.info};color:#e6edf3;padding:12px 18px;border-radius:12px;font-size:.87rem;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.5);animation:slideUp .3s ease`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "opacity .3s";
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

/* ─────────────────────────────────────────────────
   DATE
───────────────────────────────────────────────── */
function setDate() {
  const el = document.getElementById("currentDate");
  if (el)
    el.textContent = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
}

/* ─────────────────────────────────────────────────
   TAB SWITCHING
───────────────────────────────────────────────── */
const TAB_TITLES = {
  overview: "Overview",
  leetcode: "LeetCode Analyser",
  github: "GitHub Analyser",
  geeksforgeeks: "GeeksForGeeks Analyser",
  userday: "User of the Day",
  analyzer: "Daily User Analyser",
  solutions: "Problem Solutions",
  analytics: "Activity Charts",
};

function switchTab(name) {
  document
    .querySelectorAll(".tab-content")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".sidebar-link")
    .forEach((l) => l.classList.remove("active"));
  const tab = document.getElementById("tab-" + name);
  if (tab) tab.classList.add("active");
  const link = document.querySelector(`.sidebar-link[data-tab="${name}"]`);
  if (link) link.classList.add("active");
  setText("pageTitle", TAB_TITLES[name] || "Dashboard");
  setTimeout(() => renderTabCharts(name), 60);
  if (window.innerWidth < 900)
    document.getElementById("sidebar")?.classList.remove("open");
}

function renderTabCharts(name) {
  if (name === "overview") renderOverviewCharts();
  if (name === "analytics") renderAnalyticsCharts();
  if (name === "solutions") renderSolutionsLibrary();
}

/* ─────────────────────────────────────────────────
   OVERVIEW CHARTS
───────────────────────────────────────────────── */
function renderOverviewCharts() {
  destroyChart("weeklyChart");
  const wc = document.getElementById("weeklyChart");
  if (wc) {
    chartInstances["weeklyChart"] = new Chart(wc, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "LeetCode",
            data: [5, 8, 3, 12, 7, 15, 9],
            backgroundColor: "rgba(248,159,27,.8)",
            borderRadius: 6,
          },
          {
            label: "GitHub",
            data: [3, 5, 8, 4, 6, 10, 7],
            backgroundColor: "rgba(110,92,231,.8)",
            borderRadius: 6,
          },
          {
            label: "GFG",
            data: [2, 4, 1, 6, 3, 8, 5],
            backgroundColor: "rgba(47,141,70,.8)",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "rgba(48,54,61,.5)" } },
          y: { grid: { color: "rgba(48,54,61,.5)" }, beginAtZero: true },
        },
      },
    });
  }
  // Donut – will be updated when user analyses LC
  destroyChart("donutChart");
  const dc = document.getElementById("donutChart");
  if (dc) {
    const easy =
      parseInt(document.getElementById("ov-easy-count")?.textContent) || 0;
    const med =
      parseInt(document.getElementById("ov-medium-count")?.textContent) || 0;
    const hard =
      parseInt(document.getElementById("ov-hard-count")?.textContent) || 0;
    chartInstances["donutChart"] = new Chart(dc, {
      type: "doughnut",
      data: {
        labels: ["Easy", "Medium", "Hard"],
        datasets: [
          {
            data: [easy || 60, med || 30, hard || 10],
            backgroundColor: ["#00b4d8", "#f89f1b", "#e25555"],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        cutout: "65%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}` },
          },
        },
      },
    });
  }
}

/* ─────────────────────────────────────────────────
   ANALYTICS CHARTS
───────────────────────────────────────────────── */
let currentRange = "7d";
const ACTIVITY_DATA = {
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    lc: [5, 8, 3, 12, 7, 15, 9],
    gh: [3, 5, 8, 4, 6, 10, 7],
    gfg: [2, 4, 1, 6, 3, 8, 5],
  },
  "30d": {
    labels: Array.from({ length: 30 }, (_, i) => `D${i + 1}`),
    lc: Array.from({ length: 30 }, () => rand(2, 18)),
    gh: Array.from({ length: 30 }, () => rand(1, 12)),
    gfg: Array.from({ length: 30 }, () => rand(1, 10)),
  },
  "90d": {
    labels: Array.from({ length: 13 }, (_, i) => `W${i + 1}`),
    lc: Array.from({ length: 13 }, () => rand(20, 80)),
    gh: Array.from({ length: 13 }, () => rand(15, 60)),
    gfg: Array.from({ length: 13 }, () => rand(10, 50)),
  },
  "1y": {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    lc: [45, 60, 38, 72, 55, 90, 68, 82, 75, 95, 88, 110],
    gh: [30, 42, 55, 38, 65, 78, 52, 68, 72, 85, 70, 98],
    gfg: [20, 30, 25, 40, 35, 58, 45, 52, 60, 72, 65, 80],
  },
};

function setRange(btn, range) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentRange = range;
  renderAnalyticsCharts();
  const kpis = {
    "7d": { t: 425, a: 60.7, b: 98, s: 23 },
    "30d": { t: 1820, a: 60.7, b: 112, s: 23 },
    "90d": { t: 5340, a: 59.3, b: 128, s: 23 },
    "1y": { t: 21600, a: 59.2, b: 155, s: 23 },
  };
  const k = kpis[range];
  animateCounter("kpi-total-activity", k.t);
  animateCounter("kpi-avg-daily", k.a, 1);
  animateCounter("kpi-best-day", k.b);
  animateCounter("kpi-streak", k.s);
}

function renderAnalyticsCharts() {
  const d = ACTIVITY_DATA[currentRange];
  destroyChart("activityTrendChart");
  const ac = document.getElementById("activityTrendChart");
  if (ac) {
    chartInstances["activityTrendChart"] = new Chart(ac, {
      type: "line",
      data: {
        labels: d.labels,
        datasets: [
          {
            label: "LeetCode",
            data: d.lc,
            borderColor: "#f89f1b",
            backgroundColor: "rgba(248,159,27,.08)",
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 3,
          },
          {
            label: "GitHub",
            data: d.gh,
            borderColor: "#6e5ce7",
            backgroundColor: "rgba(110,92,231,.08)",
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 3,
          },
          {
            label: "GFG",
            data: d.gfg,
            borderColor: "#2f8d46",
            backgroundColor: "rgba(47,141,70,.08)",
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: { labels: { color: "#8b949e", font: { size: 12 } } },
        },
        scales: {
          x: { grid: { color: "rgba(48,54,61,.5)" } },
          y: { grid: { color: "rgba(48,54,61,.5)" }, beginAtZero: true },
        },
      },
    });
  }
  const totals = [
    d.lc.reduce((a, b) => a + b, 0),
    d.gh.reduce((a, b) => a + b, 0),
    d.gfg.reduce((a, b) => a + b, 0),
  ];
  destroyChart("platformPieChart");
  const pp = document.getElementById("platformPieChart");
  if (pp) {
    chartInstances["platformPieChart"] = new Chart(pp, {
      type: "doughnut",
      data: {
        labels: ["LeetCode", "GitHub", "GFG"],
        datasets: [
          {
            data: totals,
            backgroundColor: [
              "rgba(248,159,27,.85)",
              "rgba(110,92,231,.85)",
              "rgba(47,141,70,.85)",
            ],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        cutout: "60%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { padding: 12, color: "#8b949e", font: { size: 12 } },
          },
        },
      },
    });
  }
  buildHourlyHeatmap();
  destroyChart("weeklyCompareChart");
  const wc = document.getElementById("weeklyCompareChart");
  if (wc) {
    chartInstances["weeklyCompareChart"] = new Chart(wc, {
      type: "bar",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "LeetCode",
            data: [45, 62, 38, 78],
            backgroundColor: "rgba(248,159,27,.8)",
            borderRadius: 8,
          },
          {
            label: "GitHub",
            data: [32, 48, 55, 42],
            backgroundColor: "rgba(110,92,231,.8)",
            borderRadius: 8,
          },
          {
            label: "GFG",
            data: [20, 35, 28, 50],
            backgroundColor: "rgba(47,141,70,.8)",
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "#8b949e", font: { size: 12 } } },
        },
        scales: {
          x: { grid: { color: "rgba(48,54,61,.5)" } },
          y: { grid: { color: "rgba(48,54,61,.5)" }, beginAtZero: true },
        },
      },
    });
  }
}

function buildHourlyHeatmap() {
  const c = document.getElementById("hourlyHeatmap");
  if (!c) return;
  c.innerHTML = "";
  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = i % 12 || 12;
    return i < 12 ? `${h}am` : `${h}pm`;
  });
  hours.forEach((h) => {
    const lvl = Math.floor(Math.random() * 5);
    const cell = document.createElement("div");
    cell.className = `hh-cell hh-${lvl}`;
    cell.textContent = h;
    cell.title = `${h}: ${lvl * 8} activities`;
    c.appendChild(cell);
  });
}

/* ─────────────────────────────────────────────────
   LEETCODE  – real GraphQL via CORS proxy
───────────────────────────────────────────────── */
const LC_PROXY = "https://leetcode.com/graphql";
const LC_QUERY = `
query getUserData($username: String!) {
  matchedUser(username: $username) {
    username
    profile { realName ranking }
    submitStats { acSubmissionNum { difficulty count submissions } }
    userCalendar { streak totalActiveDays }
  }
  allQuestionsCount { difficulty count }
}`;

async function fetchLeetCode() {
  const raw = document.getElementById("lcUrl")?.value.trim();
  if (!raw) {
    showToast("Please enter a LeetCode URL or username", "warn");
    return;
  }
  const parsed = parseProfileUrl(raw);
  const username = parsed?.username || raw.trim();
  const btn = document.getElementById("lcFetchBtn");
  showLoading(btn, "Analysing…");

  try {
    const res = await fetch(LC_PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: LC_QUERY, variables: { username } }),
    });
    const json = await res.json();
    if (json.errors || !json.data?.matchedUser)
      throw new Error("User not found");
    populateLeetCode(json.data, username);
    showToast(`✅ LeetCode stats loaded for "${username}"`, "success");
  } catch {
    showToast(`Live LeetCode data is unavailable for "${username}"`, "error");
  } finally {
    hideLoading(btn);
  }
}

function populateLeetCode(data, username) {
  const user = data.matchedUser;
  const stats = user.submitStats.acSubmissionNum;
  const totals = data.allQuestionsCount;

  const easy = stats.find((s) => s.difficulty === "Easy")?.count || 0;
  const medium = stats.find((s) => s.difficulty === "Medium")?.count || 0;
  const hard = stats.find((s) => s.difficulty === "Hard")?.count || 0;
  const all =
    stats.find((s) => s.difficulty === "All")?.count || easy + medium + hard;

  const eT = totals.find((q) => q.difficulty === "Easy")?.count || 850;
  const mT = totals.find((q) => q.difficulty === "Medium")?.count || 1780;
  const hT = totals.find((q) => q.difficulty === "Hard")?.count || 750;
  const aT = eT + mT + hT;

  applyLeetCodeData({
    username,
    displayName: user.profile.realName || username,
    rank: user.profile.ranking
      ? `#${user.profile.ranking.toLocaleString()}`
      : "—",
    streak: user.userCalendar?.streak || 0,
    activeDays: user.userCalendar?.totalActiveDays || 0,
    easy,
    medium,
    hard,
    total: all,
    easyTotal: eT,
    mediumTotal: mT,
    hardTotal: hT,
    totalProblems: aT,
  });
}

function populateLeetCodeMock(username) {
  const seed = username.length;
  const easy = 50 + ((seed * 17) % 200);
  const medium = 30 + ((seed * 13) % 150);
  const hard = 5 + ((seed * 7) % 80);
  applyLeetCodeData({
    username,
    displayName: username,
    rank: `#${(10000 + seed * 1234) % 99999}`,
    streak: 5 + (seed % 30),
    activeDays: 50 + (seed % 200),
    easy,
    medium,
    hard,
    total: easy + medium + hard,
    easyTotal: 850,
    mediumTotal: 1780,
    hardTotal: 750,
    totalProblems: 3380,
  });
}

function applyLeetCodeData(d) {
  setText("lc-display-name", d.displayName);
  setText("lc-rank", d.rank);
  setText("lc-streak", d.streak + " days");
  setText("lc-active-days", d.activeDays);
  setText("lc-contests", "—");

  const acc = d.total > 0 ? ((d.total / d.totalProblems) * 100).toFixed(1) : 0;
  setText("lc-acceptance", acc + "%");

  animateCounter("lc-easy", d.easy);
  animateCounter("lc-medium", d.medium);
  animateCounter("lc-hard", d.hard);
  animateCounter("lc-total", d.total);

  setText("lc-easy-total", d.easyTotal);
  setText("lc-medium-total", d.mediumTotal);
  setText("lc-hard-total", d.hardTotal);
  setText("lc-total-problems", d.totalProblems);

  const eRem = d.easyTotal - d.easy;
  const mRem = d.mediumTotal - d.medium;
  const hRem = d.hardTotal - d.hard;
  const tRem = d.totalProblems - d.total;

  animateCounter("lc-easy-rem", eRem);
  animateCounter("lc-medium-rem", mRem);
  animateCounter("lc-hard-rem", hRem);
  animateCounter("lc-total-rem", tRem);

  setBarWidth("lc-easy-bar", (d.easy / d.easyTotal) * 100);
  setBarWidth("lc-medium-bar", (d.medium / d.mediumTotal) * 100);
  setBarWidth("lc-hard-bar", (d.hard / d.hardTotal) * 100);
  setBarWidth("lc-total-bar", (d.total / d.totalProblems) * 100);

  // Performance bars
  const ePct = Math.min((d.easy / d.easyTotal) * 100, 100);
  const mPct = Math.min((d.medium / d.mediumTotal) * 100, 100);
  const hPct = Math.min((d.hard / d.hardTotal) * 100, 100);
  const skill = Math.min(ePct * 0.2 + mPct * 0.5 + hPct * 1.0, 100);

  setTimeout(() => {
    setBarWidth("lc-easy-skill", ePct);
    setBarWidth("lc-medium-skill", mPct);
    setBarWidth("lc-hard-skill", hPct);
    setBarWidth("lc-skill-bar", skill);
  }, 200);

  setText("lc-easy-pct-label", ePct.toFixed(1) + "%");
  setText("lc-medium-pct-label", mPct.toFixed(1) + "%");
  setText("lc-hard-pct-label", hPct.toFixed(1) + "%");
  setText(
    "lc-skill-label",
    skill < 20
      ? "Beginner"
      : skill < 40
        ? "Novice"
        : skill < 60
          ? "Intermediate"
          : skill < 80
            ? "Advanced"
            : "Expert",
  );

  // Insight
  const ins = document.getElementById("lc-insight-box");
  if (ins) {
    const tips = [];
    if (ePct < 50)
      tips.push("🎯 Focus on Easy problems — build your foundation first.");
    else if (ePct > 80 && mPct < 30)
      tips.push("🚀 You've mastered Easy! Now push into Medium problems.");
    if (mPct > 50 && hPct < 10)
      tips.push(
        "💡 Great Medium progress! Start tackling Hard problems to prepare for top companies.",
      );
    if (hPct > 30)
      tips.push(
        "🏆 Impressive Hard solve rate — you're ready for FAANG-level interviews!",
      );
    if (d.streak < 5)
      tips.push("🔥 Keep a daily streak going — consistency beats intensity.");
    if (tips.length === 0)
      tips.push(
        "✅ Solid performance! Keep solving daily to improve your ranking.",
      );
    ins.innerHTML = tips.map((t) => `<p>${t}</p>`).join("");
  }

  // Update overview card
  setText("ov-lc-solved", d.total.toLocaleString());
  setText("ov-lc-trend", `E:${d.easy} M:${d.medium} H:${d.hard}`);
  setText("ov-easy-count", d.easy);
  setText("ov-medium-count", d.medium);
  setText("ov-hard-count", d.hard);
  animateCounter("ov-streak", d.total);
  updateOverviewDonut(d.easy, d.medium, d.hard);

  // Sidebar username
  setText("sidebar-username", d.displayName);
  const av = document.getElementById("sidebar-avatar-letter");
  if (av) av.textContent = (d.displayName || "U")[0].toUpperCase();

  // Show/hide sections
  show("lc-profile-card");
  show("lc-stats-section");
  show("lc-perf-section");
  show("lc-charts-section");
  show("lc-recent-section");
  show("lc-remaining-section");
  hide("lc-empty-state");

  renderLeetCodeCharts(d);
  buildRemainingProblems(d);
  buildLCRecentTable(d);
}

function updateOverviewDonut(easy, medium, hard) {
  destroyChart("donutChart");
  const dc = document.getElementById("donutChart");
  if (!dc) return;
  chartInstances["donutChart"] = new Chart(dc, {
    type: "doughnut",
    data: {
      labels: ["Easy", "Medium", "Hard"],
      datasets: [
        {
          data: [easy, medium, hard],
          backgroundColor: ["#00b4d8", "#f89f1b", "#e25555"],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      cutout: "65%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}` },
        },
      },
    },
  });
}

function renderLeetCodeCharts(d) {
  const subs = Array.from({ length: 15 }, () =>
    rand(0, Math.max(1, Math.floor(d.total / 30))),
  );
  destroyChart("lcActivityChart");
  const la = document.getElementById("lcActivityChart");
  if (la) {
    chartInstances["lcActivityChart"] = new Chart(la, {
      type: "line",
      data: {
        labels: Array.from({ length: 15 }, (_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: "Submissions",
            data: subs,
            borderColor: "#f89f1b",
            backgroundColor: "rgba(248,159,27,.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#f89f1b",
            pointRadius: 4,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "rgba(48,54,61,.5)" } },
          y: { grid: { color: "rgba(48,54,61,.5)" }, beginAtZero: true },
        },
      },
    });
  }
  destroyChart("lcLangChart");
  const ll = document.getElementById("lcLangChart");
  if (ll) {
    chartInstances["lcLangChart"] = new Chart(ll, {
      type: "pie",
      data: {
        labels: ["Python", "JavaScript", "Java", "C++"],
        datasets: [
          {
            data: [45, 30, 15, 10],
            backgroundColor: ["#6e5ce7", "#f89f1b", "#2ea44f", "#00b4d8"],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
            labels: { padding: 12, font: { size: 11 }, color: "#8b949e" },
          },
        },
      },
    });
  }
}

let remainingProblems = [];

function buildRemainingProblems(d) {
  remainingProblems = LC_PROBLEMS_DB.filter((problem) => {
    if (problem.difficulty === "Easy") return d.easy < d.easyTotal;
    if (problem.difficulty === "Medium") return d.medium < d.mediumTotal;
    return d.hard < d.hardTotal;
  }).slice(0, 8);
  renderRemainingProblems(remainingProblems);
}

function renderRemainingProblems(problems) {
  const grid = document.getElementById("remaining-problems-grid");
  if (!grid) return;
  grid.innerHTML = problems
    .map(
      (problem) => `<article class="problem-card">
        <div class="problem-card-top"><span class="tag ${problem.difficulty.toLowerCase()}-tag">${problem.difficulty}</span><span class="topic-tag">${problem.topic}</span></div>
        <h4>${problem.title}</h4>
        <p>${problem.desc}</p>
      </article>`,
    )
    .join("");
}

function filterRemaining(button, difficulty) {
  document
    .querySelectorAll(".rem-filters .filter-btn")
    .forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderRemainingProblems(
    difficulty === "all"
      ? remainingProblems
      : remainingProblems.filter(
          (problem) => problem.difficulty === difficulty,
        ),
  );
}

function buildLCRecentTable(d) {
  const PROBLEMS = LC_PROBLEMS_DB.slice(0, 20);
  const statuses = [
    "Accepted",
    "Accepted",
    "Accepted",
    "Wrong Answer",
    "Time Limit",
  ];
  const times = ["1h ago", "3h ago", "5h ago", "1d ago", "2d ago", "3d ago"];
  const tbody = document.getElementById("lc-recent-tbody");
  if (!tbody) return;
  tbody.innerHTML = PROBLEMS.slice(0, 8)
    .map((p, i) => {
      const st = statuses[i % statuses.length];
      const cls = st === "Accepted" ? "accepted" : "wrong";
      return `<tr><td>${i + 1}</td><td>${p.title}</td><td><span class="tag ${p.difficulty.toLowerCase()}-tag">${p.difficulty}</span></td><td><span class="status ${cls}">${st}</span></td><td>${times[i % times.length]}</td></tr>`;
    })
    .join("");
}

/* ─────────────────────────────────────────────────
   GITHUB  – real public API
───────────────────────────────────────────────── */
async function fetchGitHub() {
  const raw = document.getElementById("ghUrl")?.value.trim();
  if (!raw) {
    showToast("Please enter a GitHub URL or username", "warn");
    return;
  }
  const parsed = parseProfileUrl(raw);
  const username = parsed?.username || raw.trim();
  const btn = document.getElementById("ghFetchBtn");
  showLoading(btn, "Fetching…");

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      ),
    ]);
    if (!userRes.ok) throw new Error("User not found");
    const [user, repos] = await Promise.all([userRes.json(), reposRes.json()]);
    applyGitHubData(user, Array.isArray(repos) ? repos : []);
    showToast(`✅ GitHub profile loaded for "${username}"`, "success");
  } catch (e) {
    showToast(`Live GitHub data is unavailable for "${username}"`, "error");
  } finally {
    hideLoading(btn);
  }
}

function applyGitHubData(user, repos) {
  // Profile
  setAttr("gh-avatar", "src", user.avatar_url || "");
  setText("gh-name", user.name || user.login);
  setText("gh-login", `@${user.login}`);
  setText("gh-bio", user.bio || "No bio available.");
  setText("gh-location", user.location || "—");
  setText("gh-followers", (user.followers || 0).toLocaleString());
  setText("gh-following", (user.following || 0).toLocaleString());
  setText("gh-repos", (user.public_repos || 0).toLocaleString());

  // Aggregate repo stats
  const totalStars = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((a, r) => a + (r.forks_count || 0), 0);
  const totalIssues = repos.reduce((a, r) => a + (r.open_issues_count || 0), 0);
  const estCommits = repos.reduce(
    (a, r) => a + Math.max(1, Math.floor((r.size || 10) / 5)),
    0,
  );

  setText("gh-stars", totalStars.toLocaleString());
  setText("gh-total-stars", totalStars.toLocaleString());
  setText("gh-commits", estCommits.toLocaleString());
  setText("gh-forks", totalForks.toLocaleString());
  setText("gh-issues", totalIssues.toLocaleString());

  // Performance
  const popScore = Math.min(totalStars / 10, 100);
  const collab = Math.min((totalForks / Math.max(totalStars, 1)) * 100, 100);
  const langSet = new Set(repos.map((r) => r.language).filter(Boolean));
  const divScore = Math.min(langSet.size * 10, 100);

  setTimeout(() => {
    setBarWidth("gh-pop-bar", popScore);
    setBarWidth("gh-collab-bar", collab);
    setBarWidth("gh-div-bar", divScore);
  }, 200);

  setText(
    "gh-pop-label",
    popScore < 20 ? "Growing" : popScore < 50 ? "Popular" : "Highly Popular",
  );
  setText(
    "gh-collab-label",
    collab < 20 ? "Low" : collab < 50 ? "Moderate" : "High",
  );
  setText(
    "gh-div-label",
    divScore < 30 ? "Focused" : divScore < 60 ? "Diverse" : "Polyglot",
  );

  const ghIns = document.getElementById("gh-insight-box");
  if (ghIns) {
    const tips = [];
    if (totalStars < 10)
      tips.push("⭐ Add READMEs and project demos to attract stars.");
    if (langSet.size < 3)
      tips.push("🌐 Try contributing to projects in different languages.");
    if (user.public_repos > 20 && totalStars < 50)
      tips.push(
        "💡 Quality over quantity — polish your top 3 repos with better docs.",
      );
    if (totalForks > totalStars * 0.3)
      tips.push("🤝 High fork rate — people love your projects!");
    if (tips.length === 0)
      tips.push("✅ Great GitHub presence! Keep contributing consistently.");
    ghIns.innerHTML = tips.map((t) => `<p>${t}</p>`).join("");
  }

  // Overview card
  setText("ov-gh-commits", (user.public_repos || 0).toLocaleString());
  setText("ov-gh-trend", `⭐ ${totalStars} stars`);

  // Show sections
  show("gh-profile-section");
  show("gh-stats-section");
  show("gh-perf-section");
  show("gh-heatmap-section");
  show("gh-charts-section");
  show("gh-repos-card");
  hide("gh-empty-state");

  buildGithubHeatmap();
  renderGitHubCharts(repos);
  buildGHReposTable(repos);
}

function applyGitHubMock(username) {
  const seed = username.length;
  const mockRepos = Array.from({ length: 8 + (seed % 10) }, (_, i) => ({
    name: `project-${String.fromCharCode(97 + i)}`,
    language: ["JavaScript", "Python", "TypeScript", "Java", "C++", "Go"][
      i % 6
    ],
    stargazers_count: rand(1, 150),
    forks_count: rand(0, 40),
    open_issues_count: rand(0, 10),
    size: rand(100, 5000),
    updated_at: new Date(Date.now() - rand(1, 30) * 86400000).toISOString(),
  }));
  const mockUser = {
    avatar_url: `https://avatars.dicebear.com/api/initials/${username}.svg`,
    name: username,
    login: username,
    bio: "Demo profile data",
    location: "Earth",
    followers: rand(10, 500),
    following: rand(5, 200),
    public_repos: mockRepos.length,
  };
  applyGitHubData(mockUser, mockRepos);
}

function buildGithubHeatmap() {
  const c = document.getElementById("ghHeatmap");
  if (!c) return;
  c.innerHTML = "";
  for (let i = 0; i < 364; i++) {
    const lvl = Math.random() < 0.35 ? 0 : Math.floor(Math.random() * 4) + 1;
    const cell = document.createElement("div");
    cell.className = `hm-cell hm-${lvl}`;
    const dt = new Date();
    dt.setDate(dt.getDate() - (363 - i));
    cell.title = `${dt.toDateString()}: ${lvl === 0 ? "No" : lvl * 3} contributions`;
    c.appendChild(cell);
  }
}

function renderGitHubCharts(repos) {
  // Stars per repo (top 10)
  const top10 = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10);
  destroyChart("ghCommitsChart");
  const gc = document.getElementById("ghCommitsChart");
  if (gc) {
    chartInstances["ghCommitsChart"] = new Chart(gc, {
      type: "bar",
      data: {
        labels: top10.map((r) => r.name),
        datasets: [
          {
            label: "Stars",
            data: top10.map((r) => r.stargazers_count),
            backgroundColor: "rgba(248,159,27,.8)",
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: "rgba(48,54,61,.5)" },
            ticks: { maxRotation: 30 },
          },
          y: { grid: { color: "rgba(48,54,61,.5)" }, beginAtZero: true },
        },
      },
    });
  }
  // Language distribution
  const langCount = {};
  repos.forEach((r) => {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  });
  const sortedLangs = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  destroyChart("ghLangChart");
  const gl = document.getElementById("ghLangChart");
  if (gl) {
    chartInstances["ghLangChart"] = new Chart(gl, {
      type: "doughnut",
      data: {
        labels: sortedLangs.map((l) => l[0]),
        datasets: [
          {
            data: sortedLangs.map((l) => l[1]),
            backgroundColor: [
              "#f5c518",
              "#4b8bbe",
              "#3178c6",
              "#00599c",
              "#2ea44f",
              "#8b949e",
            ],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        cutout: "60%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { padding: 10, font: { size: 11 }, color: "#8b949e" },
          },
        },
      },
    });
  }
}

function buildGHReposTable(repos) {
  const tbody = document.getElementById("gh-repos-tbody");
  if (!tbody) return;
  const langClass = (l) =>
    l === "JavaScript"
      ? "js"
      : l === "Python" || l === "TypeScript"
        ? "py"
        : "html";
  const timeAgo = (d) => {
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff / 86400000);
    return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days}d ago`;
  };
  tbody.innerHTML = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 15)
    .map(
      (r) => `
    <tr>
      <td><i class="fab fa-github"></i> <a href="https://github.com/${r.full_name || r.name}" target="_blank" style="color:var(--accent)">${r.name}</a></td>
      <td>${r.language ? `<span class="lang-tag ${langClass(r.language)}">${r.language}</span>` : '<span style="color:var(--text-muted)">—</span>'}</td>
      <td>⭐ ${r.stargazers_count || 0}</td>
      <td>🍴 ${r.forks_count || 0}</td>
      <td>${timeAgo(r.updated_at || new Date().toISOString())}</td>
    </tr>`,
    )
    .join("");
}

/* ─────────────────────────────────────────────────
   GEEKSFORGEEKS  – community API + mock fallback
───────────────────────────────────────────────── */
async function fetchGFG() {
  const raw = document.getElementById("gfgUrl")?.value.trim();
  if (!raw) {
    showToast("Please enter a GFG URL or username", "warn");
    return;
  }
  const parsed = parseProfileUrl(raw);
  const username = parsed?.username || raw.trim();
  const btn = document.getElementById("gfgFetchBtn");
  showLoading(btn, "Fetching…");

  try {
    // Community GFG stats API
    const res = await fetch(
      `https://geeks-for-geeks-stats-api.vercel.app/?raw=Y&userName=${username}`,
    );
    const json = await res.json();
    if (json.error || !json.info) throw new Error("Not found");
    applyGFGData(json, username);
    showToast(`✅ GFG stats loaded for "${username}"`, "success");
  } catch {
    showToast(`Live GFG data is unavailable for "${username}"`, "error");
  } finally {
    hideLoading(btn);
  }
}

function applyGFGData(json, username) {
  const info = json.info || {};
  const stats = json.solvedStats || {};
  const easy = stats.easy?.count || stats.EASY?.count || rand(40, 120);
  const medium = stats.medium?.count || stats.MEDIUM?.count || rand(20, 90);
  const hard = stats.hard?.count || stats.HARD?.count || rand(5, 50);
  const total = parseInt(info.totalProblemsSolved || 0) || easy + medium + hard;
  const score = parseInt(info.codingScore || 0) || rand(500, 3000);

  applyGFGDisplay({
    username,
    name: info.userName || username,
    instituteRank: info.instituteRank ? `#${info.instituteRank}` : "—",
    globalRank: "—",
    streak: info.currentStreak || 0,
    score,
    total,
    easy,
    medium,
    hard,
    courses: rand(1, 6),
  });
}

function applyGFGMock(username) {
  const seed = username.length;
  const easy = 30 + ((seed * 11) % 120);
  const medium = 15 + ((seed * 7) % 90);
  const hard = 2 + ((seed * 3) % 40);
  applyGFGDisplay({
    username,
    name: username,
    instituteRank: `#${((seed * 7) % 50) + 1}`,
    globalRank: `#${((seed * 1337) % 10000) + 100}`,
    streak: ((seed * 3) % 30) + 1,
    score: easy * 8 + medium * 15 + hard * 25,
    total: easy + medium + hard,
    easy,
    medium,
    hard,
    courses: (seed % 5) + 1,
  });
}

function applyGFGDisplay(d) {
  setText("gfg-name", d.name);
  setText("gfg-inst-rank", d.instituteRank);
  setText("gfg-global-rank", d.globalRank);
  setText("gfg-streak", d.streak + " days");
  setText("gfg-score-badge", d.score.toLocaleString());
  animateCounter("gfg-score", d.score);
  animateCounter("gfg-problems", d.total);
  animateCounter("gfg-easy", d.easy);
  animateCounter("gfg-medium", d.medium);
  animateCounter("gfg-hard", d.hard);
  animateCounter("gfg-courses", d.courses);

  // Performance bars
  const ePct = Math.min((d.easy / 200) * 100, 100);
  const mPct = Math.min((d.medium / 150) * 100, 100);
  const hPct = Math.min((d.hard / 80) * 100, 100);
  const skill = Math.min(ePct * 0.2 + mPct * 0.5 + hPct * 1.0, 100);

  setTimeout(() => {
    setBarWidth("gfg-easy-skill", ePct);
    setBarWidth("gfg-medium-skill", mPct);
    setBarWidth("gfg-hard-skill", hPct);
    setBarWidth("gfg-skill-bar", skill);
  }, 200);

  setText("gfg-easy-pct", ePct.toFixed(1) + "%");
  setText("gfg-medium-pct", mPct.toFixed(1) + "%");
  setText("gfg-hard-pct", hPct.toFixed(1) + "%");
  setText(
    "gfg-skill-label",
    skill < 20
      ? "Beginner"
      : skill < 40
        ? "Novice"
        : skill < 60
          ? "Intermediate"
          : skill < 80
            ? "Advanced"
            : "Expert",
  );

  const ins = document.getElementById("gfg-insight-box");
  if (ins) {
    const tips = [];
    if (d.easy < 30)
      tips.push(
        "🎯 Solve more Easy GFG problems to build your DSA foundation.",
      );
    if (d.medium < 20)
      tips.push(
        "📈 Medium problems boost your coding score the most — focus there!",
      );
    if (d.hard < 5)
      tips.push(
        "🏆 Try at least 1 Hard problem per week for competitive edge.",
      );
    if (d.streak < 7)
      tips.push("🔥 Maintain a 7-day streak to unlock bonus points on GFG.");
    if (tips.length === 0)
      tips.push("✅ Excellent GFG performance! Keep your streak alive.");
    ins.innerHTML = tips.map((t) => `<p>${t}</p>`).join("");
  }

  // Overview card
  setText("ov-gfg-score", d.score.toLocaleString());
  setText("ov-gfg-trend", `${d.total} problems`);

  show("gfg-profile-card");
  show("gfg-stats-section");
  show("gfg-perf-section");
  show("gfg-charts-section");
  show("gfg-remaining-section");
  hide("gfg-empty-state");

  renderGFGCharts(d);
  buildGFGRemainingProblems(d);
}

function renderGFGCharts(d) {
  destroyChart("gfgActivityChart");
  const ga = document.getElementById("gfgActivityChart");
  if (ga) {
    const monthly = Array.from({ length: 12 }, () =>
      rand(
        Math.max(1, Math.floor(d.total / 24)),
        Math.max(2, Math.floor(d.total / 8)),
      ),
    );
    chartInstances["gfgActivityChart"] = new Chart(ga, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Solved",
            data: monthly,
            borderColor: "#2f8d46",
            backgroundColor: "rgba(47,141,70,.12)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#2f8d46",
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "rgba(48,54,61,.5)" } },
          y: { grid: { color: "rgba(48,54,61,.5)" }, beginAtZero: true },
        },
      },
    });
  }
  destroyChart("gfgTopicChart");
  const gt = document.getElementById("gfgTopicChart");
  if (gt) {
    chartInstances["gfgTopicChart"] = new Chart(gt, {
      type: "polarArea",
      data: {
        labels: ["Arrays", "Strings", "Trees", "Graphs", "DP", "Others"],
        datasets: [
          {
            data: [
              d.easy,
              Math.floor(d.easy * 0.6),
              Math.floor(d.medium * 0.4),
              Math.floor(d.medium * 0.3),
              d.hard,
              Math.floor(d.total * 0.1),
            ],
            backgroundColor: [
              "rgba(248,159,27,.7)",
              "rgba(110,92,231,.7)",
              "rgba(47,141,70,.7)",
              "rgba(0,180,216,.7)",
              "rgba(226,85,85,.7)",
              "rgba(139,148,158,.7)",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
            labels: { padding: 10, font: { size: 11 }, color: "#8b949e" },
          },
        },
        scales: {
          r: {
            grid: { color: "rgba(48,54,61,.5)" },
            ticks: { display: false },
          },
        },
      },
    });
  }
}

/* ─────────────────────────────────────────────────
   ANALYSE ALL (Overview quick analyser)
───────────────────────────────────────────────── */
async function analyseAll() {
  const lcVal = document.getElementById("ov-lc-url")?.value.trim();
  const ghVal = document.getElementById("ov-gh-url")?.value.trim();
  const gfgVal = document.getElementById("ov-gfg-url")?.value.trim();
  if (!lcVal && !ghVal && !gfgVal) {
    showToast("Enter at least one URL to analyse", "warn");
    return;
  }

  const btn = document.getElementById("analyseAllBtn");
  showLoading(btn, "Analysing all…");

  // Copy values to respective tab inputs
  if (lcVal) {
    const el = document.getElementById("lcUrl");
    if (el) el.value = lcVal;
  }
  if (ghVal) {
    const el = document.getElementById("ghUrl");
    if (el) el.value = ghVal;
  }
  if (gfgVal) {
    const el = document.getElementById("gfgUrl");
    if (el) el.value = gfgVal;
  }

  const tasks = [];
  if (lcVal) tasks.push(fetchLeetCode().catch(() => {}));
  if (ghVal) tasks.push(fetchGitHub().catch(() => {}));
  if (gfgVal) tasks.push(fetchGFG().catch(() => {}));
  await Promise.allSettled(tasks);

  hideLoading(btn);
  showToast("✅ All platforms analysed!", "success");
}

/* ─────────────────────────────────────────────────
   DAILY USER ANALYSER
───────────────────────────────────────────────── */
const SAMPLE_URLS = [
  "https://leetcode.com/u/neal_wu",
  "https://github.com/torvalds",
  "https://geeksforgeeks.org/user/geeksforgeeks",
  "https://leetcode.com/u/tourist",
  "https://github.com/gvanrossum",
  "https://leetcode.com/u/jiangly",
  "https://geeksforgeeks.org/user/coder_alpha",
  "https://github.com/sindresorhus",
];

/* ─────────────────────────────────────────────────
   PAGE INITIALISATION
───────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  setDate();
  renderOverviewCharts();

  document.querySelectorAll(".sidebar-link[data-tab]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      switchTab(link.dataset.tab);
    });
  });

  document.getElementById("sidebarToggle")?.addEventListener("click", () => {
    document.getElementById("sidebar")?.classList.toggle("open");
  });

  document.getElementById("refreshBtn")?.addEventListener("click", () => {
    setDate();
    renderOverviewCharts();
    showToast("Dashboard refreshed", "success");
  });
});

function loadSampleUrls() {
  const ta = document.getElementById("urlPasteArea");
  if (ta) ta.value = SAMPLE_URLS.join("\n");
  showToast("Sample URLs loaded — click Run Analysis!", "info");
}
function clearAnalyser() {
  const ta = document.getElementById("urlPasteArea");
  if (ta) ta.value = "";
  hide("analyser-results");
  show("analyser-empty");
  hide("analysis-progress");
}

async function runDailyAnalyser() {
  const raw = document.getElementById("urlPasteArea")?.value.trim();
  if (!raw) {
    showToast("Paste some profile URLs first", "warn");
    return;
  }

  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) {
    showToast("No valid URLs found", "warn");
    return;
  }

  // Group by user (pair LC+GH+GFG for same person via same line chunk)
  const users = {};
  lines.forEach((line) => {
    const p = parseProfileUrl(line);
    if (!p) return;
    if (p.platform === "unknown") return;
    const key = p.username.toLowerCase();
    if (!users[key])
      users[key] = { username: p.username, lc: null, gh: null, gfg: null };
    if (p.platform === "leetcode") users[key].lc = p.username;
    if (p.platform === "github") users[key].gh = p.username;
    if (p.platform === "gfg") users[key].gfg = p.username;
  });

  const userList = Object.values(users);
  if (userList.length === 0) {
    showToast("Use complete LeetCode, GitHub, or GFG profile URLs", "warn");
    return;
  }
  show("analysis-progress");
  hide("analyser-results");
  hide("analyser-empty");

  const results = [];
  for (let i = 0; i < userList.length; i++) {
    const u = userList[i];
    const pct = Math.round(((i + 1) / userList.length) * 100);
    const bar = document.getElementById("ap-bar");
    const status = document.getElementById("ap-status");
    if (bar) bar.style.width = pct + "%";
    if (status)
      status.textContent = `Analysing ${u.username} (${i + 1}/${userList.length})…`;

    const data = await analyseUser(u);
    results.push(data);
    await new Promise((r) => setTimeout(r, 200));
  }

  results.sort((a, b) => b.totalScore - a.totalScore);
  hide("analysis-progress");
  renderAnalyserResults(results);
}

async function analyseUser(u) {
  const out = {
    username: u.username,
    lcSolved: 0,
    lcScore: 0,
    ghRepos: 0,
    ghScore: 0,
    gfgScore: 0,
    gfgSolved: 0,
    streak: 0,
    totalScore: 0,
    platform: [],
  };

  // LC
  if (u.lc) {
    try {
      const res = await fetch(LC_PROXY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: LC_QUERY,
          variables: { username: u.lc },
        }),
      });
      const j = await res.json();
      if (j.data?.matchedUser) {
        const stats = j.data.matchedUser.submitStats.acSubmissionNum;
        const easy = stats.find((s) => s.difficulty === "Easy")?.count || 0;
        const medium = stats.find((s) => s.difficulty === "Medium")?.count || 0;
        const hard = stats.find((s) => s.difficulty === "Hard")?.count || 0;
        out.lcSolved = easy + medium + hard;
        out.lcScore = easy * 30 + medium * 70 + hard * 150;
        out.streak = j.data.matchedUser.userCalendar?.streak || 0;
        out.platform.push("LeetCode");
      } else out.platform.push("LeetCode unavailable");
    } catch {
      out.platform.push("LeetCode unavailable");
    }
  }

  // GitHub
  if (u.gh) {
    try {
      const res = await fetch(
        `https://api.github.com/users/${u.gh}/repos?per_page=100`,
      );
      if (res.ok) {
        const repos = await res.json();
        out.ghRepos = Array.isArray(repos) ? repos.length : 0;
        const stars = Array.isArray(repos)
          ? repos.reduce((a, r) => a + (r.stargazers_count || 0), 0)
          : 0;
        out.ghScore = stars * 10;
        out.platform.push("GitHub");
      } else out.platform.push("GitHub unavailable");
    } catch {
      out.platform.push("GitHub unavailable");
    }
  }

  // GFG
  if (u.gfg) {
    try {
      const res = await fetch(
        `https://geeks-for-geeks-stats-api.vercel.app/?raw=Y&userName=${u.gfg}`,
      );
      const j = await res.json();
      if (!j.error && j.info) {
        out.gfgScore = parseInt(j.info.codingScore || 0, 10) || 0;
        out.gfgSolved = parseInt(j.info.totalProblemsSolved || 0, 10) || 0;
        out.platform.push("GFG");
      } else out.platform.push("GFG unavailable");
    } catch {
      out.platform.push("GFG unavailable");
    }
  }

  out.totalScore =
    (out.lcScore || 0) +
    (out.ghScore || 0) +
    Math.floor((out.gfgScore || 0) / 10) +
    out.streak * 20;
  return out;
}

function renderAnalyserResults(results) {
  show("analyser-results");
  hide("analyser-empty");

  // Podium (top 3)
  const podium = document.getElementById("analyser-podium");
  if (podium && results.length >= 1) {
    const colors = ["#f89f1b", "#6e5ce7", "#2ea44f"];
    const labels = ["1st", "2nd", "3rd"];
    const crowns = ["🏆", "🥈", "🥉"];
    const order =
      results.length >= 3
        ? [results[1], results[0], results[2]]
        : results.slice(0, 3);
    const blockH = ["60px", "80px", "50px"];
    podium.innerHTML = order
      .map((u, i) => {
        if (!u) return "";
        const rank = results.indexOf(u);
        return `<div class="podium-card">
        <div class="podium-crown">${crowns[rank] || "🏅"}</div>
        <div class="podium-avatar" style="background:${colors[rank] || "#30363d"}">${u.username[0].toUpperCase()}</div>
        <div class="podium-name">${u.username}</div>
        <div class="podium-score">${u.totalScore.toLocaleString()} pts</div>
        <div class="podium-block" style="height:${blockH[i]};background:${colors[rank] || "#30363d"};width:100px;border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff">${labels[rank] || `${rank + 1}th`}</div>
      </div>`;
      })
      .join("");
  }

  // Summary cards
  const sc = document.getElementById("analyser-summary-cards");
  if (sc) {
    const winner = results[0];
    sc.innerHTML = `
      <div class="sum-card lc-card-border"><div class="sc-left"><div class="sc-icon lc-bg"><i class="fas fa-users"></i></div><div><div class="sc-label">Users Analysed</div><div class="sc-value">${results.length}</div></div></div></div>
      <div class="sum-card gh-card-border"><div class="sc-left"><div class="sc-icon gh-bg"><i class="fas fa-trophy"></i></div><div><div class="sc-label">Today's Champion</div><div class="sc-value" style="font-size:1.1rem">${winner?.username || "—"}</div></div></div></div>
      <div class="sum-card gfg-card-border"><div class="sc-left"><div class="sc-icon gfg-bg"><i class="fas fa-star"></i></div><div><div class="sc-label">Top Score</div><div class="sc-value">${winner?.totalScore?.toLocaleString() || "—"}</div></div></div></div>
      <div class="sum-card day-card-border"><div class="sc-left"><div class="sc-icon day-bg"><i class="fas fa-code"></i></div><div><div class="sc-label">Total LC Solved</div><div class="sc-value">${results.reduce((a, u) => a + (u.lcSolved || 0), 0).toLocaleString()}</div></div></div></div>`;
  }

  // Table
  const tbody = document.getElementById("analyser-tbody");
  if (tbody) {
    const medals = ["🥇", "🥈", "🥉"];
    tbody.innerHTML = results
      .map(
        (u, i) => `
      <tr class="${i < 3 ? "rank-" + (i + 1) : ""}">
        <td>${medals[i] || i + 1}</td>
        <td><div style="display:flex;align-items:center;gap:8px"><div style="width:30px;height:30px;border-radius:50%;background:${i === 0 ? "#f89f1b" : i === 1 ? "#6e5ce7" : i === 2 ? "#2ea44f" : "#30363d"};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.8rem">${u.username[0].toUpperCase()}</div><span style="font-weight:600">${u.username}</span></div></td>
        <td><span style="color:var(--text-muted);font-size:.75rem">${u.platform.join(", ")}</span></td>
        <td><span style="color:var(--lc);font-weight:600">${(u.lcSolved || 0).toLocaleString()}</span></td>
        <td><span style="color:#9b8cff;font-weight:600">${(u.ghRepos || 0).toLocaleString()}</span></td>
        <td><span style="color:#4caf7d;font-weight:600">${(u.gfgScore || 0).toLocaleString()}</span></td>
        <td><span style="font-size:1rem;font-weight:800">${u.totalScore.toLocaleString()}</span> <small style="color:var(--text-muted)">pts</small></td>
        <td><button class="btn btn-outline btn-sm" onclick="loadUserToTabs('${u.username}')"><i class="fas fa-eye"></i> View</button></td>
      </tr>`,
      )
      .join("");
  }

  // Charts
  renderAnalyserCharts(results);

  // Update User of the Day tab
  updateUserOfDay(results);

  showToast(`🏆 Analysis complete! ${results.length} users ranked.`, "success");
}

function loadUserToTabs(username) {
  const v = document.getElementById("lcUrl");
  if (v) v.value = username;
  const g = document.getElementById("ghUrl");
  if (g) g.value = username;
  const f = document.getElementById("gfgUrl");
  if (f) f.value = username;
  switchTab("leetcode");
  fetchLeetCode();
}

function renderAnalyserCharts(results) {
  const top8 = results.slice(0, 8);
  destroyChart("analyserCompareChart");
  const ac = document.getElementById("analyserCompareChart");
  if (ac) {
    chartInstances["analyserCompareChart"] = new Chart(ac, {
      type: "bar",
      data: {
        labels: top8.map((u) => u.username),
        datasets: [
          {
            label: "LC",
            data: top8.map((u) => u.lcScore || 0),
            backgroundColor: "rgba(248,159,27,.8)",
            borderRadius: 6,
          },
          {
            label: "GH",
            data: top8.map((u) => u.ghScore || 0),
            backgroundColor: "rgba(110,92,231,.8)",
            borderRadius: 6,
          },
          {
            label: "GFG",
            data: top8.map((u) => Math.floor((u.gfgScore || 0) / 10)),
            backgroundColor: "rgba(47,141,70,.8)",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: "#8b949e" } } },
        scales: {
          x: { grid: { color: "rgba(48,54,61,.5)" } },
          y: { grid: { color: "rgba(48,54,61,.5)" }, beginAtZero: true },
        },
      },
    });
  }
  const lcTotal = results.reduce((a, u) => a + (u.lcScore || 0), 0);
  const ghTotal = results.reduce((a, u) => a + (u.ghScore || 0), 0);
  const gfgTotal = results.reduce(
    (a, u) => a + Math.floor((u.gfgScore || 0) / 10),
    0,
  );
  destroyChart("analyserPieChart");
  const ap = document.getElementById("analyserPieChart");
  if (ap) {
    chartInstances["analyserPieChart"] = new Chart(ap, {
      type: "doughnut",
      data: {
        labels: ["LeetCode", "GitHub", "GFG"],
        datasets: [
          {
            data: [lcTotal, ghTotal, gfgTotal],
            backgroundColor: [
              "rgba(248,159,27,.85)",
              "rgba(110,92,231,.85)",
              "rgba(47,141,70,.85)",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: "55%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#8b949e", padding: 12 },
          },
        },
      },
    });
  }
}

function updateUserOfDay(results) {
  if (!results.length) return;
  const w = results[0];
  setText("pod1-name", w.username);
  setText("pod1-score", w.totalScore.toLocaleString() + " pts");
  setText("wdc-name", w.username + " 🏆 Champion");
  setText("wdc-sub", "Today's top performer across all platforms");
  setText("wdc-pts", w.totalScore.toLocaleString());
  if (results[1]) {
    setText("pod2-name", results[1].username);
    setText("pod2-score", results[1].totalScore.toLocaleString() + " pts");
  }
  if (results[2]) {
    setText("pod3-name", results[2].username);
    setText("pod3-score", results[2].totalScore.toLocaleString() + " pts");
  }
  setText("wdc-lc-val", (w.lcSolved || 0) + " problems");
  setText("wdc-lc-pts", "+" + (w.lcScore || 0).toLocaleString() + " pts");
  setText("wdc-gh-val", (w.ghRepos || 0) + " repos");
  setText("wdc-gh-pts", "+" + (w.ghScore || 0).toLocaleString() + " pts");
  setText("wdc-gfg-val", (w.gfgSolved || 0) + " problems");
  setText(
    "wdc-gfg-pts",
    "+" + Math.floor((w.gfgScore || 0) / 10).toLocaleString() + " pts",
  );
  setText("wdc-streak-val", (w.streak || 0) + "-day streak");
  setText("wdc-streak-pts", "+" + (w.streak || 0) * 20 + " pts");

  const lbTbody = document.getElementById("leaderboard-tbody");
  if (lbTbody) {
    const medals = ["🥇", "🥈", "🥉"];
    lbTbody.innerHTML = results
      .map(
        (u, i) => `
      <tr class="${i < 3 ? "rank-" + (i + 1) : ""}">
        <td>${medals[i] || i + 1}</td>
        <td><div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:50%;background:${i === 0 ? "#f89f1b" : i === 1 ? "#6e5ce7" : i === 2 ? "#2ea44f" : "#30363d"};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem">${u.username[0].toUpperCase()}</div><span style="font-weight:600;color:var(--text-primary)">${u.username}</span></div></td>
        <td><span style="color:var(--lc);font-weight:600">${u.lcSolved || 0} solved</span></td>
        <td><span style="color:#9b8cff;font-weight:600">${u.ghRepos || 0} repos</span></td>
        <td><span style="color:#4caf7d;font-weight:600">${u.gfgSolved || 0 || "—"}</span></td>
        <td><span style="font-size:1.05rem;font-weight:800;color:var(--text-primary)">${u.totalScore.toLocaleString()}</span> <small style="color:var(--text-muted)">pts</small></td>
      </tr>`,
      )
      .join("");
  }
}

/* ─────────────────────────────────────────────────
   PROBLEMS DATABASE  – LeetCode (50 key problems)
───────────────────────────────────────────────── */
const LC_PROBLEMS_DB = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    platform: "leetcode",
    slug: "two-sum",
    desc: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    approach:
      "Use a hash map to store seen numbers. For each number, check if (target - num) exists in the map.",
    complexity: "Time: O(n) · Space: O(n)",
    python: `def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i`,
    java: `public int[] twoSum(int[] nums, int target) {\n    Map<Integer,Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int diff = target - nums[i];\n        if (map.containsKey(diff)) return new int[]{map.get(diff), i};\n        map.put(nums[i], i);\n    }\n    return new int[]{};\n}`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int,int> mp;\n    for (int i=0;i<nums.size();i++) {\n        if (mp.count(target-nums[i])) return {mp[target-nums[i]],i};\n        mp[nums[i]] = i;\n    }\n    return {};\n}`,
    js: `var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i=0;i<nums.length;i++) {\n        if (map.has(target-nums[i])) return [map.get(target-nums[i]),i];\n        map.set(nums[i],i);\n    }\n};`,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    topic: "Linked List",
    platform: "leetcode",
    slug: "add-two-numbers",
    desc: "Add two numbers represented as linked lists (digits stored in reverse order).",
    approach:
      "Traverse both lists simultaneously, keeping a carry. Create new nodes for each sum digit.",
    complexity: "Time: O(max(m,n)) · Space: O(max(m,n))",
    python: `def addTwoNumbers(l1, l2):\n    dummy = ListNode(0)\n    cur, carry = dummy, 0\n    while l1 or l2 or carry:\n        s = (l1.val if l1 else 0)+(l2.val if l2 else 0)+carry\n        carry, rem = divmod(s, 10)\n        cur.next = ListNode(rem)\n        cur = cur.next\n        l1 = l1.next if l1 else None\n        l2 = l2.next if l2 else None\n    return dummy.next`,
    java: `public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n    ListNode dummy=new ListNode(0); ListNode cur=dummy; int carry=0;\n    while(l1!=null||l2!=null||carry!=0){\n        int s=(l1!=null?l1.val:0)+(l2!=null?l2.val:0)+carry;\n        carry=s/10; cur.next=new ListNode(s%10); cur=cur.next;\n        if(l1!=null)l1=l1.next; if(l2!=null)l2=l2.next;\n    }\n    return dummy.next;\n}`,
    cpp: `ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n    ListNode *dummy=new ListNode(0),*cur=dummy; int carry=0;\n    while(l1||l2||carry){\n        int s=(l1?l1->val:0)+(l2?l2->val:0)+carry;\n        carry=s/10; cur->next=new ListNode(s%10); cur=cur->next;\n        if(l1)l1=l1->next; if(l2)l2=l2->next;\n    }\n    return dummy->next;\n}`,
    js: `var addTwoNumbers=function(l1,l2){\n    let dummy=new ListNode(0),cur=dummy,carry=0;\n    while(l1||l2||carry){\n        let s=(l1?l1.val:0)+(l2?l2.val:0)+carry;\n        carry=Math.floor(s/10); cur.next=new ListNode(s%10); cur=cur.next;\n        if(l1)l1=l1.next; if(l2)l2=l2.next;\n    }\n    return dummy.next;\n};`,
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating",
    difficulty: "Medium",
    topic: "String",
    platform: "leetcode",
    slug: "longest-substring-without-repeating-characters",
    desc: "Find the length of the longest substring without repeating characters.",
    approach:
      "Sliding window with a hash set. Expand right pointer; when duplicate found, shrink left.",
    complexity: "Time: O(n) · Space: O(min(m,n))",
    python: `def lengthOfLongestSubstring(s):\n    chars, left, res = set(), 0, 0\n    for right in range(len(s)):\n        while s[right] in chars:\n            chars.remove(s[left]); left+=1\n        chars.add(s[right])\n        res = max(res, right-left+1)\n    return res`,
    java: `public int lengthOfLongestSubstring(String s){\n    Set<Character> set=new HashSet<>(); int l=0,res=0;\n    for(int r=0;r<s.length();r++){\n        while(set.contains(s.charAt(r))){set.remove(s.charAt(l++));}\n        set.add(s.charAt(r)); res=Math.max(res,r-l+1);\n    }\n    return res;\n}`,
    cpp: `int lengthOfLongestSubstring(string s){\n    unordered_set<char> st; int l=0,res=0;\n    for(int r=0;r<s.size();r++){\n        while(st.count(s[r])){st.erase(s[l++]);}\n        st.insert(s[r]); res=max(res,r-l+1);\n    }\n    return res;\n}`,
    js: `var lengthOfLongestSubstring=function(s){\n    const set=new Set(); let l=0,res=0;\n    for(let r=0;r<s.length;r++){\n        while(set.has(s[r])){set.delete(s[l++]);}\n        set.add(s[r]); res=Math.max(res,r-l+1);\n    }\n    return res;\n};`,
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    topic: "Binary Search",
    platform: "leetcode",
    slug: "median-of-two-sorted-arrays",
    desc: "Find the median of two sorted arrays in O(log(m+n)) time.",
    approach:
      "Binary search on the smaller array. Partition both arrays such that left halves contain (m+n)/2 elements.",
    complexity: "Time: O(log(min(m,n))) · Space: O(1)",
    python: `def findMedianSortedArrays(nums1, nums2):\n    if len(nums1)>len(nums2): nums1,nums2=nums2,nums1\n    m,n=len(nums1),len(nums2)\n    lo,hi=0,m\n    while lo<=hi:\n        px=(lo+hi)//2; py=(m+n+1)//2-px\n        ml=nums1[px-1] if px>0 else float('-inf')\n        mr=nums1[px]   if px<m else float('inf')\n        nl=nums2[py-1] if py>0 else float('-inf')\n        nr=nums2[py]   if py<n else float('inf')\n        if ml<=nr and nl<=mr:\n            if (m+n)%2: return max(ml,nl)\n            return (max(ml,nl)+min(mr,nr))/2\n        elif ml>nr: hi=px-1\n        else: lo=px+1`,
    java: `// Binary search solution – see LeetCode editorial for full Java impl.`,
    cpp: `// Binary search solution – see LeetCode editorial for full C++ impl.`,
    js: `// Binary search solution – see LeetCode editorial for full JS impl.`,
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    platform: "leetcode",
    slug: "longest-palindromic-substring",
    desc: "Return the longest palindromic substring in s.",
    approach:
      "Expand Around Center: for each character (and between characters), expand outward while palindrome holds.",
    complexity: "Time: O(n²) · Space: O(1)",
    python: `def longestPalindrome(s):\n    res=""\n    def expand(l,r):\n        while l>=0 and r<len(s) and s[l]==s[r]: l-=1;r+=1\n        return s[l+1:r]\n    for i in range(len(s)):\n        odd=expand(i,i); even=expand(i,i+1)\n        if len(odd)>len(res): res=odd\n        if len(even)>len(res): res=even\n    return res`,
    java: `public String longestPalindrome(String s){\n    String res="";\n    for(int i=0;i<s.length();i++){\n        String odd=expand(s,i,i),even=expand(s,i,i+1);\n        if(odd.length()>res.length())res=odd;\n        if(even.length()>res.length())res=even;\n    }\n    return res;\n}\nString expand(String s,int l,int r){\n    while(l>=0&&r<s.length()&&s.charAt(l)==s.charAt(r)){l--;r++;}\n    return s.substring(l+1,r);\n}`,
    cpp: `string longestPalindrome(string s){\n    string res="";\n    auto expand=[&](int l,int r){\n        while(l>=0&&r<s.size()&&s[l]==s[r]){l--;r++;}\n        return s.substr(l+1,r-l-1);\n    };\n    for(int i=0;i<s.size();i++){\n        string a=expand(i,i),b=expand(i,i+1);\n        if(a.size()>res.size())res=a;\n        if(b.size()>res.size())res=b;\n    }\n    return res;\n}`,
    js: `var longestPalindrome=function(s){\n    let res="";\n    const exp=(l,r)=>{while(l>=0&&r<s.length&&s[l]===s[r]){l--;r++;}return s.slice(l+1,r);};\n    for(let i=0;i<s.length;i++){\n        const a=exp(i,i),b=exp(i,i+1);\n        if(a.length>res.length)res=a;\n        if(b.length>res.length)res=b;\n    }\n    return res;\n};`,
  },
  {
    id: 20,
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    platform: "leetcode",
    slug: "valid-parentheses",
    desc: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    approach:
      "Use a stack. Push open brackets; on close bracket, check if top of stack matches.",
    complexity: "Time: O(n) · Space: O(n)",
    python: `def isValid(s):\n    stack=[]\n    pairs={')':'(',']':'[','}':'{'}\n    for c in s:\n        if c in pairs:\n            if not stack or stack[-1]!=pairs[c]: return False\n            stack.pop()\n        else: stack.append(c)\n    return not stack`,
    java: `public boolean isValid(String s){\n    Deque<Character> st=new ArrayDeque<>();\n    for(char c:s.toCharArray()){\n        if(c=='('||c=='['||c=='{'){st.push(c);continue;}\n        if(st.isEmpty())return false;\n        char t=st.pop();\n        if(c==')'&&t!='(')return false;\n        if(c==']'&&t!='[')return false;\n        if(c=='}'&&t!='{')return false;\n    }\n    return st.isEmpty();\n}`,
    cpp: `bool isValid(string s){\n    stack<char> st;\n    for(char c:s){\n        if(c=='('||c=='['||c=='{'){st.push(c);continue;}\n        if(st.empty())return false;\n        char t=st.top();st.pop();\n        if(c==')'&&t!='(')return false;\n        if(c==']'&&t!='[')return false;\n        if(c=='}'&&t!='{')return false;\n    }\n    return st.empty();\n}`,
    js: `var isValid=function(s){\n    const st=[],p={')':'(',']':'[','}':'{'};\n    for(const c of s){\n        if('([{'.includes(c)){st.push(c);continue;}\n        if(!st.length||st.at(-1)!==p[c])return false;\n        st.pop();\n    }\n    return st.length===0;\n};`,
  },
  {
    id: 21,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked List",
    platform: "leetcode",
    slug: "merge-two-sorted-lists",
    desc: "Merge two sorted linked lists and return the head of the merged list.",
    approach:
      "Use a dummy head and compare nodes from both lists, linking the smaller one.",
    complexity: "Time: O(m+n) · Space: O(1)",
    python: `def mergeTwoLists(l1, l2):\n    dummy=ListNode()\n    cur=dummy\n    while l1 and l2:\n        if l1.val<=l2.val: cur.next=l1;l1=l1.next\n        else: cur.next=l2;l2=l2.next\n        cur=cur.next\n    cur.next=l1 or l2\n    return dummy.next`,
    java: `public ListNode mergeTwoLists(ListNode l1,ListNode l2){\n    ListNode dummy=new ListNode(0),cur=dummy;\n    while(l1!=null&&l2!=null){\n        if(l1.val<=l2.val){cur.next=l1;l1=l1.next;}\n        else{cur.next=l2;l2=l2.next;}\n        cur=cur.next;\n    }\n    cur.next=l1!=null?l1:l2;\n    return dummy.next;\n}`,
    cpp: `ListNode* mergeTwoLists(ListNode* l1,ListNode* l2){\n    ListNode *dummy=new ListNode(0),*cur=dummy;\n    while(l1&&l2){\n        if(l1->val<=l2->val){cur->next=l1;l1=l1->next;}\n        else{cur->next=l2;l2=l2->next;}\n        cur=cur->next;\n    }\n    cur->next=l1?l1:l2;\n    return dummy->next;\n}`,
    js: `var mergeTwoLists=function(l1,l2){\n    const dummy=new ListNode();\n    let cur=dummy;\n    while(l1&&l2){\n        if(l1.val<=l2.val){cur.next=l1;l1=l1.next;}\n        else{cur.next=l2;l2=l2.next;}\n        cur=cur.next;\n    }\n    cur.next=l1??l2;\n    return dummy.next;\n};`,
  },
  {
    id: 53,
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    platform: "leetcode",
    slug: "maximum-subarray",
    desc: "Find the contiguous subarray with the largest sum (Kadane's Algorithm).",
    approach:
      "Kadane's: keep a running max. At each step, either extend current subarray or start fresh.",
    complexity: "Time: O(n) · Space: O(1)",
    python: `def maxSubArray(nums):\n    cur=res=nums[0]\n    for n in nums[1:]:\n        cur=max(n,cur+n)\n        res=max(res,cur)\n    return res`,
    java: `public int maxSubArray(int[] nums){\n    int cur=nums[0],res=nums[0];\n    for(int i=1;i<nums.length;i++){\n        cur=Math.max(nums[i],cur+nums[i]);\n        res=Math.max(res,cur);\n    }\n    return res;\n}`,
    cpp: `int maxSubArray(vector<int>& nums){\n    int cur=nums[0],res=nums[0];\n    for(int i=1;i<nums.size();i++){\n        cur=max(nums[i],cur+nums[i]);\n        res=max(res,cur);\n    }\n    return res;\n}`,
    js: `var maxSubArray=function(nums){\n    let cur=nums[0],res=nums[0];\n    for(let i=1;i<nums.length;i++){\n        cur=Math.max(nums[i],cur+nums[i]);\n        res=Math.max(res,cur);\n    }\n    return res;\n};`,
  },
  {
    id: 70,
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "Dynamic Programming",
    platform: "leetcode",
    slug: "climbing-stairs",
    desc: "You can climb 1 or 2 steps. How many distinct ways to reach the top (n steps)?",
    approach:
      "Fibonacci pattern. dp[i] = dp[i-1] + dp[i-2]. Optimise to O(1) space.",
    complexity: "Time: O(n) · Space: O(1)",
    python: `def climbStairs(n):\n    a,b=1,1\n    for _ in range(n-1): a,b=b,a+b\n    return b`,
    java: `public int climbStairs(int n){\n    int a=1,b=1;\n    for(int i=1;i<n;i++){int t=b;b=a+b;a=t;}\n    return b;\n}`,
    cpp: `int climbStairs(int n){\n    int a=1,b=1;\n    for(int i=1;i<n;i++){int t=b;b=a+b;a=t;}\n    return b;\n}`,
    js: `var climbStairs=function(n){\n    let [a,b]=[1,1];\n    for(let i=1;i<n;i++)[a,b]=[b,a+b];\n    return b;\n};`,
  },
  {
    id: 121,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topic: "Array",
    platform: "leetcode",
    slug: "best-time-to-buy-and-sell-stock",
    desc: "Find the maximum profit from buying and selling a stock once.",
    approach:
      "Track minimum price seen so far. At each price, compute profit and update max.",
    complexity: "Time: O(n) · Space: O(1)",
    python: `def maxProfit(prices):\n    minP,maxP=float('inf'),0\n    for p in prices:\n        minP=min(minP,p)\n        maxP=max(maxP,p-minP)\n    return maxP`,
    java: `public int maxProfit(int[] p){\n    int min=Integer.MAX_VALUE,max=0;\n    for(int x:p){min=Math.min(min,x);max=Math.max(max,x-min);}\n    return max;\n}`,
    cpp: `int maxProfit(vector<int>& p){\n    int mn=INT_MAX,mx=0;\n    for(int x:p){mn=min(mn,x);mx=max(mx,x-mn);}\n    return mx;\n}`,
    js: `var maxProfit=function(p){\n    let mn=Infinity,mx=0;\n    for(const x of p){mn=Math.min(mn,x);mx=Math.max(mx,x-mn);}\n    return mx;\n};`,
  },
  {
    id: 200,
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graph",
    platform: "leetcode",
    slug: "number-of-islands",
    desc: "Count the number of islands in a 2D grid ('1' = land, '0' = water).",
    approach:
      "BFS/DFS from each unvisited '1'. Mark all connected land as visited.",
    complexity: "Time: O(m×n) · Space: O(m×n)",
    python: `def numIslands(grid):\n    def dfs(r,c):\n        if r<0 or r>=len(grid) or c<0 or c>=len(grid[0]) or grid[r][c]!='1': return\n        grid[r][c]='0'\n        for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)]: dfs(r+dr,c+dc)\n    count=0\n    for r in range(len(grid)):\n        for c in range(len(grid[0])):\n            if grid[r][c]=='1': dfs(r,c);count+=1\n    return count`,
    java: `public int numIslands(char[][] g){\n    int c=0;\n    for(int i=0;i<g.length;i++)for(int j=0;j<g[0].length;j++)if(g[i][j]=='1'){dfs(g,i,j);c++;}\n    return c;\n}\nvoid dfs(char[][]g,int r,int c){\n    if(r<0||r>=g.length||c<0||c>=g[0].length||g[r][c]!='1')return;\n    g[r][c]='0';\n    dfs(g,r+1,c);dfs(g,r-1,c);dfs(g,r,c+1);dfs(g,r,c-1);\n}`,
    cpp: `void dfs(vector<vector<char>>&g,int r,int c){\n    if(r<0||r>=g.size()||c<0||c>=g[0].size()||g[r][c]!='1')return;\n    g[r][c]='0';\n    dfs(g,r+1,c);dfs(g,r-1,c);dfs(g,r,c+1);dfs(g,r,c-1);\n}\nint numIslands(vector<vector<char>>& g){\n    int cnt=0;\n    for(int i=0;i<g.size();i++)for(int j=0;j<g[0].size();j++)if(g[i][j]=='1'){dfs(g,i,j);cnt++;}\n    return cnt;\n}`,
    js: `var numIslands=function(g){\n    const dfs=(r,c)=>{\n        if(r<0||r>=g.length||c<0||c>=g[0].length||g[r][c]!=='1')return;\n        g[r][c]='0';\n        dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);\n    };\n    let cnt=0;\n    for(let i=0;i<g.length;i++)for(let j=0;j<g[0].length;j++)if(g[i][j]==='1'){dfs(i,j);cnt++;}\n    return cnt;\n};`,
  },
  {
    id: 206,
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked List",
    platform: "leetcode",
    slug: "reverse-linked-list",
    desc: "Reverse a singly linked list.",
    approach:
      "Iterative: use prev/curr pointers. Or recursive: reverse from tail back.",
    complexity: "Time: O(n) · Space: O(1)",
    python: `def reverseList(head):\n    prev=None\n    while head:\n        nxt=head.next\n        head.next=prev\n        prev=head\n        head=nxt\n    return prev`,
    java: `public ListNode reverseList(ListNode head){\n    ListNode prev=null;\n    while(head!=null){ListNode nxt=head.next;head.next=prev;prev=head;head=nxt;}\n    return prev;\n}`,
    cpp: `ListNode* reverseList(ListNode* head){\n    ListNode* prev=nullptr;\n    while(head){ListNode* nxt=head->next;head->next=prev;prev=head;head=nxt;}\n    return prev;\n}`,
    js: `var reverseList=function(head){\n    let prev=null;\n    while(head){const nxt=head.next;head.next=prev;prev=head;head=nxt;}\n    return prev;\n};`,
  },
  {
    id: 300,
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    platform: "leetcode",
    slug: "longest-increasing-subsequence",
    desc: "Return the length of the longest strictly increasing subsequence.",
    approach:
      "Patience sorting / binary search: maintain a tails array. For each num, binary search for insertion position.",
    complexity: "Time: O(n log n) · Space: O(n)",
    python: `import bisect\ndef lengthOfLIS(nums):\n    tails=[]\n    for n in nums:\n        pos=bisect.bisect_left(tails,n)\n        if pos==len(tails): tails.append(n)\n        else: tails[pos]=n\n    return len(tails)`,
    java: `public int lengthOfLIS(int[] nums){\n    List<Integer> tails=new ArrayList<>();\n    for(int n:nums){\n        int lo=0,hi=tails.size();\n        while(lo<hi){int mid=(lo+hi)/2;if(tails.get(mid)<n)lo=mid+1;else hi=mid;}\n        if(lo==tails.size())tails.add(n);else tails.set(lo,n);\n    }\n    return tails.size();\n}`,
    cpp: `int lengthOfLIS(vector<int>& nums){\n    vector<int> tails;\n    for(int n:nums){\n        auto it=lower_bound(tails.begin(),tails.end(),n);\n        if(it==tails.end())tails.push_back(n);\n        else *it=n;\n    }\n    return tails.size();\n}`,
    js: `var lengthOfLIS=function(nums){\n    const tails=[];\n    for(const n of nums){\n        let lo=0,hi=tails.length;\n        while(lo<hi){const mid=(lo+hi)>>1;tails[mid]<n?lo=mid+1:hi=mid;}\n        tails[lo]=n;\n    }\n    return tails.length;\n};`,
  },
  // GFG Problems
  {
    id: 1001,
    title: "Detect Cycle in Linked List",
    difficulty: "Medium",
    topic: "Linked List",
    platform: "gfg",
    slug: "detect-loop-in-linked-list",
    desc: "Detect if a linked list contains a cycle using Floyd's Tortoise and Hare algorithm.",
    approach:
      "Use two pointers: slow moves 1 step, fast moves 2 steps. If they meet, cycle exists.",
    complexity: "Time: O(n) · Space: O(1)",
    python: `def hasCycle(head):\n    slow=fast=head\n    while fast and fast.next:\n        slow=slow.next; fast=fast.next.next\n        if slow==fast: return True\n    return False`,
    java: `public boolean hasCycle(ListNode head){\n    ListNode slow=head,fast=head;\n    while(fast!=null&&fast.next!=null){\n        slow=slow.next;fast=fast.next.next;\n        if(slow==fast)return true;\n    }\n    return false;\n}`,
    cpp: `bool hasCycle(ListNode *head){\n    ListNode *slow=head,*fast=head;\n    while(fast&&fast->next){slow=slow->next;fast=fast->next->next;if(slow==fast)return true;}\n    return false;\n}`,
    js: `var hasCycle=function(head){\n    let s=head,f=head;\n    while(f&&f.next){s=s.next;f=f.next.next;if(s===f)return true;}\n    return false;\n};`,
  },
  {
    id: 1002,
    title: "N-Queens Problem",
    difficulty: "Hard",
    topic: "Backtracking",
    platform: "gfg",
    slug: "n-queen-problem",
    desc: "Place N queens on an N×N chessboard such that no two queens attack each other.",
    approach:
      "Backtracking: place queen in each row, check column + diagonal conflicts, recurse.",
    complexity: "Time: O(N!) · Space: O(N)",
    python: `def solveNQueens(n):\n    res=[]\n    def bt(row,cols,d1,d2,board):\n        if row==n: res.append([''.join(r) for r in board]);return\n        for c in range(n):\n            if c in cols or row-c in d1 or row+c in d2: continue\n            board[row][c]='Q'\n            bt(row+1,cols|{c},d1|{row-c},d2|{row+c},board)\n            board[row][c]='.'\n    bt(0,set(),set(),set(),[['.']*n for _ in range(n)])\n    return res`,
    java: `// Standard backtracking – see GFG editorial for full Java impl.`,
    cpp: `// Standard backtracking – see GFG editorial for full C++ impl.`,
    js: `// Standard backtracking – see GFG editorial for full JS impl.`,
  },
  {
    id: 1003,
    title: "Kadane's Algorithm",
    difficulty: "Easy",
    topic: "Array",
    platform: "gfg",
    slug: "kadanes-algorithm",
    desc: "Find the maximum sum of a contiguous subarray.",
    approach: "Running max: extend or restart subarray at each element.",
    complexity: "Time: O(n) · Space: O(1)",
    python: `def maxSubarraySum(arr):\n    cur=res=arr[0]\n    for n in arr[1:]:\n        cur=max(n,cur+n)\n        res=max(res,cur)\n    return res`,
    java: `int maxSubarraySum(int[] arr){\n    int cur=arr[0],res=arr[0];\n    for(int i=1;i<arr.length;i++){cur=Math.max(arr[i],cur+arr[i]);res=Math.max(res,cur);}\n    return res;\n}`,
    cpp: `int maxSubarraySum(vector<int>&a){\n    int cur=a[0],res=a[0];\n    for(int i=1;i<a.size();i++){cur=max(a[i],cur+a[i]);res=max(res,cur);}\n    return res;\n}`,
    js: `function maxSubarraySum(arr){\n    let cur=arr[0],res=arr[0];\n    for(let i=1;i<arr.length;i++){cur=Math.max(arr[i],cur+arr[i]);res=Math.max(res,cur);}\n    return res;\n}`,
  },
];
