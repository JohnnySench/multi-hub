<script setup lang="ts">
  definePageMeta({
    title: 'Новости',
  })

  const { news } = useNews()
</script>

<template>
  <div class="flex h-full flex-col gap-4">
    <h1 class="display-xl">
      Новости
    </h1>
    <div>{{ news }}</div>
    <NewsCardSessions />

    <div
      class="
        grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_400px] grid-rows-[minmax(0,1fr)_auto] gap-3
      "
    >
      <NewsCardHero class="min-h-0" />
      <NewsLenta class="row-span-2 min-h-0 overflow-y-auto" />
      <div class="grid grid-cols-2 gap-3">
        <NewsCard />
        <NewsCard />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
