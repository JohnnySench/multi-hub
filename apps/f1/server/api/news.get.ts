import { XMLParser } from 'fast-xml-parser'

export default defineEventHandler(async (event) => {
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
    const { link } = jsonResult.rss.channel

    return Array.isArray(jsonResult.rss.channel.item)
      ? jsonResult.rss.channel.item.map((item: RawNewsItem) => {
          return toNewsItem(item, link)
        })
      : toNewsItem(jsonResult.rss.channel.item, link)
  }
  catch {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
    })
  }
})
