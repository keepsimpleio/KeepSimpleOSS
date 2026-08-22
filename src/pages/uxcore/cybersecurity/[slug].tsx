import { getStrapiBiases } from '@uxcore/api/biases';
import OffsecBiasView from '@uxcore/components/OffsecBiasView';
import SeoGenerator from '@uxcore/components/SeoGenerator';
import { biases } from '@uxcore/data/biasList/biases';
import type { OffsecBiasContent } from '@uxcore/data/biasOffsec';
import { getOffsecBiasContent } from '@uxcore/data/biasOffsec';
import { isOffsecEnabled } from '@uxcore/lib/offsec';
import type { TRouter } from '@uxcore/local-types/global';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';

import styles from './cybersecurity.module.scss';

// One crawlable page per Offensive Cybersecurity case. Renders the same
// OffsecBiasView the modal uses, but at a real, shareable URL with its own
// title/description/OG. Gated with isOffsecEnabled: notFound off dev.

interface CaseProps {
  id: number;
  slug: string;
  name: string;
  content: OffsecBiasContent;
}

const CASE_COPY = {
  en: {
    back: 'All cybersecurity cases',
    seoTitle: (name: string) => `${name} in cybersecurity | UX Core`,
    keywords: (name: string) =>
      `${name}, social engineering, cognitive bias, security awareness`,
  },
  ru: {
    back: 'Все кейсы кибербезопасности',
    seoTitle: (name: string) => `${name} в кибербезопасности | UX Core`,
    keywords: (name: string) =>
      `${name}, социальная инженерия, когнитивные искажения, безопасность`,
  },
  hy: {
    back: 'Կիբեռանվտանգության բոլոր դեպքերը',
    seoTitle: (name: string) => `${name}՝ կիբեռանվտանգությունում | UX Core`,
    keywords: (name: string) =>
      `${name}, սոցիալական ինժեներիա, կոգնիտիվ հակումներ, անվտանգություն`,
  },
};

const CybersecurityCase: FC<CaseProps> = ({ id, slug, name, content }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const copy = CASE_COPY[locale] || CASE_COPY.en;

  const seoTitle = copy.seoTitle(name);
  const seoDescription = content.tell || content.scenario;

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          title: seoTitle,
          pageTitle: seoTitle,
          description: seoDescription,
          keywords: copy.keywords(name),
        }}
        ogTags={{
          ogTitle: seoTitle,
          ogStaticTitle: seoTitle,
          ogDescription: seoDescription,
          ogType: 'article',
          ogImageAlt: name,
          ogImage: {
            data: {
              attributes: { url: '', staticUrl: '/assets/ogImages/UXCore.png' },
            },
          },
        }}
        localizedSlug={{
          slugEn: `/uxcore/cybersecurity/${slug}`,
          slugRu: `/uxcore/cybersecurity/${slug}`,
        }}
        type={'TechArticle'}
        createdDate={'2026-08-20'}
      />
      <main className={styles.casePage}>
        <div className={styles.caseNav}>
          <Link href="/uxcore/cybersecurity" className={styles.backLink}>
            ← {copy.back}
          </Link>
          <Link href={`/uxcore/${id}-${slug}`} className={styles.biasLink}>
            {name} →
          </Link>
        </div>
        <h1 className={styles.caseTitle}>{name}</h1>
        <OffsecBiasView content={content} />
      </main>
    </>
  );
};

export default CybersecurityCase;

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  if (!isOffsecEnabled) return { paths: [], fallback: false };
  const paths = (locales || ['en']).flatMap(locale =>
    biases.map(b => ({ params: { slug: b.slug }, locale })),
  );
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  if (!isOffsecEnabled) return { notFound: true };

  const slug = String((params as { slug: string }).slug);
  const entry = biases.find(b => b.slug === slug);
  if (!entry) return { notFound: true };

  const content = getOffsecBiasContent(entry.id, locale);
  if (!content) return { notFound: true };

  // Localized bias name from Strapi; a failed fetch degrades to the English
  // name from the local list instead of failing the page.
  let name = entry.name;
  try {
    const strapiBiases = await getStrapiBiases();
    const localized = (strapiBiases?.[locale] || []).find(
      ({ attributes }: any) => Number(attributes?.number) === entry.id,
    );
    if (localized?.attributes?.title) name = localized.attributes.title;
  } catch {
    /* fall back to the English name */
  }

  return {
    props: { id: entry.id, slug: entry.slug, name, content },
    revalidate: 60,
  };
};
