import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';

import { getLlmsMeta } from '../src/api/llmsMeta';
import { DEFAULT_SEO } from '../src/constants/library/seo.config';
import { libraryPath } from '../src/lib/library/libraryPath';

dotenv.config({ path: path.join(process.cwd(), '.env'), override: true });
dotenv.config({ path: path.join(process.cwd(), '.env.local'), override: true });

const ROOT_DIR = process.cwd();
const PAGES_DIR = path.join(ROOT_DIR, 'src', 'pages');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DEFAULT_TITLE = 'KeepSimple';
const DEFAULT_DESCRIPTION = 'Practical resources and articles from KeepSimple.';

// The published file names live addresses, so it is read from the CMS that
// serves them. `.env` follows whichever environment the working tree is
// pointed at, and a run against staging writes staging's content under
// production URLs; LLMS_STRAPI_URL is set above the env file for that reason.
const STRAPI_BASE =
  process.env.LLMS_STRAPI_URL ||
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI ||
  '';

const seoDescriptions: Record<string, string> = {
  '/': 'KeepSimple home page.',
  '/articles': 'Browse all KeepSimple articles and categories.',
  '/contributors': 'Meet the KeepSimple contributors.',
  '/company-management': 'Explore company management resources.',
  '/auth': 'Authentication page for KeepSimple.',
  '/library': DEFAULT_SEO.description,
};

// public/ was flattened when UXCoreOSS was folded in. /llms.txt and
// /llms-full.txt are served from the root of public/; a file under
// public/keepsimple_/ is a second copy nothing reads.
const MODE_CONFIG: Record<string, any> = {
  curated: {
    outputFile: path.join(PUBLIC_DIR, 'llms.txt'),
    slugLimit: 10,
    modeLabel: 'curated',
  },
  full: {
    outputFile: path.join(PUBLIC_DIR, 'llms-full.txt'),
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
  !/^(404|500)\.(tsx|ts|jsx|js)$/.test(fileName) &&
  // A sitemap is written for a crawler, not offered to a reader:
  // library-sitemap.xml.ts is a page file that answers XML.
  !/\.xml\.(tsx|ts|jsx|js)$/.test(fileName);

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

/**
 * The libraries, offered to the machines that read llms.txt.
 *
 * A library is a page this script cannot see: `/library/[username]` is one
 * route file standing for every reader who opens one. The sitemap lists them
 * by asking Strapi, and so does this. The read is anonymous, which is what
 * keeps a private library out: the endpoint answers a stranger with the
 * public ones only.
 */
const fetchLibraryEntries = async (limit: number) => {
  if (!STRAPI_BASE) return [];

  try {
    const data = await strapiGet(
      'libraries?pagination[pageSize]=100&sort[0]=id:asc&populate[user]=true',
    );
    const rows = Array.isArray(data?.data) ? data.data : [];
    const entries = rows
      .map((row: any) => {
        const attributes = row?.attributes ?? row ?? {};
        const username = String(
          attributes?.user?.data?.attributes?.username ?? '',
        ).trim();

        if (!username) return null;

        // The site names Wolf's library after him; these lines say the same
        // thing the page's own title does.
        const isWolf = username.toLowerCase() === 'wolf';
        const owner = isWolf ? 'Wolf Alexanyan' : username;

        return {
          route: libraryPath(username),
          name: `${owner}'s Library`,
          description: `${owner}'s library on KeepSimple${isWolf ? ', collected since 2007' : ''}: the books, videos and talks worth keeping, each with the note that explains why.`,
        };
      })
      .filter(Boolean) as {
      route: string;
      name: string;
      description: string;
    }[];

    console.log(`[expand] found ${entries.length} public libraries`);

    return Number.isFinite(limit) ? entries.slice(0, limit) : entries;
  } catch (err) {
    console.log(`[expand] libraries skipped: ${(err as Error).message}`);
    return [];
  }
};

/**
 * What the last run published, read back.
 *
 * Parts of this file are older than this script and it cannot rebuild them:
 * the individual cognitive-bias and UXCG addresses were expanded by
 * UXCoreOSS's own generator before the two repos merged. Without this, a run
 * would quietly delete a hundred lines that still answer. Anything the run
 * can describe wins; the rest is carried forward as it stands.
 */
const readPublishedEntries = async (
  outputFile: string,
  baseUrl: string,
): Promise<Record<string, { name: string; description: string }>> => {
  const origin = String(baseUrl || 'https://keepsimple.io').replace(/\/+$/, '');
  const published: Record<string, { name: string; description: string }> = {};

  try {
    const raw = await fs.readFile(outputFile, 'utf8');

    for (const line of raw.split('\n')) {
      const match = line.match(/^- \[([^\]]*)\]\(([^)]+)\)(?::\s*(.*))?$/);

      if (!match) continue;

      const [, name, url, description] = match;

      if (!url.startsWith(origin)) continue;

      published[url.slice(origin.length) || '/'] = {
        name,
        description: (description || '').trim(),
      };
    }
  } catch (error: any) {
    console.log(`[carry] no previous output read: ${error?.message || error}`);
  }

  return published;
};

