<script setup lang="ts">
  import type { TableColumn } from '#ui/types'

  definePageMeta({
    title: 'Результаты',
  })

  const { results } = useResults()

  const CellCompound = resolveComponent('ResultsCellCompound')
  const CellDriver = resolveComponent('ResultsCellDriver')
  const UIcon = resolveComponent('UIcon')

  const columns: TableColumn<ResultRow>[] = [
    {
      accessorKey: 'position',
      header: 'Поз',
      cell: ({ row }) => {
        const position = row.original.position
        const isPodium = position !== null && position <= 3
        return h('span', { class: 'flex h-6 items-center' }, [
          h('span', { class: isPodium ? 'display-s' : 'display-xs text-muted' }, position ?? '—'),
        ])
      },
    },
    {
      accessorKey: 'nameAcronym',
      header: 'Пилот',
      cell: ({ row }) => {
        const driver = {
          fullName: row.original.fullName,
          nameAcronym: row.original.nameAcronym,
          teamColor: row.original.teamColor,
        }
        return h(CellDriver, { ...driver })
      },
    },
    {
      accessorKey: 'teamName',
      header: 'Команда',
    },
    {
      accessorKey: 'duration',
      header: 'Время / отставание',
      cell: ({ row }) => h('span', { class: 'num-body text-highlighted' }, row.original.duration),
    },
    {
      accessorKey: 'lapDuration',
      header: 'Лучший круг',
      cell: ({ row }) => {
        if (!row.original.isFastest) {
          return h('span', { class: 'num-body' }, row.original.lapDuration)
        }
        return h('span', { class: 'num-body inline-flex items-center gap-1 text-fastest' }, [
          h(UIcon, { name: 'i-lucide-zap', class: 'size-3.5' }),
          row.original.lapDuration,
        ])
      },
    },
    {
      accessorKey: 'compound',
      header: 'Шины',
      cell: ({ row }) => {
        return h(CellCompound, { compound: row.original.compound })
      },
    },
    {
      accessorKey: 'pits',
      header: 'Пит',
      cell: ({ row }) => h('span', { class: 'num-body' }, row.original.pits),
    },
    {
      accessorKey: 'points',
      header: 'Очки',
      meta: { class: { th: 'text-right', td: 'text-right' } },
      cell: ({ row }) => h('span', { class: 'num-body text-highlighted' }, row.original.points ?? 0),
    },
  ]
</script>

<template>
  <div class="flex h-full flex-col gap-4">
    <h1 class="display-xl">
      СИНГАПУР · ГОНКА
    </h1>
    <p class="text-muted">
      Этап 17 · 62 круга · 11 октября
    </p>
    <ResultsFilters />
    <UTable
      :columns="columns"
      :data="results"
      :meta="{ class: { tr: row => row.original.position === 1 ? 'bg-accent-tint' : '' } }"
      :ui="{
        root: 'bg-elevated p-3 rounded-lg',
        base: 'border-separate border-spacing-y-1 border-spacing-x-0',
        thead: 'top-1 backdrop-blur-none',
        separator: 'hidden',
        tr: 'bg-fill-1 [&>*:first-child]:rounded-l-lg [&>*:last-child]:rounded-r-lg',
        td: 'p-3',
      }"
      class="min-h-0 flex-1"
      sticky="header"
    />
  </div>
</template>

<style scoped>

</style>
