# SEO / GEO / AEO Strategy

What's implemented in code vs. what's on you to do — split honestly, with
current (Aug 2026) guidance, not 2023-era advice.

## ⚠️ Read this first: a real content contradiction on your live site

Your **Freelance section** currently says:
> "Available for remote engagements worldwide" / badges: Remote, Worldwide, Fast Response

Your **Contact section** currently says (via the CMS-editable `contact_availability` field):
> "Remote & On-site"

These directly contradict each other, and it matters for more than tone —
it determines whether you're even eligible for a Google Business Profile
(see Local SEO below), and mismatched claims across a page are exactly
the kind of thing that erodes trust with both readers and AI systems
summarizing your site. Pick one and make it consistent. I didn't guess
and silently "fix" this for you, since I can't know which is true.

---

## 1. On-page SEO — done in code

- Single, accurate meta description (found and fixed a real bug: the old
  `index.html` had two conflicting `<meta name="description">` tags —
  only the first is ever read, so the second was silently doing nothing)
- One clean `<h1>` → `<h2>` → `<h3>` hierarchy (verified across every
  section — this was actually already correct, my first grep just missed
  the `<motion.h1>` wrapper)
- Descriptive image alt text (was just "Srinivas", now includes role)
- Canonical tag, robots meta, keywords meta

