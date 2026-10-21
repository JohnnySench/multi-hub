export const F1ApiMode = {
  Live: 'live',
  Record: 'record',
  Replay: 'replay',
} as const

export type F1ApiModeType = typeof F1ApiMode[keyof typeof F1ApiMode]
