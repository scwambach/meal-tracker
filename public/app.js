import { weekBudget } from "./budget.js";

const ICONS = {
  flame: '<path d="M12 3c.5 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .2 2 1 3 2.2 3.3C11.2 8.5 11 6 12 3z"/>',
  protein: '<path d="M6.5 7v10M17.5 7v10M3.5 10v4M20.5 10v4M6.5 12h11"/>',
  carbs: '<path d="M12 21V10"/><path d="M12 10c-2.8 0-4.5-1.8-4.5-5 2.8 0 4.5 1.8 4.5 5zm0 0c2.8 0 4.5-1.8 4.5-5-2.8 0-4.5 1.8-4.5 5z"/><path d="M12 16c-2.8 0-4.5-1.8-4.5-5M12 16c2.8 0 4.5-1.8 4.5-5"/>',
  fat: '<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/>',
  fiber: '<path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14z"/><path d="M5 19l7-7"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  today: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  history: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8" fill="currentColor"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  note: '<path d="M5 4h14v16H5z"/><path d="M9 9h6M9 13h6M9 17h3"/>',
  week: '<path d="M4 20V10M9 20V6M14 20v-8M19 20V4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  scale: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8.5 9a5 5 0 0 1 7 0"/><path d="M12 9.5l1.2-1.7"/>',
  trash: '<path d="M4.5 7h15M10 11v6M14 11v6M6.5 7l1 12.5h9l1-12.5M9.5 7V4.5h5V7"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
};
const icon = (name) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

const MEAL_TYPES = {
  breakfast: { emoji: "🍳", label: "Breakfast" },
  lunch: { emoji: "🥗", label: "Lunch" },
  dinner: { emoji: "🍝", label: "Dinner" },
  snack: { emoji: "🍎", label: "Snack" },
  drink: { emoji: "🥤", label: "Drink" },
};
const typeOf = (m) => MEAL_TYPES[m.meal_type] ?? { emoji: "🍽️", label: m.meal_type };

const WORKOUT_TYPES = {
  run: { emoji: "🏃", label: "Run", bg: "#ffd0c2" },
  walk: { emoji: "🚶", label: "Walk", bg: "#c9f7d4" },
  hike: { emoji: "🥾", label: "Hike", bg: "#e8dcc4" },
  cycle: { emoji: "🚴", label: "Ride", bg: "#c7ecff" },
  swim: { emoji: "🏊", label: "Swim", bg: "#c7ecff" },
  strength: { emoji: "🏋️", label: "Strength", bg: "#e5dbff" },
  hiit: { emoji: "⚡", label: "HIIT", bg: "#ffe7a3" },
  yoga: { emoji: "🧘", label: "Yoga", bg: "#ffd6ec" },
  sports: { emoji: "⛹️", label: "Sports", bg: "#ffe7a3" },
  cardio: { emoji: "❤️", label: "Cardio", bg: "#ffd6ec" },
  other: { emoji: "💪", label: "Workout", bg: "#e5dbff" },
};
const workoutType = (w) => WORKOUT_TYPES[w.type] ?? WORKOUT_TYPES.other;
const INTENSITY = { light: "Light", moderate: "Moderate", hard: "Hard" };
const fmtDuration = (min) => {
  const m = r(min);
  return m >= 60 ? `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`;
};

const MACROS = [
  { key: "protein_g", label: "Protein", icon: "protein", color: "var(--protein)" },
  { key: "carbs_g", label: "Carbs", icon: "carbs", color: "var(--carbs)" },
  { key: "fat_g", label: "Fat", icon: "fat", color: "var(--fat)" },
];
const FIBER = { key: "fiber_g", label: "Fiber", icon: "fiber", color: "var(--fiber)" };
const KCAL_PER_G = { protein_g: 4, carbs_g: 4, fat_g: 9 };

const PACE_UI = {
  maintain: { emoji: "⚖️", lb: 0 },
  mild: { emoji: "🐢", lb: 0.5 },
  moderate: { emoji: "🚶", lb: 1 },
  aggressive: { emoji: "🏃", lb: 1.5 },
  extreme: { emoji: "🔥", lb: 2 },
};
const ACTIVITY_UI = { sedentary: "🪑", light: "🚲", moderate: "🏋️", active: "⚡" };

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const r = (n) => Math.round(n ?? 0);
const n = (x) => r(x).toLocaleString();

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

// ---- dates (local calendar days as YYYY-MM-DD) ----
const pad = (x) => String(x).padStart(2, "0");
const isoDay = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDay = (s) => new Date(s + "T12:00:00");
const today = () => isoDay(new Date());
const shiftDay = (s, by) => {
  const d = parseDay(s);
  d.setDate(d.getDate() + by);
  return isoDay(d);
};
function dayLabel(s) {
  if (s === today()) return "Today";
  if (s === shiftDay(today(), -1)) return "Yesterday";
  const d = parseDay(s);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", ...(!sameYear && { year: "numeric" }) });
}
const fmtTime = (t) => (t ? new Date(`2000-01-01T${t}`).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "");
function weekDays(date) {
  const startDow = profile?.week_start === "sunday" ? 0 : 1;
  const back = (parseDay(date).getDay() - startDow + 7) % 7;
  const start = shiftDay(date, -back);
  return Array.from({ length: 7 }, (_, i) => shiftDay(start, i));
}

// ---- data ----
let meals = [];
let workouts = [];
let weights = [];
let profile = null;
let targets = null;
let options = null;
let loaded = false;

const byDay = () => {
  const map = new Map();
  for (const m of meals) (map.get(m.date) ?? map.set(m.date, []).get(m.date)).push(m);
  for (const list of map.values()) list.sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
  return map;
};
const sumTotals = (list) =>
  list.reduce(
    (t, m) => {
      for (const k of Object.keys(t)) t[k] += m.totals[k] ?? 0;
      return t;
    },
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0 },
  );

async function load() {
  try {
    const [mealsRes, profileRes, workoutsRes, weightsRes] = await Promise.all([
      fetch("/api/meals", { cache: "no-store" }),
      fetch("/api/profile", { cache: "no-store" }),
      fetch("/api/workouts", { cache: "no-store" }),
      fetch("/api/weights", { cache: "no-store" }),
    ]);
    if (!mealsRes.ok) throw new Error(`HTTP ${mealsRes.status}`);
    meals = (await mealsRes.json()).meals;
    if (profileRes.ok) ({ profile, targets, options } = await profileRes.json());
    if (workoutsRes.ok) workouts = (await workoutsRes.json()).workouts;
    if (weightsRes.ok) weights = (await weightsRes.json()).weights;
    loaded = true;
    render();
  } catch (e) {
    if (!loaded) app.innerHTML = emptyState("😵", `Couldn't load meals (${esc(e.message)}).`);
  }
}

