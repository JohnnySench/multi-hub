# Создание нового приложения

Новое приложение создаётся генератором на `turbo gen`. Он описан в `turbo/generators/config.ts`, шаблоны файлов — в `turbo/generators/templates/app` (Handlebars, `.hbs`).

## Команда

```bash
pnpm turbo gen app
```

Генератор спросит:

| Вопрос | Пример | Где используется |
|--------|--------|------------------|
| Код приложения (kebab-case) | `shop` | имя пакета `@multi/shop`, папка `apps/shop`, префикс роутов `/shop` |
| Название в меню выбора | `Магазин` | кнопка на странице выбора приложения, заголовок вкладки |

Без вопросов:

```bash
pnpm turbo gen app --args shop "Магазин"
```

## Что делает генератор

1. Создаёт `apps/<app>`:
   - `package.json` — `@multi/<app>`, `main: ./nuxt.config.ts`, зависимость от `@multi/shell`, скрипты `dev`, `typecheck`, `lint`;
   - `nuxt.config.ts` — `extends: ['@multi/shell']`;
   - `tsconfig.json`, `eslint.config.mjs`;
   - `app/app.config.ts` — регистрация в меню выбора приложения;
   - `app/pages/<app>.vue` — родительская страница (layout приложения), `app/pages/<app>/index.vue` — первая страница.
2. Дописывает приложение в конец `extends` у `apps/portal/nuxt.config.ts` и в зависимости `apps/portal/package.json`.
3. Добавляет в корневой `package.json` скрипт `dev:<app>`.

## После генерации

```bash
pnpm install        # новый пакет: ссылки workspace и nuxt prepare
pnpm typecheck
pnpm lint
pnpm dev:<app>      # приложение отдельно
pnpm dev:portal     # на / появится кнопка нового приложения
```

## Дальше

- Страницы — только под `app/pages/<app>/...`.
- Меню и рамку приложения — в `app/pages/<app>.vue` вокруг `<NuxtPage />` (пример — `apps/admin`). `<NuxtLayout>` внутри страниц не используем: он нарисует layout shell второй раз.
- Компоненты приложения — в `app/components/<app>/...`.
- Общий код — не копировать между приложениями, а выносить в `packages/ui` или `packages/shell`. Правила — в [getting-started.md](./getting-started.md).

## Как поменять шаблон

Шаблоны — обычные файлы с подстановками `{{ name }}` и `{{ title }}`, расширение `.hbs` при создании отбрасывается, `{{name}}` работает и в именах файлов. Если в `.vue`-шаблоне нужен настоящий Vue-шаблон `{{ x }}`, экранируй: `\{{ x }}`.

После правки шаблона проверь генератор на временном приложении и удали его:

```bash
pnpm turbo gen app --args tmp "Tmp"
pnpm install && pnpm typecheck && pnpm lint
```
