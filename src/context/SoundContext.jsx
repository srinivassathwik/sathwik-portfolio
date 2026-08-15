/* ============================================================
   SOUND CONTEXT — subtle synthesized UI sound
   No audio files — every sound is a tiny oscillator blip via
   the Web Audio API, so there's nothing to license or load.
   Muted by default (respecting the visitor + browser autoplay
   rules); persists the visitor's choice in localStorage.
   ============================================================ */
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const SoundContext = createContext({
  muted: true,
  toggleMute: () => {},
  playHover: () => {},
  playClick: () => {},
  playSuccess: () => {},
});

const STORAGE_KEY = 'portfolio_sound_muted';
const INTERACTIVE_SELECTOR = '[data-cursor-hover]';

export function SoundProvider({ children }) {
  const ctxRef = useRef(null);
  const [muted, setMuted] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const getCtx = useCallback(() => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const playTone = useCallback(({ freq = 800, duration = 0.06, type = 'sine', gain = 0.04, glideTo }) => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, ctx.currentTime + duration);
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [getCtx]);

  const playHover = useCallback(() => {
    if (muted) return;
    playTone({ freq: 1400, duration: 0.045, type: 'sine', gain: 0.02 });
  }, [muted, playTone]);

  const playClick = useCallback(() => {
    if (muted) return;
    playTone({ freq: 700, duration: 0.08, type: 'triangle', gain: 0.045, glideTo: 320 });
  }, [muted, playTone]);

  const playSuccess = useCallback(() => {
    if (muted) return;
    playTone({ freq: 660, duration: 0.1, type: 'sine', gain: 0.05 });
    setTimeout(() => playTone({ freq: 990, duration: 0.14, type: 'sine', gain: 0.05 }), 90);
  }, [muted, playTone]);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch { /* ignore */ }
      if (!next) getCtx(); // unlock audio context on the user gesture that unmutes
      return next;
    });
  }, [getCtx]);

  // Global delegated listeners — curated to [data-cursor-hover] so it stays
  // tasteful (primary buttons/cards) instead of firing on every nav link.
  useEffect(() => {
    if (muted) return;
    const onOver = (e) => { if (e.target.closest?.(INTERACTIVE_SELECTOR)) playHover(); };
    const onDown = (e) => { if (e.target.closest?.(INTERACTIVE_SELECTOR)) playClick(); };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onDown);
    };
  }, [muted, playHover, playClick]);

  return (
    <SoundContext.Provider value={{ muted, toggleMute, playHover, playClick, playSuccess }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  return useContext(SoundContext);
}
