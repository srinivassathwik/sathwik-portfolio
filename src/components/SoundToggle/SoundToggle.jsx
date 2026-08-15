/* ============================================================
   SOUND TOGGLE — small speaker icon, mutes/unmutes UI sound
   ============================================================ */
import { useSoundContext } from '../../context/SoundContext';
import './SoundToggle.css';

export default function SoundToggle() {
  const { muted, toggleMute } = useSoundContext();

  return (
    <button
      className="sound-toggle"
      onClick={toggleMute}
      data-cursor-hover
      data-cursor-text={muted ? 'Sound on' : 'Mute'}
      aria-label={muted ? 'Enable sound' : 'Mute sound'}
      title={muted ? 'Enable sound' : 'Mute sound'}
    >
      {muted ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="17" height="17">
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="17" height="17">
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          <path d="M15.5 8.5a5 5 0 010 7" />
          <path d="M18.5 5.5a9 9 0 010 13" />
        </svg>
      )}
    </button>
  );
}
