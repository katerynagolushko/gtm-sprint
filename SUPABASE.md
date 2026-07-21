# Supabase setup (login + sync)

The app uses Supabase Auth (email/password) and stores each user’s sprint JSON in `sprint_states`.

## 1. Create a project

1. Open [supabase.com](https://supabase.com) → New project.
2. Copy **Project URL** and **anon public** key from **Project Settings → API**.

## 2. Create the table

In **SQL Editor**, paste and run [`supabase/schema.sql`](./supabase/schema.sql).

## 3. Auth settings

**Authentication → Providers → Email**: enabled.

Optional for faster testing: **Authentication → Providers → Email → Confirm email** → off (otherwise signup asks users to confirm before sign-in).

**Authentication → URL Configuration**:

- Site URL: `https://gtm-sprint-nine.vercel.app`
- Redirect URLs:  
  `https://gtm-sprint-nine.vercel.app/**`  
  `http://localhost:5173/**`

## 4. Env vars

**Local** — copy `.env.example` → `.env`:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

**Vercel** → Project → Settings → Environment Variables (Production + Preview):

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | project URL |
| `VITE_SUPABASE_ANON_KEY` | anon key |

Redeploy after saving env vars (Vite inlines them at build time).

## 5. Verify

1. Open the live site → you should land on **Sign in**.
2. **Sign up** with email/password.
3. After login, create a bet → refresh → data should still be there (cloud + local cache).
