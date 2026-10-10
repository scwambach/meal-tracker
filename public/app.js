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
    const [mealsRes, profileRes, workoutsRes] = await Promise.all([
      fetch("/api/meals", { cache: "no-store" }),
      fetch("/api/profile", { cache: "no-store" }),
      fetch("/api/workouts", { cache: "no-store" }),
    ]);
    if (!mealsRes.ok) throw new Error(`HTTP ${mealsRes.status}`);
    meals = (await mealsRes.json()).meals;
    if (profileRes.ok) ({ profile, targets, options } = await profileRes.json());
    if (workoutsRes.ok) workouts = (await workoutsRes.json()).workouts;
    loaded = true;
    render();
  } catch (e) {
    if (!loaded) app.innerHTML = emptyState("😵", `Couldn't load meals (${esc(e.message)}).`);
  }
}

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
function dayHero(t) {
  if (!targets) {
    return `<section class="hero">
      <div class="hero-label">${icon("flame")} Eaten</div>
      <div class="hero-kcal num">${n(t.calories)}<small>kcal</small></div>
      ${splitBar(t)}
    </section>
    <a class="cta" href="#/goals">${icon("target")}<span><b>Set your goals</b><br>See how many calories you have left</span>${icon("right")}</a>`;
  }
  const goal = targets.daily_calories;
  const left = goal - t.calories;
  const over = left < 0;
  return `<section class="hero hero-ring">
    <div class="ring-wrap">
      ${ring(t.calories / goal, over)}
      <div class="ring-center">
        <div class="ring-num num">${n(Math.abs(left))}</div>
        <div class="ring-label">${over ? "over" : "left"}</div>
      </div>
    </div>
    <div class="hero-stats">
      <div><span>${icon("flame")} Eaten</span><b class="num">${n(t.calories)}</b></div>
      <div><span>${icon("target")} Goal</span><b class="num">${n(goal)}</b></div>
    </div>
  </section>`;
}

function weekCard(date, days) {
  if (!targets) return "";
  const week = weekDays(date);
  const eaten = week.map((d) => sumTotals(days.get(d) ?? []).calories);
  const total = eaten.reduce((a, b) => a + b, 0);
  const left = targets.weekly_calories - total;
  const isCurrent = week.includes(today());
  const remainingDays = isCurrent ? week.filter((d) => d >= today()).length : 0;
  const eatenBeforeToday = week.reduce((a, d, i) => a + (d < today() ? eaten[i] : 0), 0);
  // Budget for each remaining day (today included) if the week is to land on target.
  const perDay = remainingDays ? (targets.weekly_calories - eatenBeforeToday) / remainingDays : 0;
  const max = Math.max(targets.daily_calories * 1.25, ...eaten);

  return `<section class="card week">
    <div class="week-head">
      <div class="week-icon">${icon("week")}</div>
      <div>
        <div class="week-label">${isCurrent ? "This week" : "That week"}</div>
        <div class="week-left num"><b class="${left < 0 ? "over" : ""}">${n(Math.abs(left))}</b> ${left < 0 ? "over" : "left"}
          <span>of ${n(targets.weekly_calories)}</span></div>
      </div>
    </div>
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
    ${
      isCurrent && remainingDays > 1
        ? `<p class="week-hint">${icon("bulb")}<span>About <b class="num">${n(Math.max(0, perDay))}</b> a day for the rest of the week keeps you on track.</span></p>`
        : ""
    }
  </section>`;
}

function dayView(date) {
  const days = byDay();
  const list = days.get(date) ?? [];
  const t = sumTotals(list);
  const isToday = date === today();
  app.innerHTML = `
    <header class="topbar">
      <button class="icon-btn" data-go="${shiftDay(date, -1)}" aria-label="Previous day">${icon("left")}</button>
      <h1>${esc(dayLabel(date))}</h1>
      <button class="icon-btn" data-go="${shiftDay(date, 1)}" aria-label="Next day" ${isToday ? "disabled" : ""}>${icon("right")}</button>
    </header>
    ${dayHero(t)}
    <div class="chips">${MACROS.map((m) => chip(m, t[m.key], targets?.[m.key])).join("")}</div>
    ${weekCard(date, days)}
    <div class="section-title">${list.length ? `${list.length} meal${list.length === 1 ? "" : "s"}` : "Meals"}</div>
    ${
      list.length
        ? `<div class="meals">${list.map(mealCard).join("")}</div>`
        : emptyState(isToday ? "📸" : "🍽️", isToday ? "Nothing yet. Send Claude a photo of your meal." : "Nothing logged this day.")
    }`;
}

// ---- Workouts ----
// Burned calories are shown for reference only; they never change the food goals.
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
    <p class="fine-note">${icon("bulb")}<span>Just for reference. Workouts don't change your daily calorie goal.</span></p>
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
  </div>`;
  sheet.showModal();
  sheet.querySelector(".sheet-inner").scrollTop = 0;
}

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
    weight_kg: Math.round(weight_kg * 10) / 10,
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
  const lb = p.weight_kg ? Math.round(p.weight_kg / 0.45359237) : "";
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
                   <input name="lb" type="number" inputmode="decimal" value="${esc(lb)}" placeholder="180"><em>lb</em></div></label>`
              : `<label class="field"><span>Height</span><div class="pair">
                   <input name="cm" type="number" inputmode="decimal" value="${esc(p.height_cm)}" placeholder="178"><em>cm</em></div></label>
                 <label class="field"><span>Weight</span><div class="pair">
                   <input name="kg" type="number" inputmode="decimal" value="${esc(p.weight_kg)}" placeholder="82"><em>kg</em></div></label>`
          }
        </div>
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
  const m = h.match(/^#\/d\/(\d{4}-\d{2}-\d{2})$/);
  return { view: "day", date: m && m[1] < today() ? m[1] : today() };
}

function render() {
  if (!loaded) return;
  const { view, date } = route();
  if (view === "history") historyView();
  else if (view === "goals") goalsView();
  else if (view === "workouts") workoutsView();
  else dayView(date);
  const activeTab = view === "day" ? "today" : view;
  document.querySelectorAll(".tab").forEach((tab) => {
    if (tab.dataset.tab === activeTab) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
}

const goDay = (date) => (location.hash = date >= today() ? "#/" : `#/d/${date}`);

document.addEventListener("click", (e) => {
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
  if (document.visibilityState === "visible" && route().view !== "goals") load();
});

const TABS = {
  today: ["today", "Today"],
  workouts: ["activity", "Workouts"],
  history: ["history", "History"],
  goals: ["target", "Goals"],
};
document.querySelectorAll(".tab").forEach((tab) => {
  const [ic, label] = TABS[tab.dataset.tab];
  tab.innerHTML = `${icon(ic)}${label}`;
});
load();
