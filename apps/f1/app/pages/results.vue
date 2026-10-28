<script setup lang="ts">
  import type { TableColumn } from '#ui/types'

  definePageMeta({
    title: 'Результаты',
  })

  const { meeting } = useSelectedMeeting()
  const { session } = useSelectedSession()

  const { meetings } = await useMeetings()
  const meetingKey = computed(() => {
    const selected = meetings.value.find(item => item.meetingKey === meeting.value)
    return (selected ?? findLastFinished(meetings.value))?.meetingKey
  })

  const { sessions, pending: sessionsPending } = await useSessions({ meetingKey })
  const sessionKey = computed(() => {
    const selected = sessions.value.find(item => item.sessionKey === session.value)
    return (selected ?? findLastFinished(sessions.value))?.sessionKey
  })

  const { results, pending: resultsPending } = await useResults({ sessionKey })

  /** Таблица ждёт и при смене этапа: сначала грузятся его сессии, и только потом сама таблица */
  const isTableLoading = computed(() => sessionsPending.value || resultsPending.value)

  /**
   * Что показывать, пока грузится новая сессия:
   * сменили таб — те же пилоты, держим прошлые строки (приглушённые);
   * сменили этап — это другая гонка, строки сбрасываем, и таблица покажет скелетон.
   */
  const visibleResults = shallowRef(results.value)
  watch([results, isTableLoading], ([value, isLoading]) => {
    if (!isLoading) {
      visibleResults.value = value
    }
  })
  watch(meetingKey, () => {
    visibleResults.value = []
  })

  const title = computed(() => {
    const meetingName = meetings.value.find(m => m.meetingKey === meetingKey.value)?.countryName
    const sessionName = sessions.value.find(s => s.sessionKey === sessionKey.value)?.label
    /** У этапа, где ещё ни одна сессия не прошла, сессии нет — не пишем «undefined» */
    return [meetingName, sessionName].filter(Boolean).join(' · ')
  })
  /** Круги и победитель в подзаголовке — только у гонки и спринта: в практике и квале у P1 своё число */
  const RACE_SESSIONS = new Set<string>([SessionName.Race, SessionName.Sprint])

  /** Данные для плашки под заголовком: этап, место, круги, старт, победитель */
  const strip = computed(() => {
    const currentMeeting = meetings.value.find(m => m.meetingKey === meetingKey.value)
    const currentSession = sessions.value.find(s => s.sessionKey === sessionKey.value)
    const isRace = !!currentSession && RACE_SESSIONS.has(currentSession.sessionName)
    /** results, а не visibleResults: на смене таба там ещё строки прошлой сессии */
    const leader = isRace ? results.value.find(r => r.position === 1) : undefined

    return {
      round: currentMeeting?.round ?? null,
      isTesting: currentMeeting?.isTesting ?? false,
      place: currentMeeting?.location,
      laps: leader?.laps,
      startedAt: currentSession?.dateStart,
      winner: leader,
      /** Заглушка кругов и победителя — только пока грузится гонка или спринт */
      loading: isRace && isTableLoading.value,
    }
  })

  const selectedMeeting = computed({
    get: () => meetingKey.value,
    set: (value) => {
      meeting.value = value
      session.value = undefined
    },
  })
  const selectedSession = computed({
    get: () => sessionKey.value,
    set: (value) => {
      session.value = value
    },
  })

  const CellCompound = resolveComponent('ResultsCellCompound')
  const CellDriver = resolveComponent('ResultsCellDriver')
  const UIcon = resolveComponent('UIcon')

  const columns: TableColumn<ResultRow>[] = [
    {
      accessorKey: 'position',
      header: 'Позиция',
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
      {{ title }}
    </h1>
    <ResultsSessionStrip v-bind="strip" />
    <div class="flex items-center justify-between gap-4">
      <ResultsFilters
        v-model:meeting-key="selectedMeeting"
        v-model:session-key="selectedSession"
        :meetings="meetings"
        :sessions="sessions"
        class="min-w-0 max-sm:w-full"
      />
      <ResultsStartLights :active="isTableLoading" class="max-sm:hidden" />
    </div>
    <UTable
      :columns="columns"
      :data="visibleResults"
      :loading="isTableLoading"
      :meta="{ class: { tr: row => row.original.position === 1 ? 'bg-accent-tint' : '' } }"
      :ui="{
        root: 'bg-elevated p-3 rounded-lg',
        base: 'border-separate border-spacing-y-1 border-spacing-x-0',
        thead: 'top-1 backdrop-blur-none after:hidden',
        tbody: isTableLoading ? 'opacity-40 transition-opacity duration-200' : 'transition-opacity duration-200',
        separator: 'hidden',
        tr: 'bg-fill-1 [&>*:first-child]:rounded-l-lg [&>*:last-child]:rounded-r-lg',
        td: 'p-3',
      }"
      class="min-h-0 flex-1"
      sticky="header"
    >
      <!-- Строк ещё нет совсем — заглушка по форме таблицы; есть прошлые — они просто приглушены -->
      <template #loading>
        <ResultsTableSkeleton />
      </template>
    </UTable>
  </div>
</template>
