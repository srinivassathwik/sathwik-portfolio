/* ============================================================
   APP — Root component assembling all sections
   ============================================================ */
import { useState, useCallback } from 'react';

import { AdminProvider } from './context/AdminContext';
import AdminBar    from './components/AdminBar/AdminBar';
import Loader      from './components/Loader/Loader';
import Cursor      from './components/Cursor/Cursor';
import Navbar      from './components/Navbar/Navbar';
import Hero        from './components/Hero/Hero';
import About       from './components/About/About';
import Philosophy  from './components/Philosophy/Philosophy';
import Story       from './components/Story/Story';
import Skills      from './components/Skills/Skills';
import Experience  from './components/Experience/Experience';
import Projects    from './components/Projects/Projects';
import Freelance   from './components/Freelance/Freelance';
import Contact     from './components/Contact/Contact';
import Footer      from './components/Footer/Footer';
import { SiteSettingsProvider } from './context/SiteSettingsContext';

export default function App() {
  const [loading, setLoading] = useState(true);

  const handleLoaded = useCallback(() => {
    setLoading(false);
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <AdminProvider>
      <SiteSettingsProvider>
      {/* Custom cursor — hidden on mobile */}
      <Cursor />

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
          <Skills />
          <Experience />
          <Projects />
          <Freelance />
          <Contact />
        </main>

        <Footer />
      </div>

      {/* Floating admin login / status pill */}
      <AdminBar />

    </SiteSettingsProvider>
  </AdminProvider>
);
}
