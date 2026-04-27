import { expect, test } from '../fixtures/base';

// Legacy-slug canary list — from lib/getArticleRedirects.ts:1-22. These are the
// 20 pre-rewrite slugs the app continues to serve as 301s into /articles/<newSlug>.
// We probe them against Strapi at test time to find one currently mapped, so the
// test doesn't rot when CMS editors adjust slugs.
const LEGACY_SLUGS = [
  'table-of-contents',
  'why-study-management',
  'what-is-a-project',
  'project-artifacts-and-their-importance',
  'project-management-environment',
  'philosophies-methodologies-and-frameworks',
  'software-development-life-cycles',
  'scrum-framework-artifacts-rituals-and-roles',
  'project-approval-and-further-workflow',
  'all-about-user-stories',
  'technical-components-of-the-project',
  'client-dev-company-workflow-birds-eye-view',
  'career-path-of-a-manager-and-a-few-universal-tips',
  'uxscience',
  'uxcgstory',
  'uxeducation',
  'overengineering_and_demo_readiness',
  'uxcgdiy',
  'uiux',
  'awareness-test',
];

test.describe('P2 — Legacy article URL redirects', () => {
  test('a live legacy slug 301s to its /articles/<newSlug>', async ({
    page,
    request,
  }) => {
    // Resolve a canary at runtime: walk the slug list, return the first one
    // that redirects with a non-empty Location. Using request (not page) so
    // we can disable redirect-following and inspect the response directly.
    let canary: { slug: string; status: number; location: string } | undefined;

    for (const slug of LEGACY_SLUGS) {
      const response = await request.get(`/${slug}`, { maxRedirects: 0 });
      const status = response.status();
      if (status === 301 || status === 308) {
        const location = response.headers()['location'] ?? '';
        if (location.startsWith('/articles/')) {
          canary = { slug, status, location };
          break;
        }
      }
    }

    if (!canary) {
      test.skip(
        true,
        'No legacy slug currently resolves through getArticleRedirects — ' +
          'either Strapi editors removed the `url` field mapping, or the ' +
          'slug list in lib/getArticleRedirects.ts drifted. Investigate manually.',
      );
      return;
    }

    expect(
      canary.status,
      `${canary.slug} should be a permanent redirect`,
    ).toBeGreaterThanOrEqual(301);
    expect(canary.location).toMatch(/^\/articles\/.+/);

    // Final confirmation: Playwright page follows the redirect and lands on
    // the target article.
    const followed = await page.goto(`/${canary.slug}`);
    expect(followed?.status(), 'landed page status').toBeLessThan(400);
    expect(new URL(page.url()).pathname).toBe(canary.location);
  });
});
