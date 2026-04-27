import { expect, test } from '../fixtures/base';

const DIET_PAGE = '/tools/longevity-protocol/habits/diet';

test.describe('P1 @longevity — Diet habit page', () => {
  // This pair of tests is the canonical example of the data-active /
  // data-selected-id assertion pattern.
  //
  // WHY this pattern matters: React state → DOM data attributes makes the
  // source of truth observable from the test without guessing at animations,
  // class-name flips, or network timings. DietResults.tsx:35 and YourDiet.tsx:47-48
  // expose the state directly; we assert on it.
  //
  // Any future interactive-widget test should prefer this approach over
  // waiting on CSS classes or text changes. See QA_PLAN.md §5 ("what to port" #2).

  test('selecting a DietResults item flips data-active and updates YourDiet', async ({
    page,
    dismissCookieBanner,
  }) => {
    await page.goto(DIET_PAGE);
    await dismissCookieBanner();

    const items = page.locator('[data-cy="diet-results-item"]');
    const yourDiet = page.locator('[data-cy="your-diet"]').first();

    await items.first().scrollIntoViewIfNeeded();

    await expect(items.nth(0)).toHaveAttribute('data-active', 'true');
    await expect(items.nth(1)).toHaveAttribute('data-active', 'false');

    const idBefore = await yourDiet.getAttribute('data-selected-id');

    // Click the inner <img> — the parent div's onClick bubbles, and the img
    // hit target avoids the ::after overlay the css applies on :hover.
    await items.nth(1).locator('img').first().click();

    await expect(items.nth(1)).toHaveAttribute('data-active', 'true');
    await expect(items.nth(0)).toHaveAttribute('data-active', 'false');
    await expect(yourDiet).toHaveAttribute('data-active', 'true');
    await expect(yourDiet).not.toHaveAttribute(
      'data-selected-id',
      idBefore ?? '',
    );
  });

  test('WhatToEatOrAvoid checkbox switches exclusively between items', async ({
    page,
    dismissCookieBanner,
  }) => {
    await page.goto(DIET_PAGE);
    await dismissCookieBanner();

    const checkboxes = page.locator('[data-cy="diet-checkbox"]');
    await checkboxes.first().scrollIntoViewIfNeeded();

    // First item starts pre-selected (checkmark present, second has none).
    await expect(
      checkboxes.nth(0).locator('[data-cy="diet-checkmark"]'),
    ).toHaveCount(1);
    await expect(
      checkboxes.nth(1).locator('[data-cy="diet-checkmark"]'),
    ).toHaveCount(0);

    // DietLayout renders two WhatToEatOrAvoid lists: "what NOT to eat"
    // (no id, no checkbox) and "what to eat" (has id + checkbox).
    // `[data-cy="what-to-eat-or-avoid"]` matches both, but only the "what
    // to eat" cards have diet-checkbox children. Filter by that to isolate
    // the interactive subset before taking nth(1).
    const interactiveCards = page
      .locator('[data-cy="what-to-eat-or-avoid"]')
      .filter({ has: page.locator('[data-cy="diet-checkbox"]') });
    await interactiveCards.nth(1).click();

    await expect(
      checkboxes.nth(1).locator('[data-cy="diet-checkmark"]'),
    ).toHaveCount(1);
    await expect(
      checkboxes.nth(0).locator('[data-cy="diet-checkmark"]'),
    ).toHaveCount(0);
  });
});
