// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    /** Только в папке server */
    f1BaseUrl: 'https://api.openf1.org/v1',
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
})
