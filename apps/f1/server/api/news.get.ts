import { XMLParser } from 'fast-xml-parser'

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: '',
  }
  const parser = new XMLParser(options)

  try {
    const xmlData = await $fetch<string>(config.f1NewsUrl, {
      responseType: 'text',
    })
    const jsonResult = parser.parse(xmlData)
    const { copyright } = jsonResult.rss.channel

    const formattedNews = Array.isArray(jsonResult.rss.channel.item)
      ? jsonResult.rss.channel.item.map((item: RawNewsItem) => {
          return toNewsItem(item, copyright)
        })
      : [toNewsItem(jsonResult.rss.channel.item, copyright)]

    return formattedNews
      .filter(Boolean)
  }
  catch {
    throw apiError(502, ApiErrorCode.NewsSourceFailed, config.f1NewsUrl)
  }
}, {
  maxAge: 60 * 10,
  swr: true,
})