// ---- units ----
const LB_PER_KG = 1 / 0.45359237;
const imperial = () => (profile?.units ?? "imperial") !== "metric";
const weightUnit = () => (imperial() ? "lb" : "kg");
/** kg -> number in the viewer's unit, to one decimal. */
const toUnit = (kg) => Math.round((imperial() ? kg * LB_PER_KG : kg) * 10) / 10;
const fromUnit = (v) => (imperial() ? v / LB_PER_KG : v);
const fmtWeight = (kg) => `${toUnit(kg).toFixed(1)} ${weightUnit()}`;

// ---- modal dialogs (confirm, passcode) ----
// Cancel is type="button" so pressing Enter submits the primary action instead of cancelling.
const modal = document.getElementById("modal");
modal.addEventListener("click", (e) => {
  if (e.target.closest("[data-cancel]") || e.target === modal) modal.close("cancel");
});

function confirmDialog({ title, body, confirm = "Delete" }) {
  return new Promise((resolve) => {
    modal.innerHTML = `<form method="dialog" class="modal-inner">
      <div class="modal-icon">${icon("trash")}</div>
      <h2>${esc(title)}</h2>
      <p>${esc(body)}</p>
      <div class="modal-actions">
        <button type="button" class="btn-secondary" data-cancel>Cancel</button>
        <button value="ok" class="btn-danger">${esc(confirm)}</button>
      </div>
    </form>`;
    modal.onclose = () => resolve(modal.returnValue === "ok");
    modal.returnValue = "";
    modal.showModal();
    modal.querySelector(".btn-secondary").focus();
  });
}

function passcodeDialog(message = "Enter your site passcode. You'll only be asked once on this device.") {
  return new Promise((resolve) => {
    modal.innerHTML = `<form method="dialog" class="modal-inner">
      <div class="modal-icon key">${icon("target")}</div>
      <h2>Passcode</h2>
      <p>${esc(message)}</p>
      <input class="modal-input" name="code" type="password" autocomplete="current-password" placeholder="••••">
      <div class="modal-actions">
        <button type="button" class="btn-secondary" data-cancel>Cancel</button>
        <button value="ok" class="btn-primary">Continue</button>
      </div>
    </form>`;
    const input = modal.querySelector("input");
    modal.onclose = () => resolve(modal.returnValue === "ok" && input.value ? input.value : null);
    modal.returnValue = "";
    modal.showModal();
    input.focus();
  });
}

/** fetch() with the site passcode, asking for it (again) when needed. Returns null if cancelled. */
async function authedFetch(url, options = {}) {
  let code = store.get("passcode") || (await passcodeDialog());
  for (let attempt = 0; code && attempt < 2; attempt++) {
    const res = await fetch(url, {
      ...options,
      headers: { "content-type": "application/json", ...options.headers, authorization: `Bearer ${code}` },
    });
    if (res.status !== 401) {
      if (res.ok) store.set("passcode", code);
      return res;
    }
    store.set("passcode", "");
    code = await passcodeDialog("That passcode didn't work. Try again.");
  }
  return null;
}

let toastTimer;
function toast(message, isError = false) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.className = `toast show ${isError ? "err" : ""}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.className = "toast"), 2600);
}

const COLLECTIONS = {
  meals: { label: "meal", get: () => meals, set: (v) => (meals = v) },
  workouts: { label: "workout", get: () => workouts, set: (v) => (workouts = v) },
  weights: { label: "weigh-in", get: () => weights, set: (v) => (weights = v) },
};

async function deleteRecord(kind, id) {
  const c = COLLECTIONS[kind];
  const record = c.get().find((x) => x.id === id);
  if (!record) return;
  const name = record.title ?? `${fmtWeight(record.weight_kg)} on ${dayLabel(record.date)}`;
  const ok = await confirmDialog({
    title: `Delete this ${c.label}?`,
    body: `“${name}” will be removed for good. This can't be undone.`,
  });
  if (!ok) return;
  const res = await authedFetch(`/api/${kind}/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res) return;
  if (!res.ok && res.status !== 404) return toast(`Couldn't delete (HTTP ${res.status}).`, true);
  c.set(c.get().filter((x) => x.id !== id));
  if (sheet.open) sheet.close();
  toast(`Deleted ${c.label}`);
  // Deleting a weigh-in can change the profile weight (and so the targets).
  if (kind === "weights") await load();
  else render();
}

const deleteButton = (kind, id) =>
  `<button class="btn-delete" data-delete="${kind}" data-id="${esc(id)}">${icon("trash")} Delete ${COLLECTIONS[kind].label}</button>`;

// ---- shared bits ----
const app = document.getElementById("app");
const emptyState = (emoji, text) => `<div class="empty"><div class="big">${emoji}</div><p>${text}</p></div>`;

function ring(fraction, over) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const f = Math.max(0, Math.min(1, fraction));
  return `<svg class="ring" viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="${R}" class="ring-track"/>
    <circle cx="60" cy="60" r="${R}" class="ring-fill ${over ? "over" : ""}"
      stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - f)}" transform="rotate(-90 60 60)"/>
  </svg>`;
}

function splitBar(t) {
  const kcal = MACROS.map((m) => (t[m.key] ?? 0) * KCAL_PER_G[m.key]);
  const total = kcal.reduce((a, b) => a + b, 0);
  if (!total) return '<div class="split"></div>';
  return `<div class="split" role="img" aria-label="Calories by macro">${MACROS.map(
    (m, i) => `<span style="width:${(kcal[i] / total) * 100}%;background:${m.color}"></span>`,
  ).join("")}</div>`;
}

function chip(m, value, goal) {
  const pct = goal ? Math.min(100, (value / goal) * 100) : 0;
  return `<div class="chip">
    <div class="dot" style="background:${m.color}">${icon(m.icon)}</div>
    <div><b class="num">${r(value)}${goal ? `<em>/${r(goal)}g</em>` : "g"}</b><span>${m.label}</span></div>
    ${goal ? `<div class="mini"><span style="width:${pct}%;background:${m.color}"></span></div>` : ""}
  </div>`;
}

