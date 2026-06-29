import { supabase } from './supabaseClient';

const TABLE = 'site_settings';

/**
 * Get all settings from Supabase
 */
export async function getSettings() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*');

  if (error) {
    return {
      data: {},
      error
    };
  }

  const settings = {};

  data.forEach(item => {
    settings[item.key] = item.value;
  });

  return {
    data: settings,
    error: null
  };
}

/**
 * Save one setting
 */
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

/**
 * Save multiple settings at once
 */
export async function saveSettings(settings) {

  const payload = Object.entries(settings).map(([key, value]) => ({
    key,
    value
  }));

  const { error } = await supabase
    .from(TABLE)
    .upsert(payload, {
      onConflict: 'key'
    });

  return { error };
}