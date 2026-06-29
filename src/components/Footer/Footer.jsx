/* ============================================================
   FOOTER — Minimal, elegant footer
   ============================================================ */
import { motion } from 'framer-motion';
import { personal } from '../../data/portfolioData';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <div className="footer-logo font-display">SSM</div>
          <p className="footer-tagline font-mono">
            Building quietly. Shipping powerfully.
          </p>
        </div>

        <div className="footer-links">
          {['About', 'Projects', 'Skills', 'Contact'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="footer-link"
              onClick={e => {
                e.preventDefault();
                document.querySelector(`#${item.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="footer-socials">
          <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="footer-social">in</a>
          <a href={personal.github}   target="_blank" rel="noopener noreferrer" className="footer-social">gh</a>
          <a href={`mailto:${personal.email}`} className="footer-social">@</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span className="font-mono footer-copy">
            © {year} Srinivas Sathwik Maddali. All rights reserved.
          </span>
          <span className="footer-craft font-mono">
            Crafted with precision & intentionality.
          </span>
        </div>
      </div>
    </footer>
  );
}
