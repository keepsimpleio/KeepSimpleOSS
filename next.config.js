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
  async rewrites() {
    return [
      // Legacy prefix strip — both repos used to namespace public/ with
      // /keepsimple_/* and /uxcore_/* respectively. Public is now flat, so any
      // straggler path with those prefixes resolves to the bare equivalent.
      { source: '/keepsimple_/:path*', destination: '/:path*' },
      { source: '/uxcore_/:path*', destination: '/:path*' },
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
      'https://api-js.mixpanel.com',
      'https://www.google-analytics.com',
      'https://*.analytics.google.com',
      'https://stats.g.doubleclick.net',
      // Google Ads conversion: modern endpoint www.google.com/ccm/collect.
      'https://www.google.com',
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
              "img-src 'self' data: blob: https://lh3.googleusercontent.com https://cdn.discordapp.com https://strapi.keepsimple.io https://staging-strapi.keepsimple.io https://www.google-analytics.com https://flagcdn.com https://www.google.com",
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
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    // Library SCSS modules rely on placeholder selectors (e.g. %text-base)
    // that the original app injected globally. Scope that injection to the
    // migrated library files only so keepsimple's own SCSS stays untouched.
    additionalData: (content, loaderContext) => {
      const resourcePath = (loaderContext && loaderContext.resourcePath) || '';
      const isLibraryModule =
        /[\\/]src[\\/](components|layouts|pages)[\\/]library[\\/]/.test(
          resourcePath,
        );
      if (isLibraryModule) {
        return `@use "library/styles.scss" as *;\n${content}`;
      }
      return content;
    },
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
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            // SVGO's preset-default strips viewBox, which breaks icons rendered
            // at a smaller width/height than their intrinsic size (e.g. a 44x44
            // icon shown at 14px clips to its top-left corner instead of
            // scaling). Keep the viewBox so downscaled icons render fully.
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: { overrides: { removeViewBox: false } },
                },
                // preset-default's cleanupIds minifies internal ids to short
                // strings (a, b, c…) per file. SVGR inlines every icon into the
                // same DOM, so icons that reference their own clipPath/filter/
                // gradient via url(#id) (book, video, their shadows, delete,
                // edit) end up with colliding ids — url(#a) resolves to whichever
                // #a renders first, pointing at the wrong def and rendering blank.
                // prefixIds namespaces each file's ids by filename so they stay
                // unique across icons.
                'prefixIds',
              ],
            },
          },
        },
      ],
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
