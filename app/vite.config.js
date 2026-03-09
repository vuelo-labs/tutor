import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Build output goes to ../app-dist (one level up, at the repo root)
  // Netlify will serve this at /app on the live site
  build: {
    outDir: "../app-dist",
    emptyOutDir: true,
  },
  // In dev mode, proxy /api/claude to Netlify Functions running locally
  server: {
    proxy: {
      "/api": "http://localhost:8888",
    },
  },
})
