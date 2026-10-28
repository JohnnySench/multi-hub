import type { components } from '#open-fetch-schemas/f1'

type Session = components['schemas']['Session']
type SessionResult = components['schemas']['SessionResult']
type Driver = components['schemas']['Driver']

export interface SeasonWinner {
  meetingKey: SessionResult['meeting_key']
  nameAcronym: Driver['name_acronym']
  teamColor: Driver['team_colour']
}

export default defineCachedEventHandler(async (event): Promise<SeasonWinner[]> => {
  const year = Number(getQuery(event).year)

  /** 1. Гонки сезона: из них диапазон этапов и последняя прошедшая гонка */
  const races = await event.$fetch<Session[]>('/api/f1/sessions', {
    query: { year, session_name: 'Race' },
  })
  const meetingKeys = races.map(race => race.meeting_key)
  const lastRace = races
    .filter(race => Date.parse(race.date_end) < Date.now())
    .toSorted((a, b) => Date.parse(a.date_start) - Date.parse(b.date_start))
    .at(-1)
  if (!lastRace) {
    return [] // сезон ещё не начался
  }

  /** 2. P1 всех сессий сезона и пилоты — друг от друга не зависят */
  const [results, drivers] = await Promise.all([
    event.$fetch<SessionResult[]>('/api/f1/session_result', {
      query: {
        'position': 1,
        'meeting_key>': Math.min(...meetingKeys),
        'meeting_key<': Math.max(...meetingKeys),
      },
    }),
    event.$fetch<Driver[]>('/api/f1/drivers', {
      query: { meeting_key: lastRace.meeting_key },
    }),
  ])

  /** 3. Склейка: из всех P1 оставляем гонки, пилота берём по номеру */
  const raceKeys = new Set(races.map(race => race.session_key))
  const driverIndexes = new Map(drivers.map(driver => [driver.driver_number, driver]))

  const winners: SeasonWinner[] = []
  for (const result of results) {
    const driver = driverIndexes.get(result.driver_number)
    if (!raceKeys.has(result.session_key) || !driver) {
      continue
    }
    winners.push({
      meetingKey: result.meeting_key,
      nameAcronym: driver.name_acronym,
      teamColor: driver.team_colour,
    })
  }
  return winners
}, {
  /** Победители прошедших гонок не меняются — держим сутки */
  maxAge: 60 * 60 * 24,
  /** Как у прокси: кэш только в live, в dev на моках — каждый раз заново */
  shouldBypassCache: () => useRuntimeConfig().f1ApiMode !== F1ApiMode.Live,
})
