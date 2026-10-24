// CSS кита (Tailwind + Nuxt UI) приложение подключает само: `@import "@multi/ui/css"` в своём main.css,
// чтобы его @theme и @utility попали в ту же сборку Tailwind
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
})
