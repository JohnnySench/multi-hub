<script setup lang="ts">
  /**
   * Стартовые огни F1 как индикатор загрузки.
   * Пока active — огни загораются по очереди и гаснут («lights out»), по кругу.
   * Без загрузки — пять тёмных огней: место занято всегда, вёрстка не прыгает.
   */
  const props = defineProps<{
    active: boolean
  }>()

  const LIGHTS = 5
</script>

<template>
  <div
    :aria-label="props.active ? 'Загрузка' : undefined"
    class="flex items-center gap-1.5"
    role="status"
  >
    <span
      v-for="light in LIGHTS"
      :key="light"
      :class="props.active && 'motion-safe:animate-start-light motion-reduce:bg-pitwall-300'"
      :style="{ animationDelay: `${(light - 1) * 0.25}s` }"
      class="size-3 rounded-full bg-carbon-700 inset-ring-2 inset-ring-black/30"
    />
  </div>
</template>
