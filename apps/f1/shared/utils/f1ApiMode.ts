/** Режим прокси OpenF1: живой API, запись ответов в моки или проигрывание моков */
export enum F1ApiMode {
  Live = 'live',
  Record = 'record',
  Replay = 'replay',
  Db = 'db',
}
