# NYC Finder

NYC Finder is a minimal Vite + React + TypeScript app that searches NYC Open Data parks, lets you filter/sort, and saves favorites locally.

## Dataset
- NYC Open Data: Parks Properties
- Link: https://data.cityofnewyork.us/Recreation/Parks-Properties/enfh-gkve

## Features
- Debounced search with abortable requests (300ms)
- Borough + sort filters
- Result cards with Google Maps and Save actions
- Saved panel with persistent favorites and count badge
- Share button that copies the current URL with query state
- Loading skeletons, empty state, and error state

## Run
```bash
npm install
npm run dev
```

## Deploy (GitHub Pages)
This repo ships with a GitHub Actions workflow that builds and publishes `dist` on every push to `main`.
In GitHub → Settings → Pages, set Source to **GitHub Actions**.

## Privacy
All saved favorites are stored locally in your browser via localStorage. No backend or server storage is used.
