<script setup lang="ts">
// Per-page OG meta (CodeRabbit review on #133):
// - og:url is reactive: computed from the current route so query changes
//   update the metatag without remounting the layout.
// - Fallback og:image/twitter:image is emitted only on non-/results routes —
//   on /results the server-rendered RaceCard image must win during hydration.
  const route = useRoute()
  const requestURL = useRequestURL()
  // site.url (from NUXT_SITE_URL) is authoritative for static generation;
  // useRequestURL().origin is empty/localhost under `pnpm generate`.
  const siteConfig = useSiteConfig()
  const siteOrigin = computed(() => siteConfig.url || requestURL.origin)

  const ogUrl = computed(() => `${siteOrigin.value}${route.fullPath}`)
  const isResultsPage = computed(() => route.path === '/results')

  const fallbackImageMeta = computed(() =>
    isResultsPage.value
      ? []
      : [
        { property: 'og:image', content: `${siteOrigin.value}/og-default.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Формула 1 — превью' },
        { name: 'twitter:image', content: `${siteOrigin.value}/og-default.png` },
      ],
  )

  useHead({
    meta: computed(() => [
      { property: 'og:url', content: ogUrl.value },
      ...fallbackImageMeta.value,
    ]),
  })
</script>
