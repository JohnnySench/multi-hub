// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: [
    '@multi/ui',
  ],
  modules: ['@nuxt/eslint'],
  eslint: { config: { standalone: false } },
  app: {
    head: {
      title: 'MULTI',
    },
  },
})
