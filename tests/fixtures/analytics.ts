import type { BrowserContext } from '@playwright/test';

const ANALYTICS_HOSTS = [
  'mixpanel.com',
  'api-js.mixpanel.com',
  'api.mixpanel.com',
  'google-analytics.com',
  'googletagmanager.com',
  'analytics.ahrefs.com',
];

export async function blockAnalytics(context: BrowserContext): Promise<void> {
  await context.route('**/*', route => {
    const host = new URL(route.request().url()).hostname;
    if (ANALYTICS_HOSTS.some(blocked => host.endsWith(blocked))) {
      return route.fulfill({ status: 204, body: '' });
    }
    return route.continue();
  });
}
