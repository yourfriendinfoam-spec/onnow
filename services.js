// Which of the user's services can show a given channel or streaming app.
// This map is the heart of the app. It is hand-maintained and approximate:
// carriage differs by market and package, so refine it as testers report gaps.

// group: where it appears in the "Add a service" catalog.
// includes: other ids this service also counts as (e.g. Spectrum counts as cable).
export const GROUPS = ["Cable & satellite", "Live TV apps", "Streaming", "Sports", "Free"];
export const SERVICES = [
  // Cable & satellite (each counts as "cable" for channel matching)
  { id: "spectrum", g: 0, name: "Spectrum",        m: "SP", c: "#1c5fb8", url: "https://watch.spectrum.net/guide", includes: ["cable"] },
  { id: "xfinity",  g: 0, name: "Xfinity",         m: "XF", c: "#5a2ca0", url: "https://www.xfinity.com/stream", includes: ["cable"] },
  { id: "directv",  g: 0, name: "DirecTV",         m: "DTV", c: "#0f6cbd", url: "https://stream.directv.com", includes: ["cable"] },
  { id: "dtvstream",g: 0, name: "DirecTV Stream",  m: "DS", c: "#0a4f8c", url: "https://stream.directv.com", includes: ["cable"] },
  { id: "dish",     g: 0, name: "Dish",            m: "DI", c: "#c8102e", url: "https://www.dishanywhere.com", includes: ["cable"] },
  { id: "fios",     g: 0, name: "Verizon Fios",    m: "FI", c: "#d52b1e", url: "https://tv.verizon.com", includes: ["cable"] },
  { id: "cox",      g: 0, name: "Cox",             m: "CX", c: "#0066b3", includes: ["cable"] },
  { id: "optimum",  g: 0, name: "Optimum",         m: "OP", c: "#0a3d91", includes: ["cable"] },
  { id: "cable",    g: 0, name: "Other cable or satellite", m: "TV", c: "#3a5a8c" },
  { id: "antenna",  g: 0, name: "Antenna (free local channels)", m: "OTA", c: "#55606f" },
  // Live TV apps
  { id: "yttv",     g: 1, name: "YouTube TV",      m: "YT", c: "#cc1f1f", url: "https://tv.youtube.com" },
  { id: "hululive", g: 1, name: "Hulu + Live TV",  m: "HL", c: "#178a4c", url: "https://www.hulu.com/live-tv", includes: ["hulu", "disney", "espn"] },
  { id: "fubo",     g: 1, name: "Fubo",            m: "FU", c: "#d1461b", url: "https://www.fubo.tv" },
  { id: "sling",    g: 1, name: "Sling TV",        m: "SL", c: "#2a7de1", url: "https://www.sling.com" },
  { id: "philo",    g: 1, name: "Philo",           m: "PH", c: "#6b4bd8", url: "https://www.philo.com" },
  // Streaming
  { id: "netflix",  g: 2, name: "Netflix",         m: "N",  c: "#a50d14", url: "https://www.netflix.com" },
  { id: "prime",    g: 2, name: "Prime Video",     m: "PV", c: "#1a7fb5", url: "https://www.primevideo.com" },
  { id: "peacock",  g: 2, name: "Peacock",         m: "PK", c: "#2d2d2d", url: "https://www.peacocktv.com" },
  { id: "paramount",g: 2, name: "Paramount+",      m: "P+", c: "#0b4bd1", url: "https://www.paramountplus.com" },
  { id: "max",      g: 2, name: "HBO Max",         m: "MX", c: "#3b2bb3", url: "https://www.hbomax.com" },
  { id: "hulu",     g: 2, name: "Hulu",            m: "H",  c: "#1ca35a", url: "https://www.hulu.com" },
  { id: "disney",   g: 2, name: "Disney+",         m: "D+", c: "#113ccf", url: "https://www.disneyplus.com" },
  { id: "apple",    g: 2, name: "Apple TV",        m: "TV", c: "#333333", url: "https://tv.apple.com" },
  { id: "discoveryplus", g: 2, name: "Discovery+", m: "D+", c: "#1e5bd6", url: "https://www.discoveryplus.com" },
  { id: "amcplus",  g: 2, name: "AMC+",            m: "A+", c: "#222222", url: "https://www.amcplus.com" },
  { id: "starz",    g: 2, name: "Starz",           m: "ST", c: "#111111", url: "https://www.starz.com" },
  { id: "mgmplus",  g: 2, name: "MGM+",            m: "M+", c: "#7a5c1e", url: "https://www.mgmplus.com" },
  { id: "betplus",  g: 2, name: "BET+",            m: "B+", c: "#5b1f8a", url: "https://www.bet.plus" },
  { id: "britbox",  g: 2, name: "BritBox",         m: "BB", c: "#1b3a6b", url: "https://www.britbox.com" },
  { id: "crunchyroll", g: 2, name: "Crunchyroll",  m: "CR", c: "#e8661a", url: "https://www.crunchyroll.com" },
  // Sports
  { id: "espn",     g: 3, name: "ESPN app (ESPN+ / Unlimited)", m: "E", c: "#c4161c", url: "https://www.espn.com/watch/" },
  { id: "foxone",   g: 3, name: "Fox One",         m: "F1", c: "#00297a", url: "https://www.foxone.com" },
  { id: "nbalp",    g: 3, name: "NBA League Pass", m: "NBA", c: "#1d428a", url: "https://www.nba.com/watch/league-pass-stream" },
  { id: "sundayticket", g: 3, name: "NFL Sunday Ticket", m: "ST", c: "#013369", url: "https://tv.youtube.com/learn/nflsundayticket" },
  { id: "nflplus",  g: 3, name: "NFL+",            m: "NFL", c: "#013369", url: "https://www.nfl.com/plus" },
  { id: "mlbtv",    g: 3, name: "MLB.TV",          m: "MLB", c: "#0b2a5b", url: "https://www.mlb.com/tv" },
  { id: "dazn",     g: 3, name: "DAZN",            m: "DZ", c: "#1a1a1a", url: "https://www.dazn.com" },
  { id: "b1gplus",  g: 3, name: "B1G+",            m: "B1G", c: "#0088ce", url: "https://www.bigtenplus.com" },
  { id: "flo",      g: 3, name: "FloSports",       m: "FLO", c: "#1a1a1a", url: "https://www.flosports.tv" },
  // Free
  { id: "youtube",  g: 4, name: "YouTube",         m: "Y",  c: "#b8261e", url: "https://www.youtube.com" },
  { id: "twitch",   g: 4, name: "Twitch",          m: "TW", c: "#7140d6", url: "https://www.twitch.tv" },
  { id: "pluto",    g: 4, name: "Pluto TV",        m: "PL", c: "#1f1f1f", url: "https://pluto.tv" },
  { id: "tubi",     g: 4, name: "Tubi",            m: "TU", c: "#7408ff", url: "https://tubitv.com" },
  { id: "roku",     g: 4, name: "The Roku Channel", m: "RO", c: "#6c3c97", url: "https://therokuchannel.roku.com" },
];
export const BY_ID = Object.fromEntries(SERVICES.map((s) => [s.id, s]));

