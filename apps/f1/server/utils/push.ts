/** Тело пришло из сети — проверяем каждое поле, прежде чем писать в push_devices */
export function isPushSubscriptionBody(body: unknown): body is PushSubscriptionBody {
  if (!isPushEndpointBody(body)) {
    return false
  }
  if (!('keys' in body) || !body.keys || typeof body.keys !== 'object') {
    return false
  }
  if (!('p256dh' in body.keys) || typeof body.keys.p256dh !== 'string' || !body.keys.p256dh) {
    return false
  }
  if (!('auth' in body.keys) || typeof body.keys.auth !== 'string' || !body.keys.auth) {
    return false
  }
  return true
}

/** Для отписки ключи не нужны — устройство ищем по endpoint */
export function isPushEndpointBody(body: unknown): body is Pick<PushSubscriptionBody, 'endpoint'> {
  if (!body || typeof body !== 'object') {
    return false
  }
  return 'endpoint' in body && typeof body.endpoint === 'string' && isHttpsUrl(body.endpoint)
}

/**
 * Endpoint push-сервиса всегда https. Робот шлёт на каждый адрес из push_devices,
 * поэтому чужой адрес в базе — это запросы нашего сервера куда угодно (SSRF)
 */
function isHttpsUrl(value: string) {
  return URL.canParse(value) && new URL(value).protocol === 'https:'
}
