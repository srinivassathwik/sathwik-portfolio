# Srinivas Sathwik Maddali — Portfolio

A premium, cinematic personal portfolio built with React + Vite + Framer Motion.

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
