export async function getWhatIsThis(locale: string) {
  const base = `${process.env.NEXT_PUBLIC_STRAPI}/api/longevity-what-is-this`;

  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const url =
    `${base}` +
    `?locale=${currentLocale}` +
    `&populate[localizations]=*` +
    `&populate[basicStats]=*` +
    `&populate[OGTags][populate]=ogImage` +
    `&populate[Seo]=*`;

  const res = await fetch(url, {
    next: { revalidate: 3600, tags: ['contributor'] },
  });

  if (!res.ok) throw new Error('Failed to fetch contributor');

  const json = await res.json();
  const attrs = json?.data?.attributes ?? {};
  const locs = attrs?.localizations?.data ?? [];

  const byLocale: Record<string, unknown> = {};

  if (attrs.locale) {
    byLocale[attrs.locale] = attrs;
  }

  for (const loc of locs) {
    const a = loc?.attributes;
    if (a?.locale) {
      byLocale[a.locale] = a;
    }
  }

  return byLocale;
}
