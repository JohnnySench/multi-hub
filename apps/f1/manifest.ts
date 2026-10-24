import type { ModuleOptions } from '@vite-pwa/nuxt'

type Manifest = Exclude<ModuleOptions['manifest'], false | undefined>

export default {
  id: '/',
  name: 'Формула 1',
  short_name: 'F1',
  description: 'Сезон, гонки, телеметрия и стратегия Формулы 1 по данным OpenF1',
  lang: 'ru',
  dir: 'ltr',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'any',
  theme_color: '#08080A',
  background_color: '#08080A',
  categories: ['sports'],
  icons: [
    { src: '/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
    { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  screenshots: [
    {
      src: '/screenshots/f1-wide.png',
      sizes: '1440x900',
      type: 'image/png',
      form_factor: 'wide',
      label: 'Обзор сезона: следующий этап, лидер и зачёт',
    },
    {
      src: '/screenshots/f1-narrow.png',
      sizes: '390x844',
      type: 'image/png',
      form_factor: 'narrow',
      label: 'Обзор сезона на телефоне',
    },
  ],
} satisfies Manifest
