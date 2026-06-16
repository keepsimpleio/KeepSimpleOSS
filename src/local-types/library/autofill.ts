// Normalized metadata shape every autofill provider (Google Books, iTunes
// Search, YouTube) is mapped into by the /api/library/autofill/* routes.
export interface IAutofillSuggestion {
  title: string;
  author?: string;
  /** ISO date (`2019-10-15`) or bare year (`2019`) — provider-dependent. */
  publicationDate?: string;
  description?: string;
  /** Remote cover/thumbnail URL — fetch through /api/library/autofill/cover. */
  coverUrl?: string;
  sourceUrl?: string;
  /** Track length in whole seconds (iTunes only — books/videos omit it). */
  durationSeconds?: number;
}
