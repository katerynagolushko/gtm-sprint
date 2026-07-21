-- Run this in Supabase → SQL Editor → New query → Run

create table if not exists public.sprint_states (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.sprint_states enable row level security;

create policy "Users read own sprint state"
  on public.sprint_states for select
  using (auth.uid() = user_id);

create policy "Users insert own sprint state"
  on public.sprint_states for insert
  with check (auth.uid() = user_id);

create policy "Users update own sprint state"
  on public.sprint_states for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own sprint state"
  on public.sprint_states for delete
  using (auth.uid() = user_id);
