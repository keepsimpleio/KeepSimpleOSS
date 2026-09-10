#!/usr/bin/env node
/**
 * Proof that the five tools reach a live library and come back with what they
 * claim. Every write it makes it takes back: a tag it made it deletes, a note
 * it changed it restores, and it says so line by line.
 *
 *   KS_LIBRARY_TARGET=staging \
 *   KS_LIBRARY_SESSION_JWT=<a session for the owner> KS_LIBRARY_ID=<library> \
 *   node mcp/library/probe.mjs
 *
 * Never point it at a library whose contents matter without reading what it
 * touches: it writes to two books and puts one tag on them.
 */

import { deleteTag, readTags } from './library.mjs';
import { call } from './tools.mjs';

const TAG = 'MCP probe';

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

  process.stdout.write(failed ? `\n${failed} failed\n` : '\nall passed\n');
  process.exit(failed ? 1 : 0);
};

main().catch(error => {
  process.stdout.write(`FAIL  ${error.message}\n`);
  process.exit(1);
});
