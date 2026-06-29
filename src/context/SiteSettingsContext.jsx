import { createContext, useContext } from 'react';
import useSiteSettings from '../hooks/useSiteSettings';

const SiteSettingsContext = createContext();

export function SiteSettingsProvider({ children }) {

  const site = useSiteSettings();

  return (
    <SiteSettingsContext.Provider value={site}>
      {children}
    </SiteSettingsContext.Provider>
  );

}

export function useSiteSettingsContext() {

  const context = useContext(SiteSettingsContext);

  if (!context) {
    throw new Error(
      'useSiteSettingsContext must be used inside SiteSettingsProvider'
    );
  }

  return context;
}