/**
 * The heading of the last published file.
 *
 * `llms-meta` answers a token holder; an anonymous run falls back to a
 * generic line, and writing that over the site's own positioning is a loss
 * no one would notice until a model quoted it.
 */
const readPublishedHeading = async (
  outputFile: string,
): Promise<{ title: string; description: string } | null> => {
  try {
    const lines = (await fs.readFile(outputFile, 'utf8')).split('\n');
    const title = lines
      .find(line => line.startsWith('# '))
      ?.slice(2)
      .trim();
    const description = lines
      .find(line => line.startsWith('> '))
      ?.slice(2)
      .trim();

    return title ? { title, description: description || '' } : null;
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────
// Build output
// ─────────────────────────────────────────────

const routeToDescription = (
  route: string,
  dynamicLookup: Record<string, string>,
  published: Record<string, { name: string; description: string }> = {},
): string => {
  if (seoDescriptions[route]) return stripHtml(seoDescriptions[route]);
  if (dynamicLookup[route]) return stripHtml(dynamicLookup[route]);
  if (published[route]?.description)
    return stripHtml(published[route].description);
  return 'No description available.';
};

const buildContent = ({
  title,
  description,
  routes,
  baseUrl,
  dynamicLookup,
  customEntries = [],
  published = {},
  nameLookup = {},
}: any): string => {
  const lines: string[] = [];
  lines.push(`# ${title}`);
  lines.push(`> ${description}`);
  lines.push('## Pages & Resources');

  routes.forEach((route: string) => {
    const name = nameLookup[route] || formatPageName(route);
    const absoluteUrl = toAbsoluteUrl(baseUrl, route);
    const seoDescription = routeToDescription(route, dynamicLookup, published);
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
  // llms.txt is published for machines that will visit the addresses it
  // names, so it always names the live site. NEXT_PUBLIC_DOMAIN follows
  // whichever env file the run picked up, and a dev domain committed here
  // sends every crawler to a preview host.
  const baseUrl = process.env.LLMS_BASE_URL || 'https://keepsimple.io';

  if (!STRAPI_BASE) {
    console.log(
      '[config] STRAPI_URL / NEXT_PUBLIC_STRAPI is missing, dynamic and meta fetches may be skipped.',
    );
  }

  // Ensure NEXT_PUBLIC_STRAPI is set for getLlmsMeta
  // getLlmsMeta reads NEXT_PUBLIC_STRAPI; it follows the same CMS the rest of
  // the run does, or the site title comes from one place and the pages from
  // another.
  process.env.NEXT_PUBLIC_STRAPI =
    STRAPI_BASE || process.env.NEXT_PUBLIC_STRAPI;

  console.log('[step 1] Fetching site meta...');
  const fetched = await fetchSiteMeta();
  const publishedHeading =
    fetched.title === DEFAULT_TITLE
      ? await readPublishedHeading(modeConfig.outputFile)
      : null;

  if (publishedHeading) {
    console.log('[meta] kept the published heading over the default');
  }

  const { title, description } = publishedHeading ?? fetched;
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

  console.log('[step 4] Expanding libraries...');
  const libraryEntries = await fetchLibraryEntries(modeConfig.slugLimit);
  const nameLookup: Record<string, string> = {};
  libraryEntries.forEach(entry => {
    if (!expandedRoutes.includes(entry.route)) expandedRoutes.push(entry.route);
    dynamicLookup[entry.route] = entry.description;
    nameLookup[entry.route] = entry.name;
  });

  // `/library/[username]` is the route file behind every one of them; the
  // expanded addresses replace it.
  const withoutLibraryPlaceholder = expandedRoutes.filter(
    (route: string) => !route.startsWith('/library/['),
  );

  const published = await readPublishedEntries(modeConfig.outputFile, baseUrl);
  // Articles and libraries are rebuilt from Strapi on every run and obey the
  // mode's cap; carrying an older selection forward would grow the file
  // without end. What is carried is only what this run has no source for.
  const carried = Object.entries(published)
    .filter(([route]) => !withoutLibraryPlaceholder.includes(route))
    .filter(
      ([route]) =>
        !route.startsWith('/library/') && !route.startsWith('/articles/'),
    )
    .map(([route, entry]) => ({ route, ...entry }));

  if (carried.length) {
    console.log(`[carry] kept ${carried.length} entries this run cannot build`);
  }

  const content = buildContent({
    title,
    description,
    routes: withoutLibraryPlaceholder.sort((a: string, b: string) =>
      a.localeCompare(b),
    ),
    baseUrl,
    dynamicLookup,
    published,
    nameLookup,
    customEntries: [
      ...carried,
      {
        name: 'See All Articles',
        route: '/articles',
        description: stripHtml(
          seoDescriptions['/articles'] ||
            'Browse all KeepSimple articles and categories.',
        ),
      },
      {
        name: 'See All Libraries',
        route: '/library',
        description: stripHtml(DEFAULT_SEO.description),
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
