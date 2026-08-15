import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// ── matchMedia (used by Cursor, Projects tilt, sound context) ──
window.matchMedia = window.matchMedia || function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
};

// ── IntersectionObserver (used by react-intersection-observer / useInView) ──
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.IntersectionObserver = window.IntersectionObserver || MockIntersectionObserver;
global.IntersectionObserver = global.IntersectionObserver || MockIntersectionObserver;

// ── ResizeObserver ──
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = window.ResizeObserver || MockResizeObserver;
global.ResizeObserver = global.ResizeObserver || MockResizeObserver;

// ── scrollIntoView (used by Navbar, CommandPalette, FAQ links) ──
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || vi.fn();

// ── AudioContext (used by SoundContext) ──
class MockAudioContext {
  state = 'running';
  currentTime = 0;
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }
  createGain() {
    return {
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
    };
  }
  resume() { return Promise.resolve(); }
}
window.AudioContext = MockAudioContext;

// ── clipboard (used by CommandPalette "copy email") ──
Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

// ── canvas 2D context (used by Hero's particle canvas) ──
// jsdom ships a getContext() that exists but returns null (it doesn't
// implement Canvas 2D without the native `canvas` package), so a `||`
// fallback wouldn't catch it — override unconditionally for tests.
HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
});

// ── requestAnimationFrame ──
// Assign on both `window` and bare `global` — some libraries (e.g.
// react-type-animation's internal loop) reference the unprefixed
// global identifier directly. IDs are tracked so any animation loop
// still running at test teardown (e.g. Hero's typing animation, which
// uses repeat={Infinity} and never stops on its own) gets its pending
// callback cleared before it can fire into a torn-down environment —
// that's what was causing an "unhandled rejection: requestAnimationFrame
// is not defined" after the test run finished.
const pendingRafIds = new Set();
const raf = (cb) => {
  const id = setTimeout(() => {
    pendingRafIds.delete(id);
    cb();
  }, 16);
  pendingRafIds.add(id);
  return id;
};
const caf = (id) => {
  pendingRafIds.delete(id);
  clearTimeout(id);
};
window.requestAnimationFrame = raf;
window.cancelAnimationFrame = caf;
global.requestAnimationFrame = raf;
global.cancelAnimationFrame = caf;

// ── unmount cleanly between tests ──
// Without this, effects/timers from one test's render (e.g. Hero's
// rAF draw loop, or the typing animation's infinite repeat) can keep
// firing into the next test and throw once their component has been
// torn down — surfacing as flaky "unhandled rejection" noise that
// has nothing to do with real app bugs.
afterEach(() => {
  cleanup();
  pendingRafIds.forEach((id) => clearTimeout(id));
  pendingRafIds.clear();
});

// react-type-animation's repeat={Infinity} loop (used by Hero's typing
// animation) can re-schedule its next frame from inside its own callback,
// occasionally outliving a single test's synchronous cleanup above and
// firing after environment teardown — impossible in a real browser, which
// always has a global requestAnimationFrame. This narrowly matches only
// that exact known-benign pattern (library name + message) so it can't
// mask an unrelated real regression.
process.on('unhandledRejection', (reason) => {
  const text = String(reason?.stack || reason);
  if (text.includes('react-type-animation') && text.includes('requestAnimationFrame is not defined')) {
    return;
  }
  throw reason;
});
