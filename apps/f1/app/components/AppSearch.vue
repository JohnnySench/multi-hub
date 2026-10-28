<script setup lang="ts">
  import type { CommandPaletteGroup, CommandPaletteItem } from '#ui/types'

  /**
   * Поиск в шапке: поле-кнопка открывает палитру команд (Ctrl K).
   * Ищет этапы выбранного сезона и разделы сайта. Пилотов добавим, когда появится их страница.
   */
  const open = ref(false)

  defineShortcuts({
    meta_k: () => {
      open.value = !open.value
    },
  })

  /** Пункты поиска — ссылки: перешли по одной из них — закрываем окно */
  const route = useRoute()
  watch(() => route.fullPath, () => {
    open.value = false
  })

  const { $f1 } = useNuxtApp()
  const { year } = useSelectedYear()

  /** Этапы грузим при первом открытии — закрытому поиску они не нужны */
  const { data: meetings, status, execute } = useLazyAsyncData(() => `search-meetings-${toValue(year)}`, async () => {
    return await $f1('/meetings', { query: { year: toValue(year) } })
  }, {
    immediate: false,
    transform: input => toMeetingItems(input),
    default: () => [],
  })

  watch(open, (isOpen) => {
    if (isOpen && status.value === 'idle') {
      execute()
    }
  })

  const groups = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() => [
    {
      id: 'meetings',
      label: `Этапы ${toValue(year)}`,
      items: meetings.value.map(meeting => ({
        prefix: meeting.round ? `R${meeting.round}` : '—',
        label: meeting.countryName,
        suffix: meeting.location,
        icon: 'i-lucide-flag',
        /** Будущие и отменённые не открываем — данных нет */
        disabled: meeting.isCancelled || Date.parse(meeting.dateStart) > Date.now(),
        to: { path: '/results', query: { year: toValue(year), meeting: meeting.meetingKey } },
      })),
    },
    {
      id: 'sections',
      label: 'Разделы',
      items: navGroups.flatMap(group => group.items).map(item => ({
        label: item.label,
        icon: item.icon,
        to: item.to,
      })),
    },
  ])
</script>

<template>
  <!-- Десктоп: поле по дизайну с подсказкой Ctrl K; мобила: только иконка -->
  <button
    class="
      hidden h-9 items-center gap-2 rounded-md bg-elevated ps-3 pe-2 text-sm text-muted
      transition-colors
      hover:bg-accented/60
      focus-visible:outline-2 focus-visible:outline-accent
      sm:flex sm:w-50
      md:w-70
      lg:w-90
    "
    type="button"
    @click="open = true"
  >
    <UIcon class="size-4 shrink-0" name="i-lucide-search" />
    <span class="truncate">Этап, город или раздел…</span>
    <UKbd class="ms-auto" value="Ctrl K" />
  </button>
  <UButton
    aria-label="Поиск"
    class="sm:hidden"
    color="neutral"
    icon="i-lucide-search"
    variant="ghost"
    @click="open = true"
  />

  <UModal v-model:open="open" :ui="{ content: 'max-w-xl rounded-lg bg-muted ring-0' }">
    <template #content>
      <UCommandPalette
        :fuse="{ resultLimit: 40, fuseOptions: { keys: ['label', 'suffix', 'prefix'] } }"
        :groups="groups"
        :loading="status === 'pending'"
        :ui="{
          input: '[&_input]:text-base',
          item: 'before:rounded-sm data-highlighted:not-data-disabled:before:bg-elevated',
          itemLabelPrefix: 'num-label text-muted',
          itemLabelSuffix: 'text-xs text-muted',
        }"
        placeholder="Этап, город или раздел…"
        close
        @update:open="open = $event"
      />
    </template>
  </UModal>
</template>
