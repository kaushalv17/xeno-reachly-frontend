# Reachly — Frontend

React + Vite + **TypeScript** + Tailwind UI for the Reachly AI-native CRM.

## Highlights
- **Agent Console** — chat-first: describe a campaign goal, watch the AI plan it
  (segment → audience preview → drafted message), approve, and launch.
- **Dashboard** — customers, segments, and live campaign funnels.
- **Campaign Detail** — real-time delivery funnel (sent → delivered → read → clicked → converted).

## Setup
\`\`\`bash
npm install
cp .env.example .env     # set VITE_API_URL to your backend URL
npm run dev              # http://localhost:5173
\`\`\`

## Deploy
Vercel — `vercel.json` is included. Set `VITE_API_URL` to the hosted backend.