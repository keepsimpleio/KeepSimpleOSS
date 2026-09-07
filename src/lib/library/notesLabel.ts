// The description field holds the owner's own words about an object, so every
// surface names it after them ("Wolf's notes") instead of the generic
// "Description". One helper so the editor, the overview and anything added
// later cannot word it differently.

/** "Wolf" gives "Wolf's"; a name already ending in s takes the bare apostrophe. */
export function possessive(name: string): string {
  return /s$/i.test(name) ? `${name}’` : `${name}’s`;
}

/**
 * Label for the notes field. Falls back to a plain "Notes" while the owner is
 * still loading, so the field never renders a dangling apostrophe.
 */
export function notesLabel(username?: string | null): string {
  const name = username?.trim();
  return name ? `${possessive(name)} notes` : 'Notes';
}