function mealCard(m) {
  const t = typeOf(m);
  const sub = [t.label, fmtTime(m.time)].filter(Boolean).join(" · ");
  return `<button class="meal" data-id="${esc(m.id)}">
    <div class="tile" style="background:var(--${esc(m.meal_type)}, var(--snack))">${t.emoji}</div>
    <div class="meal-body">
      <div class="meal-title">${esc(m.title)}</div>
      <div class="meal-sub">${esc(sub)}${m.confidence === "low" ? ' · <span class="flag">rough guess</span>' : ""}</div>
    </div>
    <div class="meal-kcal num">${n(m.totals.calories)}<small>kcal</small></div>
  </button>`;
}

// ---- Today / day view ----
function dayHero(t, date, wk) {
  if (!targets) {
    return `<section class="hero">
      <div class="hero-label">${icon("flame")} Eaten</div>
      <div class="hero-kcal num">${n(t.calories)}<small>kcal</small></div>
      ${splitBar(t)}
    </section>
    <a class="cta" href="#/goals">${icon("target")}<span><b>Set your goals</b><br>See how many calories you have left</span>${icon("right")}</a>`;
  }
  const dayName = date === today() ? "Today" : parseDay(date).toLocaleDateString(undefined, { weekday: "long" });
  const banked = wk.adjusted - targets.daily_calories;
  return `<section class="hero hero-rings">
    ${ringStat(icon("flame") + " " + dayName, t.calories, targets.daily_calories)}
    ${ringStat(
      icon("week") + " Adjusted",
      t.calories,
      wk.adjusted,
      `<div class="banked num ${banked < 0 ? "under" : ""}">${banked < 0 ? "−" : "+"}${n(Math.abs(banked))} ${banked < 0 ? "below goal" : "banked"}</div>`,
    )}
    ${weekBand(wk)}
  </section>`;
}

function ringStat(label, eaten, goal, extra = "") {
  const left = goal - eaten;
  const over = left < 0;
  return `<div class="ring-stat">
    <div class="ring-stat-label">${label}</div>
    <div class="ring-wrap">
      ${ring(goal > 0 ? eaten / goal : 1, over)}
      <div class="ring-center">
        <div class="ring-num num">${n(Math.abs(left))}</div>
        <div class="ring-label">${over ? "over" : "left"}</div>
      </div>
    </div>
    <div class="ring-sub num"><b>${n(eaten)}</b> of ${n(goal)}</div>
    ${extra}
  </div>`;
}

function weekBand(wk) {
  return `<div class="week-band">
    <div class="ring-stat-label">${icon("week")} This week</div>
    <div class="week-band-num num">${n(wk.total)}<small>of ${n(wk.goal)}</small></div>
    ${wk.earned ? `<div class="week-band-sub num">${icon("activity")} +${n(wk.earned)} from workouts</div>` : ""}
  </div>`;
}

function weekStats(date, days) {
  const week = weekDays(date);
  const eaten = week.map((d) => sumTotals(days.get(d) ?? []).calories);
  const total = eaten.reduce((a, b) => a + b, 0);
  // Workouts up to and including this day add a share of their burn to the week.
  const burned = workouts.filter((w) => week.includes(w.date) && w.date <= date).reduce((a, w) => a + w.calories_burned, 0);
  const { earned, goal, adjusted } = weekBudget({
    weekly: targets?.weekly_calories ?? 0,
    burned,
    eatenBefore: week.reduce((a, d, i) => a + (d < date ? eaten[i] : 0), 0),
    daysLeft: week.filter((d) => d >= date).length,
  });
  return { week, eaten, total, goal, earned, adjusted: targets ? adjusted : 0 };
}

function weekCard(date, wk) {
  if (!targets) return "";
  const { week, eaten } = wk;
  const max = Math.max(targets.daily_calories * 1.25, ...eaten);

  return `<section class="card week">
    <div class="bars">${week
      .map((d, i) => {
        const h = (eaten[i] / max) * 100;
        const cls = [d === date && "sel", d > today() && "future", eaten[i] > targets.daily_calories && "over"].filter(Boolean).join(" ");
        return `<button class="bar-col ${cls}" data-go="${d}" ${d > today() ? "disabled" : ""} aria-label="${esc(dayLabel(d))}: ${r(eaten[i])} kcal">
          <div class="bar-track"><div class="goal-line" style="bottom:${(targets.daily_calories / max) * 100}%"></div>
            <span style="height:${h}%"></span></div>
          <small>${parseDay(d).toLocaleDateString(undefined, { weekday: "narrow" })}</small>
        </button>`;
      })
      .join("")}</div>
  </section>`;
}

function dayView(date) {
  const days = byDay();
  const list = days.get(date) ?? [];
  const t = sumTotals(list);
  const isToday = date === today();
  const wk = weekStats(date, days);
  app.innerHTML = `
    <header class="topbar">
      <button class="icon-btn" data-go="${shiftDay(date, -1)}" aria-label="Previous day">${icon("left")}</button>
      <h1>${esc(dayLabel(date))}</h1>
      <button class="icon-btn" data-go="${shiftDay(date, 1)}" aria-label="Next day" ${isToday ? "disabled" : ""}>${icon("right")}</button>
    </header>
    ${dayHero(t, date, wk)}
    <div class="chips">${MACROS.map((m) => chip(m, t[m.key], targets?.[m.key])).join("")}</div>
    ${weekCard(date, wk)}
    <div class="section-title">${list.length ? `${list.length} meal${list.length === 1 ? "" : "s"}` : "Meals"}</div>
    ${
      list.length
        ? `<div class="meals">${list.map(mealCard).join("")}</div>`
        : emptyState(isToday ? "📸" : "🍽️", isToday ? "Nothing yet. Send Claude a photo of your meal." : "Nothing logged this day.")
    }`;
}

// ---- Workouts ----
// A quarter of burned calories (EAT_BACK in budget.js) is added to the weekly food allotment; the daily goal never changes.
function workoutCard(w) {
  const t = workoutType(w);
  const sub = [fmtDuration(w.duration_min), INTENSITY[w.intensity], w.distance].filter(Boolean).join(" · ");
  return `<button class="meal" data-workout="${esc(w.id)}">
    <div class="tile" style="background:${t.bg}">${t.emoji}</div>
    <div class="meal-body">
      <div class="meal-title">${esc(w.title)}</div>
      <div class="meal-sub">${esc(sub)}${w.confidence === "low" ? ' · <span class="flag">rough guess</span>' : ""}</div>
    </div>
    <div class="meal-kcal burn num">${n(w.calories_burned)}<small>kcal</small></div>
  </button>`;
}

