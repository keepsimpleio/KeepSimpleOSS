import type { Readings } from './readings';

/**
 * What search engines and answer engines read about each Atlas page: its
 * title, description, share picture and structured data.
 *
 * Every word comes from the page itself: titles and descriptions are copy
 * keys (copy.json, ru.json), so a Terminal push can change them like any
 * other page word, and the Ladder's list is built from the rungs the page
 * draws. The share pictures are rendered by scripts/ai-atlas/og/render.mjs;
 * OG_VERSION follows its VERSION.
 */

export const OG_VERSION = 'v2';

type SeoTab = 'atlas' | 'article' | 'ladder';

const SUFFIX: Record<SeoTab, string> = {
  atlas: '',
  article: 'Thesis',
  ladder: 'Ladder',
};
const PICTURE: Record<SeoTab, string> = {
  atlas: 'atlas',
  article: 'thesis',
  ladder: 'ladder',
};

const runsText = (runs: { t: string }[]) => runs.map(r => r.t).join('');

export function atlasSeo({
  tab,
  locale,
  words,
  readings,
  domain,
  path,
  atlasPath,
  modified,
}: {
  tab: SeoTab;
  locale: string;
  words: Record<string, any>;
  readings: Readings;
  domain: string;
  /* This page and the map, without the locale prefix. */
  path: string;
  atlasPath: string;
  modified?: string;
}) {
  const pick = (key: string) => words[key + SUFFIX[tab]] || words[key];
  const title: string = pick('seoTitle');
  const description: string = pick('seoDescription');
  const keywords: string = pick('seoKeywords');
  const imageAlt: string = pick('ogImageAlt');
  /* Armenian reads the English Atlas, so it shares the English picture. */
  const lang = locale === 'ru' ? 'ru' : 'en';
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const image = `${domain}/ai-atlas/og-${PICTURE[tab]}-${lang}-${OG_VERSION}.png`;
  const url = `${domain}${prefix}${path}`;
  const home = `${domain}${prefix}`;

  const author = {
    '@type': 'Person',
    name: 'Wolf Alexanyan',
    sameAs: ['https://x.com/AlexanyanWolf'],
  };
  const publisher = {
    '@type': 'Organization',
    name: 'KeepSimple',
    url: domain,
    logo: { '@type': 'ImageObject', url: `${domain}/assets/favicon.svg` },
  };
  const common = {
    url,
    inLanguage: lang,
    description,
    keywords,
    image: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
    author,
    publisher,
    ...(modified ? { dateModified: modified } : {}),
  };

  const crumbs = [
    { name: 'KeepSimple', item: home || domain },
    { name: words.seoTitle, item: `${domain}${prefix}${atlasPath}` },
    ...(tab === 'atlas' ? [] : [{ name: title, item: url }]),
  ].map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb }));

  const main: Record<string, unknown>[] = [];
  if (tab === 'article') {
    const text = [readings.article.lead, ...readings.article.paras]
      .map(runsText)
      .join(' ');
    main.push({
      '@type': 'Article',
      '@id': `${url}#thesis`,
      headline: title,
      mainEntityOfPage: url,
      articleSection: 'AI Atlas',
      wordCount: text.split(/\s+/).filter(Boolean).length,
      ...common,
    });
  } else if (tab === 'ladder') {
    const rungs = readings.ladder.rungs;
    main.push(
      {
        '@type': 'LearningResource',
        '@id': `${url}#ladder`,
        name: title,
        learningResourceType: 'Skill ladder',
        educationalLevel: 'Beginner to advanced',
        teaches: rungs.filter(r => r.skill).map(r => r.title),
        ...common,
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#rungs`,
        name: title,
        numberOfItems: rungs.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: rungs.map(r => ({
          '@type': 'ListItem',
          position: r.n + 1,
          name: r.title,
          description: [r.sub, r.skill].filter(Boolean).join(' '),
        })),
      },
    );
  } else {
    main.push({
      '@type': 'WebPage',
      '@id': `${url}#atlas`,
      name: title,
      ...common,
    });
  }

  return {
    title,
    description,
    keywords,
    imageAlt,
    image,
    ogType: tab === 'article' ? 'article' : 'website',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        ...main,
        { '@type': 'BreadcrumbList', itemListElement: crumbs },
      ],
    },
  };
}
