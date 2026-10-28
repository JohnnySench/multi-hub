import type { components } from '#open-fetch-schemas/f1'

import type { ResultRow } from '../types/results'

/** Дополнение нулями слева: 5 → «05», 7 → «007» */
const pad2 = new Intl.NumberFormat('ru', { minimumIntegerDigits: 2, useGrouping: false })
const pad3 = new Intl.NumberFormat('ru', { minimumIntegerDigits: 3, useGrouping: false })

export enum ResultStatus {
  Finished = 'finished',
  Dnf = 'DNF', // сошёл
  Dns = 'DNS', // не стартовал
  Dsq = 'DSQ', // дисквалифицирован
}

type SessionResult = components['schemas']['SessionResult']
type Stint = components['schemas']['Stint']
type Lap = components['schemas']['Lap']

/** Лучший круг пилота в секундах; круги без времени (въезд в пит, красный флаг) пропускаем */
export function getLapDuration(laps: Lap[]) {
  let min: number | null = null
  for (const lap of laps) {
    if (lap.lap_duration != null && (min === null || lap.lap_duration < min)) {
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
  /** Считаем в целых миллисекундах, чтобы не ловить 95.676 → 95.67599999 */
  const totalMs = Math.round(seconds * 1000)
  const h = Math.floor(totalMs / 3_600_000)
  const m = Math.floor(totalMs / 60_000) % 60
  const s = Math.floor(totalMs / 1000) % 60
  const ms = totalMs % 1000
  const tail = `${pad2.format(s)}.${pad3.format(ms)}`
  /** Гонка — H:mm:ss.SSS, круг — m:ss.SSS */
  return h > 0 ? `${h}:${pad2.format(m)}:${tail}` : `${m}:${tail}`
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
  return stints
    .toSorted((a, b) => a.stint_number - b.stint_number)
    .map(stint => stint.compound)
}

/** Пит-стопов на один меньше, чем отрезков на шинах */
export function getPitCount(stints: Stint[]) {
  return Math.max(stints.length - 1, 0)
}

/** Лучший круг сессии: сравниваем секунды, а не отформатированные строки */
export function getFastestLapTime(results: ResultRow[]) {
  let min: number | null = null
  for (const result of results) {
    if (result.lapTime !== null && (min === null || result.lapTime < min)) {
      min = result.lapTime
    }
  }
  return min
}
