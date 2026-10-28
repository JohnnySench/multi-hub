<script setup lang="ts">
  /** Заглушка таблицы результатов: строки той же высоты и формы, по ним волной бежит красный блик */
  const ROWS = 10
</script>

<template>
  <div
    aria-label="Загрузка результатов"
    class="flex flex-col gap-1"
    role="status"
  >
    <div
      v-for="row in ROWS"
      :key="row"
      :style="{ '--row-delay': `${row * 0.06}s` }"
      class="
        relative flex h-12 items-center gap-4 overflow-hidden rounded-lg bg-fill-1 px-3
        after:absolute after:inset-0 after:bg-linear-to-r after:from-transparent
        after:via-pitwall-400/20 after:to-transparent after:[animation-delay:var(--row-delay)]
        motion-safe:after:animate-sweep
        motion-reduce:after:hidden
      "
    >
      <USkeleton class="size-6 rounded-xs" />
      <USkeleton class="h-5 w-1 rounded-xs" />
      <USkeleton class="h-4 w-40 rounded-xs" />
      <USkeleton class="ms-auto h-4 w-20 rounded-xs" />
      <USkeleton class="h-4 w-16 rounded-xs" />
      <USkeleton class="size-5 rounded-full" />
      <USkeleton class="h-4 w-6 rounded-xs" />
    </div>
  </div>
</template>
