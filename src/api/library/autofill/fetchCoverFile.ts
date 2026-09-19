import { COVER_MAX_BYTES } from '@constants/library/cover';

import { autofillCoverUrl } from '@lib/library/autofillCoverUrl';

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/**
 * Pull a provider cover through the local proxy and wrap it as a File so it
 * rides the existing ImageDropzone → uploadFile flow. Best-effort: any
 * failure returns null and the rest of the autofill still applies.
 */
export const fetchCoverFile = async (
  coverUrl: string,
  baseName: string,
  fallbackCoverUrl?: string,
): Promise<File | null> => {
  try {
    const res = await fetch(autofillCoverUrl(coverUrl, fallbackCoverUrl));
    if (!res.ok) return null;
    const blob = await res.blob();
    const ext = EXT_BY_MIME[blob.type];
    if (!ext || blob.size === 0 || blob.size > COVER_MAX_BYTES) return null;

    const safeName =
      baseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'cover';
    return new File([blob], `${safeName}.${ext}`, { type: blob.type });
  } catch {
    return null;
  }
};
