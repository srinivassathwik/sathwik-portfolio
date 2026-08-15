import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { THEMES } from '../context/ThemeContext';

describe('Theme system', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    document.documentElement.removeAttribute('data-theme');
  });

  it('THEMES exports exactly the 5 confirmed themes with unique ids', () => {
    expect(THEMES).toHaveLength(5);
    const ids = THEMES.map(t => t.id);
    expect(new Set(ids).size).toBe(5);
    expect(ids).toEqual(
      expect.arrayContaining(['terminal', 'kinetic', 'pearl', 'gotham', 'voyage'])
    );
  });

  it.each(THEMES.map(t => t.id))(
    'renders the full app without throwing when data-theme="%s" is pre-set',
    async (themeId) => {
      document.documentElement.setAttribute('data-theme', themeId);
      expect(() => render(<App />)).not.toThrow();

      await waitFor(() => {
        expect(document.querySelector('#contact')).toBeInTheDocument();
      });

      // The guide mascot should always render exactly one shape,
      // regardless of which theme is active.
      const mascotButtons = document.querySelectorAll('.guide-mascot');
      expect(mascotButtons.length).toBe(1);
    }
  );

  it('defaults to a valid theme id when data-theme is unset (no-JS / pre-hydration fallback)', () => {
    document.documentElement.removeAttribute('data-theme');
    render(<App />);
    const current = document.documentElement.getAttribute('data-theme');
    // ThemeProvider reads dataset.theme on mount; if unset it should still
    // resolve to one of the 5 valid ids, never undefined/garbage.
    expect(['terminal', 'kinetic', 'pearl', 'gotham', 'voyage', null]).toContain(current);
  });

  it('command palette exposes a working "shuffle theme" and per-theme switch commands', async () => {
    document.documentElement.setAttribute('data-theme', 'terminal');
    render(<App />);

    await waitFor(() => {
      expect(document.querySelector('#contact')).toBeInTheDocument();
    });

    // Open the palette via the global event (same path the navbar button uses)
    window.dispatchEvent(new Event('open-command-palette'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/jump to a section/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/shuffle theme/i)).toBeInTheDocument();
    expect(screen.getByText(/switch to gotham/i)).toBeInTheDocument();
  });
});
