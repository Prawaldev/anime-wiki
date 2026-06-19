# <img src="/public/ic_launcher.png" width="28" style="vertical-align: middle;"> Anime Wiki

A Wikipedia-style anime encyclopedia built with **React, Vite, and TypeScript**.  
Browse trending anime, search characters and series, and explore detailed info including voice actors with Wikipedia-powered bios.

---

## Features

- **Trending Anime** — Homepage shows currently airing top anime
- **Featured Character** — Random character spotlight on every load
- **Search** — Search anime and characters with tabbed results
- **Anime Detail** — Synopsis, metadata, characters, gallery, recommendations
- **Character Detail** — Bio, favorites count, anime appearances, voice actors
- **Voice Actor Wikipedia Data** — Fetches Wikipedia bios for each voice actor

---

## Site Preview

<img src="site-preview.png">

---

## Tech Stack

| Layer | |
|---|---|
| **Framework** | React 18 |
| **Language** | TypeScript (strict mode) |
| **Bundler** | Vite 6 |
| **Routing** | Custom state-based SPA views |
| **HTTP** | Native `fetch` with throttle + retry |
| **APIs** | Jikan v4 (MyAnimeList), Wikipedia REST API |
| **Font** | Ubuntu Mono (Google Fonts) |
| **Styling** | Plain CSS (single stylesheet) |

---

## APIs Used

- **Jikan API v4** — All anime and character data (trending, search, detail, pictures, recommendations, voice actors)
- **Wikipedia REST API** — Voice actor biography summaries

---

## Author

Built by **Prawal Khadka**
