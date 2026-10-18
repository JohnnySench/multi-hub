<script setup lang="ts">
  useHead({
    title: 'currency',
  })

  const { $currency } = useNuxtApp()

  const { data } = useLazyAsyncData('all', async () => {
    const [cur, rat] = await Promise.all([
      $currency('/currencies'),
      $currency('/rates'),
    ])
    return { cur, rat }
  })
</script>

<template>
  <div>
    {{ data }}
  </div>
</template>
