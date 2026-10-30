import { integer, jsonb, primaryKey, snakeCase, text, timestamp } from 'drizzle-orm/pg-core'

export const f1ResponsesTable = snakeCase.table('f1_responses', {
  path: text().notNull(),
  query: text().notNull(),
  data: jsonb().notNull(),
  fetchedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
  primaryKey({ columns: [table.path, table.query] }),
])

export const PushDevices = snakeCase.table('push_devices', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  endpoint: text().unique().notNull(),
  p256dh: text().notNull(),
  auth: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const SentNotifications = snakeCase.table('sent_notifications', {
  deviceId: integer().notNull().references(() => PushDevices.id, { onDelete: 'cascade' }),
  event: text().notNull(),
  sentAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
  primaryKey({ columns: [table.deviceId, table.event] }),
])
