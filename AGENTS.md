# AGENTS.md — правила для AI-агентов (Cursor, Copilot и др.)

Проект: учебный стартер витрины садовых растений (контекст — Garshinka: Nuxt 3 / Vue 3 / Pinia / SCSS).
Здесь Vite + Vue 3 SPA, но код пишем так, чтобы его легко было перенести в Nuxt 3.

## Стек

- Vue 3.5 + TypeScript (strict, `noUncheckedIndexedAccess`) + Vite
- Vue Router, Pinia (setup stores), VueUse
- Tailwind CSS v4 (`@tailwindcss/vite`, тема в `src/style.css` через `@theme`)
- Vitest + @vue/test-utils + jsdom
- ESLint (flat config: eslint-plugin-vue + typescript-eslint) + Prettier
- Пакетный менеджер — **pnpm**

## Правила кода

1. Только Composition API и `<script setup lang="ts">`. Никакого Options API.
2. Типы пропсов/эмитов — через `defineProps<...>()` / `defineEmits<...>()`. Никаких `any`.
3. Компоненты маленькие (ориентир — до ~150 строк), одна ответственность. Логику выносим в composables (`src/composables`) или store (`src/stores`).
4. Сетевые запросы — только через `src/api/http.ts` (типизированный `http<T>()`), обёрнутые в модули `src/api/*.ts`. Ошибки приводим к тексту через `getErrorMessage`.
5. **Состояния loading / error / empty обязательны** для любого асинхронного UI (`BaseSpinner`, `ErrorState` с retry, `EmptyState`).
6. Доступность: семантичные теги (`button`, `nav`, `main`, `ul/li`, `dl`), `alt` у картинок, видимый `focus-visible`, `aria-live`/`role="status"|"alert"` для динамических статусов, кнопки с `type="button"`.
7. Стили — классы Tailwind. Цвета бренда — токены `leaf-*`. Не плодить кастомный CSS без нужды.
8. Импорты через алиас `@/`. Типы — `import type`.
9. **Не добавлять новые зависимости без явного согласия пользователя.** Сначала предложи и объясни зачем.
10. Логика (stores, composables, utils, api) покрывается тестами рядом с файлом: `*.test.ts`.

## Структура

```
src/
  api/          http-обёртка и API-модули
  components/   переиспользуемые UI-компоненты
  composables/  useXxx()
  router/       маршруты
  stores/       Pinia setup stores
  types/        доменные типы
  utils/        чистые функции
  views/        страницы (роуты)
public/mock/    мок-данные (JSON)
```

## Definition of Done

Перед тем как сказать «готово», запусти и убедись, что всё зелёное:

```bash
pnpm lint && pnpm typecheck && pnpm test --run && pnpm build
```

(или коротко `pnpm check && pnpm build`). Если что-то упало — чини, а не отключай правило.

## Как работать

- Сначала коротко план (какие файлы трогаешь), потом изменения небольшими шагами.
- Не переписывай несвязанный код, не меняй конфиги без причины.
- Пиши понятные имена; комментарии — по делу, на русском или английском.
