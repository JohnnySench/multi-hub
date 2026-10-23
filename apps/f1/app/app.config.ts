export default defineAppConfig({
  apps: [
    {
      to: '/f1',
      name: 'f1',
      title: 'Формула 1',
      icon: 'i-lucide-flag',
      theme: 'f1',
      nav: [
        {
          label: 'Сезон',
          items: [
            {
              label: 'Обзор',
              icon: 'i-lucide-layout-dashboard',
              to: '/f1',
            },
            {
              label: 'Календарь',
              icon: 'i-lucide-calendar',
              to: '/f1/calendar',
            },
            {
              label: 'Зачёт',
              icon: 'i-lucide-trophy',
              to: '/f1/standings',
            },
          ],
        },
        {
          label: 'Гонка',
          items: [
            {
              label: 'Результаты',
              icon: 'i-lucide-timer',
              to: '/f1/results',
            },
            {
              label: 'Повтор гонки',
              icon: 'i-lucide-map',
              to: '/f1/replay',
            },
            {
              label: 'Race control',
              icon: 'i-lucide-siren',
              to: '/f1/race-control',
            },
            {
              label: 'Решётка',
              icon: 'i-lucide-grid-2x2',
              to: '/f1/grid',
            },
          ],
        },
        {
          label: 'Пилоты',
          items: [
            {
              label: 'Пилоты',
              icon: 'i-lucide-users',
              to: '/f1/drivers',
            },
            {
              label: 'Радио',
              icon: 'i-lucide-radio',
              to: '/f1/radio',
            },
            {
              label: 'Подписки',
              icon: 'i-lucide-bell',
              to: '/f1/subscriptions',
            },
          ],
        },
        {
          label: 'Анализ',
          items: [
            {
              label: 'Телеметрия',
              icon: 'i-lucide-activity',
              to: '/f1/telemetry',
            },
            {
              label: 'Стратегия',
              icon: 'i-lucide-circle-dot',
              to: '/f1/strategy',
            },
          ],
        },
      ],
    },
  ],
})
