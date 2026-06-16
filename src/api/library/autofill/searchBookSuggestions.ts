import type { IAutofillSuggestion } from '@local-types/library/autofill';

export const searchBookSuggestions = async (
  query: string,
): Promise<IAutofillSuggestion[]> => {
  const res = await fetch(
    `/api/library/autofill/book?q=${encodeURIComponent(query)}`,
  );
  // Throw on failure (e.g. 502 when Google's quota is exhausted) so the caller
  // can show "search unavailable" instead of a misleading "no matches".
  if (!res.ok) throw new Error('book_search_failed');
  const body = (await res.json()) as { suggestions?: IAutofillSuggestion[] };
  return body.suggestions ?? [];
};
