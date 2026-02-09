export async function getEnvironment(locale: string) {
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/longevity-environment?populate[home][populate]=icon&populate[principles][populate]=icon&populate[data_tracking][populate]=icon&[populate]=image&populate[OGTags][populate]=ogImage&populate=Seo&locale=${currentLocale}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error('Failed to fetch environment');

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
