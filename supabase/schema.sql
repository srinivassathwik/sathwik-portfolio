-- ============================================================
--  PORTFOLIO CMS SCHEMA — run this once in Supabase SQL Editor
--  (Project → SQL Editor → New query → paste → Run)
-- ============================================================

-- ─────────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────────
create table if not exists projects (
  id          bigint generated always as identity primary key,
  title       text not null,
  subtitle    text,
  client      text,
  year        text,
  category    text,
  description text,
  challenge   text,
  solution    text,
  tech_stack  text[] default '{}',
  impact      text,
  featured    boolean default false,
  color       text default '#38BDF8',
  order_index integer default 0,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────
-- SKILLS
-- ─────────────────────────────────────────────
create table if not exists skills (
  id          bigint generated always as identity primary key,
  name        text not null,
  category    text,
  level       integer default 50,
  order_index integer default 0,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────
-- EXPERIENCE
-- ─────────────────────────────────────────────
create table if not exists experience (
  id           bigint generated always as identity primary key,
  role         text not null,
  company      text,
  period       text,
  location     text,
  type         text,
  achievements text[] default '{}',
  tech_stack   text[] default '{}',
  order_index  integer default 0,
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────────
-- FREELANCE SERVICES
-- ─────────────────────────────────────────────
create table if not exists freelance_services (
  id          bigint generated always as identity primary key,
  title       text not null,
  description text,
  icon        text,
  items       text[] default '{}',
  order_index integer default 0,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────
-- SITE SETTINGS (key-value store for single items
-- like the profile picture URL)
-- ─────────────────────────────────────────────
create table if not exists site_settings (
  key         text primary key,
  value       text,
  updated_at  timestamptz default now()
);

alter table site_settings enable row level security;

create policy "Public read site_settings" on site_settings for select using (true);
create policy "Admin write site_settings" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Seed an empty profile picture entry (frontend falls back to
-- placeholder if this is empty)
insert into site_settings (key, value) values ('profile_picture_url', '')
on conflict (key) do nothing;

-- ============================================================
--  STORAGE BUCKET — for profile picture uploads
--  Run this too (Storage isn't created via plain SQL tables,
--  but this creates the bucket + policies via Supabase's
--  storage schema).
-- ============================================================

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

-- Public read access to files in this bucket
create policy "Public read site-assets"
  on storage.objects for select
  using (bucket_id = 'site-assets');

-- Authenticated users (you) can upload/update/delete
create policy "Admin write site-assets"
  on storage.objects for all
  using (bucket_id = 'site-assets' and auth.role() = 'authenticated')
  with check (bucket_id = 'site-assets' and auth.role() = 'authenticated');
