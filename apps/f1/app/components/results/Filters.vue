<script setup lang="ts">
  import type { TabsItem } from '#ui/types'

  const props = defineProps<{
    meetings: MeetingItem[]
    sessions: SessionItem[]
  }>()

  const meetingKey = defineModel<number | undefined>('meetingKey')
  const sessionKey = defineModel<number | undefined>('sessionKey')

  /**
   * Два состояния таба:
   * activeSession — что подсвечено, меняется сразу по клику;
   * sessionKey — что ушло родителю (и в запрос таблицы), когда перестали кликать.
   * Так быстрое прокликивание табов даёт один запрос таблицы, а не по запросу на клик.
   */
  const activeSession = ref(sessionKey.value)

  watchDebounced(activeSession, (value) => {
    sessionKey.value = value
  }, { debounce: 300 })

  /** Сессию поменяли снаружи (новый этап, «Назад» в браузере) — переносим в подсветку */
  watch(sessionKey, (value) => {
    activeSession.value = value
  })

  const { winnerByMeeting, isLoading: winnersLoading, load: loadWinners } = useWinners()

  /** Победителей грузим только когда список открыли — закрытому селекту они не нужны */
  function onOpen(open: boolean) {
    if (open) {
      loadWinners()
    }
  }

  /** done — прошла, live — идёт сейчас, future — ещё не началась */
  type SessionState = 'done' | 'live' | 'future'

  interface SessionTab extends TabsItem {
    state: SessionState
    /** «Сб, 4 окт · 16:00» — подсказка при наведении */
    when: string
  }

  const tabs = computed<SessionTab[]>(() => props.sessions.map((session, index) => {
    const now = Date.now()
    const state: SessionState = Date.parse(session.dateEnd) < now
      ? 'done'
      : Date.parse(session.dateStart) <= now ? 'live' : 'future'
    /** Сессии уикенда группируем по дням: перед первой сессией нового дня — разделитель */
    const previous = props.sessions[index - 1]
    const isNewDay = !!previous && !isSameDay(previous.dateStart, session.dateStart)
    return {
      label: session.label,
      value: session.sessionKey,
      /** Результатов нет, пока сессия не закончилась; квала и практики — в #82 */
      disabled: state !== 'done' || !isRaceSession(session.sessionName),
      state,
      when: formatSessionTime(session.dateStart),
      ui: isNewDay
        ? { trigger: 'ms-2.5 after:absolute after:-start-2 after:h-4 after:w-px after:bg-white/10' }
        : undefined,
    }
  }))

  /** Этап в выпадающем списке: отменённые и будущие нельзя выбрать — данных нет */
  interface MeetingOption extends MeetingItem {
    isFuture: boolean
    disabled: boolean
    dates: string
    /** Прошедшая гонка — победитель будет; у будущих, тестов и отменённых — никогда */
    hasWinner: boolean
  }

  const meetingOptions = computed<MeetingOption[]>(() => props.meetings.map((meeting) => {
    const isFuture = Date.parse(meeting.dateStart) > Date.now()
    return {
      ...meeting,
      isFuture,
      /** У тестов гонки нет — таблице нечего показать */
      disabled: meeting.isCancelled || isFuture || meeting.isTesting,
      dates: formatDateRange(meeting.dateStart, meeting.dateEnd),
      hasWinner: !isFuture && !meeting.isTesting && !meeting.isCancelled,
    }
  }))

  const hasFuture = computed(() => meetingOptions.value.some(meeting => meeting.isFuture))

  const selectedMeeting = computed(() => props.meetings.find(meeting => meeting.meetingKey === meetingKey.value))

  /** R17 — номер в сезоне; у тестов и отменённых его нет */
  function formatRound(round: MeetingItem['round']) {
    return round ? `R${round}` : '—'
  }
</script>

