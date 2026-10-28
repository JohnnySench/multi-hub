import type { components } from '#open-fetch-schemas/f1'

type Meeting = components['schemas']['Meeting']
type Session = components['schemas']['Session']

/** Этап в селекте: поля в camelCase, как у ResultRow */
export interface MeetingItem {
  meetingKey: Meeting['meeting_key']
  countryName: Meeting['country_name']
  location: Meeting['location']
  isCancelled: Meeting['is_cancelled']
  dateStart: Meeting['date_start']
  dateEnd: Meeting['date_end']
  round: number | null
  isTesting: boolean
}

/** Сессия этапа — таб над таблицей */
export interface SessionItem {
  sessionKey: Session['session_key']
  sessionName: Session['session_name']
  /** Короткая русская подпись: «П1», «Квала», «Гонка» */
  label: string
  dateStart: Session['date_start']
  dateEnd: Session['date_end']
}
