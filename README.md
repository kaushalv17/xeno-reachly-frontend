# Reachly - Frontend

React + Vite + TypeScript dashboard for Reachly, the AI-native Mini CRM.

## Pages
- Dashboard - engagement funnel (Recharts) plus AI-generated insights
- AI Agent - state a goal, watch the agent plan (segment -> preview -> draft), review message variants, approve and launch
- Campaigns - list of campaigns with a per-campaign funnel drilldown

## Tech stack
React 18, Vite 5, TypeScript, Tailwind CSS, Recharts, React Router, Axios.

## Local development
1. npm install
2. Create .env with: VITE_API_URL=http://localhost:4000/api
3. npm run dev (http://localhost:5173)

The backend CRM API must be running - see the backend repo.

## Build
npm run build - static output in dist/.

## Deployment (Vercel)
This repo includes vercel.json with SPA rewrites so deep links (/agent, /campaigns) resolve to index.html.

1. Import the repo in Vercel (framework auto-detected as Vite).
2. Set the env var VITE_API_URL to the hosted backend, for example https://reachly-crm-api.onrender.com/api
3. Deploy.

Backend repo: https://github.com/kaushalv17/xeno-reachly-backend-