function workoutsView() {
  const week = weekDays(today());
  const byDate = new Map();
  for (const w of workouts) (byDate.get(w.date) ?? byDate.set(w.date, []).get(w.date)).push(w);
  const burned = week.map((d) => (byDate.get(d) ?? []).reduce((a, w) => a + w.calories_burned, 0));
  const weekList = workouts.filter((w) => week.includes(w.date));
  const weekTotal = burned.reduce((a, b) => a + b, 0);
  const weekMin = weekList.reduce((a, w) => a + w.duration_min, 0);
  const max = Math.max(1, ...burned);
  const days = [...byDate].sort(([a], [b]) => b.localeCompare(a));

  app.innerHTML = `
    <header class="topbar"><h1>Workouts</h1></header>
    <section class="hero hero-burn">
      <div class="hero-label">${icon("activity")} Burned this week</div>
      <div class="hero-kcal num">${n(weekTotal)}<small>kcal</small></div>
      <div class="hero-sub">${weekList.length} workout${weekList.length === 1 ? "" : "s"} · ${fmtDuration(weekMin)}</div>
      <div class="burn-bars">${week
        .map(
          (d, i) => `<div class="burn-col ${d === today() ? "sel" : ""} ${d > today() ? "future" : ""}">
            <div class="burn-track"><span style="height:${(burned[i] / max) * 100}%"></span></div>
            <small>${parseDay(d).toLocaleDateString(undefined, { weekday: "narrow" })}</small>
          </div>`,
        )
        .join("")}</div>
    </section>
    <p class="fine-note">${icon("bulb")}<span>A quarter of what you burn is added to your weekly calories. Your daily goal stays the same.</span></p>
    ${
      days.length
        ? days
            .map(([date, list]) => {
              const total = list.reduce((a, w) => a + w.calories_burned, 0);
              return `<div class="section-title day-head"><span>${esc(dayLabel(date))}</span><span class="num">${n(total)} kcal</span></div>
                <div class="meals">${list.map(workoutCard).join("")}</div>`;
            })
            .join("")
        : emptyState("💪", "No workouts yet. Tell Claude what you did and it'll estimate the burn.")
    }`;
}

