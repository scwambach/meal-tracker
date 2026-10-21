// "Ask Claude": an in-app chat that talks to /api/chat, where Claude uses the same tools as the
// claude.ai connector. The conversation is kept in Messages API format and only ever appended to.

const STORE_KEY = "chat";
const IDLE_RESET_MS = 3 * 60 * 60 * 1000; // start fresh after 3 idle hours
const MAX_IMAGE_EDGE = 1568; // larger images are downscaled by the API anyway
const MAX_IMAGES = 4;

const TOOL_LABELS = {
  log_meal: "Logged meal",
  update_meal: "Updated meal",
  delete_meal: "Deleted meal",
  log_workout: "Logged workout",
  update_workout: "Updated workout",
  delete_workout: "Deleted workout",
  log_weight: "Logged weigh-in",
  delete_weight: "Deleted weigh-in",
  list_meals: "Checked your meals",
  get_meal: "Looked at a meal",
  get_progress: "Checked what's left",
  get_my_stats: "Checked your stats",
  list_workouts: "Checked your workouts",
  list_weights: "Checked your weigh-ins",
};
const WRITES = /^(log|update|delete)_/;

const SUGGESTIONS = [
  ["📸", "Log a meal from a photo", null],
  ["🍽️", "I had a turkey sandwich and an apple for lunch", "I had a turkey sandwich and an apple for lunch"],
  ["🏃", "I ran 3 miles in 30 minutes", "I ran 3 miles in 30 minutes"],
  ["🎯", "How much do I have left today?", "How much do I have left today?"],
];

