import { fileURLToPath } from 'node:url'
// https://nuxt.com/docs/api/configuration/nuxt-config
import manifest from './manifest'
import { F1ApiMode } from './shared/utils/f1ApiMode.ts'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  runtimeConfig: {
    /** Только в папке server */
    f1BaseUrl: 'https://api.openf1.org/v1',
    f1ApiMode: F1ApiMode.Live,
  },
  imports: {
    dirs: [
      '~/composables/**',
      '~~/shared/utils/**',
    ],
  },
  extends: [
    '@multi/ui',
  ],
  modules: [
    '@nuxt/eslint',
    '@vite-pwa/nuxt',
    'nuxt-open-fetch',
    '@vueuse/nuxt',
  ],
  eslint: { config: { standalone: false } },
  /** Pit wall только тёмный: класс dark сразу в HTML, переключателя нет */
  ui: { colorMode: false },
  app: {
    head: {
      title: 'Формула 1',
      htmlAttrs: { class: 'dark' },
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
  openFetch: {
    clients: {
      f1: {
        baseURL: '/api/f1', /** Ходит на наш сервак nitro */
        schema: './specs/f1.yaml',
      },
    },
  },
  nitro: {
    devStorage: {
      mocks: { driver: 'fs', base: './server/mocks/f1' },
    },
  },
  css: [fileURLToPath(new URL('./app/assets/css/main.css', import.meta.url))],
  fonts: {
    families: [
      {
        name: 'Roboto Flex',
        subsets: ['cyrillic', 'latin'],
        styles: ['normal'],
        weights: ['100 1000'],
        providerOptions: {
          google: {
            experimental: {
              variableAxis: {
                wdth: [['25', '151']],
                slnt: [['-10', '0']],
              },
            },
          },
        },
      },
      { name: 'Geist', subsets: ['cyrillic', 'latin'], styles: ['normal'] },
      { name: 'JetBrains Mono', subsets: ['cyrillic', 'latin'], styles: ['normal'] },
    ],
  },
})
