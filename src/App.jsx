/* ============================================================
   APP — Root component assembling all sections
   ============================================================ */
import { useState, useCallback, Suspense, lazy } from 'react';

import { AdminProvider } from './context/AdminContext';
import { SoundProvider } from './context/SoundContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminBar    from './components/AdminBar/AdminBar';
import Loader      from './components/Loader/Loader';
import Cursor      from './components/Cursor/Cursor';
import CommandPalette from './components/CommandPalette/CommandPalette';
import GuideMascot from './components/GuideMascot/GuideMascot';
import Navbar      from './components/Navbar/Navbar';
import Hero        from './components/Hero/Hero';
import About       from './components/About/About';
import Philosophy  from './components/Philosophy/Philosophy';
import Story       from './components/Story/Story';
import { SiteSettingsProvider } from './context/SiteSettingsContext';

// Below-the-fold sections are code-split so the initial bundle
// (and therefore first paint / LCP of the Hero) stays lean.
// Above-the-fold sections (Hero, About, Philosophy, Story) stay
// as regular imports so they're ready immediately.
const Skills     = lazy(() => import('./components/Skills/Skills'));
const Experience = lazy(() => import('./components/Experience/Experience'));
const Projects   = lazy(() => import('./components/Projects/Projects'));
const Freelance  = lazy(() => import('./components/Freelance/Freelance'));
const FAQ        = lazy(() => import('./components/FAQ/FAQ'));
const Contact    = lazy(() => import('./components/Contact/Contact'));
const Footer     = lazy(() => import('./components/Footer/Footer'));

// Minimal, non-jarring fallback — reserves some space to reduce
// layout shift while a chunk loads (usually near-instant on a
// warm cache, briefly visible on first load / slow connections).
const SectionFallback = () => <div style={{ minHeight: '30vh' }} aria-hidden="true" />;


export default function App() {
  const [loading, setLoading] = useState(true);

  const handleLoaded = useCallback(() => {
    setLoading(false);
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <ThemeProvider>
    <SoundProvider>
    <AdminProvider>
      <SiteSettingsProvider>
      {/* Custom cursor — hidden on mobile */}
      <Cursor />

      {/* ⌘K quick nav */}
      <CommandPalette />

      {/* Theme-aware guide companion, fixed bottom-left */}
      <GuideMascot />

      {/* Cinematic loader */}
      <Loader onComplete={handleLoaded} />

      {/* Main site — rendered but hidden under loader */}
      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        <Navbar />

        <main>
          <Hero />
          <About />
          <Philosophy />
          <Story />
          <Suspense fallback={<SectionFallback />}><Skills /></Suspense>
          <Suspense fallback={<SectionFallback />}><Experience /></Suspense>
          <Suspense fallback={<SectionFallback />}><Projects /></Suspense>
          <Suspense fallback={<SectionFallback />}><Freelance /></Suspense>
          <Suspense fallback={<SectionFallback />}><FAQ /></Suspense>
          <Suspense fallback={<SectionFallback />}><Contact /></Suspense>
        </main>

        <Suspense fallback={null}><Footer /></Suspense>
      </div>

      {/* Floating admin login / status pill */}
      <AdminBar />

    </SiteSettingsProvider>
  </AdminProvider>
  </SoundProvider>
  </ThemeProvider>
);
}
