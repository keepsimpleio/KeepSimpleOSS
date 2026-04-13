● KeepSimpleOSS Codebase Audit Report

1. Stack & Tooling  


┌──────────────────┬───────────────────────────────────────────────────────────────────────┬─────────────────┐  
 │ Category │ Detail │ Version │  
 ├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤  
 │ Framework │ Next.js (Pages Router) │ 15.0.5 │  
 ├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ React │ React + React DOM │ 19.0.3 │  
 ├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤  
 │ Language │ TypeScript (strict: false, noImplicitAny: false) │ 5.2.2 │  
 ├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ Package manager │ Yarn v1 (yarn.lock) │ — │  
 ├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ Node (CI/Docker) │ Node.js │ 20.19.0 │
├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ SCSS │ sass + sass-loader │ 1.32.8 / 13.1.0 │
├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ Linting │ ESLint flat config + eslint-plugin-simple-import-sort │ 9.32.0 │
├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ Formatting │ Prettier (single quotes, trailing commas, no semis override) │ 3.6.2 │
├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ Git hooks │ Husky + lint-staged (pre-commit runs eslint --fix + prettier --write) │ 9.1.7 │
├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ Testing │ Cypress E2E only — no unit tests, no Jest │ 14.5.2 │
├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ Auth │ NextAuth v4 │ 4.23.2 │
├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ Analytics │ react-ga4 + mixpanel-browser │ 1.4.1 / 2.65.0 │
├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ CMS │ Strapi (external, fetched at build time) │ — │
├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ SVG │ @svgr/webpack (SVGs import as React components) │ 8.1.0 │
├──────────────────┼───────────────────────────────────────────────────────────────────────┼─────────────────┤
│ CI/CD │ GitHub Actions → Docker → GHCR │ — │
└──────────────────┴───────────────────────────────────────────────────────────────────────┴─────────────────┘

Key libraries: classnames (conditional CSS), react-slick (carousel), react-tooltip, react-beautiful-dnd (drag-and-drop), react-markdown, date-fns, lodash.debounce, nodemailer, geoip-lite.

No state management library (React Context only). No data-fetching library (no SWR, React Query). No form library.

---

2. Folder Structure

src/
├── api/ # Fetch functions calling Strapi/external APIs
├── assets/icons/ # SVG icons, grouped by feature (longevity/, navbar/, tools/, articles/)
├── components/ # React components (see §3)
├── constants/ # App-wide constants (tools.ts, longevity.ts, colors.ts)
├── context/ # Single file: LongevityContext.tsx
├── data/ # Localized static data (see §5)
├── hooks/ # Custom hooks (useGlobals, useMobile, useScreenSize, useClickOutside, etc.)
├── layouts/ # Page layout wrappers (Layout, LandingLayout, ArticleLayout, DietLayout, ToolsLayout, etc.)
├── lib/ # Shared utilities (mixpanel.ts, schema.tsx, strapi.ts, etc.)
├── local-types/ # Global TS types (data.ts, global.ts, pageTypes/)
├── pages/ # Next.js file-based routes + API routes
├── styles/ # Global SCSS (globals.scss, \_variables.scss, \_animations.scss, fonts.scss)
├── utils/ # Single file: getLongevityImageUrls.ts
└── svg.d.ts # Module declaration: \*.svg → React component

public/keepsimple\_/
├── assets/ # Static images by feature (articles-blog/, contributors/, longevity/, etc.)
├── audio/ # MP3/OGG files
├── fonts/ # TTF/WOFF custom fonts
├── llms-full-pages/ # Generated LLM content pages
└── static/ # Other static files

Conventions:

- Every component directory has a barrel index.ts (import X from './X'; export default X;)
- Styles are always colocated as ComponentName.module.scss
- Feature collections use lowercase dirs (longevity/, articles/, contributors/) containing PascalCase sub-component dirs
- Standalone/shared components use PascalCase dirs at src/components/ root (Button/, Modal/, Header/)
- One outlier: \_company-management/ uses underscore prefix

---

3. Component Patterns

Typical structure

src/components/Button/
├── Button.tsx
├── Button.module.scss
└── index.ts

Or with types:

src/components/Heading/
├── Heading.tsx
├── Heading.module.scss
├── Heading.types.ts
└── index.ts

Representative components

Button (src/components/Button/Button.tsx):

- Props typed inline as type TButton = { variant?: 'default' | 'primary' | 'secondary' | 'grey'; ... }
- Uses FC<TButton>, default export
- Variants via cn(styles.button, { [styles.primary]: variant === 'primary', ... })
- No .types.ts file

Heading (src/components/Heading/Heading.tsx):

- Props in separate Heading.types.ts as export type HeadingProps = { Tag?: 'h1'|'h2'|...; ... }
- Imported as import { HeadingProps } from './Heading.types'
- Supports Tag, isBig, isBold, isDarkTheme, hasRedUnderline, locale-specific styling

Modal (src/components/Modal/Modal.tsx):

- Inline type ModalProps, size variants (small | medium | large | full)
- Uses createPortal from react-dom
- Extensive conditional classes via cn()

