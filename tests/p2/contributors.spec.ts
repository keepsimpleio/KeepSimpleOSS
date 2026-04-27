import { expect, test } from '../fixtures/base';

test.describe('P2 — Contributors page', () => {
  test('/contributors renders h1 and at least one contributor card', async ({
    page,
    dismissCookieBanner,
  }) => {
    const response = await page.goto('/contributors');
    expect(response?.status(), 'GET /contributors status').toBeLessThan(400);

    await dismissCookieBanner();

    // The page title is rendered via <Heading text={contributorsData.title} />
    // with the default Tag='h1' (Heading.tsx:17).
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toHaveText('');

    // data-testid added on-touch in this phase.
    const cards = page.getByTestId('contributor-card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });
});
