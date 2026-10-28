<script setup lang="ts">
  /**
   * Подзаголовок экрана гонки в стиле эфирной плашки F1:
   * скошенные сегменты — красный номер этапа, место, круги, старт, победитель.
   * Пустые сегменты не рисуем; на узком экране полоса прокручивается вбок.
   */
  const props = defineProps<{
    round: MeetingItem['round']
    isTesting: boolean
    place?: string
    /** Только у гонки и спринта — в практике и квале у P1 своё число кругов */
    laps?: number | null
    /** Начало сессии, ISO */
    startedAt?: string
    /** P1 гонки или спринта */
    winner?: Pick<ResultRow, 'nameAcronym' | 'teamColor'>
    /** Идёт загрузка новой сессии: круги и победителя ещё не знаем */
    loading?: boolean
  }>()

  const lead = computed(() => props.round ? `R${props.round}` : props.isTesting ? 'ТЕСТЫ' : null)
  const lapsText = computed(() => props.laps ? pluralize(props.laps, { one: 'круг', few: 'круга', many: 'кругов' }) : null)
  const startText = computed(() => props.startedAt ? formatSessionTime(props.startedAt) : null)

  /** Сегмент — параллелограмм; содержимое скошено обратно, чтобы текст стоял ровно */
  const SHAPE = `
    flex h-8 shrink-0 -skew-x-12 items-center px-3.5
    first:-ms-2 first:ps-5
    last:-me-2 last:pe-5
  `
  /** Цвет отдельно от формы: у номера этапа красный, у остальных — фон плашки */
  const SEGMENT = `${SHAPE} bg-elevated`
  const LEAD = `${SHAPE} bg-pitwall-400`
</script>

<template>
  <div class="max-w-full scrollbar-none overflow-x-auto [&::-webkit-scrollbar]:hidden">
    <div class="flex w-max items-stretch gap-0.5 overflow-hidden rounded-md text-sm text-muted">
      <span v-if="lead" :class="LEAD">
        <span class="skew-x-12 num-label-strong text-white">{{ lead }}</span>
      </span>

      <span v-if="props.place" :class="SEGMENT">
        <span class="flex skew-x-12 items-center gap-1.5">
          <UIcon class="size-3.5" name="i-lucide-map-pin" />
          {{ props.place }}
        </span>
      </span>

      <span v-if="props.loading" :class="SEGMENT">
        <USkeleton class="h-3 w-20 skew-x-12" />
      </span>
      <template v-else>
        <span v-if="lapsText" :class="SEGMENT">
          <span class="flex skew-x-12 items-center gap-1.5">
            <UIcon class="size-3.5" name="i-lucide-repeat" />
            <span class="num-label-strong text-highlighted">{{ props.laps }}</span>
            {{ lapsText.replace(`${props.laps} `, '') }}
          </span>
        </span>
      </template>

      <span v-if="startText" :class="SEGMENT">
        <span class="flex skew-x-12 items-center gap-1.5">
          <UIcon class="size-3.5" name="i-lucide-calendar" />
          {{ startText }}
        </span>
      </span>

      <span v-if="!props.loading && props.winner" :class="SEGMENT">
        <span class="flex skew-x-12 items-center gap-2">
          <UIcon class="size-3.5 text-accent" name="i-lucide-trophy" />
          <span
            :style="{ backgroundColor: `#${props.winner.teamColor}` }"
            class="h-4 w-1 rounded-xs"
          />
          <span class="num-label-strong text-highlighted">{{ props.winner.nameAcronym }}</span>
        </span>
      </span>
    </div>
  </div>
</template>
