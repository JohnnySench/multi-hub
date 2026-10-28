/** Этап из адреса (?meeting=1270); в адресе строка — переводим в число */
export const useSelectedMeeting = createSharedComposable(() => {
  const meeting = useRouteQuery<string | undefined, number | undefined>('meeting', undefined, {
    transform: {
      get: value => (value ? Number(value) : undefined),
      set: value => (value ? String(value) : undefined),
    },
  })

  return {
    meeting,
  }
})
