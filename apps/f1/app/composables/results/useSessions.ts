import type { components } from '#open-fetch-schemas/f1'

type Session = components['schemas']['Session']

interface UseSessions {
  /** Ключ этапа, уже с умолчанием — его считает страница */
  meetingKey: MaybeRefOrGetter<number | undefined>
}

export async function useSessions({ meetingKey }: UseSessions) {
  const { $f1 } = useNuxtApp()

  function format(session: Session): SessionItem {
    return {
      sessionKey: session.session_key,
      sessionName: session.session_name,
      label: getSessionLabel(session.session_name),
      dateStart: session.date_start,
      dateEnd: session.date_end,
    }
  }

  function handleSessions(sessions: Session[]) {
    const items: SessionItem[] = []
    const sortedSessions = sessions.toSorted(
      (a, b) => Date.parse(a.date_start) - Date.parse(b.date_start),
    )
    for (const session of sortedSessions) {
      items.push(format(session))
    }
    return items
  }

  const { data: sessions, pending } = await useAsyncData(() => `sessions-${toValue(meetingKey)}`, async () => {
    const key = toValue(meetingKey)
    if (key === undefined) {
      return []
    }
    return await $f1('/sessions', { query: { meeting_key: key } })
  }, {
    transform: (input) => {
      return handleSessions(input)
    },
    default: () => [],
  })

  return {
    sessions,
    pending,
  }
}
