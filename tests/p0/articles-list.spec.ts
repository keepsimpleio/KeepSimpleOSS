import { expect, test } from '../fixtures/base';

test.describe('P0 @smoke — articles list', () => {
  test('loads and renders at least one article card', async ({
    page,
    dismissCookieBanner,
  }) => {
    const response = await page.goto('/articles');
    expect(response?.status(), 'GET /articles status').toBeLessThan(400);

    await dismissCookieBanner();

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toHaveText('');

    const articleLinks = page.locator('a[href^="/articles/"]');
    await expect(articleLinks.first()).toBeVisible();
    expect(await articleLinks.count()).toBeGreaterThanOrEqual(1);
  });
});
