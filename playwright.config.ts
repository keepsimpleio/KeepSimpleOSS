import { defineConfig, devices } from '@playwright/test';

// Local: `yarn dev` on port 3005. CI: hit a deployed URL via PLAYWRIGHT_BASE_URL.
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3005';

// CI sets PLAYWRIGHT_NO_SERVER=1 to skip the local webServer and target a deployed URL.
const skipWebServer = process.env.PLAYWRIGHT_NO_SERVER === '1';

// Staging sits behind HTTP Basic Auth; production and local dev don't.
const httpCredentials =
  process.env.PLAYWRIGHT_HTTP_USERNAME && process.env.PLAYWRIGHT_HTTP_PASSWORD
    ? {
        username: process.env.PLAYWRIGHT_HTTP_USERNAME,
        password: process.env.PLAYWRIGHT_HTTP_PASSWORD,
      }
    : undefined;

export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // 1 worker locally: `next dev` compile-on-first-hit contention causes
  // intermittent net::ERR_ABORTED flakes when multiple workers hammer the
  // same uncompiled dynamic route at once. CI hits a prebuilt deployed URL
  // so parallelism is fine there; but scheduled runs use 1 worker anyway
  // to keep behavior consistent.
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL,
    httpCredentials,
    testIdAttribute: 'data-testid',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: skipWebServer
    ? undefined
    : {
        command: 'yarn dev',
        // Health-check against a known-200 route. Root (/) currently returns
        // 404 in dev (see QA_PLAN Phase 1 findings), so we can't use baseURL.
        // English is served at the root (no /en prefix) — use the canonical
        // path.
        url: `${baseURL}/uxcore`,
        reuseExistingServer: true,
        timeout: 180_000,
        stdout: 'ignore',
        stderr: 'pipe',
      },
});
