# Portfolio CMS Setup Guide (Supabase)

This turns your portfolio into a self-editable site, like Instagram:
visitors just see the content; if YOU log in as admin, you get
edit/add/delete buttons directly on the page. No code edits, no git,
no redeploy needed when you add a new project, skill, or freelance
service.

Sections now editable from the live site (when logged in):
- **Projects**
- **Skills**
- **Experience** (job entries)
- **Freelance Services**
- **Profile picture** (Hero section + About section)

Everything else (About, Hero, Story, Philosophy, contact form) is
unchanged and still works exactly as before.

---

## How it works

- Content lives in a **Supabase** Postgres database (free tier).
- The React site fetches this content on load and renders it.
- If Supabase isn't configured yet, the site falls back to the
  existing hardcoded data in `portfolioData.js` — **the site will
  never break**, it just won't be editable until you finish setup.
- A small floating "Admin login" button appears bottom-right of the
  site. Log in with your Supabase account → edit (✎) and delete
  icons appear on cards, plus "+ Add new ..." buttons.
- Changes save instantly to the database and are visible to all
  visitors immediately — no redeploy.

---

## Step 1 — Create a Supabase project

1. Go to https://supabase.com → Sign up (free) → "New Project"
2. Pick any name/region, set a database password (save it somewhere safe)
3. Wait ~2 minutes for the project to provision

---

## Step 2 — Create the database tables

1. In your Supabase project, open **SQL Editor** (left sidebar)
2. Click **New query**
3. Open `supabase/schema.sql` from this project, copy its entire
   contents, paste into the SQL editor, click **Run**
4. This creates:
   - 4 content tables (`projects`, `skills`, `experience`,
     `freelance_services`) with security rules: anyone can **read**,
     only **logged-in users** (you) can write
   - A `site_settings` table that stores your profile picture URL
   - A **Storage bucket** called `site-assets` (public read, admin
     write) — this is where your uploaded profile photo will live

---

## Step 3 — Load your existing content into the database

1. New query in the SQL Editor
2. Open `supabase/seed.sql`, copy its contents, paste, **Run**
3. This inserts all your current projects, skills, experience, and
   freelance services — so the site looks exactly the same as it
   does now, but now lives in the database and is editable.

---

## Step 4 — Create your admin login

1. In Supabase, go to **Authentication → Users**
2. Click **Add user → Create new user**
3. Enter an email and password (this is YOUR login — pick something
   only you know)
4. Leave "Auto Confirm User" checked, click **Create user**

This is the ONLY account that will exist. Anyone who logs in with
these exact credentials sees the admin edit controls.

---

## Step 5 — Connect your frontend to Supabase

1. In Supabase, go to **Settings → API**
2. Copy the **Project URL** and the **anon public** key
3. Open `.env` in this project's root and fill in:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

4. Restart your dev server (`npm run dev`) — or rebuild for production

These two values are safe to expose publicly (they're meant to be in
frontend code) — security is enforced by the database rules from
Step 2, not by hiding these values.

---

## Step 6 — Test it

1. Run `npm run dev`, open the site
2. You should see content load the same as before
3. Click the **"Admin login"** pill (bottom-right corner)
4. Log in with the email/password from Step 4
5. You should now see:
   - ✎ edit icons on each project, skill, experience, and freelance card
   - "+ Add new ..." buttons at the bottom of each section
6. Try editing a project's description and saving — it updates
   instantly. Open the site in an incognito window (logged out) —
   the change is there for everyone, but no edit icons appear.
7. Hover over your profile photo area in the **Hero** or **About**
   section — while logged in, you'll see an "Upload photo" /
   "Change photo" overlay. Click it, pick an image — it uploads to
   Supabase Storage and updates both spots instantly.

---

## Step 7 — Deploying

### Frontend (recommended: Vercel or Netlify, both free)

1. Push this project to GitHub
2. Import the repo into Vercel/Netlify
3. In the project's **Environment Variables** settings, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your Flask backend URL, once deployed — see below)
4. Deploy. Build command: `npm run build`, output directory: `dist`

### Backend (Flask contact form — optional, recommended: Render)

The Flask backend (`backend/`) is unchanged — it only handles the
contact form email + visitor stats, NOT the portfolio content
anymore. Deploy it to Render's free tier following `backend/SETUP.md`,
then point `VITE_API_URL` at its URL.

---

## Adding new content going forward

Once this is set up, your workflow for "I learned a new skill" or
"I finished a freelance project" is:

1. Open your live site
2. Click **Admin login** (bottom-right), log in
3. Click **"+ Add new skill"** / **"+ Add new project"** / etc.
4. Fill in the form, click **Save**

Done — visible to everyone instantly, no code, no git, no redeploy.

---

## Notes / Limitations

- This is a **single-admin** system — one login (you). That matches
  "I need to log in as admin" from your requirements.
- Certifications and Languages (in the Experience section) remain
  hardcoded in `portfolioData.js` for now — easy to extend the same
  way later if you want them editable too.
- Project links currently show a placeholder "GitHub ↗" — if you want
  per-project GitHub/live links to be editable too, add a `link`
  field to the `projects` table and to `PROJECT_FIELDS` in
  `Projects.jsx`.
- Images aren't part of this CMS yet (your current site doesn't use
  per-project images). If you want image uploads later, Supabase
  Storage handles that well and plugs into the same admin pattern.
