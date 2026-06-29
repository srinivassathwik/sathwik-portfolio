/* ============================================================
   useProfilePicture
   ============================================================
   - Fetches the current profile picture URL from the
     `site_settings` table (key = 'profile_picture_url').
   - uploadPicture(file) uploads to Supabase Storage bucket
     'site-assets' and updates the URL in site_settings.
   - Falls back to `null` (caller shows a placeholder) if
     Supabase isn't configured or nothing has been uploaded yet.
   ============================================================ */
import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export function useProfilePicture() {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUrl = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'profile_picture_url')
      .maybeSingle();

    if (!error && data?.value) {
      setUrl(data.value);
    } else {
      setUrl(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUrl();
  }, [fetchUrl]);

  const uploadPicture = async (file) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase not configured' };
    }


    const oldFiles = [
      "profile/profile.jpg",
      "profile/profile.jpeg",
      "profile/profile.png",
      "profile/profile.webp"
    ];

    await supabase.storage
      .from("site-assets")
      .remove(oldFiles);
      
    const ext = file.name.split('.').pop();
    const path = `profile/profile.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: publicData } = supabase.storage
      .from('site-assets')
      .getPublicUrl(path);

    const newUrl = publicData.publicUrl;

    const { error: dbError } = await supabase
      .from('site_settings')
      .upsert({ key: 'profile_picture_url', value: newUrl, updated_at: new Date().toISOString() });

    if (dbError) {
      return { error: dbError.message };
    }

    setUrl(newUrl);
    return { url: newUrl, error: null };
  };

  return { url, loading, uploadPicture, refresh: fetchUrl };
}
