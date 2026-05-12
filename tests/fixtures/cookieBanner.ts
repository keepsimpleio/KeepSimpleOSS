import type { Page } from '@playwright/test';

const ACCEPT_SELECTOR = '[data-cy="cookie-box-accept"]';
const BANNER_SELECTOR = '[data-cy="cookie-box"]';

export async function dismissCookieBanner(page: Page): Promise<void> {
  const banner = page.locator(BANNER_SELECTOR).first();
  try {
    await banner.waitFor({ state: 'visible', timeout: 3_000 });
  } catch {
    return;
  }
  await page.locator(ACCEPT_SELECTOR).first().click();
  await banner
    .waitFor({ state: 'hidden', timeout: 3_000 })
    .catch(() => undefined);
}
