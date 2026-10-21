import { F1ApiMode } from '#shared/utils/f1ApiMode.ts'

/** Кешируем ответы по пути запроса  */
export default defineCachedEventHandler(async (event) => {
  /** Ловим все запросы (/api/f1/...) через nitro и проксируем их на openf1 */
  const config = useRuntimeConfig(event)
  const path = getRouterParam(event, 'path')
  const query = getQuery(event)
  const storage = useStorage('mocks')
  const hashQuery = Object.entries(query)
    .sort()
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  const hashKey = `${path}:${hashQuery}.json`

  if (config.f1ApiMode === 'live') {
    return await fetchF1(`${path}`, query)
  }
  if (config.f1ApiMode === F1ApiMode.Record) {
    const response = await fetchF1(`${path}`, query)
    await storage.setItem(hashKey, JSON.stringify(response, null, 2))
    return response
  }
  if (config.f1ApiMode === F1ApiMode.Replay) {
    const cachedResponse = await storage.getItem(hashKey)
    if (cachedResponse) {
      return cachedResponse
    }
    throw createError({
      status: 501,
      statusText: 'Not Recorded',
      message: `Нет записи для ${hashKey} — запусти с NUXT_F1_API_MODE=record`,
    })
  }
}, {
  /** Кешириуем 30 минут */
  maxAge: 30 * 60,
  // getKey: event => event.path, и так по дефолту
  /** Когда 30 минут пройдет, отдадим что было в кеше, в фоне начнем обновление (default) */
  swr: true,
  /** Кеш только в live режиме (прод сборка), в dev работаем на моках record/replay */
  shouldBypassCache: () => useRuntimeConfig().f1ApiMode !== 'live',
})
