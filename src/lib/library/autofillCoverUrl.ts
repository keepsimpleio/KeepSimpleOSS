export function autofillCoverUrl(coverUrl: string, fallbackCoverUrl?: string) {
  const params = new URLSearchParams({ url: coverUrl });
  if (fallbackCoverUrl) params.set('fallback', fallbackCoverUrl);
  return `/api/library/autofill/cover?${params.toString()}`;
}
