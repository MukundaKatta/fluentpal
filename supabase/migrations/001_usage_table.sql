-- Usage table: tracks lessons per user per day (5/day free tier)
create table if not exists public.usage (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  lesson_id  text not null,
  created_at timestamptz not null default now()
);

-- Index for the daily count query
create index if not exists usage_user_date_idx on public.usage (user_id, created_at desc);

-- Row Level Security: users can only read/insert their own rows
alter table public.usage enable row level security;

create policy "Users can view own usage" on public.usage
  for select using (auth.uid() = user_id);

create policy "Users can insert own usage" on public.usage
  for insert with check (auth.uid() = user_id);
