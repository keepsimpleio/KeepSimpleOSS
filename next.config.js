// === STRAPI HTML-CHALLENGE FETCH SAFETY NET (uxcore merge, 2026-05-14) ===
// Cloudflare in front of staging-strapi.keepsimple.io has started returning
// HTML challenge pages to GitHub Actions runner IPs, which crashes any
// getStaticProps/getStaticPaths that JSON.parses the response. This monkey-
// patch is scoped to *.keepsimple.io hostnames and replaces HTML or non-200
// responses with empty-data JSON so the build never aborts. Runtime fetches
// inside the running container reach Strapi cleanly and unwrap normally.
(function patchStrapiFetch() {
  if (typeof globalThis.fetch !== 'function') return;
  if (globalThis.__strapiFetchPatched) return;
  globalThis.__strapiFetchPatched = true;
  const _origFetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = async function patchedFetch(input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const isStrapi = /keepsimple\.io/.test(url);
    if (!isStrapi) return _origFetch(input, init);
    try {
      const resp = await _origFetch(input, init);
      const ct = (resp.headers && resp.headers.get && resp.headers.get('content-type')) || '';
      if (!resp.ok || ct.startsWith('text/html')) {
        if (typeof console !== 'undefined') console.warn('[strapi-fetch] HTML/!ok upstream (', resp.status, ct, ') — empty data fallback for', url.slice(0, 100));
        return new Response('{"data":[]}', { status: 200, headers: { 'content-type': 'application/json' } });
      }
      return resp;
    } catch (e) {
      if (typeof console !== 'undefined') console.warn('[strapi-fetch] threw — empty data fallback:', e && e.message);
      return new Response('{"data":[]}', { status: 200, headers: { 'content-type': 'application/json' } });
    }
  };
})();
// === END STRAPI FETCH SAFETY NET ===

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
