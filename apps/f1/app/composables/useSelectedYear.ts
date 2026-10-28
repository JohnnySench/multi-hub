export const useSelectedYear = createSharedComposable(() => {
  const CURRENT_YEAR = 2026
  const YEARS = [
    {
      value: CURRENT_YEAR,
      label: `Сезон ${CURRENT_YEAR}`,
    },
    {
      value: 2025,
      label: 'Сезон 2025',
    },
  ]
  /** ?year=abc или сезон, которого нет в списке, — показываем текущий, а не NaN */
  const year = useRouteQuery('year', CURRENT_YEAR, {
    mode: 'replace',
    transform: (value) => {
      const parsed = Number(value)
      return YEARS.some(item => item.value === parsed) ? parsed : CURRENT_YEAR
    },
  })

  return {
    year,
    YEARS,
  }
})
