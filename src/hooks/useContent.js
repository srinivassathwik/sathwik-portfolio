/* ============================================================
   useContent — generic hook for portfolio content tables
   ============================================================
   Fetches rows from a Supabase table, ordered by `order_index`.
   If Supabase isn't configured (or the fetch fails / table is
   empty), falls back to the provided static data so the site
   NEVER breaks — it just won't be editable until Supabase is
   set up.

   Returns: { items, loading, addItem, updateItem, deleteItem, refresh }

   addItem/updateItem/deleteItem are no-ops (and warn) if
   Supabase isn't configured.
   ============================================================ */
import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export function useContent(table, fallbackData) {
  const [items, setItems] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(!isSupabaseConfigured);

  const fetchItems = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setItems(fallbackData);
      setUsingFallback(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.warn(`[useContent:${table}] fetch failed, using fallback data:`, error.message);
      setItems(fallbackData);
      setUsingFallback(true);
    } else if (!data || data.length === 0) {
      setItems(fallbackData);
      setUsingFallback(true);
    } else {
      setItems(data);
      setUsingFallback(false);
    }
    setLoading(false);
  }, [table, fallbackData]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item) => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured — cannot add item.');
      return { error: 'Supabase not configured' };
    }
    const maxOrder = items.reduce((max, i) => Math.max(max, i.order_index ?? 0), 0);
    const { data, error } = await supabase
      .from(table)
      .insert([{ ...item, order_index: maxOrder + 1 }])
      .select();

    if (!error) await fetchItems();
    return { data, error: error?.message || null };
  };

  const updateItem = async (id, updates) => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured — cannot update item.');
      return { error: 'Supabase not configured' };
    }
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select();

    if (!error) await fetchItems();
    return { data, error: error?.message || null };
  };

  const deleteItem = async (id) => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured — cannot delete item.');
      return { error: 'Supabase not configured' };
    }
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) await fetchItems();
    return { error: error?.message || null };
  };

  return { items, loading, usingFallback, addItem, updateItem, deleteItem, refresh: fetchItems };
}
