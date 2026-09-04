// Search matching for the library's own boxes (the toolbar's "Search
// everywhere" and the landing grid's library search).
//
// What people type is never what is stored: they double-tap the spacebar,
// hold shift on the first letter, paste a title with a curly apostrophe, or
// miss a key. A raw `haystack.includes(query)` fails all four, so the box
// reads as broken. The rules here:
//
//   - one shape for both sides: lowercased, accents folded, punctuation and
//     runs of whitespace reduced to single spaces;
//   - the query is a set of words, matched in any order, all of them required;
//   - a word that is not found verbatim still matches a near-identical word in
//     the text, with the tolerance growing by word length so short words stay
//     strict ("art" never becomes "arm").

// Accents fold to their base letter (Café → cafe) so a title typed without
// them still lands. Anything that is not a letter or a digit becomes a break:
// apostrophes, dashes, colons and the rest are noise on both sides.
export function normalizeSearchText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

// Words that carry no signal in a title or a name. Dropped from the query so
// "the art of war" still finds "Art of War", which the plain all-terms rule
// would have refused over one article nobody meant to be strict about. They
// survive when there is nothing else left, so searching for "the" alone still
// searches for it.
const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'de',
  'el',
  'for',
  'in',
  'la',
  'of',
  'on',
  'or',
  'the',
  'to',
]);

export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  const terms = normalized.split(' ');
  const meaningful = terms.filter(term => !STOPWORDS.has(term));
  return meaningful.length > 0 ? meaningful : terms;
}

// Damerau-Levenshtein, capped: it stops as soon as every cell of a row is over
// the tolerance, so a long title word is rejected in a few cells rather than a
// full matrix. Transposition counts as one edit because "teh" for "the" is the
// single most common typing slip.
function editDistanceWithin(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  if (a === b) return true;

  let prevPrev: number[] = [];
  let prev: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);

  for (let i = 1; i <= a.length; i += 1) {
    const row: number[] = new Array(b.length + 1);
    row[0] = i;
    let best = row[0];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(row[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1] &&
        prevPrev[j - 2] + 1 < value
      ) {
        value = prevPrev[j - 2] + 1;
      }
      row[j] = value;
      if (value < best) best = value;
    }
    if (best > max) return false;
    prevPrev = prev;
    prev = row;
  }

  return prev[b.length] <= max;
}

// Typo budget by word length. Three letters and under carry no budget at all:
// at that size one edit turns any word into a different one, and the box would
// answer with items nobody asked for.
function typoBudget(term: string): number {
  if (term.length <= 3) return 0;
  if (term.length <= 6) return 1;
  return 2;
}

// A term matches when the text contains it verbatim, or when some word in the
// text is within the typo budget. The word's opening run is tested too, so a
// half-typed word still finds the item while the letters are still arriving:
// "flowr" reaches "flowers" through its first five letters.
// Two neighbouring letters swapped, nothing else: "wya" for "way". Short words
// carry no edit budget, but a swap keeps every letter of the word the user
// meant, so it stays unambiguous where a substitution would not be.
function isTransposition(term: string, word: string): boolean {
  if (term.length !== word.length) return false;
  let first = -1;
  for (let i = 0; i < term.length; i += 1) {
    if (term[i] === word[i]) continue;
    if (first === -1) {
      first = i;
      continue;
    }
    return (
      i === first + 1 &&
      term[first] === word[i] &&
      term[i] === word[first] &&
      term.slice(i + 1) === word.slice(i + 1)
    );
  }
  return false;
}

function termMatches(words: string[], normalizedText: string, term: string) {
  if (normalizedText.includes(term)) return true;

  const budget = typoBudget(term);
  if (budget === 0) {
    return term.length === 3 && words.some(word => isTransposition(term, word));
  }

  return words.some(word => {
    if (editDistanceWithin(term, word, budget)) return true;
    const prefixLength = term.length + budget;
    return (
      word.length > prefixLength &&
      editDistanceWithin(term, word.slice(0, prefixLength), budget)
    );
  });
}

// Builds the searchable text of a record once: the caller passes the fields
// that people search by and gets back the shape `matchesSearchTerms` expects.
export function buildSearchHaystack(
  fields: (string | null | undefined)[],
): string {
  return normalizeSearchText(fields.filter(Boolean).join(' '));
}

// Every term must land somewhere in the text, in any order: "being way" finds
// "A Way of Being" the same as "way of being" does.
export function matchesSearchTerms(haystack: string, terms: string[]): boolean {
  if (terms.length === 0) return true;
  if (!haystack) return false;
  const words = haystack.split(' ');
  return terms.every(term => termMatches(words, haystack, term));
}
