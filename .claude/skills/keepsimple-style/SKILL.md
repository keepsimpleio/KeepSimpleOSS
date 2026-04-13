---
name: keepsimple-style
description: Apply the "keepsimple" design language — a Japanese wabi-sabi meets Western editorial aesthetic — to any frontend component, page, or UI. Use this skill whenever the user references the keepsimple brand, asks for a Japanese-minimalist web design with paper textures and kanji watermarks, wants the cream/terracotta/editorial aesthetic, or uploads screenshots of the keepsimple site. Also trigger when the user says "that design style from the screenshots", "the contributors page style", or "Japanese editorial minimalism". This skill produces HTML/CSS/JS or React code with the precise visual system including paper textures, faded kanji, crimson accents, and the wabi-sabi card grid.
---

# keepsimple Design Style

A precise replication guide for the **keepsimple** visual language — Japanese wabi-sabi minimalism fused with Western editorial typography.

## Core Aesthetic Identity

**Mood**: Calm, scholarly, timeless. Like a well-worn Japanese notebook used by a Western academic.  
**Key tension**: Eastern restraint + Western editorial structure.  
**Signature**: Faded kanji watermarks on cards, paper texture overlay, sparse crimson accents.

---

## Color System

```css
:root {
  /* Backgrounds — card bg must be noticeably lighter than base to create elevation without shadows */
  --bg-base: #ede8df; /* warm parchment — page background */
  --bg-card: #f5f1ea; /* lighter — card surface, visually "above" bg */
  --bg-card-active: #faf6ef; /* active/highlighted card */
  --bg-hero: #f2ede5; /* featured banner background */

  /* Text — all values chosen for sufficient contrast (≥4.5:1 on card bg for body text) */
  --text-primary: #1c1c1a; /* near-black, warm — WCAG AAA on all bg */
  --text-secondary: #5c5650; /* warm mid-gray — body text, descriptions, ≥4.5:1 on card bg */
  --text-tertiary: #8a8480; /* lighter — captions, meta, ≥3:1 on card bg */

  /* Accent */
  --accent: #b83232; /* muted crimson — the ONE color, use sparingly */
  --accent-light: #d4504a; /* slightly brighter variant */
  --accent-kanji: rgba(184, 50, 50, 0.15); /* faded kanji on inactive cards */
  --accent-kanji-active: rgba(
    184,
    50,
    50,
    0.5
  ); /* kanji on active/highlighted cards */

  /* Borders & Dividers */
  --border: #ddd7ce; /* barely-there card borders */
  --border-strong: #c8c0b5; /* section dividers, rule lines */
  --divider-accent: #b83232; /* red rule lines under section headers */
}
```

**Rules:**

- Red (`--accent`) appears on: active card kanji, active card borders, section rule lines, bullet diamonds, link underlines, quote marks, button outlines
- Never use red for large fills — accent only, always sparse
- All grays must have warm undertones (never cool/blue-gray)
- Card elevation comes ONLY from the lighter bg color — **never use box-shadow**
- Contrast: `--text-secondary` must be ≥4.5:1 on `--bg-card`; `--text-tertiary` must be ≥3:1

---

## Typography

```css
/* Import */
@import url('https://fonts.googleapis.com/css2?family=Aboreto&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&family=Jost:wght@300;400;500;600&family=Yuji+Syuku&display=swap');

:root {
  --font-display: 'Aboreto', Georgia, serif; /* page titles, card names */
  --font-body: 'Source Serif 4', Georgia, serif; /* body text, descriptions */
  --font-ui: 'Jost', system-ui, sans-serif; /* nav, labels, UI chrome */
  --font-japanese: 'Yuji Syuku', serif; /* kanji watermarks */
}
```

If any of these fonts are unavailable (e.g. in a React artifact without external imports), ask the user for the font files or find and apply suitable alternatives.

**Type Scale (base = 16px = 1rem):**

| Token         | Size                          | Usage                                                                    |
| ------------- | ----------------------------- | ------------------------------------------------------------------------ |
| `--text-base` | `1rem` (16px)                 | Body text, descriptions — **minimum for content**                        |
| `--text-sm`   | `0.875rem` (14px)             | Nav links, compact UI — **absolute minimum**                             |
| `--text-caps` | `0.75rem` (12px)              | **ONLY for all-caps labels** (section headers, card roles, pill buttons) |
| `--text-lg`   | `1.125rem` (18px)             | Slightly emphasized body                                                 |
| `--text-xl`   | `1.25rem` (20px)              | Panel headings                                                           |
| `--text-2xl`  | `1.5rem` (24px)               | Stat numbers, sub-titles                                                 |
| `--text-3xl`  | `clamp(1.75rem, 3vw, 2.5rem)` | Page titles                                                              |

