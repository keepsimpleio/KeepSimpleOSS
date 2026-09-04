import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

import { isDevSessionHost } from '@lib/library/devSession';

/**
 * Shared review session for the DEV preview host. See `@lib/library/devSession`
 * for why this exists and how the two halves fit together.
 *
 * POST { jwt }  — the owner donates the JWT their browser already holds.
 * GET           — a later visitor claims it and lands logged in as the owner.
 *
 * The JWT lives in a gitignored file next to the running app, so a container
 * restart keeps it and a `git push` never sees it. Outside dev this route does
 * not exist: it answers 404 so production cannot even tell it is compiled in.
 */

const STORE_FILE = path.join(process.cwd(), '.dev-session.json');
const JOURNAL_FILE = path.join(process.cwd(), '.dev-session.log');

interface DevSessionStore {
  jwt: string;
  donatedAt: string;
}

/** One line per run, UTC, appended next to the mechanism it belongs to. */
const journal = (event: string, detail: Record<string, unknown> = {}): void => {
  const line = `${new Date().toISOString()} ${event} ${JSON.stringify(detail)}\n`;
  try {
    fs.appendFileSync(JOURNAL_FILE, line);
  } catch {
    // A journal that cannot be written must not break the review session.
  }
};

const hostOf = (req: NextApiRequest): string =>
  (req.headers.host ?? '').split(':')[0];

const readStore = (): DevSessionStore | null => {
  try {
    return JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
  } catch {
    return null;
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isDevSessionHost(hostOf(req))) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  if (req.method === 'GET') {
    const store = readStore();
    if (!store?.jwt) {
      journal('claim.empty', { host: hostOf(req) });
      res.status(404).json({ message: 'No session has been shared yet.' });
      return;
    }

    journal('claim.ok', { host: hostOf(req), donatedAt: store.donatedAt });
    res.status(200).json({ jwt: store.jwt, donatedAt: store.donatedAt });
    return;
  }

  if (req.method === 'POST') {
    const jwt = typeof req.body?.jwt === 'string' ? req.body.jwt.trim() : '';
    if (!jwt) {
      res.status(400).json({ message: 'jwt is required' });
      return;
    }

    const store: DevSessionStore = { jwt, donatedAt: new Date().toISOString() };
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(store), { mode: 0o600 });
    } catch (error: any) {
      journal('donate.failed', { message: error?.message });
      res.status(500).json({ message: 'Could not store the session.' });
      return;
    }

    journal('donate.ok', { host: hostOf(req), jwtLength: jwt.length });
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === 'DELETE') {
    try {
      fs.unlinkSync(STORE_FILE);
    } catch {
      // Already gone — deleting twice is not an error.
    }
    journal('revoke.ok', { host: hostOf(req) });
    res.status(200).json({ ok: true });
    return;
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  res.status(405).json({ message: 'Method not allowed' });
}
