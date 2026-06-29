import { supabase } from './supabaseClient';

const TABLE = 'site_settings';

export async function getSettings() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*');

  if (error) return { error };

  const settings = {};

  data.forEach(item => {
    settings[item.key] = item.value;
  });

  return { data: settings };
}

export async function saveSetting(key, value) {
  const { error } = await supabase
    .from(TABLE)
    .upsert(
      {
        key,
        value
      },
      {
        onConflict: 'key'
      }
    );

  return { error };
}