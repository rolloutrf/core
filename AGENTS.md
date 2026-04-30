# Agent Instructions

## Project Overview

Сайт опенсорс-проекта Rollout — платформы для e-com и финтеха. Весь контент подтягивается из публичного репозитория данных через GitHub Raw API.

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript 5.9
- **Build tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **UI components:** shadcn/ui (Base UI), Lucide React icons
- **Utilities:** clsx, tailwind-merge, class-variance-authority
- **Font:** Geist Variable
- **Linting:** ESLint 9 + typescript-eslint

## Development Setup

```bash
npm install
npm run dev
```

## Commands

- `npm run dev` — запуск дев-сервера с live reload (http://localhost:5173)
- `npm run build` — продакшн сборка в `dist/`
- `npm run lint` — проверка ESLint

### Live Reload

Vite обеспечивает автоматическую перезагрузку браузера при изменениях в коде. Сервер разработки поддерживает Hot Module Replacement (HMR) для мгновенного обновления компонентов без потери состояния.

## Architecture

Маршрутизация: `react-router-dom` (BrowserRouter).

Структура проекта:

```
src/
  components/
    Nav.tsx               # Навигация
    sections/             # Секции главной страницы
    ui/                   # shadcn/ui компоненты
  hooks/
    useFetch.ts           # Общий хук для fetch-запросов
  pages/
    MarkdownPage.tsx      # Универсальная страница рендеринга Markdown
    TasksPage.tsx         # /tasks
    SpecsPage.tsx         # /specs
    CommunityPage.tsx     # /community
    ChecklistPage.tsx     # /checklist
    VideoPage.tsx         # /video
  lib/utils.ts
  App.tsx                 # Роутинг + layout
```

### Паттерн: страница списка + детальная страница

Если источник — директория с несколькими документами:
1. Страница списка отображает карточки/строчки с `Link` из `react-router-dom`
2. Через `state` передаётся: `rawUrl` (raw GitHub URL), `title`, `backPath`, `backLabel`
3. Маршрут детальной страницы указывает на `MarkdownPage` (например: `/specs/detail`)
4. `MarkdownPage` читает `rawUrl` из `location.state`, фетчит маркдаун через `useFetch`, рендерит через `react-markdown`

Пример (SpecsPage):
```tsx
<Link
  to="/specs/detail"
  state={{
    rawUrl: 'https://raw.githubusercontent.com/rolloutrf/data/main/Specs/1.%20%D0%90%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F.md',
    title: 'Авторизация',
    backPath: '/specs',
    backLabel: 'Спецификации',
  }}
>
  ...
</Link>
```

### Динамическая загрузка из GitHub API

Для директорий с большим числом файлов используется динамическая загрузка:
```ts
const API = 'https://api.github.com/repos/rolloutrf/data/contents/Tasks'
const { data } = useFetch<GithubFile[]>(API)
// Фильтрация: f.type === 'file' && f.name !== '.DS_Store'
```

## Notes for Agent

- Весь контент (данные) должен подтягиваться из репозитория: https://github.com/rolloutrf/data
- Сайт должен быть собран строго в тёмной теме
- Если источник данных — директория, и в ней есть вложенные документы, для каждого из них должна создаваться отдельная страница
- Референс: https://роллаут.рф (https://xn--80avakjqg.xn--p1ai/)

## Дизайн-система

### Цвета
- **Фон:** `#201d1f` (тёмно-коричневый)
- **Карточки:** `#1a1718` (темнее фона)
- **Акцент:** `#E8552D` (оранжевый) — используется для выделения текста, цифр, кнопок навигации, SVG-иллюстраций
- **Текст:** `oklch(0.985 0 0)` (почти белый)
- **Приглушённый текст:** `oklch(0.708 0 0)` (серый)

### Типографика
- Шрифт: Geist Variable
- Заголовки: `font-normal tracking-tight` (без жирности)
- Hero: `text-5xl md:text-7xl`
- Заголовки секций: `text-3xl md:text-4xl`
- Основной текст: `text-xl md:text-2xl`
- Подписи/роли: `text-base`

### Стили markdown-контента (единый стандарт для всех страниц)

Все страницы, рендерящие Markdown через `ReactMarkdown`, должны использовать одинаковые стили компонентов:

```tsx
h1: <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-8 mt-0">
h2: <h2 className="text-xl font-normal mt-10 mb-4">
h3: <h3 className="text-base font-normal mt-6 mb-2">
p:  <p className="text-muted-foreground leading-relaxed mb-4">
ul: <ul className="list-disc list-inside space-y-1 mb-4 text-muted-foreground">
ol: <ol className="list-decimal list-inside space-y-1 mb-4 text-muted-foreground">
li: <li className="leading-relaxed">
strong: <strong className="font-normal text-foreground">
a:  underline-offset-2, внешние ссылки — target="_blank"
hr: <hr className="border-border my-8">
code: <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
blockquote: border-l-2 border-border pl-4 text-muted-foreground italic
img: <img className="w-full my-6 rounded">
```

Не использовать `text-base md:text-lg` или другие адаптивные размеры на параграфах и списках — базовый размер шрифта достаточен.

### Лейаут
- Контейнер: `max-w-7xl mx-auto px-6`
- Секции: `<section className="py-24 px-6">`
- Карточки без скруглений (нет `rounded`)

### Логотип
- URL: `https://static.tildacdn.com/tild3466-6438-4330-b739-303166383362/favi.png`
- Используется в Nav и Footer

### SVG-иллюстрации
- Генерируются программно (Star1–Star4) в цвете `#E8552D`
- Используются в секциях HowtoSection и OfferSection

### Паттерны выделения текста
- Вместо жирности используется оранжевый цвет: `<span className="text-[#E8552D]">...текст...</span>`
- При комбинации акцентного и обычного текста добавлять `{' '}` между span-ами

## Структура главной страницы

Источник: https://github.com/rolloutrf/data/blob/main/Site/site.md

Секции (в порядке отображения):

1. **HeroSection** — заголовок с оранжевым акцентом, описание, кнопка «Присоединиться» (Yandex Forms)
2. **TeamSection** — горизонтальный слайдер с фотографиями команды (Tilda CDN), оранжевые кнопки навигации, карточки 420px с пропорцией 3:4
3. **HowtoSection** — две колонки, оранжевая линия сверху, SVG-звёзды в карточках, ссылка на Figma
4. **OfferSection** — 4 колонки: SVG-звезда + оранжевый номер + текст (оранжевый заголовок + серое описание)
5. **VacanciesSection** — список вакансий, внутренние страницы через MarkdownPage (не GitHub)
6. **FaqSection** — аккордеон
7. **Footer** — логотип + текст "Rollout"

## Роутинг

- `/` — главная
- `/tasks` — задачи
- `/tasks/detail` — детальная задача (MarkdownPage)
- `/specs` — спецификации (список)
- `/specs/detail` — детальная спецификация (MarkdownPage)
- `/community` — комьюнити
- `/checklist` — чеклист
- `/video` — видео
- `/vacancies/detail` — детальная вакансия (MarkdownPage)

## Страница задач (TODO)

Источник данных: https://github.com/rolloutrf/data/tree/main/Tasks
Динамическая загрузка через GitHub API.

## Страница спецификаций

Источник данных: https://github.com/rolloutrf/data/tree/main/Specs
Отображается списком (divide-y), каждый элемент ведёт на `/specs/detail`.

## Страница комьюнити

Источник данных: https://github.com/rolloutrf/data/blob/main/Community/people.md
Данные загружаются динамически через GitHub API аналогично TasksPage и SpecsPage.

## Страница чеклиста

Источник данных: https://github.com/rolloutrf/data/blob/main/Checklist/figma.md

## Страница видео

Источник данных: https://github.com/rolloutrf/data/tree/main/Video

## Страница онбординга

Источник данных: https://github.com/rolloutrf/data/tree/main/Onboarding
Роут ещё не создан.
