import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages reste la publication par défaut. Le build Infomaniak utilise
  // une racine absolue afin que le frontend et /api partagent la même origine.
  base: mode === 'self-hosted' ? '/' : '/catalogue-formations/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
}))
