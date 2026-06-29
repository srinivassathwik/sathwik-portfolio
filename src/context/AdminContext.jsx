/* ============================================================
   ADMIN CONTEXT
   Provides:
     - isAdmin     : true if a Supabase auth session exists
     - loading     : true while session is being checked
     - login(email, password)
     - logout()

   Any logged-in Supabase user is treated as admin. Since this
   is a personal portfolio, create exactly ONE user in your
   Supabase project (Authentication → Users → Add user) and
   that becomes your admin account.
   ============================================================ */
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AdminContext = createContext({
  isAdmin: false,
  loading: false,
  login: async () => ({ error: 'Supabase not configured' }),
  logout: async () => {},
});

export function AdminProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!isSupabaseConfigured) return { error: 'Supabase not configured' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const logout = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  const value = {
    isAdmin: !!session,
    loading,
    login,
    logout,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  return useContext(AdminContext);
}
