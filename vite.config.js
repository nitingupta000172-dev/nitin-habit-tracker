import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Bump this string on every deploy to force-clear old caches on all clients.
const CACHE_VERSION = 'v3';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Immediately claim all open tabs on activation so no client runs stale code
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'icons/*.png'],

      manifest: {
        name: 'Nitin Habit Tracker',
        short_name: 'Tracker',
        description: 'Personal habit, workout & journal tracker',
        theme_color: '#f59e0b',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },

      workbox: {
        // Cache version in SW filename forces browsers to install a new SW on every deploy
        swDest: `sw.js`,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        // Remove stale caches from previous SW versions automatically
        cleanupOutdatedCaches: true,

        // Skip waiting so the new SW activates immediately without user needing to close tabs
        skipWaiting: true,
        clientsClaim: true,

        additionalManifestEntries: [
          { url: '/', revision: CACHE_VERSION },
        ],

        runtimeCaching: [
          {
            // Supabase API: network-first, 5-min cache, so offline still works
            urlPattern: /^https:\/\/bmnkpyxkniunszjqcqbq\.supabase\.co/,
            handler: 'NetworkFirst',
            options: {
              cacheName: `supabase-${CACHE_VERSION}`,
              expiration: { maxEntries: 50, maxAgeSeconds: 300 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            // wger exercise images: cache-first, 24h TTL
            urlPattern: /^https:\/\/wger\.de\/api/,
            handler: 'CacheFirst',
            options: {
              cacheName: `wger-${CACHE_VERSION}`,
              expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
            },
          },
          {
            // Google Fonts: stale-while-revalidate
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: `fonts-${CACHE_VERSION}` },
          },
        ],
      },
    }),
  ],
});
