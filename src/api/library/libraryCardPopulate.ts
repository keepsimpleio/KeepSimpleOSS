// Populate the relations the home/sidebar library cards need: avatar (image),
// user (for the `/library/[username]` URL), and shelves + their objects (so the
// per-type counts reflect object totals, not shelf totals).
export const LIBRARY_CARD_POPULATE = {
  'populate[avatar]': true,
  'populate[user]': true,
  'populate[singleShelves][populate][objects]': true,
} as const;
