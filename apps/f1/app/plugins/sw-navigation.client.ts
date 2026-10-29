/**
 * Переход по клику на уведомление в уже открытой вкладке.
 * Service worker фокусирует вкладку и присылает адрес (sw.ts, notificationclick),
 * а переход делаем здесь через роутер — без перезагрузки страницы.
 */
const SW_NAVIGATE = 'sw:navigate'

interface NavigateMessage {
  type: typeof SW_NAVIGATE
  url: string
}

function isNavigateMessage(data: unknown): data is NavigateMessage {
  return typeof data === 'object' && data !== null
    && (data as NavigateMessage).type === SW_NAVIGATE
    && typeof (data as NavigateMessage).url === 'string'
}

export default defineNuxtPlugin(() => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
    /** Только внутренние пути: «/results?meeting=1270», не чужие адреса */
    if (isNavigateMessage(event.data) && event.data.url.startsWith('/')) {
      navigateTo(event.data.url)
    }
  })

  /** Сообщения, пришедшие до подписки, доставятся только после startMessages() */
  navigator.serviceWorker.startMessages()
})
