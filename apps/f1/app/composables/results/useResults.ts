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

interface UseResults {
  /** Ключ сессии, уже с умолчанием — его считает страница */
  sessionKey: MaybeRefOrGetter<number | undefined>
}

export async function useResults({ sessionKey }: UseResults) {
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

  function format({ sessionResult, driver, stints, laps }: ItemHandleResult): ResultRow {
    const lapTime = getLapDuration(laps)
    return {
      position: sessionResult.position,
      points: sessionResult.points,
      duration: getRaceDuration(sessionResult),
      nameAcronym: driver.name_acronym,
      fullName: driver.full_name,
      teamName: driver.team_name,
      teamColor: driver.team_colour,
      lapTime,
      lapDuration: formatTime(lapTime),
      isFastest: false,
      compound: getCompound(stints),
      pits: getPitCount(stints),
      laps: sessionResult.number_of_laps,
    }
  }

  function handleResults({ sessionResults, drivers, stints, laps }: ParamsHandleResult) {
    const items: ResultRow[] = []
    const { driverIndexes, stintIndexes, lapIndexes } = createIndexes({ drivers, stints, laps })
    for (const sessionResult of sessionResults) {
      const driver = driverIndexes.get(sessionResult.driver_number)
      if (!driver) {
        continue
      }
      const item: ItemHandleResult = {
        sessionResult,
        driver,
        stints: stintIndexes.get(sessionResult.driver_number) ?? [],
        laps: lapIndexes.get(sessionResult.driver_number) ?? [],
      }
      items.push(format(item))
    }
    const fastest = getFastestLapTime(items)
    for (const item of items) {
      item.isFastest = fastest !== null && item.lapTime === fastest
    }
    return items
  }

  const { data: results, pending } = await useAsyncData(() => `results-${toValue(sessionKey)}`, async (_nuxtApp, { signal }) => {
    const key = toValue(sessionKey)
    if (key === undefined) {
      return []
    }
    const [sessionResults, drivers, stints, laps] = await Promise.all([
      $f1('/session_result', { query: { session_key: key }, signal }),
      $f1('/drivers', { query: { session_key: key }, signal }),
      $f1('/stints', { query: { session_key: key }, signal }),
      $f1('/laps', { query: { session_key: key }, signal }),
    ])
    return handleResults({ sessionResults, drivers, stints, laps })
  }, {
    default: () => [],
  })

  return {
    results,
    pending,
  }
}
