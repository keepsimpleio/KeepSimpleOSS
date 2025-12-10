import { GetStaticProps } from 'next';
import { getArticleRedirects } from '../../lib/getArticleRedirects';

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const { page } = params as { page: string };

  const map = await getArticleRedirects(locale ?? 'en');

  if (page.startsWith('articles/')) {
    return { notFound: true };
  }

  const resolvedNewUrl = map[page];

  if (resolvedNewUrl) {
    return {
      redirect: {
        destination: `/${resolvedNewUrl}`,
        permanent: true,
      },
    };
  }

  return { notFound: true };
};

export default function LegacyRedirectPage() {
  return null;
}
