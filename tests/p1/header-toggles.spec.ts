import { expect, test } from '../fixtures/base';
import { expectNotErrorPage } from '../helpers/pageIdentity';

test.describe('P1 @header — language toggle', () => {
  test('switches /articles → /ru/articles and preserves path', async ({
    page,
    dismissCookieBanner,
  }) => {
    await page.goto('/articles');
    await dismissCookieBanner();

    const toggle = page.locator('[data-test-id="language-toggle"]').first();
    await expect(toggle).toBeVisible();
    await toggle.click();

    await page.waitForURL(/\/ru\/articles(\/|$|\?)/, { timeout: 10_000 });

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toHaveText('');
  });
});

test.describe('P1 @header — theme toggle', () => {
  // Dark theme is removed on longevity-protocol pages (src/pages/_app.tsx:167-171),
  // so the persistence check runs on the homepage where it is not scrubbed.
  test('persists across reload via body.darkTheme + localStorage', async ({
    page,
    dismissCookieBanner,
  }) => {
    // The theme-toggle is rendered by _app.tsx so it exists on Custom404
    // too — without this guard a typo'd URL would still flip the body
    // class and persist it, and the test would pass against a wrong page.
    const response = await page.goto('/en');
    await expectNotErrorPage(page, response, '/en');

    await dismissCookieBanner();

    const toggle = page.locator('[data-test-id="theme-toggle"]').first();
    await expect(toggle).toBeVisible();
    await toggle.click();

    await expect(page.locator('body')).toHaveClass(/darkTheme/);
    expect(await page.evaluate(() => localStorage.getItem('darkTheme'))).toBe(
      'true',
    );

    await page.reload();

    await expect(page.locator('body')).toHaveClass(/darkTheme/);
    expect(await page.evaluate(() => localStorage.getItem('darkTheme'))).toBe(
      'true',
    );
  });
});
