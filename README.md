# GTM Sprint

Founder-facing **customer acquisition sprint** app: weekly acquisition bets, channel playbooks, week-feasibility checks, experiment cards, and a printable [12-week curriculum](/12-week-acquisition-curriculum.html).

## Local

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. In [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework preset: **Vite** (auto-detected).
4. Build command: `npm run build` · Output: `dist` (defaults are fine).
5. Deploy. SPA routes are handled via `vercel.json` rewrites.

Or CLI:

```bash
npm i -g vercel
vercel
```

## What’s included

- Setup → assumptions map → leverage → **acquisition bet builder**
- Motions + tools (outbound, community, content, paid, warm, etc.)
- **Week-feasibility score** (go / stretch / no-go) before activate
- Home: this week’s mission + checklist
- Experiments / learnings loop
- Methodology + company cases
- One-pager curriculum: `/12-week-acquisition-curriculum.html` (Print → PDF)

Data stays in the browser (`localStorage`). No backend.
