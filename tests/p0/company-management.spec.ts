import { expect, test } from '../fixtures/base';

test.describe('P0 @smoke — company management', () => {
  test('renders, blue pyramid visible, switch 2 swaps to orange', async ({
    page,
    dismissCookieBanner,
  }) => {
    const response = await page.goto('/company-management');
    expect(response?.status(), 'GET /company-management status').toBeLessThan(
      400,
    );

    await dismissCookieBanner();

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toHaveText('');

    await expect(
      page.locator('[data-cy="blue-pyramid"]').first(),
    ).toBeVisible();

    await page
      .locator('[data-cy="company-management-switch-item-2"]')
      .first()
      .click();

    await expect(
      page.locator('[data-cy="orange-pyramid"]').first(),
    ).toBeVisible({ timeout: 8_000 });
  });
});
