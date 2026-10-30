/** Что именно случилось в ручке: по коду клиент выбирает тост, HTTP-статус для этого слишком грубый */
export enum ApiErrorCode {
  InvalidBody = 'INVALID_BODY',
  DeviceNotFound = 'DEVICE_NOT_FOUND',
  PushServiceFailed = 'PUSH_SERVICE_FAILED',
}
