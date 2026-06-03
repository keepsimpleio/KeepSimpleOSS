import type { GetServerSideProps, NextPage } from 'next';

import { isLibraryEnabled } from '@constants/library/common';
import { DEFAULT_SEO } from '@constants/library/seo.config';

import { AuthProvider } from '@components/Context/library/AuthContext';
import { GlobalStateProvider } from '@components/Context/library/GlobalStateContext';
import SeoGenerator from '@components/SeoGenerator';

import { HomeTemplate } from '@layouts/library/Home';

const LibraryHomePage: NextPage = () => {
  return (
    <AuthProvider>
      <GlobalStateProvider>
        <SeoGenerator
          strapiSEO={{
            title: DEFAULT_SEO.title,
            description: DEFAULT_SEO.description,
            keywords: '',
            pageTitle: DEFAULT_SEO.title,
          }}
          ogTags={{
            ogTitle: DEFAULT_SEO.title,
            ogDescription: DEFAULT_SEO.description,
            ogType: DEFAULT_SEO.type,
            ogImage: {
              data: { attributes: { url: '', staticUrl: DEFAULT_SEO.image } },
            },
          }}
        />
        <HomeTemplate />
      </GlobalStateProvider>
    </AuthProvider>
  );
};

export default LibraryHomePage;

export const getServerSideProps: GetServerSideProps = async () => {
  if (!isLibraryEnabled()) {
    return { notFound: true };
  }

  return { props: {} };
};
