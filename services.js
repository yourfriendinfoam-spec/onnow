// Which of the user's services can show a given channel or streaming app.
// This map is the heart of the app. It is hand-maintained and approximate:
// carriage differs by market and package, so refine it as testers report gaps.

export const SERVICES = [
  // Live TV: carry many channels at once
  { id: "antenna",  name: "Antenna",          kind: "Free over the air",       m: "OTA", c: "#55606f" },
  { id: "cable",    name: "Cable or satellite", kind: "Spectrum, Xfinity, DirecTV…", m: "TV", c: "#1c5fb8" },
  { id: "yttv",     name: "YouTube TV",       kind: "Live TV",  m: "YT", c: "#cc1f1f", url: "https://tv.youtube.com" },
  { id: "hululive", name: "Hulu + Live TV",   kind: "Live TV",  m: "HL", c: "#178a4c", url: "https://www.hulu.com/live-tv",
    includes: ["hulu", "disney", "espn"] },
  { id: "fubo",     name: "Fubo",             kind: "Live TV",  m: "FU", c: "#d1461b", url: "https://www.fubo.tv" },
  { id: "sling",    name: "Sling TV",         kind: "Live TV",  m: "SL", c: "#2a7de1", url: "https://www.sling.com" },
  // Streaming apps
  { id: "netflix",  name: "Netflix",          kind: "Streaming", m: "N",  c: "#a50d14", url: "https://www.netflix.com" },
  { id: "prime",    name: "Prime Video",      kind: "Streaming", m: "PV", c: "#1a7fb5", url: "https://www.primevideo.com" },
  { id: "peacock",  name: "Peacock",          kind: "Streaming", m: "PK", c: "#2d2d2d", url: "https://www.peacocktv.com" },
  { id: "paramount",name: "Paramount+",       kind: "Streaming", m: "P+", c: "#0b4bd1", url: "https://www.paramountplus.com" },
  { id: "max",      name: "HBO Max",          kind: "Streaming", m: "MX", c: "#3b2bb3", url: "https://www.hbomax.com" },
  { id: "hulu",     name: "Hulu",             kind: "Streaming", m: "H",  c: "#1ca35a", url: "https://www.hulu.com" },
  { id: "disney",   name: "Disney+",          kind: "Streaming", m: "D+", c: "#113ccf", url: "https://www.disneyplus.com" },
  { id: "espn",     name: "ESPN app",         kind: "ESPN Unlimited / ESPN+", m: "E", c: "#c4161c", url: "https://www.espn.com/watch/" },
  { id: "foxone",   name: "Fox One",          kind: "Streaming", m: "F1", c: "#00297a", url: "https://www.foxone.com" },
  { id: "apple",    name: "Apple TV",         kind: "Streaming", m: "TV", c: "#333333", url: "https://tv.apple.com" },
  { id: "youtube",  name: "YouTube",          kind: "Free",      m: "Y",  c: "#b8261e", url: "https://www.youtube.com" },
];
export const BY_ID = Object.fromEntries(SERVICES.map((s) => [s.id, s]));

// When we pick which button to show, prefer a direct app over a bundle.
const PREFERENCE = ["netflix","prime","peacock","paramount","max","espn","foxone","apple","hulu","disney","youtube",
                    "yttv","hululive","fubo","sling","cable","antenna"];
export const rank = (id) => { const i = PREFERENCE.indexOf(id); return i < 0 ? 99 : i; };

const LIVE_TV = ["cable", "yttv", "hululive", "fubo", "sling"];
const CABLE_DEFAULT = ["cable", "yttv", "hululive", "sling"]; // typical entertainment/news channel

const RULES = [
  // Broadcast networks
  [/^abc$/, ["antenna", "cable", "yttv", "hululive", "fubo"]],
  [/^cbs$/, ["antenna", "cable", "yttv", "hululive", "fubo", "paramount"]],
  [/^nbc$/, ["antenna", "cable", "yttv", "hululive", "fubo", "peacock"]],
  [/^fox$/, ["antenna", "cable", "yttv", "hululive", "fubo", "sling", "foxone"]],
  [/^(the )?cw$|^pbs$|^ion|^telemundo|^univision|^unimas/, ["antenna", "cable", "yttv", "hululive"]],
  // ESPN family (the "+" versions stream only in the ESPN app)
  [/^(espn|secn|sec network|accn|acc network)\+$|^accnx/, ["espn"]],
  [/^espn(2)?$/, ["cable", "yttv", "hululive", "fubo", "sling", "espn"]],
  [/^espn(u|news|deportes)$|^sec ?network|^secn|^acc ?network|^accn|^longhorn/, ["cable", "yttv", "hululive", "fubo", "espn"]],
  // Fox cable
  [/^fs1$|^fs2$|^fox sports [12]|^big ten network|^btn$|^fox news|^fox business/, ["cable", "yttv", "hululive", "fubo", "sling", "foxone"]],
  // Warner (TNT Sports and CNN also stream on HBO Max)
  [/^tnt|^tbs$|^trutv|^cnn$/, ["cable", "yttv", "hululive", "sling", "max"]],
  // League networks
  [/^nfl network|^nfln$/, ["cable", "yttv", "fubo", "sling"]],
  [/^nba tv/, ["cable", "yttv", "fubo", "sling"]],
  [/^nhl network|^mlb network|^golf channel|^cbs sports network|^cbssn$/, ["cable", "yttv", "fubo"]],
  [/^usa( network)?$/, ["cable", "yttv", "hululive", "fubo", "sling"]],
  // Streaming apps (game streams and streaming-original episodes)
  [/^prime video|^amazon/, ["prime"]],
  [/^peacock/, ["peacock"]],
  [/^netflix/, ["netflix"]],
  [/^paramount\+|^paramount plus/, ["paramount"]],
  [/^(hbo )?max$|^hbo/, ["max"]],
  [/^hulu$/, ["hulu"]],
  [/^disney\+/, ["disney"]],
  [/^apple tv|^mls season pass/, ["apple"]],
  [/^fox one/, ["foxone"]],
  [/^youtube/, ["youtube"]],
];

// Regional sports networks, local stations and team apps: we can't match these
// without the viewer's market, so we flag them instead of guessing.
const REGIONAL = /^dazn|^fanduel|^bally|^msg|^nesn|^yes\b|^sny|^marquee|^spectrum ?sn|^mnmt|^monumental|^root|^altitude|^kjzz|^ksn|^nbc ?s(ports )?[a-z]|^chsn|^rsn|app$|^my[a-z]|^kt|^w[a-z]{2,3}$|^k[a-z]{2,3}$/;

export function carriers(channel, { isWeb = false, isGame = false } = {}) {
  const n = String(channel || "").trim().toLowerCase();
  if (!n) return { ids: [], regional: false };
  for (const [re, ids] of RULES) if (re.test(n)) return { ids, regional: false };
  if (REGIONAL.test(n)) return { ids: [], regional: true };
  // Streaming-only channels we don't track (B1G+, Big East+, etc.), web channels,
  // and unknown game broadcasts: don't guess cable for these
  if (isWeb || n.includes("+")) return { ids: [], regional: false };
  if (isGame) return { ids: [], regional: true };
  return { ids: CABLE_DEFAULT, regional: false };
}

// Expand bundles: Hulu + Live TV includes Hulu, Disney+ and ESPN.
export function expand(mine) {
  const out = new Set(mine);
  for (const id of mine) for (const inc of BY_ID[id]?.includes || []) out.add(inc);
  return out;
}

export { LIVE_TV };
