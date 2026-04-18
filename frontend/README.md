# Frontend — URL Shortener

A single-page frontend for the URL Shortener API.

## What to build

One HTML page (or React/Vue — your choice) that lets users:
- Paste a long URL → get a short URL back
- Copy the short URL to clipboard
- See click stats for any short code

## API Endpoints (backend already running)

| Method | Endpoint | Body / Params | Response |
|--------|----------|---------------|----------|
| POST | `/shorten` | `{ "url": "https://..." }` | `{ "code": "aB3kP2m", "shortUrl": "http://..." }` |
| GET | `/:code` | — | 301 redirect |
| GET | `/stats/:code` | — | `{ "code", "long_url", "click_count", "created_at" }` |

## Running the backend locally

See the root [README.md](../README.md) for backend setup.
The API runs on `http://localhost:3000` by default.

## Frontend rules

- Lives entirely in the `/frontend` folder
- Zero changes to `/src` (backend) or any root config files
- Proxy API calls to `http://localhost:3000` (use Vite proxy, CRA proxy, or fetch directly)
- No frontend framework required — vanilla HTML/CSS/JS is welcome
- Must work with `npm install && npm run dev` (or just open `index.html`)

## Submitting

1. Fork the repo
2. Create a branch: `git checkout -b feat/frontend`
3. Build inside `/frontend` only
4. Open a PR with a screenshot of your UI