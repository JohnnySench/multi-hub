<script setup lang="ts">
  import type { NavigationMenuItem } from '#ui/types'

  const groupUi = {
    link: 'h-auto font-semibold text-muted px-3 pt-3 pb-2 hover:before:bg-transparent',
    linkTrailingIcon: 'size-3.5',
  }

  const items = navGroups.map(group => ({
    label: group.label,
    defaultOpen: true,
    children: group.items,
    ui: groupUi,
  })) satisfies NavigationMenuItem[]
</script>

<template>
  <UNavigationMenu
    :items="items"
    :ui="{
      link: 'h-9.5 px-3 gap-3 text-default before:rounded-md aria-[current=page]:before:bg-accent-tint',
      linkLeadingIcon: 'size-4.5 text-muted group-aria-[current=page]:text-accent',
      childList: 'ms-0 border-0',
      childItem: 'ps-0 ms-0',
    }"
    class="bg-muted rounded-lg p-3"
    color="neutral"
    orientation="vertical"
  >
    <template #list-trailing>
      <div class="mt-auto bg-elevated rounded-xl p-3">
        <div class="flex flex-row items-start gap-2">
          <div class="mt-1.5 size-2 rounded-full bg-accent ring-4 ring-accent/25 animate-pulse" />
          <p class="text-m-strong text-highlighted">
            Практика 1 · через 5 дней
          </p>
        </div>
        <p class="text-label text-muted mt-1">
          Гран-при США · данные — после финиша сессии
        </p>
      </div>
    </template>
  </UNavigationMenu>
</template>
