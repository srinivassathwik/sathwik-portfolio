import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

describe('App — full render smoke test', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // Fail the test on any console.error (real React/runtime errors),
    // but allow console.warn (e.g. the expected "Supabase fetch failed,
    // using fallback data" warnings — that's correct defensive behavior,
    // not a bug, since this test environment has no network access to
    // the real Supabase project).
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders without throwing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('renders exactly one H1 with the person\'s name', () => {
    render(<App />);
    const h1s = document.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent).toContain('Srinivas');
  });

  it('renders the navbar with all section links including the new FAQ link', () => {
    render(<App />);
    // Loader wraps the main content in `visibility: hidden` until its
    // intro animation completes, which makes testing-library's
    // accessibility-aware getByRole('navigation') correctly (but
    // unhelpfully, for a structural smoke test) skip it. Query the DOM
    // directly instead — we're checking structure, not a11y-visible state.
    expect(document.querySelector('nav')).toBeInTheDocument();
    expect(screen.getAllByText('FAQ').length).toBeGreaterThan(0);
  });

  it('mounts lazy sections (Skills, Projects, FAQ, Contact, Footer) without crashing', async () => {
    render(<App />);
    // These are React.lazy — give them a tick to resolve their dynamic import.
    await waitFor(() => {
      expect(document.querySelector('#faq')).toBeInTheDocument();
      expect(document.querySelector('#contact')).toBeInTheDocument();
      expect(document.querySelector('#projects')).toBeInTheDocument();
      expect(document.querySelector('footer')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('FAQ section renders valid FAQPage JSON-LD matching the visible questions', async () => {
    render(<App />);
    await waitFor(() => {
      expect(document.querySelector('#faq')).toBeInTheDocument();
    });
    const faqSection = document.querySelector('#faq');
    const schemaScript = faqSection.querySelector('script[type="application/ld+json"]');
    expect(schemaScript).toBeTruthy();
    const schema = JSON.parse(schemaScript.textContent);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity.length).toBeGreaterThan(0);
    // Every question in the schema must also appear as visible text on the page.
    schema.mainEntity.forEach((q) => {
      expect(screen.getByText(q.name)).toBeInTheDocument();
    });
  });

  it('Freelance section renders valid Service JSON-LD once loaded', async () => {
    render(<App />);
    await waitFor(() => {
      expect(document.querySelector('#freelance')).toBeInTheDocument();
    });
    const section = document.querySelector('#freelance');
    const schemaScript = section.querySelector('script[type="application/ld+json"]');
    expect(schemaScript).toBeTruthy();
    const schema = JSON.parse(schemaScript.textContent);
    expect(schema['@type']).toBe('Service');
    expect(schema.hasOfferCatalog.itemListElement.length).toBeGreaterThan(0);
  });

  it('does not throw any real console errors during full mount + lazy load', async () => {
    render(<App />);
    await waitFor(() => {
      expect(document.querySelector('#faq')).toBeInTheDocument();
    });
    // Filter out known-benign React act() warnings from unmanaged timers
    // (Hero's canvas rAF loop, Loader's entrance timer) — those aren't bugs,
    // they're expected in a jsdom test environment without real rAF timing.
    const realErrors = consoleErrorSpy.mock.calls.filter(
      (args) => !String(args[0]).includes('not wrapped in act')
    );
    expect(realErrors).toEqual([]);
  });
});
