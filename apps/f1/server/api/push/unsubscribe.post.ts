import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { PushDevices } from '~~/server/db/schema'

/** Отписка идемпотентна: устройства уже нет — тоже успех, человек этого и хотел */
export default defineEventHandler(async (event) => {
  const body = await readCheckedBody(event, isPushEndpointBody)

  await db
    .delete(PushDevices)
    .where(eq(PushDevices.endpoint, body.endpoint))

  return { ok: true }
})
