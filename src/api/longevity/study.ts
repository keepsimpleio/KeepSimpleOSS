export async function getStudy(locale: string) {
  const chosenLocale = locale === 'ru' ? 'ru' : 'en';
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/longevity-study?populate=*&locale=${chosenLocale}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error('Failed to fetch longevity study');

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
