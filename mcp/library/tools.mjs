/**
 * The six things an agent may do to a library, and nothing else.
 *
 * Each tool takes books and tags the way a person names them, a title or a
 * word, and turns that into the ids the CMS wants. A name that matches two
 * books is refused with both candidates rather than guessed at.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

import { record } from './journal.mjs';
import {
  createObject,
  createTag,
  fetchCover,
  LibraryError,
  readLibrary,
  readTags,
  reorderTag,
  resolveBook,
  resolveTag,
  searchBooks,
  updateTag,
  uploadCover,
  writeObject,
} from './library.mjs';

const DIFFICULTIES = ['very_hard', 'hard', 'moderate', 'easy'];

const NOTE_PREVIEW = 400;

const repoRoot = path.resolve(new URL('../..', import.meta.url).pathname);

/**
 * The Library's own limits, read from the constant the forms read so the two
 * cannot drift; the figures beside each name are what they were on
 * 2026-09-10, used only outside a checkout. Breaking a limit here costs a
 * round trip and gives a sentence the caller can act on. The note cap is the
 * CMS schema's own (`object.description`, 5000) and has no frontend constant.
 */
const limit = (name, fallback) => {
  try {
    const source = readFileSync(
      path.join(repoRoot, 'src/constants/library/common.ts'),
      'utf8',
    );
    const match = new RegExp(`export const ${name} = (\\d+);`).exec(source);

    return match ? Number(match[1]) : fallback;
  } catch {
    return fallback;
  }
};

const MAX_TAG_NAME_LENGTH = limit('MAX_TAG_NAME_LENGTH', 20);
const MAX_TAG_DESCRIPTION_LENGTH = limit('MAX_TAG_DESCRIPTION_LENGTH', 180);
const MAX_TAGS_PER_OBJECT = limit('MAX_TAGS_PER_OBJECT', 10);
const MAX_TAGS_PER_LIBRARY = limit('MAX_TAGS_PER_LIBRARY', 13);
const MAX_NOTE_LENGTH = 5000;
const MAX_OBJECTS_PER_SHELF = limit('MAX_OBJECTS_PER_SHELF', 50);
const MAX_OBJECTS_PER_LIBRARY = limit('MAX_OBJECTS_PER_LIBRARY', 300);
// The Add form's own caps (OBJECT_FIELD_LIMITS), which the CMS enforces too.
const MAX_BOOK_TITLE_LENGTH = 200;
const MAX_AUTHOR_LENGTH = 100;

/**
 * The palette the tag form offers, read from the constant the form itself
 * reads so the two cannot drift. Outside a checkout there is no palette and a
 * colour has to be named.
 */
