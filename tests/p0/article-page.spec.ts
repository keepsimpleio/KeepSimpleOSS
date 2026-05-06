import { expect, test } from '../fixtures/base';

const CANARY_SLUG = 'what-is-ux-core';

test.describe('P0 @smoke — article page', () => {
  test(`canary article /${CANARY_SLUG} renders with body content`, async ({
    page,
    dismissCookieBanner,
  }) => {
    const response = await page.goto(`/articles/${CANARY_SLUG}`);
    expect(
      response?.status(),
      `GET /articles/${CANARY_SLUG} status`,
    ).toBeLessThan(400);

    await dismissCookieBanner();

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toHaveText('');

    const article = page.locator('article').first();
    await expect(article).toBeVisible();
  });
});
