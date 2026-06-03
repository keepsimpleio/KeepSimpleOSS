# LIBRARY_AGENT.md

Guidance for any AI coding agent working on the **library** feature inside **KeepSimpleOSS**. Keep responses tight; follow the rules below over generic "best practices."

> **This feature was ported from a standalone app.** "library" (a.k.a. "keepSimple Library") began life as its own Next.js **App Router** project. It now lives _inside_ KeepSimpleOSS, which is **Pages Router**. The original App Router / `@/*` / Storybook conventions **no longer apply** — this file documents the feature as it actually exists in this repo today. When this file conflicts with the root `AGENTS.md` / `CLAUDE.md`, the **host repo rules win**.

## Feature overview

Browse user libraries of books / videos / music. Auth is NextAuth (Google + Discord) bridged to a Strapi backend. UI follows **atomic design** (atoms → molecules → organisms) with **SCSS Modules**. The feature is gated behind the `isLibraryEnabled` flag (`@constants/library/common`).

## Where the library lives (namespacing map)

The port kept the library's structure but namespaced every folder under the host repo's existing aliases with a `library/` segment. There is **no `@/*` alias** — use the host aliases below.

| Concern                 | Original (App Router)      | Now (in KeepSimpleOSS)                                                                   |
| ----------------------- | -------------------------- | ---------------------------------------------------------------------------------------- |
| Routes                  | `src/app/library/...`      | `src/pages/library/index.tsx`, `src/pages/library/[username].tsx`                        |
| Components              | `src/components/{atoms,…}` | `@components/library/{atoms,molecules,organisms}/*`                                      |
| Page-level layouts      | `templates/`               | `@layouts/library/*` (`Home` → `HomeTemplate`, `Library`)                                |
| Context (state)         | `src/context/`             | `@components/Context/library/*`                                                          |
| HTTP wrappers           | `src/api/`                 | `@api/library/*` (`strapi.ts` + `library/object/shelf/tag/upload/user/`)                 |
| Axios / cookie adapters | `src/libraries/`           | `@lib/library/*` (`axios`, `cookie`)                                                     |
| Utilities               | `src/utils/`               | `@utils/library/*` (`resolveStrapiUrl`, `color`, `mapStrapiLibraries`, `schema/`, `seo`) |
| Shared types            | `src/types/`               | `@local-types/library/*`                                                                 |
| Constants               | `src/constants/`           | `@constants/library/*` (`common`, `seo.config`, `tags`)                                  |
| SVGs / images           | `src/assets/svg/`          | `@icons/library/svg`, `@icons/library/images`                                            |

Public assets are namespaced under `/library` (see commit `namespace public assets under /library`).

## Commands (host repo — yarn only)

| Command             | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `yarn dev`          | Next dev server at http://localhost:**3005**    |
| `yarn build`        | Production Next build (`APP_ENV=prod`)          |
| `yarn tsc --noEmit` | Typecheck (there is no `typecheck` script)      |
| `yarn test:e2e`     | Playwright (Chromium) E2E — the only test layer |

There is **no Storybook** and **no `yarn new:*` generator** in this repo — those were dropped in the port. Hand-create component folders following the shape below, or copy an existing sibling. Husky + lint-staged run ESLint `--fix` + Prettier on pre-commit.

## Conventions (rules)

- **Routing is Pages Router.** All library routes live in `src/pages/library/`. **Never** use App Router patterns (`src/app/`, `'use client'`, `next/navigation`, server components). Fetch with `getServerSideProps` / `getStaticProps`; for client-only code use `useEffect` or `dynamic(() => import(...), { ssr: false })`.
- **Component file shape.** Each component is its own folder: `Name.tsx`, `Name.types.ts`, `Name.module.scss`, `index.tsx`. No `.stories.tsx`.
- **Exports.** **Named** exports for components: `export function Button(...)`. The barrel `index.tsx` re-exports both the component and its types:
  ```ts
  export * from './Button';
  export * from './Button.types';
  ```
- **Props typing.** Define a `NameProps` interface in `Name.types.ts`. Use TS `enum`s for closed variant sets (`ButtonType`, `ButtonSize`, …).
- **Naming.** PascalCase for component dirs/files/types. camelCase for hooks (`useThing.ts`) and utilities.
- **Styling.** SCSS Modules only, composed with `classnames`. The App Router auto-prepend of `styles.scss` is **gone** — global SCSS is imported only in `src/pages/_app.tsx` (host rule). New styles follow the `keepsimple-style` skill; don't invent colors/spacing.
- **State.** React Context only — `AuthContext`, `GlobalStateContext`, `DashboardContext` under `@components/Context/library/`. No Redux/Zustand/TanStack Query. Prefer extending `GlobalStateContext` over adding a new provider.
- **HTTP.** All Strapi calls go through `axiosInstance` (`@lib/library/axios`) — it attaches the `accessToken` cookie as a Bearer. Wrap calls in `@api/library/*`; never `fetch` Strapi directly (exception: the OAuth callback).
- **SVGs.** Import as React components from the `@icons/library/svg` barrel (SVGR is configured). Don't use `next/image` for SVGs.
- **SEO & semantic HTML.** First-class at every level of the atomic hierarchy. Raster images go through `next/image` (allowlist hosts in `next.config.js` `images.remotePatterns`), never raw `<img>`. Use semantic elements, ordered headings, meaningful `alt`, accurate ARIA. The page also wraps content in the host `SeoGenerator` component.
- **Imports.** Use the namespaced host aliases above for anything cross-folder; relative imports only within the same component folder (`./Button.module.scss`). ESLint `simple-import-sort` enforces ordering — run `eslint --fix`.
- **Commits.** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`). This feature's commits are prefixed `library:`.

## Patterns to follow

- **Molecule:** `@components/library/molecules/BookCard` — `export function`, `classnames`, `next/image`, types in `BookCard.types.ts`, barrel re-exports both.
- **Organism:** `@components/library/organisms/Shelf`, `Sidebar`, `AddObjectModal`.
- **Page-level layout:** `@layouts/library/Home` (`HomeTemplate`), `@layouts/library/Library`.
- **Page:** `src/pages/library/index.tsx` — `GetServerSideProps`, gated by `isLibraryEnabled`, wraps `AuthProvider` + `GlobalStateProvider` + `SeoGenerator` + a `*Template`.
- **API call:** `@api/library/strapi.ts` and `@api/library/{object,shelf,tag,upload,user}/*` — async, `axiosInstance`, returns `data`.
- **Context provider:** `@components/Context/library/GlobalStateContext` — `useMemo`'d value, hook throws if used outside provider.

## Things to avoid

- App Router patterns: `src/app/`, `'use client'`, `next/navigation`, server components, the `@/*` alias.
- Bypassing `axiosInstance` for Strapi — header injection lives there.
- Adding a new Context provider when a flag on `GlobalStateContext` would do.
- New global CSS files — extend `src/styles/` (imported only in `_app.tsx`).
- Widening with `any` or scattering `@ts-expect-error`.
- New state managers (Redux/Zustand/TanStack Query) or styling systems (Tailwind, CSS-in-JS).
- Inventing colors/spacing/fonts — read the `keepsimple-style` skill first.

## Definition of done

1. `yarn tsc --noEmit` passes.
2. ESLint clean / `eslint --fix` applied (import order included).
3. Prettier clean.
4. `yarn build` succeeds.
5. No new `any` / `@ts-ignore` / `@ts-expect-error`.
6. No unused imports or dead code.
7. Commit uses Conventional Commits with the `library:` prefix.