**Minimum size rules:**

- No text smaller than 14px (0.875rem) anywhere
- All body and content text must be at least 16px (1rem)
- 12px (0.75rem) is ONLY allowed for uppercase/all-caps labels and section headers
- Page titles and large text scale from the 16px base using the tokens above

```css
:root {
  --text-base: 1rem;
  --text-sm: 0.875rem;
  --text-caps: 0.75rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: clamp(1.75rem, 3vw, 2.5rem);
}
```

```css
/* Page title (e.g. "CONTRIBUTORS") */
.page-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-primary);
}

/* Section label (e.g. "HEROES") — all-caps, so 12px is allowed */
.section-label {
  font-family: var(--font-ui);
  font-size: var(--text-caps);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-primary);
}

/* Contributor name */
.card-name {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 400;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  position: relative;
  z-index: 1;
}

/* Role / subtitle — all-caps, so 12px is allowed */
.card-role {
  font-family: var(--font-ui);
  font-size: var(--text-caps);
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  text-align: center;
  line-height: 1.5;
  margin-top: 0.25rem;
  position: relative;
  z-index: 1;
}

/* Body text */
.body-text {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.75;
  color: var(--text-secondary);
}
```

---

## Texture & Background

The paper texture is a **user-provided asset** — a PNG file with built-in alpha transparency. It must NOT be generated via SVG filters or CSS noise.

**IMPORTANT:** If the texture file is not already available in the project, ask the user for the "background paper texture" PNG file before applying it. The file is already semi-transparent — do NOT add opacity to the page-level texture.

The texture is applied at **two levels**:

### 1. Page-level texture (behind everything)

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('path/to/landing-bg.png');
  background-repeat: repeat;
  background-size: 400px auto;
  pointer-events: none;
  z-index: 1;
  /* No opacity — the PNG is already semi-transparent */
}
```

### 2. Card-level texture (on each elevated surface)

Cards and panels sit above the page texture (`z-index: 2`) and get their own texture overlay via `::after`:

```css
/* All elevated surfaces share this texture pattern */
.contributor-card,
.hero-card,
.testimonial,
.detail-panel,
.sidebar-card,
.stat-card {
  position: relative;
  z-index: 2;
}

.contributor-card::after,
.hero-card::after,
.testimonial::after,
.detail-panel::after,
.sidebar-card::after,
.stat-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('path/to/landing-bg.png');
  background-repeat: repeat;
  background-size: 400px auto;
  pointer-events: none;
  z-index: 0;
  opacity: 0.75; /* slightly softer on cards than on page bg */
}
```

**Z-index layering:**

- `body::before` (page texture): `z-index: 1`
- Cards/panels: `z-index: 2` (above page texture)
- Card `::after` (card texture): `z-index: 0` (within card stacking context, behind card content)
- Card inner content (text, kanji, etc.): `z-index: 1` (within card stacking context, above card texture)

All text and interactive elements inside textured containers must have `position: relative; z-index: 1` to sit above the card's `::after` texture.

---

## Card Component

The card is the core atom. It has a faded kanji watermark, name, and role.

```html
<div class="contributor-card" data-active="false">
  <span class="kanji-bg" aria-hidden="true">ア</span>
  <p class="card-name">Artem</p>
  <p class="card-role">Engineering lead<br />[2020 - 2022]</p>
</div>
```

```css
.contributor-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 1.5rem 1rem 1.25rem;
  min-height: 120px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
  /* NO box-shadow — elevation comes from bg color difference only */
}

.contributor-card:hover,
.contributor-card[data-active='true'] {
  border-color: var(--accent);
  background: var(--bg-card-active);
}

/* The kanji watermark */
.kanji-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-japanese), serif;
  font-size: 3.5rem;
  color: var(--accent-kanji);
  line-height: 1;
  user-select: none;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.contributor-card:hover .kanji-bg,
.contributor-card[data-active='true'] .kanji-bg {
  color: var(--accent-kanji-active);
}

/* Active state: name in red */
.contributor-card[data-active='true'] .card-name {
  color: var(--accent);
}
```

**Card Grid:**

```css
.cards-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0; /* no gap — cards share borders */
}

