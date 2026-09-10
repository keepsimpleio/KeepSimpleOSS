import type {
  HomeLibraryCardView,
  StrapiLibrariesResponse,
  StrapiLibraryEntry,
  StrapiSingleShelfEntry,
} from '@local-types/library/library';

import { isFavorite, sortFavorites } from '@lib/library/favorites';

function stripHtml(html: string): string {
  if (!html) {
    return '';
  }

  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveMediaUrl(
  url: string | undefined,
  strapiBase: string | undefined,
): string | undefined {
  if (!url) {
    return undefined;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const base = (strapiBase ?? '').replace(/\/$/, '');
  if (!base) {
    return url;
  }

  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
}

// Counts follow each object's own type, not the shelf it stands on, and skip
// private shelves unless asked: a visitor's total and the owner's total must
// describe the same set of objects the reader can actually see.
export function countObjectsByType(
  shelves: StrapiSingleShelfEntry[],
  options?: { includePrivate?: boolean },
) {
  let bookCount = 0;
  let videoCount = 0;
  let songCount = 0;

  for (const shelf of shelves) {
    if (
      !options?.includePrivate &&
      shelf.attributes?.visibility === 'private'
    ) {
      continue;
    }
    for (const object of shelf.attributes?.objects?.data ?? []) {
      const type = object.attributes?.type ?? shelf.attributes?.type;
      if (type === 'book') {
        bookCount += 1;
      } else if (type === 'video') {
        videoCount += 1;
      } else if (type === 'audio') {
        songCount += 1;
      }
    }
  }

  return { bookCount, videoCount, songCount };
}

// The card's mini-shelf holds this many covers at most; the "View Library"
// tile takes the next slot as the row's continuation.
const MAX_CARD_COVERS = 4;

// Skips private shelves for the same reason `countObjectsByType` does: the card
// is the public view of a library, and covers are contents just as much as the
// counts are. Without this, a library whose every shelf is private reported
// "0 books" beside four of its private covers — and the library page it links
// to, which does filter, then looked empty.
function collectCoverUrls(
  shelves: StrapiSingleShelfEntry[],
  strapiBase?: string,
  limit: number = MAX_CARD_COVERS,
  skip: Set<number> = new Set(),
): string[] {
  const urls: string[] = [];
  if (limit <= 0) {
    return urls;
  }
  for (const shelf of shelves) {
    if (shelf.attributes?.visibility === 'private') {
      continue;
    }
    for (const obj of shelf.attributes?.objects?.data ?? []) {
      if (skip.has(obj.id)) {
        continue;
      }
      const resolved = resolveMediaUrl(
        obj.attributes?.coverImage?.data?.attributes?.url,
        strapiBase,
      );
      if (resolved) {
        urls.push(resolved);
      }
      if (urls.length >= limit) {
        return urls;
      }
    }
  }
  return urls;
}

export function mapStrapiLibraryEntryToCard(
  entry: StrapiLibraryEntry,
  strapiBase?: string,
): HomeLibraryCardView {
  const { id, attributes } = entry;
  const shelves = attributes.singleShelves?.data ?? [];
  const { bookCount, videoCount, songCount } = countObjectsByType(shelves);
  const publicFavorites =
    attributes.favoritesVisibility === 'public'
      ? sortFavorites(
          Array.from(
            new Map(
              shelves
                .filter(shelf => shelf.attributes.visibility === 'public')
                .flatMap(shelf => shelf.attributes.objects?.data ?? [])
                .filter(isFavorite)
                .map(object => [object.id, object]),
            ).values(),
          ),
        )
      : [];
  const favoriteCovers = publicFavorites
    .map(object =>
      resolveMediaUrl(
        object.attributes.coverImage?.data?.attributes?.url,
        strapiBase,
      ),
    )
    .filter((url): url is string => Boolean(url));
  // Favourites lead the mini-shelf for every library, however few there are:
  // a library with two starred books shows those two and fills the rest of
  // the row from its public shelves. The row used to switch to favourites
  // only when there were four or more, so a library with one or two starred
  // books showed none of them and looked like it had no favourites at all,
  // while a library with a dozen showed nothing else.
  const favoriteIds = new Set(publicFavorites.map(object => object.id));
  const coverUrls = [
    ...favoriteCovers.slice(0, MAX_CARD_COVERS),
    ...collectCoverUrls(
      shelves,
      strapiBase,
      MAX_CARD_COVERS - Math.min(favoriteCovers.length, MAX_CARD_COVERS),
      favoriteIds,
    ),
  ];

  const aboutLibraryPlain = stripHtml(
    attributes.libraryDetails?.aboutLibrary ?? '',
  );

  const username = attributes.user?.data?.attributes?.username;

  // Libraries are owner-scoped, so present them as "<owner>'s library" rather
  // than the raw `name`/id. Fall back to the explicit name, then about text,
  // then the id only when there's no linked username to build the label from.
  const libraryName = username
    ? `${username}'s library`
    : attributes.name?.trim() || aboutLibraryPlain || `Library ${id}`;

  // The card's "About" blurb is the library's own description, not the owner's
  // personal bio (`aboutMe`) — that's surfaced separately in the Author panel.
  const description = aboutLibraryPlain;

  const avatarUrl =
    attributes.avatar?.data?.attributes?.url ||
    attributes.user?.data?.attributes?.picture;

  return {
    id,
    username,
    libraryName,
    description,
    bookCount,
    videoCount,
    songCount,
    avatar: resolveMediaUrl(avatarUrl, strapiBase),
    coverUrls,
  };
}

export function mapStrapiLibrariesResponseToCards(
  response: StrapiLibrariesResponse,
  strapiBase?: string,
): HomeLibraryCardView[] {
  return response.data.map(entry =>
    mapStrapiLibraryEntryToCard(entry, strapiBase),
  );
}
