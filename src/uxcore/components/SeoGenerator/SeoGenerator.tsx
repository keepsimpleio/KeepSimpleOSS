import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import type { FC } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import { generateSchema } from '@uxcore/lib/schema';

import hrSeoDescriptionEn from '@uxcore/data/seo/hrDescription-en';
import hrSeoDescriptionRu from '@uxcore/data/seo/hrDescription-ru';

interface SeoGeneratorProps {
  questionsSeo?: any;
  strapiSEO?: any;
  userFavIcon?: string;
  localizedSlug?: any;
  modifiedDate?: string;
  createdDate?: string;
  type?: string;
  ogTags?: {
    ogDescription: string;
    ogTitle: string;
    ogType: string;
    ogImageAlt?: string;
    ogStaticTitle?: string;
    ogImage?: {
      data: {
        attributes: {
          url: string;
          staticUrl?: string;
        };
      };
    };
  };
}

const SeoGenerator: FC<SeoGeneratorProps> = ({
  questionsSeo,
  strapiSEO = {},
  userFavIcon,
  ogTags,
  createdDate,
  modifiedDate,
  localizedSlug,
  type,
}) => {
  const router = useRouter();
  const hasStrapiSEO =
    !!strapiSEO.title ||
    !!strapiSEO.description ||
    !!strapiSEO.keywords ||
    !!strapiSEO.pageTitle;
  const seoData = { en: {}, ru: {} };

  if (questionsSeo) {
    seoData.en = {
      ...questionsSeo.en,
    };

    seoData.ru = {
      ...questionsSeo.ru,
    };
  }

  const hrKewords =
    'HR biases, cognitive biases in HR, science in HR, cognitive science in HR, human resources planning';

  const { locale, asPath } = router as TRouter;

  let pathname = asPath;
  const indexOfQuestionMark = asPath.indexOf('?');
  const indexHashTag = asPath.indexOf('#');

  if (indexOfQuestionMark !== -1) {
    pathname = asPath.slice(0, indexOfQuestionMark);
  }

  if (indexHashTag !== -1) {
    pathname = asPath.slice(0, indexHashTag);
  }

  const isBiasHrView = asPath.includes('#hr');
  const isUXCorePage = pathname.includes('/uxcore');
  const isUxgModalPage =
    pathname.includes('/uxcg/') &&
    !pathname.includes('/uxcgdiy') &&
    !pathname.includes('/uxcgstory');
  const isUXCGPage =
    pathname.includes('/uxcg') &&
    !pathname.includes('/uxcgdiy') &&
    !pathname.includes('/uxcgstory');
  const isUXCPPage = pathname.includes('/uxcp');
  const isUserProfile = pathname.includes('/user');
  const isUXCatPage = pathname.includes('/uxcat');
  let favIconPath = '/assets/favicon.svg';

  // HYTranslation TODO
  // @ts-ignore
  const staticSeo =
    locale === 'hy' ? seoData['en'][pathname] : seoData[locale][pathname];
  if (isUXCorePage) favIconPath = '/assets/uxcore-favicon.svg';
  if (isUXCGPage) favIconPath = '/assets/uxcg-favicon.jpg';
  if (isUXCPPage) favIconPath = '/assets/uxcp-favicon.jpg';
  if (isUserProfile)
    favIconPath = userFavIcon ? userFavIcon : '/assets/uxcat-favicon.svg';
  if (isUXCatPage) favIconPath = '/assets/uxcat-favicon.svg';
  if (pathname.includes('next') || (!staticSeo && !hasStrapiSEO))
    return (
      <Head>
        <meta
          name="robots"
          content={
            process.env.NEXT_PUBLIC_INDEXING === 'off'
              ? 'noindex, nofollow'
              : 'index, follow'
          }
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=2"
        />
        <title>keep-simple | Error Page</title>
        <meta name="description" content={'404 page - page not found'} />
        <meta name="keywords" content={'404 page - page not found'} />
      </Head>
    );
  let description: string;
  let keywords: string;
  let pageTitle: string;
  let title: string;

  function stripHTML(input: string): string {
    return input?.replace(/<[^>]*>/g, '') ?? '';
  }

  // @ts-ignore
  if (staticSeo) {
    ({ title, description, keywords, pageTitle } = staticSeo);
  }
  if (hasStrapiSEO) {
    ({ title, description, keywords, pageTitle } = strapiSEO);
  }
  // HYTranslation TODO
  const lang = locale === 'ru' ? 'ru' : 'en';
  if (isUxgModalPage && questionsSeo[lang][pathname]) {
    ({ title, description, keywords, pageTitle } =
      questionsSeo[lang][pathname]);
  }

  const hrDescriptions =
    locale === 'ru' ? hrSeoDescriptionRu : hrSeoDescriptionEn;
  const getRandomHrDescription = (array: string[], count: number) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const hrDescriptionRandom = getRandomHrDescription(hrDescriptions, 1);
  const alternateLink = asPath === '/' ? '' : asPath;
  const localePath = locale === 'en' ? '' : `/${locale}`;

  function cleanURL(url: string) {
    const exceptions = [
      '/uxcp?name=&biases=&isTeamMember=false',
      '#hr',
      '?search=',
    ];

    for (const exception of exceptions) {
      if (url.includes(exception)) {
        return url;
      }
    }

    const symbols = ['?', '&', '=', '#', ';'];
    let clean = url;

    for (const symbol of symbols) {
      if (clean.includes(symbol)) {
        clean = clean.split(symbol)[0];
      }
    }

    return clean;
  }

  const originalUrl =
    process.env.NEXT_PUBLIC_DOMAIN + localePath + cleanURL(alternateLink);
  const metaDescription = isBiasHrView
    ? hrDescriptionRandom[0]
    : stripHTML(description);
  const favIcon = `${process.env.NEXT_PUBLIC_DOMAIN}${favIconPath}`;
  const schema = generateSchema(
    title,
    metaDescription,
    originalUrl,
    favIcon,
    createdDate,
    modifiedDate,
    type,
  );

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=2"
        />
        <link
          rel="preload"
          href="/uxcore_/fonts/Lato/Lato-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="theme-color" content="#1e2023" />
        {pathname.includes('/user') ? (
          <meta name="robots" content={'noindex, nofollow'} />
        ) : (
          <meta
            name="robots"
            content={
              process.env.NEXT_PUBLIC_INDEXING === 'off'
                ? 'noindex, nofollow'
                : 'index, follow'
            }
          />
        )}

        <link rel="shortcut icon" href={favIconPath} />
        <title>{title}</title>
        {/*Testing canonical on Staging*/}
        {/*{process.env.NEXT_PUBLIC_DOMAIN === 'https://keepsimple.io' && (*/}
        <link rel="canonical" href={originalUrl} key={'canonical'} />
        {/*)}*/}
        <link
          rel="alternate"
          hrefLang="ru"
          href={`${process.env.NEXT_PUBLIC_DOMAIN}/ru${localizedSlug ? `${localizedSlug.slugRu}` : alternateLink}`}
        />
        <link
          rel="alternate"
          hrefLang="en"
          href={`${process.env.NEXT_PUBLIC_DOMAIN}${localizedSlug ? `${localizedSlug.slugEn}` : alternateLink}`}
        />
        <link
          rel="alternate"
          hrefLang="hy"
          href={`${process.env.NEXT_PUBLIC_DOMAIN}/hy${localizedSlug ? `${localizedSlug.slugEn}` : alternateLink}`}
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${process.env.NEXT_PUBLIC_DOMAIN}${localizedSlug ? `${localizedSlug.slugEn}` : alternateLink}`}
        />
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={isBiasHrView ? hrKewords : keywords} />
        {/* GOOGLE */}
        <meta itemProp="name" content={pageTitle} />
        <meta
          itemProp="image"
          content="https://keepsimple.io/assets/keep-simple.jpg"
        />

        <meta
          property="og:title"
          content={ogTags?.ogTitle ? ogTags.ogTitle : ogTags?.ogStaticTitle}
        />
        <meta
          property="og:description"
          content={
            isBiasHrView ? hrDescriptionRandom[0] : ogTags?.ogDescription
          }
        />
        <meta
          property="og:image"
          content={
            ogTags?.ogImage?.data?.attributes?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI}${ogTags?.ogImage?.data?.attributes?.url}`
              : ogTags?.ogImage?.data?.attributes?.staticUrl
          }
        />
        <meta
          property="og:image:alt"
          content={
            ogTags?.ogImageAlt
              ? ogTags?.ogImageAlt
              : ogTags?.ogTitle || ogTags?.ogStaticTitle
          }
        />
        <meta property="og:url" content={originalUrl} />
        <meta property="og:site_name" content="Keep Simple" />

        <meta property="og:type" content={ogTags?.ogType} />

        {/* AUTHRO */}

        <meta property="article:author" content="Wolf Alexanyan" />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@AlexanyanWolf" />
        <meta name="twitter:title" content={pageTitle} />
        <meta
          name="twitter:description"
          content={
            isBiasHrView ? hrDescriptionRandom[0] : ogTags?.ogDescription
          }
        />
        <meta
          name="twitter:image"
          content={
            ogTags?.ogImage?.data?.attributes?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI}${ogTags?.ogImage?.data?.attributes?.url}`
              : ogTags?.ogImage?.data?.attributes?.staticUrl
          }
        />
        <meta
          name="twitter:url"
          content={`https://keepsimple.io/${localePath}${alternateLink}`}
        />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="Wolf Alexanyan" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      <Script
        src="https://analytics.ahrefs.com/analytics.js"
        data-key={process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY}
        strategy="afterInteractive"
      />
      {process.env.NEXT_PUBLIC_TRACKING_URL && (
        <Script
          src={process.env.NEXT_PUBLIC_TRACKING_URL}
          strategy="afterInteractive"
        />
      )}
    </>
  );
};

export default SeoGenerator;