<template>
  <div class="flex min-w-0 flex-row items-center gap-2 max-sm:flex-wrap">
    <USelectMenu
      v-model="meetingKey"
      :filter-fields="['countryName', 'location']"
      :items="meetingOptions"
      :search-input="{ placeholder: 'Этап или город…', icon: 'i-lucide-search' }"
      :ui="{
        base: 'h-9 gap-2 rounded-md bg-elevated ps-3 pe-9 ring-0 hover:bg-accented/60',
        content: 'max-h-110 w-110 rounded-lg bg-muted p-1',
        input: 'border-0 [&_input]:rounded-md [&_input]:bg-elevated',
        item: 'h-9 items-center gap-3 px-3 before:rounded-sm data-highlighted:not-data-disabled:before:bg-elevated',
        itemTrailingIcon: 'size-4 text-accent',
        trailingIcon: 'size-4 transition-transform duration-200 group-data-[state=open]:rotate-180',
      }"
      class="shrink-0"
      color="neutral"
      label-key="countryName"
      selected-icon="i-lucide-check"
      value-key="meetingKey"
      variant="none"
      @update:open="onOpen"
    >
      <!-- Закрытый селект: флаг · R17 · страна -->
      <template #default>
        <span v-if="selectedMeeting" class="flex items-center gap-2">
          <UIcon class="size-4 text-accent" name="i-lucide-flag" />
          <span class="num-label text-muted">{{ formatRound(selectedMeeting.round) }}</span>
          <span class="font-medium text-highlighted">{{ selectedMeeting.countryName }}</span>
        </span>
        <span v-else class="text-muted">Этап</span>
      </template>

      <template #item-leading="{ item }">
        <span class="w-8 shrink-0 num-label text-muted">{{ formatRound(item.round) }}</span>
      </template>

      <template #item-label="{ item }">
        <span :class="{ 'line-through': item.isCancelled }" class="font-medium text-highlighted">
          {{ item.countryName }}
        </span>
        <span v-if="item.location" class="ms-2 text-xs text-muted">{{ item.location }}</span>
      </template>

      <template #item-trailing="{ item }">
        <UBadge
          v-if="item.isCancelled"
          color="neutral"
          label="отменён"
          size="sm"
          variant="soft"
        />
        <UBadge
          v-else-if="item.isTesting"
          color="neutral"
          label="тесты"
          size="sm"
          variant="soft"
        />
        <!-- Прошедшая гонка: победитель (или заглушка, пока грузится); остальные — даты этапа -->
        <span class="flex w-28 justify-end">
          <ResultsCellDriver v-if="item.hasWinner && winnersLoading" loading />
          <ResultsCellDriver
            v-else-if="item.hasWinner && winnerByMeeting.get(item.meetingKey)"
            :name-acronym="winnerByMeeting.get(item.meetingKey)?.nameAcronym"
            :team-color="winnerByMeeting.get(item.meetingKey)?.teamColor"
          />
          <span v-else class="num-label whitespace-nowrap text-muted">{{ item.dates }}</span>
        </span>
      </template>

      <template #content-bottom>
        <p v-if="hasFuture" class="px-3 pt-1 pb-2 text-caption text-muted">
          Будущие этапы неактивны: данных ещё нет
        </p>
      </template>
    </USelectMenu>
    <!-- Segment по дизайн-системе: на узком экране не влезает — прокручивается вбок -->
    <div
      class="min-w-0 scrollbar-none overflow-x-auto max-sm:w-full [&::-webkit-scrollbar]:hidden"
    >
      <UTabs
        v-model="activeSession"
        :content="false"
        :items="tabs"
        :ui="{
          list: 'w-max gap-1 rounded-md bg-elevated p-1',
          indicator: 'rounded-sm bg-white shadow-none',
          trigger: `
            h-7.5 grow-0 rounded-sm px-4 text-[13px] font-semibold
            data-[state=active]:text-ink
            max-sm:h-10 max-sm:px-3
          `,
        }"
        color="neutral"
        variant="pill"
      >
        <template #leading="{ item }">
          <!-- Идёт сейчас: пульсирующая точка; ещё не началась: замок -->
          <span v-if="item.state === 'live'" class="relative flex size-2">
            <span class="absolute inset-0 rounded-full bg-pitwall-300 motion-safe:animate-ping" />
            <span class="relative size-2 rounded-full bg-pitwall-300" />
          </span>
          <UIcon
            v-else-if="item.state === 'future'"
            class="size-3.5"
            name="i-lucide-lock"
          />
        </template>

        <template #default="{ item }">
          <UTooltip :text="item.state === 'live' ? `Идёт сейчас · результаты после финиша` : item.when">
            <span>{{ item.label }}</span>
          </UTooltip>
        </template>
      </UTabs>
    </div>
  </div>
</template>
