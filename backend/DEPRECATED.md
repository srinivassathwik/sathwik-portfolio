# ⚠️ This backend is no longer used

The contact form now talks to Supabase directly from the browser —
no Flask server, no hosting bill.

- Frontend change: `src/components/Contact/Contact.jsx` now calls
  `supabase.from('messages').insert(...)` instead of `fetch(API_URL + '/api/contact')`.
- Database + email setup: see `supabase/messages_migration.sql`
  and `supabase/functions/notify-contact/` in the project root.
- Full walkthrough: `COMPLETE_SETUP_GUIDE.md` in the project root.

You can safely delete this whole `backend/` folder once you've
confirmed the new flow works (submit the form, check Supabase →
Table Editor → `messages`, and check your inbox if you set up the
email notification). Keeping it around a little longer as a
reference/rollback is fine too — it's just dead code now, not a
dependency.
