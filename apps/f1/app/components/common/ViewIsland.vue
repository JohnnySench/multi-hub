<script setup lang="ts">
  withDefaults(defineProps<{
    as?: string
  }>(), {
    as: 'div',
  })
</script>

<template>
  <Component :is="as" class="rounded-lg bg-muted px-2 py-3 ring ring-default ring-inset sm:px-4">
    <slot />
  </Component>
</template>
