/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0F172A',
        'bg-secondary': '#111827',
        'accent': '#38BDF8',
        'accent-gold': '#D4AF37',
        'text-primary': '#F8FAFC',
        'text-secondary': '#CBD5E1',
      },
      fontFamily: {
        'syne': ['Syne', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
