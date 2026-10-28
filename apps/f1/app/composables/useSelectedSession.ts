/** Сессия из адреса (?session=9896); в адресе строка — переводим в число */
export const useSelectedSession = createSharedComposable(() => {
  const session = useRouteQuery<string | undefined, number | undefined>('session', undefined, {
    transform: {
      get: value => (value ? Number(value) : undefined),
      set: value => (value ? String(value) : undefined),
    },
  })

  return {
    session,
  }
})
