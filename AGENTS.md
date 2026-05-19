# AGENTS.md — KeepSimpleOSS

How to work in this codebase. Read this before writing code.

> **Ignore everything under `vibesuite`** — the route, components, data, API, and styles are work in progress and should not be referenced as patterns.

---

## Stack

| Layer           | Choice                                          | Version                     |
| --------------- | ----------------------------------------------- | --------------------------- |
| Framework       | Next.js **Pages Router**                        | 15.0.5                      |
| Language        | TypeScript (strict off)                         | 5.2.2                       |
| React           | React + ReactDOM                                | 19.0.3                      |
| Package manager | **yarn only**                                   | v1 (yarn.lock is canonical) |
| Styling         | SCSS Modules                                    | sass 1.32.8                 |
| Auth            | NextAuth v4                                     | 4.23.2                      |
| CMS             | Strapi (external)                               | —                           |
| State           | React Context only                              | —                           |
| Testing         | Playwright E2E only                             | 1.59.1                      |
| Linting         | ESLint flat config + simple-import-sort         | 9.x                         |
| Formatting      | Prettier                                        | 3.x                         |
| Git hooks       | Husky + lint-staged                             | 9.x                         |
| SVG             | @svgr/webpack (SVGs import as React components) | 8.x                         |

**Do not add:** Redux, Zustand, Jotai, SWR, React Query, Jest, Vitest, component tests, Tailwind, styled-components, or App Router patterns.

---

## Content Surfaces

KeepSimple hosts several distinct content libraries. **Don't conflate them** — the most common mistake is assuming "Articles" is the whole corpus. It isn't.

| Surface                           | URL prefix             | Source                             | Notes                                                                                                                                                                                                         |
| --------------------------------- | ---------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **UX Core** (cognitive biases)    | `/uxcore/<n>-<slug>`   | Strapi CMS + `/uxcore-api`         | World's largest open library of cognitive biases. Each entry has practical examples for product/HR. Public JSON API at `/uxcore-api` — use it instead of scraping. **This is the actual core, not Articles.** |
| **UXCG** (UX Core Guide cases)    | `/uxcg/<problem-slug>` | Strapi CMS                         | Business problem → set of relevant biases from UX Core. PDF dumps at `public/keepsimple_/static/uxcg/{en,ru}/*.pdf` (~63×2 cases + games).                                                                    |
| **UXCP** (Cognitive Persona)      | `/uxcp`                | Strapi CMS                         | Tool that builds a Persona using biases.                                                                                                                                                                      |
| **UXCAT** (self-awareness test)   | `/uxcat`               | Strapi CMS                         | Test, with `start-test`, `ongoing`, `test-result` variants.                                                                                                                                                   |
| **Articles**                      | `/articles/<slug>`     | Strapi CMS                         | Long-form writing (~25 articles). Markdown mirrors at `public/keepsimple_/llms-full-pages/article/*.md`.                                                                                                      |
| **Pyramids / Company Management** | `/company-management`  | Strapi CMS                         | Management framework for remote-first teams.                                                                                                                                                                  |
| **Tools** (Longevity Protocol …)  | `/tools/<name>`        | Mixed (Strapi + static)            | Small utilities.                                                                                                                                                                                              |
| **AI Atlas**                      | `/ai-atlas`            | `public/ai-atlas/data.json` (+ ru) | The only major surface NOT on Strapi. See "AI Atlas notes" in `CLAUDE.local.md`.                                                                                                                              |

### Single-shot ingestion files (LLM-friendly dumps)

For any task that needs the full corpus (RAG indexing, search, audits, training):

- **`public/keepsimple_/llms.txt`** — index of every page with a one-line description (the `llms.txt` AI-discovery standard).
- **`public/keepsimple_/llms-full.txt`** — full Markdown dump of all pages in one file.
- **`public/keepsimple_/llms-full-pages/<section>/*.md`** — the same dump, split per page.

All three are generated by `scripts/generate-llms-pages.ts` (see "Generated Files" below). Use them instead of crawling `keepsimple.io` or hitting Strapi for each page.

### Public data API

- **`/uxcore-api`** — public JSON API over UX Core. Documented at `keepsimple.io/uxcore-api`. Preferred entry point for any integration that needs structured cognitive-bias data.

