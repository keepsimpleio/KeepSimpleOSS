const oldSlugs = [
  'table-of-contents',
  'why-study-management',
  'what-is-a-project',
  'project-artifacts-and-their-importance',
  'project-management-environment',
  'philosophies-methodologies-and-frameworks',
  'software-development-life-cycles',
  'scrum-framework-artifacts-rituals-and-roles',
  'project-approval-and-further-workflow',
  'all-about-user-stories',
  'technical-components-of-the-project',
  'client-dev-company-workflow-birds-eye-view',
  'career-path-of-a-manager-and-a-few-universal-tips',
  'uxscience',
  'uxcgstory',
  'uxeducation',
  'overengineering_and_demo_readiness',
  'uxcgdiy',
  'uiux',
  'awareness-test',
];

export const getArticleRedirects = async (
  locale: string,
): Promise<Record<string, string>> => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/articles?locale=${locale}&pagination[pageSize]=100`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch Strapi articles (${response.status})`);
    }

    const json = await response.json();
    const articles = json?.data || [];

    const map: Record<string, string> = {};

    articles.forEach(article => {
      const { url: oldUrl, newUrl } = article.attributes || {};

      const oldSlug = oldUrl
        ?.replace(/^\/+/, '')
        .replace(/\/+$/, '')
        ?.toLowerCase();
      const newSlug = newUrl
        ?.replace(/^\/+/, '')
        .replace(/\/+$/, '')
        ?.toLowerCase();

      if (oldSlug && newSlug && oldSlugs.includes(oldSlug)) {
        map[oldSlug] = `articles/${newSlug}`;
      }
    });

    return map;
  } catch (err: any) {
    console.error('❌ Redirect error:', err.message || err);
    return {};
  }
};
