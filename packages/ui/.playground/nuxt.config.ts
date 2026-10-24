import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  extends: ['..'],
  modules: ['@nuxt/eslint'],
  css: [fileURLToPath(new URL('../app/assets/css/main.css', import.meta.url))],
  eslint: {
    config: {
      standalone: false,
      // Use the generated ESLint config for lint root project as well
      rootDir: fileURLToPath(new URL('..', import.meta.url)),
    },
  },
})
