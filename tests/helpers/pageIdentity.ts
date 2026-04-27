import { expect, type Page, type Response } from '@playwright/test';

/**
 * Assert that a navigation landed on a real page, not Next.js's Custom404.
 *
 * Why both checks are needed:
 *
 * Next.js in this repo has two distinct 404 behaviors, and status alone
 * catches only one of them.
 *
 *   - **Top-level unknown paths** (e.g. `/this-does-not-exist`) hit
 *     `src/pages/[page].tsx` with `notFound: true` → **HTTP 404**.
 *
 *   - **Nested dynamic unknown paths** (e.g. `/articles/typo-slug`) hit
 *     `src/pages/articles/[page].tsx` with `fallback: 'blocking'` →
 *     **HTTP 200** with `<Custom404>` rendered inline (see the
 *     `Object.keys(data).length === 0` branch in that file).
 *
 * `expect(response?.status()).toBeLessThan(400)` only catches the first
 * class. For the second we compare the document title against the 404
 * page's title — `<Custom404>` sets `<title>Keepsimple | Error Page</title>`
 * at `src/pages/404.tsx:26`, and real pages override it via `SeoGenerator`.
 *
 * See QA_RECON.md §5 item 13 for the full write-up.
 */
export async function expectNotErrorPage(
  page: Page,
  response: Response | null,
  context?: string,
): Promise<void> {
  const suffix = context ? ` at ${context}` : '';
  expect(response?.status(), `bad status${suffix}`).toBeLessThan(400);
  await expect(page, `not Custom404${suffix}`).not.toHaveTitle(/Error Page/i);
}
