import { eq } from 'drizzle-orm'
import webpush from 'web-push'
import { db } from '~~/server/db'
import { PushDevices } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({
      status: 404,
    })
  }
  const body = await readCheckedBody(event, isPushEndpointBody)

  const config = useRuntimeConfig(event)

  const [device] = await db
    .select()
    .from(PushDevices)
    .where(eq(PushDevices.endpoint, body.endpoint))
    .limit(1)

  if (!device) {
    throw apiError(404, ApiErrorCode.DeviceNotFound, 'Устройства с таким endpoint нет в push_devices')
  }
  const sub = {
    endpoint: device.endpoint,
    keys: {
      p256dh: device.p256dh,
      auth: device.auth,
    },
  }
  webpush.setVapidDetails(
    `mailto:${config.vapidSubjectSecret}`,
    config.public.vapidKey,
    config.vapidKeySecret,
  )

  /** Тот же формат, что читает readPayload в sw.ts */
  const payload = JSON.stringify({
    title: 'Тестовое уведомление',
    body: 'Пуши доходят — можно ждать старта гонки',
    url: '/subscriptions',
  })

  try {
    await webpush.sendNotification(sub, payload)
  }
  catch (error) {
    /** Push-сервис ответил не 2xx — web-push бросает WebPushError. Для нас это сбой внешнего сервиса: 502, его ответ — в message */
    if (error instanceof webpush.WebPushError) {
      throw apiError(502, ApiErrorCode.PushServiceFailed, `Push-сервис ответил ${error.statusCode}: ${error.body}`)
    }
    throw error
  }

  return { ok: true }
})
