import { expect,test } from '@playwright/test';

import { waitForPageReady } from './helpers';

const PAGES = [
  { path: '/', name: 'homepage' },
  { path: '/company-management', name: 'company-management' },
  { path: '/tools', name: 'tools' },
  {
    path: '/tools/longevity-protocol/about-project',
    name: 'longevity-protocol',
  },
  { path: '/articles', name: 'articles' },
  { path: '/contributors', name: 'contributors' },
  { path: '/uxcore', name: 'uxcore' },
  { path: '/uxcore#hr', name: 'uxcore-hr' },
  { path: '/ru', name: 'ru-homepage' },
  { path: '/ru/uxcore', name: 'ru-uxcore' },
];

test.describe('Visual regression', () => {
  for (const { path, name } of PAGES) {
    test(`${name} (${path})`, async ({ page }) => {
      await page.goto(path);
      await waitForPageReady(page);

      const hash = path.split('#')[1];
      if (hash) {
        await page.evaluate(id => {
          document.getElementById(id)?.scrollIntoView();
        }, hash);
        await page.waitForTimeout(300);
      }

      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        mask: [page.locator('video')],
      });
    });
  }
});
