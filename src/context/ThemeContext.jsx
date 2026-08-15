/* ============================================================
   THEME CONTEXT
   The actual theme SELECTION happens synchronously in an inline
   script in index.html (before React even loads) to avoid a
   flash of the wrong theme on first paint — see the <script>
   right before </head> there. This context just reads whatever
   that script already set on <html data-theme="..."> into React
   state, and lets components (CommandPalette, an admin control,
   etc.) change it afterward.
   ============================================================ */
import { createContext, useContext, useState, useCallback } from 'react';

export const THEMES = [
  { id: 'terminal', label: 'Terminal Precision', blurb: 'Near-black, amber, monospace-led.' },
  { id: 'kinetic',  label: 'Kinetic',             blurb: 'Motion-first, violet/cyan/pink.' },
  { id: 'pearl',    label: 'Hyderabad Pearl',     blurb: 'Warm espresso-dark, italic serif.' },
  { id: 'gotham',   label: 'Gotham',              blurb: 'Dark-noir, signal yellow.' },
  { id: 'voyage',   label: 'Voyage',              blurb: 'Ocean gradient, gold and crimson.' },
];

const THEME_IDS = THEMES.map(t => t.id);

const ThemeContext = createContext({
  theme: 'terminal',
  setTheme: () => {},
  themes: THEMES,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(
    () => document.documentElement.dataset.theme || 'terminal'
  );

  const setTheme = useCallback((id) => {
    if (!THEME_IDS.includes(id)) return;
    document.documentElement.dataset.theme = id;
    setThemeState(id);
  }, []);

  const shuffleTheme = useCallback(() => {
    const others = THEME_IDS.filter(id => id !== theme);
    const next = others[Math.floor(Math.random() * others.length)];
    setTheme(next);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, shuffleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
