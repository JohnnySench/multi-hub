import type { components } from '#open-fetch-schemas/f1'

type Driver = components['schemas']['Driver']
type SessionResult = components['schemas']['SessionResult']
type Stint = components['schemas']['Stint']

/** Строка таблицы результатов: нужна и в app, и в shared/utils, поэтому живёт в shared */
export interface ResultRow {
  position: SessionResult['position']
  nameAcronym: Driver['name_acronym']
  fullName: Driver['full_name']
  teamName: Driver['team_name']
  teamColor: Driver['team_colour']
  points: SessionResult['points']
  duration: string
  /** Лучший круг пилота в секундах — для сравнения */
  lapTime: number | null
  /** Он же для показа */
  lapDuration: string
  /** Лучший круг всей сессии — фиолетовый */
  isFastest: boolean
  compound: Stint['compound'][]
  pits: number
  laps: number | null
}
