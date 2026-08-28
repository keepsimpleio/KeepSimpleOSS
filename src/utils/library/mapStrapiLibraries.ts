import type {
  HomeLibraryCardView,
  StrapiLibrariesResponse,
  StrapiLibraryEntry,
  StrapiSingleShelfEntry,
} from '@local-types/library/library';

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

export function countObjectsByType(shelves: StrapiSingleShelfEntry[]) {
  let bookCount = 0;
  let videoCount = 0;
  let songCount = 0;

  for (const shelf of shelves) {
    const type = shelf.attributes?.type;
    const objectCount = shelf.attributes?.objects?.data?.length ?? 0;
    if (type === 'book') {
      bookCount += objectCount;
    } else if (type === 'video') {
      videoCount += objectCount;
    } else if (type === 'audio') {
      songCount += objectCount;
    }
  }

  return { bookCount, videoCount, songCount };
}

// The card's mini-shelf holds this many covers at most; the "View Library"
// tile takes the next slot as the row's continuation.
const MAX_CARD_COVERS = 4;

function collectCoverUrls(
  shelves: StrapiSingleShelfEntry[],
  strapiBase?: string,
): string[] {
  const urls: string[] = [];
  for (const shelf of shelves) {
    for (const obj of shelf.attributes?.objects?.data ?? []) {
      const resolved = resolveMediaUrl(
        obj.attributes?.coverImage?.data?.attributes?.url,
        strapiBase,
      );
      if (resolved) {
        urls.push(resolved);
      }
      if (urls.length >= MAX_CARD_COVERS) {
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
  const coverUrls = collectCoverUrls(shelves, strapiBase);

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

  const avatarUrl = attributes.avatar?.data?.attributes?.url;

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
