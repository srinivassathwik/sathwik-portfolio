# Contact Form → Supabase Setup (free, no backend server)

Replaces the old Flask backend. Two parts: (1) the database table
[required], and (2) instant email alerts [optional but recommended].

## 1. Create the `messages` table

1. Supabase Dashboard → your project → **SQL Editor** → New query
2. Open `supabase/messages_migration.sql` from this repo
3. **If you want email alerts**, before running it, replace:
   - `YOUR_PROJECT_REF` → find it in Settings → API → Project URL
     (the part before `.supabase.co`)
   - `YOUR_SUPABASE_ANON_KEY` → Settings → API → `anon` `public` key
     (same value already in your `.env` as `VITE_SUPABASE_ANON_KEY`)
4. If you **don't** want email alerts yet, just delete everything
   from `-- INSTANT EMAIL NOTIFICATION` down to the end before running.
5. Click **Run**

At this point your form already works — test it, then check
**Table Editor → messages** to see the submission. You're done if
you're happy checking the dashboard manually.

## 2. Instant email notifications (optional)

Free via [Resend](https://resend.com) — 3,000 emails/month, no card required.

### a) Get a Resend API key
1. Sign up at resend.com → **API Keys** → Create API Key
2. Copy the key (starts with `re_`)
3. You do **not** need to verify a domain to start — the function
   ships using `onboarding@resend.dev` as the sender, which works
   immediately for sending to your own inbox.

### b) Install the Supabase CLI (one-time)
```bash
npm install -g supabase
supabase login
```

### c) Link your project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### d) Set secrets (these stay server-side — never in your repo)
```bash
supabase secrets set RESEND_API_KEY=re_your_key_here
supabase secrets set NOTIFY_TO_EMAIL=srinivassathwikmaddali@gmail.com
```

### e) Deploy the function
```bash
supabase functions deploy notify-contact
```

### f) Run the trigger SQL
If you skipped the email section in step 1, go back and run it now
(with your real project ref + anon key filled in).

### g) Test it
Submit your contact form → you should get an email within seconds.
If not: Supabase Dashboard → **Edge Functions → notify-contact →
Logs** will show you exactly what failed.

---

**Later, once you have a custom domain:** verify it in Resend
(Domains → Add Domain, add the DNS records they give you), then
change the `from` address in
`supabase/functions/notify-contact/index.ts` from
`onboarding@resend.dev` to something like `contact@yourdomain.com`,
and redeploy with `supabase functions deploy notify-contact`.
