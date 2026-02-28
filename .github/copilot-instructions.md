# Copilot Instructions for IT Homework Platform

## Project Overview
**IT Homework Platform** — уеб приложение за домашни работи по програмиране.
- **Учител (admin)** създава задачи за домашно.
- **Ученик (user)** решава задачи, гледа решенията на другите, коментира и участва в дискусии.
- Технологии: HTML, CSS, JavaScript, Vite, Bootstrap, Supabase (DB, Auth, Storage).

## Language & Communication Convention
**CRITICAL**: Follow the bilingual convention defined in [assistant_preferences.md](./assistant_preferences.md):
- **Explanations and narrative**: Write in Bulgarian (български)
- **Technical terms, method names, CLI commands, filenames, code symbols**: Keep in English

## Architecture Guidelines
- Use modular design: split the app into self-contained components (pages, services, utils).
- Use separate files for UI, business logic, styles, and other app assets.
- Avoid big and complex monolith code.
- Use clear and consistent naming conventions for files, functions, variables.
- Write clean and readable code with comments where necessary.
- Follow best practices for security, performance and accessibility in web development.
- Use ES modules (import/export) — the project is "type": "module".

## Project Structure

- `index.html`: Главна страница (landing page).
- `src/pages/`: HTML страници на приложението (login, register, assignments, и т.н.).
- `src/js/`: JavaScript модули за логиката на всяка страница.
- `src/css/`: Стилове (CSS файлове).
- `src/services/`: Supabase client и API service функции.
- `src/utils/`: Помощни (utility) функции, споделени в цялото приложение.
- `supabase/migrations/`: SQL миграции за базата данни (формат YYYYMMDDHHMMSS_description.sql).
- `vite.config.js`: Vite конфигурация за multi-page app.
- `.env.example`: Шаблон за environment variables (Supabase URL и ключ).
- `.github/`: Copilot instructions, project requirements, assistant preferences.
- `README.md`: Документация на проекта.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript (ES modules), Bootstrap 5, Vite
- **Backend**: Supabase (PostgreSQL DB, Auth, Storage)
- **Build**: Vite (dev server + production build)
- **Deployment**: Netlify / Vercel
