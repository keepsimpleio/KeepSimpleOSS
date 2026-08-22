import { getStrapiBiases } from '@uxcore/api/biases';
import SeoGenerator from '@uxcore/components/SeoGenerator';
import { biases } from '@uxcore/data/biasList/biases';
import { getOffsecBiasContent } from '@uxcore/data/biasOffsec';
import { isOffsecEnabled } from '@uxcore/lib/offsec';
import type { TRouter } from '@uxcore/local-types/global';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';

import styles from './cybersecurity.module.scss';

// Crawlable hub for the Offensive Cybersecurity use case. UX Core's own
// #offsec view is a hash on the modal, invisible to crawlers and unshareable;
// this static route gives the layer a real URL, per-case deep links, and its
// own SEO/OG surface. Gated with the same flag as the UI: notFound off dev, so
// nothing indexes ahead of launch.

interface CaseLink {
  id: number;
  slug: string;
  name: string;
  tell: string;
}

interface HubProps {
  cases: Record<string, CaseLink[]>;
}

const COPY = {
  en: {
    heading: 'Offensive Cybersecurity',
    intro:
      'Every cognitive bias in UX Core, shown as a realistic social-engineering attack and its defense. The tell, the scenario, why it works, and what stops it.',
    seoTitle: 'Offensive Cybersecurity use cases | UX Core',
    seoDescription:
      'How attackers weaponize cognitive bias, one entry per bias: the tell, a realistic attack scenario, why it works, and the defender moves that stop it. Free and open, from UX Core.',
    keywords:
      'social engineering, cognitive bias attacks, phishing psychology, security awareness, offensive security, human factor security',
  },
  ru: {
    heading: 'Наступательная кибербезопасность',
    intro:
      'Каждое когнитивное искажение из UX Core как реалистичная атака социальной инженерии и защита от неё. Примета, сценарий, почему это работает и что это останавливает.',
    seoTitle: 'Наступательная кибербезопасность | UX Core',
    seoDescription:
      'Как атакующие используют когнитивные искажения, по одному примеру на искажение: примета, реалистичный сценарий атаки, почему это работает и как защититься. Бесплатно и открыто, от UX Core.',
    keywords:
      'социальная инженерия, атаки на когнитивные искажения, психология фишинга, осведомлённость о безопасности, наступательная безопасность',
  },
  hy: {
    heading: 'Կիբեռանվտանգություն',
    intro:
      'UX Core-ի յուրաքանչյուր կոգնիտիվ հակում՝ որպես սոցիալական ինժեներիայի իրատեսական հարձակում և դրանից պաշտպանություն։ Նշանը, սցենարը, ինչու է դա աշխատում և ինչն է այն կանգնեցնում։',
    seoTitle: 'Կիբեռանվտանգություն | UX Core',
    seoDescription:
      'Ինչպես են հարձակվողներն օգտագործում կոգնիտիվ հակումները. մեկ օրինակ յուրաքանչյուր հակման համար՝ նշանը, իրատեսական սցենարը, ինչու է դա աշխատում և ինչպես պաշտպանվել։ Անվճար և բաց, UX Core-ից։',
    keywords:
      'սոցիալական ինժեներիա, կոգնիտիվ հակումներ, ֆիշինգի հոգեբանություն, անվտանգության իրազեկություն',
  },
};

const CybersecurityHub: FC<HubProps> = ({ cases }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const copy = COPY[locale] || COPY.en;
  const list = cases[locale] || cases.en;

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          title: copy.seoTitle,
          pageTitle: copy.seoTitle,
          description: copy.seoDescription,
          keywords: copy.keywords,
        }}
        ogTags={{
          ogTitle: copy.seoTitle,
          ogStaticTitle: copy.seoTitle,
          ogDescription: copy.seoDescription,
          ogType: 'website',
          ogImageAlt: copy.heading,
          ogImage: {
            data: {
              attributes: { url: '', staticUrl: '/assets/ogImages/UXCore.png' },
            },
          },
        }}
        type={'CollectionPage'}
        createdDate={'2026-08-20'}
      />
      <main className={styles.hub}>
        <h1 className={styles.title}>{copy.heading}</h1>
        <p className={styles.intro}>{copy.intro}</p>
        <ul className={styles.list}>
          {list.map(c => (
            <li key={c.slug} className={styles.item}>
              <Link
                href={`/uxcore/cybersecurity/${c.slug}`}
                className={styles.link}
              >
                <span className={styles.name}>{c.name}</span>
                {c.tell && <span className={styles.tell}>{c.tell}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default CybersecurityHub;

export const getStaticProps: GetStaticProps = async () => {
  if (!isOffsecEnabled) return { notFound: true };

  // Localized bias names come from Strapi; a failed fetch degrades to the
  // English names from the local list instead of failing the page.
  const titles: Record<string, Map<number, string>> = {};
  try {
    const strapiBiases = await getStrapiBiases();
    for (const locale of ['en', 'ru', 'hy']) {
      titles[locale] = new Map(
        (strapiBiases?.[locale] || []).map(({ attributes }: any) => [
          Number(attributes?.number),
          String(attributes?.title || ''),
        ]),
      );
    }
  } catch {
    /* fall back to English names */
  }

  const build = (locale: 'en' | 'ru' | 'hy'): CaseLink[] =>
    [...biases]
      .sort((a, b) => a.id - b.id)
      .map(b => {
        const content = getOffsecBiasContent(b.id, locale);
        return content
          ? {
              id: b.id,
              slug: b.slug,
              name: titles[locale]?.get(b.id) || b.name,
              tell: content.tell || '',
            }
          : null;
      })
      .filter(Boolean) as CaseLink[];

  return {
    props: {
      cases: { en: build('en'), ru: build('ru'), hy: build('hy') },
    },
    revalidate: 60,
  };
};
