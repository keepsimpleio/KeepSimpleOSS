import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';

import { getLlmsMeta } from '../src/api/llmsMeta';

dotenv.config({ path: path.join(process.cwd(), '.env'), override: true });
dotenv.config({ path: path.join(process.cwd(), '.env.local'), override: true });

const ROOT_DIR = process.cwd();
const PAGES_DIR = path.join(ROOT_DIR, 'src', 'pages');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DEFAULT_TITLE = 'KeepSimple';
const DEFAULT_DESCRIPTION = 'Practical resources and articles from KeepSimple.';

const STRAPI_BASE =
  process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI || '';

const seoDescriptions: Record<string, string> = {
  '/': 'KeepSimple home page.',
  '/articles': 'Browse all KeepSimple articles and categories.',
  '/contributors': 'Meet the KeepSimple contributors.',
  '/company-management': 'Explore company management resources.',
  '/auth': 'Authentication page for KeepSimple.',
};

const MODE_CONFIG: Record<string, any> = {
  curated: {
    outputFile: path.join(PUBLIC_DIR, 'keepsimple_', 'llms.txt'),
    slugLimit: 10,
    modeLabel: 'curated',
  },
  full: {
    outputFile: path.join(PUBLIC_DIR, 'keepsimple_', 'llms-full.txt'),
    slugLimit: Infinity,
    modeLabel: 'full',
  },
};

