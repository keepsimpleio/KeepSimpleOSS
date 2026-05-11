---
name: keepsimpleoss
description: 'Use this skill when working in the KeepSimpleOSS repository. Trigger on ANY code change, file creation, component work, styling, routing, data, or i18n task in this repo. Read this before writing code. Covers: component structure, SCSS modules, Pages Router, static data, path aliases, import order, props typing, barrel files, asset paths, and design system rules.'
---

# KeepSimpleOSS — Quick Reference

Full rules are in `AGENTS.md` at the repo root. Read it for details. This is the short version.

> **Ignore all vibesuite files.** Work in progress, not a pattern source.

---

## Before Writing Code

1. Read `AGENTS.md` for the full rules.
2. If writing styles and the user didn't give explicit values, read `keepsimple-style.md` at the repo root. It defines the design system (colors, typography, textures, card patterns). Do not invent values or copy hardcoded hex from neighboring files.
3. If a pattern in this skill or `AGENTS.md` conflicts with what you see in the codebase, **`AGENTS.md` wins** for new code.

---

## Component Checklist

When creating or modifying a component:

- [ ] Directory: `src/components/ComponentName/` (PascalCase)
- [ ] Files: `ComponentName.tsx`, `ComponentName.module.scss`, `index.ts`
- [ ] `index.ts` contains: `import X from './X'; export default X;`
- [ ] Props: `interface ComponentNameProps { ... }` declared inline above the component. No `T`-prefix. No `.types.ts` unless the type is shared.
- [ ] Component: `const ComponentName = ({ ... }: ComponentNameProps) => { ... }; export default ComponentName;`
- [ ] Styles: `import styles from './ComponentName.module.scss';` — use `cn()` for conditionals
- [ ] SVGs: import as React components via `@icons/*`, never `<img src={svg}>`
- [ ] If the component reads `localStorage` / `sessionStorage` / `window`, wrap consumer with `dynamic(..., { ssr: false })` or move access into `useEffect`

---

## Styling Rules

- **SCSS Modules only.** No Tailwind, no CSS-in-JS, no inline styles (except single dynamic properties).
- **Design system first.** Read `keepsimple-style.md` before writing new styles. The hardcoded values in existing SCSS files are legacy.
- **Class naming:** PascalCase for new code (`.Card`, `.Wrapper`, `.Title`).
- **Conditional classes:** `cn(styles.Card, { [styles.active]: isActive })`.
- **Global CSS** can only be imported in `_app.tsx`.

---

## Import Order (ESLint-enforced)

```
Side-effects → Node built-ins → Third-party →
@styles → @constants → @local-types → @hooks → @lib → @api → @data → @icons → @components → @layouts →
Other @/ → Relative → Style imports (.scss)
```

Use path aliases for cross-folder imports. Relative imports only within the same component folder.

---

## Pages & Routing

- **Pages Router only.** Routes in `src/pages/`. No App Router.
- Prefer `getStaticProps` with `revalidate: 10` (ISR).
- Every page renders `<SeoGenerator>` + a layout from `src/layouts/`.
- Data comes from Strapi, fetched in `getStaticProps`/`getServerSideProps`.

---

## Static Data & i18n

- Data in `src/data/{feature}/` as TypeScript objects (never JSON).
- Files: `en.ts`, `ru.ts`, optionally `hy.ts`, plus `index.ts` barrel.
- Armenian (`hy`) falls back to English. Not required in new data dirs.
- Consumed via `import data from '@data/feature'; data[locale]`.

---

## State Management

- React Context only. No Redux, Zustand, SWR, React Query.
- New contexts go in `src/components/Context/`, not `src/context/` (legacy).

---

## New Utilities

- Put new utilities in `src/lib/`, not `src/utils/` (legacy).
- One hook per file in `src/hooks/`, named `use*.ts`.

---

## Key Gotchas

1. `forceConsistentCasingInFileNames: false` — wrong casing works locally, breaks in CI.
2. `.env.example` has no docs — ask before assuming env values.
3. `public/keepsimple_/llms-full-pages/` is generated — don't hand-edit.
4. Some `index.ts` barrels are empty (0 bytes) — that's a bug, not a pattern.
5. `_variables.scss` contains reusable class snippets, not SCSS variables despite the name.
6. Production uses `assetPrefix: '/keepsimple_next'` — this only affects `_next/` assets, not `public/` paths.
7. `yarn` only. Never `npm install`.

---

## Never Do

- App Router, `'use client'`, `next/navigation`
- Tailwind, styled-components, CSS-in-JS
- Named exports in `index.ts` barrels
- State management libraries
- Testing frameworks beyond Playwright
- Import global CSS outside `_app.tsx`
- Invent design values — read `keepsimple-style.md`

---

## When Uncertain

Match the closest existing component. If `AGENTS.md` doesn't cover it, stop and ask.
