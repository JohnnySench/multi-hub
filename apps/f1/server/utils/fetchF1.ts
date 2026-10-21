export async function fetchF1<T = unknown[]>(path: string, query?: Record<string, unknown>): Promise<T> {
  const config = useRuntimeConfig()
  try {
    return await $fetch<T, string>(`${config.f1BaseUrl}/${path}`, { query, retry: 0, timeout: 10_000 })
  }
  catch (error) {
    if (error instanceof Error && 'statusCode' in error && error.statusCode === 404) {
      return [] as T
    }
    if (error instanceof Error && 'statusCode' in error && error.statusCode === 429) {
      throw createError({
        status: 429,
        statusText: 'Rate Limited',
        message: 'Лимит OpenF1',
      })
    }
    throw createError({
      status: 502,
      statusText: 'Bad Gateway',
      message: 'OpenF1 недоступен',
    })
  }
}
