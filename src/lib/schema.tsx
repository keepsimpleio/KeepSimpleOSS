export function generateSchema(
  headline: string,
  description: string,
  url: string,
  image: string,
  publishedAt: string,
  updatedAt: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    headline: headline || 'KeepSimple',
    description: description || '',
    url: url || `https://keepsimple.io/`,
    image: image || '',
    datePublished: publishedAt || undefined,
    dateModified: updatedAt || undefined,
    author: {
      '@type': 'Person',
      name: 'Wolf Alexanyan',
    },
    publisher: {
      '@type': 'Organization',
      name: 'KeepSimple',
      logo: {
        '@type': 'ImageObject',
        url: 'https://keepsimple.io/assets/favicon.svg',
      },
    },
  };
}
