export async function getSleepSupplements(locale: string) {
  const chosenLocale = locale === 'ru' ? 'ru' : 'en';
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/longevity-sleep?locale=${chosenLocale}&populate[supplements][populate]=supplements`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) throw new Error('Failed to fetch sleep supplements');

  const json = await res.json();
  return json?.data?.attributes ?? null;
}
