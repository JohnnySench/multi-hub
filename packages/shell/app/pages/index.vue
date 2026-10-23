<script lang="ts" setup>
  const { apps } = useAppConfig()
</script>

<template>
  <div class="flex flex-col">
    <UButton
      v-for="app in apps"
      :key="app.to"
      :icon="app.icon"
      :label="app.title"
      :to="app.to"
    />
  </div>
</template>
