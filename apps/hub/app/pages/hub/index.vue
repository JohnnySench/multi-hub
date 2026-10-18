<script setup lang="ts">
import { formatPrice } from '@multi/utils'

useHead({
  title: 'Hub',
})
</script>

<template>
  <div class="text-red-500">
    {{ formatPrice(2.43423) }}
    <PriceTag :price="2.43423" />
  </div>
</template>
