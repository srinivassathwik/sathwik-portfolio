import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

export function useStory() {
  const [story, setStory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStory = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    console.log("Loading Story...");

    const { data, error } = await supabase
      .from("story")
      .select("*")
      .order("display_order", { ascending: true });

    console.log("Story Data:", data);
    console.log("Setting state:", data);
    console.log("Story Error:", error);

    if (!error) {
      setStory(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadStory();
  }, []);

  const addStory = async (item) => {
    const { error } = await supabase
      .from("story")
      .insert(item);

    if (!error) {
      await loadStory();
    }

    return error;
  };

  const updateStory = async (id, values) => {
    const { error } = await supabase
      .from("story")
      .update(values)
      .eq("id", id);

    if (!error) {
      await loadStory();
    }

    return error;
  };

  const deleteStory = async (id) => {
    const { error } = await supabase
      .from("story")
      .delete()
      .eq("id", id);

    if (!error) {
      await loadStory();
    }

    return error;
  };

  return {
    story,
    loading,
    addStory,
    updateStory,
    deleteStory,
    refreshStory: loadStory,
  };
}