**Still worth doing:** write unique 1-2 sentence intros for each project
case study that front-load the specific technology + outcome (e.g. "A
RAG-based document processor that cut manual review time by X%") —
concrete numbers and named technologies are what both Google and AI
answer engines extract and quote. Vague marketing language doesn't quote well.

## 2. Technical SEO — done in code

- `preview.png` (1.6MB) → `preview.jpg` (92KB) — was hurting load time
  and OG-image fetch speed for anyone sharing your link
- Code-split the JS bundle: was one 561KB chunk, now lazy-loaded
  per-section + separate vendor chunks — directly improves Largest
  Contentful Paint (LCP), a real Core Web Vitals ranking signal
- Removed 3 unused dependencies (`tsparticles` packages — installed,
  never imported, pure dead weight in every `npm install`)
- `robots.txt`, `sitemap.xml`, JSON-LD structured data (see below)

**Still worth doing:**
- Once you have a custom domain, submit the sitemap in Google Search
  Console and use "Request Indexing" on the homepage — this is the
  single most-skipped step and the reason many portfolios sit unindexed
  for weeks.
- Run your deployed site through PageSpeed Insights after this deploy
  to get a real Core Web Vitals number (I can't measure real network
  conditions from here).

## 3. Structured data (schema.org)

Added `Person` + `WebSite` schema (site-wide, in `index.html`), and
`Service`/`FAQPage` schema generated **directly from the same data
arrays that render the visible content** (`Freelance.jsx`, `FAQ.jsx`) —
this is deliberate: schema that can drift out of sync with what a
visitor actually sees is exactly what gets sites manually penalized.

**Honest caveat on FAQ schema specifically:** as of May 7, 2026, Google
retired the FAQ rich-result snippet (the expandable dropdown in search
results) for every site, no exceptions. `FAQPage` is still valid
schema.org vocabulary and Google says it still parses it for page
understanding, but don't expect it to change how you look in classic
Google search results anymore — its value now is helping AI answer
engines (ChatGPT, Perplexity, AI Overviews) extract clean Q&A pairs, not
winning SERP real estate.

## 4. Off-page SEO (this is 100% on you — no code can do this)

This is usually the highest-leverage thing missing for a personal
portfolio, and it's the one category I can't write code for:

- **Get a real domain.** `sathwik-portfolio-web.onrender.com` shares
  domain authority with every other Render project on that subdomain.
  A domain like `sathwikmaddali.dev` (~$10-15/yr) is the single biggest
  lever available to you.
- **Backlinks from real, relevant sources** beat content volume every
  time: a GitHub README linking to your portfolio, a Dev.to/Hashnode
  article, a submission to a dev-portfolio directory (Lapa Ninja,
  Bestfolios, Awwwards), a mention from a past client or employer.
- **Social profiles pointing back**: make sure LinkedIn, GitHub, and any
  other profile bios link to the live site — these count as citations.
- **Build in public**: a post on X/LinkedIn when you ship something
  drives near-term traffic that a meta tag never will.

## 5. Local SEO / "Google My Business"

Given the Freelance/Contact contradiction above, here's the honest
eligibility picture:

- Google Business Profile requires **either** a real address customers
  physically visit, **or** genuine in-person service delivery (a
  "Service Area Business" — e.g. you go to a client's office in
  Hyderabad for an engagement).
- **Purely remote, online-only service businesses are explicitly not
  eligible** per Google's own guidelines — this includes most freelance
  software/consulting work done entirely over video calls and email.
- If your work really is "remote & on-site" (per your Contact section),
  you likely do qualify as a Service Area Business: verify with a real
  address (kept private, not shown publicly), set your service area to
  Hyderabad + surrounding region, and never list an address you don't
  actually work from — Google suspends listings for that.
- If your work is genuinely "remote worldwide" (per your Freelance
  section) with no in-person component, skip Google Business Profile —
  you won't pass verification, and it's not worth the time.

Either way, I already added `geo.region`/`geo.placename` meta tags and
Hyderabad in your Person schema — that's the low-effort ceiling for
location signals without a real GBP listing.

## 6. Content quality & E-E-A-T (Experience, Expertise, Authority, Trust)

- Your case studies already do the right structure (Challenge → Solution
  → Impact) — keep that, but add real numbers wherever you can honestly
  do so. "Reduced processing time" is weaker than "Reduced processing
  time from 6 hours to 40 minutes."
- **Do not add fabricated testimonials, client quotes, or star
  ratings.** I didn't add any, and you shouldn't either — fake reviews
  are one of the most reliably penalized patterns in modern search, for
  both Google and increasingly for AI systems cross-checking claims.
  If you have real client feedback (even a LinkedIn recommendation
  screenshot or a short quoted permission-granted line), that's worth
  adding. Invented ones are a liability, not an asset.
- A short "Now" or recent-activity note (what you're currently building
  or learning) is a cheap, honest freshness signal — both Google and AI
  crawlers weight recently-updated content more, and it costs you two
  sentences to maintain.

## 7. GEO (Generative Engine Optimization) — being legible to AI systems

- `llms.txt` added — a lightweight, currently-unproven-but-harmless
  convention. Being direct about its actual status: as of 2026, no major
  AI provider (OpenAI, Google, Anthropic) has confirmed they act on it.
  Treat it as free hygiene, not a growth lever.
- The FAQ section is the real GEO play — short, direct, self-contained
  Q&A pairs are exactly what retrieval-augmented AI answers quote well.
  Marketing-voice paragraphs get summarized loosely; direct-answer
  sentences get quoted accurately.
- Your `robots.txt` currently allows all crawlers (`User-agent: * / Allow: /`),
  which includes AI crawlers like GPTBot, ClaudeBot, and PerplexityBot —
  confirmed intentional, not an oversight, since blocking them would mean
  you're invisible to AI answer engines entirely.

## 8. AEO (Answer Engine Optimization)

Practically, this overlaps heavily with #7 — the tactics are the same
(direct answers, clean structure, accurate schema), just aimed at both
Google's classic featured snippets and AI chat answers simultaneously.
The FAQ section, the Person schema, and the case-study structure all
serve both.

---

## Everything that got tested (not just claimed)

- Automated test suite (vitest + jsdom + testing-library): 11/11 passing,
  confirmed stable across repeated runs, zero unhandled errors
- ESLint (there was no config before this — the plugins were installed
  but never actually running): clean, zero errors/warnings, with two
  overly-strict rules explicitly disabled and documented (not silently
  ignored) rather than mass-editing working, pre-existing code
- Production build: clean
- A real bug found and fixed: `Hero.jsx`'s canvas code would crash if
  `getContext('2d')` returned `null` (happens with some privacy
  extensions) — now fails quietly instead
- Dead code found and removed: unused `resumeFile` state in
  `HeroEditor.jsx` (a leftover from before resume upload moved to its
  own component), an unused `CATEGORIES` constant in `Skills.jsx`
