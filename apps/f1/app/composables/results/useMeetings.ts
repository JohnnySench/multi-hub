import type { components } from '#open-fetch-schemas/f1'

export type Meeting = components['schemas']['Meeting']

export async function useMeetings() {
  const { $f1 } = useNuxtApp()

  const { year } = useSelectedYear()

  /** Сортировка и номер этапа — в toMeetingItems (shared/utils/meetings.ts), им же пользуется шапка */
  const { data: meetings } = await useAsyncData(() => `meetings-${toValue(year)}`, async () => {
    return await $f1('/meetings', { query: { year: toValue(year) } })
  }, {
    transform: (input) => {
      return toMeetingItems(input)
    },
    default: () => [],
  })

  return {
    meetings,
  }
}