---

## Folder Structure

```
src/
  api/              # Fetch functions (one file per domain, lowercase)
  assets/icons/     # SVG icons and icon components, grouped by feature
  components/       # React components (see Component Pattern below)
  constants/        # App-wide constants (named exports, lowercase files)
  context/          # LEGACY — do not add new contexts here
  data/             # Localized static data (see Static Data below)
  hooks/            # Custom hooks (one per file, use* prefix)
  layouts/          # Page layout wrappers
  lib/              # Utilities and helpers (preferred for new code)
  local-types/      # Shared TypeScript types
  pages/            # Next.js routes + API routes
  styles/           # Global SCSS (globals.scss, _variables.scss, _animations.scss)
  utils/            # LEGACY — do not add new utilities here

public/keepsimple_/
  assets/           # Static images, organized by feature
  audio/            # Audio files
  fonts/            # Custom font files
```

### lib vs utils

`src/lib/` is preferred for new utilities. `src/utils/` is legacy (contains one file). Both stay, but new code goes in `src/lib/`.

### Context location

`src/components/Context/GlobalContext.ts` is the canonical location for context. `src/context/` holds `LongevityContext.tsx` — that is legacy. New contexts go in `src/components/Context/`.

---

## Component Pattern

### File structure

Every component lives in its own directory with colocated files:

```
src/components/ComponentName/
  ComponentName.tsx          # Component implementation
  ComponentName.module.scss  # Scoped styles
  index.ts                   # Barrel: import X from './X'; export default X;
```

### Exports

Always `export default`. Every `index.ts` does a default re-export. No named exports from barrel files.

```ts
// index.ts
import Button from './Button';
export default Button;
```

### Props typing

Declare a `ComponentNameProps` interface **inline above the component** in the `.tsx` file. No `T`-prefix. No `.types.ts` sibling unless the type is shared across multiple files.

```tsx
import cn from 'classnames';

import styles from './Card.module.scss';

interface CardProps {
  title: string;
  isActive?: boolean;
  className?: string;
}

const Card = ({ title, isActive, className }: CardProps) => {
  return (
    <div
      className={cn(styles.card, className, { [styles.cardItem]: isActive })}
    >
      {title}
    </div>
  );
};

export default Card;
```

> The codebase currently mixes `TComponentName`, `ComponentNameProps`, and separate `.types.ts` files. Going forward, use the inline `ComponentNameProps` interface pattern shown above. Only create a `.types.ts` file when the same type is imported by other components.

### Directory naming

- **PascalCase** for standalone component directories: `Button/`, `Modal/`, `Heading/`
- **lowercase** for feature collection directories that group sub-components: `longevity/`, `articles/`, `contributors/`, `tools/`
- Underscore prefix for page-specific groups: `_company-management/`

### Barrel files must not be empty

The following `index.ts` files are currently empty (0 bytes) — these are bugs:

- `src/layouts/SleepLayout/index.ts`
- `src/layouts/EnvironmentLayout/index.ts`
- `src/layouts/WorkoutLayout/index.ts`
- `src/layouts/LongevityExample/index.ts`
- `src/components/longevity/StudySection/index.ts`
- `src/components/longevity/EnvironmentSubSection/index.ts`
- `src/components/ContentGenerator/index.ts`
- `src/components/EmojiFall/index.ts`

Every new `index.ts` must contain the default re-export pattern.

---

## Styling

### Source of truth

1. If the user gives explicit visual instructions (colors, spacing, sizes), follow them exactly.
2. If they don't, defer to the `keepsimple-style` skill (`.claude/skills/keepsimple-style/SKILL.md`) and read it before writing styles.
3. **Do not invent values.** Do not copy hardcoded hex/px from neighboring components just because they exist.
   The codebase has hardcoded colors, breakpoints, and spacing scattered across SCSS files. That is legacy, not a pattern to extend. New code aligns to `keepsimple-style.md`; old code stays as-is until touched.
   New code aligns to the `keepsimple-style` skill; old code stays as-is until touched.

### SCSS Modules only

No Tailwind, no CSS-in-JS, no inline styles (except single dynamic properties like `style={{ color: dynamicValue }}`).

