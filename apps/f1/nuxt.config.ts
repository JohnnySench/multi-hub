// https://nuxt.com/docs/api/configuration/nuxt-config
import { F1ApiMode } from './shared/utils/f1ApiMode.ts'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    /** Только в папке server */
    f1BaseUrl: 'https://api.openf1.org/v1',
    f1ApiMode: F1ApiMode.Live,
  },
  extends: [
    '@multi/shell',
  ],
  modules: [
    'nuxt-open-fetch',
  ],
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
})
