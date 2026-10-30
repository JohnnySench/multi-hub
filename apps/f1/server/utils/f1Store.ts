import { and, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { f1ResponsesTable } from '~~/server/db/schema'

/**
 * В базу записываем/достаем по хешу запроса (OpenF1)
 * Фильтр-диапазон OpenF1 `meeting_key>=1253` приходит ключом `meeting_key>`.
 * Символы < и > нельзя в имени файла на Windows — в имени мока пишем _gte / _lte
 *
 * Ключ и значение экранируем: `&` и `=` внутри значения иначе совпадут с разделителями,
 * и чужой запрос ляжет в базу под ключом нашего. Буквы, цифры и `_` не меняются — старые моки находятся
 */
export function hashQuery(query: Record<string, unknown>) {
  return Object.entries(query)
    .sort()
    .map(([k, v]) => `${encodeURIComponent(k.replace('>', '_gte').replace('<', '_lte'))}=${encodeQueryValue(v)}`)
    .join('&')
}

/** Повторённый параметр (`?driver=1&driver=4`) — массив: элементы через `,`, а запятая внутри значения экранируется */
function encodeQueryValue(value: unknown) {
  return Array.isArray(value)
    ? value.map(item => encodeURIComponent(String(item))).join(',')
    : encodeURIComponent(String(value))
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
