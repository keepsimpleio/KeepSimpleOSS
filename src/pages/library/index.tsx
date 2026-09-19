import type { GetStaticProps, NextPage } from 'next';

import { DEFAULT_SEO } from '@constants/library/seo.config';

import type { HomeLibraryCardView } from '@local-types/library/library';

import { librarySeo } from '@lib/library/seo';

import { getHomeLibraryCards } from '@api/library/getHomeLibraryCards';

import { AuthProvider } from '@components/Context/library/AuthContext';
import { GlobalStateProvider } from '@components/Context/library/GlobalStateContext';
import SeoGenerator from '@components/SeoGenerator';

import { HomeTemplate } from '@layouts/library/Home';

interface LibraryHomePageProps {
  initialItems: HomeLibraryCardView[] | null;
}

const LibraryHomePage: NextPage<LibraryHomePageProps> = ({ initialItems }) => {
  return (
    <AuthProvider>
      <GlobalStateProvider>
        <SeoGenerator
          schemaOverride={librarySeo().schema}
          largeImage
          imageWidth={1920}
          imageHeight={1280}
          omitDefaultAuthor
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
        <HomeTemplate initialItems={initialItems} />
      </GlobalStateProvider>
    </AuthProvider>
  );
};

export default LibraryHomePage;

// Static with a short revalidation window: the page itself has nothing
// per-request, and the library list is public and changes rarely. The HTML
// carries the cards, so an anonymous visitor makes no Strapi round trip.
// Signed-in accounts refetch client-side (see HomeTemplate).
export const getStaticProps: GetStaticProps<
  LibraryHomePageProps
> = async () => {
  const initialItems = await getHomeLibraryCards();
  return {
    props: { initialItems },
    revalidate: 60,
  };
};
