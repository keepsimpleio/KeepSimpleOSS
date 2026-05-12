import { expect, test } from '../fixtures/base';
import { runAxe } from '../helpers/axe';
import { expectNotErrorPage } from '../helpers/pageIdentity';

// Constrained axe run per QA_PLAN.md §2 P2 #9: four specific pages,
// serious/critical violations only, shared exclusion config.
// The rule-level exclusions live in tests/helpers/axe.ts — each is
// documented as a TODO for a future UX remediation pass.
const PAGES: { path: string; label: string }[] = [
  { path: '/en', label: 'homepage' },
  { path: '/articles/what-is-ux-core', label: 'canary article' },
  { path: '/company-management', label: 'company management' },
  {
    path: '/tools/longevity-protocol/about-project',
    label: 'longevity about-project',
  },
];

test.describe('P2 @a11y — axe smoke', () => {
  for (const { path, label } of PAGES) {
    test(`${label} (${path}) has no serious/critical axe violations`, async ({
      page,
      dismissCookieBanner,
    }, testInfo) => {
      // axe.analyze() evaluates a large ruleset inside the page context —
      // under parallel dev-server load it can push past the default 30s
      // test cap.
      test.setTimeout(90_000);

      // Guard before scanning — axe would otherwise happily analyze
      // Custom404 if a path typo slipped in.
      const response = await page.goto(path);
      await expectNotErrorPage(page, response, path);

      await dismissCookieBanner();
      await page.waitForLoadState('networkidle');

      const { violations } = await runAxe(page, testInfo);

      // If the assertion fails, Playwright prints the violations inline —
      // this is intentionally verbose so the failure message lists each
      // rule + selector without needing to open the attached report.
      expect(
        violations,
        `serious/critical axe violations on ${path}:\n` +
          JSON.stringify(violations, null, 2),
      ).toEqual([]);
    });
  }
});
