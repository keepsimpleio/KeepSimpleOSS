import { expect, test } from '../fixtures/base';
import { expectNotErrorPage } from '../helpers/pageIdentity';

// Tests the branch at src/pages/articles/[page].tsx:121 — the recommended
// section renders only if `recommendedArticles.length > 0`. That list is
// empty when the article's Strapi category (`type`) has exactly one article.
// We probe Strapi at test time to find such a solo-category article; if
// none exists in current content, skip with a clear reason.

test.describe('P2 — Empty recommended-articles state', () => {
  test('an article whose category has only itself renders no Recommended section', async ({
    page,
    request,
    dismissCookieBanner,
  }) => {
    const strapi = process.env.NEXT_PUBLIC_STRAPI;
    if (!strapi) {
      test.skip(true, 'NEXT_PUBLIC_STRAPI not set — cannot probe CMS state');
      return;
    }

    const response = await request.get(
      `${strapi}/api/articles?locale=en&pagination[pageSize]=100`,
    );
    expect(response.ok(), 'Strapi articles fetch').toBe(true);
    const json = await response.json();
    const articles: Array<{ id: number; attributes: any }> = json?.data ?? [];

    const byType = new Map<string, Array<{ id: number; attributes: any }>>();
    for (const a of articles) {
      const type = a.attributes?.type;
      if (!type) continue;
      const bucket = byType.get(type) ?? [];
      bucket.push(a);
      byType.set(type, bucket);
    }

    const soloBucket = [...byType.entries()].find(
      ([, bucket]) => bucket.length === 1,
    );

    if (!soloBucket) {
      test.skip(
        true,
        'No Strapi category currently has exactly one article — all categories ' +
          'have ≥2, so the empty-recommended-articles branch cannot be exercised ' +
          'against live CMS state. Revisit when editorial shape changes.',
      );
      return;
    }

    const [soloType, [soloArticle]] = soloBucket;
    const slug = soloArticle.attributes?.newUrl;
    if (!slug) {
      test.skip(
        true,
        `Solo-category article (type=${soloType}, id=${soloArticle.id}) has no newUrl — cannot build a URL to visit`,
      );
      return;
    }

    const pageResponse = await page.goto(`/articles/${slug}`);
    // The assertion below ("no Recommended heading") is also true on the
    // 404 page, so a broken Strapi `newUrl` would otherwise pass.
    await expectNotErrorPage(page, pageResponse, `/articles/${slug}`);

    await dismissCookieBanner();

    // Article page renders; Recommended heading must NOT be present.
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: /recommended articles/i }),
    ).toHaveCount(0);
  });
});
