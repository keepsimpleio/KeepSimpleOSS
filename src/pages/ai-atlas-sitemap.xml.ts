import type { GetServerSideProps } from 'next';

import { readStoredGuide } from '@lib/aiAtlas/store';

/**
 * The Atlas pages offered to search: the map, the Thesis and the Ladder, in
 * English and Russian, each pointing at its other language.
 *
 * Strapi's sitemap plugin lists only its own content types, and the Atlas is
 * not one of them; on 2026-10-13 not one Atlas address was in any sitemap.
 * Armenian is left out: it shows the English Atlas, so it would only be a
 * duplicate of the English page.
 */

const ORIGIN = 'https://keepsimple.io';
const PATHS = ['/ai-atlas', '/ai-atlas/thesis', '/ai-atlas/ladder'];
const LOCALES = [
  { lang: 'en', prefix: '' },
  { lang: 'ru', prefix: '/ru' },
];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  /* generatedAt is pushed content: a value that is not a date only drops
     lastmod, it never turns the sitemap into an error. */
  const guide = await readStoredGuide().catch(() => null);
  const modified = new Date(guide?.generatedAt ?? NaN);
  const lastmod = Number.isNaN(modified.getTime())
    ? ''
    : `<lastmod>${modified.toISOString()}</lastmod>`;
  const alternates = (path: string) =>
    [
      ...LOCALES.map(
        ({ lang, prefix }) =>
          `<xhtml:link rel="alternate" hreflang="${lang}" href="${ORIGIN}${prefix}${path}"/>`,
      ),
      `<xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${path}"/>`,
    ].join('');
  const urls = PATHS.flatMap(path =>
    LOCALES.map(
      ({ prefix }) =>
        `<url><loc>${ORIGIN}${prefix}${path}</loc>${lastmod}${alternates(path)}</url>`,
    ),
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
  res.write(body);
  res.end();

  return { props: {} };
};

const AtlasSitemap = () => null;

export default AtlasSitemap;
