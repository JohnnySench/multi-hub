/** Ошибка $fetch от нашей ручки: в data — тело ответа, в data.data — код из createError */
interface ApiError {
  statusCode: number
  data: ApiErrorBody
}

export function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== 'object') {
    return false
  }
  if (!('statusCode' in error) || typeof error.statusCode !== 'number') {
    return false
  }
  if (!('data' in error) || !error.data || typeof error.data !== 'object') {
    return false
  }
  if (!('data' in error.data) || !error.data.data || typeof error.data.data !== 'object') {
    return false
  }
  return 'code' in error.data.data && typeof error.data.data.code === 'string'
}

type ToastOptions = Parameters<ReturnType<typeof useToast>['add']>[0]

const SERVER_DOWN: ToastOptions = {
  title: 'Сервер не отвечает',
  description: 'Попробуйте чуть позже',
  color: 'error',
}

const UNKNOWN: ToastOptions = {
  title: 'Ошибка',
  description: 'Че то где то пошло не так, возможно даже у меня((',
  color: 'error',
}

/** Тост для ошибки: сначала свой текст действия по коду, потом общий по статусу, иначе — «что-то пошло не так» */
export function toastForError(error: unknown, byCode: Partial<Record<ApiErrorCode, ToastOptions>> = {}): ToastOptions {
  if (!isApiError(error)) {
    return UNKNOWN
  }
  return byCode[error.data.data.code] ?? (error.statusCode >= 500 ? SERVER_DOWN : UNKNOWN)
}
