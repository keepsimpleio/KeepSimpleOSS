import Head from 'next/head';

import { DEFAULT_SEO } from '@constants/library/seo.config';

import { SEOProps } from './SEO.types';

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  url,
  image,
  type = 'website',
  favicon,
  ogTags,
  twitterTags,
  canonical,
}) => {
  const metaTitle = title || DEFAULT_SEO.title;
  const metaDescription = description || DEFAULT_SEO.description;
  const metaUrl = url || canonical || DEFAULT_SEO.url;
  const metaImage = image || DEFAULT_SEO.image;
  const metaFavicon = favicon || DEFAULT_SEO.favicon;

  // Open Graph tags
  const ogTitle = ogTags?.title || metaTitle;
  const ogDescription = ogTags?.description || metaDescription;
  const ogImage = ogTags?.image || metaImage;
  const ogUrl = ogTags?.url || metaUrl;
  const ogType = ogTags?.type || type;
  const ogSiteName = ogTags?.siteName || DEFAULT_SEO.siteName;
  const ogLocale = ogTags?.locale || DEFAULT_SEO.locale;

  // Twitter tags
  const twitterCard = twitterTags?.card || DEFAULT_SEO.twitter.card;
  const twitterSite = twitterTags?.site || DEFAULT_SEO.twitter.site;
  const twitterCreator = twitterTags?.creator || DEFAULT_SEO.twitter.creator;
  const twitterTitle = twitterTags?.title || metaTitle;
  const twitterDescription = twitterTags?.description || metaDescription;
  const twitterImage = twitterTags?.image || metaImage;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Favicon */}
      <link rel="icon" href={metaFavicon} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical || metaUrl} />

      {/* Robots */}
      <meta
        name="robots"
        content={
          process.env.NEXT_PUBLIC_INDEXING === 'off'
            ? 'noindex, nofollow'
            : 'index, follow'
        }
      />

      {/* Open Graph Tags */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={ogSiteName} />
      <meta property="og:locale" content={ogLocale} />

      {/* Twitter Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={twitterImage} />
    </Head>
  );
};

export default SEO;
