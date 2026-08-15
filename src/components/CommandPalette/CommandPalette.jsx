/* ============================================================
   COMMAND PALETTE — ⌘K / Ctrl+K quick nav + actions
   Opens via keyboard shortcut, the navbar trigger button, or by
   dispatching a global 'open-command-palette' event.
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personal } from '../../data/portfolioData';
import { useSoundContext } from '../../context/SoundContext';
import { useThemeContext } from '../../context/ThemeContext';
import './CommandPalette.css';

const SECTION_COMMANDS = [
  { id: 'hero',       label: 'Home',       hint: 'Back to top',        href: '#hero' },
  { id: 'about',      label: 'About',      hint: 'Who I am',           href: '#about' },
  { id: 'story',      label: 'Story',      hint: 'Timeline',           href: '#story' },
  { id: 'skills',     label: 'Skills',     hint: 'What I work with',   href: '#skills' },
  { id: 'experience', label: 'Experience', hint: 'Work history',       href: '#experience' },
  { id: 'projects',   label: 'Projects',   hint: "Things I've built",  href: '#projects' },
  { id: 'freelance',  label: 'Freelance',  hint: 'Services offered',   href: '#freelance' },
  { id: 'faq',        label: 'FAQ',        hint: 'Common questions',   href: '#faq' },
  { id: 'contact',    label: 'Contact',    hint: 'Get in touch',       href: '#contact' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const listRef  = useRef(null);
  const { muted, toggleMute, playClick } = useSoundContext();
  const { theme, setTheme, shuffleTheme, themes } = useThemeContext();

  const themeCommands = useMemo(() => ([
    {
      id: 'shuffle-theme', label: 'Shuffle theme', hint: 'Random new look',
      action: () => shuffleTheme(),
    },
    ...themes.map(t => ({
      id: `theme-${t.id}`,
      label: `Switch to ${t.label}${theme === t.id ? ' (current)' : ''}`,
      hint: t.blurb,
      action: () => setTheme(t.id),
    })),
  ]), [themes, theme, setTheme, shuffleTheme]);

  const actionCommands = useMemo(() => ([
    {
      id: 'github', label: 'Open GitHub', hint: 'github.com/srinivassathwik ↗',
      action: () => window.open(personal.github, '_blank', 'noopener'),
    },
    {
      id: 'linkedin', label: 'Open LinkedIn', hint: 'linkedin.com ↗',
      action: () => window.open(personal.linkedin, '_blank', 'noopener'),
    },
    {
      id: 'email', label: 'Copy email address', hint: personal.email,
      action: () => {
        navigator.clipboard?.writeText(personal.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
    {
      id: 'resume', label: 'Download resume', hint: 'Full-time version, PDF',
      action: () => {
        const a = document.createElement('a');
        a.href = personal.resumeFullTime;
        a.download = '';
        a.click();
      },
    },
    {
      id: 'sound', label: muted ? 'Turn sound on' : 'Turn sound off', hint: 'Toggle UI sound',
      action: () => toggleMute(),
    },
  ]), [muted, toggleMute]);

  const commands = useMemo(() => {
    const navCommands = SECTION_COMMANDS.map(c => ({
      ...c,
      action: () => document.querySelector(c.href)?.scrollIntoView({ behavior: 'smooth' }),
    }));
    return [...navCommands, ...actionCommands, ...themeCommands];
  }, [actionCommands, themeCommands]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(c =>
      c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q)
    );
  }, [query, commands]);

  useEffect(() => { setActiveIndex(0); }, [query, open]);

  // Global open triggers: keyboard shortcut + custom event (for the navbar button)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onExternalOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', onExternalOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-palette', onExternalOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [open]);

  useEffect(() => {
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const runCommand = (cmd) => {
    playClick();
    cmd.action();
    if (cmd.id !== 'email' && cmd.id !== 'sound') setOpen(false);
  };

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIndex]) runCommand(filtered[activeIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="cmdk-panel"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <div className="cmdk-input-row">
              <span className="cmdk-icon font-mono">/</span>
              <input
                ref={inputRef}
                className="cmdk-input"
                placeholder="Jump to a section or run a command…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onInputKey}
              />
              <span className="cmdk-esc font-mono">ESC</span>
            </div>

            <div className="cmdk-list" ref={listRef}>
              {filtered.length === 0 && (
                <div className="cmdk-empty">No matches.</div>
              )}
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  className={`cmdk-item ${i === activeIndex ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => runCommand(cmd)}
                >
                  <span className="cmdk-item-label">{cmd.label}</span>
                  <span className="cmdk-item-hint font-mono">
                    {cmd.id === 'email' && copied ? 'Copied ✓' : cmd.hint}
                  </span>
                </button>
              ))}
            </div>

            <div className="cmdk-footer font-mono">
              <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <span><kbd>esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
