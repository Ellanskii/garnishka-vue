# garnishka-vue 🌿

Стартер для live coding на Vue 3 — мини-витрина садовых растений (контекст: Garshinka, стек Nuxt 3 / Vue 3 / Pinia / SCSS).
Подготовлен для работы с AI в Cursor: есть `AGENTS.md` и правила в `.cursor/rules/`.

## Быстрый старт

```bash
# Node.js >= 20.19
corepack enable          # если pnpm ещё не установлен
pnpm install
pnpm dev                 # http://localhost:5173
```

## Скрипты

| Команда             | Что делает                                         |
| ------------------- | -------------------------------------------------- |
| `pnpm dev`          | dev-сервер Vite                                    |
| `pnpm build`        | проверка типов + production-сборка в `dist/`       |
| `pnpm preview`      | локальный просмотр сборки                          |
| `pnpm typecheck`    | `vue-tsc -b` (TS strict)                           |
| `pnpm lint`         | ESLint (flat config, vue + typescript-eslint)      |
| `pnpm lint:fix`     | ESLint с автоисправлением                          |
| `pnpm format`       | Prettier — форматирование всего проекта            |
| `pnpm format:check` | Prettier — только проверка                         |
| `pnpm test`         | Vitest в watch-режиме (`pnpm test --run` — разово) |
| `pnpm check`        | lint + typecheck + тесты одним махом               |

## Стек

Vue 3.5 · TypeScript (strict) · Vite · Vue Router · Pinia · VueUse · Tailwind CSS v4 (`@tailwindcss/vite`) · Vitest + @vue/test-utils + jsdom · ESLint + Prettier · pnpm

## Структура

```
├─ AGENTS.md                 # правила для AI-агента
├─ .cursor/rules/*.mdc       # правила Cursor (общие, Vue, TS/состояние, тесты)
├─ public/mock/products.json # мок-API: каталог растений
└─ src/
   ├─ api/
   │  ├─ http.ts             # типизированный fetch-wrapper: query, JSON, таймаут, HttpError
   │  └─ products.ts         # productsApi.list / getById
   ├─ components/            # ProductCard, BaseSpinner, ErrorState, EmptyState
   ├─ composables/
   │  └─ useAsyncData.ts     # data/loading/error + отмена запроса (аналог Nuxt useAsyncData)
   ├─ router/index.ts        # / (каталог), /product/:id, 404
   ├─ stores/
   │  ├─ products.ts         # загрузка каталога, loading/error/empty, геттеры
   │  └─ cart.ts             # корзина с лимитом по остатку, хранится в localStorage
   ├─ types/product.ts       # доменный тип Product
   ├─ utils/format.ts        # formatPrice (₽)
   ├─ views/                 # HomeView, ProductView, NotFoundView
   └─ style.css              # Tailwind + токены цвета leaf-*
```

Тесты лежат рядом с кодом (`*.test.ts`): http-обёртка, оба стора, утилита форматирования и `ProductCard`.

## Заметки для live coding

- **Definition of Done:** `pnpm lint && pnpm typecheck && pnpm test --run && pnpm build` — всё зелёное.
- Каждый async-экран — с тремя состояниями: loading / error (с «Повторить») / empty. Готовые компоненты уже есть.
- Новые запросы — через `http<T>()` и модуль в `src/api/`. Нужен реальный бэкенд — задайте `VITE_API_URL` (см. `.env.example`).
- Проверить ошибку/пустой список быстро: поменять путь в `src/api/products.ts` на несуществующий или положить `[]` в `products.json`.
- Новые зависимости — только после обсуждения (это правило зашито и для агента).
- Идеи задач на интервью: фильтр по категории и поиск с `useDebounceFn` + синхронизация с query-параметрами роутера; сортировка по цене; страница корзины с изменением количества; пагинация / «показать ещё»; избранное в `localStorage`; форма «Сообщить о поступлении» с валидацией и a11y.
- Перенос в Nuxt 3: `views/` → `pages/`, `useAsyncData` → встроенный, `http.ts` → `$fetch`/`useFetch`, stores остаются как есть (`@pinia/nuxt`), Tailwind → SCSS при необходимости.

### Промпт-шаблон для Cursor

> Добавь фильтр по категории на главной. План сначала, потом изменения. Соблюдай AGENTS.md: `<script setup lang="ts">`, состояния loading/error/empty, тест для логики, без новых зависимостей. В конце прогони `pnpm check && pnpm build`.
