/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

/** Новая версия SW сразу берёт управление открытыми вкладками (registerType: 'autoUpdate') */
self.skipWaiting()
clientsClaim()

/** Кэш файлов сайта: при сборке плагин подставит сюда список файлов (настройки — pwa.injectManifest) */
precacheAndRoute(self.__WB_MANIFEST)

/** Что присылает сервер в пуше. Все поля необязательные — подставляем свои */
interface PushPayload {
  title?: string
  body?: string
  /** Куда вести по клику, путь внутри сайта: «/results?meeting=1270» */
  url?: string
}

const DEFAULT_TITLE = 'Формула 1'

/** Сообщение странице «перейди по адресу» — тот же тип слушает плагин sw-navigation.client.ts */
const SW_NAVIGATE = 'sw:navigate'

/** Битый JSON — показываем текст как есть, чтобы пуш не потерялся; null или число — пустой объект */
function readPayload(data: PushMessageData): PushPayload {
  try {
    const parsed: unknown = data.json()
    return typeof parsed === 'object' && parsed !== null ? parsed as PushPayload : {}
  }
  catch {
    return { body: data.text() }
  }
}

/**
 * Адрес из пуша → путь внутри нашего сайта, иначе главная.
 * Отсекает чужие сайты в любом виде: «https://…», «//evil», «/\evil» (парсер URL читает «\» как «/»)
 */
function toSafePath(url: unknown): string {
  try {
    const parsed = new URL(typeof url === 'string' ? url : '/', self.location.origin)
    return parsed.origin === self.location.origin ? `${parsed.pathname}${parsed.search}${parsed.hash}` : '/'
  }
  catch {
    return '/'
  }
}

self.addEventListener('push', (event) => {
  if (!event.data) {
    return
  }
  const payload = readPayload(event.data)

  event.waitUntil(
    self.registration.showNotification(payload.title || DEFAULT_TITLE, {
      body: payload.body,
      icon: '/pwa-192x192.png',
      /**
       * badge — значок в строке состояния Android: одноцветный силуэт на прозрачном фоне.
       * Цветная иконка там станет белым квадратом, поэтому пока не задаём — Android покажет свой
       */
      data: { url: toSafePath(payload.url) },
    }),
  )
})

/**
 * Клик по уведомлению: приложение уже открыто — переключаемся на его вкладку и просим её перейти
 * по адресу из уведомления; не открыто — открываем новую вкладку.
 *
 * Почему не сравниваем client.url и не зовём client.navigate():
 * - client.url — адрес, с которым вкладка открылась; переходы SPA (router.replace) его не меняют,
 *   и вкладка «Сингапур», переключённая на «Остин», выглядела бы для SW всё ещё Сингапуром;
 * - client.navigate() работает только во вкладках под этим SW и бросает
 *   «This service worker is not the client's active service worker» во всех остальных.
 * Переход делает сама страница через роутер (плагин sw-navigation.client.ts).
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  /** Проверяем ещё раз: data уведомления мог задать не наш push-обработчик */
  const path = toSafePath(event.notification.data?.url)

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    /** Видимая вкладка приложения — в приоритете, иначе любая */
    const target = windows.find(client => client.visibilityState === 'visible') ?? windows[0]
    if (target) {
      await target.focus()
      target.postMessage({ type: SW_NAVIGATE, url: path })
      return
    }
    await self.clients.openWindow(new URL(path, self.location.origin).href)
  })())
})
