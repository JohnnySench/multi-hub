# Создание нового приложения

Каждое приложение в `apps/` — отдельный сайт на слое `ui`: свои страницы, свой каркас, свой деплой. Общее между приложениями живёт в `packages/ui` и `packages/utils`.

Новое приложение создаётся генератором на `turbo gen`. Он описан в `turbo/generators/config.ts`, шаблоны файлов — в `turbo/generators/templates/app` (Handlebars, `.hbs`).

## Команда

```bash
pnpm turbo gen app
```

Генератор спросит:

| Вопрос | Пример | Где используется |
|--------|--------|------------------|
| Код приложения (kebab-case) | `shop` | имя пакета `@multi/shop`, папка `apps/shop`, скрипт `dev:shop` |
| Название | `Магазин` | заголовок вкладки |

Без вопросов:

```bash
pnpm turbo gen app --args shop "Магазин"
```

## Что делает генератор

1. Создаёт `apps/<app>`:
   - `package.json` — `@multi/<app>`, зависимости `@multi/ui` и `@nuxt/eslint`, скрипты `dev`, `typecheck`, `lint`;
   - `nuxt.config.ts` — `extends: ['@multi/ui']`, `@nuxt/eslint`, заголовок, свой CSS;
   - `app/assets/css/main.css` — точка входа Tailwind: `@import "@multi/ui/css"`, ниже свои `@theme` и `@utility`;
   - `tsconfig.json`, `eslint.config.mjs`;
   - `app/app.vue` — `UApp` с layout и страницами, `app/pages/index.vue` — первая страница.
2. Добавляет в корневой `package.json` скрипт `dev:<app>`.

## После генерации

```bash
pnpm install        # новый пакет: ссылки workspace и nuxt prepare
pnpm typecheck
pnpm lint
pnpm dev:<app>
```

## Дальше

- Каркас приложения — `app/layouts/default.vue`, компоненты — `app/components/`.
- Серверные ручки — под своим префиксом `server/api/<app>/...`, как у F1 (`/api/f1`).
- Общий код не копировать между приложениями, а выносить в `packages/ui` или `packages/utils`. Правила — в [getting-started.md](./getting-started.md).

## Как поменять шаблон

Шаблоны — обычные файлы с подстановками `{{ name }}` и `{{ title }}`, расширение `.hbs` при создании отбрасывается, `{{name}}` работает и в именах файлов. Если в `.vue`-шаблоне нужен настоящий Vue-шаблон `{{ x }}`, экранируй: `\{{ x }}`.

После правки шаблона проверь генератор на временном приложении и удали его:

```bash
pnpm turbo gen app --args tmp "Tmp"
pnpm install && pnpm typecheck && pnpm lint
```
