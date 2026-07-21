# Push to GitHub + deploy on Vercel

The app is already committed locally on `main` at:

`/Users/katerynagolushko/gtm-sprint`

## Option A — GitHub CLI (fastest)

```bash
cd /Users/katerynagolushko/gtm-sprint
gh auth login
gh repo create gtm-sprint --public --source=. --remote=origin --push
```

Then open [vercel.com/new](https://vercel.com/new), import `gtm-sprint`, deploy (Vite defaults).

## Option B — GitHub website upload

1. Create a new empty repo on GitHub (no README).
2. Run:

```bash
cd /Users/katerynagolushko/gtm-sprint
git remote add origin https://github.com/YOUR_USER/gtm-sprint.git
git push -u origin main
```

3. Import that repo in Vercel.

## Option C — Vercel without GitHub first

```bash
cd /Users/katerynagolushko/gtm-sprint
npx vercel
```

Link to GitHub later from the Vercel project settings.

## Build settings (Vercel)

| Setting | Value |
|---|---|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install | `npm install` |

`vercel.json` already rewrites all routes to `index.html` for React Router.

## Supabase (required for login)

After deploy, set on the Vercel project:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Then run `supabase/schema.sql` in the Supabase SQL editor and configure Auth redirect URLs. Full steps: [SUPABASE.md](./SUPABASE.md).
