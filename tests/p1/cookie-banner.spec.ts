import { expect, test } from '../fixtures/base';
import { expectNotErrorPage } from '../helpers/pageIdentity';

test.describe('P1 @cookie — Cookie banner persistence', () => {
  test('dismisses on accept and stays dismissed after reload', async ({
    page,
  }) => {
    // Intentionally not using the dismissCookieBanner fixture — we want to
    // observe the initial visible-then-accept transition ourselves.
    //
    // Cookie banner renders on every page including Custom404
    // (Layout.tsx:40), so without this guard a typo'd path would still pass.
    const response = await page.goto('/en');
    await expectNotErrorPage(page, response, '/en');

    const banner = page.locator('[data-cy="cookie-box"]').first();
    await expect(banner).toBeVisible();

    await page.locator('[data-cy="cookie-box-accept"]').first().click();
    await expect(banner).toBeHidden();

    // Persistence: cookieBoxIsSeen cookie (useCookieBox.ts:37) is set with
    // Max-Age=1y. On reload the banner must not reappear.
    await page.reload();
    await expect(banner).toBeHidden();
  });
});