const palette = () => {
  try {
    const source = readFileSync(
      path.join(repoRoot, 'src/constants/library/tags.ts'),
      'utf8',
    );

    return [...source.matchAll(/#[0-9A-Fa-f]{6}/g)].map(match => match[0]);
  } catch {
    return [];
  }
};

const shorten = (note, mode) => {
  if (!note || mode === 'none') return undefined;
  if (mode === 'full' || note.length <= NOTE_PREVIEW) return note;

  return `${note.slice(0, NOTE_PREVIEW)}… (${note.length} characters, ask for notes: "full")`;
};

const bookLine = (book, notes) => ({
  id: book.id,
  title: book.title,
  author: book.author ?? undefined,
  shelf: book.shelf.name,
  tags: book.tags.map(tag => tag.name),
  rating: book.rating ?? undefined,
  difficulty: book.difficulty ?? undefined,
  favorite: book.favorite || undefined,
  note: shorten(book.note, notes),
});

/**
 * Titles compared the way a reader compares them: case, punctuation and
 * spacing do not make two books out of one.
 */
const foldTitle = value =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

/** The catalogue's date as the calendar day the CMS stores, or nothing. */
const calendarDate = raw => {
  const [year, month, day] = String(raw ?? '')
    .trim()
    .split('T')[0]
    .split('-')
    .map(Number);

  if (!year || Number.isNaN(year) || year < 1000) return undefined;

  const pad = value => String(value).padStart(2, '0');

  return `${year}-${pad(month || 1)}-${pad(day || 1)}`;
};

const candidateLine = (suggestion, index) => ({
  pick: index + 1,
  title: suggestion.title,
  author: suggestion.author ?? undefined,
  published: suggestion.publicationDate ?? undefined,
  cover: suggestion.coverUrl ? true : undefined,
  from: suggestion.memberLibrary?.username
    ? `${suggestion.memberLibrary.username}'s library`
    : undefined,
});

/**
 * A shelf named the way a person names one, among the shelves that hold
 * books. Two matches are refused with both, like a book that names two.
 */
const resolveShelf = (reference, shelves) => {
  const names = shelves.map(shelf => shelf.name).join(', ');

  if (reference === undefined || reference === null || reference === '') {
    if (shelves.length === 1) return shelves[0];

    throw new LibraryError(`Name the shelf. This library has: ${names}`);
  }

  if (/^\d+$/.test(String(reference).trim())) {
    const byId = shelves.find(shelf => shelf.id === Number(reference));

    if (!byId) throw new LibraryError(`No book shelf with id ${reference}`);

    return byId;
  }

  const wanted = String(reference).trim().toLowerCase();
  const exact = shelves.filter(shelf => shelf.name?.toLowerCase() === wanted);
  const matches = exact.length
    ? exact
    : shelves.filter(shelf => shelf.name?.toLowerCase().includes(wanted));

  if (matches.length === 0) {
    throw new LibraryError(
      `No book shelf is called "${reference}". This library has: ${names}`,
    );
  }

  if (matches.length > 1) {
    throw new LibraryError(
      `"${reference}" names ${matches.length} shelves: ${matches
        .map(shelf => shelf.name)
        .join(', ')}. Name one exactly.`,
    );
  }

  return matches[0];
};

const asText = value => ({
  content: [{ type: 'text', text: JSON.stringify(value, null, 1) }],
});

export const definitions = [
  {
    name: 'library_books',
    description:
      'The books in the library, with their notes, ratings, shelves and tags. Narrow with a word from the title or author, a tag, or a shelf. Start here: every other tool takes the titles and ids this returns.',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'A word in the title or author',
        },
        tag: { type: 'string', description: 'Only books carrying this tag' },
        shelf: { type: 'string', description: 'Only books on this shelf' },
        notes: {
          type: 'string',
          enum: ['full', 'short', 'none'],
          description: 'How much of each note to return. Default short.',
        },
        limit: {
          type: 'number',
          description: 'Most books to return (default 100)',
        },
      },
    },
  },
  {
    name: 'library_tag',
    description:
      "Create a tag, or change the name, colour or description of one. A library keeps at most 13 tags; the name is at most 20 characters and the description at most 180. Renaming carries the tag's address with it.",
    inputSchema: {
      type: 'object',
      properties: {
        tag: {
          type: 'string',
          description:
            'The tag to change, by name or id. Leave out to create one.',
        },
        name: { type: 'string' },
        color: {
          type: 'string',
          description:
            'Hex colour. A new tag takes an unused palette colour when this is left out.',
        },
        description: {
          type: 'string',
          description:
            "What this tag is for, in the owner's words. Shown on hover.",
        },
        instruction: {
          type: 'string',
          description:
            "The words this write was asked in, ideally the owner's own. Kept in the journal beside the write; a production change without them is a change nobody ordered.",
        },
      },
    },
  },
  {
    name: 'library_tag_books',
    description:
      "Put a tag on books, or take it off. Names books by title or id. A newly tagged book lands at the end of the tag's own order.",
    inputSchema: {
      type: 'object',
      properties: {
        tag: { type: 'string', description: 'The tag, by name or id' },
        add: {
          type: 'array',
          items: { type: 'string' },
          description: 'Books to label',
        },
        remove: {
          type: 'array',
          items: { type: 'string' },
          description: 'Books to unlabel',
        },
        instruction: {
          type: 'string',
          description:
            "The words this write was asked in, ideally the owner's own. Kept in the journal beside the write; a production change without them is a change nobody ordered.",
        },
      },
      required: ['tag'],
    },
  },
  {
    name: 'library_tag_order',
    description:
      "Set the order the tag's books stand in when the library is filtered down to it. A partial list is enough: the books named take the front, in the order given, and the rest keep their sequence behind them.",
    inputSchema: {
      type: 'object',
      properties: {
        tag: { type: 'string', description: 'The tag, by name or id' },
        order: {
          type: 'array',
          items: { type: 'string' },
          description: 'Books by title or id, first to last',
        },
        instruction: {
          type: 'string',
          description:
            "The words this write was asked in, ideally the owner's own. Kept in the journal beside the write; a production change without them is a change nobody ordered.",
        },
      },
      required: ['tag', 'order'],
    },
  },
  {
    name: 'library_book',
    description:
      "Change a book's note, rating or difficulty. The note is the owner's own writing: plain text with line breaks, and <strong>, <em>, <s> and links if you want them. Pass null to clear a rating or difficulty.",
    inputSchema: {
      type: 'object',
      properties: {
        book: { type: 'string', description: 'The book, by title or id' },
        note: {
          type: 'string',
          description: 'The note, replacing whatever is there',
        },
        rating: {
          type: ['number', 'null'],
          description: '1 to 5, or null to clear',
        },
        difficulty: {
          type: ['string', 'null'],
          enum: [...DIFFICULTIES, null],
          description: 'very_hard, hard, moderate, easy, or null to clear',
        },
        instruction: {
          type: 'string',
          description:
            "The words this write was asked in, ideally the owner's own. Kept in the journal beside the write; a production change without them is a change nobody ordered.",
        },
      },
      required: ['book'],
    },
  },
  {
    name: 'library_add_book',
    description:
      "Add a book to a shelf. The title is looked up in the same search the Library's Add form uses, which supplies the author, the publication date and the cover. When the search cannot settle on one book it adds nothing and answers with numbered candidates: call again with pick. A title the library already holds is refused. The note is the owner's own writing and stays empty unless one is given.",
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'The book, by title' },
        author: {
          type: 'string',
          description:
            'The author, to settle between books that share the title',
        },
        shelf: {
          type: 'string',
          description:
            'The shelf, by name or id. May be left out only when the library has one book shelf.',
        },
        pick: {
          type: 'number',
          description: 'The number of a candidate from an earlier answer',
        },
        cover: {
          type: 'string',
          enum: ['auto', 'none'],
          description:
            'auto (default) takes the cover the search found and adds nothing when it cannot be fetched; none adds the book without a cover.',
        },
        unlisted: {
          type: 'boolean',
          description:
            'Skip the search and add the title and author exactly as given, without a cover. For a book no catalogue knows.',
        },
        note: { type: 'string', description: "The owner's note on the book" },
        rating: { type: 'number', description: '1 to 5' },
        difficulty: {
          type: 'string',
          enum: DIFFICULTIES,
          description: 'very_hard, hard, moderate or easy',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags to put on it, by name or id',
        },
        instruction: {
          type: 'string',
          description:
            "The words this write was asked in, ideally the owner's own. Kept in the journal beside the write; a production change without them is a change nobody ordered.",
        },
      },
      required: ['title'],
    },
  },
];

