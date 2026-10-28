/** session_name в OpenF1. В 2023 квалификация к спринту называлась Sprint Shootout */
export enum SessionName {
  Practice1 = 'Practice 1',
  Practice2 = 'Practice 2',
  Practice3 = 'Practice 3',
  SprintQualifying = 'Sprint Qualifying',
  SprintShootout = 'Sprint Shootout',
  Sprint = 'Sprint',
  Qualifying = 'Qualifying',
  Race = 'Race',
}

const SESSION_LABELS: Record<SessionName, string> = {
  [SessionName.Practice1]: 'П1',
  [SessionName.Practice2]: 'П2',
  [SessionName.Practice3]: 'П3',
  [SessionName.SprintQualifying]: 'Спринт-квала',
  [SessionName.SprintShootout]: 'Спринт-квала',
  [SessionName.Sprint]: 'Спринт',
  [SessionName.Qualifying]: 'Квала',
  [SessionName.Race]: 'Гонка',
}

function isSessionName(value: string): value is SessionName {
  return Object.values<string>(SessionName).includes(value)
}

/** Неизвестные названия (тесты: «Day 1») показываем как есть */
export function getSessionLabel(sessionName: string) {
  return isSessionName(sessionName) ? SESSION_LABELS[sessionName] : sessionName
}

export function findLastFinished<T extends { dateEnd: string, isCancelled?: boolean }>(items: T[], now = Date.now()) {
  return items.findLast(item => !item.isCancelled && Date.parse(item.dateEnd) < now)
}
