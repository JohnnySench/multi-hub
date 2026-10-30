import type { H3Event } from 'h3'
import { STATUS_CODES } from 'node:http'

/** Ошибка ручки в одном формате: статус для HTTP, код для клиента, message для логов */
export function apiError(status: number, code: ApiErrorCode, message: string) {
  return createError({
    status,
    statusText: STATUS_CODES[status],
    message,
    data: { code },
  })
}

/** Тело из сети: проверяем guard'ом, не прошло — 400 с кодом INVALID_BODY */
export async function readCheckedBody<T>(event: H3Event, isBody: (body: unknown) => body is T): Promise<T> {
  const body: unknown = await readBody(event)
  if (!isBody(body)) {
    throw apiError(400, ApiErrorCode.InvalidBody, 'Тело запроса не прошло проверку')
  }
  return body
}
