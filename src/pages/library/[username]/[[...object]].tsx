import classNames from 'classnames';
import type { GetServerSideProps, NextPage } from 'next';

import { DEFAULT_SEO } from '@constants/library/seo.config';

import type { StrapiLibraryEntry } from '@local-types/library/library';
import type { IObject } from '@local-types/library/object';
import type { LibraryTag } from '@local-types/library/tag';

import { objectIdFromSlug } from '@lib/library/objectSlug';
import { librarySeo, objectSeo } from '@lib/library/seo';
import { readSidebarCollapsedForRequest } from '@lib/library/sidebarPanel';

import { getLibraryRedirect } from '@api/library/getLibraryRedirect';
import { getPublicLibraryView } from '@api/library/getPublicLibraryView';

import { AuthProvider } from '@components/Context/library/AuthContext';
import { DashboardProvider } from '@components/Context/library/DashboardContext';
import { GlobalStateProvider } from '@components/Context/library/GlobalStateContext';
import { ShareSelectionProvider } from '@components/Context/library/ShareSelectionContext';
import ObjectArticle from '@components/library/organisms/ObjectArticle';
import { Sidebar } from '@components/library/organisms/Sidebar';
import SeoGenerator from '@components/SeoGenerator';

import { LibraryTemplate } from '@layouts/library/Library';

import styles from '../library.module.scss';

type LibraryPageProps = {
  username: string;
  seo: ReturnType<typeof librarySeo>;
  /** Desktop info panel folded to its spine — read from the viewer's cookie. */
  initialSidebarCollapsed: boolean;
  /** The library as the server read it, anonymously, for this request. */
  initialLibrary: StrapiLibraryEntry | null;
  /** Its tags, as the right panel lists them. */
  initialTags: LibraryTag[];
  /** The object the URL names, when it names one this viewer may open. */
  object: IObject | null;
  /** That object's own metadata, so its address is not the library's twin. */
  objectMeta: ReturnType<typeof objectSeo> | null;
  /** The shelf it stands on. */
  objectShelf: string | null;
};

// Optional catch-all so the library and a single object share one page module:
// `/library/[username]` (object undefined) and `/library/[username]/[slug]`
// (object = [slug]) both render here. That lets an object open via shallow
// `router.push` — the URL changes and the overview modal opens over the same,
// already-loaded library instead of a full navigation that would refetch and
// flash. The slug is read off the router inside the shelf, so this page only
// needs the username. `share/[token]` is a literal sibling and still wins for
// `/library/[username]/share/...`.
const LibraryPage: NextPage<LibraryPageProps> = ({
  username,
  seo,
  initialSidebarCollapsed,
  initialLibrary,
  initialTags,
  object,
  objectMeta,
  objectShelf,
}) => {
  // At a book's address the page is that book: its own title, its own
  // description, its own cover and its own schema.org entry. Without this all
  // 165 addresses in a library answered with the library's, which reads as one
  // page repeated.
  const meta = objectMeta ?? seo;
  const pageTitle = meta.title;

  return (
    <AuthProvider>
      <GlobalStateProvider
        initialSidebarCollapsed={initialSidebarCollapsed}
        initialLibrary={initialLibrary}
      >
        <DashboardProvider initialTags={initialTags}>
          <ShareSelectionProvider>
            <SeoGenerator
              schemaOverride={meta.schema}
              largeImage
              imageWidth={meta.imageWidth ?? undefined}
              imageHeight={meta.imageHeight ?? undefined}
              omitDefaultAuthor
              strapiSEO={{
                title: pageTitle,
                description: meta.description,
                keywords: '',
                pageTitle,
              }}
              ogTags={{
                ogTitle: pageTitle,
                ogImageAlt: meta.imageAlt,
                ogDescription: meta.description,
                ogType: DEFAULT_SEO.type,
                ogImage: {
                  data: {
                    attributes: { url: '', staticUrl: meta.image },
                  },
                },
              }}
            />
            <div className={classNames('library', styles.dashboard)}>
              <main className={styles.content}>
                {object && (
                  <ObjectArticle
                    object={object}
                    username={seo.username ?? username}
                    ownerName={seo.displayName}
                    shelfName={objectShelf}
                  />
                )}
                <LibraryTemplate
                  libraryId={username}
                  initialLibrary={initialLibrary}
                />
              </main>
              <Sidebar />
            </div>
          </ShareSelectionProvider>
        </DashboardProvider>
      </GlobalStateProvider>
    </AuthProvider>
  );
};

export default LibraryPage;

export const getServerSideProps: GetServerSideProps<
  LibraryPageProps
> = async context => {
  const username = String(context.params?.username ?? '');
  const destination = await getLibraryRedirect(username, context.resolvedUrl);
  if (destination) {
    return { redirect: { destination, permanent: true } };
  }
  const initialSidebarCollapsed = readSidebarCollapsedForRequest(
    context.req.headers.cookie,
  );

  const segments = context.params?.object;
  const requestedId = objectIdFromSlug(
    Array.isArray(segments) ? segments[0] : segments,
  );

  let seo = librarySeo();
  let initialLibrary: StrapiLibraryEntry | null = null;
  let initialTags: LibraryTag[] = [];

  try {
    const view = await getPublicLibraryView(username, requestedId);
    seo = view.seo;
    initialLibrary = view.library;
    initialTags = view.tags;
  } catch {
    // The page still renders and the browser reads the library itself; only
    // the server's own copy is missing.
    console.error('Library could not be read for this request');
  }

  // Only what the request actually named, and only from the shelves a visitor
  // is shown: a book on a private shelf has no public page and gets none here.
  const shelves = initialLibrary?.attributes.singleShelves?.data ?? [];
  const standing = requestedId
    ? shelves
        .flatMap(shelf =>
          (shelf.attributes.objects?.data ?? []).map(entry => ({
            entry,
            shelf: shelf.attributes.name ?? null,
          })),
        )
        .find(({ entry }) => entry.id === requestedId)
    : undefined;

  return {
    props: {
      username,
      initialSidebarCollapsed,
      seo,
      initialLibrary,
      initialTags,
      object: standing?.entry ?? null,
      objectShelf: standing?.shelf ?? null,
      objectMeta: standing ? objectSeo(standing.entry, seo) : null,
    },
  };
};
