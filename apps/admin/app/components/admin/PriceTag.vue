<script setup lang="ts">
defineProps<{
  price: number
}>()
</script>

<template>
  <UBadge>
    <span class="text-red-500">{{ price }}</span>
  </UBadge>
</template>
