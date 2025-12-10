import { defineConfig } from 'cypress';
import { GoogleSocialLogin } from 'cypress-social-logins/src/Plugins';

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3005',
    setupNodeEvents(on, config) {
      on('task', {
        // We don't need this for now.
        GoogleSocialLogin,
      });
      return config;
    },
    env: {
      googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
