/* ============================================================
   LOADER — Cinematic entrance animation
   ============================================================ */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Loader.css';

const letters = "SRINIVAS SATHWIK MADDALI".split('');

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase]       = useState('count'); // 'count' | 'exit'

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setPhase('exit');
            setTimeout(onComplete, 900);
          }, 400);
          return 100;
        }
        return p + Math.random() * 4 + 1;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          className="loader"
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
        >
          {/* Scan line */}
          <div className="loader-scan" />

          {/* Logo letters */}
          <div className="loader-name">
            {letters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: 'easeOut' }}
                className={char === ' ' ? 'loader-space' : ''}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Progress line */}
          <div className="loader-bar-wrap">
            <motion.div
              className="loader-bar"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Counter */}
          <div className="loader-counter">
            <span className="font-mono">{Math.min(Math.round(progress), 100)}</span>
            <span className="loader-pct">%</span>
          </div>

          {/* Bottom line */}
          <div className="loader-tag font-mono">
            Initializing workspace...
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
