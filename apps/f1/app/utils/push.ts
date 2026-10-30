/** Пушам нужны три API браузера: service worker, уведомления и подписка у push-сервиса */
export function canAllowPushTechnically() {
  return 'serviceWorker' in navigator && 'Notification' in window && 'PushManager' in window
}

export function urlBase64ToUint8Array(base64Url: string) {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
  return Uint8Array.from(atob(padded), char => char.charCodeAt(0))
}