// A service the user typed in themselves (not in the catalog)
export const customService = (id, name) => ({ id, name, m: name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "?", c: "#55606f", custom: true });

// When we pick which button to show, prefer a direct app over a bundle.
const PREFERENCE = ["netflix","prime","peacock","paramount","max","espn","foxone","apple","hulu","disney",
                    "nbalp","sundayticket","nflplus","mlbtv","dazn","b1gplus","flo",
                    "discoveryplus","amcplus","starz","mgmplus","betplus","britbox","crunchyroll",
                    "youtube","twitch","pluto","tubi","roku",
                    "yttv","hululive","fubo","sling","philo","cable","antenna"];
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
  // Entertainment channels Philo also carries
  [/^(a&e|amc|bet|comedy central|discovery|food network|hgtv|history|hallmark|investigation discovery|tlc|paramount network|mtv|lifetime|vh1|nickelodeon|bravo|e!)$/, [...CABLE_DEFAULT, "philo"]],
  // Sports packages and other apps
  [/league pass/, ["nbalp"]],
  [/sunday ticket/, ["sundayticket"]],
  [/^nfl\+/, ["nflplus"]],
  [/^mlb\.tv/, ["mlbtv"]],
  [/^dazn$/, ["dazn"]],
  [/^b1g\+|^big ten\+|^big ten plus/, ["b1gplus"]],
  [/^flo/, ["flo"]],
  [/^discovery\+/, ["discoveryplus"]],
  [/^amc\+/, ["amcplus"]],
  [/^starz/, ["starz"]],
  [/^mgm\+/, ["mgmplus"]],
  [/^bet\+/, ["betplus"]],
  [/^britbox/, ["britbox"]],
  [/^crunchyroll/, ["crunchyroll"]],
  [/^twitch/, ["twitch"]],
  [/^pluto/, ["pluto"]],
  [/^tubi/, ["tubi"]],
  [/roku channel/, ["roku"]],
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
