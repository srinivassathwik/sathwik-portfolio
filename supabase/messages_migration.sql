-- ============================================================
--  CONTACT FORM MIGRATION — run this once in Supabase SQL Editor
--  (Project → SQL Editor → New query → paste → Run)
--
--  Replaces the old Flask/SQLite backend. After this, the
--  contact form writes straight to Supabase from the browser,
--  and a Postgres trigger pings an Edge Function to email you
--  the moment a message comes in. Zero servers to keep alive.
-- ============================================================

-- ─────────────────────────────────────────────
-- MESSAGES TABLE
-- ─────────────────────────────────────────────
create table if not exists messages (
  id          bigint generated always as identity primary key,
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  read        boolean default false,
  created_at  timestamptz default now()
);

alter table messages enable row level security;

-- Anyone (anonymous visitors) can SUBMIT the contact form...
create policy "Public can insert messages"
  on messages for insert
  to anon
  with check (true);

-- ...but only YOU (logged-in admin) can read/manage them.
create policy "Admin can read messages"
  on messages for select
  to authenticated
  using (true);

create policy "Admin can update messages"
  on messages for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin can delete messages"
  on messages for delete
  to authenticated
  using (true);


-- ─────────────────────────────────────────────
-- INSTANT EMAIL NOTIFICATION (optional but recommended)
--
-- Fires the "notify-contact" Edge Function every time a new
-- message is inserted, which emails you via Resend.
--
-- Requires:
--   1. pg_net extension enabled (this migration enables it)
--   2. The Edge Function deployed: see
--      supabase/functions/notify-contact/index.ts + its README
--   3. Skip this whole section if you chose "just check the
--      dashboard" instead of email alerts — the table above
--      works fine on its own either way.
-- ─────────────────────────────────────────────
create extension if not exists pg_net with schema extensions;

create or replace function notify_new_message()
returns trigger
language plpgsql
security definer
as $$
begin
  perform
    net.http_post(
      url     := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify-contact',
      headers := jsonb_build_object(
                   'Content-Type', 'application/json',
                   'Authorization', 'Bearer YOUR_SUPABASE_ANON_KEY'
                 ),
      body    := jsonb_build_object(
                   'name',    new.name,
                   'email',   new.email,
                   'subject', new.subject,
                   'message', new.message
                 )
    );
  return new;
end;
$$;

drop trigger if exists on_new_message on messages;

create trigger on_new_message
  after insert on messages
  for each row
  execute function notify_new_message();

-- ⚠️ Before running: replace YOUR_PROJECT_REF and
--    YOUR_SUPABASE_ANON_KEY above with your real values
--    (Project → Settings → API). Both are safe to put in this
--    file — they're the same public URL/anon key already in
--    your frontend .env, not secrets.
