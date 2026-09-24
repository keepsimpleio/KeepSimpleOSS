import { promises as fs } from 'fs';
import path from 'path';

/**
 * Where the Atlas guide pushed by the Terminal lives between deploys, and
 * the journal every push leaves.
 *
 * The frontend container has one persistent mount, `logs/library-magic/`,
 * which outlives every redeploy; the guide sits in its own folder there so
 * no new volume is needed. Server-only: read from getStaticProps and the
 * push route, never from the browser. The file holds the stripped guide
 * only, the same fields the page renders into its HTML.
 */

const ROOT = path.join(process.cwd(), 'logs', 'library-magic', 'ai-atlas');
const GUIDE = path.join(ROOT, 'guide.json');
const JOURNAL = path.join(ROOT, 'journal.jsonl');

export async function readStoredGuide(): Promise<any | null> {
  try {
    return JSON.parse(await fs.readFile(GUIDE, 'utf8'));
  } catch {
    return null;
  }
}

export async function writeStoredGuide(guide: any): Promise<void> {
  await fs.mkdir(ROOT, { recursive: true });
  const tmp = `${GUIDE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(guide));
  await fs.rename(tmp, GUIDE);
}

/** One line per push that carries the key, UTC: stored, refused or failed. */
export async function journalPush(entry: Record<string, unknown>) {
  try {
    await fs.mkdir(ROOT, { recursive: true });
    await fs.appendFile(
      JOURNAL,
      JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n',
    );
  } catch {
    /* A journal failure never fails the push. */
  }
}
