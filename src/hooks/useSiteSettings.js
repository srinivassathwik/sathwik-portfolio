import { useEffect, useState } from 'react';
import {
  getSettings,
  saveSetting,
  saveSettings
} from '../lib/siteSettings';

export default function useSiteSettings() {

  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {

    setLoading(true);

    const { data, error } = await getSettings();

    if (!error) {
      setSettings(data);
    }

    setLoading(false);
  }

  async function updateSetting(key, value) {

    const { error } = await saveSetting(key, value);

    if (!error) {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }

    return error;
  }

  async function updateSettings(values) {

    const { error } = await saveSettings(values);

    if (!error) {
      setSettings(prev => ({
        ...prev,
        ...values
      }));
    }

    return error;
  }

  return {
    settings,
    loading,
    reload: loadSettings,
    updateSetting,
    updateSettings
  };

}