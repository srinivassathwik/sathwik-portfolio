/* ============================================================
   NAVBAR — Fixed navigation with scroll awareness
   ============================================================ */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const links = [
  { label: 'About',      href: '#about'      },
  { label: 'Story',      href: '#story'       },
  { label: 'Skills',     href: '#skills'      },
  { label: 'Projects',   href: '#projects'    },
  { label: 'Freelance',  href: '#freelance'   },
  { label: 'Contact',    href: '#contact'     },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [active,    setActive]    = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLink = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setActive(href);
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="navbar-inner">
        {/* Logo */}
        <a href="#hero" className="navbar-logo" onClick={e => handleLink(e, '#hero')}>
          <span className="logo-bracket font-mono">&lt;</span>
          <span className="logo-name font-display">SSM</span>
          <span className="logo-bracket font-mono">/&gt;</span>
        </a>

        {/* Desktop links */}
        <ul className="navbar-links">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className={`navbar-link ${active === href ? 'active' : ''}`}
                onClick={e => handleLink(e, href)}
              >
                <span className="link-dot" />
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          className="navbar-cta"
          onClick={e => handleLink(e, '#contact')}
          data-cursor-hover
        >
          Hire Me
        </a>

        {/* Mobile toggle */}
        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`toggle-line ${menuOpen ? 'open-1' : ''}`} />
          <span className={`toggle-line ${menuOpen ? 'open-2' : ''}`} />
          <span className={`toggle-line ${menuOpen ? 'open-3' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="navbar-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {links.map(({ label, href }, i) => (
              <motion.a
                key={href}
                href={href}
                className="mobile-link"
                onClick={e => handleLink(e, href)}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                <span className="mobile-num font-mono">0{i + 1}.</span>
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
