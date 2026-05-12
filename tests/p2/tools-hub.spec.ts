import { expect, test } from '../fixtures/base';

test.describe('P2 — Tools hub', () => {
  test('ready tools render before in-development tools', async ({
    page,
    dismissCookieBanner,
  }) => {
    const response = await page.goto('/tools');
    expect(response?.status(), 'GET /tools status').toBeLessThan(400);

    await dismissCookieBanner();

    // ToolContainer exposes `data-in-development="true|false"` (added in this
    // phase) so the ordering assertion doesn't depend on CSS class
    // introspection. Sort order is applied in src/pages/tools/index.tsx:31-39
    // — ready tools first, in-development last.
    const cards = page.getByTestId('tool-card');
    await expect(cards.first()).toBeVisible();

    const inDevelopmentFlags = await cards.evaluateAll(nodes =>
      nodes.map(n => n.getAttribute('data-in-development') === 'true'),
    );

    expect(
      inDevelopmentFlags.length,
      'at least one tool card rendered',
    ).toBeGreaterThanOrEqual(1);

    // No "ready" card (false) may appear after a "development" card (true).
    const firstDevelopmentIndex = inDevelopmentFlags.indexOf(true);
    if (firstDevelopmentIndex !== -1) {
      const trailingReady = inDevelopmentFlags
        .slice(firstDevelopmentIndex)
        .some(flag => !flag);
      expect(
        trailingReady,
        'no "ready" tool card appears after an in-development one',
      ).toBe(false);
    }
  });
});

test.describe('P2 — Vibesuite reachability', () => {
  test('/tools/vibesuite renders with an h1', async ({
    page,
    dismissCookieBanner,
  }) => {
    const response = await page.goto('/tools/vibesuite');
    expect(response?.status(), 'GET /tools/vibesuite status').toBeLessThan(400);

    await dismissCookieBanner();

    // Shallow assertion only — AGENTS.md:7 marks this page WIP.
    // MapClient.tsx:246 renders an h1 via the shared Heading component.
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
