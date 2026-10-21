// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: [
    '@multi/shell',
  ],
  modules: [
    'nuxt-open-fetch',
  ],
  openFetch: {
    clients: {
      f1: {
        baseURL: 'https://api.openf1.org/v1',
        schema: './specs/f1.yaml',
      },
    },
  },
})
