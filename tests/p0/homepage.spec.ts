import { expect, test } from '../fixtures/base';

test.describe('P0 @smoke — homepage', () => {
  test('renders in English with h1 and tool cards', async ({ page }) => {
    const response = await page.goto('/en');

    expect(response?.status(), 'GET /en status').toBeLessThan(400);

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toHaveText('');

    const toolCards = page.locator('[data-test-id="tool"]');
    await expect(toolCards.first()).toBeVisible();
    expect(await toolCards.count()).toBeGreaterThanOrEqual(1);
  });
});
