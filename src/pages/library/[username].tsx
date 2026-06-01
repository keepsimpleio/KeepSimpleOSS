import type { GetServerSideProps, NextPage } from 'next';

import { DEFAULT_SEO } from '@constants/library/seo.config';

import { AuthProvider } from '@components/Context/library/AuthContext';
import { DashboardProvider } from '@components/Context/library/DashboardContext';
import { GlobalStateProvider } from '@components/Context/library/GlobalStateContext';
import { Header } from '@components/library/organisms/Header/Header';
import { HeaderVariant } from '@components/library/organisms/Header/Header.types';
import { Sidebar } from '@components/library/organisms/Sidebar';
import SeoGenerator from '@components/SeoGenerator';

import { LibraryTemplate } from '@layouts/library/Library';

import styles from './library.module.scss';

type LibraryPageProps = {
  username: string;
};

const LibraryPage: NextPage<LibraryPageProps> = ({ username }) => {
  const pageTitle = `${username} | ${DEFAULT_SEO.siteName}`;

  return (
    <AuthProvider>
      <GlobalStateProvider>
        <DashboardProvider>
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
                data: { attributes: { url: '', staticUrl: DEFAULT_SEO.image } },
              },
            }}
          />
          <div className={styles.dashboard}>
            <main className={styles.content}>
              <Header variant={HeaderVariant.Dashboard} />
              <LibraryTemplate libraryId={username} />
            </main>
            <Sidebar />
          </div>
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

  return {
    props: { username },
  };
};
