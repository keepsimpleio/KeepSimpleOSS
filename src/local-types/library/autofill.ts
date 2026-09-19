// Normalized metadata shape every autofill provider (Google Books, iTunes
// Search, YouTube) and a shared member library are mapped into by the
// /api/library/autofill/* routes.
export interface IAutofillSuggestion {
  title: string;
  author?: string;
  /** ISO date (`2019-10-15`) or bare year (`2019`) — provider-dependent. */
  publicationDate?: string;
  description?: string;
  /** Remote cover/thumbnail URL — fetch through /api/library/autofill/cover. */
  coverUrl?: string;
  /** Same-edition cover used when the primary provider refuses the request. */
  fallbackCoverUrl?: string;
  sourceUrl?: string;
  /** Track length in whole seconds (iTunes only — books/videos omit it). */
  durationSeconds?: number;
  /**
   * Set when the record is a book on a public shelf of another member's
   * library, offered ahead of the providers. Such a record never carries the
   * owner's notes, rating or difficulty: those are the owner's own words.
   */
  memberLibrary?: { username: string; objectId: number };
}
