import DOMPurify from 'isomorphic-dompurify';

import { descriptionToHtml } from '@lib/library/descriptionHtml';
import { htmlToPlainText } from '@lib/library/objectMeta';

// The notes field holds a small dialect of HTML: paragraph breaks and three
// inline marks (bold, italic, strikethrough). Everything that reaches the
// editor or leaves it passes through here, so a pasted page or a provider's
// markup can never smuggle anything else into the stored value.
const EDITOR_TAGS = ['p', 'br', 'strong', 'em', 's', 'b', 'i', 'strike', 'del'];

/**
 * The stored value as the editor shows it: sanitized down to the dialect,
 * typed newlines already promoted to <br /> by descriptionToHtml.
 */
export function toEditorHtml(value?: string | null): string {
  const html = descriptionToHtml(value);
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: EDITOR_TAGS,
    ALLOWED_ATTR: [],
  });
}

const escapeText = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/ /g, ' ');

const INLINE_TAG: Record<string, string> = {
  B: 'strong',
  STRONG: 'strong',
  I: 'em',
  EM: 'em',
  S: 's',
  STRIKE: 's',
  DEL: 's',
};

const BLOCK_TAGS = new Set([
  'DIV',
  'P',
  'LI',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
]);

function serializeChildren(node: Node): string {
  let out = '';
  node.childNodes.forEach(child => {
    out += serializeNode(child);
  });
  return out;
}

// Browsers wrap each line the user presses Enter on in a <div> (Chrome) or
// end it with a <br> (Firefox); both come out as one <br /> per line so the
// stored value reads the same wherever it was typed.
function serializeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeText(node.textContent ?? '');
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const el = node as HTMLElement;
  if (el.tagName === 'BR') return '<br />';
  const inline = INLINE_TAG[el.tagName];
  if (inline) {
    const inner = serializeChildren(el);
    return inner ? `<${inline}>${inner}</${inline}>` : '';
  }
  if (BLOCK_TAGS.has(el.tagName)) {
    const inner = serializeChildren(el);
    // A block holding only a <br> is an empty line the user left on purpose.
    return `${inner === '<br />' ? '' : inner}<br />`;
  }
  return serializeChildren(el);
}

/**
 * What the editor holds, as the value to store. Empty notes come back as an
 * empty string rather than a lone <br />, so "no notes" stays "no notes".
 */
export function serializeEditorHtml(root: HTMLElement): string {
  const html = serializeNode(root)
    // The last line needs no break after it, and Enter on an empty editor
    // must not pile breaks past the text.
    .replace(/(<br \/>)+$/g, '')
    .replace(/^(<br \/>)+/g, '');
  return richTextLength(html) === 0 ? '' : html;
}

/** Characters as the writer counts them: the text, not the tags. */
export function richTextLength(html?: string | null): number {
  return htmlToPlainText(html ?? '').length;
}
