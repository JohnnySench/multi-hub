<script setup lang="ts">
  const tabs = [
    { label: 'Обзор', icon: 'i-lucide-layout-dashboard', to: '/' },
    { label: 'Календарь', icon: 'i-lucide-calendar', to: '/calendar' },
    { label: 'Гонка', icon: 'i-lucide-flag', to: '/results' },
    { label: 'Пилоты', icon: 'i-lucide-users', to: '/drivers' },
  ]
</script>

<template>
  <nav class="grid grid-cols-5 items-center rounded-lg bg-muted px-3 py-4">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="
        group flex flex-col items-center gap-1 text-caption font-semibold
        aria-[current=page]:text-highlighted
      "
    >
      <UIcon :name="tab.icon" class="size-5 group-aria-[current=page]:text-accent" />
      {{ tab.label }}
    </NuxtLink>
    <div>...</div>
  </nav>
</template>
