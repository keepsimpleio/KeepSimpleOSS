import { linkDescriptionUrls } from '@lib/library/descriptionLinks';
import { sanitizeHtml } from '@lib/sanitizeHtml';

// Descriptions arrive from two places with two different shapes: autofill hands
// back the provider's markup (Google Books ships <p>/<br>/<i>), while a person
// typing into the field produces plain text whose only structure is the line
// breaks they pressed. Rendering both through the same innerHTML meant the
// typed breaks vanished, since HTML collapses newlines.
const BLOCK_MARKUP = /<\s*(p|br|div|ul|ol|li|h[1-6]|blockquote|table)\b/i;

/**
 * Sanitized HTML for an object description, with typed line breaks preserved.
 * Markup that already carries its own block structure is left alone; plain
 * text has its newlines promoted to <br>, and runs of blank lines collapse to
 * one empty line so a paragraph gap stays a paragraph gap.
 */
export function descriptionToHtml(value?: string | null): string {
  const clean = linkDescriptionUrls(sanitizeHtml(value));
  if (!clean) return '';
  if (BLOCK_MARKUP.test(clean)) return clean;

  return clean
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n/g, '<br />');
}
