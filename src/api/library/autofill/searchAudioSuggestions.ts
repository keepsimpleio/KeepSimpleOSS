import type { IAutofillSuggestion } from '@local-types/library/autofill';

export const searchAudioSuggestions = async (
  query: string,
): Promise<IAutofillSuggestion[]> => {
  const res = await fetch(
    `/api/library/autofill/audio?q=${encodeURIComponent(query)}`,
  );
  // Throw on failure so the caller can show "search unavailable" instead of a
  // misleading "no matches" when the upstream provider is down.
  if (!res.ok) throw new Error('audio_search_failed');
  const body = (await res.json()) as { suggestions?: IAutofillSuggestion[] };
  return body.suggestions ?? [];
};
