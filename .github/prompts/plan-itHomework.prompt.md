# План за проекта: IT Homework Platform

## Идея (от project_idea.txt)

Платформа за домашни работи по програмиране:

- **Учител (admin)** — създава задачи за домашно
- **Ученик (user)** — решава задачи, гледа решения на другите, коментира, участва в дискусии

### Основни функционалности

1. Учителят публикува задачи
2. Учениците качват решения
3. Всеки вижда решенията на другите
4. Коментари към решенията (с threading — отговор на отговор)
5. Форум/канал за всяка задача (дискусии за помощ)

### DB таблици (мин. 4, реално 6-7)

`profiles`, `assignments`, `solutions`, `comments`, `discussions`, `discussion_replies`

### Страници (мин. 5)

Register, Login, Assignments list, Assignment detail + решения, Solution + коментари, Discussion forum, Admin panel, Profile

---

## Стъпка 1: Инициализация на проекта ✅

Създаваме основната техническа основа:

1. Инициализираме **npm** проект (`package.json`)
2. Инсталираме **Vite** (build tool) + **Bootstrap** (CSS framework)
3. Създаваме **`.gitignore`** (за `node_modules/`, `.env`, `dist/`)
4. Създаваме **`.env.example`** (шаблон за Supabase credentials)
5. Създаваме **базова папкова структура**:
   ```
   src/
     pages/       ← HTML страниците
     js/          ← JavaScript модули
     css/         ← стилове
     services/    ← Supabase client и API calls
     utils/       ← помощни функции
   supabase/
     migrations/  ← SQL миграции
   ```
6. Конфигурираме **Vite** за multi-page app (`vite.config.js`)
7. Актуализираме **`.github/copilot-instructions.md`** да отразява реалната архитектура

---

## Стъпка 2: Supabase setup + Database schema ✅

1. Конфигурираме **Supabase client** в `src/services/supabase.js`
2. Създаваме SQL миграция **`20260228120000_create_tables.sql`** с 6 таблици:
   - `profiles` — потребителски профили (име, роля: user/admin, аватар)
   - `assignments` — задачи за домашно (заглавие, описание, created_by, due_date)
   - `solutions` — решения на учениците (код, файл, бележки)
   - `comments` — коментари към решенията (с threading чрез parent_id)
   - `discussions` — дискусии в канала на задача
   - `discussion_replies` — отговори в дискусиите
3. Triggers: auto-create profile при signup, auto-update `updated_at`
4. Indexes за performance
5. Създаваме SQL миграция **`20260228121000_rls_policies.sql`**:
   - RLS policies за всички таблици (кой какво може)
   - Storage bucket `solution-files` за прикачени файлове
6. API service модули:
   - `src/services/auth.js` — signUp, signIn, signOut, getCurrentProfile
   - `src/services/assignments.js` — CRUD за задачи
   - `src/services/solutions.js` — CRUD + file upload
   - `src/services/comments.js` — коментари с threading + buildCommentTree
   - `src/services/discussions.js` — дискусии + отговори

---

## Стъпка 3: HTML страници + навигация + Bootstrap layout ✅

9 HTML страници + 10 JS модула:

| Страница | HTML | JS |
|---|---|---|
| Landing page | `index.html` | `src/js/index.js` |
| Вход | `src/pages/login.html` | `src/js/login.js` |
| Регистрация | `src/pages/register.html` | `src/js/register.js` |
| Списък задачи | `src/pages/assignments.html` | `src/js/assignments.js` |
| Детайли задача | `src/pages/assignment.html` | `src/js/assignment.js` |
| Решение + коментари | `src/pages/solution.html` | `src/js/solution.js` |
| Дискусия + отговори | `src/pages/discussions.html` | `src/js/discussions.js` |
| Профил | `src/pages/profile.html` | `src/js/profile.js` |
| Admin панел | `src/pages/admin.html` | `src/js/admin.js` |

Споделени: `navbar.js`, `main.js`, `helpers.js`, `style.css`

---

## Стъпка 4: Build + Docs + Deployment config ✅

1. **Vite build** — минава чисто (0 грешки, 0 warnings)
2. **README.md** — пълна документация (архитектура, setup guide, структура, deployment инструкции, тестови акаунти)
3. **netlify.toml** — Netlify deployment конфигурация
4. **Supabase** — проект създаден, миграции пуснати, search_path warnings поправени

---

## Стъпка 5: Git commits + accessibility + финално тестване (предстои)

1. Създаваме серия от смислени **Git commits** (мин. 15 по изискване)
2. Проверяваме **accessibility** (labels, alt текстове)
3. Финално **тестване** на всички потоци
4. **Deployment** на Netlify/Vercel
