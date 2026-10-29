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

/** Только адреса нашего сайта: «/\evil» тоже начинается с «/», поэтому сверяем origin после разбора */
function isOwnPath(url: string) {
  try {
    return new URL(url, location.origin).origin === location.origin
  }
  catch {
    return false
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  /**
   * router.push, а не navigateTo: если сообщение придёт во время другого перехода (идёт middleware),
   * navigateTo вернёт маршрут, но не перейдёт
   */
  const router = nuxtApp.$router

  navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
    if (isNavigateMessage(event.data) && isOwnPath(event.data.url)) {
      router.push(event.data.url)
    }
  })

  /** Сообщения, пришедшие до подписки, доставятся только после startMessages() */
  navigator.serviceWorker.startMessages()
})
