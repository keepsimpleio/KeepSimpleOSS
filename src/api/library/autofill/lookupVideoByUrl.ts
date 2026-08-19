import type { IAutofillSuggestion } from '@local-types/library/autofill';

export type VideoLookupResult =
  | { status: 'ok'; suggestion: IAutofillSuggestion }
  | { status: 'unsupported' }
  | { status: 'error' };

export const lookupVideoByUrl = async (
  url: string,
): Promise<VideoLookupResult> => {
  try {
    const res = await fetch(
      `/api/library/autofill/video?url=${encodeURIComponent(url)}`,
    );
    if (res.status === 422) return { status: 'unsupported' };
    if (!res.ok) return { status: 'error' };
    const body = (await res.json()) as { suggestion?: IAutofillSuggestion };
    return body.suggestion
      ? { status: 'ok', suggestion: body.suggestion }
      : { status: 'error' };
  } catch {
    return { status: 'error' };
  }
};
