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
      currency: {
        baseURL: 'https://api.frankfurter.dev/v2',
        schema: './openapi/currency/openapi.json',
      },
    },
  },
})
