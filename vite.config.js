import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Lvl-UP/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Lvl-UP',
        short_name: 'Lvl-UP',
        description: 'A personal productivity app for habits, tasks, goals, and planning.',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone',
        start_url: '/Lvl-UP/',
        scope: '/Lvl-UP/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      strategies: 'generateSW',
      srcDir: 'src',
      filename: 'sw.js',
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
