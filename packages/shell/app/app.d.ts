export interface AppEntry {
  name: string
  to: string
  title: string
  icon: string
  theme: string
  nav: NavigationMenuItem[]
}

declare module '@nuxt/schema' {
  interface AppConfigInput { // запись: подсказки и ошибки в hub/admin
    apps?: AppEntry[]
  }
  interface CustomAppConfig { // чтение: тип useAppConfig().apps
    apps?: AppEntry[]
  }
}
