// Populate the relations the home/sidebar library cards need: avatar (image),
// user (for the `/library/[username]` URL), shelves + their objects (so the
// per-type counts reflect object totals, not shelf totals), and libraryDetails
// (the `aboutLibrary` component field shown as the card's "About" blurb —
// components aren't returned unless explicitly populated).
export const LIBRARY_CARD_POPULATE = {
  'populate[avatar]': true,
  'populate[user]': true,
  'populate[singleShelves][populate][objects]': true,
  'populate[libraryDetails]': true,
} as const;
