# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A lifting diary web app built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. Currently in early development — only the default `create-next-app` scaffold exists.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Coding Standards

Before generating any code, always refer to the relevant documentation in the `/docs` directory. These files define the standards and conventions that must be followed throughout the project.

- `/docs/ui.md` — UI component and date formatting standards
- `/docs/data-fetching.md` — Data fetching, database query, and authorization standards

## Architecture

- Uses the Next.js **App Router** (`src/app/`). All routes are directories with `page.tsx` files.
- `src/app/layout.tsx` — root layout with Geist fonts and global CSS.
- `src/app/globals.css` — Tailwind base styles (imported once in layout).
- Tailwind is configured via PostCSS (`postcss.config.mjs`); no `tailwind.config.*` file needed for v4.
- No test framework is configured yet.
