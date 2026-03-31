import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

const ROOT_DIR = process.cwd();
const PAGES_DIR = path.join(ROOT_DIR, 'src', 'pages');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DEFAULT_TITLE = 'KeepSimple';
const DEFAULT_DESCRIPTION = 'Practical resources and articles from KeepSimple.';

const seoDescriptions = {
  '/': 'KeepSimple home page.',
  '/articles': 'Browse all KeepSimple articles and categories.',
  '/contributors': 'Meet the KeepSimple contributors.',
  '/company-management': 'Explore company management resources.',
  '/auth': 'Authentication page for KeepSimple.',
};

const MODE_CONFIG = {
  curated: {
    outputFile: path.join(PUBLIC_DIR, 'keepsimple_', 'llms.txt'),
    slugLimit: 10,
    writeMarkdown: false,
    modeLabel: 'curated',
  },
  full: {
    outputFile: path.join(PUBLIC_DIR, 'keepsimple_', 'llms-full.txt'),
    slugLimit: Infinity,
    writeMarkdown: true,
    markdownRoot: path.join(
      PUBLIC_DIR,
      'keepsimple_',
      'llms-full-pages',
      'article',
    ),
    modeLabel: 'full',
  },
};

const appConfig = {
  mode: process.env.LLMS_MODE === 'full' ? 'full' : 'curated',
};

const stripHtml = value =>
  String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const formatPageName = route => {
  if (route === '/') return 'Home';
  const parts = route.split('/').filter(Boolean);
  if (parts.length === 0) return 'Home';
  const words = parts
    .join(' ')
    .replace(/\[.*?\]/g, 'Slug')
    .replace(/[-_]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return words.join(' ');
};

const toAbsoluteUrl = (baseUrl, route) => {
  const normalizedBase = String(baseUrl || 'https://keepsimple.io').replace(
    /\/+$/,
    '',
  );
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  return `${normalizedBase}${normalizedRoute}`;
};

const shouldSkipEntry = entryName => entryName.startsWith('_');

const isRouteFile = fileName =>
  /\.(tsx|ts|jsx|js)$/.test(fileName) &&
  !/^(404|500)\.(tsx|ts|jsx|js)$/.test(fileName);

const routeFromFilePath = filePath => {
  const rel = path.relative(PAGES_DIR, filePath).replace(/\\/g, '/');
  const noExt = rel.replace(/\.(tsx|ts|jsx|js)$/, '');
  const segments = noExt.split('/').filter(Boolean);
  if (segments[0] === 'api') return null;
  if (segments.length === 0) return null;
  if (segments[segments.length - 1] === 'index') segments.pop();
  const route = `/${segments.join('/')}` || '/';
  return route === '' ? '/' : route;
};

const scanRoutes = async dir => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const routeSet = new Set();

  for (const entry of entries) {
    if (shouldSkipEntry(entry.name)) {
      console.log(`[scan] skipped ${entry.name} (leading underscore)`);
      continue;
    }

    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'api') {
        console.log(`[scan] skipped ${entryPath} (api folder)`);
        continue;
      }
      const nested = await scanRoutes(entryPath);
      nested.forEach(route => routeSet.add(route));
      continue;
    }

    if (!isRouteFile(entry.name)) {
      console.log(`[scan] skipped ${entryPath} (not route file)`);
      continue;
    }

    const route = routeFromFilePath(entryPath);
    if (!route) {
      console.log(`[scan] skipped ${entryPath} (route normalization)`);
      continue;
    }

    routeSet.add(route);
    console.log(`[scan] found route ${route}`);
  }

  return [...routeSet].sort((a, b) => a.localeCompare(b));
};

const getLlmsMeta = async () => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/llms-meta`;
  return await fetch(url, {
    method: 'GET',
  })
    .then(data => data.json())
    .then(data => data?.data?.attributes);
};

const getArticleRecords = async () => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/articles?locale=en&pagination[pageSize]=1000&populate=*`;

  try {
    return await fetch(url)
      .then(resp => resp.json())
      .then(json => json?.data || []);
  } catch (error) {
    console.log(
      `[strapi] failed to fetch articles: ${error?.message || error}`,
    );
    return [];
  }
};

