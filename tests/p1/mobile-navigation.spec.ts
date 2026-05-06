import { expect, test } from '../fixtures/base';

// 390x844 = existing Cypress convention (see QA_RECON.md §5).
test.use({ viewport: { width: 390, height: 844 } });

// ---------------------------------------------------------------------------
// Nav order — DERIVED AT WRITE TIME from the component source.
//
// Source: src/components/longevity/MobileNavigation/MobileNavigation.tsx
//   - `navItems` at :45-68 (top-level: aboutProject, habits [hasNoUrl],
//     environment, results, aiAssistant [external chatgpt URL])
//   - `subNavItems` at :71-102 (lifestyle, study, diet, workout, sleep,
//     supplements)
//   - `buildNavOrder` at :115-128 inlines the subNavItems in place of the
//     `hasNoUrl` habits entry, and skips external paths (`isInternal` check).
//   - `getNextNavItem` at :130-141 does a modulo walk, so the last item
//     (results) wraps around to the first (aboutProject).
//
// The resulting linear order we walk here is:
const NAV_ORDER: { path: string; label: string }[] = [
  { path: '/tools/longevity-protocol/about-project', label: 'about-project' },
  { path: '/tools/longevity-protocol/habits/lifestyle', label: 'lifestyle' },
  { path: '/tools/longevity-protocol/habits/study', label: 'study' },
  { path: '/tools/longevity-protocol/habits/diet', label: 'diet' },
  { path: '/tools/longevity-protocol/habits/workout', label: 'workout' },
  { path: '/tools/longevity-protocol/habits/sleep', label: 'sleep' },
  {
    path: '/tools/longevity-protocol/habits/supplements',
    label: 'supplements',
  },
  { path: '/tools/longevity-protocol/environment', label: 'environment' },
  { path: '/tools/longevity-protocol/results', label: 'results' },
];
// Wrap: results → about-project.
// ---------------------------------------------------------------------------

test.describe('P1 @longevity @mobile — Mobile nav order', () => {
  test('Next button walks the full longevity sequence and wraps', async ({
    page,
    dismissCookieBanner,
  }) => {
    // 9 navigations × ~3s each can easily blow the default 30s test timeout.
    test.setTimeout(120_000);

    await page.goto(NAV_ORDER[0].path);
    await dismissCookieBanner();

    const nextButton = page.locator('[data-cy="mobile-next-button"]').first();

    for (let i = 0; i < NAV_ORDER.length; i++) {
      const current = NAV_ORDER[i];
      const next = NAV_ORDER[(i + 1) % NAV_ORDER.length];

      await expect(page, `URL at step ${i} (${current.label})`).toHaveURL(
        new RegExp(`${current.path.replace(/\//g, '\\/')}(?:$|\\?)`),
      );
      await nextButton.scrollIntoViewIfNeeded();
      await nextButton.click();
      // 30s per step — under parallel dev-server load the on-demand
      // compile for cold longevity routes can push a single navigation
      // past 10s.
      await page.waitForURL(url => url.pathname === next.path, {
        timeout: 30_000,
      });
    }
  });
});

test.describe('P1 @longevity @mobile — Habits dropdown', () => {
  test('mobile-nav-toggle → mobile-habits-toggle → first subnav item routes to Lifestyle', async ({
    page,
    dismissCookieBanner,
  }) => {
    await page.goto('/tools/longevity-protocol/about-project');
    await dismissCookieBanner();

    await page.locator('[data-cy="mobile-nav-toggle"]').first().click();
    await page.locator('[data-cy="mobile-habits-toggle"]').first().click();

    const subnav = page.locator('[data-cy="mobile-subnav"]').first();
    await expect(subnav).toBeVisible();

    // First subnav item = lifestyle per subNavItems[0] in MobileNavigation.tsx:72-76.
    const firstSubItem = subnav.locator('li').first();
    await firstSubItem.click();

    await page.waitForURL(
      url => url.pathname === '/tools/longevity-protocol/habits/lifestyle',
      { timeout: 10_000 },
    );
  });
});
