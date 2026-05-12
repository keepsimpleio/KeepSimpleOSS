import { expect, test } from '../fixtures/base';
import { expectNotErrorPage } from '../helpers/pageIdentity';

const PAGES = [
  '/en',
  '/articles/what-is-ux-core',
  '/tools/longevity-protocol/about-project',
];

test.describe('P2 @images — Asset integrity sweep', () => {
  for (const path of PAGES) {
    test(`every <img> on ${path} has a sane src and local assets resolve`, async ({
      page,
      request,
      dismissCookieBanner,
    }) => {
      // Without this guard, a typo'd path would render Custom404 — whose
      // own <img> elements have sane srcs — and the sweep would pass.
      const response = await page.goto(path);
      await expectNotErrorPage(page, response, path);

      await dismissCookieBanner();

      // Scroll the page once to trigger lazy-load for below-the-fold imagery,
      // then give React a beat to flush the src attrs.
      await page.evaluate(() =>
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' }),
      );
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => window.scrollTo(0, 0));

      const srcs = await page.$$eval('img', nodes =>
        nodes.map(n => n.getAttribute('src') ?? ''),
      );

      expect(srcs.length, 'at least one <img> on the page').toBeGreaterThan(0);

      const badSrcs: string[] = [];
      const localSrcs = new Set<string>();
      for (const src of srcs) {
        if (!src) {
          badSrcs.push('<empty>');
          continue;
        }
        if (src.includes('undefined')) {
          badSrcs.push(src);
          continue;
        }
        // Collect local / rewritten asset paths for HEAD checks.
        if (src.startsWith('/') && !src.startsWith('//')) {
          localSrcs.add(src);
        }
      }

      expect(
        badSrcs,
        `images with missing or "undefined" src on ${path}`,
      ).toEqual([]);

      const failures: Array<{ url: string; status: number }> = [];
      for (const src of localSrcs) {
        const response = await request.get(src, { maxRedirects: 0 });
        const status = response.status();
        // Treat 2xx and 3xx as healthy (Next may rewrite / serve redirects
        // for asset prefix shuffling).
        if (status >= 400) {
          failures.push({ url: src, status });
        }
      }

      expect(failures, `local asset responses on ${path}`).toEqual([]);
    });
  }
});
