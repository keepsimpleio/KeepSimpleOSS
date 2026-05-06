import { expect, test } from '../fixtures/base';

type LocalePage = {
  path: string;
  landmark: string;
};

// Per-page landmarks — /tools renders h2-only via ToolHero
// (see P1 nav spec comments for the same rule).
const RU_PAGES: LocalePage[] = [
  { path: '/ru', landmark: 'h1' },
  { path: '/ru/articles', landmark: 'h1' },
  { path: '/ru/company-management', landmark: 'h1' },
  { path: '/ru/tools', landmark: '[data-testid="tool-card"]' },
];

test.describe('P2 @locale — Russian locale renders on top-level pages', () => {
  for (const { path, landmark } of RU_PAGES) {
    test(`${path} renders with its landmark (${landmark})`, async ({
      page,
      dismissCookieBanner,
    }) => {
      const response = await page.goto(path);
      expect(response?.status(), `GET ${path} status`).toBeLessThan(400);

      await dismissCookieBanner();

      await expect(page.locator(landmark).first()).toBeVisible();
    });
  }
});

test.describe('P2 @locale — Armenian /hy/ URL-only routes render', () => {
  // There is NO Armenian translation layer. `/hy/` exists purely for URL
  // consistency with the external `/uxcore` app; content served is English.
  // The test asserts the route resolves and renders — not that Armenian
  // text is present. See QA_PLAN.md §2 P2 #7 and the i18n row in QA_RECON.md §1.
  test('/hy/articles renders (status < 400, h1 present)', async ({
    page,
    dismissCookieBanner,
  }) => {
    const response = await page.goto('/hy/articles');
    expect(response?.status(), 'GET /hy/articles status').toBeLessThan(400);

    await dismissCookieBanner();

    await expect(page.locator('h1').first()).toBeVisible();
  });
});
