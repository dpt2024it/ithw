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

## Стъпка 1: Инициализация на проекта

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

## Стъпка 2: (предстои одобрение)

## Стъпка 3: (предстои одобрение)

## Стъпка 4: (предстои одобрение)

## Стъпка 5: (предстои одобрение)