/* Cards share borders (collapse border trick) */
.contributor-card {
  margin: -0.5px; /* or use outline instead of border */
}

/* Responsive */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## Section Header Pattern

```html
<div class="section-header">
  <h2 class="section-label">Heroes</h2>
  <div class="section-rule"></div>
  <button class="pill-button">Currently Active</button>
</div>
```

```css
.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-rule {
  flex: 1;
  height: 1px;
  background: var(--border-strong);
}

.pill-button {
  font-family: var(--font-ui);
  font-size: var(--text-caps);
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid var(--border-strong);
  padding: 0.4rem 1rem;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s;
}

.pill-button:hover {
  border-color: var(--accent);
  color: var(--accent);
}
```

---

## Page Title with Diamond Bullets

```html
<div class="page-heading">
  <span class="diamond">◇</span>
  <h1 class="page-title">Contributors</h1>
  <span class="diamond">◇</span>
</div>
<p class="page-subtitle">This project is the result of...</p>
```

```css
.page-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.diamond {
  color: var(--accent);
  font-size: 1.5rem;
  line-height: 1;
}

.page-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-secondary);
  text-align: center;
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.75;
}
```

---

## Featured Hero / Slideshow Card

```html
<div class="hero-card">
  <button class="nav-arrow left">‹</button>
  <div class="hero-content">
    <h2 class="hero-name">Artem Alchangyan</h2>
    <div class="hero-meta">
      <div class="meta-row">
        <span class="meta-icon">✦</span>
        <span class="meta-label">Specialization</span>
      </div>
      <!-- more rows -->
    </div>
  </div>
  <span class="hero-kanji" aria-hidden="true">英雄</span>
  <button class="nav-arrow right">›</button>
</div>
```

```css
.hero-card {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  min-height: 240px;
  padding: 2.5rem 3.5rem;
  overflow: hidden;
}

.hero-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.hero-name {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 400;
  margin-bottom: 1.25rem;
  letter-spacing: 0.08em;
}

.meta-label {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.hero-kanji {
  position: absolute;
  right: 3rem;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-japanese);
  font-size: 8rem;
  color: var(--accent-kanji);
  user-select: none;
  line-height: 1;
  z-index: 1;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.75rem;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1;
}
.nav-arrow.left {
  left: 0.75rem;
}
.nav-arrow.right {
  right: 0.75rem;
}
```

---

## Navigation Bar

```css
.navbar {
  display: flex;
  align-items: center;
  padding: 0 2rem;
  height: 52px;
  background: var(--bg-base);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-logo {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--text-primary);
  margin-right: auto;
}

.nav-logo strong {
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 1.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}

.nav-link:hover,
.nav-link.active {
  color: var(--text-primary);
}
.nav-link.active {
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

---

## Quote / Testimonial Block

```html
<blockquote class="testimonial">
  <p class="testimonial-text">
    This is the first-of-its-kind, biggest library of nudging strategies based
    on cognitive biases.
  </p>
  <div class="testimonial-author">
    <div class="author-avatar">雅</div>
    <div>
      <p class="author-name">Dan Ariely</p>
      <p class="author-title">
        Professor of psychology and behavioral economics at Duke University
      </p>
    </div>
  </div>
</blockquote>
```

```css
.testimonial {
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 2rem 2rem 1.5rem;
  position: relative;
}

.testimonial::before {
  content: '\201C';
  font-family: var(--font-display);
  font-size: 2.5rem;
  color: var(--accent);
  line-height: 1;
  position: absolute;
  top: 0.75rem;
  left: 1.25rem;
  z-index: 1;
}

.testimonial-text {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.75;
  margin-top: 1rem;
  margin-left: 0.5rem;
  position: relative;
  z-index: 1;
}

.author-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-japanese);
  font-size: 1.25rem;
  color: var(--accent);
}

.author-name {
  font-family: var(--font-ui);
  font-size: var(--text-caps);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-primary);
}

.author-title {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  position: relative;
  z-index: 1;
}
```

---

## Red Accent Divider

Used before section headings like "UX Core", "Company Management":

```css
.accent-rule {
  width: 2.5rem;
  height: 2px;
  background: var(--accent);
  margin-bottom: 0.75rem;
}
```

---

## Layout Wrapper

```css
.page-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section {
  padding: 3.5rem 0;
}

