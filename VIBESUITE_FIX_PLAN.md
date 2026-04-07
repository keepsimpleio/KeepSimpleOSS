# Vibesuite Visual Fix Plan

## Summary

Two structural wiring issues broke the entire visual design when Vibesuite was migrated from its standalone repo into KeepSimple. The SCSS modules were correctly authored — all colors, fonts, spacing, and animations match the original precisely. The problem is upstream.

---

## Fix 1 — CRITICAL: `.vibesuite-root` class is never applied

**Root cause**: All CSS custom properties used by every Vibesuite component (`--bg-base`, `--accent`, `--font-display`, `--font-body`, `--font-ui`, `--font-japanese`, all border/text colors) are defined in `src/styles/vibesuite.scss` scoped to `.vibesuite-root`. No DOM element ever receives this class, so every `var(--...)` call resolves to undefined / browser default.

**Visual result**: No beige background, no red accent, no custom fonts — plain browser defaults.

**Evidence**: `vibesuite.scss` line 9 says `(added by VibesuiteLayout)` but no such layout was ever created. Neither `MapClient.tsx` nor `LandingClient.tsx` add the class.

### Change A — `src/components/vibesuite/MapClient/MapClient.tsx` line 145

```tsx
// BEFORE
<div className={styles.Root}>

// AFTER
<div className={`${styles.Root} vibesuite-root`}>
```

### Change B — `src/components/vibesuite/LandingClient/LandingClient.tsx` line 90

```tsx
// BEFORE
<main className={styles.Main}>

// AFTER
<main className={`${styles.Main} vibesuite-root`}>
```

---

## Fix 2 — CRITICAL: KeepSimple global `<Header />` renders on vibesuite pages

**Root cause**: `src/layouts/Layout.tsx` always renders `<Header />` (the KeepSimple site navigation: `position: sticky; top: 0; height: 48px; z-index: 150`) for every page. On vibesuite pages, this collides with Vibesuite's own `<ProgressHeader>` (`position: fixed; top: 0; height: 58px; z-index: 40`).

**Visual result**:
- KeepSimple Header (z-index 150) covers the vibesuite ProgressHeader (z-index 40) — vibesuite header invisible
- `CategoryNav` (`position: fixed; top: 58px`) is misaligned — should start right below vibesuite's ProgressHeader
- `MapClient.Main` has `padding-top: 58px` but KeepSimple sticky header already occupies 48px, misaligning all content

### Change C — `src/layouts/Layout.tsx`

Add a vibesuite route check alongside the existing longevity check. Suppress `<Header />` for vibesuite routes.

```tsx
// In the Layout component, after the existing isLongevityProtocolPage state, add:
const isVibeSuitePage = router.pathname.startsWith('/tools/vibesuite');

// Then change:
// BEFORE
return (
  <>
    <Header />
    ...

// AFTER
return (
  <>
    {!isVibeSuitePage && <Header />}
    ...
```

The rest of the Layout JSX stays unchanged — vibesuite pages render as `<section>{children}</section>` just like other non-longevity pages.

---

## Files to Modify (3 total)

| File | Line | Change |
|------|------|--------|
| `src/components/vibesuite/MapClient/MapClient.tsx` | ~145 | Add `vibesuite-root` to root div className |
| `src/components/vibesuite/LandingClient/LandingClient.tsx` | ~90 | Add `vibesuite-root` to root main className |
| `src/layouts/Layout.tsx` | ~36 + ~43 | Add `isVibeSuitePage` check; conditionally hide `<Header />` |

---

## What Was NOT Broken (verified)

The SCSS module migration was done correctly. All verified against the original inline styles:
- `ProgressHeader.module.scss` — matches
- `SkillCard.module.scss` — matches
- `SkillDetailPanel.module.scss` — matches
- `CategoryNav.module.scss` — matches
- `MapClient.module.scss` — matches
- `vibesuite.scss` animations/keyframes — correctly defined as global classes
- All CSS variable values — identical to original `globals.css`

---

## Verification Steps

1. Open `http://localhost:3005/tools/vibesuite/map`
2. Confirm warm beige background (`#f4efe6`) is visible
3. Confirm vibesuite ProgressHeader (dark bar with canvas progress line + "vibecode" logo) is at top — NOT the KeepSimple logo header
4. Confirm CategoryNav sidebar appears flush below the ProgressHeader at `top: 58px`
5. Confirm skill cards show red kanji, red accent borders on hover, Playfair/Garamond/Jost fonts
6. Open `http://localhost:3005/tools/vibesuite` — confirm same warm palette on landing page
7. Navigate to any other KeepSimple page — confirm the KeepSimple Header returns normally