```tsx
import cn from 'classnames';
import styles from './Thing.module.scss';

<div className={cn(styles.wrapper, { [styles.active]: isActive })} />;
```

### Conditional classes

Always use `classnames` (imported as `cn`):

```tsx
className={cn(styles.button, {
  [styles.primary]: variant === 'primary',
  [styles.disabled]: disabled,
})}
```

### SCSS class naming

camelCase for new code: `.card`, `.cardItem`, `.wrapper`, `.title`. The codebase mixes PascalCase and camelCase — prefer camelCase going forward.

### Global styles

- `src/styles/globals.scss` — resets, scrollbar, dark mode body, font-face declarations, video loader
- `src/styles/_variables.scss` — reusable class snippets (`.defaultTooltip`, `.section`, `.longevityContent`). **Not** SCSS variables despite the filename.
- `src/styles/_animations.scss` — keyframe animations and utility classes (`.animate-fadeIn`, etc.)

Global CSS can **only** be imported in `src/pages/_app.tsx`. Do not import global `.scss` from components.

### Dark mode

Class-based: `document.body.classList.toggle('darkTheme')`. Managed by `useGlobals` hook with localStorage persistence. Components use `.darkTheme` modifier classes in their SCSS modules.

### Breakpoints

No shared breakpoint variables or mixins. Common values used in the codebase: 1440, 1140, 961, 900, 800, 768px. New code should use the design tokens from `keepsimple-style.md`.

---

## Static Data

### Format

TypeScript objects only. Never JSON, never MDX.

### Structure

```
src/data/{feature}/
  en.ts       # English
  ru.ts       # Russian
  hy.ts       # Armenian (optional — falls back to English)
  index.ts    # Barrel
```

### Barrel pattern

```ts
// src/data/navbar/index.ts
import en from './en';
import hy from './hy';
import ru from './ru';

export default { en, ru, hy } as {
  en: typeof en;
  ru: typeof ru;
  hy: typeof hy;
};
```

### Consumption

```tsx
import navbar from '@data/navbar';

const { locale } = useRouter() as TRouter;
const { about, articles } = navbar[locale];
```

---

## Locales

Three locales: `en` (default), `ru`, `hy`.

Armenian (`hy`) falls back to English at runtime. Most pages use this pattern:

```ts
const currentLocale = locale === 'ru' ? 'ru' : 'en';
```

When creating new data directories, `hy.ts` is not required. Only provide it if you have real Armenian translations.

The i18n system is custom — no next-i18next, no react-intl. Just direct object lookup by `router.locale`.

---

## Path Aliases & Import Order

### Aliases (tsconfig.json)

| Alias            | Maps to              |
| ---------------- | -------------------- |
| `@components/*`  | `src/components/*`   |
| `@layouts/*`     | `src/layouts/*`      |
| `@hooks/*`       | `src/hooks/*`        |
| `@data/*`        | `src/data/*`         |
| `@api/*`         | `src/api/*`          |
| `@lib/*`         | `src/lib/*`          |
| `@constants/*`   | `src/constants/*`    |
| `@styles/*`      | `src/styles/*`       |
| `@local-types/*` | `src/local-types/*`  |
| `@utils/*`       | `src/utils/*`        |
| `@icons/*`       | `src/assets/icons/*` |

Use aliases for cross-folder imports. Use relative imports only within the same component folder (e.g., `./Button.module.scss`).

### Import order (enforced by ESLint)

```
1.  Side-effect imports
2.  Node built-ins
3.  Third-party packages (react, next, classnames...)
4.  @styles
5.  @constants
6.  @local-types
7.  @hooks
8.  @lib
9.  @api
10. @data
11. @icons
12. @components
13. @layouts
14. Other @/ aliases
15. Relative imports (non-style)
16. Style imports (.scss)
```

ESLint will error on wrong order. Run `eslint --fix` to auto-sort.

---

## Pages & Routing

### Pages Router only

All routes live in `src/pages/`. Never use App Router patterns (`src/app/`, `'use client'`, `next/navigation`).

### Page pattern

