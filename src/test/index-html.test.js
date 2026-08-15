import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('index.html — static head content', () => {
  const raw = readFileSync(resolve(__dirname, '../../index.html'), 'utf-8');
  // Strip HTML comments before regex-checking tags — otherwise prose
  // inside a <!-- comment --> that happens to mention a tag name gets
  // miscounted as a real tag.
  const html = raw.replace(/<!--[\s\S]*?-->/g, '');

  it('contains exactly one meta description tag (previously had a duplicate — regression check)', () => {
    const matches = html.match(/<meta\s+name="description"/g) || [];
    expect(matches.length).toBe(1);
  });

  it('has a canonical link tag', () => {
    expect(html).toMatch(/<link rel="canonical" href="https?:\/\/[^"]+"/);
  });

  it('embeds valid, parseable JSON-LD containing Person and WebSite types', () => {
    const scriptMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    expect(scriptMatches.length).toBeGreaterThan(0);

    let foundPerson = false;
    let foundWebSite = false;

    scriptMatches.forEach((m) => {
      const json = JSON.parse(m[1]); // throws (and fails the test) if malformed
      const nodes = json['@graph'] || [json];
      nodes.forEach((node) => {
        if (node['@type'] === 'Person') foundPerson = true;
        if (node['@type'] === 'WebSite') foundWebSite = true;
      });
    });

    expect(foundPerson).toBe(true);
    expect(foundWebSite).toBe(true);
  });

  it('references preview.jpg (the optimized image), not the removed 1.6MB preview.png', () => {
    expect(html).not.toMatch(/preview\.png/);
    expect(html).toMatch(/preview\.jpg/);
  });
});
