// Fetches today's listings and turns them into one list of guide items.
// Sources: TVmaze (TV and streaming episodes) and ESPN's public scoreboard (games).
import { carriers } from "./services.js";

const LEAGUES = [
  // [sport, league path, label, typical length in minutes]
  ["football", "nfl", "NFL", 200],
  ["football", "college-football", "College football", 210],
  ["basketball", "nba", "NBA", 150],
  ["basketball", "wnba", "WNBA", 130],
  ["basketball", "mens-college-basketball", "Men's college hoops", 130],
  ["basketball", "womens-college-basketball", "Women's college hoops", 130],
  ["hockey", "nhl", "NHL", 160],
  ["baseball", "mlb", "MLB", 185],
  ["soccer", "usa.1", "MLS", 115],
  ["soccer", "eng.1", "Premier League", 115],
  ["soccer", "uefa.champions", "Champions League", 115],
];

const ymd = (d, sep = "") =>
  [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join(sep);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

function uniq(arr) { return [...new Set(arr.filter(Boolean))]; }

function matchAll(channels, opts) {
  const ids = new Set(); let regional = false;
  for (const ch of channels) { const r = carriers(ch, opts); r.ids.forEach((i) => ids.add(i)); regional ||= r.regional; }
  return { carriers: [...ids], regional };
}

// ---------- Sports ----------
function fromEspn(ev, [, league, label, mins]) {
  const comp = ev.competitions?.[0] || {};
  const teams = (comp.competitors || []).map((c) => ({
    key: `${league}:${c.team?.id}`,
    name: c.team?.shortDisplayName || c.team?.displayName,
    abbr: c.team?.abbreviation,
    score: c.score,
    home: c.homeAway === "home",
  }));
  const away = teams.find((t) => !t.home), home = teams.find((t) => t.home);
  const channels = uniq([
    ...(comp.broadcasts || []).flatMap((b) => b.names || []),
    ...(comp.geoBroadcasts || []).map((g) => g.media?.shortName),
  ]);
  const st = ev.status?.type || {};
  const start = new Date(ev.date);
  const state = st.state === "in" ? "live" : st.state === "post" ? "ended" : "upcoming";
  const end = new Date(start.getTime() + mins * 60000);
  const link = (ev.links || []).find((l) => (l.rel || []).includes("summary"))?.href;
  // Regional games stream on the league's package for viewers outside the teams' area
  const match = matchAll(channels, { isGame: true });
  const pkg = { nba: "nbalp", mlb: "mlbtv", nhl: "espn" }[league];
  const outOfMarket = match.regional && pkg ? [pkg] : [];
  return {
    id: `espn:${ev.id}`,
    kind: "game",
    cat: "Sports",
    title: away && home ? `${away.name} at ${home.name}` : ev.name,
    sub: label,
    status: state === "live" ? st.shortDetail : state === "ended" ? "Final" : null,
    score: state !== "upcoming" && away && home ? `${away.abbr} ${away.score} · ${home.abbr} ${home.score}` : null,
    start, end, state, channels, teams, link,
    ...match,
    carriers: [...new Set([...match.carriers, ...outOfMarket])],
    outOfMarket,
  };
}

async function loadSports(now) {
  const days = [ymd(addDays(now, -1)), ymd(now)];
  const jobs = LEAGUES.flatMap((lg) => days.map((d) =>
    getJSON(`https://site.api.espn.com/apis/site/v2/sports/${lg[0]}/${lg[1]}/scoreboard?dates=${d}`)
      .then((j) => (j.events || []).map((ev) => fromEspn(ev, lg)))));
  return settle(jobs);
}

// ---------- TV and streaming ----------
const TV_CAT = { News: "News", Sports: "Sports" };

function fromTvmaze(ep, isWeb) {
  const show = ep.show || ep._embedded?.show || {};
  const net = isWeb ? show.webChannel?.name : show.network?.name;
  const channels = uniq([net || show.webChannel?.name]);
  const start = new Date(ep.airstamp);
  const mins = ep.runtime || show.runtime || 30;
  const s = ep.season, e = ep.number;
  return {
    id: `tvm:${ep.id}`,
    kind: isWeb ? "drop" : "airing",
    cat: TV_CAT[show.type] || "Shows",
    title: show.name,
    sub: [s && e && s < 1900 ? `S${s} E${e}` : null, ep.name && !/^episode \d+$/i.test(ep.name) ? ep.name : null].filter(Boolean).join(" · ") || show.type || "",
    genres: show.genres || [],
    start, end: new Date(start.getTime() + mins * 60000),
    state: "upcoming", channels, teams: [],
    link: show.officialSite || show.url,
    ...matchAll(channels, { isWeb }),
  };
}

async function loadTv(now) {
  const days = [ymd(addDays(now, -1), "-"), ymd(now, "-"), ymd(addDays(now, 1), "-")];
  const jobs = days.flatMap((d) => [
    getJSON(`https://api.tvmaze.com/schedule?country=US&date=${d}`).then((j) => j.map((ep) => fromTvmaze(ep, false))),
    getJSON(`https://api.tvmaze.com/schedule/web?country=US&date=${d}`).then((j) => j.map((ep) => fromTvmaze(ep, true))),
  ]);
  return settle(jobs);
}

async function settle(jobs) {
  const res = await Promise.allSettled(jobs);
  const failed = res.filter((r) => r.status === "rejected").length;
  return { items: res.flatMap((r) => (r.status === "fulfilled" ? r.value : [])), failed, total: jobs.length };
}

export async function loadAll(now = new Date()) {
  const [sports, tv] = await Promise.all([loadSports(now), loadTv(now)]);
  const seen = new Map();
  for (const it of [...sports.items, ...tv.items]) seen.set(it.id, it);
  return { items: [...seen.values()], failed: sports.failed + tv.failed, total: sports.total + tv.total };
}

// Works out live/upcoming/ended for TV airings from the clock (games carry ESPN's own status).
export function withClock(item, now) {
  if (item.kind === "game") {
    // ESPN says "in progress": trust it; extend the estimated end if a game runs long
    if (item.state === "live" && item.end <= now) return { ...item, end: new Date(now.getTime() + 15 * 60000) };
    return item;
  }
  // Streaming episodes "drop" rather than air live
  if (item.kind === "drop") return { ...item, state: now >= item.start ? "out" : "upcoming" };
  const state = now >= item.end ? "ended" : now >= item.start ? "live" : "upcoming";
  return { ...item, state };
}