function openWorkout(id) {
  const w = workouts.find((x) => x.id === id);
  if (!w) return;
  const t = workoutType(w);
  const conf = { low: "Rough guess", medium: "Good estimate", high: "Confident" }[w.confidence] ?? w.confidence;
  const perMin = w.duration_min ? r(w.calories_burned / w.duration_min) : 0;
  const stat = (ic, value, label) =>
    `<div class="chip"><div class="dot" style="background:var(--fiber)">${icon(ic)}</div><div><b class="num">${esc(value)}</b><span>${label}</span></div></div>`;
  sheet.innerHTML = `<div class="sheet-inner">
    <div class="grabber"></div>
    <div class="sheet-head">
      <div class="tile" style="background:${t.bg}">${t.emoji}</div>
      <div>
        <h2>${esc(w.title)}</h2>
        <div class="meal-sub">${esc([t.label, dayLabel(w.date), fmtTime(w.time)].filter(Boolean).join(" · "))}</div>
      </div>
      <button class="sheet-close" data-close aria-label="Close">${icon("close")}</button>
    </div>

    <section class="hero hero-burn" style="margin-top:18px">
      <div class="hero-label">${icon("activity")} Burned <span class="badge ${esc(w.confidence)}" style="margin-left:auto">${esc(conf)}</span></div>
      <div class="hero-kcal num">${n(w.calories_burned)}<small>kcal</small></div>
      <div class="hero-sub">About ${perMin} kcal a minute</div>
    </section>
    <div class="chips">
      ${stat("clock", fmtDuration(w.duration_min), "Duration")}
      ${stat("flame", INTENSITY[w.intensity] ?? w.intensity, "Intensity")}
      ${stat("activity", w.distance || "—", "Distance")}
    </div>

    ${
      w.assumptions?.length
        ? `<div class="section-title">Notes from Claude</div>
           <div class="callout"><h3 style="color:var(--carbs)">${icon("bulb")} Assumptions</h3>
           <ul>${w.assumptions.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>`
        : ""
    }
    ${w.notes ? `<div class="callout" ${w.assumptions?.length ? "" : 'style="margin-top:22px"'}><h3 style="color:var(--fat)">${icon("note")} Note</h3><p>${esc(w.notes)}</p></div>` : ""}
    ${deleteButton("workouts", w.id)}
  </div>`;
  sheet.showModal();
  sheet.querySelector(".sheet-inner").scrollTop = 0;
}

// ---- Weight ----
const RANGES = { "1m": ["1M", 30], "3m": ["3M", 91], "1y": ["1Y", 365], all: ["All", Infinity] };
let weightRange = store.get("weightRange") || "3m";

/** One point per day (the latest weigh-in that day), oldest first. */
function dailyWeights() {
  const byDate = new Map();
  for (const w of [...weights].reverse()) byDate.set(w.date, w); // list is newest first
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

const shortDate = (d) => parseDay(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });

function changeBadge(deltaKg, label) {
  const d = toUnit(Math.abs(deltaKg));
  if (Math.abs(deltaKg) < 0.02) return `<span class="delta">± 0 ${weightUnit()} ${esc(label)}</span>`;
  const dir = deltaKg < 0 ? "down" : "up";
  return `<span class="delta">${icon(dir)}${d.toFixed(1)} ${weightUnit()} ${esc(label)}</span>`;
}

function weightView() {
  const pts = dailyWeights();
  const latest = pts.at(-1);
  const first = pts[0];
  const monthAgo = shiftDay(today(), -30);
  const base30 = [...pts].reverse().find((p) => p.date <= monthAgo) ?? first;
  const unit = weightUnit();

  app.innerHTML = `
    <header class="topbar"><h1>Weight</h1></header>
    ${
      latest
        ? `<section class="hero hero-weight">
            <div class="hero-label">${icon("scale")} Current weight</div>
            <div class="hero-kcal num">${toUnit(latest.weight_kg).toFixed(1)}<small>${unit}</small></div>
            <div class="hero-deltas">
              ${pts.length > 1 ? changeBadge(latest.weight_kg - first.weight_kg, `since ${shortDate(first.date)}`) : ""}
              ${pts.length > 1 && base30 !== first ? changeBadge(latest.weight_kg - base30.weight_kg, "in 30 days") : ""}
            </div>
          </section>
          <section class="card chart-card">
            <div class="chart-head">
              <div class="readout" id="readout" aria-live="polite"></div>
              ${seg("range", weightRange, Object.entries(RANGES).map(([k, [label]]) => [k, label]))}
            </div>
            <div class="chart" id="wchart"></div>
          </section>`
        : ""
    }

    <form class="card log-weight" id="log-weight" novalidate>
      <div class="log-title">${icon("scale")} Log a weigh-in</div>
      <div class="log-row">
        <label class="field"><span>Weight</span><div class="pair">
          <input name="weight" type="number" inputmode="decimal" step="any" min="1"
            placeholder="${latest ? toUnit(latest.weight_kg).toFixed(1) : imperial() ? "185.5" : "84.2"}" required><em>${unit}</em></div></label>
        <label class="field"><span>Date</span><input name="date" type="date" value="${today()}" max="${today()}"></label>
      </div>
      <button class="save" type="submit">${icon("check")} Save weigh-in</button>
    </form>

    <div class="section-title">${weights.length ? `${weights.length} weigh-in${weights.length === 1 ? "" : "s"}` : "Weigh-ins"}</div>
    ${
      weights.length
        ? `<div class="weigh-list card">${weights
            .map((w, i) => {
              const prev = weights[i + 1];
              const diff = prev ? toUnit(w.weight_kg) - toUnit(prev.weight_kg) : null;
              return `<div class="weigh-row">
                <div class="when"><b>${esc(dayLabel(w.date))}</b>${w.note ? `<span>${esc(w.note)}</span>` : ""}</div>
                <div class="right">
                  <div class="w num">${toUnit(w.weight_kg).toFixed(1)} <small>${unit}</small></div>
                  ${diff !== null ? `<div class="wdiff num">${diff > 0 ? "+" : diff < 0 ? "−" : "±"}${Math.abs(diff).toFixed(1)}</div>` : ""}
                </div>
                <button class="row-delete" data-delete="weights" data-id="${esc(w.id)}" aria-label="Delete weigh-in from ${esc(dayLabel(w.date))}">${icon("trash")}</button>
              </div>`;
            })
            .join("")}</div>`
        : emptyState("⚖️", "No weigh-ins yet. Log one above, or tell Claude your weight.")
    }`;

  if (latest) drawWeightChart();
  const form = document.getElementById("log-weight");
  form.addEventListener("submit", saveWeight);
  app.querySelectorAll('input[name="range"]').forEach((el) =>
    el.addEventListener("change", () => {
      weightRange = el.value;
      store.set("weightRange", weightRange);
      drawWeightChart();
    }),
  );
}

function drawWeightChart() {
  const el = document.getElementById("wchart");
  const readout = document.getElementById("readout");
  if (!el) return;
  const days = RANGES[weightRange]?.[1] ?? 91;
  const cutoff = days === Infinity ? "" : shiftDay(today(), -days);
  const all = dailyWeights();
  let pts = all.filter((p) => p.date >= cutoff);
  if (!pts.length) pts = all.slice(-1);

  const unit = weightUnit();
  const vals = pts.map((p) => toUnit(p.weight_kg));
  const W = Math.max(240, el.clientWidth);
  const H = 190;
  const pad = { l: 40, r: 10, t: 12, b: 24 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  // y domain: data range padded, at least 2 units tall, on whole numbers
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  const span = Math.max(hi - lo, 2);
  lo = Math.floor(lo - span * 0.15);
  hi = Math.ceil(hi + span * 0.15);
  const ticks = [lo, Math.round((lo + hi) / 2), hi];

  const t0 = parseDay(pts[0].date).getTime();
  const t1 = parseDay(pts.at(-1).date).getTime();
  const x = (p) => pad.l + (t1 === t0 ? iw / 2 : ((parseDay(p.date).getTime() - t0) / (t1 - t0)) * iw);
  const y = (v) => pad.t + (1 - (v - lo) / (hi - lo)) * ih;
  const xy = pts.map((p, i) => [x(p), y(vals[i])]);

  const line = xy.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)},${b.toFixed(1)}`).join("");
  const area = pts.length > 1 ? `${line}L${xy.at(-1)[0].toFixed(1)},${pad.t + ih}L${xy[0][0].toFixed(1)},${pad.t + ih}Z` : "";
  const showDots = pts.length <= 40;
  const xLabels = pts.length > 1 ? [[pad.l, pts[0].date, "start"], [W - pad.r, pts.at(-1).date, "end"]] : [[xy[0][0], pts[0].date, "middle"]];

  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"
      aria-label="Weight over time, ${vals[0]} to ${vals.at(-1)} ${unit}">
    ${ticks
      .map(
        (t) => `<line class="grid" x1="${pad.l}" x2="${W - pad.r}" y1="${y(t)}" y2="${y(t)}"/>
        <text class="axis" x="${pad.l - 8}" y="${y(t) + 4}" text-anchor="end">${t}</text>`,
      )
      .join("")}
    ${xLabels.map(([lx, d, anchor]) => `<text class="axis" x="${lx}" y="${H - 6}" text-anchor="${anchor}">${esc(shortDate(d))}</text>`).join("")}
    ${area ? `<path class="w-area" d="${area}"/>` : ""}
    ${pts.length > 1 ? `<path class="w-line" d="${line}"/>` : ""}
    ${xy
      .map(([a, b], i) => (showDots || i === xy.length - 1 ? `<circle class="w-dot" cx="${a}" cy="${b}" r="4"/>` : ""))
      .join("")}
    <line class="crosshair" id="xhair" y1="${pad.t}" y2="${pad.t + ih}" visibility="hidden"/>
    <circle class="w-dot hover" id="xdot" r="6" visibility="hidden"/>
    <rect class="hit" x="${pad.l - 10}" y="0" width="${iw + 20}" height="${H}"/>
  </svg>
  ${pts.length === 1 ? `<p class="chart-note">Log more weigh-ins to see your trend.</p>` : ""}`;

  const svg = el.querySelector("svg");
  const xhair = svg.querySelector("#xhair");
  const xdot = svg.querySelector("#xdot");

  const show = (i, active) => {
    const p = pts[i];
    const fromStart = vals[i] - vals[0];
    readout.innerHTML = `<b class="num">${vals[i].toFixed(1)}</b> <small>${unit}</small>
      <span>${esc(dayLabel(p.date))}${i > 0 ? ` · ${fromStart > 0 ? "+" : fromStart < 0 ? "−" : "±"}${Math.abs(fromStart).toFixed(1)} vs ${esc(shortDate(pts[0].date))}` : ""}</span>`;
    for (const [elx, vis] of [[xhair, active], [xdot, active]]) elx.setAttribute("visibility", vis ? "visible" : "hidden");
    if (active) {
      xhair.setAttribute("x1", xy[i][0]);
      xhair.setAttribute("x2", xy[i][0]);
      xdot.setAttribute("cx", xy[i][0]);
      xdot.setAttribute("cy", xy[i][1]);
    }
  };
  const nearest = (evt) => {
    const box = svg.getBoundingClientRect();
    const px = ((evt.clientX - box.left) / box.width) * W;
    let best = 0;
    for (let i = 1; i < xy.length; i++) if (Math.abs(xy[i][0] - px) < Math.abs(xy[best][0] - px)) best = i;
    return best;
  };
  svg.addEventListener("pointermove", (e) => show(nearest(e), true));
  svg.addEventListener("pointerdown", (e) => show(nearest(e), true));
  svg.addEventListener("pointerleave", () => show(pts.length - 1, false));
  show(pts.length - 1, false);
}