WhatToEatOrAvoid (src/components/longevity/WhatToEatOrAvoid/):

- Contains a sub-component directory AboutTheProduct/ with its own .types.ts
- Sub-component imported via @components/longevity/WhatToEatOrAvoid/AboutTheProduct

Props typing inconsistency

┌────────────────────────────────────────────┬────────────────────┬─────────────────────────────────┐
│ Pattern │ Usage │ Example │
├────────────────────────────────────────────┼────────────────────┼─────────────────────────────────┤
│ Inline type TComponentName │ ~60% of components │ Button, Modal, Input │
├────────────────────────────────────────────┼────────────────────┼─────────────────────────────────┤
│ Separate .types.ts with ComponentNameProps │ ~40% │ Heading, Supplement, BasicStats │
├────────────────────────────────────────────┼────────────────────┼─────────────────────────────────┤
│ Inline interface │ Rare │ Pyramid │
└────────────────────────────────────────────┴────────────────────┴─────────────────────────────────┘

---

4. Styling Approach

System: SCSS Modules exclusively. No Tailwind, no CSS-in-JS, no styled-components.

Import pattern:
import cn from 'classnames';
import styles from './ComponentName.module.scss';

  <div className={cn(styles.Wrapper, { [styles.active]: isActive })} />

Design tokens: Hardcoded hex values throughout — no centralized SCSS variables for colors, spacing, or breakpoints. \_variables.scss contains reusable class snippets (.defaultTooltip, .longevityContent, .section) but not
token variables.

keepsimple-style.md documents the design system (colors as CSS custom properties, typography families, texture patterns, z-index layering, minimum text sizes) but these are not wired into SCSS variables — they're a
human-readable reference only.

Dark mode: Class-based toggling via useGlobals hook → document.body.classList.toggle('darkTheme') + localStorage persistence. Components handle dark mode with .darkTheme SCSS modifier classes.

Animations: Defined in src/styles/\_animations.scss as keyframes + utility classes (.animate-fadeIn, .animate-slideInFromLeft). Components @extend these.

Global styles imported in \_app.tsx:
import '../styles/globals.scss';

Breakpoints are hardcoded per-component (common values: 1440, 1140, 961, 900, 800, 768px) — no shared mixin or variable.

UXCore is an external product link, not a design system wired into this codebase.

---

5. Static Data Conventions

Location: src/data/{feature}/ — each directory contains en.ts, ru.ts, hy.ts, index.ts.

Format: TypeScript objects (not JSON, not MDX).

// src/data/navbar/en.ts
const en = {
about: 'About',
articles: 'Articles',
tools: 'Tools',
};
export default en;

// src/data/navbar/index.ts
import en from './en';
import hy from './hy';
import ru from './ru';
export default { en, ru, hy } as { en: typeof en; ru: typeof ru; hy: typeof hy; };

Types for data shapes live in src/local-types/data.ts (TLocales, TNavbarDataItem, TArticle, etc.).

Consumption: Components import the data module and index by router.locale:
import navbar from '@data/navbar';
const { locale } = useRouter() as TRouter;
const { about, articles } = navbar[locale];

Data directories (excluding vibesuite): 404, accordion, articlesBlog, buttonText, companyManagement, contributors, cookies, copyButton, fullscreenButton, header, imageModule, landingPage, longevity (with basicStats/
sub-dir), navbar, quote, tools.

---

6. Routing & Page Conventions

Router: Next.js Pages Router (file-based routing under src/pages/).

Page structure:
src/pages/
├── index.tsx # /
├── 404.tsx # /404
├── auth.tsx # /auth
├── articles.tsx # /articles
├── articles/[page].tsx # /articles/:slug
├── contributors.tsx # /contributors
├── company-management.tsx # /company-management
├── [page].tsx # /:slug (catch-all for Strapi pages)
├── tools/index.tsx # /tools
├── tools/longevity-protocol/... # /tools/longevity-protocol/\*
└── api/auth/[...nextauth].ts # NextAuth API route

Data fetching: Most pages use getStaticProps with ISR (revalidate: 10). Some use getServerSideProps (contributors). Dynamic routes use getStaticPaths with fallback: 'blocking'.

Layout pattern: Pages render a layout component that wraps content:
const Index: FC<PageProps> = ({ landingData }) => (
<LandingLayout homeData={landingData} darkTheme={isDarkTheme} />
);

A root Layout component in src/layouts/Layout/Layout.tsx wraps all pages (applied in \_app.tsx), handling nav, cookie box, and route-specific logic.

SEO: SeoGenerator component accepts strapiSEO, ogTags, dates, and type. It generates <title>, meta tags, Open Graph, Twitter cards, JSON-LD schema (via src/lib/schema.tsx), and hrefLang alternates.

Tool registration: Tools are fetched from Strapi CMS at build time (not hardcoded). Visual config (icons, hover colors) lives in src/constants/tools.ts as a TOOL_CONFIG record keyed by numeric Strapi ID.

---

7. i18n

