#!/bin/bash
set -e

# ──────────────────────────────────────────────────────────────────────
# Import an external repo into the keepsimple monorepo
#
# Usage:  ./scripts/import-repo.sh <git-url> <target-path>
# Example: ./scripts/import-repo.sh https://github.com/someone/vibesuite.git tools/vibesuite
#
# What it does:
#   1. Creates a branch from dev
#   2. Clones the external repo into _incoming/
#   3. Hands off to Claude Code with a detailed migration prompt
#   4. Claude restructures everything to match keepsimple conventions
# ──────────────────────────────────────────────────────────────────────

REPO_URL=$1
TARGET_PATH=$2

if [ -z "$REPO_URL" ] || [ -z "$TARGET_PATH" ]; then
  echo "Usage: ./scripts/import-repo.sh <git-url> <target-path>"
  echo "Example: ./scripts/import-repo.sh https://github.com/someone/vibesuite.git tools/vibesuite"
  exit 1
fi

FEATURE_NAME=$(basename "$TARGET_PATH")

# 1. Branch from dev
git fetch origin
git checkout dev
git pull origin dev
BRANCH="feat/import-$FEATURE_NAME"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

# 2. Clone the external repo into a staging area
TMP_DIR=$(mktemp -d)
git clone "$REPO_URL" "$TMP_DIR/source"
rm -rf "$TMP_DIR/source/.git"

STAGING="_incoming/$FEATURE_NAME"
mkdir -p "$STAGING"
cp -r "$TMP_DIR/source/." "$STAGING/"
rm -rf "$TMP_DIR"

echo ""
echo "Source cloned to $STAGING"
echo "Target location: $TARGET_PATH"
echo "Branch: $BRANCH"
echo ""
echo "Handing off to Claude Code..."
echo ""

# 3. Hand off to Claude Code
claude --print "
You are integrating an external repo into the keepsimple monorepo.

Source: _incoming/$FEATURE_NAME
Target: $TARGET_PATH

Read keepsimple-style.md (the full file, especially the Technical Rules section at the bottom)
before you write any code. That file is the single source of truth for how this project is structured.

THE GOAL: The migrated pages must look and behave EXACTLY like the source app.
Do NOT change any visual design. Do NOT modify keepsimple's existing styles.
The only changes are structural: different file layout, SCSS Modules instead of
inline/Tailwind/CSS, Pages Router instead of App Router. The user must not see
any visual difference.

IMPORTANT: if source components already match our project style, just move them
as-is. Do NOT refactor working code for the sake of refactoring. Only change
what needs changing.

──────────────────────────────────────────────────────────────────────
ADDITIONAL RULES
──────────────────────────────────────────────────────────────────────

- Reuse existing keepsimple components (Button, Modal, Input, Heading, etc.)
  wherever the source has equivalents. If a source style doesn't match any
  existing variant, ADD a new variant to our component instead of inlining
  custom styles.

- Use our Heading component for all h1/h2/h3 — never raw heading tags.

- Validate HTML semantics. No invalid nesting, no nested interactive elements,
  use semantic tags.

- Extract types into sibling files named ComponentName.types.ts with a
  ComponentNameProps interface.

- SVGs: never inline. Imported into components → src/assets/icons/<feature>/.
  Used in SCSS or <Image> tags → keepsimple_/public/assets/<feature>/.
  Reuse existing folders if names match, otherwise create.

- SEO: import SeoGenerator on new pages but pass NO values (content comes from
  backend later). Don't add separate schema.org — SeoGenerator already handles it.

- Localization: if Russian or Armenian (hy) files contain broken unicode escapes
  that should be readable Cyrillic/Armenian, decode the entire file. Don't touch
  JSON files where \\\\uXXXX escapes are valid.

──────────────────────────────────────────────────────────────────────
PHASE 1: UNDERSTAND THE SOURCE
──────────────────────────────────────────────────────────────────────