async function saveWeight(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const f = new FormData(form);
  const value = parseFloat(String(f.get("weight")).replace(",", "."));
  const date = f.get("date") || today();
  const kg = fromUnit(value);
  if (!(kg >= 30 && kg <= 350)) return toast(`Enter a weight in ${weightUnit()}, like ${imperial() ? "185.4" : "84.2"}.`, true);
  const btn = form.querySelector(".save");
  btn.disabled = true;
  try {
    const now = new Date();
    const res = await authedFetch("/api/weights", {
      method: "POST",
      body: JSON.stringify({
        date,
        weight_kg: kg,
        ...(date === today() && { time: `${pad(now.getHours())}:${pad(now.getMinutes())}` }),
      }),
    });
    if (!res) return;
    if (!res.ok) return toast(`Couldn't save (HTTP ${res.status}).`, true);
    toast(`Logged ${value.toFixed(1)} ${weightUnit()}`);
    await load(); // also picks up the profile weight, which follows the latest weigh-in
  } finally {
    btn.disabled = false;
  }
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => route().view === "weight" && drawWeightChart(), 150);
});

// ---- History ----
function historyView() {
  const days = [...byDay()].sort(([a], [b]) => b.localeCompare(a));
  const totals = days.map(([, list]) => sumTotals(list).calories);
  const scale = targets ? Math.max(targets.daily_calories, ...totals) : Math.max(1, ...totals);
  app.innerHTML = `
    <header class="topbar"><h1>History</h1></header>
    ${
      days.length
        ? `<div class="days">${days
            .map(([date, list], i) => {
              const emojis = [...new Set(list.map((m) => typeOf(m).emoji))].join("");
              const over = targets && totals[i] > targets.daily_calories;
              const diff = targets ? targets.daily_calories - totals[i] : null;
              return `<button class="day-row" data-go="${date}">
                <div class="when"><b>${esc(dayLabel(date))}</b><span class="emojis">${emojis}</span></div>
                <div class="right">
                  <div class="meal-kcal num">${n(totals[i])}<small>kcal</small></div>
                  ${diff !== null ? `<div class="diff ${over ? "over" : ""}">${over ? `${n(-diff)} over` : `${n(diff)} under`}</div>` : ""}
                  <div class="bar ${over ? "over" : ""}"><span style="width:${(totals[i] / scale) * 100}%"></span></div>
                </div>
              </button>`;
            })
            .join("")}</div>`
        : emptyState("🗓️", "No meals logged yet.")
    }`;
}

// ---- Goals ----
// Mirrors computeTargets() in netlify/lib/goals.ts so the preview updates as you type.
// The saved numbers always come from the server.
function previewTargets(p) {
  const act = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }[p.activity];
  const bmr = 10 * p.weight_kg + 6.25 * p.height_cm - 5 * p.age + (p.sex === "male" ? 5 : -161);
  const tdee = bmr * act;
  const minimum = p.sex === "male" ? 1500 : 1200;
  const wanted = tdee - (PACE_UI[p.pace].lb * 3500) / 7;
  const daily = Math.round(Math.max(wanted, minimum) / 10) * 10;
  const protein = Math.min(1.8 * p.weight_kg, (daily * 0.35) / 4);
  const fat = (daily * 0.28) / 9;
  return {
    tdee: r(tdee),
    daily_calories: daily,
    weekly_calories: daily * 7,
    protein_g: r(protein),
    fat_g: r(fat),
    carbs_g: r(Math.max(0, (daily - protein * 4 - fat * 9) / 4)),
    floored: wanted < minimum,
  };
}

let draft = null;

function seg(name, value, choices) {
  return `<div class="seg" role="radiogroup">${choices
    .map(([v, label]) => `<label><input type="radio" name="${name}" value="${v}" ${v === value ? "checked" : ""}><span>${label}</span></label>`)
    .join("")}</div>`;
}

function readDraft(form, units = new FormData(form).get("units")) {
  const f = new FormData(form);
  const num = (k) => parseFloat(f.get(k));
  const height_cm = units === "metric" ? num("cm") : ((num("ft") || 0) * 12 + (num("in") || 0)) * 2.54;
  const weight_kg = units === "metric" ? num("kg") : num("lb") * 0.45359237;
  return {
    units,
    sex: f.get("sex"),
    age: parseInt(f.get("age"), 10),
    height_cm: Math.round(height_cm * 10) / 10,
    weight_kg: Math.round(weight_kg * 1000) / 1000,
    activity: f.get("activity"),
    pace: f.get("pace"),
    week_start: f.get("week_start"),
  };
}

const validDraft = (p) =>
  p.sex && p.age >= 13 && p.age <= 110 && p.height_cm >= 100 && p.height_cm <= 250 && p.weight_kg >= 30 && p.weight_kg <= 350;

function goalsPreview(p) {
  if (!validDraft(p)) return `<div class="card preview muted">Fill in your details to see your targets.</div>`;
  const t = previewTargets(p);
  return `<div class="card preview">
    <div class="preview-main">
      <div><span>Daily goal</span><b class="num">${n(t.daily_calories)}</b><small>kcal</small></div>
      <div><span>Weekly goal</span><b class="num">${n(t.weekly_calories)}</b><small>kcal</small></div>
    </div>
    <div class="preview-macros">${MACROS.map(
      (m) => `<div><i style="background:${m.color}">${icon(m.icon)}</i><b class="num">${t[m.key]}g</b><span>${m.label}</span></div>`,
    ).join("")}</div>
    <p class="fine">You burn about ${n(t.tdee)} kcal a day.${
      t.floored ? " <b>This pace would go below a safe minimum, so the goal is set to the minimum instead.</b>" : ""
    }</p>
  </div>`;
}

