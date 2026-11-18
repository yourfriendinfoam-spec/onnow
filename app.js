import { SERVICES, BY_ID, rank, expand } from "./services.js";
import { loadAll, withClock } from "./data.js";

// ---------- saved preferences (this device only) ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem("onnow:" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("onnow:" + k, JSON.stringify(v)); } catch {} },
};
const firstRun = store.get("mine", null) === null;
let mine = new Set(store.get("mine", []));
let teams = store.get("teams", {}); // key -> display name
let showAll = store.get("showAll", false);
let view = firstRun ? "setup" : "live";
let cat = "All";

// ---------- data ----------
let raw = [], loadedAt = null, loadNote = "", loading = true;

async function refresh() {
  loading = raw.length === 0; render();
  try {
    const res = await loadAll(new Date());
    raw = res.items; loadedAt = new Date();
    loadNote = res.failed ? `${res.failed} of ${res.total} listing sources didn't load.` : "";
  } catch (e) {
    loadNote = "Couldn't load listings. Check your connection and tap Refresh.";
  }
  loading = false; render();
}

// ---------- helpers ----------
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (d) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const until = (d, now) => { const m = Math.round((d - now) / 60000); return m < 60 ? `in ${m}m` : `in ${Math.floor(m / 60)}h ${m % 60 ? (m % 60) + "m" : ""}`.trim(); };
const mono = (s, big) => `<span class="mono${big ? " big" : ""}" style="background:${s.c}" aria-hidden="true">${esc(s.m)}</span>`;

function access(item, mineX) {
  const have = item.carriers.filter((id) => mineX.has(id)).sort((a, b) => rank(a) - rank(b));
  const others = item.carriers.filter((id) => !mineX.has(id)).sort((a, b) => rank(a) - rank(b));
  return { have, others };
}
const followsTeam = (it) => it.teams?.some((t) => teams[t.key]);

// ---------- render ----------
function render() {
  const now = new Date();
  $("#clock").textContent = now.toLocaleDateString([], { weekday: "short" }) + " " + fmt(now);
  document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", t.dataset.view === view));
  $("#guide").hidden = view === "setup";
  $("#setup").hidden = view !== "setup";
  if (view === "setup") return renderSetup();

  if (loading) { $("#content").innerHTML = `<div class="empty">Loading today's listings…</div>`; $("#chips").innerHTML = ""; return; }

  const mineX = expand(mine);
  const items = raw.map((it) => withClock(it, now)).map((it) => ({ ...it, ...access(it, mineX), followed: followsTeam(it) }));
  const canSee = (it) => it.have.length || it.followed || showAll;
  const inCat = (it) => cat === "All" || it.cat === cat;

  let pool;
  if (view === "live") pool = items.filter((it) => it.state === "live");
  else pool = items.filter((it) => it.state === "upcoming" && it.kind !== "drop" && it.start - now < 8 * 3600e3);
  pool = pool.filter(canSee);

  const cats = ["All", "Sports", "News", "Shows"];
  $("#chips").innerHTML = cats.map((c) => {
    const n = c === "All" ? pool.length : pool.filter((p) => p.cat === c).length;
    return `<button class="chip" aria-pressed="${c === cat}" data-cat="${c}">${c}<span class="n">${n}</span></button>`;
  }).join("");

  const order = (a, b) => (b.have.length > 0) - (a.have.length > 0) || a.start - b.start;
  let html = "";

  const mineTeams = items.filter((it) => it.followed && it.state !== "ended" && it.start - now < 20 * 3600e3).sort((a, b) => a.start - b.start);
  if (view === "live" && mineTeams.length && (cat === "All" || cat === "Sports")) {
    html += section("Your teams today", `${mineTeams.length} game${mineTeams.length > 1 ? "s" : ""}`, mineTeams, now);
  }

  const list = pool.filter(inCat).filter((it) => !(view === "live" && it.followed)).sort(order);
  const yours = list.filter((it) => it.have.length).length;
  html += section(view === "live" ? "On now" : "Coming up in the next 8 hours",
    `${yours} you can watch`, list, now,
    mine.size ? "Nothing in this category on your services right now." : "Pick your services under My services to fill your guide.");

  if (view === "live" && (cat === "All" || cat === "Shows")) {
    const drops = items.filter((it) => it.kind === "drop" && it.state === "out" && now - it.start < 24 * 3600e3 && (it.have.length || showAll)).sort(order);
    if (drops.length) html += section("New today on your streaming apps", `${drops.length} episodes`, drops, now);
  }

  $("#content").innerHTML = html;
  $("#status").innerHTML = `${loadedAt ? "Updated " + fmt(loadedAt) : ""}${loadNote ? " · <span class=\"warn\">" + esc(loadNote) + "</span>" : ""}`;
}

function section(title, meta, list, now, emptyText) {
  const body = list.length ? list.map((it) => row(it, now)).join("") : `<div class="empty">${esc(emptyText || "Nothing here.")}</div>`;
  return `<div class="section-h"><h2>${esc(title)}</h2><span>${esc(meta)}</span></div><div class="list">${body}</div>`;
}

