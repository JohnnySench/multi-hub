export interface RawNewsItem {
  title: string
  description: string
  link: string
  guid: string
  pubDate: string
  enclosure: {
    url: string
    type: string
    length: string
  }
}

export interface NewsItem {
  id: string
  source: string
  title: string
  teaser: string
  url: string
  imageUrl?: string
  publishedAt: string
}
