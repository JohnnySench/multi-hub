import { sql } from 'drizzle-orm'
import { db } from '~~/server/db'

export default defineEventHandler(async () => {
  return await db.execute(sql`select 1 as ok`)
})
