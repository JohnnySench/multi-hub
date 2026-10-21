/** Кешируем ответы по пути запроса  */
export default defineCachedEventHandler(async (event) => {
  /** Ловим все запросы (/api/f1/...) через nitro и проксируем их на openf1 */
  const config = useRuntimeConfig(event)
  const path = getRouterParam(event, 'path')
  const query = getQuery(event)
  try {
    return await $fetch(`${config.f1BaseUrl}/${path}`, { query, retry: 0, timeout: 10_000 })
  }
  catch (error) {
    if (error instanceof Error && 'statusCode' in error && error.statusCode === 404) {
      return []
    }
    if (error instanceof Error && 'statusCode' in error && error.statusCode === 429) {
      throw createError({ statusCode: 429, statusText: 'Лимит OpenF1' })
    }
    throw createError({ statusCode: 502, statusText: 'OpenF1 недоступен' })
  }
}, {
  maxAge: 30 * 60, /** Кешириуем 30 минут */
  // getKey: event => event.path, и так по дефолту
  swr: true, /** Когда 30 минут пройдет, отдадим что было в кеше, в фоне начнем обновление (default) */
})
