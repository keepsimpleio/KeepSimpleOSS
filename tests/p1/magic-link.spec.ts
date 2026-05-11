import type { Route } from '@playwright/test';

import { expect, test } from '../fixtures/base';

const MAGIC_LINK_PATTERN = '**/api/auth/magic-link/**';

const fulfillJson = (route: Route, status: number, body: any) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });

// Strapi may be reached on different hosts depending on env, so we mock the
// magic-link endpoints regardless of host. Each spec installs its own handler.

test.describe('P1 @magic-link — /auth/magic-link consume flow', () => {
  test('new email — profile form appears, submit lands on /uxcore with JWT', async ({
    page,
  }) => {
    await page.route(MAGIC_LINK_PATTERN, async route => {
      const url = route.request().url();
      if (url.includes('/consume')) {
        return fulfillJson(route, 200, {
          requiresProfile: true,
          registrationToken: 'reg-token-1',
          email: 'new-user@example.com',
        });
      }
      if (url.includes('/complete-registration')) {
        return fulfillJson(route, 200, {
          jwt: 'fake-jwt-new-user',
          user: {
            id: 1,
            email: 'new-user@example.com',
            username: 'new-user',
          },
        });
      }
      return route.continue();
    });

    await page.goto('/auth/magic-link?token=new-user-token');

    const profileForm = page.locator('[data-cy="magic-link-profile-form"]');
    await expect(profileForm).toBeVisible();

    await page.locator('[data-cy="magic-link-profile-name"]').fill('Ada');
    await page
      .locator('[data-cy="magic-link-profile-surname"]')
      .fill('Lovelace');
    await page.locator('[data-cy="magic-link-profile-submit"]').click();

    await page.waitForURL(/\/uxcore(?:[/?#]|$)/, { timeout: 15_000 });

    const accessToken = await page.evaluate(() =>
      localStorage.getItem('accessToken'),
    );
    expect(accessToken).toBe('fake-jwt-new-user');
  });

  test('existing email — no profile form, lands on /uxcore with JWT', async ({
    page,
  }) => {
    await page.route(MAGIC_LINK_PATTERN, async route => {
      const url = route.request().url();
      if (url.includes('/consume')) {
        return fulfillJson(route, 200, {
          jwt: 'fake-jwt-existing',
          user: {
            id: 2,
            email: 'existing@example.com',
            username: 'existing',
          },
        });
      }
      return route.continue();
    });

    await page.goto('/auth/magic-link?token=existing-user-token');

    await page.waitForURL(/\/uxcore(?:[/?#]|$)/, { timeout: 15_000 });

    await expect(
      page.locator('[data-cy="magic-link-profile-form"]'),
    ).toBeHidden();

    const accessToken = await page.evaluate(() =>
      localStorage.getItem('accessToken'),
    );
    expect(accessToken).toBe('fake-jwt-existing');
  });

  test('TOKEN_ALREADY_USED — invalid-link UI with "Request a new link" button', async ({
    page,
  }) => {
    await page.route(MAGIC_LINK_PATTERN, async route => {
      if (route.request().url().includes('/consume')) {
        return fulfillJson(route, 400, {
          error: { code: 'TOKEN_ALREADY_USED', message: 'Already used' },
        });
      }
      return route.continue();
    });

    await page.goto('/auth/magic-link?token=already-used');

    const invalidCard = page.locator('[data-cy="magic-link-invalid"]');
    await expect(invalidCard).toBeVisible();

    const cta = page.locator('[data-cy="magic-link-request-new"]');
    await expect(cta).toBeVisible();
  });

  test('TOKEN_EXPIRED — invalid-link UI with "Request a new link" button', async ({
    page,
  }) => {
    await page.route(MAGIC_LINK_PATTERN, async route => {
      if (route.request().url().includes('/consume')) {
        return fulfillJson(route, 400, {
          error: { code: 'TOKEN_EXPIRED', message: 'Expired' },
        });
      }
      return route.continue();
    });

    await page.goto('/auth/magic-link?token=expired');

    await expect(page.locator('[data-cy="magic-link-invalid"]')).toBeVisible();
    await expect(
      page.locator('[data-cy="magic-link-request-new"]'),
    ).toBeVisible();
  });
});

test.describe('P1 @magic-link — /request limit-reached banner', () => {
  test('LIMIT_REACHED hides email form, shows banner, OAuth buttons remain', async ({
    page,
    dismissCookieBanner,
  }) => {
    await page.route(MAGIC_LINK_PATTERN, async route => {
      if (route.request().url().includes('/request')) {
        return fulfillJson(route, 429, {
          error: { code: 'LIMIT_REACHED', message: 'Too many requests' },
        });
      }
      return route.continue();
    });

    await page.goto('/');
    await dismissCookieBanner();

    // Open the LogIn modal via the global avatar/login trigger.
    await page
      .getByText(/^Log In$/)
      .first()
      .click();

    const emailForm = page.locator('[data-cy="magic-link-email-form"]');
    await expect(emailForm).toBeVisible();

    await page
      .locator('[data-cy="magic-link-email-input"]')
      .fill('rate-limited@example.com');
    await page.locator('[data-cy="magic-link-email-submit"]').click();

    await expect(
      page.locator('[data-cy="magic-link-limit-reached"]'),
    ).toBeVisible();
    await expect(emailForm).toBeHidden();

    // OAuth buttons stay visible — they're outside the email-form subtree.
    await expect(
      page.getByRole('button', { name: /continue with google/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /continue with discord/i }),
    ).toBeVisible();
  });
});