1. Read every file in _incoming/$FEATURE_NAME/src/ to understand what the app does.
2. Read _incoming/$FEATURE_NAME/package.json for all dependencies.
3. Identify:
   - Which router it uses (App Router vs Pages Router)
   - How it styles components (Tailwind, CSS Modules, inline styles, SCSS, etc.)
   - What state management or data-fetching patterns it uses
   - What auth system it uses (NextAuth version, providers, etc.)
   - Any external services (Redis, databases, email, etc.)

──────────────────────────────────────────────────────────────────────
PHASE 2: MERGE DEPENDENCIES
──────────────────────────────────────────────────────────────────────

Compare _incoming/$FEATURE_NAME/package.json with the root package.json.

Rules:
- If both repos have the SAME package: keep the version from root package.json. Do not upgrade.
- If the source has a package that root does NOT have: add it to root package.json.
- SKIP these source packages entirely (keepsimple does not use them):
  - tailwindcss, @tailwindcss/postcss, postcss (keepsimple uses SCSS Modules)
  - Any package that is only needed because the source uses App Router
- After updating package.json, run: yarn install

Print a table showing: package name | source version | action taken (kept existing / added / skipped)

──────────────────────────────────────────────────────────────────────
PHASE 3: CONVERT ROUTING (App Router -> Pages Router)
──────────────────────────────────────────────────────────────────────

keepsimple uses the Next.js Pages Router (src/pages/).