Locales: en (default), ru, hy — configured in next.config.js.

Approach: Custom — no next-i18next or react-intl. Each data module exports { en, ru, hy } and components index by router.locale.

Fallback: Manual and inconsistent. Most pages use:
const currentLocale = locale === 'ru' ? 'ru' : 'en';
This means Armenian (hy) falls back to English everywhere except data modules that explicitly provide hy.ts (navbar, cookies, contributors, tools, 404, buttonText, accordion, quote).

There's a // HYTranslation TODO comment in SeoGenerator (line 96).

---

8. Imports & Aliases

11 path aliases in tsconfig.json:

┌────────────────┬────────────────────┐
│ Alias │ Maps to │
├────────────────┼────────────────────┤
│ @components/_ │ src/components/_ │
├────────────────┼────────────────────┤
│ @layouts/_ │ src/layouts/_ │
├────────────────┼────────────────────┤
│ @hooks/_ │ src/hooks/_ │
├────────────────┼────────────────────┤
│ @data/_ │ src/data/_ │
├────────────────┼────────────────────┤
│ @api/_ │ src/api/_ │
├────────────────┼────────────────────┤
│ @lib/_ │ src/lib/_ │
├────────────────┼────────────────────┤
│ @constants/_ │ src/constants/_ │
├────────────────┼────────────────────┤
│ @styles/_ │ src/styles/_ │
├────────────────┼────────────────────┤
│ @local-types/_ │ src/local-types/_ │
├────────────────┼────────────────────┤
│ @utils/_ │ src/utils/_ │
├────────────────┼────────────────────┤
│ @icons/_ │ src/assets/icons/_ │
└────────────────┴────────────────────┘

Import order enforced by eslint-plugin-simple-import-sort (16 groups):

1. Side-effects → 2. Node built-ins → 3. Third-party → 4. @styles → 5. @constants → 6. @local-types → 7. @hooks → 8. @lib → 9. @api → 10. @data → 11. @icons → 12. @components → 13. @layouts → 14. Other @/ → 15. Relative
   non-style → 16. Style imports (.scss)

---

9. Things a New Contributor Would Get Wrong

1. Where to put types. Three patterns coexist: inline in component file, separate .types.ts sibling, or centralized in @local-types/. No documented rule for when to use which.
1. Component directory naming. PascalCase for standalone components, lowercase for feature collections — but this convention is implicit and not enforced.
1. Styling. SCSS modules only. No inline styles (except single dynamic properties like style={{ color }}). No Tailwind. keepsimple-style.md is the design reference but isn't linked from CONTRIBUTING.md.
1. SVG imports. @svgr/webpack means .svg files import as React components, not image URLs. The type declaration is in src/svg.d.ts. Using <img src={...}> with an SVG import won't work.
1. Barrel files. Every component directory should have an index.ts, but some are empty (0 bytes) — e.g., longevity/StudySection/index.ts, longevity/EnvironmentSubSection/index.ts.
1. Armenian locale fallback. If you add a new data module, the implicit locale === 'ru' ? 'ru' : 'en' pattern silently drops Armenian to English. You must provide an explicit hy.ts and handle it in the fallback logic if
   Armenian should be supported.
1. Deep relative imports. A few files use '../../../../lib/mixpanel' instead of @lib/mixpanel. ESLint allows both, but the convention is aliases.
1. Environment variables. .env.example lists 17 variables with no documentation of which are required, what values to use locally, or which are client-side (NEXT*PUBLIC*\*) vs server-only.
1. GlobalContext location. It lives at src/components/Context/GlobalContext.ts (inside components, not src/context/). LongevityContext lives at src/context/LongevityContext.tsx. Two different patterns.
1. No unit tests. Only Cypress E2E exists. There's no Jest setup, so adding unit tests requires bootstrapping from scratch.

---

10. What's Missing or Inconsistent

- No centralized design tokens. Colors, spacing, and breakpoints are hardcoded per-component. keepsimple-style.md documents the design system in prose, but nothing enforces it in code.
- Breakpoints are duplicated. At least 8 different max-width values appear across component SCSS files with no shared variable or mixin.
- TypeScript is loose. strict: false and noImplicitAny: false — many props typed as any, several // TODO: fix any type comments.
- Props naming conventions diverge. Some components use TComponentName (T-prefix), others use ComponentNameProps (Props-suffix). Both patterns appear in roughly equal proportion.
- \_variables.scss is misnamed. It contains reusable class snippets (.defaultTooltip, .section), not SCSS variables ($color-primary, etc.).
- src/utils/ has a single file. Most utilities live in src/lib/ instead. The boundary between utils/ and lib/ is unclear.
- Context files are split across two locations — src/components/Context/ and src/context/.
- longevity-variavles.scss (typo in filename) is empty — 0 bytes.
- CONTRIBUTING.md says "follow our code style" but doesn't reference keepsimple-style.md, import ordering rules, or component structure conventions.
- forceConsistentCasingInFileNames: false in tsconfig — case-sensitivity issues can slip through on macOS/Windows but break on Linux CI.
