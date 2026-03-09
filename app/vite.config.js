import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: tells Vite all assets live under /app on the live site
  // Without this, the built HTML references /assets/... but they're at /app/assets/...
  base: "/engine/",
  build: {
    outDir: "../engine",
    emptyOutDir: true,
  },
  // In dev mode, proxy /api/claude to Netlify Functions running locally
  server: {
    proxy: {
      "/api": "http://localhost:8888",
    },
  },
})