function goalsView() {
  const p = draft ?? profile ?? { units: "imperial", sex: "", age: "", height_cm: "", weight_kg: "", activity: "light", pace: "moderate", week_start: "monday" };
  const imperial = p.units !== "metric";
  const totalIn = p.height_cm ? p.height_cm / 2.54 : null;
  const ft = totalIn ? Math.floor(Math.round(totalIn) / 12) : "";
  const inch = totalIn ? Math.round(totalIn) % 12 : "";
  const lb = p.weight_kg ? Math.round((p.weight_kg / 0.45359237) * 10) / 10 : "";
  const unit = imperial ? "lb" : "kg";
  const paceAmt = (lb) => (imperial ? `${lb} lb` : `${Math.round(lb * 0.4536 * 100) / 100} kg`);
  const paceLabels = options?.pace ?? {};
  const activityLabels = options?.activity ?? {};
  const needsCode = !store.get("passcode");

  app.innerHTML = `
    <header class="topbar"><h1>Goals</h1></header>
    <form class="goals" id="goals" novalidate>
      <div id="preview">${goalsPreview(p)}</div>

      <div class="section-title">About you</div>
      <div class="card form-card">
        ${seg("units", p.units, [["imperial", "lb / ft"], ["metric", "kg / cm"]])}
        ${seg("sex", p.sex, [["male", "♂ Male"], ["female", "♀ Female"]])}
        <div class="fields">
          <label class="field"><span>Age</span><input name="age" type="number" inputmode="numeric" min="13" max="110" value="${esc(p.age)}" placeholder="35"></label>
          ${
            imperial
              ? `<label class="field"><span>Height</span><div class="pair">
                   <input name="ft" type="number" inputmode="numeric" value="${esc(ft)}" placeholder="5"><em>ft</em>
                   <input name="in" type="number" inputmode="numeric" value="${esc(inch)}" placeholder="10"><em>in</em></div></label>
                 <label class="field"><span>Weight</span><div class="pair">
                   <input name="lb" type="number" inputmode="decimal" step="any" value="${esc(lb)}" placeholder="180.5"><em>lb</em></div></label>`
              : `<label class="field"><span>Height</span><div class="pair">
                   <input name="cm" type="number" inputmode="decimal" step="any" value="${esc(p.height_cm)}" placeholder="178"><em>cm</em></div></label>
                 <label class="field"><span>Weight</span><div class="pair">
                   <input name="kg" type="number" inputmode="decimal" step="any" value="${esc(p.weight_kg ? Math.round(p.weight_kg * 10) / 10 : "")}" placeholder="82.4"><em>kg</em></div></label>`
          }
        </div>
        ${weights.length ? `<p class="fine-note">${icon("scale")}<span>Weight updates automatically from your latest weigh-in.</span></p>` : ""}
      </div>

      <div class="section-title">How active are you?</div>
      <div class="options">${Object.entries(ACTIVITY_UI)
        .map(
          ([k, emoji]) => `<label class="option"><input type="radio" name="activity" value="${k}" ${k === p.activity ? "checked" : ""}>
            <span class="opt-emoji">${emoji}</span><span class="opt-text"><b>${esc(k[0].toUpperCase() + k.slice(1))}</b>
            <small>${esc(activityLabels[k]?.label ?? "")}</small></span>${icon("check")}</label>`,
        )
        .join("")}</div>

      <div class="section-title">How fast do you want to lose?</div>
      <div class="options">${Object.entries(PACE_UI)
        .map(
          ([k, v]) => `<label class="option"><input type="radio" name="pace" value="${k}" ${k === p.pace ? "checked" : ""}>
            <span class="opt-emoji">${v.emoji}</span><span class="opt-text"><b>${esc(paceLabels[k]?.label ?? k)}</b>
            <small>${v.lb ? `Lose about ${paceAmt(v.lb)} a week` : "Stay at your current weight"}</small></span>${icon("check")}</label>`,
        )
        .join("")}</div>

      <div class="section-title">Week starts on</div>
      <div class="card form-card">${seg("week_start", p.week_start ?? "monday", [["monday", "Monday"], ["sunday", "Sunday"]])}</div>

      <div class="passcode" ${needsCode ? "" : "hidden"}>
        <div class="section-title">Passcode</div>
        <label class="field card form-card"><span>Site passcode (asked once on this device)</span>
          <input name="passcode" type="password" autocomplete="current-password" placeholder="••••"></label>
      </div>

      <p class="form-msg" id="form-msg" role="status"></p>
      <button class="save" type="submit">${icon("check")} Save goals</button>
    </form>`;

  const form = document.getElementById("goals");
  form.addEventListener("input", (e) => {
    if (e.target.name === "units") {
      // The inputs on screen are still in the old units; read them that way, then re-render.
      draft = { ...readDraft(form, e.target.value === "metric" ? "imperial" : "metric"), units: e.target.value };
      return goalsView();
    }
    draft = readDraft(form);
    document.getElementById("preview").innerHTML = goalsPreview(draft);
  });
  form.addEventListener("submit", saveGoals);
}

async function saveGoals(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const msg = document.getElementById("form-msg");
  const p = readDraft(form);
  if (!validDraft(p)) {
    msg.textContent = "Check your age, height and weight.";
    msg.className = "form-msg err";
    return;
  }
  const typed = new FormData(form).get("passcode");
  const code = typed || store.get("passcode");
  if (!code) {
    form.querySelector(".passcode").hidden = false;
    msg.textContent = "Enter your passcode to save.";
    msg.className = "form-msg err";
    return;
  }
  const btn = form.querySelector(".save");
  btn.disabled = true;
  try {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "content-type": "application/json", authorization: `Bearer ${code}` },
      body: JSON.stringify(p),
    });
    if (res.status === 401) {
      form.querySelector(".passcode").hidden = false;
      store.set("passcode", "");
      throw new Error("That passcode didn't work.");
    }
    if (!res.ok) throw new Error(`Couldn't save (HTTP ${res.status}).`);
    ({ profile, targets } = await res.json());
    store.set("passcode", code);
    draft = null;
    location.hash = "#/";
  } catch (err) {
    msg.textContent = err.message;
    msg.className = "form-msg err";
  } finally {
    btn.disabled = false;
  }
}

