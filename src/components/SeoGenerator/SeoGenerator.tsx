import type { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import type { TRouter } from '@local-types/global';

import { generateSchema } from '@lib/schema';

interface SeoGeneratorProps {
  questionsSeo?: any;
  strapiSEO?: any;
  userFavIcon?: string;
  localizedSlug?: any;
  modifiedDate?: string;
  createdDate?: string;
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

  const favIconPath = '/keepsimple_/assets/favicon.svg';

  // HYTranslation TODO
  // @ts-ignore
  const staticSeo =
    locale === 'hy' ? seoData['en'][pathname] : seoData[locale][pathname];

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
  const favIcon = `${process.env.NEXT_PUBLIC_DOMAIN}${favIconPath}`;
  const pageUrl = `${process.env.NEXT_PUBLIC_DOMAIN}${router.asPath}`;
  const schema = generateSchema(
    title,
    stripHTML(description),
    pageUrl,
    favIcon,
    createdDate,
    modifiedDate,
  );

  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=2"
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
      {/*Testing canonical links on Staging*/}
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
      <meta name="description" content={stripHTML(description)} />
      <meta name="keywords" content={keywords} />
      {/* GOOGLE */}
      <meta itemProp="name" content={pageTitle} />
      <meta itemProp="description" content={stripHTML(description)} />
      <meta
        itemProp="image"
        content="https://keepsimple.io/assets/keep-simple.jpg"
      />

      <meta
        property="og:title"
        content={ogTags?.ogTitle ? ogTags.ogTitle : ogTags?.ogStaticTitle}
      />
      <meta property="og:description" content={ogTags?.ogDescription} />
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
      <meta name="twitter:description" content={ogTags?.ogDescription} />
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
  );
};

export default SeoGenerator;