.section + .section {
  padding-top: 0;
}
```

---

## Kanji Reference

Common kanji used as card watermarks (romanized names → katakana):

- A → ア　　I → イ　　U → ウ
- Ka → カ　　Ki → キ　　Ku → ク
- Sa → サ　　Si/Shi → シ　　Su → ス
- Ta → タ　　Chi → チ　　To → ト
- Na → ナ　　Ni → ニ　　Nu → ヌ
- Ha → ハ　　Hi → ヒ　　He → ヘ
- Ma → マ　　Mi → ミ　　Mo → モ
- Ya → ヤ　　Yu → ユ　　Yo → ヨ
- Ra → ラ　　Ri → リ　　Ru → ル　　Re → レ
- Wa → ワ　　Wo → ヲ　　N → ン

For compound names, use the first 1-2 characters of the name in katakana.

For Japanese font, load from Google Fonts:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Yuji+Syuku&display=swap"
  rel="stylesheet"
/>
```

---

## Do / Don't

| ✅ Do                                                             | ❌ Don't                                   |
| ----------------------------------------------------------------- | ------------------------------------------ |
| Warm off-white backgrounds                                        | Pure white (#fff) backgrounds              |
| Sparse red accents (borders, rules, kanji)                        | Red fills, red backgrounds                 |
| Wide letter-spacing on uppercase labels                           | Tight tracking on headings                 |
| Serif for display text (Aboreto), serif for body (Source Serif 4) | Sans-serif for everything                  |
| Faded kanji watermarks on cards (Yuji Syuku)                      | Decorative elements without the paper feel |
| Barely-there borders, no shadows                                  | Heavy drop shadows or box-shadow           |
| Paper texture overlay (user-provided PNG)                         | SVG noise filters or CSS-only grain        |
| Minimalist nav with small text                                    | Heavy navbar with dark background          |
| Body text ≥ 16px, minimum 14px anywhere                           | Text smaller than 14px                     |
| 12px only for all-caps labels                                     | 12px for body or mixed-case text           |
| Card bg lighter than page bg for elevation                        | Shadows to create depth                    |
| Card texture at 0.75 opacity                                      | Same opacity as page texture               |
| Ask user for texture file if not available                        | Generate texture procedurally              |

---

## Quick Start Template

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Aboreto&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&family=Jost:wght@300;400;500;600&family=Yuji+Syuku&display=swap"
      rel="stylesheet"
    />
    <style>
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      :root {
        --bg-base: #ede8df;
        --bg-card: #f5f1ea;
        --bg-card-active: #faf6ef;
        --text-primary: #1c1c1a;
        --text-secondary: #5c5650;
        --text-tertiary: #8a8480;
        --accent: #b83232;
        --accent-kanji: rgba(184, 50, 50, 0.15);
        --accent-kanji-active: rgba(184, 50, 50, 0.5);
        --border: #ddd7ce;
        --border-strong: #c8c0b5;
        --font-display: 'Aboreto', Georgia, serif;
        --font-body: 'Source Serif 4', Georgia, serif;
        --font-ui: 'Jost', system-ui, sans-serif;
        --font-japanese: 'Yuji Syuku', serif;
        --text-base: 1rem;
        --text-sm: 0.875rem;
        --text-caps: 0.75rem;
        --text-lg: 1.125rem;
        --text-xl: 1.25rem;
        --text-2xl: 1.5rem;
        --text-3xl: clamp(1.75rem, 3vw, 2.5rem);
      }

      html {
        font-size: 16px;
      }

      body {
        background-color: var(--bg-base);
        font-family: var(--font-body);
        color: var(--text-primary);
        min-height: 100vh;
        line-height: 1.7;
      }

      /* Page-level texture — ask user for "background paper texture" PNG if not available */
      body::before {
        content: '';
        position: fixed;
        inset: 0;
        background-image: url('path/to/landing-bg.png');
        background-repeat: repeat;
        background-size: 400px auto;
        pointer-events: none;
        z-index: 1;
      }

      .page-wrapper {
        max-width: 960px;
        margin: 0 auto;
        padding: 0 2rem;
      }
    </style>
  </head>
  <body>
    <!-- Your keepsimple-styled content here -->
    <!-- Remember: all cards/panels need position:relative; z-index:2 -->
    <!-- and their ::after pseudo-element for the card-level texture at opacity: 0.75 -->
  </body>
</html>
```

---

## Technical Rules

Rules extracted from the actual codebase. Nothing here is about visual design — see the sections above for that.

### Stack & Versions

- Next.js 15.0.5 — Pages Router (`src/pages/`)
- React 19.0.3
- TypeScript 5.2.2
- Styling: SCSS Modules (`sass` 1.32.8)
- `classnames` 2.3.1 — used in nearly every component for conditional class joining
- `next-auth` 4.23.2 — authentication
- i18n: Next.js built-in (`en`, `ru`, `hy` locales, configured in `next.config.js`)
- `date-fns` 2.30.0
- `@svgr/webpack` 8.1.0 — SVGs imported as React components
- `eslint-plugin-simple-import-sort` — enforced import ordering
- `prettier` 3.6.2 — single quotes, trailing commas, 2-space indent, no parens on single-arg arrows
- `husky` 9.1.7 + `lint-staged` — pre-commit hooks run ESLint and Prettier

### Project Directory Map

```
src/
├── api/              # Data-fetching functions (Strapi, auth, etc.)
├── assets/icons/     # SVG icon components (.tsx) and raw .svg files
├── components/       # Shared UI components (PascalCase folders)
├── constants/        # App-wide constants (lowercase files)
├── context/          # React context providers
├── data/             # Static i18n copy, organized by feature
├── hooks/            # Custom React hooks (use*.ts files)
├── layouts/          # Page-level layout components (PascalCase folders)
├── lib/              # Utility/helper functions
├── local-types/      # Shared TypeScript types
├── pages/            # Next.js Pages Router (file-based routing)
├── styles/           # Global SCSS (variables, animations, fonts, globals)
└── utils/            # Additional utility functions
```

**How pages, layouts, and components connect:**

A page file in `src/pages/` fetches data (via `getServerSideProps`), then renders a layout from `src/layouts/`. The layout composes components from `src/components/`.

```tsx
// src/pages/contributors.tsx
import ContributorsLayout from '@layouts/ContributorsLayout';

const Contributors: FC<ContributorLocaleData> = ({ contributors }) => {
  // ...
  return (
    <>
      <SeoGenerator ... />
      <ContributorsLayout contributorsData={data} isDarkTheme={isDarkTheme} />
    </>
  );
};

export default Contributors;

export async function getServerSideProps({ locale }) {
  const contributors = await getContributors(locale);
  return { props: { contributors } };
}
```

There is also a root `Layout` component at `src/layouts/Layout.tsx` that wraps all pages (rendered in `_app.tsx`). It provides the `Header`, cookie box, and longevity-specific chrome.

### Folder Structure for a New Component

Components live in `src/components/`. Each component gets a PascalCase folder. The folder name matches the component name.

**Standard files in a component folder:**

1. **`ComponentName.tsx`** — the component itself.

```tsx
// src/components/Spinner/Spinner.tsx
import type { FC } from 'react';

import useSpinner from '@hooks/useSpinner';

import styles from './Spinner.module.scss';

type SpinnerProps = {
  visible?: boolean;
};

const Spinner: FC<SpinnerProps> = ({ visible }) => {
  const { isVisible } = useSpinner()[1];
  if (!isVisible && !visible) return null;

  return (
    <div className={styles.PreloaderContainer}>
      <div className={styles.Preloader}>{/* ... */}</div>
    </div>
  );
};

export default Spinner;
```

2. **`ComponentName.module.scss`** — scoped styles for the component.

```scss
// src/components/Spinner/Spinner.module.scss
.PreloaderContainer {
  position: fixed;
  // ...

  & .Preloader {
    display: inline-block;
    // ...
  }
}
```

3. **`index.ts`** — barrel re-export. Always a default re-export. Every component in the repo follows this pattern.

```ts
// src/components/Spinner/index.ts
import Spinner from './Spinner';

export default Spinner;
```

4. **`ComponentName.types.ts`** (optional) — used when the props type is large or shared. Most components define props inline in the `.tsx` file. Use a separate types file when the type is complex (10+ fields) or imported elsewhere.

```ts
// src/components/Heading/Heading.types.ts
import { ReactNode } from 'react';

export type HeadingProps = {
  text: string | ReactNode;
  showLeftIcon?: boolean;
  // ...
};
```

**Sub-component folders** are nested inside their parent: `src/components/longevity/FlipCard/`, `src/components/contributors/Contributor/`. Feature-scoped components use a lowercase feature-name subfolder.

### Folder Structure for a New Layout

Layouts live in `src/layouts/`. They follow the same PascalCase folder convention as components. A layout is a page-level composition — it receives data from a page and arranges components.

**Standard files in a layout folder:**

1. **`LayoutName.tsx`** — the layout component.

```tsx
// src/layouts/ContributorsLayout/ContributorsLayout.tsx
import { forwardRef } from 'react';

import Heading from '@components/Heading';

import type { ContributorsLayoutProps } from './ContributorsLayout.types';

import styles from './ContributorsLayout.module.scss';

const ContributorsLayout = forwardRef<HTMLElement, ContributorsLayoutProps>(
  ({ contributorsData, isDarkTheme }, ref) => {
    // ...
  },
);

export default ContributorsLayout;
```

2. **`LayoutName.module.scss`** — scoped styles.

3. **`index.ts`** — barrel re-export (same pattern as components).

```ts
// src/layouts/ContributorsLayout/index.ts
import ContributorsLayout from './ContributorsLayout';

export default ContributorsLayout;
```

4. **`LayoutName.types.ts`** — props type. Most layouts use a separate types file because layout props tend to be large (page data shapes).

```ts
// src/layouts/ContributorsLayout/ContributorsLayout.types.ts
export type ContributorsLayoutProps = {
  isDarkTheme?: boolean;
  contributorsData?: {
    /* ... */
  };
};
```

Import layouts in pages via `@layouts/LayoutName`.

### Folder Structure for i18n Data

Static UI copy lives in `src/data/`. Each feature gets a lowercase folder with one file per locale plus an `index.ts` barrel.

```
src/data/contributors/
├── en.ts       # English strings
├── ru.ts       # Russian strings
├── hy.ts       # Armenian strings
└── index.ts    # Barrel that combines all locales
```

```ts
// src/data/contributors/en.ts
const en = {
  contributorsTxt: 'contributors',
  activeHeroes: 'Currently active',
  heroes: 'Heroes',
  socialLinkTxt: 'Social Link',
};
export default en;
```

```ts
// src/data/contributors/index.ts
import en from './en';
import hy from './hy';
import ru from './ru';

export default { en, ru, hy } as {
  en: typeof en;
  ru: typeof ru;
  hy: typeof hy;
};
```

Usage in components: `import contributors from '@data/contributors';` then access `contributors[locale]`.

### Other Folders

- **`src/api/`** — data-fetching functions. One file per domain (`contributors.ts`, `strapi.ts`, `auth.ts`, `tools.ts`). Lowercase filenames. No folders.
- **`src/hooks/`** — custom hooks. One hook per file. Filename matches hook name (`useSpinner.ts`, `useMobile.ts`). No subfolders.
- **`src/constants/`** — app-wide constants. Lowercase filenames (`common.ts`, `longevity.ts`, `tools.ts`). Named exports.
- **`src/lib/`** — utility/helper functions (`helpers.ts`, `cookies.ts`, `strapiUrl.ts`, `schema.tsx`). Lowercase filenames. No subfolders.
- **`src/utils/`** — additional utilities. Same conventions as `lib/`.
- **`src/context/`** — React context providers (`LongevityContext.tsx`). PascalCase filenames.
- **`src/local-types/`** — shared TypeScript types. Has a `pageTypes/` subfolder for page-specific types. Lowercase filenames (`global.ts`, `data.ts`).
- **`src/styles/`** — global SCSS. Contains `globals.scss`, `fonts.scss`, `_variables.scss`, `_animations.scss`, and page-level module files. Partials prefixed with `_`.
- **`src/assets/icons/`** — icon components as `.tsx` files (PascalCase: `GoogleIcon.tsx`, `Loader.tsx`) and raw `.svg` files. Has a `longevity/` subfolder. Imported via `@icons/*`.

### Naming Conventions

- **Component names**: PascalCase. `Accordion`, `Button`, `FlipCard`.
- **File names**: PascalCase, matching the component. `Accordion.tsx`, `Accordion.module.scss`.
- **Folder names**: PascalCase for component folders (`Button/`, `Modal/`). Lowercase for feature groupings (`longevity/`, `contributors/`, `tools/`). Prefix with underscore for page-specific groups (`_company-management/`).
- **SCSS class names**: The codebase mixes PascalCase (`.PreloaderContainer`, `.Accordion`, `.Title`) and camelCase (`.headingWrapper`, `.button`). Prefer PascalCase for new code — it's the more common pattern.
- **TypeScript types**: The codebase mixes `T`-prefix (`TButton`, `TInput`, `TRouter`) and `Props`-suffix (`SpinnerProps`, `AccordionProps`, `ModalProps`, `HeadingProps`). Prefer `ComponentNameProps` for new component prop types.
- **Interfaces**: Used sparingly. No `I` prefix. See `ActionsType` in `src/local-types/global.ts`.
- **Hooks**: `use*` prefix. Files live in `src/hooks/`. Examples: `useSpinner`, `useMobile`, `useClickOutside`, `useScreenSize`.
- **Constants**: Files in `src/constants/`. Named exports. Filenames are lowercase (`common.ts`, `longevity.ts`, `tools.ts`).
- **Event handlers**: `handle*` prefix inside components. Examples: `handleChange`, `handleClose`, `handleMouseEnter`, `handleKeyDown`.
- **Boolean props**: `is*`, `has*`, `show*`. Examples: `isOpen`, `isDarkTheme`, `isHovered`, `hasBorder`, `hasRedUnderline`, `showLeftIcon`, `showMessage`.

### Component Rules

- Function components only. No class components anywhere in the codebase.
- Every component uses `const ComponentName: FC<Props>` and `export default ComponentName`.
- Every `index.ts` does a default re-export: `import X from './X'; export default X;`.
- Props are typed inline in the `.tsx` file unless they're large — then use `ComponentName.types.ts`.
- Hooks live in `src/hooks/`, not inside component files.
- SCSS modules are imported as `styles` and accessed as `styles.ClassName` (e.g., `styles.PreloaderContainer`).
- Conditional classes use `classnames` (imported as `cn`): `cn(styles.Foo, { [styles.active]: isActive })`.
- `@svgr/webpack` is configured — SVGs can be imported as components from `@icons/*`.

### TypeScript Rules

- Strict mode is **off** (`"strict": false` in `tsconfig.json`).
- `noImplicitAny` is **off**.
- `any` is allowed — ESLint rule `@typescript-eslint/no-explicit-any` is set to `off`.
- `@ts-ignore` is allowed (ESLint warns on `@ts-expect-error` but allows `@ts-ignore`).
- `noUnusedLocals` is **on**.
- Props types are named `ComponentNameProps` (preferred) or `TComponentName` (legacy).
- Shared types live in `src/local-types/` (aliased as `@local-types/*`).

### Imports

Import order is enforced by `eslint-plugin-simple-import-sort`. The configured group order:

1. Side-effect imports (`import 'foo'`)
2. Node built-ins (`node:url`)
3. Third-party packages (`react`, `next`, `classnames`)
4. `@styles/*`
5. `@constants/*`
6. `@local-types/*`
7. `@hooks/*`
8. `@lib/*`
9. `@api/*`
10. `@data/*`
11. `@icons/*`
12. `@components/*`
13. `@layouts/*`
14. Other `@/` or `src/` aliases
15. Relative imports (non-style)
16. Style imports (`.css`, `.scss`)

**Path aliases** (from `tsconfig.json`):

- `@components/*` → `src/components/*`
- `@data/*` → `src/data/*`
- `@constants/*` → `src/constants/*`
- `@hooks/*` → `src/hooks/*`
- `@layouts/*` → `src/layouts/*`
- `@lib/*` → `src/lib/*`
- `@api/*` → `src/api/*`
- `@styles/*` → `src/styles/*`
- `@local-types/*` → `src/local-types/*`
- `@utils/*` → `src/utils/*`
- `@icons/*` → `src/assets/icons/*`

Use aliases for cross-folder imports. Use relative imports only within the same component folder (e.g., `./Button.module.scss`, `./Heading.types`).

### What NOT to Do

- Don't use styled-components, Emotion, or Tailwind — the project uses SCSS Modules exclusively.
- Don't use named exports in `index.ts` — every barrel file uses `export default`.
- Don't put new shared components outside `src/components/`.
- Don't put hooks outside `src/hooks/`.
- Don't put shared types outside `src/local-types/`.
- Don't import directly from a component's `.tsx` file across folders — go through the `index.ts` barrel.
- Don't use the App Router — the project uses the Pages Router (`src/pages/`).
- Don't skip the `index.ts` barrel file when creating a new component.
- Don't add new dependencies without checking `package.json` first — the project has a specific set of vetted libraries.
