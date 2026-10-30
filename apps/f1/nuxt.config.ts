import { fileURLToPath } from 'node:url'
// https://nuxt.com/docs/api/configuration/nuxt-config
import manifest from './manifest'
import { F1ApiMode } from './shared/utils/f1ApiMode.ts'

export default defineNuxtConfig({
  vite: {
    server: {
      allowedHosts: ['.trycloudflare.com'],
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  runtimeConfig: {
    /** Только в папке server */
    f1BaseUrl: 'https://api.openf1.org/v1',
    f1ApiMode: F1ApiMode.Live,
    /** Задержка ответа моков в replay, мс — чтобы видеть скелетоны и загрузку */
    f1MockDelay: 0,
    dbUrl: '',
    vapidKeySecret: '',
    vapidSubjectSecret: '',
    public: {
      vapidKey: '',
    },
  },
  typescript: {
    nodeTsConfig: {
      include: ['../drizzle.config.ts'],
      compilerOptions: { types: ['node'] },
    },
  },
  imports: {
    dirs: [
      '~/components/**',
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
    strategies: 'injectManifest',
    srcDir: 'service-worker',
    filename: 'sw.ts',
    registerType: 'autoUpdate',
    /**
     * В режиме injectManifest блок workbox игнорируется — что класть в офлайн-кэш, задаётся здесь.
     * Этот список при сборке подставится в sw.ts вместо self.__WB_MANIFEST
     */
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
      globIgnores: ['screenshots/**'],
    },
    manifest,
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
  openFetch: {
    clients: {
      f1: {
        baseURL: '/api/f1', /** Прокси через nitro */
        schema: './specs/f1.yaml',
      },
    },
  },
  nitro: {
    storage: {
      cache: {
        driver: 'fs',
        base: './.data/cache', /** PROD: Кеш ручек server/api/[...path].ts на диск */
      },
    },
    devStorage: {
      mocks: {
        driver: 'fs',
        base: './server/mocks/f1', /** DEV: Запись ответов ручек для удобства разработки */
      },
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
