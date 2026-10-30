# Ошибки API в F1: план

Цель: одинаково отдавать ошибки из ручек Nitro и одинаково их ловить на клиенте, чтобы у каждой ошибки был свой понятный тост.

## Как устроено

```
Ручка Nitro                         Клиент
createError({                       catch (error)
  status: 404,                        ├─ наша ошибка? (isApiError)
  statusText: 'Not Found',            │    └─ по data.code → свой тост
  message: 'для логов',               └─ нет (сеть, браузер, баг)
  data: { code: 'DEVICE_NOT_FOUND' }       └─ общий тост + console.error
})
```

- **Статус** (`404`, `500`) — для HTTP и общих случаев: «5xx — сервер лёг».
- **Код** (`data.code`) — что именно случилось. По нему клиент выбирает тост.
- **`message`** — для разработчика: логи, DevTools. Пользователю не показываем.
- **Текст тоста** живёт на клиенте, рядом с действием.
- На клиенте в `catch` лежит `FetchError`: тело ответа — в `error.data`, поэтому наш код — в **`error.data.data.code`**, а `message` — в `error.data.message`.

**Сделано (30.10.2026):** коды — `shared/utils/apiErrorCode.ts`, тип тела — `shared/types/api-error.ts`, `apiError` и `readCheckedBody` — `server/utils/apiError.ts`, `isApiError` и `toastForError` — `app/utils/error.ts`. Шаг 6 — позже.

## Шаги

### 1. Убрать ошибки, которые не ошибки

`/api/push/unsubscribe`: устройства нет — тоже успех. Человек хотел, чтобы его не было, и его нет.

- Убрать ветку 404 «Такого устройства и не было».
- Как проверить: два клика «Отписаться» подряд — оба без ошибки.

### 2. Список кодов ошибок

Один объект кодов в `shared/` — его импортируют и ручки, и клиент. Опечатку в коде поймает TypeScript.

- Коды по делу, а не по статусу: `INVALID_SUBSCRIPTION`, `DEVICE_NOT_FOUND`, `PUSH_SERVICE_FAILED`…
- Тип ответа ошибки: `statusCode` + `data.code` (+ `data.message` для логов).

Где: `apps/f1/shared/utils/` (объект кодов) и `apps/f1/shared/types/` (тип ответа).

Подсказка: можно `enum`, как `F1ApiMode` в `shared/utils/f1ApiMode.ts`.

### 3. Ручки отдают код

Во всех `createError` в `server/api/push/` — `data: { code }`.

Подсказка: проверка тела повторяется в трёх ручках (`readBody` → guard → 400). Можно вынести в одну функцию в `server/utils/`, которая сразу бросает `INVALID_SUBSCRIPTION`.

Как проверить: в DevTools → Network у ответа с ошибкой в теле есть `data.code`.

### 4. `isApiError` на клиенте

Type guard: `unknown` → «это ошибка нашей ручки». Та же цепочка «сначала `in`, потом `typeof`», что в `isPushSubscriptionBody`: объект → `statusCode` число → `data` объект → `data.code` строка.

Где: `apps/f1/app/utils/`.

### 5. Тосты по коду

В композабле у каждого действия своя карта «код → тост»: заголовок, текст, `color` (`warning` для «ожидаемого», `error` для настоящих сбоев). Для кода не из карты и для 5xx — общий тост.

Ветка «не наша ошибка» (сеть, `serviceWorker`, баг) — общий тост и `console.error(error)`.

Подсказка: одна маленькая функция «ошибка + карта → параметры тоста» уберёт повтор из трёх `catch`.

Как проверить:
- кривое тело в `/subscribe` → тост про подписку, а не «что-то пошло не так»;
- выключенный сервер → общий тост, ошибка в консоли.

### 6. Позже: общий обработчик

Когда запросов станет много — свой экземпляр `$fetch` через `$fetch.create({ onResponseError })` в плагине: нет сети, 429, 5xx — один тост на всё приложение. Запросу нужна возможность отказаться от общего тоста, чтобы не показать два.

Рецепт Nuxt: [Custom useFetch](https://nuxt.com/docs/guide/recipes/custom-usefetch).

## Чего не делаем

- Не показываем пользователю `message` с сервера — только свои тексты по коду.
- Не различаем ошибки по тексту — только по коду.
- Не оборачиваем `useToast` в свою обёртку — вызываем `add()` напрямую, общая только функция выбора параметров.

## Почитать

- [RFC 9457 · Problem Details](https://www.rfc-editor.org/rfc/rfc9457) — стандарт «ошибка API = объект с типом проблемы», наш `data.code` — его упрощённая версия.
- [Nitro · маршруты](https://nitro.build/docs/routing) и [h3 · утилиты запроса](https://h3.dev/utils/request) (там же `createError`).
- [ofetch · FetchError](https://github.com/unjs/ofetch#%EF%B8%8F-handling-errors) — что лежит в `catch` на клиенте.
