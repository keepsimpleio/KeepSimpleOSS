import { DEFAULT_SEO } from '@constants/library/seo.config';

import type { StrapiLibraryEntry } from '@local-types/library/library';

import { libraryPath } from './libraryPath';
import { objectSlug } from './objectSlug';

export function librarySeo(library?: StrapiLibraryEntry) {
  const attributes = library?.attributes;
  const username = attributes?.user?.data?.attributes.username;
  const isWolf = username?.toLowerCase() === 'wolf';
  const displayName = isWolf ? 'Wolf Alexanyan' : username;
  const title = displayName
    ? isWolf
      ? "Wolf Alexanyan's Library | Collected since 2007"
      : `${displayName}'s Library | KeepSimple`
    : DEFAULT_SEO.title;
  const description = displayName
    ? `${displayName}'s personal library${isWolf ? ', collected since 2007' : ''}. Includes personal notes and precise recommendations.`
    : DEFAULT_SEO.description;
  const image = isWolf
    ? 'https://keepsimple.io/keepsimple_/assets/library/og/wolf-library-v1.png'
    : username
      ? `https://keepsimple.io/api/library/thumbnail/${encodeURIComponent(username.toLowerCase())}?v=1`
      : DEFAULT_SEO.image;
  const imageWidth = isWolf ? 1731 : username ? 1200 : 1920;
  const imageHeight = isWolf ? 909 : username ? 630 : 1280;
  const imageAlt = displayName
    ? `${displayName}'s Library. Includes personal notes and precise recommendations.`
    : DEFAULT_SEO.title;
  const url = `https://keepsimple.io${libraryPath(username)}`;
  const objects =
    attributes?.singleShelves?.data
      ?.filter(shelf => shelf.attributes.visibility === 'public')
      .flatMap(shelf => shelf.attributes.objects?.data ?? []) ?? [];
  const unique = Array.from(
    new Map(objects.map(object => [object.id, object])).values(),
  );
  return {
    title,
    description,
    username: username ?? null,
    displayName: displayName ?? null,
    image,
    imageWidth,
    imageHeight,
    imageAlt,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url,
      image,
      ...(username ? { author: { '@type': 'Person', name: displayName } } : {}),
      isPartOf: {
        '@type': 'WebSite',
        name: 'KeepSimple',
        url: 'https://keepsimple.io',
      },
      ...(library
        ? {
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: unique.length,
              itemListElement: unique.map((object, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type':
                    object.attributes.type === 'book'
                      ? 'Book'
                      : object.attributes.type === 'video'
                        ? 'VideoObject'
                        : 'AudioObject',
                  name: object.attributes.title,
                  url: `${url}/${objectSlug(object)}`,
                },
              })),
            },
          }
        : {}),
    },
  };
}
