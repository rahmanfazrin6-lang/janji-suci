create table if not exists public.wedding_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.wedding_plans enable row level security;

drop policy if exists "Users can read their wedding plan" on public.wedding_plans;
create policy "Users can read their wedding plan"
  on public.wedding_plans for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their wedding plan" on public.wedding_plans;
create policy "Users can insert their wedding plan"
  on public.wedding_plans for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their wedding plan" on public.wedding_plans;
create policy "Users can update their wedding plan"
  on public.wedding_plans for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