const appConfig = {
  mode: process.env.LLMS_MODE === 'full' ? 'full' : 'curated',
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const stripHtml = (value: any): string =>
  String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

function getJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    const req = client.request(url, { method: 'GET' }, res => {
      const status = res.statusCode ?? 0;
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (chunk: string) => {
        raw += chunk;
      });
      res.on('end', () => {
        if (status < 200 || status >= 300) {
          reject(new Error(`HTTP ${status} for ${url}`));
          return;
        }
        try {
          resolve(JSON.parse(raw));
        } catch (err) {
          reject(
            new Error(`Invalid JSON for ${url}: ${(err as Error).message}`),
          );
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function strapiGet(endpoint: string): Promise<any> {
  const url = `${STRAPI_BASE}/api/${endpoint}`;
  return getJson(url);
}

// ─────────────────────────────────────────────
// Site meta from /api/llms-meta
// ─────────────────────────────────────────────

async function fetchSiteMeta(): Promise<{
  title: string;
  description: string;
}> {
  // Try getLlmsMeta (uses fetch)
  try {
    const attrs = await getLlmsMeta();
    if (attrs?.title) {
      console.log('[meta] found llms-meta via getLlmsMeta');
      return {
        title: stripHtml(String(attrs?.title)),
        description: stripHtml(String(attrs?.description)),
      };
    }
  } catch (err) {
    console.log(`[meta] getLlmsMeta failed: ${(err as Error).message}`);
  }

  // Fallback: strapiGet with auth token (uses http/https)
  try {
    const data = await strapiGet('llms-meta');
    const attrs = data?.data?.attributes ?? data?.data ?? data ?? {};
    if (attrs?.title) {
      console.log('[meta] found llms-meta via strapiGet');
      return {
        title: stripHtml(String(attrs.title)),
        description: stripHtml(String(attrs?.description)),
      };
    }
  } catch (err) {
    console.log(`[meta] strapiGet failed: ${(err as Error).message}`);
  }

  console.log('[meta] using defaults');
  return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
}

// ─────────────────────────────────────────────
// Route scanning
// ─────────────────────────────────────────────

const formatPageName = (route: string): string => {
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

const toAbsoluteUrl = (baseUrl: string, route: string): string => {
  const normalizedBase = String(baseUrl || 'https://keepsimple.io').replace(
    /\/+$/,
    '',
  );
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  return `${normalizedBase}${normalizedRoute}`;
};

const shouldSkipEntry = (entryName: string): boolean =>
  entryName.startsWith('_');

const isRouteFile = (fileName: string): boolean =>
  /\.(tsx|ts|jsx|js)$/.test(fileName) &&
  !/^(404|500)\.(tsx|ts|jsx|js)$/.test(fileName);

const routeFromFilePath = (filePath: string): string | null => {
  const rel = path.relative(PAGES_DIR, filePath).replace(/\\/g, '/');
  const noExt = rel.replace(/\.(tsx|ts|jsx|js)$/, '');
  const segments = noExt.split('/').filter(Boolean);
  if (segments[0] === 'api') return null;
  if (segments.length === 0) return null;
  if (segments[segments.length - 1] === 'index') segments.pop();
  const route = `/${segments.join('/')}` || '/';
  return route === '' ? '/' : route;
};

const scanRoutes = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const routeSet = new Set<string>();

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

  return Array.from(routeSet).sort((a, b) => a.localeCompare(b));
};

// ─────────────────────────────────────────────
// Article expansion
// ─────────────────────────────────────────────

const getArticleRecords = async (): Promise<any[]> => {
  try {
    const data = await strapiGet(
      'articles?locale=en&pagination[pageSize]=1000&populate=*',
    );
    return data?.data || [];
  } catch (error: any) {
    console.log(
      `[strapi] failed to fetch articles: ${error?.message || error}`,
    );
    return [];
  }
};

const toArticleSlugRecord = (record: any) => {
  const attributes = record?.attributes || {};
  const newUrl = String(attributes?.newUrl || '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  if (!newUrl) return null;

  return {
    slug: newUrl,
    title: attributes?.title || newUrl,
    seoDescription: stripHtml(
      attributes?.seoDescription || attributes?.shortDescription,
    ),
  };
};

const applyDynamicExpansions = async ({ routes, modeConfig }: any) => {
  const records = (await getArticleRecords())
    .map(toArticleSlugRecord)
    .filter(Boolean);

  if (!records.length) {
    console.log('[expand] skipped all dynamic expansions (no article records)');
    return {
      routes,
      expandedArticleEntries: [],
    };
  }

  const limit = modeConfig.slugLimit;
  const articleEntries = records.slice(0, limit).map((record: any) => ({
    route: `/articles/${record.slug}`,
    title: record.title,
    seoDescription: record.seoDescription,
    slug: record.slug,
  }));

  const nextRoutes = routes.filter(
    (route: string) =>
      route !== '/articles/[slug]' && route !== '/articles/[page]',
  );

  articleEntries.forEach((item: any) => {
    nextRoutes.push(item.route);
    console.log(`[expand] found article slug ${item.route}`);
  });

  return {
    routes: Array.from(new Set<string>(nextRoutes)).sort((a, b) =>
      a.localeCompare(b),
    ),
    expandedArticleEntries: articleEntries,
  };
};

// ─────────────────────────────────────────────
// Build output
// ─────────────────────────────────────────────

const routeToDescription = (
  route: string,
  dynamicLookup: Record<string, string>,
): string => {
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
}: any): string => {
  const lines: string[] = [];
  lines.push(`# ${title}`);
  lines.push(`> ${description}`);
  lines.push('## Pages & Resources');

  routes.forEach((route: string) => {
    const name = formatPageName(route);
    const absoluteUrl = toAbsoluteUrl(baseUrl, route);
    const seoDescription = routeToDescription(route, dynamicLookup);
    lines.push(`- [${name}](${absoluteUrl}): ${seoDescription}`);
  });

  customEntries.forEach((entry: any) => {
    lines.push(
      `- [${entry.name}](${toAbsoluteUrl(baseUrl, entry.route)}): ${entry.description}`,
    );
  });

  return `${lines.join('\n')}\n`;
};

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

const run = async () => {
  const modeConfig = MODE_CONFIG[appConfig.mode];
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://keepsimple.io';

  if (!STRAPI_BASE) {
    console.log(
      '[config] STRAPI_URL / NEXT_PUBLIC_STRAPI is missing, dynamic and meta fetches may be skipped.',
    );
  }

  // Ensure NEXT_PUBLIC_STRAPI is set for getLlmsMeta
  process.env.NEXT_PUBLIC_STRAPI =
    process.env.NEXT_PUBLIC_STRAPI || STRAPI_BASE;

  console.log('[step 1] Fetching site meta...');
  const { title, description } = await fetchSiteMeta();
  console.log(`         title: "${title}"`);

  console.log('[step 2] Scanning src/pages...');
  const routes = await scanRoutes(PAGES_DIR);
  console.log(`[scan] discovered route count: ${routes.length}`);

  // Preserve placeholder routes if they are not in current pages shape.
  if (!routes.includes('/articles/[page]')) {
    routes.push('/articles/[slug]');
  }

  console.log('[step 3] Expanding dynamic routes...');
  const { routes: expandedRoutes, expandedArticleEntries } =
    await applyDynamicExpansions({ routes, modeConfig });

  const seeAllArticlesRoute = '/articles';
  if (!expandedRoutes.includes(seeAllArticlesRoute)) {
    expandedRoutes.push(seeAllArticlesRoute);
  }
  console.log('[expand] found See All Articles -> /articles');

  const dynamicLookup: Record<string, string> = {};
  expandedArticleEntries.forEach((entry: any) => {
    dynamicLookup[entry.route] = entry.seoDescription;
  });

  const content = buildContent({
    title,
    description,
    routes: expandedRoutes.sort((a: string, b: string) => a.localeCompare(b)),
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
  } catch (error: any) {
    console.log(`[write] skipped llms output: ${error?.message || error}`);
  }

  console.log(
    `\nSuccessfully mapped ${expandedRoutes.length} routes to ${modeConfig.outputFile}`,
  );
};

run().catch(error => {
  console.error(
    `[fatal] generator failed: ${(error as Error).message || error}`,
  );
  process.exit(1);
});
