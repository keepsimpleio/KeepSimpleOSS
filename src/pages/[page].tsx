import { GetStaticProps } from 'next';

import { getArticleRedirects } from '../../lib/getArticleRedirects';

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

// Every return carries the home page interval on purpose. The framework keys
// refresh timings by route with a trailing /index stripped, so a request for
// /index answered here without an interval overwrote the home page timing and
// the home page then shipped a one-year shared cache header until a restart.
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const { page } = params as { page: string };

  const map = await getArticleRedirects(locale ?? 'en');

  if (page.startsWith('articles/')) {
    return { notFound: true, revalidate: 10 };
  }

  const resolvedNewUrl = map[page];

  if (resolvedNewUrl) {
    return {
      redirect: {
        destination: `/${resolvedNewUrl}`,
        permanent: true,
      },
      revalidate: 10,
    };
  }

  return { notFound: true, revalidate: 10 };
};

export default function LegacyRedirectPage() {
  return null;
}
