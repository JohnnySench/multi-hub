<script setup lang="ts">
import { formatPrice } from '@multi/utils'
defineProps<{
  price: number;
}>()
</script>

<template>
  <UBadge>
    <span class="font-bold">{{ formatPrice(price)}}</span>
  </UBadge>
</template>
