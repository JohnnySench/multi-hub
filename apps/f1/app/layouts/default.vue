<script setup lang="ts">
</script>

<template>
  <div
    class="
      grid h-dvh grid-cols-1 grid-rows-[56px_1fr_68px] gap-2 overflow-hidden bg-default p-2
      sm:grid-cols-[300px_1fr_1fr] sm:grid-rows-[60px_1fr_60px]
    "
  >
    <AppHeader class="col-span-1 sm:col-span-3" />
    <AppSidebar
      class="hidden overflow-auto sm:col-span-1 sm:row-start-2 sm:flex"
    />
    <CViewIsland
      as="main"
      class="
        col-span-1 min-w-0 overflow-x-hidden overflow-y-auto
        max-sm:scroll-progress
        sm:col-span-2
      "
    >
      <slot />
    </CViewIsland>

    <AppFooter class="hidden sm:col-span-3 sm:block" />
    <LazyAppTabSidebar class="col-span-1 sm:hidden" />
  </div>
</template>
