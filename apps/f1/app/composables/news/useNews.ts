export function useNews() {
  const { data: news } = useLazyAsyncData('news', async (_nuxtApp, { signal }) => {
    /** Тип ответа явно: вывод по адресу ручки перебирает все маршруты Nitro и падает с TS2321 на typecheck */
    return await $fetch<NewsItem[]>('/api/news', { signal })
  })

  return {
    news,
  }
}
