import type { GetServerSideProps, NextPage } from 'next';

import { DEFAULT_SEO } from '@constants/library/seo.config';

import { librarySeo } from '@lib/library/seo';
import { readSidebarCollapsedForRequest } from '@lib/library/sidebarPanel';
import { type LibraryTheme, readThemeFromHeader } from '@lib/library/theme';

import { getLibraryRedirect } from '@api/library/getLibraryRedirect';
import { getPublicLibrarySeo } from '@api/library/getPublicLibrarySeo';

import { AuthProvider } from '@components/Context/library/AuthContext';
import { DashboardProvider } from '@components/Context/library/DashboardContext';
import { GlobalStateProvider } from '@components/Context/library/GlobalStateContext';
import { ShareSelectionProvider } from '@components/Context/library/ShareSelectionContext';
import { LibraryRoot } from '@components/library/atoms/LibraryRoot';
import { Sidebar } from '@components/library/organisms/Sidebar';
import SeoGenerator from '@components/SeoGenerator';

import { LibraryTemplate } from '@layouts/library/Library';

import styles from '../library.module.scss';

type LibraryPageProps = {
  username: string;
  seo: ReturnType<typeof librarySeo>;
  /** Desktop info panel folded to its spine — read from the viewer's cookie. */
  initialSidebarCollapsed: boolean;
  /** The viewer's light or dark reading, from the cookie; null when unset. */
  initialTheme: LibraryTheme | null;
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
  initialTheme,
}) => {
  const pageTitle = seo.title;

  return (
    <AuthProvider>
      <GlobalStateProvider
        initialSidebarCollapsed={initialSidebarCollapsed}
        initialTheme={initialTheme ?? undefined}
      >
        <DashboardProvider>
          <ShareSelectionProvider>
            <SeoGenerator
              schemaOverride={seo.schema}
              largeImage
              imageWidth={seo.imageWidth}
              imageHeight={seo.imageHeight}
              omitDefaultAuthor
              strapiSEO={{
                title: pageTitle,
                description: seo.description,
                keywords: '',
                pageTitle,
              }}
              ogTags={{
                ogTitle: pageTitle,
                ogImageAlt: seo.imageAlt,
                ogDescription: seo.description,
                ogType: DEFAULT_SEO.type,
                ogImage: {
                  data: {
                    attributes: { url: '', staticUrl: seo.image },
                  },
                },
              }}
            />
            <LibraryRoot className={styles.dashboard}>
              <main className={styles.content}>
                <LibraryTemplate libraryId={username} />
              </main>
              <Sidebar />
            </LibraryRoot>
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
  const initialTheme = readThemeFromHeader(context.req.headers.cookie);

  let seo = librarySeo();
  try {
    seo = await getPublicLibrarySeo(username);
  } catch {
    console.error('Library metadata unavailable');
  }
  return {
    props: { username, initialSidebarCollapsed, initialTheme, seo },
  };
};
