/* ============================================================
   useMessages — fetch contact form submissions (admin only).
   RLS only allows this to succeed when logged in as admin.
   ============================================================ */
import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export function useMessages(enabled) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!isSupabaseConfigured || !enabled) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setMessages(data || []);
    setLoading(false);
  }, [enabled]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markRead = async (id) => {
    await supabase.from('messages').update({ read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const remove = async (id) => {
    await supabase.from('messages').delete().eq('id', id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  return { messages, loading, refresh: fetchMessages, markRead, remove };
}
