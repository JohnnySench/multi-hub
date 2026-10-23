import type { F1ApiModeType } from '../utils/f1ApiMode'

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    f1ApiMode: F1ApiModeType
  }
}
export {}
