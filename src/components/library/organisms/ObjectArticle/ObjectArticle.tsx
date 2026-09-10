import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import Link from 'next/link';

import type { IObject } from '@local-types/library/object';

import { libraryPath } from '@lib/library/libraryPath';
import { noteToSafeHtml } from '@lib/library/noteHtml';

import styles from './ObjectArticle.module.scss';

interface ObjectArticleProps {
  object: IObject;
  /** The owner's username, for the way back to the library. */
  username: string | null;
  /** How the owner is named on the page. */
  ownerName: string | null;
  /** The shelf this object stands on, when it is known. */
  shelfName?: string | null;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  very_hard: 'Very hard',
  hard: 'Hard',
  moderate: 'Moderate',
  easy: 'Easy',
};

/**
 * A book on its own page, written into the HTML the server sends.
 *
 * The overview a reader clicks is a dialog, and a dialog is drawn by the
 * browser into the body after the scripts run: at the address of a single
 * book, everything the owner wrote about it used to arrive after load, so a
 * crawler that reads the response and nothing else found the library's shell
 * and no book. This is the same reading, in the page itself. It stands under
 * the dialog for anyone whose browser opens one, and it is the whole page for
 * anyone whose browser does not.
 */
export function ObjectArticle({
  object,
  username,
  ownerName,
  shelfName,
}: ObjectArticleProps) {
  const { title, author, description, overall, difficulty, sourceUrl } =
    object.attributes;
  const cover = resolveStrapiUrl(
    object.attributes.coverImage?.data?.attributes.url,
  );
  const note = noteToSafeHtml(description);
  const tags = object.attributes.tags?.data ?? [];
  const shelf = shelfName ?? object.attributes.shelfName;

  return (
    <article className={styles.article} aria-labelledby="library-object-title">
      {cover && (
        // Next's Image would ask for a loader and a size this cover does not
        // declare; the artwork is the owner's own upload, drawn at its ratio.
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.cover} src={cover} alt={`Cover of ${title}`} />
      )}
      <div className={styles.body}>
        <h1 className={styles.title} id="library-object-title">
          {title}
        </h1>
        {author && <p className={styles.author}>{author}</p>}
        <p className={styles.meta}>
          {[
            ownerName ? `In ${ownerName}'s library` : null,
            shelf ? `on ${shelf}` : null,
            typeof overall === 'number' ? `rated ${overall} of 5` : null,
            difficulty ? DIFFICULTY_LABEL[difficulty] : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
        {note && (
          <div
            className={styles.note}
            // The owner's own note, escaped and then let through tag by tag
            // on the way out; see `noteToSafeHtml`.
            dangerouslySetInnerHTML={{ __html: note }}
          />
        )}
        {tags.length > 0 && (
          <p className={styles.tags}>
            {tags.map(tag => tag.attributes.name).join(' · ')}
          </p>
        )}
        <p className={styles.links}>
          <Link className={styles.link} href={libraryPath(username)}>
            {ownerName ? `All of ${ownerName}'s library` : 'The whole library'}
          </Link>
          {sourceUrl && (
            <a
              className={styles.link}
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </a>
          )}
        </p>
      </div>
    </article>
  );
}

export default ObjectArticle;
