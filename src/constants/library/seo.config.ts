export const DEFAULT_SEO = {
  title: 'keepSimple Library',
  description:
    'This is where KeepSimple team members and friends share what they’ve read and watched - books, videos, and ideas worth spreading.',
  siteName: 'keepSimple Library',
  url: 'https://keepsimple-library.com',
  image: '/images/og-image.png',
  favicon: '/favicon.ico',
  type: 'website',
  locale: 'en_US',
  twitter: {
    card: 'summary_large_image',
    site: '@keepsimple',
    creator: '@keepsimple',
  },
  robots: {
    index: true,
    follow: true,
  },
} as const;

export type SEOConfig = typeof DEFAULT_SEO;
