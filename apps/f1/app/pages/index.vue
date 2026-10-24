<script setup lang="ts">
  definePageMeta({
    title: 'Обзор',
  })
  /** Пример использования */
  const { data } = useLazyF1('/meetings', { query: { year: 2024 } })
  // const { $f1 } = useNuxtApp()
  onMounted(async () => {
    // await $f1('/meetings')
  })
</script>

<template>
  <div>
    <UButton class="mx-2">
      Test
    </UButton>
    {{ data }}
  </div>
</template>
