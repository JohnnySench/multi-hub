<script setup lang="ts">
import { formatPrice } from '@multi/utils'

useHead({
  title: 'ADMIN',
})
</script>

<template>
  <div>
    {{ formatPrice(2.43423) }}
    <AdminPriceTag :price="2.43423" />
    <UButton>Primary</UButton>
  </div>
</template>
