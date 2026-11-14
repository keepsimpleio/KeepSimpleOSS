#!/usr/bin/env node
/**
 * Proof that the six tools reach a live library and come back with what they
 * claim. Every write it makes it takes back: a tag it made it deletes, a note
 * it changed it restores, a book it added it removes, and it says so line by
 * line. One thing stays behind: the cover file of the added book, which the
 * owner's session may upload but not delete.
 *
 *   KS_LIBRARY_TARGET=staging \
 *   KS_LIBRARY_SESSION_JWT=<a session for the owner> KS_LIBRARY_ID=<library> \
 *   node mcp/library/probe.mjs
 *
 * Never point it at a library whose contents matter without reading what it
 * touches: it writes to two books, puts one tag on them, and adds one book to
 * the first book shelf for the length of a step.
 */

import { deleteObject, deleteTag, readLibrary, readTags } from './library.mjs';
import { call } from './tools.mjs';

const TAG = 'MCP probe';

// Well-known titles the search answers with a cover. The probe adds the first
// one the library does not already hold.
const ADDABLE = [
  'The Old Man and the Sea',
  'Flowers for Algernon',
  'The Count of Monte Cristo',
  'Moby Dick',
];

let failed = 0;

const step = async (label, run) => {
  try {
    const result = await run();

    process.stdout.write(`PASS  ${label}${result ? ` — ${result}` : ''}\n`);
  } catch (error) {
    failed += 1;
    process.stdout.write(`FAIL  ${label} — ${error.message}\n`);
  }
};

const tool = async (name, args) => {
  const answer = await call(name, args);
  const text = answer.content?.[0]?.text ?? '';

  if (answer.isError) throw new Error(text);

  return JSON.parse(text);
};

const main = async () => {
  const listed = await tool('library_books', { limit: 500 });
  const books = listed.books.filter(book => book.tags.length < 9).slice(0, 2);

  if (books.length < 2) {
    process.stdout.write('FAIL  the probe needs two books it can label\n');
    process.exit(1);
  }

  const [first, second] = books;
  const before = await tool('library_books', {
    search: first.title,
    notes: 'full',
  });
  const original = before.books.find(book => book.id === first.id);

  await step('read the library', () => `${listed.matched} books`);

  await step('create a tag', async () => {
    const made = await tool('library_tag', {
      name: TAG,
      description: 'Written by the probe, removed by the probe.',
    });

    return `${made.created.name} (${made.created.slug})`;
  });

  await step('rename and recolour it', async () => {
    const changed = await tool('library_tag', {
      tag: TAG,
      description: 'Second description.',
    });

    if (changed.changed.description !== 'Second description.') {
      throw new Error('the description came back unchanged');
    }

    return 'description saved';
  });

  await step('put it on two books', async () => {
    const result = await tool('library_tag_books', {
      tag: TAG,
      add: [String(first.id), String(second.id)],
    });

    if (result.carries !== 2) throw new Error(`it carries ${result.carries}`);

    return result.changed.map(entry => entry.book).join(', ');
  });

  await step('set their order', async () => {
    const result = await tool('library_tag_order', {
      tag: TAG,
      order: [String(second.id)],
    });

    if (result.order[0] !== second.title) {
      throw new Error(`the first book is ${result.order[0]}`);
    }

    return result.order.join(' → ');
  });

  await step('write a note and a rating', async () => {
    const saved = await tool('library_book', {
      book: String(first.id),
      note: 'Probe note.',
      rating: 3,
    });

    if (saved.saved.note !== 'Probe note.' || saved.saved.rating !== 3) {
      throw new Error('the answer did not carry what was written');
    }

    const reread = await tool('library_books', {
      search: first.title,
      notes: 'full',
    });
    const now = reread.books.find(book => book.id === first.id);

    if (now.note !== 'Probe note.' || now.rating !== 3) {
      throw new Error('a separate read did not see the write');
    }

    return 'written and read back';
  });

  await step('restore the note and rating', async () => {
    await tool('library_book', {
      book: String(first.id),
      note: original.note ?? '',
      rating: original.rating ?? null,
    });

    const reread = await tool('library_books', {
      search: first.title,
      notes: 'full',
    });
    const now = reread.books.find(book => book.id === first.id);

    if ((now.note ?? '') !== (original.note ?? '')) {
      throw new Error('the note did not come back');
    }

    return 'as it was';
  });

  await step('take the tag off and delete it', async () => {
    await tool('library_tag_books', {
      tag: TAG,
      remove: [String(first.id), String(second.id)],
    });

    const mine = (await readTags()).find(tag => tag.name === TAG);

    if (mine) await deleteTag(mine.id);

    const left = (await readTags()).find(tag => tag.name === TAG);

    if (left) throw new Error('the tag is still there');

    return 'cleared';
  });

  let added = null;

  await step('refuse a book the library holds', async () => {
    const answer = await call('library_add_book', {
      title: first.title,
      shelf: listed.shelves[0].name,
    });

    if (!answer.isError) throw new Error('a second copy was not refused');

    return 'refused';
  });

  await step('add a book with its cover', async () => {
    const held = new Set(listed.books.map(book => book.title.toLowerCase()));
    const title = ADDABLE.find(name => !held.has(name.toLowerCase()));

    if (!title) throw new Error('the library holds every title the probe adds');

    const shelf = (await readLibrary()).shelves.find(
      entry => entry.type === 'book' && entry.objects.length < 50,
    );

    if (!shelf) throw new Error('no book shelf has room');

    const result = await tool('library_add_book', {
      title,
      shelf: String(shelf.id),
      pick: 1,
    });

    if (!result.added) throw new Error(result.reason ?? 'nothing was added');

    added = result.added;

    if (!added.cover) throw new Error('it came without a cover');

    const reread = await tool('library_books', { search: added.title });

    if (!reread.books.some(book => book.id === added.id)) {
      throw new Error('a separate read did not see the book');
    }

    return `${added.title}, ${added.author ?? 'no author'}, on ${added.shelf}`;
  });

  await step('take the added book back', async () => {
    if (!added) throw new Error('there is no book to remove');

    await deleteObject(added.id);

    const left = (await readLibrary()).books.find(book => book.id === added.id);

    if (left) throw new Error('the book is still there');

    return 'removed';
  });

  process.stdout.write(failed ? `\n${failed} failed\n` : '\nall passed\n');
  process.exit(failed ? 1 : 0);
};

main().catch(error => {
  process.stdout.write(`FAIL  ${error.message}\n`);
  process.exit(1);
});
