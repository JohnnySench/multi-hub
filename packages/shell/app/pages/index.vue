<script lang="ts" setup>
const { apps } = useAppConfig()
</script>

<template>
  <div>
    <UButton
      v-for="app in apps"
      :key="app.to"
      :to="app.to"
      :label="app.name"
    />
  </div>
</template>
