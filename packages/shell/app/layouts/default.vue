<script setup lang="ts">
</script>

<template>
  <div class="h-dvh overflow-hidden p-2 grid grid-cols-[220px_1fr_1fr] grid-rows-[60px_1fr_60px] gap-2 bg-default">
    <ShellHeader class="col-span-3" />
    <ShellSidebar class="col-span-1 overflow-auto" />
    <main class="col-span-2 overflow-auto bg-muted rounded-md p-6">
      <slot />
    </main>
    <ShellFooter class="col-span-3" />
  </div>
</template>
