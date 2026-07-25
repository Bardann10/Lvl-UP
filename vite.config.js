import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Lvl-UP/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.svg', 'icons/icon-512.svg', 'splash.svg'],
      manifest: {
        name: 'Lvl-Up',
        short_name: 'Lvl-Up',
        description: 'A personal productivity app for habits, tasks, goals, and planning.',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone',
        start_url: '/Lvl-UP/',
        scope: '/Lvl-UP/',
        id: '/Lvl-UP/',
        orientation: 'portrait',
        categories: ['productivity', 'lifestyle'],
        lang: 'en',
        dir: 'ltr',
        prefer_related_applications: false,
        icons: [
          {
            src: '/Lvl-UP/icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/Lvl-UP/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/Lvl-UP/icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable'
          },
          {
            src: '/Lvl-UP/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/Lvl-UP/splash.svg',
            sizes: '1280x1280',
            type: 'image/svg+xml',
            form_factor: 'wide'
          }
        ],
        related_applications: [],
        shortcuts: [
          {
            name: 'Today',
            short_name: 'Today',
            description: 'Open the dashboard',
            url: '/Lvl-UP/#/today',
            icons: [{ src: '/Lvl-UP/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' }]
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
