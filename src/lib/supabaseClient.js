/* ============================================================
   SUPABASE CLIENT
   Reads connection details from environment variables.
   Set these in your .env file (and in Vercel/Netlify env vars
   for production):

     VITE_SUPABASE_URL=https://xxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-public-key

   Both values are SAFE to expose in the frontend — the anon key
   only allows what your Row Level Security (RLS) policies permit.
   ============================================================ */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'The site will fall back to static data from portfolioData.js.'
  );
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = !!supabase;