// ---- meal detail sheet ----
const sheet = document.getElementById("sheet");

function openMeal(id) {
  const m = meals.find((x) => x.id === id);
  if (!m) return;
  const t = typeOf(m);
  const conf = { low: "Rough guess", medium: "Good estimate", high: "Confident" }[m.confidence] ?? m.confidence;
  const showFiber = m.totals.fiber_g > 0;
  const share = targets ? Math.round((m.totals.calories / targets.daily_calories) * 100) : null;
  sheet.innerHTML = `<div class="sheet-inner">
    <div class="grabber"></div>
    <div class="sheet-head">
      <div class="tile" style="background:var(--${esc(m.meal_type)}, var(--snack))">${t.emoji}</div>
      <div>
        <h2>${esc(m.title)}</h2>
        <div class="meal-sub">${esc([t.label, dayLabel(m.date), fmtTime(m.time)].filter(Boolean).join(" · "))}</div>
      </div>
      <button class="sheet-close" data-close aria-label="Close">${icon("close")}</button>
    </div>

    <section class="hero" style="margin-top:18px">
      <div class="hero-label">${icon("flame")} Calories <span class="badge ${esc(m.confidence)}" style="margin-left:auto">${esc(conf)}</span></div>
      <div class="hero-kcal num">${n(m.totals.calories)}<small>kcal</small></div>
      ${share !== null ? `<div class="hero-sub">${share}% of your daily goal</div>` : ""}
      ${splitBar(m.totals)}
    </section>
    <div class="chips ${showFiber ? "four" : ""}">${[...MACROS, ...(showFiber ? [FIBER] : [])].map((x) => chip(x, m.totals[x.key])).join("")}</div>

    <div class="section-title">What's in it</div>
    <ul class="items">${m.items
      .map(
        (i) => `<li>
          <div class="name">${esc(i.name)}${i.portion ? `<span class="portion">${esc(i.portion)}</span>` : ""}
            <span class="macro num">P ${r(i.protein_g)}g · C ${r(i.carbs_g)}g · F ${r(i.fat_g)}g</span></div>
          <div class="k num">${n(i.calories)} kcal</div>
        </li>`,
      )
      .join("")}</ul>

    ${
      m.assumptions?.length
        ? `<div class="section-title">Notes from Claude</div>
           <div class="callout"><h3 style="color:var(--carbs)">${icon("bulb")} Assumptions</h3>
           <ul>${m.assumptions.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>`
        : ""
    }
    ${m.notes ? `<div class="callout" ${m.assumptions?.length ? "" : 'style="margin-top:22px"'}><h3 style="color:var(--fat)">${icon("note")} Note</h3><p>${esc(m.notes)}</p></div>` : ""}
    ${deleteButton("meals", m.id)}
  </div>`;
  sheet.showModal();
  sheet.querySelector(".sheet-inner").scrollTop = 0;
}

sheet.addEventListener("click", (e) => {
  if (e.target === sheet || e.target.closest("[data-close]")) sheet.close();
});

// Swipe the sheet down to dismiss.
let sheetStartY = null;
sheet.addEventListener("touchstart", (e) => {
  const inner = sheet.querySelector(".sheet-inner");
  sheetStartY = inner && inner.scrollTop <= 0 ? e.touches[0].clientY : null;
}, { passive: true });
sheet.addEventListener("touchend", (e) => {
  if (sheetStartY !== null && e.changedTouches[0].clientY - sheetStartY > 90) sheet.close();
  sheetStartY = null;
});

// ---- routing ----
function route() {
  const h = location.hash;
  if (h === "#/history") return { view: "history" };
  if (h === "#/goals") return { view: "goals" };
  if (h === "#/workouts") return { view: "workouts" };
  if (h === "#/weight") return { view: "weight" };
  const m = h.match(/^#\/d\/(\d{4}-\d{2}-\d{2})$/);
  return { view: "day", date: m && m[1] < today() ? m[1] : today() };
}

function render() {
  if (!loaded) return;
  const { view, date } = route();
  if (view === "history") historyView();
  else if (view === "goals") goalsView();
  else if (view === "workouts") workoutsView();
  else if (view === "weight") weightView();
  else dayView(date);
  const activeTab = view === "day" ? "today" : view;
  document.querySelectorAll(".tab").forEach((tab) => {
    if (tab.dataset.tab === activeTab) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
}

const goDay = (date) => (location.hash = date >= today() ? "#/" : `#/d/${date}`);

document.addEventListener("click", (e) => {
  const del = e.target.closest("[data-delete]");
  if (del) return deleteRecord(del.dataset.delete, del.dataset.id);
  const go = e.target.closest("[data-go]");
  if (go && !go.disabled) return goDay(go.dataset.go);
  const meal = e.target.closest(".meal[data-id]");
  if (meal) return openMeal(meal.dataset.id);
  const workout = e.target.closest(".meal[data-workout]");
  if (workout) return openWorkout(workout.dataset.workout);
});

// Swipe left/right on the day view to change days.
let swipe = null;
app.addEventListener("touchstart", (e) => (swipe = { x: e.touches[0].clientX, y: e.touches[0].clientY }), { passive: true });
app.addEventListener("touchend", (e) => {
  if (!swipe || route().view !== "day") return;
  const dx = e.changedTouches[0].clientX - swipe.x;
  const dy = e.changedTouches[0].clientY - swipe.y;
  swipe = null;
  if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
  const { date } = route();
  if (dx > 0) goDay(shiftDay(date, -1));
  else if (date < today()) goDay(shiftDay(date, 1));
});

window.addEventListener("hashchange", () => {
  if (sheet.open) sheet.close();
  if (route().view !== "goals") draft = null;
  render();
  window.scrollTo(0, 0);
});
// Meals and workouts get added from Claude, so refresh when the app comes back to the foreground
// (but don't wipe a half-filled goals form).
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && route().view !== "goals" && !modal.open) load();
});

const TABS = {
  today: ["today", "Today"],
  workouts: ["activity", "Workouts"],
  weight: ["scale", "Weight"],
  history: ["history", "History"],
  goals: ["target", "Goals"],
};
document.querySelectorAll(".tab").forEach((tab) => {
  const [ic, label] = TABS[tab.dataset.tab];
  tab.innerHTML = `${icon(ic)}${label}`;
});
load();
