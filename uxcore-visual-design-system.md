---
name: UXCore Design System
description: Build UI components and pages that match the UXCore visual identity — covers typography, colors, spacing, components, motion, and do/don't rules for UXCore, UXCG, UXCP, and UXCat.
---

# Workflow

When triggered, follow these steps:

1. **Read this file fully** before generating any code. Internalize the design tokens, component specs, and do/don't rules.
2. **Identify which visual scope applies** — is this for the shared platform style (UXCore/UXCG/UXCP) or for UXCat? This determines accent colors, heading weights, and animation behavior (see Section 10b).
3. **Build the component or page** using the exact values from this spec — font sizes, colors, spacing, border-radius, shadows, and easing curves. Do not approximate or substitute.
4. **Check against Section 11 (Do / Don't Rules)** before finalizing. These rules override any instinct to add gradients, pill buttons, glassmorphism, or decorative elements.
5. **Reference `AGENTS.md`** at the repo root for code-structure rules (component pattern, file layout, prop typing, etc.) whenever you write or modify actual code files.

# UXCore Visual Design System

> A standalone design specification for building interfaces that match the UXCore visual identity (keepsimple.io). No codebase access needed — every value is resolved and every component described well enough to implement from scratch in any tech stack.
>
> **Two visual scopes:**
>
> - **Sections 1–10** describe the **shared platform style** used across UXCore (bias explorer), UXCG (UX Case Generator), and UXCP (UX Companion Personas). These three tools share the same typography, colors, layout, and component styles.
> - **Section 10b** describes **UXCat-specific styling** — the quiz/gamification tool that has its own distinct visual personality built on top of the shared foundation.
>
> Section 11 (Do / Don't Rules) and Tone left as `____` for manual completion.

---

## Design Philosophy

The platform has **two visual modes** that share a common foundation but serve different moods.

**The core platform (UXCore, UXCG, UXCP)** is quiet, structured, and informational. It presents dense educational content — cognitive biases, UX questions, persona-driven analysis — without competing with that content for attention. The palette is desaturated and cool, anchored by a muted steel-blue and generous white space. Typography is deliberately lightweight for headings (thin Red Hat Display) and utilitarian for body text (Lato), letting the content hierarchy do the work rather than visual flair. Interactions are subtle: cards lift a few pixels on hover, borders shift color to confirm focus, and the navigation pill slides between tabs with a smooth, physical-feeling ease. The overall impression should be a well-organized reference tool — closer to a thoughtfully designed textbook than a marketing landing page.

**UXCat (the quiz tool)** inherits the same layout grid, font stack, and color tokens, but layers on a warmer, more energetic personality. Orange replaces steel-blue as the accent for headings and CTAs. Content appears through staggered fade-in sequences. A progress-and-reward system adds gamification elements — achievement badges with gold glow effects, animated leaderboards, and a branded brain-spinner loading animation. UXCat feels like taking a well-designed exam in a serious but encouraging environment.

---

## 1. Typography

### Fonts

- **Primary font (body text):** Lato (fallback: Arial, serif). A clean, humanist sans-serif used for all body copy, buttons, labels, and UI chrome across every tool.
- **Heading font (page and section titles):** Red Hat Display (fallback: sans-serif). Used at light weight for a refined, modern feel on page titles — shared by UXCore, UXCG, UXCP, and UXCat.
- **Monospace font (bias number labels, meta tags):** IBM Plex Mono (fallback: sans-serif). Used for small uppercase category labels on bias detail views — gives a technical, cataloging feel.
- **Font loading:** Self-hosted via `@font-face` with `font-display: swap` for Lato and `font-display: optional` for secondary fonts. Not loaded from Google Fonts CDN.
- **Special-purpose fonts:**
  - Noto Sans Armenian (sans-serif fallback) — full locale override for Armenian language, applied globally when locale is `hy`
  - Source Serif 4 (Regular/Bold/SemiBold) — article and long-form content layouts
  - Cormorant Garamond (Regular/Medium) — article layouts, Russian locale variant
  - Aboreto — article titles (decorative)
  - See [Section 10b (UXCat)](#10b-uxcat-specific-styles) for additional fonts used only in the quiz/gamification context.

### Type Scale

| Role                    | Size    | Weight      | Line-height | Notes                                                                                                   |
| ----------------------- | ------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| Page title (h1)         | 36px    | 300 (light) | default     | Intentionally thin — lets the content breathe. Drops to 24px / weight 600 on mobile (≤800px).           |
| Section heading (h2)    | 24px    | 600–800     | ~28.8px     | Used for quiz questions and result titles. Weight 800 for maximum-emphasis question text.               |
| Subsection heading (h3) | 18–20px | 400–700     | ~25.6px     | 20px for mottos and API section headers; 18px for quiz sub-questions (weight 700).                      |
| Body text               | 16px    | 400         | 150% (24px) | Standard body copy. Some contexts use 140% line-height. Drops to 14px at ≤1440px on data-dense screens. |
| Small / caption text    | 12px    | 400–600     | default     | Used for axis labels, search result hints, and small meta labels. Weight 600 for emphasized labels.     |
| Label / tag text        | 14px    | 400         | ~17px       | Buttons, filter controls, nav items, tooltip content, sidebar descriptors.                              |
| Navigation links        | 14px    | 400         | default     | Always uppercase.                                                                                       |

### Text Rules

- **Letter spacing on headings:** -0.01em on bias detail modal titles (a very subtle tightening).
- **Uppercase (`text-transform: uppercase`)** is used on: navigation items, bias number labels in detail modals, section headers, view switcher controls, panel headers, and completion bar labels. It signals "system chrome" vs. content.
- **Max line width for readability:** Content containers are capped at 900px. This keeps body text to a comfortable ~75-character line length at 16px.

---

## 2. Colors

### Brand / Primary

- **Primary brand color:** `#28587b` — a muted steel-blue. The dominant accent across UXCore, UXCG, and UXCP. Used for primary buttons, link text, page headings, active filter states, and interactive affordances.
- **Primary hover state:** `#28587b` (no lightening — primary buttons don't shift color on hover; the interaction feedback comes from border changes on outline variants).
- **Primary active/pressed:** `#28587b` (used as background on active filter buttons with white text).

### Secondary Accent Colors

- **Secondary blue:** `#5b88bd` — a lighter, softer blue. Used for active-state borders (selected answers, active product tabs), interactive link text in modals, active toggle controls, checkboxes, and radio-style selections. This is the "something is selected/active" color — shared across all tools.
- **Orange accent:** `#de915b` — warm terracotta orange. Used for call-to-action buttons (start actions, submit). In UXCat, this is the dominant accent for titles and primary CTAs (see Section 10b).
- **Orange hover:** `#cd7232` — deeper, toasted orange. Orange buttons darken on hover rather than lighten.
- **Purple accent:** `#a36aa4` — muted plum. Used sparingly for secondary feature tooltips, tab decorations, date stamps, and highlight actions.

### Backgrounds

- **Page background (global):** `linear-gradient(180deg, #f9fafb 0%, #e8e8e8 100%)` with fallback `#f9fafb` — a very subtle warm-to-cool gray gradient from top to bottom. The page never feels stark white.
- **Page background (tool pages):** `#fafafa` — a flat, near-white gray used as the canvas for all main tool interfaces across UXCore, UXCG, UXCP, and UXCat.
- **Card / content block background:** `#fff` — pure white. Cards sit on the `#fafafa` canvas, creating a very gentle lift even before shadows.
- **Card hover background:** No background change on hover — hover feedback is handled through shadow deepening and subtle vertical movement.
- **Modal / overlay backdrop:** `rgba(0, 0, 0, 0.35)` — a light dim, not a heavy blackout. Content behind the modal remains partially visible.
- **Spinner / loading overlay:** `rgba(0, 0, 0, 0.6)` — darker than modal backdrops to fully focus attention on the loading indicator.
- **Header background:** `#fff` (white, with a subtle bottom shadow to separate from content).
- **Hover highlight (UI chrome):** `#f1f1f1` — used for nav item hover states, dropdown item highlights, and user menu hover. A barely-there gray tint.

### Text

- **Primary text:** `#252626` — near-black with just enough warmth to avoid harshness. Some components also use pure `#000`.
- **Secondary / muted text:** `#9e9e9e` — medium gray for subtitles, mottos, short descriptions, and secondary labels. Also `rgba(0, 0, 0, 0.65)` (a 65% black) for slightly more prominent secondary text on sidebar labels.
- **Disabled text:** `#c4c4c4` — light gray signaling non-interactive or inactive elements.
- **Link color (default):** `#28587b` (primary blue, same as brand); some secondary links use `#5b88bd` (lighter blue).
- **Link color (hover):** An underline appears on hover (no color change). Underline-on-hover is the standard link interaction pattern.
- **Link color (visited):** Not styled — visited links look identical to unvisited links.

### Borders & Dividers

- **Default border:** `1px solid #d9d9d9` — a light, neutral gray. Used on buttons, separators, section dividers, and card outlines.
- **Divider / separator:** `#d9d9d9` is the primary separator color; `#c4c4c4` (slightly darker gray) appears on secondary dividers like header section separators.
- **Input border:** `1px solid #cbcbcb` — marginally darker than the general border color, giving form fields a bit more definition.
- **Input border on focus:** `#6d6d6d` — a medium-dark gray. Notably, focus does _not_ use the brand blue — it uses a neutral dark gray, keeping the field feeling calm rather than highlighted.

### Status / Feedback

- **Error / danger:** `red` (plain CSS red, used for form validation messages).
- **Success:** `#4caf50` (Material-style green for checkmarks); `#2db675` (progress bar fill); `#77a34b` / `#42c256` (glowing tooltip accents).
- **Warning:** Not used in the current design system.
- **Info:** Not used in the current design system.

### UXCG Stage Colors

Each UX Case Generator stage has a distinct color identity, used for icon strokes and category swatches:

| Stage         | Default stroke           | Selected stroke         | Swatch background      |
| ------------- | ------------------------ | ----------------------- | ---------------------- |
| Team Assembly | `#6087ab` (steel blue)   | `#6087ab`               | `#bbe4f2` (light sky)  |
| Development   | `#186930` (forest green) | `#669e77` (sage)        | `#c5eadd` (mint)       |
| Marketing/BD  | `#9e4579` (berry)        | `#e5ccee` (lavender)    | `#dbcad1` (dusty rose) |
| Released      | `#c3a70c` (dark gold)    | `#fff2ae` (pale yellow) | —                      |
| Monitoring    | `#ff7300` (vivid orange) | `#ffd9b9` (peach)       | —                      |

### Bias Category Colors

The four cognitive bias categories each have a background tint and border/accent color. Used across UXCore (bias explorer), UXCG (case connections), and UXCP (persona analysis):

| Category                 | Background              | Border/accent            | Label text               |
| ------------------------ | ----------------------- | ------------------------ | ------------------------ |
| Too much information     | `#c7ebf8` (ice blue)    | `#4c8cc1` (ocean blue)   | `#4c8cc1`                |
| Not enough meaning       | `#c5eadd` (soft mint)   | `#75b3b3` (teal)         | `#75b3b3`                |
| Need to act fast         | `#e9dfe3` (blush gray)  | `#80739b` (dusty purple) | `#573e48` (wine)         |
| What should we remember? | `#e9e6ff` (pale violet) | `#8073ff` (indigo)       | `#5c578d` (slate violet) |

Note: These are intentionally pastel and desaturated — they color-code without screaming.

### UXCP Priority Colors

Priority levels (high/medium/low) are distinguished by icon shape, not by color. The active filter button uses the primary brand color (`#28587b` background, white text) regardless of which priority level is selected.

---

## 3. Spacing

### Base Unit

No formal spacing token system. Values cluster around **multiples of 4px and 8px**, which is the effective base grid. This applies uniformly across UXCore, UXCG, UXCP, and UXCat.

### Common Values

| Token | Value | Typical use                                                         |
| ----- | ----- | ------------------------------------------------------------------- |
| XS    | 4px   | Tight gaps between inline elements, small margins                   |
| SM    | 8px   | Standard gaps in flex containers, icon spacing, small padding       |
| MD    | 16px  | Mobile page padding, vertical section spacing, common inner padding |
| LG    | 24px  | Section vertical gaps, content area spacing                         |
| XL    | 32px  | Major section breaks, button group top margins                      |
| 2XL   | 48px  | Large section bottom margins, content-to-loader spacing             |

Intermediate values also appear: 10px (input inner padding), 14px (filter bar padding), 20px (modal body padding), 28px (modal side padding).

### Page Layout

- **Max content width:** 900px for all standard content pages across every tool (question lists, persona builders, quiz views, API docs, user profiles). The bias explorer (folder/tree view) in UXCore uses a wider 1360px max-width.
- **Page horizontal padding (desktop):** Content is centered via auto margins with `max-width: 100%`, so there is no fixed side padding — the 900px cap and centering handle it.
- **Page horizontal padding (mobile):** 16px on each side (≤800px). Some screens use 8px side margins or 20px padding at narrow widths.
- **Content top margin from header:** 94px on desktop (accounts for the 46px fixed header plus breathing room). Reduces to 28–35px on mobile where the header is no longer fixed.

---

## 4. Breakpoints

| Name    | Value             | Role                                                                   |
| ------- | ----------------- | ---------------------------------------------------------------------- |
| Mobile  | ≤800px            | Primary mobile layout switch                                           |
| Tablet  | ≤1010px           | Intermediate adjustments; desktop navigation collapses                 |
| Desktop | ≤1440px           | Font-size scaling (16px → 14px on dense screens)                       |
| Wide    | ≥2500px / ≥3500px | Large-display scaling (headings and body text grow via viewport units) |

### What Changes at Each Breakpoint

- **At mobile (≤800px):** Desktop horizontal navigation disappears, replaced by a tool-name dropdown (PageSwitcher). Content gets 16px side padding. Page titles shrink from 36px light to 24px semibold — the weight increase compensates for the smaller size to maintain hierarchy. Subtitles drop from 18px to 16px. Content stacks vertically. Search inputs lose their border-radius (become flat-edged to span full width).
- **At tablet (≤1010px):** Top content margin shrinks from 94px to ~28–35px. Multi-column layouts (like the bias folder view) collapse to single column. Navigation header simplifies.
- **At desktop (≤1440px):** A density pass — body text, labels, and controls scale from 16px to 14px in data-heavy components (inputs, filter bars, test results, API docs). This fits more content without scrolling on standard laptops.
- **At wide (≥2500px / ≥3500px):** The bias explorer and its labels scale up using viewport-relative units (e.g., headings grow to ~4vh, descriptions to ~1.5vh) so the interface doesn't feel tiny on ultrawide or 4K displays.

---

## 5. Component Styles

### Cards

Cards are the primary content containers across all tools — used for bias detail boxes, UXCG case question wrappers, UXCP persona result sections, and general info panels.

**At rest:**

- Background: `#fff` (white, sitting on the `#fafafa` page canvas).
- Border radius: 8px for standalone content cards; 4px for inline interactive cards and smaller elements.
- Border: most cards rely on shadow alone (no visible border); some section cards use `1px solid #d9d9d9`.
- Shadow (resting): `0px 2px 8px rgba(0, 0, 0, 0.05)` — barely visible, just enough to lift the card off the background.
- Shadow (elevated/prominent): A multi-layered progressive shadow for high-importance cards: `0px 8px 17px rgba(0, 0, 0, 0.05), 0px 30px 30px rgba(0, 0, 0, 0.04), 0px 68px 41px rgba(0, 0, 0, 0.03), 0px 122px 49px rgba(0, 0, 0, 0.01), 0px 190px 53px rgba(0, 0, 0, 0)`. This creates a realistic, diffused paper-floating effect.
- Padding: 15px vertical, 20px horizontal (standard); 10px top/bottom, 16px left / 32px right (answer cards with action space).

**On hover (interactive cards):**

- Cards lift slightly — 8px upward shift with a smooth spring-like ease (`transform: translateY(-8px)`, `transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1)`). The cubic-bezier gives a slight overshoot that feels physical.
- No background color change on hover — the movement and shadow shift are the only feedback.

**Selected state:**

- Border becomes `2px solid #5b88bd` (secondary blue).
- A very faint blue wash appears: `rgba(147, 183, 255, 0.2)` background.

**Grid spacing:**

- Gaps between cards: 13px (category tag grids in UXCG); 3px (dense bias lists in UXCore explorer view).

### Buttons

Buttons come in several variants, all compact and understated — they don't shout. Shared across every tool.

**Default (outline) button:**

- Background: `#fff`. Text: `#000`. Border: `1px solid #d9d9d9`. Border-radius: 2px (very slightly rounded — nearly square). Padding: 6px 16px. Height: 32px. Font-size: 14px (inherited from label text scale).
- On hover: border shifts to `#28587b` and text shifts to `#28587b` — the button "activates" with the brand color. Transition: 200ms all properties.
- When disabled: `cursor: not-allowed`, no hover effect.

**Primary (filled) button:**

- Background: `#28587b` (brand blue). Text: `#fff`. Border: `1px solid #d9d9d9`. Border-radius: 2px. Same sizing as default.
- On hover: no visible change (already in its active color). The primary button is always "on."

**Secondary (outline, softer) button:**

- Background: `#fff`. Text: `rgba(0, 0, 0, 0.65)` (muted). Border: `1px solid #d9d9d9`. Border-radius: 4px (slightly more rounded than default). Padding: 8px 18px.

**Orange (CTA) button:**

- Background: `#de915b` (terracotta). Text: `#fff`. On hover: darkens to `#cd7232`. A warm, attention-drawing variant for start/submit actions.

**Orange outline button:**

- Background: `#fff`. Text/border: `#de915b`. On hover: fills to `#cd7232` background with white text — a smooth inversion.

**Blue outline button:**

- Background: `#fff`. Text/border: `#28587b`. On hover: fills to `#28587b` background with white text.

**Big button variant:**

- Height: 54px (45px on mobile). Used for major actions.

**Disabled state:**

- Background: `#d9d9d9`. Text: `#c4c4c4`. `cursor: not-allowed`. No hover effect.

**Loading state:**

- An inline spinner appears inside the button (CSS rotation: 360deg, 500ms, infinite, linear).

**Transition:** All button properties animate at 200ms ease.

### Input Fields

Clean, minimal form inputs used across all tools.

**At rest:**

- Height: 32px minimum. Background: `#fff`. Border: `1px solid #cbcbcb`. Border-radius: 4px. Padding: 6px 10px. Font-size: 16px.
- Placeholder text: `#ababab` (light gray, clearly secondary).

**On focus:**

- Border darkens to `#6d6d6d` (a calm, neutral dark gray — not the brand blue). Outline removed. Any associated icon also shifts to `#6d6d6d`.
- This neutral focus state is deliberate: it confirms the field is active without creating a "selected" feeling that might conflict with validation states.

**With icon:**

- Right padding increases to 34px to make room for an inline icon (search, clear, etc.).

**Error state:**

- Error message appears below the field in `red`, 12px font, with a 200ms slide-in transition.

**Responsive:**

- Font-size drops to 14px at ≤1440px on dense screens.

### Tags / Badges / Chips

Small, pill-like labels used across tools — categorizing biases in UXCore, marking UXCG stages, and labeling UXCP relevance.

- Border-radius: 2px (very subtly rounded — almost rectangular, not pill-shaped).
- Padding: 3px 17px (generous horizontal padding for readability).
- Font-size: 12px (default) or 14px (large variant, 32px height).
- Text color: `#fff` (always white — the background color carries the category meaning).
- Background: set per-category from the Bias Category Colors or UXCG Stage Colors tables (section 2). No default background — always determined by semantic context.
- Border: none.

### Toggles / Switches

A two-button segmented control (not a sliding iOS-style toggle). Used for binary choices like Yes/No in the UXCP persona builder.

- Two buttons sit side by side, sharing a border. Left button has `border-radius: 4px 0 0 4px`, right has `0 4px 4px 0`.
- Each button: width 60px, font-size 14px.
- **Inactive:** white background, `#000` text, `1px solid #c4c4c4` border.
- **Active:** white background, `#5b88bd` text (secondary blue), border color shifts to `#5b88bd`.
- **Hover (inactive):** a whisper of blue tint appears: `rgba(53, 158, 255, 0.12)` background.

### Navigation

A minimal, horizontally tabbed header bar spanning the full viewport width. Shared across all four tools — the nav items are UXCore, UXCG, UXCP, and UXCat.

**Desktop (>1010px):**

- Height: 46px. Background: `#fff`. Box-shadow: `0px 2px 8px rgba(0, 0, 0, 0.05)` (the subtle "SM" shadow).
- Tabs are uppercase text, 14px, color `rgba(0, 0, 0, 0.85)`.
- **Active tab indicator:** A dark pill (`rgba(0, 0, 0, 0.85)` background, 4px border-radius, 33px height) that slides horizontally behind the active tab. Text turns to `#fafafa` (near-white) when active. The pill slides with `transition: transform 450ms cubic-bezier(0.22, 0.95, 0.35, 1)` — a fast-start, soft-landing ease that feels physical and satisfying.
- **Hover (inactive tabs):** `#f1f1f1` background tint with 4px border-radius. Subtle enough to not distract from the active indicator.

**Mobile (≤1010px):**

- The horizontal tab bar disappears entirely. It's replaced by a PageSwitcher — a single dropdown-style button showing the current tool name, 40px tall, `1px solid #c4c4c4` border, 4px border-radius, with 16px page padding.

### Modals / Dialogs

Clean, centered overlays used across all tools — for bias detail views (UXCore), case detail views (UXCG), persona confirmations (UXCP), and various settings.

- **Backdrop:** `rgba(0, 0, 0, 0.35)` — a light dim that keeps the page context partially visible.
- **Modal panel:** `#fff` background. Border-radius: 4px. Border: `1px solid #cbcbcb`. Box-shadow: `0px 4px 16px rgba(0, 0, 0, 0.15)`.
- **Title:** 16px, color `#28587b` (brand blue). Alternate title styles: `#000` (strong), `#9e9e9e` (gray/subtle).
- **Body padding:** 16px top/bottom, 28px sides (generous horizontal space for reading).
- **Header area:** 13px top padding, 8px bottom padding, with a bottom border when present.
- **Close button:** Positioned 15px from the right edge.
- **Entry animation:** Modals appear immediately (no slide-in or scale animation). Some secondary modals use a slow 1s transition.
- **Z-index stacking:** Backdrop at z-45, modal content at z-80 (well above any dropdown or tooltip).

### Tooltips

Small, informational popovers that appear on hover for help icons and contextual hints. Shared across all tools.

**Light variant (default):**

- Background: `#fff`. Text: `#000`. Border: `1px solid #cbcbcb`. Border-radius: 4px. Box-shadow: `0px 4px 16px rgba(0, 0, 0, 0.15)`. Padding: 10px. Font-size: 14px. Max-width: 380px (preferred width 300px).
- Has a small CSS arrow (8px triangle) pointing toward the trigger element.

**Dark variant:**

- Background: `#000`. Text: `#fff`. Border-radius: 4px. Padding: 2px 6px. Font-size: 12px. Compact and label-like — used for quick, single-line hints.

---

## 6. Icons & Images

### Icon System

- **No shared Icon wrapper component.** Icons are either inline SVG (React components) or static `.svg` files referenced by URL. This pattern is the same across all tools.
- **Common sizes:** 14–25px for UI icons. Typical: 20×20 (search), 25×25 (header nav), 16–18px (buttons and small actions), 13×17 (info/question marks).
- **Icon color:** Usually inherits text color via `fill: currentColor`, or is set explicitly (e.g., `#28587b` for brand-colored icons, `#5b88bd` for interactive states, `#fafafa` for icons on dark backgrounds).
- **Style:** Flat, outlined SVGs — not filled/solid. UXCG stage icons use stroke-based drawing on circles and paths.

### Images

- **Optimization:** Next.js `Image` component is the standard; however, many images set `unoptimized: true` for static SVGs and small assets. Remote image domains are whitelisted for user avatars (Google, Discord).
- **Illustration style:** SVG-based, flat/outlined. No photographic hero images. Background textures for UXCG category tags use small PNG cards (170×250px) with a neutral gray placeholder for unselected state.
- **Avatar shape:** Circular (`border-radius: 50%`).

### Language Flags

- Three flags for the language switcher: English (UK flag), Armenian, Russian — all SVGs.
- Main switcher size: 22×15px. Dropdown size: 16×13px.

---

## 7. Motion & Transitions

### Timing

| Category                       | Duration   | Use                                                                         |
| ------------------------------ | ---------- | --------------------------------------------------------------------------- |
| Micro (hover, focus)           | 150–250ms  | Button color/border shifts, label opacity fades, input focus border changes |
| Component (expand, tab switch) | 300–320ms  | Tooltip show/hide, search expand, card hover lift, dropdown open            |
| Navigation (pill slide)        | 450ms      | Active tab indicator sliding between nav items                              |
| Page / section                 | 500–1000ms | Staggered content fade-ins (UXCat), slide-in panels, layout transitions     |

### Easing

- **Default easing:** `ease-in-out` — used for most fade and slide animations across all tools.
- **Card hover lift:** `cubic-bezier(0.22, 1, 0.36, 1)` — a fast-start, overshoot-then-settle curve that feels springy and physical.
- **Nav pill slide:** `cubic-bezier(0.22, 0.95, 0.35, 1)` — similar springy feel but slightly more damped for a heavier, satisfying slide.
- **Loading spinner:** `cubic-bezier(0.5, 0, 0.5, 1)` — symmetrical ease for continuous rotation.
- **Dropdown open:** `cubic-bezier(0.4, 0, 0.2, 1)` — Material-style standard easing.

### Hover Effects

- **Cards:** Lift upward by 8px with a springy ease (320ms). Shadow doesn't change explicitly — the movement itself creates the perception of increased depth.
- **Buttons:** Border and text color shift to brand blue (200ms). Orange buttons darken. Blue/orange outline buttons invert to filled on hover.
- **Links:** An underline appears (no color change, no fade — it's a binary appear/disappear).
- **Nav items:** A `#f1f1f1` background tint fades in with 4px border-radius. Associated icons go from 85% opacity to 100%.
- **Dropdown items / user menu:** `#f1f1f1` background highlight; user name text shifts to `#5b88bd`.

### Loading States

- **Primary loader (brain spinner):** A branded animation shared across the entire platform — three layered brain SVG images (brain outline, rotating circle, rotating gears) stacked at 50×50px, counter-rotating at 3s linear infinite. Displayed over a `rgba(0, 0, 0, 0.6)` overlay. This is the signature loading state.
- **Secondary loader (ring spinner):** A 32×32px CSS border-based spinner: `border: 4px solid #5b88bd`, animating at 1.2s with cubic-bezier easing.
- **Skeleton screens:** Used while content loads — flat `#ebebeb` rectangles with 4px border-radius that hold the space where content will appear.
- **Button loading:** An inline spinner rotates inside the button (500ms, linear, infinite).

### Scroll Behavior

- **Smooth scroll:** Used sparingly (only in specific selection views), not globally.
- **No scroll-triggered animations** — content is static once rendered.
- **Sticky elements:** Mobile view headers and folder-view sidebars use `position: sticky`.
- **Custom scrollbar:** Thin (6–8px), border-radius 5px, with a brand-tinted thumb (`rgba(40, 88, 123, 0.5)` — the primary blue at 50% opacity) on a transparent track.

---

## 8. Shadows & Depth

Shadows are always pure black at low opacity — never tinted. The system uses three tiers, shared across all tools:

| Level | Value                                                                                                                                                                         | Feel                                           | Used for                                                            |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| SM    | `0px 2px 8px rgba(0, 0, 0, 0.05)`                                                                                                                                             | Barely visible, just separates from background | Header bar, resting content cards, section headers                  |
| MD    | `0px 4px 16px rgba(0, 0, 0, 0.15)`                                                                                                                                            | Clearly floating, still subtle                 | Tooltips, dropdowns, user menus, modal panels, search popups        |
| LG    | `0px 8px 17px rgba(0, 0, 0, 0.05), 0px 30px 30px rgba(0, 0, 0, 0.04), 0px 68px 41px rgba(0, 0, 0, 0.03), 0px 122px 49px rgba(0, 0, 0, 0.01), 0px 190px 53px rgba(0, 0, 0, 0)` | Diffused, paper-floating-on-desk feel          | Elevated content panels, answer cards, NPS survey, start-test cards |

- **Shadow color:** Always pure black with opacity ranging from 0.01 to 0.15. No colored or tinted shadows.
- **Specialty:** Upward-facing shadow (`0px -4px 16px rgba(0, 0, 0, 0.15)`) for bottom-anchored action bars. See Section 10b for UXCat-specific achievement glow effects.

---

## 9. Border Radius Scale

| Token | Value | Used for                                                                                                                                          |
| ----- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| None  | 0px   | Mobile search inputs (full-width, edge-to-edge)                                                                                                   |
| SM    | 2px   | Buttons (default and primary), tags/badges, small inline elements. Nearly square — a signature detail.                                            |
| MD    | 4px   | The dominant radius. Modals, tooltips, inputs, textareas, search fields, toggles, nav indicator pill, hover states, answer cards, filter buttons. |
| LG    | 8px   | Standalone content cards, result sections, statistics boxes.                                                                                      |
| XL    | 15px  | Achievement badge containers (UXCat-specific decorative element).                                                                                 |
| Full  | 50%   | Avatars, score indicators, loading spinners, circular decorative elements.                                                                        |

The design leans heavily on **4px** as the standard radius. The 2px radius on buttons is an intentional choice — it gives buttons a more precise, tool-like feel compared to the slightly softer 4px on containers.

---

## 10. Z-Index Layers

A simplified, recommended stacking order based on the patterns in the design:

| Layer                    | Z-index | Elements                                                                                                     |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------ |
| Base content             | 0       | Default stacking — page content, card interiors                                                              |
| Local lifts              | 1–5     | Header chrome, input fields above their error messages, tooltip arrows, snackbar notifications               |
| Dropdowns / tooltips     | 10      | Tooltip popups, user dropdowns, modal overlays (bias detail, UXCG detail)                                    |
| Fixed navigation         | 44–50   | Dropdown menus, leaderboard overlays, language switcher, mobile nav arrows                                   |
| Modal backdrop           | 45      | Semi-transparent overlay behind modals                                                                       |
| Modal content            | 80      | Modal panels (above their own backdrop)                                                                      |
| Special overlays         | 100+    | Mobile user dropdowns, fullscreen achievement announcements                                                  |
| Full-screen spinner      | 1000    | The brain-spinner loading overlay (must be above everything)                                                 |
| Achievement celebrations | 99999+  | Achievement badge pop-ups and gamification overlays (UXCat — intentionally sky-high to guarantee visibility) |

Note: for new implementations, a tighter scale (e.g., 0/10/20/30/40/50/100/1000) following the same layer order would be more maintainable.

---

## 10b. UXCat-Specific Styles

UXCat is the quiz and gamification tool. It inherits the entire shared foundation above (fonts, colors, spacing, breakpoints, component styles, shadows, border-radius) but adds its own visual personality on top of it.

### How UXCat Differs from the Platform Style

| Aspect           | Platform (UXCore/UXCG/UXCP) | UXCat                                                        |
| ---------------- | --------------------------- | ------------------------------------------------------------ |
| Dominant accent  | Steel-blue `#28587b`        | Orange `#de915b` for titles and CTAs                         |
| Heading weight   | 300 (light)                 | Bold (for quiz titles and start-test headings)               |
| Content entrance | Immediate (no animation)    | Staggered fade-in sequence                                   |
| Interactivity    | Browse and explore          | Select, answer, submit — quiz-flow interaction               |
| Reward layer     | None                        | Achievement badges, leaderboard, progress bars, certificates |
| Emotional tone   | Calm, reference-like        | Encouraging, slightly competitive                            |

### Additional Fonts (UXCat only)

- **Oswald** (bold, serif fallback) — used for achievement badge display names. A condensed, impactful typeface that signals "reward" and "accomplishment."
- **Dela Gothic One** (weight 400) — used for gamification ranking displays (leaderboard ranks, score labels). Thick and monumental — makes rank numbers feel important.
- **IBM Plex Sans** (Regular/SemiBold) and **Manrope ExtraLight** — used for certificate generation. These give certificates a formal, clean appearance distinct from the UI chrome.

### Start Test Screen

A full-viewport introduction screen shown before a quiz begins. Sets the mood for the UXCat experience.

- **Layout:** Full-screen (100vw × 100vh) with a background illustration image covering the viewport. Content is centered in a white modal-like card floating over the image.
- **Title:** 36px, **bold** weight, color `#de915b` (orange accent), centered. This is the key visual difference — UXCat headings use orange and bold weight, not the thin steel-blue of other tools.
- **Description:** 16px, line-height 22px, centered, 25px side padding.
- **Duration badge:** Positioned top-center, 20px, `#c4c4c4` gray text. On mobile (≤901px), this repositions to a small pill in the top-right corner with `1px solid #c4c4c4` border, 4px border-radius, white background.
- **Card shadow:** Uses the LG multi-layered shadow for a prominent floating effect.
- **CTA button:** Orange button variant (`#de915b` → `#cd7232` on hover), centered below the description.

### Quiz Flow (Ongoing Screen)

The active quiz-taking interface. Content is broken into a question zone at the top and selectable answer cards below.

**Question area:**

- White card with SM shadow (`0px 2px 8px rgba(0, 0, 0, 0.05)`), minimum height 223px.
- Question text: 24px, weight 800 (the heaviest weight in the system), centered, `#000`. On mobile (≤800px), drops to 16px.
- Sub-question text: 18px, weight 700, centered.
- Bias title and description: 16px, line-height 25.6px, left-aligned, with bold weight for the title.
- Top padding: 80px on desktop (creates breathing room below the header). Removed on mobile.
- User selection is disabled (`user-select: none`) — the interface is interaction-only.

**Answer cards:**

- White cards with the LG multi-layered shadow, `2px solid #fafafa` border (nearly invisible at rest), 4px border-radius, minimum height 72px.
- Each card has a **prefix label** (e.g., "A", "B") in a dark pill: `#000000a6` background, `#fff` text, 2px border-radius, 0 8px padding.
- Answer text: 16px, `rgba(0, 0, 0, 0.65)` (slightly muted), centered.
- **Selected state:** Border becomes `2px solid #5b88bd`, background gets a faint blue wash `rgba(147, 183, 255, 0.2)`. A quick scale pulse plays (scale 1 → 0.99 → 1, 200ms) to give tactile feedback.
- **Skeleton state (loading):** Background `#ebebeb`, no text, same dimensions. On mobile, border changes to `1px solid #c4c4c4`.

**Staggered entrance animation:**

- When a new question loads, elements fade in sequentially:
  - Question text: 500ms
  - Bias title: 600ms
  - Description: 700ms
  - Sub-question: 800ms
  - Answer cards: 900ms
- Each uses `opacity: 0 → 1`, `ease-in-out`. On exit, the same elements fade out in the same staggered order.
- Answers can also slide down from above (`translateY(-100%) → 0`, 400ms, `ease-in-out`) when new options appear.

**Action buttons:**

- Centered below answers, 32px top margin, 60px bottom padding, 17px gap between buttons.
- Fixed width: 205px per button (235px for Russian locale).

### Calculating Results Screen

A transitional screen shown while quiz results are being processed.

- **Layout:** Full height (`100vh - 45px`), centered content, 125px top margin.
- **Ring spinner:** 32×32px, `border: 4px solid #5b88bd`, three staggered rings with `-0.45s`, `-0.3s`, `-0.15s` animation delays. Duration: 1.2s, `cubic-bezier(0.5, 0, 0.5, 1)`.
- **Title:** 24px, weight 600, line-height 28.8px.
- **Progress card:** White card with the LG multi-layered shadow, max-width 497px, 64px vertical padding.
- **Progress bars:** 2px height, `#e0e0e0` background track, `#2db675` (green) fill that animates from 0% to 100% width over 1 second.
- **Checkmark:** `#4caf50` green, 18px.

### Test Results Screen

Displays quiz results with score, reading recommendations, and next-test information.

- **Header:** 396px tall white card with SM shadow, containing score visualization.
- **Body:** 900px max-width, 24px top margin, standard platform layout.
- **Result cards:** 8px border-radius, `1px solid #d9d9d9` border, MD shadow (`0 4px 16px rgba(0, 0, 0, 0.15)`), white background.
- **Reading list links:** 16px, `#000` text, 2px border-radius, ellipsis overflow at 380px max-width. Links stack with 8px gap.
- **Next test date:** `#a36aa4` (purple accent) text.
- **Action buttons:** 218px fixed width. Centered in the footer with 61px top margin.

### Achievement Badges

Pop-up reward notifications that appear when users unlock achievements during quizzes. These are the most visually distinctive elements in the entire platform — intentionally flashy compared to the understated core aesthetic.

- **Container:** 420×140px, border-radius 15px, transparent background, z-index 99999 (above everything).
- **Inner wrapper:** 320×100px, border-radius 10px, gold background `rgb(177, 136, 56)` with asymmetric gold borders (top: `5px solid rgb(216, 188, 131)`, right: `5px solid rgb(168, 130, 53)`, bottom: `5px solid rgb(177, 134, 53)`). A metallic gradient fills the text area: `linear-gradient(-23deg, #9e7931, #cb9d4a 39%, #d1ad66 51%)`.
- **Badge name:** Oswald font, 24px (20px on mobile), `#fff` white text, uppercase.
- **Title label:** 15px (12px on mobile), `#fff` text, `rgb(151, 100, 0)` background, `2px solid rgb(166, 128, 53)` border, uppercase.
- **Glow effect:** Pulsing gold glow shadow: `0px 0px 4px rgb(252, 249, 218), 0px 0px 8px rgb(252, 249, 218), 0px 0px 16px rgb(252, 249, 218)`. On hover, glow intensifies (spreads to 8/12/20px). 4px border-radius on the glow elements.
- **Star decorations:** Rotating star images (5s ease-in infinite) with fade-in-and-out particles (2s linear infinite).
- **Entrance animations:** Slides in from the side (`translateX(100%) → 0`, 1s ease-in-out). Exits with `translateX(0) → translateX(100%)` + opacity fade, 500ms.
- **Mobile:** Container shrinks (reduced padding, smaller text — 12px title, 20px badge name, 75px wrapper height).

### UXCat Page Layout

The UXCat hub page (test selection, leaderboard) uses the same layout pattern as other tools:

- Page title: 36px, weight 400, `#28587b` (brand blue — the hub page uses the platform color, not orange).
- Subtitle: 18px, `#9e9e9e`, 9px top padding.
- Description: 16px, line-height 19.6px.
- Content: 900px max-width, 86px top margin.
- **Accordion sections:** 32px bottom margin, 150% line-height.
- **Leaderboard:** 32px top margin, 62px bottom margin.
- On mobile (≤801px): title goes to 24px bold, subtitle to 16px, description hidden, accordion margin to 16px.

### Achievement Banner (In-Quiz)

A full-width gradient banner that appears during a quiz when an achievement is unlocked:

- Background: `linear-gradient(261.09deg, rgba(195, 55, 100, 0.89) 0.45%, rgba(29, 38, 113, 0.89) 90.78%)` — a dramatic pink-to-navy gradient, the only gradient element in the entire UI.
- Padding: 14px vertical, 20px horizontal text.
- Text: 14px, white.
- Twinkling star emojis at corners, fading in and out (2–3s infinite).
- Z-index: 999999 (the absolute highest layer — must appear above quiz content and any existing badges).

---

## 11. Do / Don't Rules

# Section 11 — Do / Don't Rules (DRAFT)

> Go through these. Keep the ones that match your vision,
> delete the ones that don't apply, reword anything that
> needs adjusting, and add your own. These are the rules
> that stop Claude from making "technically correct but
> visually wrong" output.

## Always Do

### Layout & Structure

- Keep layouts flat and simple — content speaks, decoration doesn't
- Use generous whitespace between sections — let things breathe
- Maintain strict visual hierarchy: one clear focal point per section
- Align elements to a consistent grid — nothing should feel randomly placed
- Keep content containers at a predictable max-width — never let text stretch edge-to-edge

### Typography

- Use font weights exactly as specified — don't improvise with weights we don't use
- Keep headings lightweight (thin/light weight) — heavy headings feel wrong for UXCore/UXCG/UXCP (UXCat uses bold for quiz titles — that's the exception)
- Use uppercase only where the system specifies it (nav, labels, tags) — nowhere else
- Maintain consistent text sizes — don't introduce sizes between our scale steps

### Color

- Use color sparingly and with purpose — every colored element should mean something
- Keep the palette desaturated and cool — the platform is calm, not vibrant
- Use the steel-blue (#28587b) as the single dominant accent for UXCore/UXCG/UXCP — don't spread multiple accent colors
- For UXCat quiz screens, use orange (#de915b) as the dominant accent — but only on titles and CTAs, not everywhere
- Let white/near-white backgrounds do most of the work

### Components

- Cards should feel like paper — white, slightly lifted, clean edges
- Buttons should be small and compact — they don't shout
- Inputs should feel invisible until focused — minimal borders, no shadows at rest
- Tags/badges should be subtle color-coded labels, not attention-grabbing pills

### Interactions

- Keep hover effects subtle — a slight lift, a border color shift, nothing dramatic
- Use the exact easing curves specified — the springy cubic-bezier is part of the feel
- Transitions should be fast (150-300ms) — the UI should feel responsive, not animated

## Never Do

### The "AI Look" Killers (most important)

- Never use gradient backgrounds on cards or sections — the platform uses flat white/gray only (the UXCat achievement banner is the sole exception)
- Never use colored shadows or glows (except the specific gold achievement glow in UXCat)
- Never use rounded pill buttons (large border-radius like 24px+) — our buttons are nearly square (2-4px radius)
- Never use hero sections with giant text and centered CTAs — the platform is a tool, not a landing page
- Never use decorative SVG blobs, waves, or organic shapes as backgrounds
- Never use glassmorphism, frosted glass, or backdrop-blur effects
- Never add decorative gradients to text
- Never use icon-heavy empty states with cute illustrations
- Never center-align body text — always left-align (except specific centered headings)

### Typography

- Never use font weights that aren't in our scale (no 900/black, no 100/hairline unless specified)
- Never use font sizes outside our type scale
- Never add text shadows
- Never use italic for emphasis — use weight or color instead

### Color & Visual

- Never use pure black (#000000) as a background — our darkest background is near-white gray
- Never introduce new accent colors — stay within the defined palette
- Never use high-saturation colors — everything in the platform is muted and desaturated
- Never use colored borders on cards — borders are always neutral gray or the specific selection blue
- Never use alternating row colors in lists/tables (zebra striping) unless it already exists in the design

### Spacing & Layout

- Never add more than 3 levels of visual nesting — keep the hierarchy shallow
- Never use full-bleed colored sections that span the viewport
- Never overlap elements for decorative effect — the layout is clean and grid-aligned
- Never use masonry layouts — our grids are uniform

### Motion

- Never add entrance animations to every element — staggered reveals are used only in UXCat quiz flow
- Never use bounce, elastic, or exaggerated easing — motion is subtle and physical
- Never animate color changes on hover — change happens instantly, only position/shadow animates
- Never add loading animations to elements that load instantly
- Never use parallax scrolling

### Components

- Never make buttons taller than specified — our buttons are compact (32px default, 54px max for big variant)
- Never add icons inside buttons unless the existing design does
- Never use floating action buttons (FABs)
- Never use toast notifications that slide in from corners (unless the project has them)
- Never add empty state illustrations — use simple text

## Tone of the UI

- ***
  (Suggestion: "Quiet, structured, informational. A well-organized
  reference tool — closer to a thoughtfully designed textbook than
  a marketing page. The UI stays out of the way and lets dense
  educational content be the focus. Nothing is flashy, playful,
  or decorative without purpose. UXCat adds warmth and encouragement
  to the quiz experience, but never crosses into playful or casual.")

---

## Code Conventions

This skill covers **visual design only** — colors, typography, spacing, component appearance, motion.

For code conventions (component structure, file layout, prop typing, static data, locales, path aliases, testing, gotchas), see **`AGENTS.md`** at the repo root. That file is the authoritative source for how to write code in this repo.

If a visual instruction here conflicts with a code convention in `AGENTS.md`, both apply — this skill governs how the UI _looks_, `AGENTS.md` governs how the code is _structured_.
