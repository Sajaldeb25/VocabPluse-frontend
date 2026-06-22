# VocabPluse Frontend

Vue 3 + TypeScript single-page app for [VocabPluse](https://vocabpluse.com) — flashcard-based English vocabulary learning with AI explanations, progress tracking, Google login, and subscription plans.

This repository contains the **frontend only**. It talks to the VocabPluse Django REST API backend.

## Tech stack

- **Vue 3** with Composition API (`<script setup>`)
- **TypeScript**
- **Vite 5** (Node 18.18+ compatible)
- **Pinia** for state
- **Vue Router** for navigation
- **Axios** for API calls

## Prerequisites

- **Node.js 18.18+** (Node 20+ recommended)
- A running VocabPluse backend (default: `http://localhost:8000/api`)

## Quick start

```bash
npm install
cp .env.example .env    # set VITE_API_BASE and optional VITE_GOOGLE_CLIENT_ID
npm run dev
```

Open <http://localhost:5173>.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Type-check and produce production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Configuration (in .env file)

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE` | Backend API base URL (e.g. `http://localhost:8000/api`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client id; login button is hidden when empty |

## Project structure

```
frontend/
  public/           Static assets (favicon)
  src/
    api/            Axios client and API helpers
    components/     Reusable UI (NavBar, FlashCard)
    router/         Route definitions
    stores/         Pinia stores (auth, catalog)
    views/          Page-level components
    App.vue         Root layout
    main.ts         App bootstrap
    types.ts        Shared TypeScript types
```

## Pages

| Route | View | Description |
|-------|------|-------------|
| `/` | Home | Browse categories and word sets |
| `/sets/:id` | Set | Flashcard study session |
| `/login` | Login | Google sign-in |
| `/plans` | Plans | Subscription plans and checkout |
| `/account` | Account | Profile and progress |

## Production build

```bash
npm run build
```

Serve the `dist/` folder with any static file host or reverse proxy (e.g. Nginx). Point `VITE_API_BASE` at your production API before building.

## Troubleshooting

### Vite / Node version errors

This project uses **Vite 5**, which supports Node 18.18+. Check your version:

```bash
node --version
```

If `npm run dev` fails after switching Node versions, reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

### API connection issues

Confirm the backend is running and `VITE_API_BASE` in `.env` matches the API URL (including `/api` suffix).
