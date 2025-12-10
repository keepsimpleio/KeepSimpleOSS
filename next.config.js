/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require('dotenv');
const path = require('path');
const { existsSync } = require('fs');

module.exports = async () => {
  const envFile = `.env.${process.env.APP_ENV || 'local'}`;
  const envPath = path.join(__dirname, envFile);
  const isLocal = process.env.NODE_ENV === 'development';

  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.error(`Env file not found: ${envPath}`);
  }

  return {
    i18n: {
      locales: ['en', 'ru', 'hy'],
      defaultLocale: 'en',
    },
    assetPrefix: isLocal ? '' : '/keepsimple_next',
    async rewrites() {
      return [
        {
          source: '/assets/:path*',
          destination: '/keepsimple_/assets/:path*',
        },
        {
          source: '/fonts/:path*',
          destination: '/keepsimple_/fonts/:path*',
        },
        {
          source: '/audio/:path*',
          destination: '/keepsimple_/audio/:path*',
        },
        {
          source: '/static/:path*',
          destination: '/keepsimple_/static/:path*',
        },
        {
          source: '/robots.txt',
          destination: '/keepsimple_/robots.txt',
        },
      ];
    },
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
    compiler: {
      removeConsole:
        process.env.NODE_ENV === 'prod' ? { exclude: ['error'] } : false,
    },
    eslint: {
      ignoreDuringBuilds: true, // useful in CI/CD
    },
    images: {
      domains: [
        'lh3.googleusercontent.com',
        'cdn.discordapp.com',
        'strapi.keepsimple.io',
        'staging-strapi.keepsimple.io',
      ],
    },

    productionBrowserSourceMaps: true,
  };
};
