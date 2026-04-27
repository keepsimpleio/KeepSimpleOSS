/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3005';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/fixtures/**', '**/helpers/**'],
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  // Cap local workers. `next dev` compiles routes on-demand; unbounded
  // parallelism starves the server and the first-hit latency blows past
  // navigationTimeout on pages the compiler hasn't warmed yet. 2 is
  // deliberately conservative — the suite still runs under 3 min.
  workers: isCI ? 1 : 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    locale: 'en-US',
    trace: 'on-first-retry',
    testIdAttribute: 'data-testid',
    actionTimeout: 15_000,
    // Raised from 30s — accommodates `next dev`'s compile-on-first-hit cost
    // when multiple workers each land on cold routes simultaneously.
    navigationTimeout: 60_000,
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
  // Server selection:
  //   - PLAYWRIGHT_NO_SERVER=1 → don't manage one (e.g. workflow already
  //     started it, or running against a deployed URL).
  //   - APP_ENV=staging|prod → pre-built production server (`next start`).
  //     The CI workflow runs `next build` first, then this block boots
  //     `next start` against the chosen env file. See
  //     .github/workflows/playwright-scheduled.yml.
  //   - else → local `yarn dev`.
  webServer: process.env.PLAYWRIGHT_NO_SERVER
    ? undefined
    : {
        command:
          process.env.APP_ENV === 'staging' || process.env.APP_ENV === 'prod'
            ? `cross-env NODE_ENV=production APP_ENV=${process.env.APP_ENV} next start -p 3005`
            : 'yarn dev',
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 180_000,
        stdout: 'ignore',
        stderr: 'pipe',
      },
});
