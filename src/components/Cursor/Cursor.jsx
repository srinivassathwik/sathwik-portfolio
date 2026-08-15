/* ============================================================
   CURSOR — Custom animated cursor
   - Trailing ring + snappy dot (original behaviour)
   - Contextual label on hover via data-cursor-text="View"
   - Magnetic pull on elements with data-magnetic="0.35"
   - Click state (ring compresses)
   - Uses event delegation, so it correctly picks up elements
     that load asynchronously from Supabase (project cards,
     skill pills, etc.) with zero extra wiring.
   ============================================================ */
import { useEffect, useRef, useState } from 'react';
import './Cursor.css';

const HOVER_SELECTOR = 'a, button, [data-cursor-hover]';
const MAGNET_SELECTOR = '[data-magnetic]';

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const isTouch = window.matchMedia('(max-width: 768px)').matches
      || window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, raf;
    let activeMagnet = null;

    const resetMagnet = () => {
      if (activeMagnet) {
        activeMagnet.style.transform = '';
        activeMagnet = null;
      }
    };

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mouseX + 'px';
        dotRef.current.style.top  = mouseY + 'px';
      }

      const magnet = e.target.closest?.(MAGNET_SELECTOR);
      if (magnet) {
        activeMagnet = magnet;
        const strength = parseFloat(magnet.getAttribute('data-magnetic')) || 0.3;
        const rect = magnet.getBoundingClientRect();
        const relX = mouseX - (rect.left + rect.width / 2);
        const relY = mouseY - (rect.top + rect.height / 2);
        magnet.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
      } else if (activeMagnet) {
        resetMagnet();
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = ringX + 'px';
        ringRef.current.style.top  = ringY + 'px';
      }
      raf = requestAnimationFrame(animate);
    };

    const onOver = (e) => {
      const el = e.target.closest?.(HOVER_SELECTOR);
      if (!el) return;
      ringRef.current?.classList.add('hovering');
      const text = el.getAttribute('data-cursor-text');
      if (text) setLabel(text);
    };

    const onOut = (e) => {
      const el = e.target.closest?.(HOVER_SELECTOR);
      if (!el) return;
      const goingTo = e.relatedTarget?.closest?.(HOVER_SELECTOR);
      if (goingTo === el) return;
      ringRef.current?.classList.remove('hovering');
      setLabel('');
    };

    const onDown = () => ringRef.current?.classList.add('clicking');
    const onUp   = () => ringRef.current?.classList.remove('clicking');

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout',  onOut);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup',   onUp);

    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup',   onUp);
      resetMagnet();
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef}>
        {label && <span className="cursor-label font-mono">{label}</span>}
      </div>
    </>
  );
}