const toArticleSlugRecord = record => {
  const attributes = record?.attributes || {};
  const newUrl = String(attributes?.newUrl || '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
  const oldUrl = String(attributes?.url || '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .toLowerCase();

  if (!newUrl) return null;

  const type = String(attributes?.type || '').toLowerCase();
  const isUxCore =
    oldUrl.startsWith('uxcore/') ||
    oldUrl.startsWith('uxcg/') ||
    type.includes('uxcore') ||
    type.includes('uxcg') ||
    type.includes('thoughts');

  return {
    slug: newUrl,
    title: attributes?.title || newUrl,
    seoDescription: stripHtml(
      attributes?.seoDescription || attributes?.description,
    ),
    isUxCore,
  };
};

const applyDynamicExpansions = async ({ routes, modeConfig }) => {
  const records = (await getArticleRecords())
    .map(toArticleSlugRecord)
    .filter(Boolean);

  if (!records.length) {
    console.log('[expand] skipped all dynamic expansions (no article records)');
    return {
      routes,
      expandedArticleEntries: [],
      expandedUxCoreEntries: [],
    };
  }

  const limit = modeConfig.slugLimit;
  const articleEntries = records.slice(0, limit).map(record => ({
    route: `/articles/${record.slug}`,
    title: record.title,
    seoDescription: record.seoDescription,
    slug: record.slug,
  }));

  const uxCoreEntries = records
    .filter(record => record.isUxCore)
    .slice(0, limit)
    .map(record => ({
      route: `/uxcore/${record.slug}`,
      title: record.title,
      seoDescription: record.seoDescription,
      slug: record.slug,
    }));

  const nextRoutes = routes.filter(
    route =>
      route !== '/articles/[slug]' &&
      route !== '/articles/[page]' &&
      route !== '/uxcore/[slug]' &&
      route !== '/uxcore/[page]',
  );

  articleEntries.forEach(item => {
    nextRoutes.push(item.route);
    console.log(`[expand] found article slug ${item.route}`);
  });

  uxCoreEntries.forEach(item => {
    nextRoutes.push(item.route);
    console.log(`[expand] found uxcore slug ${item.route}`);
  });

  return {
    routes: [...new Set(nextRoutes)].sort((a, b) => a.localeCompare(b)),
    expandedArticleEntries: articleEntries,
    expandedUxCoreEntries: uxCoreEntries,
  };
};

const routeToDescription = (route, dynamicLookup) => {
  if (seoDescriptions[route]) return stripHtml(seoDescriptions[route]);
  if (dynamicLookup[route]) return stripHtml(dynamicLookup[route]);
  return 'No description available.';
};

const buildContent = ({
  title,
  description,
  routes,
  baseUrl,
  dynamicLookup,
  customEntries = [],
}) => {
  const lines = [];
  lines.push(`# ${title}`);
  lines.push(`> ${description}`);
  lines.push('## Pages & Resources');

  routes.forEach(route => {
    const name = formatPageName(route);
    const absoluteUrl = toAbsoluteUrl(baseUrl, route);
    const seoDescription = routeToDescription(route, dynamicLookup);
    lines.push(`- [${name}](${absoluteUrl}): ${seoDescription}`);
  });

  customEntries.forEach(entry => {
    lines.push(
      `- [${entry.name}](${toAbsoluteUrl(baseUrl, entry.route)}): ${entry.description}`,
    );
  });

  return `${lines.join('\n')}\n`;
};

const writeMarkdownPages = async ({
  entries,
  baseUrl,
  markdownRoot,
  sectionName,
}) => {
  if (!markdownRoot) return;

  await fs.mkdir(markdownRoot, { recursive: true });

  for (const entry of entries) {
    const filePath = path.join(markdownRoot, `${entry.slug}.md`);
    const body = [
      `# ${entry.title}`,
      `- URL: ${toAbsoluteUrl(baseUrl, entry.route)}`,
      `- Description: ${entry.seoDescription || 'No description available.'}`,
      '',
    ].join('\n');

    try {
      await fs.writeFile(filePath, body, 'utf8');
      console.log(`[markdown] found ${sectionName} page ${filePath}`);
    } catch (error) {
      console.log(
        `[markdown] skipped ${sectionName} ${entry.slug}: ${error?.message || error}`,
      );
    }
  }
};

const run = async () => {
  const modeConfig = MODE_CONFIG[appConfig.mode];
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://keepsimple.io';
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI;

  if (!strapiUrl) {
    console.log(
      '[config] NEXT_PUBLIC_STRAPI is missing, dynamic and meta fetches may be skipped.',
    );
  }

  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESCRIPTION;

  try {
    const meta = await getLlmsMeta();
    title = meta?.title || DEFAULT_TITLE;
    description = stripHtml(meta?.description || DEFAULT_DESCRIPTION);
    console.log('[meta] found llms-meta');
  } catch (error) {
    console.log(`[meta] skipped llms-meta: ${error?.message || error}`);
  }

  let routes = await scanRoutes(PAGES_DIR);
  console.log(`[scan] discovered route count: ${routes.length}`);

  // Preserve placeholder routes if they are not in current pages shape.
  if (!routes.includes('/articles/[page]')) {
    routes.push('/articles/[slug]');
  }
  if (!routes.includes('/uxcore/[slug]')) {
    routes.push('/uxcore/[slug]');
  }

  const {
    routes: expandedRoutes,
    expandedArticleEntries,
    expandedUxCoreEntries,
  } = await applyDynamicExpansions({ routes, modeConfig });

  const seeAllArticlesRoute = '/articles';
  if (!expandedRoutes.includes(seeAllArticlesRoute)) {
    expandedRoutes.push(seeAllArticlesRoute);
  }
  console.log('[expand] found See All Articles -> /articles');

  const dynamicLookup = {};
  [...expandedArticleEntries, ...expandedUxCoreEntries].forEach(entry => {
    dynamicLookup[entry.route] = entry.seoDescription;
  });

  const content = buildContent({
    title,
    description,
    routes: expandedRoutes.sort((a, b) => a.localeCompare(b)),
    baseUrl,
    dynamicLookup,
    customEntries: [
      {
        name: 'See All Articles',
        route: '/articles',
        description: stripHtml(
          seoDescriptions['/articles'] ||
            'Browse all KeepSimple articles and categories.',
        ),
      },
    ],
  });

  try {
    await fs.mkdir(path.dirname(modeConfig.outputFile), { recursive: true });
    await fs.writeFile(modeConfig.outputFile, content, 'utf8');
  } catch (error) {
    console.log(`[write] skipped llms output: ${error?.message || error}`);
  }

  if (modeConfig.writeMarkdown) {
    await writeMarkdownPages({
      entries: [...expandedArticleEntries, ...expandedUxCoreEntries],
      baseUrl,
      markdownRoot: modeConfig.markdownRoot,
      sectionName: 'article',
    });
  }

  console.log(
    `Successfully mapped ${expandedRoutes.length} routes to ${modeConfig.outputFile}`,
  );
};

run().catch(error => {
  console.log(`[fatal] generator failed: ${error?.message || error}`);
});
