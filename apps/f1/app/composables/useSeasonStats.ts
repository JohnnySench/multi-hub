/** Прогресс сезона для селекта в шапке: «идёт · 17 из 23», «24 этапа» */
export interface SeasonStats {
  year: number
  /** Гонок в календаре — без тестов и отменённых */
  total: number
  /** Сколько уже прошло */
  done: number
}

/** Грузим только при открытии селекта: закрытому он не нужен. Один запрос /meetings на каждый сезон */
export function useSeasonStats() {
  const { $f1 } = useNuxtApp()
  const { YEARS } = useSelectedYear()

  const { data: stats, status, execute } = useLazyAsyncData('season-stats', async () => {
    const seasons = await Promise.all(YEARS.map(({ value }) => $f1('/meetings', { query: { year: value } })))
    return seasons.map((meetings, index): SeasonStats => {
      const races = toMeetingItems(meetings).filter(meeting => meeting.round !== null)
      return {
        year: YEARS[index]!.value,
        total: races.length,
        done: races.filter(race => Date.parse(race.dateEnd) < Date.now()).length,
      }
    })
  }, {
    immediate: false,
    default: () => [],
  })

  const statsByYear = computed(() => new Map(stats.value.map(season => [season.year, season])))

  function load() {
    if (status.value === 'idle') {
      execute()
    }
  }

  /** «идёт · 17 из 23» или «24 этапа»; пока не загрузилось — пусто */
  function describe(year: number) {
    const season = statsByYear.value.get(year)
    if (!season) {
      return ''
    }
    return season.done < season.total
      ? `идёт · ${season.done} из ${season.total}`
      : pluralize(season.total, { one: 'этап', few: 'этапа', many: 'этапов' })
  }

  return {
    load,
    describe,
  }
}
