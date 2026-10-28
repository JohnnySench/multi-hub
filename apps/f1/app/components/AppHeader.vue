<script setup lang="ts">
  const route = useRoute()
  const breadcrumbs = computed(() => {
    return [
      {
        label: route.meta.title,
        active: false,
      },
    ]
  })

  const { year, YEARS } = useSelectedYear()

  /** Подписи сезонов в списке («идёт · 17 из 23») — грузятся при открытии селекта */
  const { load: loadSeasonStats, describe: describeSeason } = useSeasonStats()

  function onSeasonOpen(open: boolean) {
    if (open) {
      loadSeasonStats()
    }
  }
  const { meeting } = useSelectedMeeting()
  const { session } = useSelectedSession()

  const selectedYear = computed({
    get: () => year.value,
    set: (value) => {
      year.value = value
      meeting.value = undefined
      session.value = undefined
    },
  })
</script>

<template>
  <header class="flex items-center justify-between rounded-lg bg-muted px-2 py-3 sm:px-4">
    <div class="flex items-center gap-1 sm:gap-2">
      <AppLogo />
      <span class="text-muted">/</span>
      <UBreadcrumb :items="breadcrumbs">
        <template #separator>
          <span class="text-muted">/</span>
        </template>
      </UBreadcrumb>
    </div>
    <div class="flex flex-row items-center gap-2 sm:gap-3">
      <AppSearch />
      <!-- Сезон: как селект этапа — плашка без рамки, в списке год и прогресс сезона -->
      <USelect
        v-model="selectedYear"
        :items="YEARS"
        :ui="{
          base: 'h-9 gap-2 rounded-md bg-elevated ps-3 pe-9 text-sm ring-0 hover:bg-accented/60',
          content: 'w-64 rounded-lg bg-muted p-1',
          item: 'h-9 items-center gap-3 px-3 before:rounded-sm data-highlighted:not-data-disabled:before:bg-elevated',
          trailingIcon: 'size-4 transition-transform duration-200 group-data-[state=open]:rotate-180',
          itemTrailingIcon: 'size-4 text-accent',
        }"
        label-key="label"
        selected-icon="i-lucide-check"
        value-key="value"
        variant="none"
        @update:open="onSeasonOpen"
      >
        <template #default="{ modelValue }">
          <span class="flex items-center gap-2">
            <UIcon class="size-4 text-accent" name="i-lucide-calendar-range" />
            <span class="hidden text-muted sm:inline">Сезон</span>
            <span class="num-label-strong text-highlighted">{{ modelValue }}</span>
          </span>
        </template>

        <template #content-top>
          <p class="px-3 pt-2 pb-1 text-caption text-muted">
            Сезон · данные OpenF1 с 2023
          </p>
        </template>

        <template #item-label="{ item }">
          <span class="num-label-strong text-highlighted">{{ item.value }}</span>
          <span class="ms-3 text-xs text-muted">{{ describeSeason(item.value) }}</span>
        </template>
      </USelect>
    </div>
  </header>
</template>
