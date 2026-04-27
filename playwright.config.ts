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
  webServer: process.env.PLAYWRIGHT_NO_SERVER
    ? undefined
    : {
        command: 'yarn dev',
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 120_000,
        stdout: 'ignore',
        stderr: 'pipe',
      },
});
