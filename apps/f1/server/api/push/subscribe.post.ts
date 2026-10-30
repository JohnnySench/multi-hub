import { db } from '~~/server/db'
import { PushDevices } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readCheckedBody(event, isPushSubscriptionBody)

  await db
    .insert(PushDevices)
    .values({
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
    })
    .onConflictDoUpdate({
      target: PushDevices.endpoint,
      set: {
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
        lastSeenAt: new Date(),
      },
    })

  return { ok: true }
})
