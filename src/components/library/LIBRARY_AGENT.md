# AGENTS.md

Guidance for any AI coding agent working in this repo (Cursor, OpenAI Codex, Aider, Jules, Claude Code, etc.). Keep responses tight; follow the rules below over generic "best practices."

## Project overview

`library` (also called "keepSimple Library") is a Next.js 15 App Router app for browsing user libraries of books/videos/music. Auth is NextAuth (Google + Discord providers) bridged to a Strapi backend. UI follows atomic design with SCSS Modules. Stack: React 19, TypeScript (strict), Yarn, Node 18.18.0.

## Commands

| Command                  | What it does                                 |
| ------------------------ | -------------------------------------------- |
| `yarn dev`               | Run Next dev server at http://localhost:3000 |
| `yarn build`             | Production Next build                        |
| `yarn start`             | Run the production build                     |
| `yarn lint`              | `next lint` (ESLint flat config)             |
| `yarn format`            | Prettier write across the repo               |
| `yarn format:check`      | Prettier check (CI-friendly, no writes)      |
| `yarn storybook`         | Storybook at http://localhost:6006           |
| `yarn build-storybook`   | Static Storybook build                       |
| `yarn new:atom Name`     | Scaffold an atom (PascalCase required)       |
| `yarn new:molecule Name` | Scaffold a molecule                          |
| `yarn new:organism Name` | Scaffold an organism                         |
| `yarn new:template Name` | Scaffold a template                          |

Env: copy NextAuth/Strapi/provider keys into `.env.local` (there is no `.env.example` — see [src/app/api/auth/[...nextauth]/authОptions.ts](src/app/api/auth/[...nextauth]/authОptions.ts) for required keys). Husky runs `lint-staged` on pre-commit.

There is **no** `typecheck` or `test` script. To typecheck, run `yarn tsc --noEmit`. Vitest is wired only to run Storybook stories via `@storybook/experimental-addon-test` (Playwright/Chromium).

## Architecture map

```
src/
  app/                    # Next App Router (pages, layouts, route handlers)
    api/auth/[...nextauth]/   # NextAuth handler + authОptions + refresh token
    auth/                 # /auth page (post-OAuth callback handling)
    library/[username]/   # dynamic library page
  components/
    atoms/                # purely presentational primitives (Text, Icon, Avatar, …)
    molecules/            # composed-of-atoms, still presentational (Button, Modal, Input, …)
    organisms/            # complex sections (Header, Sidebar, LibraryCard)
    templates/            # page-level layouts (HomeTemplate, LibraryTemplate)
  context/                # React Context providers (AuthContext, GlobalStateContext) — the only state mgmt
  api/                    # thin HTTP wrappers around axiosInstance (strapi.ts, auth.ts)
  libraries/              # third-party SDK adapters (axios/, cookie/) — NOTE: name is "libraries", not "lib"
  hooks/                  # custom React hooks
  utils/                  # pure utility functions (e.g. seo.ts)
  types/                  # shared TypeScript types
  constants/              # shared constants (e.g. librariesData, shelfCardData)
  config/                 # config objects (e.g. seo.config.ts)
  styles/                 # global SCSS (auto-prepended via next.config.ts)
  assets/svg/             # SVG components (loaded via SVGR)
  featues/                # [sic] feature-level logic (currently a placeholder file)
generators/               # `yarn new:*` component generator scripts
.storybook/               # Storybook config
public/                   # static assets
```

Path alias: `@/*` → `src/*`.

## Conventions (rules)

- **Component file shape.** Every component lives in its own folder with five files: `Name.tsx`, `Name.types.ts`, `Name.module.scss`, `Name.stories.tsx`, `index.ts(x)`. Always use `yarn new:atom|molecule|organism|template Name` instead of hand-creating.
- **Naming.** PascalCase for component dirs/files and types. camelCase for hooks (`useThing.ts`) and utilities. Hooks files use `.ts` unless they need JSX (`.tsx`).
- **Exports.** Named exports for components (`export function Button(...)`). The component's `index` re-exports both the component and its types: `export * from './Button'; export * from './Button.types';`.
- **Props typing.** Define a `NameProps` interface in `Name.types.ts`. Use TypeScript `enum`s for closed variant sets (see `ButtonType`, `ButtonSize`, `TypographyVariant`).
- **Styling.** SCSS Modules only. Compose classes with `classnames`. The styles entrypoint `styles.scss` is auto-prepended via `next.config.ts` — global SCSS variables/mixins are already available, do not `@use` them per-file.
- **Client/server.** Server components are the default. Add `'use client'` only when you need state, effects, browser APIs, or browser-only providers. Layouts under `src/app/` should stay server-side when possible (see [src/app/layout.tsx](src/app/layout.tsx)).
- **State.** React Context only — `AuthContext` and `GlobalStateContext`. No Redux/Zustand/TanStack Query. Add new global state to `GlobalStateContext` rather than creating new providers unless the concern is genuinely separable.
- **HTTP.** All Strapi calls go through `axiosInstance` ([src/libraries/axios/index.ts](src/libraries/axios/index.ts)) — it auto-attaches the `accessToken` cookie as a Bearer. Wrap calls in `src/api/*.ts`; never call `fetch` for Strapi directly (the exception is the OAuth callback in [src/api/auth.ts](src/api/auth.ts)).
- **SVGs.** Import as React components: `import GoogleIcon from '@/assets/svg/google.svg'` — SVGR is configured in `next.config.ts`. Don't use `next/image` for SVGs.
- **SEO & semantic HTML.** Care about SEO and correct, semantic markup at every level of the atomic hierarchy — accessibility and crawlability are first-class, not afterthoughts. Raster images go through `next/image` (`<Image>`), never a raw `<img>` (it gives lazy-loading, sizing, and CLS protection; remember to allowlist the host in `next.config.ts` `images.remotePatterns`). Use semantic elements over `<div>` soup (`<button>`, `<nav>`, `<main>`, `<ul>/<li>`, headings in order), always provide meaningful `alt` text, and keep ARIA roles/labels accurate. Build correctness up from atoms so molecules/organisms/templates inherit it.
- **Imports.** Use the `@/*` alias for anything under `src/`. Order groups (per repo README): third-party → global styles → constants → helpers → types → hooks → lib → components → features → assets → local styles. Separate each group with a blank line.
- **Commits.** Conventional Commits (`feat:`, `fix:`/`bugfix:`, `hotfix:`, `chore:`, `docs:`, `style:`, `refactor:`). Branches: `feat/123-add-thing` (with issue) or `feat/add-thing`.

