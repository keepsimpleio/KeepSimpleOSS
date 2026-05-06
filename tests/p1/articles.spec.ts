import { expect, test } from '../fixtures/base';

test.describe('P1 @articles — /articles category scroll', () => {
  test('clicking the Project Management category button scrolls the page', async ({
    page,
    dismissCookieBanner,
  }) => {
    await page.goto('/articles');
    await dismissCookieBanner();

    const initialY = await page.evaluate(() => window.scrollY);

    // ArticleCategoryButton renders a plain <button> with the category name —
    // no stable data-cy. See src/components/ArticleCategoryButton/*.
    const pmButton = page.getByRole('button', { name: /project management/i });
    await expect(pmButton).toBeVisible();
    await pmButton.click();

    // Scroll is smooth (behavior: 'smooth') — poll until the browser settles.
    await expect
      .poll(async () => await page.evaluate(() => window.scrollY), {
        timeout: 5_000,
      })
      .toBeGreaterThan(initialY + 100);
  });
});

test.describe('P1 @articles — image zoom on a detail page', () => {
  const SLUG = 'what-is-ux-core';

  test(`clicking a zoom-trigger on /${SLUG} opens and dismisses ZoomBlock`, async ({
    page,
    dismissCookieBanner,
  }) => {
    await page.goto(`/articles/${SLUG}`);
    await dismissCookieBanner();

    const zoomTrigger = page.locator('[data-cy="zoom-trigger"]').first();
    await zoomTrigger.scrollIntoViewIfNeeded();
    await zoomTrigger.click();

    const zoomedImage = page.locator('[data-cy="zoomed-image"]');
    await expect(zoomedImage).toBeVisible();

    // Clicking the overlay dismisses it — ZoomBlock.onClick at ZoomBlock.tsx:37.
    await zoomedImage.click();
    await expect(zoomedImage).toBeHidden();
  });
});

test.describe('P1 @articles — recommended articles section', () => {
  const SLUG = 'what-is-ux-core';

  // Recommended section renders only when recommendedArticles.length > 0
  // (src/pages/articles/[page].tsx:121). The title is hardcoded English
  // ("Recommended articles") / Russian ("Рекомендуемые статьи") — selecting
  // on that heading is content-stable.
  test(`a UX Core article shows the Recommended section with ≥1 card`, async ({
    page,
    dismissCookieBanner,
  }) => {
    await page.goto(`/articles/${SLUG}`);
    await dismissCookieBanner();

    const recommendedHeading = page.getByRole('heading', {
      level: 2,
      name: /recommended articles/i,
    });
    await recommendedHeading.scrollIntoViewIfNeeded();
    await expect(recommendedHeading).toBeVisible();

    // The <section> wrapping ArticleSection contains the <h2> title and
    // one or more ArticleInfo cards (data-cy="article-link").
    const recommendedSection = page
      .locator('section', { has: recommendedHeading })
      .first();
    const cards = recommendedSection.locator('[data-cy="article-link"]');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });
});
