<script setup lang="ts">
  const { currentTheme } = useTheme()

  useHead({
    htmlAttrs: {
      'data-theme': () => currentTheme.value,
    },
  })
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
