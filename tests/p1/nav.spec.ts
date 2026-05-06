import { expect, test } from '../fixtures/base';
import { expectNotErrorPage } from '../helpers/pageIdentity';

type NavTarget = {
  label: string;
  triggerHref: string;
  // Accept multiple URLs — client-side router.push('/') does not re-run the
  // locale middleware, so the Home link lands on `/` (not the `/en` that a
  // cold server request would redirect to).
  expectedPaths: string[];
  // Page-specific landmark. /tools and /contributors are h2-only
  // (ToolHero.tsx:112, ContributorsLayout.tsx:73) — a uniform "h1 visible"
  // check would flake on those. Per QA_PLAN.md §2 P1 #1, a known data-cy
  // or page-specific landmark is acceptable.
  landmark: string;
};

// Navbar targets — order mirrors src/components/Navbar/Navbar.tsx:47-80
// (Home, Longevity, Tools, Articles) plus the separate Contributors anchor
// at :132. UX Core is intentionally skipped — it is an external
// target="_blank" link per Navbar.tsx:54.
const NAV_TARGETS: NavTarget[] = [
  {
    label: 'Longevity',
    triggerHref: '/tools/longevity-protocol/about-project',
    expectedPaths: ['/tools/longevity-protocol/about-project'],
    landmark: '[data-cy="basic-stats"]',
  },
  {
    label: 'Tools',
    triggerHref: '/tools',
    expectedPaths: ['/tools'],
    // Added for this test — on-touch convention. The /tools page uses
    // a different ToolContainer (src/components/tools/ToolContainer) than
    // the homepage tiles, and it didn't carry a testable attribute.
    landmark: '[data-testid="tool-card"]',
  },
  {
    label: 'Articles',
    triggerHref: '/articles',
    expectedPaths: ['/articles'],
    landmark: 'h1',
  },
  {
    label: 'Contributors',
    triggerHref: '/contributors',
    expectedPaths: ['/contributors'],
    landmark: 'h2',
  },
  {
    label: 'Home',
    triggerHref: '/',
    expectedPaths: ['/', '/en'],
    landmark: 'h1',
  },
];

test.describe('P1 @nav — Navbar routing', () => {
  test('each top-level Navbar item routes to its page', async ({
    page,
    dismissCookieBanner,
  }) => {
    // 5 sequential navigations × cold-compile latency under parallel load
    // can exceed the default 30s cap. Give it headroom.
    test.setTimeout(120_000);

    // /en must resolve to the real homepage before we start following
    // in-app links — subsequent navigation uses the app's own aside
    // anchors, so a typo here would otherwise propagate silently.
    const response = await page.goto('/en');
    await expectNotErrorPage(page, response, '/en');

    await dismissCookieBanner();

    for (const target of NAV_TARGETS) {
      // Header.handleClick wires a 300ms setTimeout before router.push,
      // so `waitForURL` is the correct signal here — not the click resolution.
      await page.evaluate(() => window.scrollTo(0, 0));

      const navLink = page
        .locator(`aside a[href="${target.triggerHref}"]`)
        .first();
      await expect(navLink).toBeVisible();
      // The Contributors anchor (Navbar.module.scss:29-32) is
      // `position: absolute; bottom: 70px;` — depending on the surrounding
      // layout it can land outside the viewport even after
      // scrollIntoViewIfNeeded. `dispatchEvent('click')` fires the React
      // onClick handler directly (Header.handleClick → router.push), which
      // is what we actually want to assert against — not native hit-testing
      // on an absolutely-positioned element.
      await navLink.dispatchEvent('click');
      await page.waitForURL(
        url => target.expectedPaths.includes(url.pathname),
        { timeout: 15_000 },
      );

      // `_app.tsx` toggles a route-change loader and rebuilds `<main>` between
      // pages, so a locator on the previous DOM can refer to a detached node
      // for a brief window. Relying on toBeVisible's polling avoids the race.
      await expect(
        page.locator(target.landmark).first(),
        `${target.label} landmark (${target.landmark})`,
      ).toBeVisible({ timeout: 15_000 });
    }
  });
});
