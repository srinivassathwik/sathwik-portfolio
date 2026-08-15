import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split rarely-changing vendor code into its own chunk so
        // browsers can cache it across deploys, and separate the
        // heaviest libraries (framer-motion, tsparticles) so the
        // core app chunk stays small.
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
})
