create extension if not exists pgcrypto;

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text,
  artist text,
  genre text,
  description text,
  audio_url text,
  week_label text,
  status text,
  duration text,
  created_at timestamptz default now()
);

create table if not exists public.voters (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text unique,
  created_at timestamptz default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  voter_email text,
  song_id uuid,
  vote_round text,
  created_at timestamptz default now()
);

create table if not exists public.judges (
  id uuid primary key default gen_random_uuid(),
  name text,
  role text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text,
  song_title text,
  genre text,
  description text,
  lyrics text,
  accepted_rules boolean default false,
  review_status text default 'pending',
  created_at timestamptz default now()
);

alter table public.submissions enable row level security;
drop policy if exists "allow public insert submissions" on public.submissions;
drop policy if exists "allow public read submissions" on public.submissions;

create policy "allow public insert submissions"
on public.submissions
for insert
to anon, authenticated
with check (true);

create policy "allow public read submissions"
on public.submissions
for select
to anon, authenticated
using (true);
