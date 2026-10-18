export interface AppEntry {
    name: string
    to: string
}

declare module '@nuxt/schema' {
    interface AppConfigInput {   // запись: подсказки и ошибки в hub/admin
        apps?: AppEntry[]
    }
    interface CustomAppConfig {  // чтение: тип useAppConfig().apps
        apps?: AppEntry[]
    }
}