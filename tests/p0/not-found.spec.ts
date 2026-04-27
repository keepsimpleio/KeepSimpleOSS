import { expect, test } from '../fixtures/base';

test.describe('P0 @smoke — 404', () => {
  test('unknown path renders the custom 404 page', async ({ page }) => {
    const response = await page.goto(
      '/this-path-does-not-exist-and-should-404',
    );
    expect(response?.status(), 'status for unknown path').toBe(404);

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toHaveText('');
  });
});
