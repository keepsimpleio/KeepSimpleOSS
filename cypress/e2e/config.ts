import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // setup code
    },
    baseUrl: 'http://localhost:3005',
    viewportWidth: 1920,
    viewportHeight: 900,
  },
});

export const viewports = [
  { name: 'Desktop', width: 1920, height: 920 },
  { name: 'Mobile', width: 375, height: 667 },
];
