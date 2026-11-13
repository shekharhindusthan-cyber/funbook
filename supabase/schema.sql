-- Funbook database setup
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- It is safe to run more than once.

-- 1. Tables -----------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Little Reader',
  avatar text not null default '🦊',
  stars integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  book_slug text not null,
  page_index integer not null default 0,
  completed boolean not null default false,
  score integer,
  updated_at timestamptz not null default now(),
  primary key (user_id, book_slug)
);

create table if not exists public.stickers (
  user_id uuid not null references auth.users (id) on delete cascade,
  sticker text not null,
  label text not null default 'Sticker',
  earned_at timestamptz not null default now(),
  primary key (user_id, sticker)
);

-- 2. Row level security -----------------------------------------------------

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.stickers enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
drop policy if exists "profiles: create own" on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;
drop policy if exists "progress: read own" on public.progress;
drop policy if exists "progress: create own" on public.progress;
drop policy if exists "progress: update own" on public.progress;
drop policy if exists "stickers: read own" on public.stickers;
drop policy if exists "stickers: create own" on public.stickers;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: create own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "progress: read own" on public.progress
  for select using (auth.uid() = user_id);
create policy "progress: create own" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "progress: update own" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "stickers: read own" on public.stickers
  for select using (auth.uid() = user_id);
create policy "stickers: create own" on public.stickers
  for insert with check (auth.uid() = user_id);

-- 3. Create a profile for every new reader ----------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Finish a book: save score, award sticker + stars once ------------------

create or replace function public.complete_book(
  p_slug text,
  p_score integer,
  p_sticker text,
  p_label text,
  p_stars integer
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_new_sticker boolean := false;
  v_stars integer;
begin
  if v_uid is null then
    raise exception 'Not signed in';
  end if;

  insert into public.progress (user_id, book_slug, page_index, completed, score, updated_at)
  values (v_uid, p_slug, 0, true, p_score, now())
  on conflict (user_id, book_slug) do update
    set completed = true,
        score = greatest(coalesce(public.progress.score, 0), excluded.score),
        updated_at = now();

  insert into public.stickers (user_id, sticker, label)
  values (v_uid, p_sticker, p_label)
  on conflict (user_id, sticker) do nothing;

  v_new_sticker := found;

  if v_new_sticker then
    update public.profiles set stars = stars + p_stars where id = v_uid;
  end if;

  select stars into v_stars from public.profiles where id = v_uid;
  return coalesce(v_stars, 0);
end;
$$;

grant execute on function public.complete_book(text, integer, text, text, integer)
  to anon, authenticated;
