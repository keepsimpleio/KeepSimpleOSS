import { Metadata } from 'next';
import { DEFAULT_SEO } from '@/config/seo.config';
import { SEOProps } from '@/components/molecules/SEO/SEO.types';

/**
 *
 * @example
 * // Static metadata in page.tsx
 * export const metadata = generateSEOMetadata({
 *   title: 'My Page',
 *   description: 'Page description',
 * });
 *
 * @example
 * // Dynamic metadata in page.tsx
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   return generateSEOMetadata({
 *     title: `Product ${params.id}`,
 *     description: 'Product description',
 *   });
 * }
 */
export function generateSEOMetadata(
  props: SEOProps = {
    title: '',
    description: '',
    url: '',
    image: '',
    type: 'website',
    canonical: '',
  }
): Metadata {
  const {
    title,
    description,
    url,
    image,
    type = 'website',
    ogTags,
    twitterTags,
    robots,
    canonical,
    noIndex = false,
    noFollow = false,
  } = props;

  const metaTitle = title || DEFAULT_SEO.title;
  const metaDescription = description || DEFAULT_SEO.description;
  const metaUrl = url || canonical || DEFAULT_SEO.url;
  const metaImage = image || DEFAULT_SEO.image;

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

  // Robots
  const shouldIndex = robots?.index ?? DEFAULT_SEO.robots.index;
  const shouldFollow = robots?.follow ?? DEFAULT_SEO.robots.follow;
  const robotsValue = `${noIndex || !shouldIndex ? 'noindex' : 'index'}, ${noFollow || !shouldFollow ? 'nofollow' : 'follow'}`;

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    robots: robotsValue,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      siteName: ogSiteName,
      locale: ogLocale,
      type: ogType as
        | 'website'
        | 'article'
        | 'book'
        | 'profile'
        | 'music.song'
        | 'music.album'
        | 'video.movie'
        | 'video.episode',
      images: [
        {
          url: ogImage,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: twitterCard as 'summary' | 'summary_large_image' | 'app' | 'player',
      site: twitterSite,
      creator: twitterCreator,
      title: twitterTitle,
      description: twitterDescription,
      images: [twitterImage],
    },
    alternates: {
      canonical: canonical || metaUrl,
    },
  };

  return metadata;
}

/**
 * Helper to get absolute URL
 */
export function getAbsoluteUrl(path: string): string {
  const baseUrl = DEFAULT_SEO.url;
  if (path.startsWith('http')) return path;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
