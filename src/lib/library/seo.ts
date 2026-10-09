import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';

import { DEFAULT_SEO } from '@constants/library/seo.config';

import type { StrapiLibraryEntry } from '@local-types/library/library';
import type { IObject } from '@local-types/library/object';

import { ownerDisplayName, ownerPerson } from './credit';
import { libraryPath } from './libraryPath';
import { objectSlug } from './objectSlug';

/** Markup out, one line of readable text in. */
export function plainText(value?: string | null): string {
  return String(value ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** A description a search result can hold, cut on a word. */
const clamp = (value: string, longest: number): string => {
  if (value.length <= longest) return value;

  const cut = value.slice(0, longest);
  const lastSpace = cut.lastIndexOf(' ');

  return `${(lastSpace > longest * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
};

export function librarySeo(library?: StrapiLibraryEntry) {
  const attributes = library?.attributes;
  const username = attributes?.user?.data?.attributes.username;
  const isWolf = username?.toLowerCase() === 'wolf';
  const displayName = ownerDisplayName(username);
  const title = displayName
    ? isWolf
      ? "Wolf Alexanyan's Library | Collected since 2007"
      : `${displayName}'s Library | KeepSimple`
    : DEFAULT_SEO.title;
  const description = displayName
    ? `${displayName}'s personal library${isWolf ? ', collected since 2007' : ''}. Includes personal notes and precise recommendations.`
    : DEFAULT_SEO.description;
  const imageOrigin =
    process.env.NEXT_PUBLIC_DOMAIN === 'https://staging.keepsimple.io'
      ? 'https://staging.keepsimple.io'
      : 'https://keepsimple.io';
  const image = isWolf
    ? `${imageOrigin}/keepsimple_/assets/library/og/wolf-library-v1.png`
    : username
      ? `${imageOrigin}/api/library/thumbnail/${encodeURIComponent(username.toLowerCase())}?v=1`
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
      // The library is credited to its owner by name, the same name the page
      // carries in its Author panel, so the signature a reader sees and the one
      // a crawler reads are one statement.
      ...(username
        ? { author: ownerPerson(username), creator: ownerPerson(username) }
        : {}),
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

/**
 * A book's own page.
 *
 * Every object in a library has an address of its own, and until now all of
 * them answered with the library's title, the library's description and the
 * library's picture: 165 URLs saying the same thing, which is the shape a
 * search engine reads as one page repeated. This gives each one its own
 * title, its own description drawn from the owner's note, its own cover as
 * the shared image, and a schema.org entry carrying the note and the rating
 * as what they are, one reader's review.
 */
export function objectSeo(
  object: IObject,
  base: ReturnType<typeof librarySeo>,
) {
  const { title, author, description, type, sourceUrl, publicationDate } =
    object.attributes;
  const owner = base.displayName ?? base.username ?? 'a KeepSimple reader';
  const note = plainText(description);
  const cover = resolveStrapiUrl(
    object.attributes.coverImage?.data?.attributes.url,
  );
  const url = `https://keepsimple.io${libraryPath(base.username)}/${objectSlug(object)}`;

  const named = author ? `${title} by ${author}` : title;
  const pageTitle = `${named} | ${owner}'s Library`;
  const pageDescription = note
    ? clamp(`${owner} on ${title}: ${note}`, 300)
    : `${named}, in ${owner}'s library on KeepSimple.`;

  const rating = object.attributes.overall;
  const reviewed = !!note || typeof rating === 'number';

  return {
    title: pageTitle,
    description: pageDescription,
    image: cover ?? base.image,
    // A cover is portrait and its true size is not known here; the library's
    // own card is a measured 1200 by 630, so it stays the wide preview and a
    // cover is offered without claiming a shape it may not have.
    imageWidth: cover ? null : base.imageWidth,
    imageHeight: cover ? null : base.imageHeight,
    imageAlt: cover ? `Cover of ${title}` : base.imageAlt,
    url,
    schema: {
      '@context': 'https://schema.org',
      '@type':
        type === 'book'
          ? 'Book'
          : type === 'video'
            ? 'VideoObject'
            : 'AudioObject',
      name: title,
      url,
      ...(author ? { author: { '@type': 'Person', name: author } } : {}),
      ...(cover ? { image: cover } : {}),
      ...(note ? { description: clamp(note, 5000) } : {}),
      ...(publicationDate ? { datePublished: publicationDate } : {}),
      ...(sourceUrl ? { sameAs: sourceUrl } : {}),
      isPartOf: {
        '@type': 'CollectionPage',
        name: base.title,
        url: `https://keepsimple.io${libraryPath(base.username)}`,
      },
      ...(reviewed
        ? {
            review: {
              '@type': 'Review',
              author: ownerPerson(base.username) ?? {
                '@type': 'Person',
                name: owner,
              },
              ...(note ? { reviewBody: clamp(note, 5000) } : {}),
              ...(typeof rating === 'number'
                ? {
                    reviewRating: {
                      '@type': 'Rating',
                      ratingValue: rating,
                      bestRating: 5,
                      worstRating: 1,
                    },
                  }
                : {}),
            },
          }
        : {}),
    },
  };
}
