import { expect, test } from '../fixtures/base';

test.describe('P0 @smoke — longevity protocol entry', () => {
  test('/about-project renders with h1 and 5 basic stat items', async ({
    page,
    dismissCookieBanner,
  }) => {
    const response = await page.goto('/tools/longevity-protocol/about-project');
    expect(response?.status(), 'GET /about-project status').toBeLessThan(400);

    await dismissCookieBanner();

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toHaveText('');

    await expect(page.locator('[data-cy="basic-stats"]').first()).toBeVisible();
    await expect(page.locator('[data-cy="stat-item"]')).toHaveCount(5);
  });
});
