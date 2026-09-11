import { expect, test } from '../fixtures/base';
import { expectNotErrorPage } from '../helpers/pageIdentity';

// motion-passport: exempt Playwright spec, no UI code or styles in this file.

/**
 * UX Core smoke: the list, search, the bias modal, the Guide, the Persona and
 * the Awareness Test entry, in English and in Russian.
 *
 * These are the paths a visitor takes through the bias data, so a change to
 * how that data reaches the page (locale trimming, field trimming, a fetch
 * rewrite) has to leave every one of them green before it goes anywhere.
 *
 * Anchors are the `data-cy` attributes the components already carry; the
 * bias count is the catalogue size the API contract expects
 * (`TOTAL_ITEMS_EXPECTED` in `src/uxcore/api/biases.ts`).
 */

const BIAS_COUNT = 105;
const LABEL = '[data-cy="search-result-item"]';
const LABEL_LINK = `${LABEL} a`;
const MODAL = '[data-cy="modal-body"]';
const FIRST_BIAS = {
  en: {
    path: '/uxcore/1-availability-heuristics',
    title: /Availability heuristics/i,
  },
  ru: {
    path: '/ru/uxcore/1-evristika-dostupnosti',
    title: /Эвристика доступности/i,
  },
};

test.describe('P1 @smoke — UX Core', () => {
  test('lists every bias in English and in Russian', async ({ page }) => {
    const cases = [
      // The pill text carries a leading space in the markup.
      { path: '/uxcore', locale: '', script: /^\s*[A-Za-z]/ },
      { path: '/ru/uxcore', locale: '/ru', script: /^\s*[А-Яа-яЁё]/ },
    ];

    for (const { path, locale, script } of cases) {
      const response = await page.goto(path);
      await expectNotErrorPage(page, response, path);

      // The label wrapper is a zero-size positioned box (its link renders as
      // `display: contents`), so visibility is asserted on the drawn pill.
      await expect(
        page.locator(`${LABEL_LINK} div`).first(),
        `labels at ${path}`,
      ).toBeVisible();
      await expect(page.locator(LABEL), `bias count at ${path}`).toHaveCount(
        BIAS_COUNT,
      );

      const first = page.locator(LABEL_LINK).first();
      await expect(first, `first label wording at ${path}`).toHaveText(script);
      await expect(first, `first label link at ${path}`).toHaveAttribute(
        'href',
        new RegExp(`^${locale}/uxcore/1-`),
      );
    }
  });

  test('search narrows the list to matching biases', async ({ page }) => {
    await page.goto('/uxcore');
    await expect(page.locator(LABEL)).toHaveCount(BIAS_COUNT);

    await page.fill('[data-cy="uxcore-search-input"]', 'anchoring');

    const hits = page.locator(`${LABEL}[data-state="hovered"]`);
    await expect(hits.first(), 'a search hit is marked').toBeAttached();
    expect(await hits.count(), 'search hits').toBeLessThan(BIAS_COUNT);
    await expect(hits.first()).toContainText(/anchoring/i);
  });

  test('a label opens the bias modal; Next moves on; close returns to the list', async ({
    page,
  }) => {
    await page.goto('/uxcore');
    await page.locator(LABEL_LINK).first().click();

    await expect(page).toHaveURL(/\/uxcore\/1-availability-heuristics$/);
    const modal = page.locator(MODAL);
    await expect(modal).toBeVisible();
    await expect(modal.locator('h1').first()).toHaveText(FIRST_BIAS.en.title);
    await expect(
      modal.locator('[data-cy="bias-body"]'),
      'bias body is rendered from the page data',
    ).toBeAttached();
    expect(
      (await modal.innerText()).length,
      'modal carries the description and usage text',
    ).toBeGreaterThan(500);

    await page.locator('[data-cy="arrow-next"]').click();
    await expect(page).toHaveURL(/\/uxcore\/2-attentional-bias$/);
    await expect(modal.locator('h1').first()).toHaveText(/Attentional bias/i);

    // The layout carries a second use-case row with the same anchor; the
    // modal's own switcher is the one under test.
    const hrSwitch = modal.locator('[data-cy="switch-hr"]');
    await hrSwitch.click();
    await expect(hrSwitch).toHaveClass(/activeHr/);

    await page.locator('[data-cy="uxcore-modal-close-button"]').click();
    await expect(page).toHaveURL(/\/uxcore(#.*)?$/);
    await expect(modal).toHaveCount(0);
  });

  test('a deep link renders the bias with its counterpart in the other language', async ({
    page,
  }) => {
    const en = await page.goto(FIRST_BIAS.en.path);
    await expectNotErrorPage(page, en, FIRST_BIAS.en.path);
    await expect(page.locator(MODAL).locator('h1').first()).toHaveText(
      FIRST_BIAS.en.title,
    );
    await expect(
      page.locator(`a[href="${FIRST_BIAS.ru.path}"]`),
      'link to the Russian page',
    ).toBeAttached();

    const ru = await page.goto(FIRST_BIAS.ru.path);
    await expectNotErrorPage(page, ru, FIRST_BIAS.ru.path);
    await expect(page.locator(MODAL).locator('h1').first()).toHaveText(
      FIRST_BIAS.ru.title,
    );
    await expect(
      page.locator(`a[href="${FIRST_BIAS.en.path}"]`),
      'link to the English page',
    ).toBeAttached();
  });

  test('the Guide lists its cases and a case opens with its biases', async ({
    page,
  }) => {
    const response = await page.goto('/uxcg');
    await expectNotErrorPage(page, response, '/uxcg');

    // The table keeps every case in the DOM and hides the ones behind the
    // active filter, so the count is taken over all and the click on a shown one.
    const cases = page.locator('[data-cy="open-question"]');
    const shown = page.locator('[data-cy="open-question"]:visible');
    await expect(shown.first()).toBeVisible();
    expect(await cases.count(), 'guide cases').toBeGreaterThanOrEqual(60);

    await shown.first().click();
    // A case page is a separate route; on `next dev` its first hit compiles.
    await expect(page).toHaveURL(/\/uxcg\/[a-z0-9-]+/, { timeout: 90_000 });
    const biasLinks = page.locator('a[href^="/uxcore/"]');
    await expect(
      biasLinks.first(),
      'a case references the biases behind it',
    ).toBeAttached();
  });

  test('the Persona shows the full bias catalogue in both languages', async ({
    page,
  }) => {
    const cases = [
      { path: '/uxcp', prefix: '/uxcore/' },
      { path: '/ru/uxcp', prefix: '/ru/uxcore/' },
    ];

    for (const { path, prefix } of cases) {
      const response = await page.goto(path);
      await expectNotErrorPage(page, response, path);

      await expect(page.locator('h1').first()).toHaveText(/UX CORE PERSONA/i);
      await expect(page.locator('table tbody tr').first()).toBeVisible();
      await expect(page.locator('[data-cy="add-bias"]').first()).toBeAttached();
      expect(
        await page.locator(`a[href^="${prefix}"]`).count(),
        `bias links at ${path}`,
      ).toBeGreaterThanOrEqual(100);
    }
  });

  test('list and Persona page data carry only the visitor locale', async ({
    page,
  }) => {
    const cases = [
      { path: '/uxcore', locale: 'en', key: 'biases' },
      { path: '/ru/uxcore', locale: 'ru', key: 'biases' },
      { path: '/uxcp', locale: 'en', key: 'strapiBiases' },
      { path: '/ru/uxcp', locale: 'ru', key: 'strapiBiases' },
    ];

    for (const { path, locale, key } of cases) {
      await page.goto(path);
      const props = await page.evaluate(
        () => (window as any).__NEXT_DATA__?.props?.pageProps ?? {},
      );

      expect(
        Object.keys(props[key] ?? {}),
        `${key} locales at ${path}`,
      ).toEqual([locale]);
      expect(props[key][locale].length, `${key} size at ${path}`).toBe(
        BIAS_COUNT,
      );
      if (props.questions) {
        expect(
          Object.keys(props.questions),
          `questions locales at ${path}`,
        ).toEqual([locale]);
      }
    }
  });

  test('the Awareness Test entry renders', async ({ page }) => {
    const response = await page.goto('/uxcat');
    await expectNotErrorPage(page, response, '/uxcat');

    await expect(page.locator('h1').first()).toHaveText(/Awareness Test/i);
    await expect(page.locator('[data-cy="start-test-btn"]')).toBeVisible();
  });
});