const handlers = {
  async library_books(args) {
    const notes = args.notes ?? 'short';
    const library = await readLibrary();
    const tags = await readTags();

    let books = library.books.filter(book => book.type === 'book');

    if (args.tag) {
      const tag = resolveTag(args.tag, tags);
      const inTag = new Set(tag.objects);
      books = books.filter(book => inTag.has(book.id));
    }

    if (args.shelf) {
      const wanted = String(args.shelf).trim().toLowerCase();
      books = books.filter(book =>
        book.shelf.name?.toLowerCase().includes(wanted),
      );
    }

    if (args.search) {
      const wanted = String(args.search).trim().toLowerCase();
      books = books.filter(book =>
        `${book.title} ${book.author ?? ''}`.toLowerCase().includes(wanted),
      );
    }

    const limit = Math.max(1, Math.min(Number(args.limit) || 100, 500));

    return {
      library: library.libraryId,
      owner: library.owner.username,
      shelves: library.shelves.map(shelf => ({
        name: shelf.name,
        visibility: shelf.visibility,
        books: shelf.objects.length,
      })),
      tags: tags.map(tag => ({ name: tag.name, books: tag.objects.length })),
      matched: books.length,
      books: books.slice(0, limit).map(book => bookLine(book, notes)),
    };
  },

  async library_tag(args) {
    const tags = await readTags();

    if (args.name && args.name.length > MAX_TAG_NAME_LENGTH) {
      throw new LibraryError(
        `A tag name is at most ${MAX_TAG_NAME_LENGTH} characters`,
      );
    }

    if (
      args.description &&
      args.description.length > MAX_TAG_DESCRIPTION_LENGTH
    ) {
      throw new LibraryError(
        `A tag description is at most ${MAX_TAG_DESCRIPTION_LENGTH} characters`,
      );
    }

    if (args.tag) {
      const tag = resolveTag(args.tag, tags);
      const data = {};

      if (args.name !== undefined) data.name = args.name;
      if (args.color !== undefined) data.color = args.color;
      if (args.description !== undefined) data.description = args.description;

      if (Object.keys(data).length === 0) {
        throw new LibraryError('Name what to change on this tag');
      }

      await updateTag(tag.id, data);
      const after = resolveTag(tag.id, await readTags());

      return { changed: after };
    }

    if (!args.name) throw new LibraryError('A new tag needs a name');

    if (tags.length >= MAX_TAGS_PER_LIBRARY) {
      throw new LibraryError(
        `A library keeps at most ${MAX_TAGS_PER_LIBRARY} tags`,
      );
    }

    const taken = new Set(tags.map(tag => tag.color?.toUpperCase()));
    const color =
      args.color ||
      palette().find(hex => !taken.has(hex.toUpperCase())) ||
      null;

    if (!color) {
      throw new LibraryError('Name a colour for this tag, as a hex value');
    }

    const created = await createTag({
      name: args.name,
      color,
      description: args.description,
      library: (await readLibrary()).libraryId,
    });

    return {
      created: {
        id: created?.data?.id,
        name: created?.data?.attributes?.name,
        color: created?.data?.attributes?.color,
        slug: created?.data?.attributes?.slug,
      },
    };
  },

  async library_tag_books(args) {
    const [library, tags] = [await readLibrary(), await readTags()];
    const tag = resolveTag(args.tag, tags);
    const books = library.books.filter(book => book.type === 'book');

    const add = (args.add ?? []).map(ref => resolveBook(ref, books));
    const remove = (args.remove ?? []).map(ref => resolveBook(ref, books));

    if (add.length === 0 && remove.length === 0) {
      throw new LibraryError('Name books to add or remove');
    }

    // Each book is its own write, and one that fails must not hide the ones
    // that landed before it: every book is answered for by name, and the call
    // as a whole fails only when nothing at all was changed.
    const changed = [];
    const failed = [];

    for (const book of add) {
      if (book.tags.some(carried => carried.id === tag.id)) continue;

      if (book.tags.length >= MAX_TAGS_PER_OBJECT) {
        failed.push({
          book: book.title,
          reason: `already carries ${MAX_TAGS_PER_OBJECT} tags`,
        });
        continue;
      }

      try {
        await writeObject(book.id, {
          tags: [...book.tags.map(carried => carried.id), tag.id],
        });
        changed.push({ book: book.title, tagged: true });
      } catch (error) {
        failed.push({ book: book.title, reason: error.message });
      }
    }

    for (const book of remove) {
      if (!book.tags.some(carried => carried.id === tag.id)) continue;

      try {
        await writeObject(book.id, {
          tags: book.tags
            .filter(carried => carried.id !== tag.id)
            .map(carried => carried.id),
        });
        changed.push({ book: book.title, tagged: false });
      } catch (error) {
        failed.push({ book: book.title, reason: error.message });
      }
    }

    if (changed.length === 0 && failed.length > 0) {
      throw new LibraryError(
        failed.map(entry => `"${entry.book}": ${entry.reason}`).join('; '),
      );
    }

    const after = resolveTag(tag.id, await readTags());

    return {
      tag: after.name,
      changed,
      ...(failed.length ? { failed } : {}),
      carries: after.objects.length,
    };
  },

  async library_tag_order(args) {
    const [library, tags] = [await readLibrary(), await readTags()];
    const tag = resolveTag(args.tag, tags);

    if (tag.objects.length === 0) {
      throw new LibraryError(`"${tag.name}" carries no books yet`);
    }

    const inTag = library.books.filter(book => tag.objects.includes(book.id));
    const named = [];

    for (const reference of args.order ?? []) {
      const book = resolveBook(reference, inTag);

      if (named.includes(book.id)) {
        throw new LibraryError(`"${book.title}" is named twice`);
      }

      named.push(book.id);
    }

    if (named.length === 0) throw new LibraryError('Name the order');

    // The CMS wants the whole sequence. What the caller did not name keeps the
    // order it already had, behind what they did.
    const sequence = [
      ...named,
      ...tag.objects.filter(id => !named.includes(id)),
    ];

    await reorderTag(
      tag.id,
      sequence.map((id, index) => ({ id, order: index })),
    );

    const after = resolveTag(tag.id, await readTags());
    const titles = new Map(library.books.map(book => [book.id, book.title]));

    return {
      tag: after.name,
      order: after.objects.map(id => titles.get(id) ?? id),
    };
  },

  async library_book(args) {
    const library = await readLibrary();
    const book = resolveBook(args.book, library.books);
    const data = {};

    if (args.note !== undefined) {
      if (String(args.note).length > MAX_NOTE_LENGTH) {
        throw new LibraryError(
          `A note is at most ${MAX_NOTE_LENGTH} characters`,
        );
      }

      data.description = args.note;
    }

    if (args.rating !== undefined) {
      if (args.rating !== null) {
        const rating = Number(args.rating);

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
          throw new LibraryError('A rating is a whole number from 1 to 5');
        }

        data.overall = rating;
      } else {
        data.overall = null;
      }
    }

    if (args.difficulty !== undefined) {
      if (args.difficulty !== null && !DIFFICULTIES.includes(args.difficulty)) {
        throw new LibraryError(
          `Difficulty is one of ${DIFFICULTIES.join(', ')}`,
        );
      }

      data.difficulty = args.difficulty;
    }

    if (Object.keys(data).length === 0) {
      throw new LibraryError('Name what to change on this book');
    }

    const saved = await writeObject(book.id, data);
    const after = saved?.data?.attributes ?? {};

    // The response is the only proof the write landed. A 200 that carries the
    // old value is a failed save, not a saved one. The note is compared with
    // its whitespace folded, since the CMS may tidy markup on the way in, and
    // no value is put in the message: the message reaches the journal.
    const fold = value =>
      String(value ?? '')
        .replace(/\s+/g, ' ')
        .trim();

    for (const [field, value] of Object.entries(data)) {
      if (after[field] === undefined) continue;

      const same =
        field === 'description'
          ? fold(after[field]) === fold(value)
          : after[field] === value;

      if (!same) {
        throw new LibraryError(
          `The server did not keep the ${field === 'description' ? 'note' : field} as sent`,
        );
      }
    }

    return {
      book: { id: book.id, title: book.title },
      saved: {
        note: after.description ?? undefined,
        rating: after.overall ?? null,
        difficulty: after.difficulty ?? null,
      },
    };
  },

  async library_add_book(args) {
    const wantedTitle = String(args.title ?? '').trim();

    if (!wantedTitle) throw new LibraryError('Name the book');

    const library = await readLibrary();
    const shelf = resolveShelf(
      args.shelf,
      library.shelves.filter(candidate => candidate.type === 'book'),
    );

    if (library.books.length >= MAX_OBJECTS_PER_LIBRARY) {
      throw new LibraryError(
        `A library keeps at most ${MAX_OBJECTS_PER_LIBRARY} items`,
      );
    }

    if (shelf.objects.length >= MAX_OBJECTS_PER_SHELF) {
      throw new LibraryError(
        `"${shelf.name}" is full: a shelf keeps at most ${MAX_OBJECTS_PER_SHELF} items`,
      );
    }

    const data = {};

    if (args.note !== undefined && args.note !== null) {
      if (String(args.note).length > MAX_NOTE_LENGTH) {
        throw new LibraryError(
          `A note is at most ${MAX_NOTE_LENGTH} characters`,
        );
      }

      data.description = String(args.note);
    }

    if (args.rating !== undefined && args.rating !== null) {
      const rating = Number(args.rating);

      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new LibraryError('A rating is a whole number from 1 to 5');
      }

      data.overall = rating;
    }

    if (args.difficulty !== undefined && args.difficulty !== null) {
      if (!DIFFICULTIES.includes(args.difficulty)) {
        throw new LibraryError(
          `Difficulty is one of ${DIFFICULTIES.join(', ')}`,
        );
      }

      data.difficulty = args.difficulty;
    }

    if (args.tags?.length) {
      const tags = await readTags();
      const ids = [...new Set(args.tags.map(ref => resolveTag(ref, tags).id))];

      if (ids.length > MAX_TAGS_PER_OBJECT) {
        throw new LibraryError(
          `A book carries at most ${MAX_TAGS_PER_OBJECT} tags`,
        );
      }

      data.tags = ids;
    }

    const held = title =>
      library.books.find(
        book =>
          book.type === 'book' && foldTitle(book.title) === foldTitle(title),
      );
    const refuseHeld = title => {
      const twin = held(title);

      if (twin) {
        throw new LibraryError(
          `The library already holds "${twin.title}" (${twin.id}) on "${twin.shelf.name}"`,
        );
      }
    };

    refuseHeld(wantedTitle);

    let chosen;

    if (args.unlisted) {
      chosen = { title: wantedTitle, author: args.author };
    } else {
      const candidates = await searchBooks(wantedTitle);
      const listed = candidates.map(candidateLine);

      if (candidates.length === 0) {
        throw new LibraryError(
          `The search knows no book called "${wantedTitle}". Check the title, or pass unlisted to add it as given, without a cover.`,
        );
      }

      if (args.pick !== undefined && args.pick !== null) {
        chosen = candidates[Number(args.pick) - 1];

        if (!Number.isInteger(Number(args.pick)) || !chosen) {
          return {
            added: false,
            reason: `pick is a number from 1 to ${candidates.length}`,
            candidates: listed,
          };
        }
      } else {
        const wantedAuthor = foldTitle(args.author);
        const matching = candidates.filter(
          candidate =>
            foldTitle(candidate.title) === foldTitle(wantedTitle) &&
            (!wantedAuthor ||
              foldTitle(candidate.author).includes(wantedAuthor)),
        );
        const authors = new Set(
          matching.map(candidate => foldTitle(candidate.author)),
        );

        // Several editions of one book by one author are one book: the search
        // lists its best first. Anything less certain is the caller's choice.
        if (matching.length === 0 || authors.size > 1) {
          return {
            added: false,
            reason:
              matching.length === 0
                ? 'No candidate carries exactly this title. Call again with pick.'
                : 'Several books carry this title. Call again with pick, or name the author.',
            candidates: listed,
          };
        }

        [chosen] = matching;
      }

      refuseHeld(chosen.title);
    }

    const title = String(chosen.title).slice(0, MAX_BOOK_TITLE_LENGTH);
    const author = chosen.author
      ? String(chosen.author).slice(0, MAX_AUTHOR_LENGTH)
      : undefined;

    let coverId;

    if (!args.unlisted && (args.cover ?? 'auto') !== 'none') {
      const cover = await fetchCover(chosen.coverUrl, chosen.fallbackCoverUrl);

      // Nothing is written before the cover is in hand: a book without one is
      // the owner's decision, not a quiet outcome of a slow catalogue.
      if (!cover) {
        throw new LibraryError(
          `No usable cover came back for "${title}". Nothing was added. Call again with cover: "none" to add it without one.`,
        );
      }

      const fileName =
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 60) || 'cover';

      coverId = await uploadCover(cover, fileName);
    }

    const slugBase = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const created = await createObject({
      type: 'book',
      title,
      slug: `${slugBase}-${Date.now()}`,
      author,
      publicationDate: calendarDate(chosen.publicationDate),
      shelf: shelf.id,
      ...(coverId ? { coverImage: coverId } : {}),
      ...data,
    });

    const id = created?.data?.id;

    // The answer to the create is not proof. A separate read has to find the
    // book on the shelf it was sent to.
    const after = await readLibrary();
    const landed = after.books.find(book => book.id === id);

    if (!id || !landed) {
      throw new LibraryError('The server answered, but the book is not there');
    }

    if (landed.shelf.id !== shelf.id) {
      throw new LibraryError(
        `The book landed on "${landed.shelf.name}", not "${shelf.name}"`,
      );
    }

    return {
      added: {
        id,
        title: landed.title,
        author: landed.author ?? undefined,
        published: calendarDate(chosen.publicationDate),
        shelf: landed.shelf.name,
        cover: !!coverId,
        tags: landed.tags.map(tag => tag.name),
        rating: landed.rating ?? undefined,
        difficulty: landed.difficulty ?? undefined,
        note: landed.note ? true : undefined,
      },
      shelfHolds: after.shelves.find(entry => entry.id === shelf.id)?.objects
        .length,
    };
  },
};

export const call = async (name, args = {}) => {
  const handler = handlers[name];
  const started = Date.now();

  if (!handler) {
    record({ tool: name, outcome: 'unknown-tool' });
    return {
      content: [{ type: 'text', text: `No tool called ${name}` }],
      isError: true,
    };
  }

  try {
    const result = await handler(args);

    record({ tool: name, args, outcome: 'ok', ms: Date.now() - started });

    return asText(result);
  } catch (error) {
    record({
      tool: name,
      args,
      outcome: 'error',
      status: error.status,
      detail: error.message,
      ms: Date.now() - started,
    });

    return {
      content: [{ type: 'text', text: error.message }],
      isError: true,
    };
  }
};
