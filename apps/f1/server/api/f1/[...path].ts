/** Кешируем ответы по пути запроса  */
export default defineCachedEventHandler(async (event) => {
  /** Ловим все запросы (/api/f1/...) через nitro и проксируем их на openf1 */
  const config = useRuntimeConfig(event)
  const path = getRouterParam(event, 'path')
  const query = getQuery(event)
  const storage = useStorage('mocks')

  const hashKey = `${path}:${hashQuery(query)}.json`

  if (config.f1ApiMode === F1ApiMode.Live) {
    return await fetchF1(`${path}`, query)
  }
  if (config.f1ApiMode === F1ApiMode.Record) {
    const response = await fetchF1(`${path}`, query)
    await storage.setItem(hashKey, response)
    return response
  }
  if (config.f1ApiMode === F1ApiMode.Replay) {
    /** Моки отвечают мгновенно — для проверки загрузки имитируем сеть (NUXT_F1_MOCK_DELAY) */
    if (config.f1MockDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, config.f1MockDelay))
    }
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
  throw createError({
    status: 500,
    statusText: 'Invalid F1 API mode',
    message: `Неизвестный режим f1ApiMode: ${String(config.f1ApiMode)}`,
  })
}, {
  /** Кешириуем 60 минут */
  maxAge: 60 * 60,
  // getKey: event => event.path, и так по дефолту
  /** Когда 60 минут пройдет, отдадим что было в кеше, в фоне начнем обновление (default) */
  swr: true,
  /** Кеш только в live режиме (прод сборка), в dev работаем на моках record/replay */
  shouldBypassCache: () => useRuntimeConfig().f1ApiMode !== F1ApiMode.Live,
})