For each route in the source:
- src/app/page.tsx                -> src/pages/tools/$FEATURE_NAME/index.tsx
- src/app/[slug]/page.tsx         -> src/pages/tools/$FEATURE_NAME/[slug].tsx
- src/app/api/*/route.ts          -> src/pages/api/$FEATURE_NAME/*.ts
- src/app/layout.tsx              -> integrate into _app.tsx or a new layout in src/layouts/

Conversion rules:
- Remove all 'use client' directives (Pages Router does not need them)
- Replace server-component data fetching with getServerSideProps or getStaticProps
- next/headers is not available in Pages Router — use req/res from getServerSideProps
- next/navigation -> next/router (useRouter from next/router, not next/navigation)
- Replace App Router middleware with Pages Router API route checks or getServerSideProps guards
- Page components must use: export default ComponentName + export async function getServerSideProps

Follow the existing pattern from src/pages/tools/ and src/pages/contributors.tsx:
  - Page fetches data in getServerSideProps
  - Page renders <SeoGenerator> + <Layout>
  - Layout lives in src/layouts/

──────────────────────────────────────────────────────────────────────
PHASE 4: CONVERT ALL STYLING TO SCSS MODULES
──────────────────────────────────────────────────────────────────────

keepsimple uses SCSS Modules exclusively. The migrated app must be a PIXEL-PERFECT
replica of the source. Do not change any visual property — only move where styles live.

ZERO INLINE STYLES ALLOWED. Convert every single one:

For each component:
1. Create a ComponentName.module.scss alongside the .tsx file
2. Extract EVERY inline style={{}} into an SCSS class — no exceptions:
   - Static styles (e.g., style={{ padding: '1rem' }}) -> .ClassName { padding: 1rem; }
   - Conditional styles computed from state/props -> use cn() with multiple SCSS classes
   - Styles that depend on dynamic data (e.g., style={{ color: category.color }}) ->
     these are the ONLY exception. Keep them as inline style={{}} but ONLY for the
     single dynamic property. All other properties on the same element must still
     be in the SCSS module.
     Example: style={{ color: category.color }} is OK.
     But style={{ color: category.color, padding: '1rem', display: 'flex' }} is NOT —
     move padding and display to the SCSS class, keep only color inline.
3. Extract EVERY Tailwind utility class into its SCSS equivalent
   - className=\"flex items-center gap-4\" -> .Wrapper { display: flex; align-items: center; gap: 1rem; }
4. Convert EVERY .css file into .module.scss
   - globals.css -> src/styles/$FEATURE_NAME.scss (global, imported in _app.tsx)
   - component.css -> ComponentName.module.scss (scoped)
5. Import as: import styles from './ComponentName.module.scss';
6. Use as: className={styles.ClassName} or cn(styles.A, { [styles.B]: condition })
7. Use classnames (imported as cn) for conditional classes — already installed

Copy every CSS value exactly as it appears in the source:
- Same colors, same sizes, same spacing, same fonts, same transitions
- Same hover states, same focus states, same active states
- Same animations, same keyframes, same durations, same easing
- Same media queries, same breakpoints, same responsive behavior
- Same z-index, same positioning, same overflow behavior
- If the source uses CSS variables (var(--foo)), keep them as var(--foo) in SCSS

Convert hover/focus/active states that use onMouseEnter/onMouseLeave JS handlers:
- If the handler just changes a style -> replace with SCSS :hover/:focus/:active pseudo-class
- If the handler does other things besides style changes -> keep the handler but move the
  style portion into SCSS, applying/removing a class instead of mutating element.style

SCSS class naming: PascalCase (e.g., .SkillCard, .CategoryNav, .DetailPanel).

GLOBAL STYLES (animations, keyframes, scrollbar styles, font imports):
- Put them in src/styles/$FEATURE_NAME.scss as a regular (non-module) SCSS file
- Animation classes used as plain strings (className=\"animate-slide-in\") stay as
  plain selectors in this file — do NOT wrap in :global(), this file is not a module
- Import it in src/pages/_app.tsx alongside globals.scss:
    import '../styles/$FEATURE_NAME.scss';
  Next.js Pages Router ONLY allows global CSS imports in _app.tsx.
  Do NOT import global .scss from any other component or layout file.
  Do NOT @import it from inside a .module.scss file.
- Scope feature-specific CSS variable overrides under a .${FEATURE_NAME}-root class
  so they don't leak into other keepsimple pages

DO NOT modify any existing keepsimple styles (globals.scss, _variables.scss, etc.).
DO NOT change CSS variable values defined in keepsimple-style.md.
If the source app uses different values for the same variable names, override them
inside the .${FEATURE_NAME}-root scope only.

──────────────────────────────────────────────────────────────────────
PHASE 5: RESTRUCTURE FILES TO MATCH KEEPSIMPLE CONVENTIONS
──────────────────────────────────────────────────────────────────────

Read keepsimple-style.md Technical Rules for the exact folder structure.

Components go in: src/components/$FEATURE_NAME/ComponentName/
  - ComponentName.tsx
  - ComponentName.module.scss
  - index.ts (barrel: import X from './X'; export default X;)
  - ComponentName.types.ts (if props are complex)

Layouts go in: src/layouts/\${FEATURE_NAME}Layout/
  - Same file structure as components

Pages go in: src/pages/tools/$FEATURE_NAME/
  - Follow the pattern from src/pages/tools/longevity-protocol/

Data files go in: src/data/$FEATURE_NAME/
  - If the source has i18n: create en.ts, ru.ts, hy.ts + index.ts
  - If the source has static data (like skills.ts): put it here

Types go in: src/local-types/pageTypes/$FEATURE_NAME.ts

API functions go in: src/api/$FEATURE_NAME.ts

Hooks go in: src/hooks/ (prefixed with use*)

Naming rules:
- Component folders: PascalCase (SkillCard/, CategoryNav/)
- Component files: PascalCase (SkillCard.tsx, SkillCard.module.scss)
- Feature grouping folders: lowercase ($FEATURE_NAME/)
- Data/API/constants files: lowercase (skills.ts, not Skills.ts)
- All exports: export default (not named exports in index.ts)

──────────────────────────────────────────────────────────────────────
PHASE 6: FIX IMPORTS
──────────────────────────────────────────────────────────────────────

Update all imports to use keepsimple's path aliases:
- @components/*  -> src/components/*
- @layouts/*     -> src/layouts/*
- @hooks/*       -> src/hooks/*
- @data/*        -> src/data/*
- @api/*         -> src/api/*
- @local-types/* -> src/local-types/*
- @icons/*       -> src/assets/icons/*
- @lib/*         -> src/lib/*
- @constants/*   -> src/constants/*
- @styles/*      -> src/styles/*
- @utils/*       -> src/utils/*

Replace the source's @/* alias with the specific keepsimple aliases above.

Import order is enforced by eslint-plugin-simple-import-sort. Follow this order:
  1. Side-effect imports
  2. Node built-ins
  3. Third-party packages (react, next, classnames, etc.)
  4. @styles -> @constants -> @local-types -> @hooks -> @lib -> @api -> @data -> @icons -> @components -> @layouts
  5. Relative imports (non-style)
  6. Style imports (.scss)

──────────────────────────────────────────────────────────────────────
PHASE 7: AUTH COMPATIBILITY
──────────────────────────────────────────────────────────────────────

keepsimple uses next-auth 4.23.2 (v4). If the source uses NextAuth v5 / Auth.js:
- Convert to v4 API (NextAuth(), not auth())
- Use useSession() on client, getServerSession() in getServerSideProps
- API route: src/pages/api/auth/[...nextauth].ts (not route.ts)
- Check if keepsimple already has [...nextauth] — if so, MERGE providers, do not overwrite

──────────────────────────────────────────────────────────────────────
PHASE 8: COPY ALL STATIC ASSETS
──────────────────────────────────────────────────────────────────────

The source repo has a public/ folder with images, SVGs, fonts, and other static files.
keepsimple serves all assets from public/keepsimple_/assets/.

COPY EVERY ASSET — do not skip any image, font, SVG, video, or media file.
The migrated app must have access to every file the source app used.

1. Scan _incoming/$FEATURE_NAME/public/ recursively for ALL files:
   - Images: .jpg, .jpeg, .png, .webp, .gif, .avif, .ico
   - Vectors: .svg
   - Fonts: .woff, .woff2, .ttf, .otf, .eot
   - Video/audio: .mp4, .webm, .mp3, .wav, .ogg
   - Any other static file the app references
2. SKIP only framework boilerplate: next.svg, vercel.svg, favicon.ico, robots.txt
3. Copy everything else to: public/keepsimple_/assets/$FEATURE_NAME/
   - Preserve subfolder structure from the source public/ directory
   - Example: public/images/hero.jpg -> public/keepsimple_/assets/$FEATURE_NAME/images/hero.jpg
4. Also check src/ for assets:
   - Some repos put images in src/assets/, src/images/, or alongside components
   - Copy those to public/keepsimple_/assets/$FEATURE_NAME/ as well
5. Update EVERY reference in the migrated code:
   - Search all .tsx, .ts, .scss, .module.scss files
   - Patterns to find: src=\", src={, href=\", url(, backgroundImage:, import.*\.(jpg|png|svg|webp)
   - Rewrite paths:
     '/image.jpg'                      -> '/keepsimple_/assets/$FEATURE_NAME/image.jpg'
     '/assets/foo.png'                 -> '/keepsimple_/assets/$FEATURE_NAME/assets/foo.png'
     '/images/bar.svg'                 -> '/keepsimple_/assets/$FEATURE_NAME/images/bar.svg'
   - Also check template literals: \`/\${path}\` and string concatenation: '/path' + variable
   - Also check CSS/SCSS: url('/image.jpg') -> url('/keepsimple_/assets/$FEATURE_NAME/image.jpg')
6. If the source generates textures or images via code (e.g., SVG data URIs, Canvas),
   leave those as-is — they don't need file copying
7. Verify: after migration, grep all migrated files for any remaining asset paths
   that don't start with /keepsimple_/assets/$FEATURE_NAME/ or are not data: URIs.
   Fix any you find.

──────────────────────────────────────────────────────────────────────
PHASE 9: CLEANUP
──────────────────────────────────────────────────────────────────────

1. Delete _incoming/$FEATURE_NAME entirely
2. Delete any leftover config files from the source (tailwind.config.*, postcss.config.*, etc.)
3. Run: yarn install (if package.json was modified)
4. Make sure there are no broken imports by checking each new file

──────────────────────────────────────────────────────────────────────
PHASE 10: REPORT
──────────────────────────────────────────────────────────────────────

When done, print a summary:
- List of new dependencies added to package.json
- File mapping: source path -> destination path (for every file)
- Asset mapping: source asset -> destination path (for every image/font/media)
- List of files that could NOT be automatically converted and why
- Any env variables the source needs (.env) that keepsimple should add
- Next steps for the developer (manual testing, missing assets, etc.)
"
