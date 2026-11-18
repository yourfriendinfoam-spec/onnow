# OnNow

A live TV guide built from the services you pay for. Pick your services (cable, YouTube TV, Netflix, Peacock and so on). OnNow lists what's live across all of them, plus tonight's games and new streaming episodes. Tapping Watch opens the right app.

It's a phone web app: open the site, then use "Add to Home Screen" to install it like an app. There's no server, and preferences stay on the device.

## Files

| File | What it does |
|---|---|
| `index.html`, `styles.css` | The page |
| `app.js` | Screens, filters, saved preferences |
| `data.js` | Fetches listings and turns them into guide items |
| `services.js` | **Which service carries which channel.** This is the part to keep improving. |
| `sw.js`, `manifest.json`, `icon-*.png` | Lets it install to the home screen |

## Run it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Data sources and their limits

- **TVmaze** (`api.tvmaze.com`): TV episodes on US networks and new streaming episodes. Free and licensed CC BY-SA, so keep the attribution link. It lists *episodes*, not a full 24-hour channel grid, so it has no movies on cable channels and little overnight programming.
- **ESPN scoreboard** (`site.api.espn.com`): games, live scores, and the networks carrying each game. This is an **unofficial, undocumented** endpoint. It's fine for a prototype, but before charging money or launching publicly, switch to a licensed feed (Watchmode, Gracenote or Sportradar).
- **Channel to service mapping** (`services.js`): hand-written and approximate. Carriage varies by market and package. Regional sports networks are flagged rather than guessed, because they depend on the viewer's zip code.

## Next steps

1. Licensed listings with zip-code support (local channels, regional sports, blackouts)
2. Alerts before a followed team's game
3. Deep links that open the exact game or show inside each app, not just the app's home page
4. Native iOS and Android wrappers for the app stores
