<script setup lang="ts">
  import type { TableColumn } from '#ui/types'
  import Filters from '~/components/results/Filters.vue'

  definePageMeta({
    title: 'Результаты',
  })

  const { results } = useResults()

  const CellCompound = resolveComponent('ResultsCellCompound')
  const CellDriver = resolveComponent('ResultsCellDriver')

  const columns: TableColumn<ResultRow>[] = [
    {
      accessorKey: 'position',
      header: 'Позиция',
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
    },
    {
      accessorKey: 'lapDuration',
      header: 'Лучший круг',
    },
    {
      accessorKey: 'compound',
      header: 'Шины',
      cell: ({ row }) => {
        return h(CellCompound, { compound: row.original.compound })
      },
    },
    {
      accessorKey: 'points',
      header: 'Очки',
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
    <Filters />
    <UTable
      :columns="columns"
      :data="results"
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
