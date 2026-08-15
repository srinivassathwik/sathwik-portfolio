import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    // 'threads' (worker_threads) instead of the default 'forks'
    // (child_process) — on Windows, 'forks' commonly times out with
    // "Failed to start forks worker... Timeout waiting for worker to
    // respond", especially inside a OneDrive-synced folder (Downloads
    // is OneDrive-backed by default on Windows 11) or under antivirus
    // real-time scanning, both of which slow down process spawning.
    // Threads avoid spawning separate OS processes entirely.
    pool: 'threads',
    maxWorkers: 1,
    isolate: false,
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});