export function initChat({ authedFetch, toast, onChanged, icon, esc }) {
  let messages = [];
  let lastActive = 0;
  let pending = [];
  let busy = false;
  let error = null;

  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || "null");
    if (saved && Date.now() - saved.lastActive < IDLE_RESET_MS) ({ messages, lastActive } = saved);
  } catch {}

  const save = () => {
    lastActive = Date.now();
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ messages, lastActive }));
    } catch {
      // Photos can exceed storage quota; the chat still works for this visit.
    }
  };

  // ---- DOM ----
  const fab = document.createElement("button");
  fab.className = "chat-fab";
  fab.innerHTML = `${icon("sparkle")}<span>Ask Claude</span>`;
  fab.setAttribute("aria-label", "Ask Claude to log something");

  const dialog = document.createElement("dialog");
  dialog.className = "chat";
  dialog.setAttribute("aria-label", "Ask Claude");
  dialog.innerHTML = `
    <header class="chat-head">
      <div class="chat-avatar">${icon("sparkle")}</div>
      <div class="chat-title"><b>Claude</b><span>Logs meals, workouts and weigh-ins</span></div>
      <button class="chat-new" type="button">New chat</button>
      <button class="sheet-close" type="button" data-chat-close aria-label="Close">${icon("close")}</button>
    </header>
    <div class="chat-log" aria-live="polite"></div>
    <form class="chat-compose">
      <div class="chat-attach"></div>
      <div class="chat-row">
        <label class="chat-photo" aria-label="Add a photo">${icon("camera")}
          <input type="file" accept="image/*" multiple hidden>
        </label>
        <textarea rows="1" placeholder="What did you eat or do?" enterkeyhint="send"></textarea>
        <button class="chat-send" type="submit" aria-label="Send">${icon("send")}</button>
      </div>
    </form>`;
  document.body.append(fab, dialog);

  const log = dialog.querySelector(".chat-log");
  const form = dialog.querySelector(".chat-compose");
  const input = form.querySelector("textarea");
  const fileInput = form.querySelector('input[type="file"]');
  const attach = form.querySelector(".chat-attach");
  const sendBtn = form.querySelector(".chat-send");

  // ---- rendering ----
  const md = (text) =>
    esc(text)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .split(/\n{2,}/)
      .map((para) => {
        const lines = para.split("\n");
        if (lines.every((l) => /^\s*[-•]\s+/.test(l))) {
          return `<ul>${lines.map((l) => `<li>${l.replace(/^\s*[-•]\s+/, "")}</li>`).join("")}</ul>`;
        }
        return `<p>${lines.join("<br>")}</p>`;
      })
      .join("");

  const blocks = (m) => (typeof m.content === "string" ? [{ type: "text", text: m.content }] : m.content);

  function renderLog() {
    const results = new Map();
    for (const m of messages) {
      if (m.role === "user") for (const b of blocks(m)) if (b.type === "tool_result") results.set(b.tool_use_id, b);
    }

    const parts = [];
    for (const m of messages) {
      const bs = blocks(m);
      if (m.role === "user") {
        const images = bs.filter((b) => b.type === "image");
        const text = bs.filter((b) => b.type === "text").map((b) => b.text).join("\n");
        if (!images.length && !text) continue; // a tool-results turn
        parts.push(`<div class="bubble me">
          ${images.length ? `<div class="bubble-photos">${images.map((b) => `<img alt="" src="data:${b.source.media_type};base64,${b.source.data}">`).join("")}</div>` : ""}
          ${text ? md(text) : ""}
        </div>`);
      } else {
        for (const b of bs) {
          if (b.type === "text" && b.text.trim()) parts.push(`<div class="bubble claude">${md(b.text)}</div>`);
          if (b.type === "tool_use") {
            const r = results.get(b.id);
            const label = TOOL_LABELS[b.name] ?? b.name.replace(/_/g, " ");
            if (WRITES.test(b.name)) {
              const first = r && typeof r.content === "string" ? r.content.split("\n")[0].replace(/^(Logged|Updated|Deleted):?\s*/, "").replace(/\s*\[id [^\]]+\]/, "") : "";
              parts.push(`<div class="tool-chip ${r?.is_error ? "err" : "ok"}">${icon(r?.is_error ? "close" : "check")}
                <span><b>${esc(r?.is_error ? `Couldn't ${label.toLowerCase()}` : label)}</b>${first && !r?.is_error ? ` · ${esc(first)}` : ""}</span></div>`);
            } else {
              parts.push(`<div class="tool-chip quiet">${icon("search")}<span>${esc(label)}</span></div>`);
            }
          }
        }
      }
    }

    if (!messages.length) {
      parts.push(`<div class="chat-empty">
        <div class="chat-empty-icon">${icon("sparkle")}</div>
        <p>Tell me what you ate, snap a photo, or ask how you're doing. I'll ask if anything's unclear.</p>
        <div class="chat-suggest">${SUGGESTIONS.map(
          ([emoji, label, text]) => `<button type="button" ${text ? `data-say="${esc(text)}"` : "data-photo"}>${emoji} ${esc(label)}</button>`,
        ).join("")}</div>
      </div>`);
    }
    if (busy) parts.push(`<div class="bubble claude typing" aria-label="Claude is thinking"><i></i><i></i><i></i></div>`);
    if (error) parts.push(`<div class="chat-error">${esc(error)} <button type="button" data-retry>Try again</button></div>`);

    log.innerHTML = parts.join("");
    requestAnimationFrame(() => (log.scrollTop = log.scrollHeight));
  }

  function renderAttach() {
    attach.innerHTML = pending
      .map((p, i) => `<div class="thumb"><img alt="" src="data:${p.media_type};base64,${p.data}"><button type="button" data-unattach="${i}" aria-label="Remove photo">${icon("close")}</button></div>`)
      .join("");
    attach.hidden = !pending.length;
    updateSend();
  }

  const updateSend = () => (sendBtn.disabled = busy || (!input.value.trim() && !pending.length));

  // ---- photos ----
  async function toJpeg(file) {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.85));
    const buf = new Uint8Array(await blob.arrayBuffer());
    let bin = "";
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return { media_type: "image/jpeg", data: btoa(bin) };
  }

  fileInput.addEventListener("change", async () => {
    const files = [...fileInput.files].slice(0, MAX_IMAGES - pending.length);
    fileInput.value = "";
    for (const f of files) {
      try {
        pending.push(await toJpeg(f));
      } catch {
        toast("Couldn't read that photo.", true);
      }
    }
    renderAttach();
  });

  // ---- sending ----
  async function run() {
    busy = true;
    error = null;
    renderLog();
    updateSend();
    try {
      for (let round = 0; round < 4; round++) {
        const res = await authedFetch("/api/chat", { method: "POST", body: JSON.stringify({ messages }) });
        if (!res) throw new Error("Enter your passcode to use Claude.");
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Something went wrong (HTTP ${res.status}).`);
        messages.push(...data.messages);
        save();
        if (data.changed) onChanged();
        renderLog();
        if (data.done) return;
      }
    } catch (err) {
      error = err.message;
    } finally {
      busy = false;
      renderLog();
      updateSend();
    }
  }

  function send(text) {
    if (busy) return;
    const content = [
      ...pending.map((p) => ({ type: "image", source: { type: "base64", ...p } })),
      ...(text ? [{ type: "text", text }] : []),
    ];
    if (!content.length) return;
    messages.push({ role: "user", content });
    pending = [];
    input.value = "";
    autosize();
    renderAttach();
    save();
    run();
  }

  // ---- events ----
  const autosize = () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
  };
  input.addEventListener("input", () => {
    autosize();
    updateSend();
  });
  input.addEventListener("keydown", (e) => {
    // Enter sends on a hardware keyboard; Shift+Enter adds a line.
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing && matchMedia("(hover: hover)").matches) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    send(input.value.trim());
  });

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog || e.target.closest("[data-chat-close]")) return dialog.close();
    if (e.target.closest(".chat-new")) {
      if (busy) return;
      messages = [];
      pending = [];
      error = null;
      save();
      renderAttach();
      renderLog();
      return input.focus();
    }
    const say = e.target.closest("[data-say]");
    if (say) return send(say.dataset.say);
    if (e.target.closest("[data-photo]")) return fileInput.click();
    if (e.target.closest("[data-retry]")) return run();
    const un = e.target.closest("[data-unattach]");
    if (un) {
      pending.splice(Number(un.dataset.unattach), 1);
      renderAttach();
    }
  });

  fab.addEventListener("click", () => {
    if (messages.length && Date.now() - lastActive > IDLE_RESET_MS) messages = [];
    renderLog();
    renderAttach();
    dialog.showModal();
    if (matchMedia("(hover: hover)").matches) input.focus();
  });

  return { isOpen: () => dialog.open };
}
