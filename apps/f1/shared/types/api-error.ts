/** Тело ответа с ошибкой, как его отдаёт createError: `data` — наше поле с кодом */
export interface ApiErrorBody {
  statusCode: number
  /** Для логов и DevTools, пользователю не показываем */
  message: string
  data: {
    code: ApiErrorCode
  }
}
