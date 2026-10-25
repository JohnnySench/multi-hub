import type { components } from '#open-fetch-schemas/f1'

type Driver = components['schemas']['Driver']
type SessionResult = components['schemas']['SessionResult']
type Stint = components['schemas']['Stint']
type Lap = components['schemas']['Lap']

interface ParamsHandleResult {
  drivers: Driver[]
  sessionResults: SessionResult[]
  stints: Stint[]
  laps: Lap[]
}

interface ItemHandleResult {
  sessionResult: SessionResult
  driver: Driver
  stints: Stint[]
  laps: Lap[]
}

interface ParamsCreateIndexes {
  drivers: Driver[]
  stints: Stint[]
  laps: Lap[]
}

export interface ResultRow {
  position: SessionResult['position']
  nameAcronym: Driver['name_acronym']
  fullName: Driver['full_name']
  teamName: Driver['team_name']
  teamColor: Driver['team_colour']
  points: SessionResult['points']
  duration: string
  lapDuration: string
  compound: Stint['compound'][]
}

export function useResults() {
  const { $f1 } = useNuxtApp()

  function createIndexes({ drivers, stints, laps }: ParamsCreateIndexes) {
    const driverIndexes = new Map(drivers.map(driver => [driver.driver_number, driver]))
    const stintIndexes = Map.groupBy(stints, stint => stint.driver_number)
    const lapIndexes = Map.groupBy(laps, lap => lap.driver_number)
    return {
      driverIndexes,
      stintIndexes,
      lapIndexes,
    }
  }

  function format({ sessionResult, driver, stints, laps }: ItemHandleResult) {
    return {
      position: sessionResult.position,
      points: sessionResult.points,
      duration: getRaceDuration(sessionResult),
      nameAcronym: driver.name_acronym,
      fullName: driver.full_name,
      teamName: driver.team_name,
      teamColor: driver.team_colour,
      lapDuration: formatTime(getLapDuration(laps)),
      compound: getCompound(stints),
    }
  }

  function handleResults({ sessionResults, drivers, stints, laps }: ParamsHandleResult) {
    const items: ResultRow[] = []
    const { driverIndexes, stintIndexes, lapIndexes } = createIndexes({ drivers, stints, laps })
    for (const sessionResult of sessionResults) {
      const item: ItemHandleResult = {
        sessionResult,
        driver: driverIndexes.get(sessionResult.driver_number)!,
        stints: stintIndexes.get(sessionResult.driver_number)!,
        laps: lapIndexes.get(sessionResult.driver_number)!,
      }
      items.push(format(item))
    }
    return items
  }

  const { data: results } = useLazyAsyncData('results', async () => {
    const [sessionResults, drivers, stints, laps] = await Promise.all([
      $f1('/session_result', { query: { session_key: 'latest' } }),
      $f1('/drivers', { query: { session_key: 'latest' } }),
      $f1('/stints', { query: { session_key: 'latest' } }),
      $f1('/laps', { query: { session_key: 'latest' } }),
    ])
    return handleResults({ sessionResults, drivers, stints, laps })
  })

  return {
    results,
    bestLapDuration: computed(() => getBestLapDuration(results.value)),
  }
}
