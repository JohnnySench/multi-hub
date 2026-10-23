// https://nuxt.com/docs/api/configuration/nuxt-config

import manifest from './manifest'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: [
    '@multi/f1',
  ],
  modules: [
    '@vite-pwa/nuxt',
  ],
  app: {
    head: {
      meta: [
        { name: 'theme-color', content: manifest.theme_color },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' },
      ],
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest,
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
      globIgnores: ['screenshots/**'],
      // SSR: страницы не пререндерятся, кэшировать «/» как запасной ответ нельзя
      navigateFallback: null,
    },
    devOptions: {
      enabled: true,
    },
  },
})
