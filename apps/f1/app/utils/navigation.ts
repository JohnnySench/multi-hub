export interface NavItem {
  label: string
  icon: `i-lucide-${string}`
  to: string
  badge?: number
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

/** Пункты сайдбара F1 по группам, по ним же строится мобильная навигация */
export const navGroups: NavGroup[] = [
  {
    label: 'Сезон',
    items: [
      { label: 'Обзор', icon: 'i-lucide-layout-dashboard', to: '/' },
      { label: 'Календарь', icon: 'i-lucide-calendar', to: '/calendar', badge: 23 },
      { label: 'Зачёт', icon: 'i-lucide-trophy', to: '/standings' },
    ],
  },
  {
    label: 'Гонка',
    items: [
      { label: 'Результаты', icon: 'i-lucide-timer', to: '/results' },
      { label: 'Повтор гонки', icon: 'i-lucide-map', to: '/replay' },
      { label: 'Race control', icon: 'i-lucide-siren', to: '/race-control' },
      { label: 'Решётка', icon: 'i-lucide-grid-2x2', to: '/grid' },
    ],
  },
  {
    label: 'Пилоты',
    items: [
      { label: 'Пилоты', icon: 'i-lucide-users', to: '/drivers', badge: 22 },
      { label: 'Радио', icon: 'i-lucide-radio', to: '/radio' },
      { label: 'Подписки', icon: 'i-lucide-bell', to: '/subscriptions' },
    ],
  },
  {
    label: 'Анализ',
    items: [
      { label: 'Телеметрия', icon: 'i-lucide-activity', to: '/telemetry' },
      { label: 'Стратегия', icon: 'i-lucide-circle-dot', to: '/strategy' },
    ],
  },
]
