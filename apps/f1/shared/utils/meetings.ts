import type { components } from '#open-fetch-schemas/f1'

import type { MeetingItem } from '../types/race'

type Meeting = components['schemas']['Meeting']

/** Тесты не береим в счет */
const TESTING = 'Testing'

/**
 * Ответ /meetings → этапы по порядку дат с номером R1…R{N}.
 * Нужен и странице (селект этапа), и шапке (поиск, прогресс сезона)
 */
export function toMeetingItems(meetings: Meeting[]): MeetingItem[] {
  let round = 0
  return meetings
    .toSorted((a, b) => Date.parse(a.date_start) - Date.parse(b.date_start))
    .map((meeting) => {
      const isTesting = meeting.meeting_name.includes(TESTING)
      const isRace = !meeting.is_cancelled && !isTesting
      return {
        countryName: meeting.country_name,
        location: meeting.location,
        meetingKey: meeting.meeting_key,
        isCancelled: meeting.is_cancelled,
        dateStart: meeting.date_start,
        dateEnd: meeting.date_end,
        round: isRace ? ++round : null,
        isTesting,
      }
    })
}

const dateRange = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'short' })

/** «9–11 окт», «28 мар – 1 апр»: точку после сокращения месяца убираем */
export function formatDateRange(start: string, end: string) {
  return dateRange.formatRange(new Date(start), new Date(end)).replaceAll('.', '')
}

const dayMonth = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long' })

/** «11 октября» */
export function formatDayMonth(date: string) {
  return dayMonth.format(new Date(date))
}

const pluralRules = new Intl.PluralRules('ru')

interface PluralForms {
  /** 1, 21 круг */
  one: string
  /** 2–4, 62 круга */
  few: string
  /** 5–20, 56 кругов */
  many: string
}

/** Число со словом в нужной форме: «62 круга», «56 кругов» */
export function pluralize(count: number, forms: PluralForms) {
  const form = pluralRules.select(count)
  const word = form === 'one' ? forms.one : form === 'few' ? forms.few : forms.many
  return `${count} ${word}`
}

const sessionTime = new Intl.DateTimeFormat('ru', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

/** «сб, 4 окт., 16:00» → «Сб, 4 окт · 16:00»: время по часам пользователя */
export function formatSessionTime(date: string) {
  const parts = Object.fromEntries(sessionTime.formatToParts(new Date(date)).map(part => [part.type, part.value]))
  const weekday = `${parts.weekday?.charAt(0).toUpperCase()}${parts.weekday?.slice(1)}`
  return `${weekday}, ${parts.day} ${parts.month?.replace('.', '')} · ${parts.hour}:${parts.minute}`
}

/** Один и тот же календарный день по часам пользователя */
export function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}
