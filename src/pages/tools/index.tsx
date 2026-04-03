import { GetStaticProps } from 'next';
import React, { FC, useEffect } from 'react';

import { TStaticProps } from '@local-types/data';

import useGlobals from '@hooks/useGlobals';

import { getTools } from '@api/tools';

import SeoGenerator from '@components/SeoGenerator';
import DevToolsEasterEgg from '@components/tools/DevToolsEasterEgg/DevToolsEasterEgg';
import ToolContainer from '@components/tools/ToolContainer';

import ToolsLayout from '@layouts/ToolsLayout';

export type ToolsPageProps = {
  tools?: any | null;
};
const ToolsPage: FC<ToolsPageProps> = ({ tools }) => {
  const [{ initUseGlobals, unmountUseGlobals }, { isDarkTheme }] = useGlobals();

  useEffect(() => {
    initUseGlobals(null);

    return () => {
      unmountUseGlobals();
    };
  }, []);

  const toolsList = tools?.tools_list?.data ?? tools?.tools_list ?? [];
  const sortedToolsList = [...toolsList].sort((a, b) => {
    const attrsA = a?.attributes ?? a;
    const attrsB = b?.attributes ?? b;
    const isInDevelopmentA = Boolean(attrsA?.isInDevelopment);
    const isInDevelopmentB = Boolean(attrsB?.isInDevelopment);
    if (isInDevelopmentA === isInDevelopmentB) return 0;
    // Ready tools first; in-development tools last
    return isInDevelopmentA ? 1 : -1;
  });
  function stripHTML(input: string): string {
    return input?.replace(/<[^>]*>/g, '') ?? '';
  }
  const seoContent = tools?.Seo;

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          description: seoContent?.seoDescription,
          title: seoContent?.pageTitle,
          keywords: seoContent?.keywords,
          seoTitle: seoContent?.seoTitle,
        }}
        type={'WebPage'}
        ogTags={{
          ogDescription: tools?.ogDescription,
          ogTitle: tools?.ogTitle,
          ogType: tools?.ogType,
        }}
        createdDate={tools?.publishedAt}
        modifiedDate={tools?.updatedAt}
      />
      <DevToolsEasterEgg />
      <ToolsLayout isDarkTheme={isDarkTheme}>
        {sortedToolsList.map((tool: any) => {
          const attrs = tool?.attributes ?? tool;
          const title = attrs?.title;
          const description = stripHTML(attrs?.description);

          return (
            <ToolContainer
              key={tool?.id ?? title}
              id={Number(attrs?.idForDev)}
              link={attrs?.link}
              title={title}
              description={description}
              poweredBy={attrs?.poweredBy}
              isBlank={tool?.id === 5 || tool?.id === 6}
              isInDevelopment={attrs?.isInDevelopment ?? false}
            />
          );
        })}
      </ToolsLayout>
    </>
  );
};

export default ToolsPage;

export const getStaticProps: GetStaticProps = async ({
  locale,
}: TStaticProps) => {
  const tools = await getTools(locale);
  return {
    props: {
      locale,
      tools: tools,
    },
    revalidate: 10,
  };
};
