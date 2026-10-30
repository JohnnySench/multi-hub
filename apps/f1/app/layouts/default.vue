<script setup lang="ts">
// Per-page OG meta (CodeRabbit review on #133):
// - og:url is reactive: computed from the current route so query changes
//   update the metatag without remounting the layout.
// - Fallback og:image/twitter:image is emitted only on non-/results routes —
//   on /results the server-rendered RaceCard image must win during hydration.
  const route = useRoute()
  const requestURL = useRequestURL()

  const ogUrl = computed(() => `${requestURL.origin}${route.fullPath}`)
  const isResultsPage = computed(() => route.path === '/results')

  const fallbackImageMeta = computed(() =>
    isResultsPage.value
      ? []
      : [
        { property: 'og:image', content: `${requestURL.origin}/og-default.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Формула 1 — превью' },
        { name: 'twitter:image', content: `${requestURL.origin}/og-default.png` },
      ],
  )

  useHead({
    meta: computed(() => [
      { property: 'og:url', content: ogUrl.value },
      ...fallbackImageMeta.value,
    ]),
  })
</script>

<template>
  <div
    class="
      grid h-dvh grid-cols-1 grid-rows-[56px_1fr_68px] gap-2 overflow-hidden bg-default p-2
      sm:grid-cols-[300px_1fr_1fr] sm:grid-rows-[60px_1fr_60px]
    "
  >
    <AppHeader class="col-span-1 sm:col-span-3" />
    <AppSidebar class="hidden overflow-auto sm:col-span-1 sm:row-start-2 sm:flex" />
    <main
      class="
        col-span-1 min-w-0 overflow-x-hidden overflow-y-auto
        max-sm:scroll-progress
        sm:col-span-2 sm:rounded-lg sm:bg-muted sm:p-6
      "
    >
      <slot />
    </main>
    <AppFooter class="hidden sm:col-span-3 sm:block" />
    <LazyAppTabSidebar class="col-span-1 sm:hidden" />
  </div>
</template>
