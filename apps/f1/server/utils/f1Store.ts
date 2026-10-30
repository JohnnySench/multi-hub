import { and, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { f1ResponsesTable } from '~~/server/db/schema'

/**
 * В базу записываем/достаем по хешу запроса (OpenF1)
 * Фильтр-диапазон OpenF1 `meeting_key>=1253` приходит ключом `meeting_key>`.
 * Символы < и > нельзя в имени файла на Windows — в имени мока пишем _gte / _lte
 */
export function hashQuery(query: Record<string, unknown>) {
  return Object.entries(query)
    .sort()
    .map(([k, v]) => `${k.replace('>', '_gte').replace('<', '_lte')}=${v}`)
    .join('&')
}

export async function saveF1<T = unknown[]>(
  path: string,
  query: Record<string, unknown>,
  data: T,
) {
  await db
    .insert(f1ResponsesTable)
    .values({
      path,
      query: hashQuery(query),
      data,
    })
    .onConflictDoUpdate({
      target: [f1ResponsesTable.path, f1ResponsesTable.query],
      set: {
        fetchedAt: new Date(),
        data,
      },
    })
}

export async function readF1(
  path: string,
  query: Record<string, unknown>,
) {
  const [row] = await db
    .select({ data: f1ResponsesTable.data })
    .from(f1ResponsesTable)
    .where(
      and(
        eq(f1ResponsesTable.path, path),
        eq(f1ResponsesTable.query, hashQuery(query)),
      ),
    )
    .limit(1)

  return row ? row.data : null
}
