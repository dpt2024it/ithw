# IT Homework Platform

**Платформа за домашни работи по програмиране** — уеб приложение, в което учителят публикува задачи, а учениците ги решават, виждат решенията на другите, коментират ги и участват в дискусии за помощ.

## Функционалности

### Роли

- **Учител (admin)** — създава, редактира и изтрива задачи; вижда всички потребители
- **Ученик (user)** — решава задачи, качва файлове, коментира, участва в дискусии

### Основни възможности

- Регистрация и вход (Supabase Auth)
- Списък задачи за домашно с описание и краен срок
- Качване на решения (код + файл)
- Преглед на решенията на всички ученици
- Коментари с threading (отговор на отговор)
- Форум/дискусии за помощ към всяка задача
- Admin панел: управление на задачи и потребители
- Потребителски профил с аватар
- Responsive дизайн (Bootstrap 5)

## Технологии

| Компонент | Технология |
| --- | --- |
| Frontend | HTML, CSS, JavaScript (ES modules) |
| CSS Framework | Bootstrap 5 |
| Build Tool | Vite |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Deployment | Netlify / Vercel |

## Архитектура

Проектът следва **модулен дизайн** с разделение на:

- **Страници** (`src/pages/`) — отделен HTML файл за всяка страница
- **Логика** (`src/js/`) — отделен JS модул за всяка страница
- **Услуги** (`src/services/`) — Supabase client и API функции
- **Утилити** (`src/utils/`) — споделени помощни функции
- **Стилове** (`src/css/`) — CSS файлове
- **Миграции** (`supabase/migrations/`) — SQL schema файлове

### Database Schema (6 таблици)

- `profiles` — потребителски профили (име, роля, аватар)
- `assignments` — задачи за домашно
- `solutions` — решения на учениците
- `comments` — коментари към решения (с threading)
- `discussions` — дискусии за помощ
- `discussion_replies` — отговори в дискусиите

## Структура на проекта

`
ithw/
|-- index.html                  # Landing page
|-- vite.config.js              # Vite multi-page конфигурация
|-- package.json                # npm dependencies и scripts
|-- .env.example                # Шаблон за environment variables
|-- .gitignore
|-- README.md
|-- src/
|   |-- pages/                  # HTML страници
|   |   |-- login.html
|   |   |-- register.html
|   |   |-- assignments.html
|   |   |-- assignment.html
|   |   |-- solution.html
|   |   |-- discussions.html
|   |   |-- profile.html
|   |   |-- admin.html
|   |-- js/                     # JavaScript модули
|   |   |-- main.js             # Entry point (Bootstrap imports)
|   |   |-- navbar.js           # Споделена навигация
|   |   |-- login.js
|   |   |-- register.js
|   |   |-- assignments.js
|   |   |-- assignment.js
|   |   |-- solution.js
|   |   |-- discussions.js
|   |   |-- profile.js
|   |   |-- admin.js
|   |-- css/
|   |   |-- style.css           # Custom стилове
|   |-- services/               # Supabase API функции
|   |   |-- supabase.js         # Supabase client
|   |   |-- auth.js             # Authentication
|   |   |-- assignments.js      # CRUD задачи
|   |   |-- solutions.js        # CRUD решения + file upload
|   |   |-- comments.js         # Коментари (threading)
|   |   |-- discussions.js      # Дискусии + отговори
|   |-- utils/
|       |-- helpers.js           # Помощни функции
|-- supabase/
|   |-- migrations/
|       |-- 20260228120000_create_tables.sql
|       |-- 20260228121000_rls_policies.sql
|-- .github/
    |-- copilot-instructions.md
    |-- assistant_preferences.md
`

## Local Development Setup

### Предварителни изисквания

- [Node.js](https://nodejs.org/) (v18+)
- npm (идва с Node.js)
- Supabase акаунт — [supabase.com](https://supabase.com)

### Стъпки

1. **Клониране на проекта**
   `ash
   git clone https://github.com/dpt2024it/ithw.git
   cd ithw
   `

2. **Инсталиране на dependencies**
   `ash
   npm install
   `

3. **Supabase setup**
   - Създай нов проект в [Supabase Dashboard](https://supabase.com/dashboard)
   - Отвори SQL Editor и изпълни миграциите:
     - `supabase/migrations/20260228120000_create_tables.sql`
     - `supabase/migrations/20260228121000_rls_policies.sql`
   - Копирай API URL и Anon Key от Settings > API

4. **Environment variables**
   `ash
   cp .env.example .env
   `
   Попълни `.env` с твоите Supabase credentials:
   `
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   `

5. **Стартиране на dev server**
   `ash
   npm run dev
   `
   Отвори <http://localhost:5173> в браузъра.

6. **Build за продукция**
   `ash
   npm run build
   npm run preview
   `

## Тестови акаунти

| Роля | Email | Парола |
| --- | --- | --- |
| Учител (admin) | `admin@demo.com` | demo123 |
| Ученик (user) | `student@demo.com` | demo123 |

## npm Scripts

| Команда | Описание |
| --- | --- |
| `npm run dev` | Стартира Vite dev server |
| `npm run build` | Build за продукция в `dist/` |
| `npm run preview` | Преглед на production build |

## Deployment

Проектът може да бъде deploy-нат на [Netlify](https://netlify.com) или [Vercel](https://vercel.com):

1. Свържи GitHub repo-то
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Добави environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

## Лиценз

ISC