## Patterns to follow

- **Atom:** [src/components/atoms/Text/Text.tsx](src/components/atoms/Text/Text.tsx) — minimal, props-driven, `JSX.Element` return type.
- **Molecule:** [src/components/molecules/Button/Button.tsx](src/components/molecules/Button/Button.tsx) — `React.FC<Props>`, destructures with enum defaults, `classNames(styles.x, styles[size], className)`.
- **Modal pattern:** [src/components/molecules/SignInModal/SignInModal.tsx](src/components/molecules/SignInModal/SignInModal.tsx) — `'use client'`, takes `onClose`, composes `<Modal>`.
- **Template:** [src/components/templates/Home/Home.tsx](src/components/templates/Home/Home.tsx) — composes Header + sections + modal, holds local UI state with `useState`.
- **App Router page:** [src/app/page.tsx](src/app/page.tsx) — server component, exports `metadata`, renders a Template.
- **Layout:** [src/app/library/layout.tsx](src/app/library/layout.tsx) — server component, wraps children with Header + Sidebar.
- **Context provider:** [src/context/GlobalStateContext.tsx](src/context/GlobalStateContext.tsx) — `'use client'`, `useMemo`'d value, hook throws if used outside provider.
- **API call:** [src/api/strapi.ts](src/api/strapi.ts) — async function, try/catch with `console.error`, returns `data` from `axiosInstance`.
- **Storybook story:** [src/components/molecules/Button/Button.stories.tsx](src/components/molecules/Button/Button.stories.tsx) — `Meta<typeof X>`, `argTypes` per variant prop, one `Story` per visual variant.

## Things to avoid

- Don't hand-create component folders — run `yarn new:<type> Name` and edit the output.
- Don't bypass `axiosInstance` for Strapi — header injection lives there.
- Don't add a new Context provider when adding a flag to `GlobalStateContext` would do.
- Don't add new global CSS files — extend [src/styles/](src/styles/) and ensure they're reachable from `styles.scss` (which is auto-prepended).
- Don't widen types with `any` or scatter new `@ts-expect-error` comments. There are two existing NextAuth-related ones ([src/app/layout.tsx:38](src/app/layout.tsx#L38), [src/context/AuthContext.tsx:112](src/context/AuthContext.tsx#L112)) — match that style only when the conflict is genuinely an upstream-types issue.
- Don't rename or "fix" these existing oddities without asking: the folder `src/featues/` (sic), the file `authОptions.ts` (the `О` is Cyrillic), mixed `index.ts`/`index.tsx` across components. They are intentional-for-now; touching them is a cross-cutting change.
- Don't introduce a new state manager (Redux/Zustand/TanStack Query) or a new styling system (Tailwind, CSS-in-JS).
- Don't import from a `pages/` directory — this repo is App Router only; `pages/` does not exist.

## Testing expectations

- Every component must have a `*.stories.tsx` file covering its meaningful variants — the generator creates a stub; fill it in.
- Stories are the test surface in this repo. There is no unit-test (`.test.tsx`) convention yet — do not introduce one without asking.
- Vitest is configured to run stories headlessly via `@storybook/experimental-addon-test` (Playwright/Chromium). To run: `yarn vitest`.

## Definition of done

Before declaring a task complete, verify:

1. `yarn lint` is clean.
2. `yarn format:check` passes (or run `yarn format`).
3. `yarn tsc --noEmit` passes.
4. `yarn build` succeeds.
5. New/changed components have at least one Storybook story; existing stories still render.
6. No new `any`, `@ts-ignore`, or `@ts-expect-error` (unless matching the existing NextAuth pattern).
7. No unused imports or dead code introduced.
8. Commit message uses Conventional Commits.
