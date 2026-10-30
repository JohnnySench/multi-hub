/** Подписка браузера, как её отдаёт PushSubscription.toJSON(): по ней сервер шлёт и шифрует пуш */
export interface PushSubscriptionBody {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}
