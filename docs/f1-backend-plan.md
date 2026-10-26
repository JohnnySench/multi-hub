# F1: свой бэкенд и база — план на будущее

Зачем: не упираться в ограничения OpenF1. Сейчас фронт работает на OpenF1, и переходить нужно постепенно, не переписывая интерфейс.

## Какие ограничения что решает

| Ограничение OpenF1 | Чем решается |
|---|---|
| лимит частоты запросов на бесплатном доступе | кэш на сервере → своя база: каждую сессию качаем один раз |
| 401 во время живых сессий (даже на историю) | своя база: что уже лежит, отдаётся и во время гонки |
| live-данные текущей сессии | **база не решает.** Либо платный тариф OpenF1, либо неофициальный F1 Live Timing (только для себя, не для публичного сервиса) |

## Решения

- **Контракт — `apps/f1/specs/f1.yaml`.** Любой будущий источник отдаёт то, что в нём описано. Новые поля сначала в спеку.
- **Фронт ходит только в `/api/f1/*`.** Смена источника — правка `apps/f1/server/api/f1/[...path].ts`, фронт не трогаем.
- **Бэкенд — Nitro внутри Nuxt (TypeScript).** Отдельный FastAPI не нужен.
- **База — PostgreSQL + Drizzle** (ORM на TS с миграциями).
- **Наполнять базу из OpenF1.** История там бесплатная, формат уже совпадает с контрактом.
- **FastF1 (Python) — только если понадобятся данные, которых нет в OpenF1.** Тогда это отдельный сборщик, который пишет в ту же базу; наружу всё равно отдаёт Nitro.
- **Ключи пока из OpenF1** (`meeting_key`, `session_key`, `driver_number`). Свои ID — только когда источников станет два.

## Этапы

