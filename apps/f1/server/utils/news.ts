export function toNewsItem(item: RawNewsItem, source: string): NewsItem | null {
  if (!item?.title || !item?.description || !item?.link || Number.isNaN(new Date(item?.pubDate).getTime())) {
    return null
  }
  return {
    id: `${source}-${item.guid}`,
    source,
    title: item.title,
    teaser: item.description,
    url: item.link,
    imageUrl: item?.enclosure?.url,
    publishedAt: new Date(item.pubDate).toISOString(),
  }
}
