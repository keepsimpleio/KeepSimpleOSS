/**
 * A note, rendered on the server.
 *
 * The dialog renders notes through DOMPurify, which the page bundle carries
 * for the browser; the same call inside a server render reaches for `document`
 * and takes the whole page down with it. This is the same reading, built the
 * other way round: everything is escaped first, and then the handful of tags
 * the note dialect allows (`src/lib/library/richText.ts`) are let back through
 * one at a time. Nothing else can survive that, whatever the note holds, so an
 * owner cannot put a script on their own public page.
 */

// The note dialect, as `EDITOR_TAGS` in richText.ts has it, less the anchor,
// which is rebuilt below with its address checked. Kept equal to that list so
// the dialog and this page never read one note two ways.
const SIMPLE_TAGS = ['p', 'br', 'strong', 'em', 's', 'b', 'i', 'strike', 'del'];

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Only a web address, and only one a browser would follow to another page. */
const safeHref = (raw: string): string | null => {
  const href = raw.trim();

  if (!/^https?:\/\//i.test(href)) return null;

  try {
    return new URL(href).toString();
  } catch {
    return null;
  }
};

export function noteToSafeHtml(value?: string | null): string {
  const source = String(value ?? '').trim();

  if (!source) return '';

  const hadMarkup = /<\s*[a-z]/i.test(source);
  let html = escape(source);

  for (const tag of SIMPLE_TAGS) {
    html = html
      .replace(new RegExp(`&lt;${tag}&gt;`, 'gi'), `<${tag}>`)
      .replace(new RegExp(`&lt;${tag}\\s*/&gt;`, 'gi'), `<${tag} />`)
      .replace(new RegExp(`&lt;/${tag}&gt;`, 'gi'), `</${tag}>`);
  }

  let opened = 0;

  html = html.replace(
    /&lt;a\s+href=&quot;([^&]*)&quot;[^&]*&gt;/gi,
    (whole, href: string) => {
      const target = safeHref(href.replace(/&amp;/g, '&'));

      if (!target) return whole;

      opened += 1;

      return `<a href="${escape(target)}" target="_blank" rel="noopener noreferrer">`;
    },
  );

  // As many closings as there were openings, so a link this refused does not
  // leave a stray tag behind for the browser to guess at.
  html = html.replace(/&lt;\/a&gt;/gi, match => {
    if (opened === 0) return match;

    opened -= 1;

    return '</a>';
  });

  // A note typed as plain text carries its structure in the returns the owner
  // pressed, which HTML would otherwise swallow.
  return hadMarkup
    ? html
    : html
        .replace(/\r\n?/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\n/g, '<br />');
}
