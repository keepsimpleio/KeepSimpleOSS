export const DEFAULT_SEO = {
  title: 'KeepSimple Library | What people read, and why',
  description:
    'Libraries built by readers: books, videos and talks, each with the note that explains why it mattered. Open your own and give it a public address.',
  siteName: 'KeepSimple Library',
  url: 'https://keepsimple.io/library',
  image: 'https://keepsimple.io/keepsimple_/assets/library/library.png',
  // The title reads as a search result, not as alt text; a shared card needs
  // its own short line.
  imageAlt: 'The KeepSimple Library',
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
