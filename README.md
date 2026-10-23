# multiple-apps

Учебная монорепа: несколько Nuxt-приложений на общих слоях. По устройству (рут собирает приложения, приложения стоят на каркасе и ките), но каждое приложение можно запускать и собирать отдельно, а задачи гоняет turbo.

## Оглавление

- [Стек](#стек)
- [Структура](#структура)
- [Команды](#команды)
- [Git-хуки](#git-хуки)
- [Документация](#документация)

## Стек

- Nuxt 4, Vue 3, TypeScript 6
- Nuxt UI 4, Tailwind CSS 4
- pnpm workspaces + catalog (версии зависимостей в `pnpm-workspace.yaml`)
- Turborepo (кэш задач, граф, генератор приложений)
- ESLint на `@antfu/eslint-config`, husky + lint-staged

## Структура

```
apps/
  portal/        рут: подключает все приложения через extends, своих страниц нет
  f1/            приложение, страницы под /f1
packages/
  shell/         каркас: UApp, layout, выбор приложения на /, общие модули (@nuxt/eslint)
  ui/            кит: Nuxt UI, Tailwind, тема, общие компоненты (PriceTag)
  utils/         обычная TS-библиотека без Nuxt
  eslint-config/ общие правила линта
turbo/generators/ генератор нового приложения (turbo gen)
```

Кто на кого опирается: `portal → f1 → shell → ui → utils`. Подробно — в [docs/getting-started.md](./docs/getting-started.md).

## Команды

Установка (заодно подключает git-хуки и генерирует `.nuxt` во всех пакетах):

```bash
pnpm install
```

Запуск:

```bash
pnpm dev:portal   # всё вместе: / — выбор приложения, /f1 and others
pnpm dev:f1      # одно приложение
```

Все dev-серверы по умолчанию на порту 3000. Чтобы поднять два одновременно, второму передай порт: `pnpm dev:f1 --port 3001`.

Проверки по всем пакетам через turbo (с кэшем):

```bash
pnpm typecheck
pnpm lint
pnpm lint:fix
```

Любой скрипт одного пакета: `pnpm --filter @multi/<пакет> <скрипт>`, например `pnpm --filter @multi/ui dev` — витрина кита.

Новое приложение — [docs/create-app.md](./docs/create-app.md):

```bash
pnpm turbo gen app
```

Граф пакетов в браузере:

```bash
pnpm graph
```

## Git-хуки

Ставятся сами при `pnpm install` (скрипт `prepare: husky`). Сами хуки лежат в `.husky/pre-commit` и `.husky/pre-push`; папка `.husky/_` — служебная, её не трогаем.

| Хук | Что делает |
|-----|------------|
| pre-commit | `eslint --fix` только по файлам коммита (lint-staged), исправления попадают в коммит |
| pre-push | `pnpm typecheck && pnpm lint` по всему репо |

## Документация

| Документ | Зачем |
|----------|-------|
| [docs/getting-started.md](./docs/getting-started.md) | Как устроен репо: роли пакетов, куда класть код, кто побеждает при конфликте, частые ошибки |
| [docs/create-app.md](./docs/create-app.md) | Создание нового приложения генератором |

## API
```
apps/
  f1/            Проксирует `/api/f1/*` через Nitro в `https://api.openf1.org/v1`
```
