const dotenv = require('dotenv');
const path = require('path');
const { existsSync } = require('fs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Move env loading to the top level, outside the config
  ...loadEnv(),

  i18n: {
    locales: ['en', 'ru', 'hy'],
    defaultLocale: 'en',
  },
  assetPrefix: process.env.NODE_ENV === 'development' ? '' : '/keepsimple_next',
  async rewrites() {
    return [
      { source: '/assets/:path*', destination: '/keepsimple_/assets/:path*' },
      { source: '/fonts/:path*', destination: '/keepsimple_/fonts/:path*' },
      { source: '/audio/:path*', destination: '/keepsimple_/audio/:path*' },
      { source: '/static/:path*', destination: '/keepsimple_/static/:path*' },
      { source: '/robots.txt', destination: '/keepsimple_/robots.txt' },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      // Next.js dev mode (Fast Refresh) requires eval.
      isDev ? "'unsafe-eval'" : '',
      'https://analytics.ahrefs.com',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://cdn.mxpnl.com',
    ]
      .filter(Boolean)
      .join(' ');
    const connectSrc = [
      "'self'",
      // Next.js dev HMR uses ws:// to localhost.
      isDev ? 'ws:' : '',
      'https://*.keepsimple.io',
      'https://metrics.administration.ae',
      'https://api.mixpanel.com',
      'https://www.google-analytics.com',
    ]
      .filter(Boolean)
      .join(' ');

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src ${scriptSrc}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://lh3.googleusercontent.com https://cdn.discordapp.com https://strapi.keepsimple.io https://staging-strapi.keepsimple.io https://www.google-analytics.com",
              "font-src 'self' data:",
              `connect-src ${connectSrc}`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'prod',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'cdn.discordapp.com',
      'strapi.keepsimple.io',
      'staging-strapi.keepsimple.io',
    ],
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  productionBrowserSourceMaps: true,
});

function loadEnv() {
  const envFile = `.env.${process.env.APP_ENV || 'local'}`;
  const envPath = path.join(__dirname, envFile);
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.error(`Env file not found: ${envPath}`);
  }
  return {};
}
