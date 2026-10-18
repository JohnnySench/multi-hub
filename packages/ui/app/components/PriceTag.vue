<script setup lang="ts">
import { formatPrice } from '@multi/utils'

defineProps<{
  price: number
}>()
</script>

<template>
  <UBadge>
    <span class="font-bold text-blue-500">{{ formatPrice(price) }}</span>
  </UBadge>
</template>
