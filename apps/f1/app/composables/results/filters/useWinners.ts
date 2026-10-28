/** Получаем победителей для USelectMenu рядом с этапами чемпионата */
export function useWinners() {
  const { year } = useSelectedYear()

  /** Без immediate: грузим при первом открытии селекта, ключ — свой на каждый сезон */
  const { data: winners, status, execute } = useLazyAsyncData(() => `winners-${toValue(year)}`, async () => {
    return await $fetch('/api/winners', { query: { year: toValue(year) } })
  }, {
    immediate: false,
    default: () => [],
  })

  /** Победитель по ключу этапа — в строке списка ищем без перебора */
  const winnerByMeeting = computed(() => new Map(winners.value.map(winner => [winner.meetingKey, winner])))

  /** idle тоже «грузится»: при открытии список рисуется раньше, чем execute сменит статус */
  const isLoading = computed(() => status.value === 'idle' || status.value === 'pending')

  /** Один запрос на сезон: повторное открытие и ошибка не перезапрашивают */
  function load() {
    if (status.value === 'idle') {
      execute()
    }
  }

  return {
    winnerByMeeting,
    isLoading,
    load,
  }
}
