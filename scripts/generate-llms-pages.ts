import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env'), override: true });
dotenv.config({ path: path.join(process.cwd(), '.env.local'), override: true });

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUTPUT_DIR = path.join(
  PUBLIC_DIR,
  'keepsimple_',
  'llms-full-pages',
  'article',
);
const SITE_BASE_URL = (
  process.env.NEXT_PUBLIC_DOMAIN || 'https://keepsimple.io'
).replace(/\/+$/, '');

const STRAPI_BASE =
  process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI || '';

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
// Fetch all articles with content
// ─────────────────────────────────────────────

async function fetchArticles(): Promise<any[]> {
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
}

// ─────────────────────────────────────────────
// Build markdown for a single article
// ─────────────────────────────────────────────

function buildArticleMarkdown(attributes: any, slug: string): string {
  const title = attributes?.title || slug;
  const description = stripHtml(
    attributes?.seoDescription || attributes?.shortDescription || '',
  );
  const url = `${SITE_BASE_URL}/articles/${slug}`;

  const lines: string[] = [];
  lines.push(`# ${title}`);
  lines.push(`- URL: ${url}`);
  if (description) {
    lines.push(`- Description: ${description}`);
  }
  lines.push('');
  return lines.join('\n');
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('=== generate-llms-pages.ts ===\n');

  if (!STRAPI_BASE) {
    console.error(
      '[error] STRAPI_URL or NEXT_PUBLIC_STRAPI must be set in .env',
    );
    process.exit(1);
  }

  console.log('[step 1] Fetching articles from Strapi...');
  const records = await fetchArticles();
  console.log(`         found ${records.length} articles\n`);

  if (!records.length) {
    console.log('[done] no articles to write');
    return;
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  let written = 0;
  let skipped = 0;

  console.log('[step 2] Writing markdown pages...\n');
  for (const record of records) {
    const attributes = record?.attributes || {};
    const slug = String(attributes?.newUrl || '')
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');

    if (!slug) {
      skipped++;
      continue;
    }

    const markdown = buildArticleMarkdown(attributes, slug);
    const filePath = path.join(OUTPUT_DIR, `${slug}.md`);

    try {
      await fs.writeFile(filePath, markdown, 'utf8');
      console.log(`  ✓ ${slug}`);
      written++;
    } catch (error: any) {
      console.log(`  ✗ ${slug}: ${error?.message || error}`);
      skipped++;
    }
  }

  console.log(`\nSuccessfully wrote ${written} article pages to ${OUTPUT_DIR}`);
  if (skipped > 0) {
    console.log(`Skipped ${skipped} articles (no slug or write error)`);
  }
}

main().catch(error => {
  console.error(
    `[fatal] generate-llms-pages failed: ${(error as Error).message || error}`,
  );
  process.exit(1);
});
