<script setup lang="ts">
  useHead({
    title: 'f1',
  })

  /** Пример использования */
  const { data } = useLazyF1('/meetings', { query: { year: 2026 } })
  // const { $f1 } = useNuxtApp()
  onMounted(async () => {
    // await $f1('/meetings')
  })
</script>

<template>
  <div>
    {{ data }}
  </div>
</template>