function row(it, now) {
  const when = it.state === "live"
    ? `<span class="live-tag">LIVE</span><span>${it.status ? esc(it.status) : "til " + fmt(it.end)}</span>`
    : it.state === "out" ? `<span class="new-tag">NEW</span><span>${fmt(it.start)}</span>`
    : `<span class="t">${fmt(it.start)}</span><span>${until(it.start, now)}</span>`;

  const pct = it.kind === "airing" && it.state === "live" ? Math.max(0, Math.min(100, (now - it.start) / (it.end - it.start) * 100)) : null;
  const ch = it.channels.join(", ");
  let where, btn = "";
  if (it.have.length) {
    const s = BY_ID[it.have[0]];
    const more = it.have.length - 1;
    const via = ch && !new RegExp("^" + s.name.split(" ")[0], "i").test(ch) ? `${esc(ch)} · ${esc(s.name)}` : esc(s.name);
    where = `${mono(s)}<span>${via}</span>${more > 0 ? `<span class="also">+${more} more of yours</span>` : ""}`;
    if (s.url) btn = `<a class="watch" href="${s.url}" target="_blank" rel="noopener">Watch on ${esc(s.name)}</a>`;
    else btn = `<span class="watch plain">${s.id === "antenna" ? "Free on " + esc(ch) : "Turn to " + esc(ch)}</span>`;
  } else if (it.regional) {
    where = `<span class="also">Regional: ${esc(ch)}. Check your local provider or team app.</span>`;
  } else if (it.others.length) {
    const s = BY_ID[it.others.find((id) => BY_ID[id].url) || it.others[0]];
    where = `${mono(s)}<span>${esc(ch || s.name)}</span><span class="also">· not in your plan</span>`;
    if (s.url) btn = `<a class="watch get" href="${s.url}" target="_blank" rel="noopener">Get ${esc(s.name)}</a>`;
  } else {
    where = `<span class="also">${ch ? esc(ch) : "No broadcast listed yet"}</span>`;
  }

  const teamPills = it.teams?.length ? `<div class="teams">${it.teams.map((t) =>
    `<button class="team" data-team="${esc(t.key)}" data-name="${esc(t.name)}" aria-pressed="${!!teams[t.key]}">${teams[t.key] ? "★" : "☆"} ${esc(t.name)}</button>`).join("")}</div>` : "";

  return `<article class="row${it.have.length ? "" : " locked"}">
    <div class="when">${when}</div>
    <div class="main">
      <div class="cat">${esc(it.cat)}${it.sub ? " · " + esc(it.sub) : ""}</div>
      <h3 class="title">${it.link ? `<a href="${esc(it.link)}" target="_blank" rel="noopener">${esc(it.title)}</a>` : esc(it.title)}</h3>
      ${it.score ? `<div class="score">${esc(it.score)}</div>` : ""}
      ${pct !== null ? `<div class="prog" role="img" aria-label="${Math.round(pct)}% through"><i style="width:${pct}%"></i></div>` : ""}
      ${teamPills}
      <div class="foot"><div class="where">${where}</div>${btn}</div>
    </div>
  </article>`;
}

function renderSetup() {
  $("#svc-count").textContent = `${mine.size} selected`;
  $("#first-run").hidden = !firstRun;
  $("#done").disabled = mine.size === 0;
  const groups = [["Live TV", ["antenna", "cable", "yttv", "hululive", "fubo", "sling"]],
                  ["Streaming apps", SERVICES.filter((s) => !["antenna", "cable", "yttv", "hululive", "fubo", "sling"].includes(s.id)).map((s) => s.id)]];
  $("#svc-grid").innerHTML = groups.map(([label, ids]) => `<h3 class="grp">${label}</h3><div class="grid">${ids.map((id) => {
    const s = BY_ID[id];
    return `<button class="svc" id="svc-${s.id}" aria-pressed="${mine.has(s.id)}" data-svc="${s.id}">${mono(s, true)}<span class="nm">${esc(s.name)}<span class="k">${esc(s.kind)}</span></span><span class="chk" aria-hidden="true"></span></button>`;
  }).join("")}</div>`).join("");
  const tk = Object.entries(teams);
  $("#team-list").innerHTML = tk.length
    ? tk.map(([k, n]) => `<button class="team" data-team="${esc(k)}" data-name="${esc(n)}" aria-pressed="true">★ ${esc(n)}</button>`).join("")
    : `<p class="hint">No teams yet. Tap ☆ next to a team on any game to follow it.</p>`;
  $("#show-all").checked = showAll;
}

// ---------- events ----------
document.addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (tab) { view = tab.dataset.view; render(); window.scrollTo({ top: 0 }); return; }
  const chip = e.target.closest(".chip");
  if (chip) { cat = chip.dataset.cat; render(); return; }
  const svc = e.target.closest(".svc");
  if (svc) { const id = svc.dataset.svc; mine.has(id) ? mine.delete(id) : mine.add(id); store.set("mine", [...mine]); render(); return; }
  const team = e.target.closest(".team");
  if (team) { const k = team.dataset.team; if (teams[k]) delete teams[k]; else teams[k] = team.dataset.name; store.set("teams", teams); render(); return; }
  if (e.target.closest("#done")) { view = "live"; render(); window.scrollTo({ top: 0 }); return; }
  if (e.target.closest("#refresh")) { refresh(); }
});
$("#show-all").addEventListener("change", (e) => { showAll = e.target.checked; store.set("showAll", showAll); render(); });

refresh();
setInterval(render, 30e3);        // keep times and progress bars current
setInterval(refresh, 3 * 60e3);   // fetch new scores and listings
document.addEventListener("visibilitychange", () => { if (!document.hidden && loadedAt && Date.now() - loadedAt > 60e3) refresh(); });

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
