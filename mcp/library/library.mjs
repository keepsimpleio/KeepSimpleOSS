/**
 * The library as this server sees it: one session, one library, and the
 * handful of reads and writes the tools are built from.
 *
 * Nothing here invents an ownership rule. The CMS decides who may write what;
 * this only makes sure a call cannot wander out of the library the key was
 * written for, so a mistyped id fails here rather than reaching a stranger's
 * shelf.
 */

import { agentKey, handedSession, strapiUrl } from './config.mjs';

// A session lasts two hours at the far end. Renew well before that rather
// than discovering it expired mid-sequence.
const RENEW_AFTER_MS = 80 * 60 * 1000;

let current = null;

export class LibraryError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'LibraryError';
    this.status = status;
  }
}

const strapiMessage = (payload, fallback) =>
  payload?.error?.message ||
  payload?.message?.[0]?.messages?.[0]?.message ||
  fallback;

const request = async (method, path, { query, body, jwt } = {}) => {
  const url = new URL(`${strapiUrl}${path}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new LibraryError(
      strapiMessage(payload, `${method} ${path} failed (${response.status})`),
      response.status,
    );
  }

  return payload;
};

const openSession = async () => {
  if (handedSession) {
    const who = await request('GET', '/api/users/me', {
      jwt: handedSession.jwt,
    });

    current = {
      jwt: handedSession.jwt,
      libraryId: handedSession.libraryId,
      ownerId: who?.id ?? null,
      username: who?.username ?? null,
      openedAt: Date.now(),
    };

    return current;
  }

  const payload = await request('POST', '/api/auth/library-agent/session', {
    body: { key: agentKey() },
  });

  if (!payload?.jwt || !payload?.library?.id) {
    throw new LibraryError('The session answer carried no library', 502);
  }

  current = {
    jwt: payload.jwt,
    libraryId: Number(payload.library.id),
    ownerId: Number(payload.owner?.id),
    username: payload.owner?.username ?? null,
    openedAt: Date.now(),
  };

  return current;
};

export const session = async () => {
  if (current && Date.now() - current.openedAt < RENEW_AFTER_MS) return current;

  return openSession();
};

/** One call, retried once on a session that the CMS no longer accepts. */
const authed = async (method, path, options = {}) => {
  const live = await session();

  try {
    return await request(method, path, { ...options, jwt: live.jwt });
  } catch (error) {
    if (error.status !== 401) throw error;

    const renewed = await openSession();
    return request(method, path, { ...options, jwt: renewed.jwt });
  }
};

const shelfPopulate = {
  'populate[user]': true,
  'populate[singleShelves][populate][objects][populate][tags]': true,
  'populate[singleShelves][sort][0]': 'order:asc',
  'populate[singleShelves][populate][objects][sort][0]': 'order:asc',
};

/**
 * The whole library in one read: every shelf, every book on it with its note,
 * rating and labels. The same shape the Library page itself is drawn from.
 */
export const readLibrary = async () => {
  const live = await session();
  const payload = await authed('GET', `/api/libraries/${live.libraryId}`, {
    query: shelfPopulate,
  });

  const shelves = (payload?.data?.attributes?.singleShelves?.data ?? []).map(
    shelf => ({
      id: shelf.id,
      name: shelf.attributes.name,
      visibility: shelf.attributes.visibility,
      type: shelf.attributes.type,
      objects: (shelf.attributes.objects?.data ?? []).map(object => ({
        id: object.id,
        type: object.attributes.type,
        title: object.attributes.title,
        author: object.attributes.author,
        note: object.attributes.description ?? null,
        rating: object.attributes.overall ?? null,
        difficulty: object.attributes.difficulty ?? null,
        favorite: !!object.attributes.favorite,
        order: object.attributes.order ?? null,
        shelf: { id: shelf.id, name: shelf.attributes.name },
        tags: (object.attributes.tags?.data ?? []).map(tag => ({
          id: tag.id,
          name: tag.attributes.name,
        })),
      })),
    }),
  );

  return {
    libraryId: live.libraryId,
    owner: { id: live.ownerId, username: live.username },
    shelves,
    books: shelves.flatMap(shelf => shelf.objects),
  };
};

/** The library's tags, each with its own book sequence. */
export const readTags = async () => {
  const live = await session();
  const payload = await authed('GET', '/api/tags', {
    query: { libraryId: live.libraryId },
  });

  return (payload?.data ?? []).map(tag => ({
    id: tag.id,
    name: tag.attributes.name,
    color: tag.attributes.color,
    description: tag.attributes.description ?? null,
    slug: tag.attributes.slug,
    objects: tag.attributes.objects ?? [],
  }));
};

const normalize = value =>
  String(value ?? '')
    .trim()
    .toLowerCase();

/**
 * A book named the way a person names one. An id is taken as an id; a word is
 * matched against titles, exactly first and then as a fragment. Two matches
 * are an error rather than a guess: putting a note on the wrong book is worse
 * than answering with the candidates and asking again.
 */
export const resolveBook = (reference, books) => {
  if (typeof reference === 'number' || /^\d+$/.test(String(reference).trim())) {
    const id = Number(reference);
    const byId = books.find(book => book.id === id);

    if (!byId) throw new LibraryError(`No book with id ${id} in this library`);

    return byId;
  }

  const wanted = normalize(reference);

  if (!wanted) throw new LibraryError('Name a book');

  const exact = books.filter(book => normalize(book.title) === wanted);
  const matches = exact.length
    ? exact
    : books.filter(book => normalize(book.title).includes(wanted));

  if (matches.length === 0) {
    throw new LibraryError(`No book here is called "${reference}"`);
  }

  if (matches.length > 1) {
    throw new LibraryError(
      `"${reference}" names ${matches.length} books: ${matches
        .map(book => `${book.title} (${book.id})`)
        .join(', ')}. Name one exactly, or give its id.`,
    );
  }

  return matches[0];
};

/** The same reading for a tag, over the library's own palette. */
export const resolveTag = (reference, tags) => {
  if (typeof reference === 'number' || /^\d+$/.test(String(reference).trim())) {
    const id = Number(reference);
    const byId = tags.find(tag => tag.id === id);

    if (!byId) throw new LibraryError(`No tag with id ${id} in this library`);

    return byId;
  }

  const wanted = normalize(reference);
  const matches = tags.filter(
    tag => normalize(tag.name) === wanted || normalize(tag.slug) === wanted,
  );

  if (matches.length === 0) {
    throw new LibraryError(`This library has no tag called "${reference}"`);
  }

  return matches[0];
};

export const writeObject = (id, data) =>
  authed('PUT', `/api/objects/${id}`, { body: { data } });

export const createTag = data =>
  authed('POST', '/api/tags', {
    body: { data: { ...data, publishedAt: new Date().toISOString() } },
  });

export const updateTag = (id, data) =>
  authed('PUT', `/api/tags/${id}`, { body: { data } });

export const reorderTag = (tagId, objects) =>
  authed('POST', '/api/tags/reorder', { body: { tagId, objects } });

/**
 * Deleting a tag is not one of the five things an agent may do: it takes a
 * label off every book that carries it and the Library asks before it does
 * that. It exists here so the probe can clear up after itself.
 */
export const deleteTag = id => authed('DELETE', `/api/tags/${id}`);
