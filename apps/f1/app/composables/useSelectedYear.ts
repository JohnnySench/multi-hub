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
  const year = useRouteQuery('year', CURRENT_YEAR, { mode: 'replace', transform: Number })

  return {
    year,
    YEARS,
  }
})
