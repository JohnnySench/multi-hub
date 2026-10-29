import { jsonb, primaryKey, snakeCase, text, timestamp } from 'drizzle-orm/pg-core'

export const f1ResponsesTable = snakeCase.table('f1_responses', {
  path: text().notNull(),
  query: text().notNull(),
  data: jsonb().notNull(),
  fetchedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
  primaryKey({ columns: [table.path, table.query] }),
])
