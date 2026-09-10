/**
 * The five things an agent may do to a library, and nothing else.
 *
 * Each tool takes books and tags the way a person names them, a title or a
 * word, and turns that into the ids the CMS wants. A name that matches two
 * books is refused with both candidates rather than guessed at.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

import { record } from './journal.mjs';
import {
  createTag,
  LibraryError,
  readLibrary,
  readTags,
  reorderTag,
  resolveBook,
  resolveTag,
  updateTag,
  writeObject,
} from './library.mjs';

// The Library's own limits, kept where the CMS keeps them. Breaking them here
// costs a round trip and gives a sentence the caller can act on.
const MAX_TAG_NAME_LENGTH = 20;
const MAX_TAG_DESCRIPTION_LENGTH = 180;
const MAX_TAGS_PER_OBJECT = 10;
const MAX_NOTE_LENGTH = 5000;
const DIFFICULTIES = ['very_hard', 'hard', 'moderate', 'easy'];

const NOTE_PREVIEW = 400;

const repoRoot = path.resolve(new URL('../..', import.meta.url).pathname);

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
      },
      required: ['book'],
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

    const changed = [];

    for (const book of add) {
      if (book.tags.some(carried => carried.id === tag.id)) continue;

      if (book.tags.length >= MAX_TAGS_PER_OBJECT) {
        throw new LibraryError(
          `"${book.title}" already carries ${MAX_TAGS_PER_OBJECT} tags`,
        );
      }

      await writeObject(book.id, {
        tags: [...book.tags.map(carried => carried.id), tag.id],
      });
      changed.push({ book: book.title, tagged: true });
    }

    for (const book of remove) {
      if (!book.tags.some(carried => carried.id === tag.id)) continue;

      await writeObject(book.id, {
        tags: book.tags
          .filter(carried => carried.id !== tag.id)
          .map(carried => carried.id),
      });
      changed.push({ book: book.title, tagged: false });
    }

    const after = resolveTag(tag.id, await readTags());

    return { tag: after.name, changed, carries: after.objects.length };
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
    // old value is a failed save, not a saved one.
    for (const [field, value] of Object.entries(data)) {
      if (after[field] !== undefined && after[field] !== value) {
        throw new LibraryError(
          `The server kept ${field} as ${JSON.stringify(after[field])}`,
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