```tsx
import { GetStaticProps } from 'next';

import { TStaticProps } from '@local-types/data';

import useGlobals from '@hooks/useGlobals';

import { getData } from '@api/strapi';

import SeoGenerator from '@components/SeoGenerator';

import FeatureLayout from '@layouts/FeatureLayout';

interface PageProps {
  data?: any;
}

const FeaturePage = ({ data }: PageProps) => {
  const [{}, { isDarkTheme }] = useGlobals();

  return (
    <>
      <SeoGenerator strapiSEO={data?.Seo} />
      <FeatureLayout data={data} isDarkTheme={isDarkTheme} />
    </>
  );
};

export default FeaturePage;

export const getStaticProps: GetStaticProps = async ({
  locale,
}: TStaticProps) => {
  const data = await getData(locale);
  return {
    props: { locale, data },
    revalidate: 10,
  };
};
```

### Data fetching

Prefer `getStaticProps` with ISR (`revalidate: 10`). Use `getServerSideProps` only when data must be fresh on every request. Use `getStaticPaths` with `fallback: 'blocking'` for dynamic routes.

### SEO

Use the `SeoGenerator` component on every page. It handles `<title>`, meta tags, Open Graph, Twitter cards, JSON-LD schema, and `hrefLang` alternates. It lives at `src/components/SeoGenerator/SeoGenerator.tsx`.

### Layouts

Every page wraps its content in a layout from `src/layouts/`. The root `Layout` component (applied in `_app.tsx`) handles nav, cookie consent, and route-based body classes. Feature-specific layouts nest inside it.

### Client-only code

Anything that touches `localStorage`, `sessionStorage`, or `window` at module top level will break SSR with hydration mismatches. Wrap such components with `dynamic(() => import('...'), { ssr: false })`, or move the access into a `useEffect`. Existing code uses both patterns — pick whichever fits the situation.

---

## \_app.tsx — Global Concerns

`src/pages/_app.tsx` is where these things live:

- `SessionProvider` (NextAuth)
- `LongevityProvider` (context for longevity tool transitions)
- `GlobalContext.Provider` (account data, loader state, media refs)
- Root `Layout` wrapper
- Global SCSS imports (`globals.scss`)
- Google Analytics initialization (lazy-loaded via dynamic import)
- Mixpanel initialization (lazy-loaded via dynamic import)
- Route-change spinner logic
- Scroll style class toggling based on current route
- Body class toggling for dark theme and page-specific backgrounds
- Image preloading for longevity protocol assets

Do not import global CSS anywhere except `_app.tsx`.

---

## Asset Paths

### assetPrefix quirk

In production, `next.config.js` sets `assetPrefix: '/keepsimple_next'`. Locally it's empty. This only affects Next.js internal assets (`_next/`), not `public/` files.

### Static assets

All static files live under `public/keepsimple_/`. Reference them with `/keepsimple_/` prefix:

```
/keepsimple_/assets/longevity/diet/hearts/sugar.svg
/keepsimple_/fonts/Lato/Lato-Regular.woff2
/keepsimple_/audio/eat_mushrooms.mp3
```

`next.config.js` has rewrites that map `/assets/*` to `/keepsimple_/assets/*` (and similar for fonts, audio, static). Both paths work, but the canonical form is `/keepsimple_/`.

### SVGs as components

`@svgr/webpack` is configured. SVG files imported from `@icons/*` become React components:

```tsx
import LongevityIcon from '@icons/navbar/longevity.svg';

<LongevityIcon className={styles.icon} />;
```

Never use `<img src={svg}>` for SVGs. The type declaration in `src/svg.d.ts` types all `.svg` imports as `FC<SVGProps<SVGSVGElement>>`.

---

## Generated Files

`public/keepsimple_/llms-full-pages/` contains files generated by `scripts/generate-llms-pages.ts`. Do not hand-edit these. They are rebuilt by the `generate:llms:pages` script and committed via CI (`.github/workflows/generate-llms.yml`).

---

## Environment Variables

`.env.example` lists 17 variables with no documentation. The file has no comments about which are required, which are optional, or what local development values should be.

**Do not assume values.** Ask the developer before filling in `.env.local`.

Key variables:

- `NEXT_PUBLIC_STRAPI` / `STRAPI_URL` — Strapi CMS endpoint (required for data)
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — NextAuth config (required for auth)
- `NEXT_PUBLIC_ENV` — `local` / `staging` / `prod`
- `NEXT_PUBLIC_INDEXING` — `on` / `off` (controls GA tracking)
- `NEXT_PUBLIC_DOMAIN` — canonical domain for SEO/OG tags

