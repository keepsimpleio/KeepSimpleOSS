import { expect, test as baseTest } from '@playwright/test';

import { blockAnalytics } from './analytics';
import { dismissCookieBanner } from './cookieBanner';

const CANCEL_ROUTE_ERROR = /Cancel rendering route/i;

type Fixtures = {
  dismissCookieBanner: () => Promise<void>;
};

export const test = baseTest.extend<Fixtures>({
  context: async ({ context }, run) => {
    await blockAnalytics(context);
    await run(context);
  },
  page: async ({ page }, run) => {
    page.on('pageerror', err => {
      if (CANCEL_ROUTE_ERROR.test(err.message)) return;
    });
    await run(page);
  },
  dismissCookieBanner: async ({ page }, run) => {
    await run(() => dismissCookieBanner(page));
  },
});

export { expect };
