import type { components } from '#open-fetch-schemas/f1'

import type { ResultRow } from '~/composables/results/useResults.ts'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export enum ResultStatus {
  Finished = 'finished',
  Dnf = 'DNF', // сошёл
  Dns = 'DNS', // не стартовал
  Dsq = 'DSQ', // дисквалифицирован
}

type SessionResult = components['schemas']['SessionResult']
type Stint = components['schemas']['Stint']
type Lap = components['schemas']['Lap']

export function getLapDuration(laps: Lap[]) {
  let min = laps[0]?.lap_duration ?? Infinity
  for (const lap of laps) {
    if (lap.lap_duration && lap.lap_duration < min) {
      min = lap.lap_duration
    }
  }
  return min
}
export function getRaceDuration(sessionResult: SessionResult) {
  const status = resultStatus(sessionResult)
  if (status !== ResultStatus.Finished) {
    return status
  }
  if (sessionResult.position === 1) {
    const duration = Array.isArray(sessionResult.duration) ? null : sessionResult.duration
    return formatTime(duration)
  }
  return formatGap(sessionResult.gap_to_leader)
}

export function resultStatus(r: SessionResult): ResultStatus {
  if (r.dsq)
    return ResultStatus.Dsq
  if (r.dns)
    return ResultStatus.Dns
  if (r.dnf)
    return ResultStatus.Dnf
  return ResultStatus.Finished
}

export function formatTime(seconds: number | null) {
  if (seconds == null)
    return '—'
  const format = seconds >= 3600 ? 'H:mm:ss.SSS' : 'm:ss.SSS'
  return dayjs.duration(seconds, 'seconds').format(format)
}

export function formatGap(gap: SessionResult['gap_to_leader']) {
  if (typeof gap === 'number')
    return `+${gap.toFixed(3)}`
  if (typeof gap === 'string') {
    return gap
      .replace('LAPS', 'круга')
      .replace('LAP', 'круг')
  }
  return '—'
}

export function getCompound(stints: Stint[]) {
  return stints.toSorted().map(stint => stint.compound)
}

export function getBestLapDuration(results: ResultRow[] | undefined) {
  if (results && results.length) {
    let minLapDuration = results[0]?.lapDuration ?? Infinity
    let driver: ResultRow = results[0]!
    for (const result of results) {
      if (result.lapDuration && result.lapDuration < minLapDuration) {
        minLapDuration = result.lapDuration
        driver = result
      }
    }
    return driver
  }
}
