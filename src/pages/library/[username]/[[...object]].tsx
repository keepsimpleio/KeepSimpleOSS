import type { GetServerSideProps, NextPage } from 'next';

import { isLibraryEnabled } from '@constants/library/common';
import { DEFAULT_SEO } from '@constants/library/seo.config';

import { AuthProvider } from '@components/Context/library/AuthContext';
import { DashboardProvider } from '@components/Context/library/DashboardContext';
import { GlobalStateProvider } from '@components/Context/library/GlobalStateContext';
import { ShareSelectionProvider } from '@components/Context/library/ShareSelectionContext';
import { Sidebar } from '@components/library/organisms/Sidebar';
import SeoGenerator from '@components/SeoGenerator';

import { LibraryTemplate } from '@layouts/library/Library';

import styles from '../library.module.scss';

type LibraryPageProps = {
  username: string;
};

// Optional catch-all so the library and a single object share one page module:
// `/library/[username]` (object undefined) and `/library/[username]/[slug]`
// (object = [slug]) both render here. That lets an object open via shallow
// `router.push` — the URL changes and the overview modal opens over the same,
// already-loaded library instead of a full navigation that would refetch and
// flash. The slug is read off the router inside the shelf, so this page only
// needs the username. `share/[token]` is a literal sibling and still wins for
// `/library/[username]/share/...`.
const LibraryPage: NextPage<LibraryPageProps> = ({ username }) => {
  const pageTitle = `${username} | ${DEFAULT_SEO.siteName}`;

  return (
    <AuthProvider>
      <GlobalStateProvider>
        <DashboardProvider>
          <ShareSelectionProvider>
            <SeoGenerator
              strapiSEO={{
                title: pageTitle,
                description: DEFAULT_SEO.description,
                keywords: '',
                pageTitle,
              }}
              ogTags={{
                ogTitle: pageTitle,
                ogDescription: DEFAULT_SEO.description,
                ogType: DEFAULT_SEO.type,
                ogImage: {
                  data: {
                    attributes: { url: '', staticUrl: DEFAULT_SEO.image },
                  },
                },
              }}
            />
            <div className={`library ${styles.dashboard}`}>
              <main className={styles.content}>
                <LibraryTemplate libraryId={username} />
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
  if (!isLibraryEnabled()) {
    return { notFound: true };
  }

  const username = String(context.params?.username ?? '');

  return {
    props: { username },
  };
};
