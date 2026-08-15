/* ============================================================
   GUIDE MASCOT — small original moving companion, one shape per
   theme, none of them copied/traced from any franchise (see the
   Gotham/Voyage comments below for why). Patrols in place, shows
   a periodic "click here" bubble, and clicking it scrolls to
   Contact. Hidden on very small screens to avoid crowding
   content on small phones.
   ============================================================ */
import { useThemeContext } from '../../context/ThemeContext';
import './GuideMascot.css';

const COPY = {
  terminal: { bubble: 'run ./contact.sh →' },
  kinetic:  { bubble: "let's talk →" },
  pearl:    { bubble: 'this way →' },
  // The animal, not the costume — see themes.css header comment
  // and the earlier design conversation for why.
  gotham:   { bubble: 'psst — click here →' },
  voyage:   { bubble: 'follow me →' },
};

function MascotShape({ theme }) {
  switch (theme) {
    case 'kinetic':
      return <div className="mascot-blob" />;
    case 'gotham':
      return (
        <svg className="mascot-bat" width="28" height="15" viewBox="0 0 30 16" fill="none">
          <path d="M15 8c-2-5-8-7-15-6 3 2 5 4 6 7-3 0-5 1-6 3 4 1 8 0 10-2 0 2 1 4 2 5 1-1 2-3 2-5 2 2 6 3 10 2-1-2-3-3-6-3 1-3 3-5 6-7-7-1-13 1-15 6h-1z" fill="currentColor"/>
        </svg>
      );
    case 'voyage':
      return (
        <svg className="mascot-boat" width="30" height="24" viewBox="0 0 34 28" fill="none">
          <path d="M4 18h26l-3 6H7l-3-6z" fill="var(--text-primary)"/>
          <path d="M17 18V4l9 8-9 6z" fill="var(--accent-secondary)"/>
          <line x1="17" y1="4" x2="17" y2="18" stroke="var(--bg-primary)" strokeWidth="1.4"/>
        </svg>
      );
    case 'pearl':
      return <div className="mascot-orb" />;
    case 'terminal':
    default:
      return <div className="mascot-cursor">&gt;_</div>;
  }
}

export default function GuideMascot() {
  const { theme } = useThemeContext();
  const copy = COPY[theme] || COPY.terminal;

  const handleClick = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="guide-mascot-wrap">
      <button
        className="guide-mascot"
        onClick={handleClick}
        data-cursor-hover
        data-cursor-text="Contact"
        aria-label="Scroll to contact section"
        title="Scroll to contact"
      >
        <span className="guide-bubble">{copy.bubble}</span>
        <span className={`guide-shape guide-shape--${theme}`}>
          <MascotShape theme={theme} />
        </span>
      </button>
    </div>
  );
}