Задачи на доске: эпик [#105](https://github.com/JohnnySench/multi-hub/issues/105), подзадачи #106–#118 по порядку.

| Этап | Задачи |
|---|---|
| 0. Подготовка | #106 убрать `latest` |
| 1. Постоянный кэш | #107 кэш на диск |
| 2. База на одной гонке | #108 Postgres · #109 Drizzle · #110 таблица и миграция · #111 `readF1`/`saveF1` · #112 режим `db` |
| 3. Сборщик | #113 одна сессия · #114 весь сезон · #115 крон · #116 остальные ручки |
| Деплой | #117 сборка в CI · #118 VPS |

### 0. Сейчас — продолжаем на OpenF1
- Делаем страницы как есть.
- Во фронте не завязываемся на особенности OpenF1. Где используется `session_key: 'latest'` — запомнить: потом его придётся поддержать на сервере.

### 1. Постоянный кэш (без базы)
- Хранилище кэша Nitro — с памяти на диск или Redis (конфиг `nitro.storage`).
- Итог: кэш переживает перезапуск сервера, повторных запросов в OpenF1 почти нет.

### 2. Вертикальный срез на базе
- Postgres + Drizzle, схема под 4 ручки таблицы результатов: `session_result`, `drivers`, `stints`, `laps`.
- Скрипт загрузки одной гонки из OpenF1 в базу (Сингапур 2025, `session_key=9896`).
- Ручка Nitro отдаёт эти 4 ответа из базы в формате спеки.
- Итог: страница «Результаты» работает из своей базы без изменений во фронте.

### 3. Остальные ручки и весь сезон
- `meetings`, `sessions` и остальные ручки — по тому же шаблону.
- Сборщик: идёт по сезону, пропускает уже загруженное (уникальные ключи), повторяет при ошибках, помнит прогресс.
- Запускается по расписанию (Nitro scheduled tasks или cron), после каждого уикенда.
- Чего нет в базе — проксируем в OpenF1 и сохраняем (тот же record-режим, только в базу).

### 4. Тяжёлые данные — по необходимости
- `car_data`, `location` — сотни тысяч строк на сессию. Собирать только то, что реально показываем, и только за нужные сессии.

### 5. Live — в самом конце и отдельным решением
- Выбрать источник: платный OpenF1 или F1 Live Timing (SignalR, неофициально, может сломаться).
- Доставка на фронт — WebSocket или SSE из Nitro.

## Как это выглядит в коде (набросок)

Простой вариант базы: одна таблица, ответ OpenF1 хранится целиком под ключом «путь + параметры». Это record-режим, только в Postgres вместо JSON-файлов.

```
OpenF1 ──(сборщик по крону, редко)──▶ Postgres ──(Nitro, на каждый запрос)──▶ фронт
                 ▲                                          │
                 └──────── нет в базе: взять и сохранить ◀──┘
```

### Схема — `server/database/schema.ts`

```ts
import { jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

/** Ответы OpenF1 как есть: ключ — путь + отсортированные параметры, как у моков */
export const f1Responses = pgTable('f1_responses', {
  path: text('path').notNull(), // 'session_result'
  query: text('query').notNull(), // 'session_key=9896'
  data: jsonb('data').notNull(),
  fetchedAt: timestamp('fetched_at').notNull().defaultNow(),
}, table => [
  primaryKey({ columns: [table.path, table.query] }),
])
```

### Подключение и хранилище — `server/utils/db.ts`, `server/utils/f1Store.ts`

```ts
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../database/schema'

export const db = drizzle(useRuntimeConfig().databaseUrl, { schema })
```

```ts
import { and, eq } from 'drizzle-orm'
import { f1Responses } from '../database/schema'

/** Тот же ключ, что сейчас у моков: параметры по алфавиту */
export function hashQuery(query: Record<string, unknown>) {
  return Object.entries(query).sort().map(([k, v]) => `${k}=${v}`).join('&')
}

export async function readF1(path: string, query: string) {
  const [row] = await db.select().from(f1Responses)
    .where(and(eq(f1Responses.path, path), eq(f1Responses.query, query)))
    .limit(1)
  return row?.data
}

export async function saveF1(path: string, query: string, data: unknown) {
  await db.insert(f1Responses)
    .values({ path, query, data })
    .onConflictDoUpdate({
      target: [f1Responses.path, f1Responses.query],
      set: { data, fetchedAt: new Date() },
    })
}
```

### Ручка для фронта — `server/api/f1/[...path].ts` (режим `Live`)

```ts
const path = getRouterParam(event, 'path')!
const query = getQuery(event)
const key = hashQuery(query)

/** 'latest' каждый уикенд указывает на новую сессию — его в базу не кладём */
const isLatest = Object.values(query).includes('latest')

if (!isLatest) {
  const stored = await readF1(path, key)
  if (stored) {
    return stored
  }
}

/** В базе нет — берём из OpenF1, отдаём и сохраняем (ленивое наполнение) */
const response = await fetchF1(path, query)
if (!isLatest) {
  await saveF1(path, key, response)
}
return response
```

### Сборщик — `server/tasks/f1/collect.ts`

```ts
/** Заранее складывает в базу всё лёгкое за сезон */
const SESSION_PATHS = ['session_result', 'drivers', 'stints', 'laps', 'race_control', 'weather']

export default defineTask({
  meta: { name: 'f1:collect', description: 'Загрузить сезон из OpenF1 в базу' },
  async run({ payload }) {
    const year = Number(payload.year ?? new Date().getFullYear())
    const meetings = await fetchAndSave<Meeting[]>('meetings', { year })

    for (const meeting of meetings) {
      const sessions = await fetchAndSave<Session[]>('sessions', { meeting_key: meeting.meeting_key })

      for (const session of sessions) {
        if (new Date(session.date_end) > new Date()) {
          continue // ещё не прошла
        }
        for (const path of SESSION_PATHS) {
          const query = { session_key: session.session_key }
          if (await readF1(path, hashQuery(query))) {
            continue // уже есть — не тратим лимит
          }
          await fetchAndSave(path, query)
        }
      }
    }
    return { result: 'ok' }
  },
})

async function fetchAndSave<T>(path: string, query: Record<string, unknown>) {
  const data = await fetchF1<T>(path, query)
  await saveF1(path, hashQuery(query), data)
  await new Promise(resolve => setTimeout(resolve, 500)) // пауза под лимит OpenF1
  return data
}
```

### Крон — `nuxt.config.ts`

```ts
nitro: {
  experimental: { tasks: true },
  scheduledTasks: {
    '0 6 * * 1': ['f1:collect'], // каждый понедельник в 6:00, после уикенда
  },
},
```

### Заметки

- `latest` не кэшируем: он меняется каждый уикенд. Фронт постепенно переводить на явный `session_key`.
- Одна таблица ищет только по точному запросу: `laps?session_key=9896` найдётся, `laps?session_key=9896&driver_number=1` — нет, уйдёт в OpenF1. Понадобятся фильтры — разбирать ответы на настоящие таблицы (`laps`, `stints`… с колонками).
- Сборщик пропускает сохранённое, поэтому после ошибки повторный запуск продолжит с того же места.
- Крон Nitro работает только на постоянно запущенном сервере (`node .output/server/index.mjs`), не на serverless.

## Сервер и объёмы

| Данные | На сессию | На сезон |
|---|---|---|
| лёгкие ручки (почти всё — `laps`) | ~1–1,5 МБ | ~100–150 МБ |
| `car_data` / `location` | ~500 тыс. строк, порядка 100 МБ каждая | — |
| телеметрия гонок и квалификаций | ~400 МБ на уикенд | ~10 ГБ |

- Без телеметрии 4 сезона (2023–2026) — меньше 0,5 ГБ. Postgres ещё и сжимает `jsonb`.
- Сервер: VPS **2 vCPU, 2–4 ГБ RAM, 40 ГБ SSD** — хватит на Nuxt (~300 МБ), Postgres (200–500 МБ) и всю историю без телеметрии.
- Собирать проект не на сервере: `nuxt build` ест 2–4 ГБ памяти. Сборка локально или в GitHub Actions, на сервер — готовая `.output`.
- На старте базу можно держать в облачном Postgres с бесплатным уровнем (Neon, Supabase, ~0,5 ГБ) — хватит на лёгкие данные. Свой Postgres — когда дойдёт до телеметрии.

## Риски

- Данные F1 защищены правами: для себя и для учёбы — нормально, публичная перераздача — юридический вопрос.
- Сборщику нужен постоянно живущий сервер или cron — на бесплатном serverless не поедет.
- Если подключим FastF1 — поля и идентификаторы там другие, понадобится преобразование к контракту.
