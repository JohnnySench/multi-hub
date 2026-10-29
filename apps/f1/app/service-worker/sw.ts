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

/** Битый JSON — показываем текст как есть, чтобы пуш не потерялся */
function readPayload(data: PushMessageData): PushPayload {
  try {
    return data.json() as PushPayload
  }
  catch {
    return { body: data.text() }
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
      data: { url: payload.url || '/' },
    }),
  )
})

/**
 * Клик по уведомлению: вкладка с этим адресом уже открыта — переключаемся на неё, иначе открываем новую.
 * client.navigate() не используем: он работает только во вкладках, которыми управляет именно этот SW,
 * а во вкладке под старой версией SW (или открытой до установки) бросает
 * «This service worker is not the client's active service worker».
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = new URL(event.notification.data?.url || '/', self.location.origin).href

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const opened = windows.find(client => client.url === targetUrl)
    if (opened) {
      await opened.focus()
      return
    }
    await self.clients.openWindow(targetUrl)
  })())
})
