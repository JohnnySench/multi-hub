const DEFAULT_THEME = 'portal'

export function useTheme() {
  const { apps } = useAppConfig()
  const route = useRoute()
  const currentTheme = computed(() => {
    return apps?.find(app => route.path.includes(app.to))?.theme ?? DEFAULT_THEME
  })

  return {
    currentTheme,
  }
}
