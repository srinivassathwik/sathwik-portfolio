# Srinivas Sathwik Maddali — Portfolio

A premium, cinematic personal portfolio built with React + Vite + Framer Motion.

## 📖 Start here
**`COMPLETE_SETUP_GUIDE.md`** — the full walkthrough from a fresh clone
to a deployed site: Supabase project setup, every table and what it's
for, admin login, contact form + email alerts, the 5-theme system, and
a verification checklist. Read this first.

## 📌 Recent updates
- **5-theme system**: the site picks a random visual theme
  (Terminal Precision / Kinetic / Hyderabad Pearl / Gotham / Voyage)
  on every visit, or link a specific one with `?theme=name`. Switch
  manually via the ⌘K command palette. See Part 8 of the setup guide.
- **Contact form now runs on Supabase** (free, no server to host) —
  see the setup guide. The old Flask backend in `backend/` is
  deprecated (see `backend/DEPRECATED.md`).
- **SEO/GEO/AEO overhaul** — see `SEO_GEO_AEO_STRATEGY.md` for the full
  breakdown (on-page, technical, structured data, off-page, local,
  content quality/E-E-A-T, and AI-answer-engine optimization).
- **New UI systems**: magnetic cursor with hover labels, a muted-by-default
  synthesized sound layer, 3D tilt on project cards, a ⌘K command palette,
  and a theme-aware guide mascot.
- **Test suite added**: `npm test` runs automated render/smoke tests
  covering all 5 themes (vitest + jsdom + testing-library). `npm run lint`
  runs ESLint (there was no config before this update, despite the
  plugins being installed).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── favicon.svg
│   └── assets/            ← Add your photo here
│       └── (your-photo.jpg)
├── src/
│   ├── components/
│   │   ├── Loader/        ← Cinematic entrance animation
│   │   ├── Cursor/        ← Custom animated cursor
│   │   ├── Navbar/        ← Fixed navigation
│   │   ├── Hero/          ← Particle constellation hero
│   │   ├── About/         ← Who you are + code snippet
│   │   ├── Philosophy/    ← Core beliefs cards
│   │   ├── Story/         ← Animated timeline
│   │   ├── Skills/        ← Filterable skill cards
│   │   ├── Experience/    ← Work history + certifications
│   │   ├── Projects/      ← Expandable project showcase
│   │   ├── Freelance/     ← Services offered
│   │   ├── Contact/       ← Glass form + social links
│   │   └── Footer/        ← Minimal footer
│   ├── data/
│   │   └── portfolioData.js  ← ✅ EDIT THIS FILE to update all content
│   ├── styles/
│   │   └── globals.css    ← Design tokens + base styles
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 📸 Adding Your Profile Photo

1. Add your photo to `public/assets/your-photo.jpg`
2. Open `src/components/Hero/Hero.jsx`
3. Find the comment `<!-- ADD YOUR PHOTO HERE -->`
4. Replace the placeholder `<div>` with:

```jsx
<img src="/assets/your-photo.jpg" alt="Srinivas Sathwik Maddali" />
```

## ✏️ Updating Content

All content lives in **`src/data/portfolioData.js`**.

- `personal`      → Name, email, social links, bio
- `about`         → About section text + traits
- `philosophies`  → Philosophy cards
- `story`         → Timeline events
- `skills`        → Technical skills
- `experience`    → Work history
- `certifications`→ Certifications list
- `projects`      → Project cards
- `freelanceServices` → Services offered

## 🎨 Customizing Design

Design tokens are in `src/styles/globals.css`:

```css
:root {
  --accent: #38BDF8;        /* Change accent color */
  --accent-gold: #D4AF37;   /* Gold accent */
  --bg-primary: #0F172A;    /* Main background */
}
```

## 📦 Dependencies

- **React 18** — UI framework
- **Framer Motion** — Animations
- **Tailwind CSS** — Utility styles
- **react-type-animation** — Typing effect
- **Vite** — Build tool

## 🌐 Deployment

```bash
# Build
npm run build

# Deploy dist/ folder to:
# - Vercel (recommended): vercel --prod
# - Netlify: drag & drop dist/
# - GitHub Pages: gh-pages -d dist
```
