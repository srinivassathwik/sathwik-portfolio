# Complete setup guide — Supabase, themes, and deployment

Everything needed to get this portfolio from a fresh clone to a fully
working, deployed site. Written assuming zero prior Supabase experience.

---

## Part 1 — Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → sign up (free tier is
   plenty for this project) → **New Project**.
2. Pick an organization, name the project (e.g. `sathwik-portfolio`),
   set a database password (save it somewhere — you likely won't need
   it day-to-day, but you'll want it if you ever connect directly to
   Postgres), pick the region closest to your users (e.g. Mumbai/`ap-south-1`
   for India), and click **Create**. Takes about 2 minutes to provision.
3. Once it's ready: **Settings → API**. You need two values from here
   throughout this guide:
   - **Project URL** — looks like `https://xxxxx.supabase.co`
   - **anon / public key** — a long string starting with `sb_publishable_`
     or `eyJ...`. This is safe to expose in frontend code — it only
     allows what your Row Level Security (RLS) policies permit.

## Part 2 — Connect your local project

1. In the project root, open `.env` (create it from `.env.example` if it
   doesn't exist).
2. Fill in:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. That's it for local dev — `npm run dev` will now talk to your real
   Supabase project. Everything below happens in the Supabase dashboard
   itself (SQL Editor), not in this codebase.

## Part 3 — Create the content tables (CMS)

These power every editable section: Projects, Skills, Experience,
Freelance services, and site-wide settings (hero text, availability,
profile picture URL, resume URL).

1. Supabase dashboard → **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this repo, paste the whole thing,
   click **Run**.
3. What this creates:
   - `projects`, `skills`, `experience`, `freelance_services` — one row
     per item shown on the site, with an `order_index` column that
     controls display order.
   - `site_settings` — a simple key/value table for one-off text (hero
     name, tagline, availability status, profile picture URL). Row
     Level Security here is already set: **anyone can read**, **only a
     logged-in admin can write**.
   - The `site-assets` **storage bucket** — where your profile photo
     and resume PDF actually live. Public read, admin-only write.

### Populate it with your current content

Run `supabase/seed.sql` next (same SQL Editor flow). This inserts your
existing project/skill/experience/freelance content from
`portfolioData.js` into the new tables, so the site looks **identical**
right after migration — the only difference is it's now editable from
the admin UI instead of requiring a code change.

> If you skip this step, the site still works — every section falls
> back to the static data in `portfolioData.js` automatically (see
> `useContent.js`). Seeding just makes that content admin-editable.

## Part 4 — Create your admin login

The admin system uses real Supabase Auth — whoever can log in with
these credentials can edit content and view contact messages.

1. Dashboard → **Authentication → Users → Add user**.
2. Enter your email + a strong password. Toggle **Auto Confirm User**
   on (skips email verification, fine for a single-owner admin account).
3. That's your login for the **Admin login** pill on the live site
   (bottom-right corner).
4. Create exactly **one** user here — the code treats any logged-in
   session as admin (see `AdminContext.jsx`), which is intentional
   for a single-owner portfolio, but means you shouldn't add a second
   user unless you also want them to have full edit access.

## Part 5 — Contact form (messages table)

1. Open `supabase/messages_migration.sql`.
2. **If you want instant email alerts on new messages** (recommended,
   see Part 6 first before running this), fill in `YOUR_PROJECT_REF`
   and `YOUR_SUPABASE_ANON_KEY` in the file (same values as your `.env`).
   **If you don't want email alerts**, delete everything from
   `-- INSTANT EMAIL NOTIFICATION` to the end of the file before running.
3. Run it in the SQL Editor.
4. What this creates: a `messages` table where the contact form
   inserts directly from the browser (no backend server). RLS: anyone
   can submit, only the logged-in admin can read/delete. You can
   always view submissions in **Table Editor → messages**, or in the
   in-site **Messages** panel next to the Admin login pill.

## Part 6 — Email notifications (optional but recommended)

Free via [Resend](https://resend.com) — 3,000 emails/month, no card.

```bash
# 1. Sign up at resend.com, grab an API key (starts with re_)
#    No domain verification needed to start — the function ships
#    using onboarding@resend.dev, which works immediately.

# 2. Install the Supabase CLI (one-time)
npm install -g supabase
supabase login

# 3. Link this project
supabase link --project-ref YOUR_PROJECT_REF

# 4. Set secrets (stay server-side, never in your repo)
supabase secrets set RESEND_API_KEY=re_your_key_here
supabase secrets set NOTIFY_TO_EMAIL=srinivassathwikmaddali@gmail.com

# 5. Deploy
supabase functions deploy notify-contact

# 6. Go back to Part 5 step 2 and run messages_migration.sql with
#    the email section included, if you hadn't already.
```

Test: submit your own contact form → check your inbox within seconds.
If nothing arrives: **Edge Functions → notify-contact → Logs** in the
dashboard shows exactly what failed.

**Later, with a custom domain:** verify it in Resend (Domains → Add
Domain), then change the `from` address in
`supabase/functions/notify-contact/index.ts` from `onboarding@resend.dev`
to `contact@yourdomain.com`, and redeploy with the same command from
step 5.

## Part 7 — Verify everything end to end

Checklist, in order:

- [ ] `npm run dev` — site loads, no red errors in the browser console
- [ ] Open **Admin login** (bottom-right) → log in with your Part 4
      credentials → pill should switch to "Admin mode"
- [ ] While logged in, edit any section (pencil icons appear) → save →
      refresh the page → change persisted
- [ ] Log out, submit the contact form as a visitor → check
      **Table Editor → messages** in Supabase → row appears
- [ ] If you set up Part 6, check your email arrived too
- [ ] Log back in as admin → click **Messages** in the admin bar →
      your test submission appears there

If any step fails, the most common causes are: `.env` values don't
match your project (Part 2), RLS policy typo if you hand-edited the
SQL, or (for email) a secret not set correctly (Part 6, step 4).

---

## Part 8 — The 5-theme system

A quick reference for how theming actually works, since it's new
architecture:

- **Selection**: an inline script in `index.html` picks a random theme
  (or honors `?theme=name` in the URL) before the page paints — so
  there's never a flash of the wrong theme. Try
  `yoursite.com/?theme=gotham` to link a specific one.
- **The 5 ids**: `terminal`, `kinetic`, `pearl`, `gotham`, `voyage`.
- **Manual switching**: open the command palette (⌘K, or the pill in
  the navbar) and type "theme" — every theme plus "Shuffle theme" is
  in there.
- **Where the colors live**: `src/styles/themes.css` — one
  `[data-theme="..."]` block per theme, all using the same variable
  names (`--accent`, `--bg-primary`, `--font-display`, etc.) that
  every component already reads. To adjust a theme's palette, edit
  the relevant block there — no component files need to change.
- **Admin UI is intentionally NOT themed** — the edit modals, admin
  login, and messages inbox stay on a fixed dark skin regardless of
  which public theme is showing. That's deliberate: visitors never see
  those screens, and you (the one actually using them to edit content)
  benefit more from a stable, predictable editing experience than from
  having your CMS randomly re-skin itself.
- **Adding a 6th theme later**: copy one of the 5 blocks in
  `themes.css`, change the values, add the id to the `THEMES` array in
  `src/context/ThemeContext.jsx` and the `THEMES`/`BG_COLORS` arrays in
  `index.html`'s inline script.

---

## Part 9 — Deployment

1. Push this repo to GitHub (or wherever your Render deploy pulls from).
2. In your hosting provider's dashboard, set the same two environment
   variables from Part 2 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
   under **Environment**.
3. Build command: `npm install && npm run build`. Publish directory: `dist`.
4. No backend server needed — the old Flask backend in `backend/` is
   fully retired (see `backend/DEPRECATED.md`), and everything (CMS,
   contact form, auth) talks directly to Supabase from the browser.
5. Once live, run through the **Part 7 checklist** again against the
   real deployed URL — local dev passing doesn't guarantee production
   env vars are set correctly.