The `next.config.js` loads env from `.env.{APP_ENV}` (e.g., `.env.local`, `.env.staging`, `.env.prod`).

---

## Things to Never Do

- Use the App Router, `'use client'`, or `next/navigation`
- Use Tailwind, styled-components, Emotion, or CSS-in-JS
- Use named exports in `index.ts` barrel files
- Add state management libraries (Redux, Zustand, Jotai, SWR, React Query)
- Add testing frameworks (Jest, Vitest, component testing)
- Import global CSS from anywhere except `_app.tsx`
- Use `<img src={...}>` for SVGs — import them as components
- Put new shared components outside `src/components/`
- Put new hooks outside `src/hooks/`
- Put new utilities in `src/utils/` — use `src/lib/` instead
- Put new contexts in `src/context/` — use `src/components/Context/` instead
- Skip the `index.ts` barrel when creating a component
- Invent colors, spacing, or font values — read the `keepsimple-style` skill first
- New code should use the design tokens from the `keepsimple-style` skill.

---

## Commit Hygiene — never push noise

Before every commit and before every push, audit `git status` and `git diff --cached --stat` and remove anything that doesn't belong in the change set. Specifically:

- **Personal developer files** (`docker-compose.dev.yml`, `docker-compose.override.yml`, local `.env.*`, editor configs, scratch notes) MUST NOT be committed. They live only on the dev machine; the repo has no use for them.
- **Working / scratch docs** under `/docs` are gitignored. Anything you want shared belongs in `README.md`, `AGENTS.md`, or a CLAUDE.md — not a loose markdown file in `/docs/`.
- **Build output** (the widget bundle, `.next/`, `dist/`) is gitignored. If it shows up in `git status`, something is wrong with the build script, not the gitignore.
- **Debug artifacts** (revision constants like `READ_LIB_REVISION = 'v4'`, console.logs left over from a debug session, no-op shim exports kept "for safety") get removed before the PR opens — they age into rot otherwise.

If you find one of these staged or already committed in your branch, drop it with `git rm` (or `git restore --staged`) and add it to `.gitignore` so the next agent can't trip on it. The `.gitignore` is the durable fix; deleting the file alone is not.

---

## Gotchas

### Case sensitivity

`tsconfig.json` has `forceConsistentCasingInFileNames: false`. Imports with wrong casing will work on macOS/Windows but break in Linux CI. Always match the exact filename casing.

### Duplicate TLocales type

`TLocales` is defined in both `src/local-types/global.ts` and `src/local-types/data.ts`. They're identical. Import from `@local-types/data` for page props, `@local-types/global` for component router typing.

### Some deep relative imports exist

A few files use deep relative paths like `'../../../../lib/mixpanel'` instead of `@lib/mixpanel`. ESLint allows this but the convention is aliases. Use aliases for new code.

### Mixpanel is lazily imported

`_app.tsx` imports Mixpanel via `import('../../lib/mixpanel')` — a dynamic import with a relative path. This is intentional to keep it out of the initial bundle.

### TODO comments reveal known issues

Key ones:

- `src/constants/tools.ts:20` — "review html, button with p and div" (HTML nesting issue)
- `src/context/LongevityContext.tsx:94` — "Fix heroReady logic"
- `src/components/SeoGenerator/SeoGenerator.tsx:96,137` — "HYTranslation TODO" (Armenian SEO incomplete)
- `src/components/UserProfile/UserProfile.tsx:30` — "This is incomplete"
- Multiple longevity components — "Move to constants" (image paths hardcoded)

### Prettier and ESLint both run on commit

Husky pre-commit runs lint-staged: ESLint `--fix` on `.ts`/`.tsx`, then Prettier on `.ts`/`.tsx`/`.scss`/`.json`/`.md`. Prettier config: single quotes, trailing commas, 2-space indent, `arrowParens: 'avoid'`.

---

## When Uncertain

- Find the closest existing component and match its structure.
- If a pattern in this file conflicts with what you see in the codebase, **this file wins** for new code. Old code stays as-is until touched.
- If a pattern isn't covered here at all, stop and ask before inventing one.
