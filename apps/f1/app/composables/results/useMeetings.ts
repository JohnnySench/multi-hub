import type { components } from '#open-fetch-schemas/f1'

export type Meeting = components['schemas']['Meeting']

export function useMeetings() {
  const { $f1 } = useNuxtApp()

  function format(meeting: Meeting) {
    return {
      countryName: meeting.country_name,
      location: meeting.location,
      meetingKey: meeting.meeting_key,
      isCancelled: meeting.is_cancelled,
      dateStart: meeting.date_start,
      dateEnd: meeting.date_end,
    }
  }

  function handleMeetings(meetings: Meeting[]) {
    const items = []
    const sortedMeetings = meetings.toSorted(
      (a, b) => Date.parse(a.date_start) - Date.parse(b.date_start),
    )
    for (const meeting of sortedMeetings) {
      items.push(format(meeting))
    }
    return items
  }

  const { data: meetings } = useLazyAsyncData('meetings', async () => {
    return await $f1('/meetings', { query: { year: 2026 } })
  }, {
    transform: (input) => {
      return handleMeetings(input)
    },
  })

  return {
    meetings,
  }
}
