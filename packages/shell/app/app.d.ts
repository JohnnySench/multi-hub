export interface AppNavItem {
  label: string
  icon: `i-lucide-${string}`
  to: string
}

export interface AppNavGroup {
  label: string
  items: AppNavItem[]
}

export interface AppEntry {
  name: string
  to: string
  title: string
  icon: `i-lucide-${string}`
  theme?: string
  nav?: AppNavGroup[]
}

declare module '@nuxt/schema' {
  interface AppConfigInput { // запись: подсказки и ошибки в f1/...others apps
    apps?: AppEntry[]
  }
  interface CustomAppConfig { // чтение: тип useAppConfig().apps
    apps?: AppEntry[]
  }
}
