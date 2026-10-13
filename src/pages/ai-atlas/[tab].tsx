import type { GetStaticPaths, GetStaticProps } from 'next';

import AiAtlasPage, {
  getStaticProps as atlasStaticProps,
  TAB_SLUGS,
} from '../ai-atlas';

/* /ai-atlas/thesis and /ai-atlas/ladder: the Atlas page opened on one of its
   readings. Same guide, same words, its own address. */
const TAB_BY_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(TAB_SLUGS).map(([tab, slug]) => [slug, tab]),
);

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => ({
  paths: Object.values(TAB_SLUGS).flatMap(tab =>
    (locales.length ? locales : [undefined]).map(locale => ({
      params: { tab },
      locale,
    })),
  ),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async context => {
  const tab = TAB_BY_SLUG[String(context.params?.tab)];
  if (!tab) return { notFound: true };
  const atlas: any = await atlasStaticProps(context);
  return { ...atlas, props: { ...atlas.props, tab } };
};

export default AiAtlasPage;
