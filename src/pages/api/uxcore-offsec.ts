import { biases } from '@uxcore/data/biasList/biases';
import { getOffsecBiasContent } from '@uxcore/data/biasOffsec';
import { isOffsecEnabled } from '@uxcore/lib/offsec';
import type { NextApiRequest, NextApiResponse } from 'next';

// Public JSON API over the Offensive Cybersecurity use case. The case
// content lives in this repo (not Strapi), so this route is its single
// integration surface: one entry per UX Core bias, localized via ?lang.
// Follows the same gate as the UI: while the OffSec layer is dark for a
// build, the route is a 404, so nothing leaks ahead of launch.

const LOCALES = ['en', 'ru', 'hy'] as const;

const slugToName = (slug: string) => {
  const words = slug.split('-').join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const serializeCase = (
  id: number,
  slug: string,
  lang: (typeof LOCALES)[number],
) => {
  const content = getOffsecBiasContent(id, lang);
  if (!content) return null;
  return {
    id,
    slug,
    name: slugToName(slug),
    biasUrl: `https://keepsimple.io/uxcore/${id}-${slug}`,
    caseUrl: `https://keepsimple.io/uxcore/cybersecurity/${slug}`,
    lang,
    content,
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isOffsecEnabled) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const langParam = String(req.query.lang || 'en') as (typeof LOCALES)[number];
  const lang = LOCALES.includes(langParam) ? langParam : 'en';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400',
  );

  if (req.query.id !== undefined) {
    const id = Number(req.query.id);
    const entry = biases.find(b => b.id === id);
    const serialized = entry && serializeCase(entry.id, entry.slug, lang);
    if (!serialized) {
      res.status(404).json({ error: `No OffSec case for bias id ${id}` });
      return;
    }
    res.status(200).json(serialized);
    return;
  }

  const items = biases
    .map(b => serializeCase(b.id, b.slug, lang))
    .filter(Boolean);
  res.status(200).json({ total: items.length, lang, items });
}
